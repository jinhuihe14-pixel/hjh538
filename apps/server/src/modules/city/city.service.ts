import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BuildingType, GAME_CONSTANTS } from '@game/shared';
import dayjs from 'dayjs';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getCity(userId: string) {
    const city = await this.prisma.userCity.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!city) {
      throw new Error('城池不存在');
    }

    const buildings = city.buildings as Record<string, any>;
    const production = this.calcProduction(buildings);
    const offlineProfit = this.calcOfflineProfit(
      buildings,
      city.lastCollectAt.toISOString(),
    );

    return {
      ...city,
      id: city.id.toString(),
      userId: city.userId.toString(),
      production,
      offlineProfit,
    };
  }

  async collectResources(userId: string) {
    const city = await this.prisma.userCity.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!city) {
      throw new Error('城池不存在');
    }

    const buildings = city.buildings as Record<string, any>;
    const profit = this.calcOfflineProfit(
      buildings,
      city.lastCollectAt.toISOString(),
    );

    const resources = await this.prisma.userResource.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (resources) {
      await this.prisma.userResource.update({
        where: { userId: BigInt(userId) },
        data: {
          silver: {
            increment: Math.floor(profit.silver),
          },
          food: {
            increment: Math.floor(profit.food),
          },
        },
      });
    }

    await this.prisma.userCity.update({
      where: { userId: BigInt(userId) },
      data: { lastCollectAt: new Date() },
    });

    return profit;
  }

  async upgradeBuilding(userId: string, buildingType: string) {
    const city = await this.prisma.userCity.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!city) {
      throw new Error('城池不存在');
    }

    const buildings = city.buildings as Record<string, any>;
    const building = buildings[buildingType];

    if (!building) {
      throw new Error('建筑不存在');
    }

    if (building.isUpgrading) {
      throw new Error('建筑正在升级中');
    }

    if (buildingType !== 'mainHall' && building.level >= city.mainHallLevel) {
      throw new Error('建筑等级不能超过主殿等级');
    }

    const level = building.level + 1;
    const upgradeTime = 60 * level;
    const cost = 1000 * level * level;

    const resources = await this.prisma.userResource.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!resources || resources.silver < cost) {
      throw new Error('银币不足');
    }

    await this.prisma.userResource.update({
      where: { userId: BigInt(userId) },
      data: { silver: { decrement: cost } },
    });

    buildings[buildingType] = {
      ...building,
      isUpgrading: true,
      upgradeStartAt: new Date().toISOString(),
      upgradeEndAt: dayjs().add(upgradeTime, 'second').toISOString(),
    };

    await this.prisma.userCity.update({
      where: { userId: BigInt(userId) },
      data: { buildings },
    });

    return { buildingType, level, upgradeTime, cost };
  }

  private calcProduction(buildings: Record<string, any>) {
    let silverPerSec = 0;
    let foodPerSec = 0;

    if (buildings.silverMine) {
      silverPerSec = buildings.silverMine.level * 2;
    }
    if (buildings.farm) {
      foodPerSec = buildings.farm.level * 2;
    }

    return {
      silverPerSec,
      foodPerSec,
    };
  }

  private calcOfflineProfit(
    buildings: Record<string, any>,
    lastCollectAt: string,
  ) {
    const production = this.calcProduction(buildings);
    const now = dayjs();
    const lastCollect = dayjs(lastCollectAt);
    let seconds = now.diff(lastCollect, 'second');

    const maxSeconds = GAME_CONSTANTS.OFFLINE_PRODUCTION_HOURS * 3600;
    seconds = Math.min(seconds, maxSeconds);

    return {
      silver: production.silverPerSec * seconds,
      food: production.foodPerSec * seconds,
      seconds,
    };
  }
}
