import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async getEquipmentList(userId: string, page = 1, pageSize = 20) {
    const where = { userId: BigInt(userId) };

    const [total, equipments] = await Promise.all([
      this.prisma.userEquipment.count({ where }),
      this.prisma.userEquipment.findMany({
        where,
        include: { equipment: true },
        orderBy: [{ level: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      list: equipments.map((e) => ({
        id: e.id.toString(),
        equipId: e.equipId,
        name: e.equipment.name,
        slot: e.equipment.slot,
        rarity: e.equipment.rarity,
        level: e.level,
        mainAttr: e.mainAttr,
        subAttrs: e.subAttrs,
        heroId: e.heroId?.toString(),
        isLocked: e.isLocked,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getEquipmentDetail(userId: string, equipId: string) {
    const equip = await this.prisma.userEquipment.findFirst({
      where: {
        id: BigInt(equipId),
        userId: BigInt(userId),
      },
      include: { equipment: true },
    });

    if (!equip) {
      throw new Error('装备不存在');
    }

    return {
      id: equip.id.toString(),
      equipId: equip.equipId,
      name: equip.equipment.name,
      slot: equip.equipment.slot,
      rarity: equip.equipment.rarity,
      level: equip.level,
      exp: equip.exp,
      mainAttr: equip.mainAttr,
      subAttrs: equip.subAttrs,
      heroId: equip.heroId?.toString(),
      isLocked: equip.isLocked,
      description: equip.equipment.description,
    };
  }

  async equipOnHero(userId: string, equipId: string, heroId: string) {
    const equip = await this.prisma.userEquipment.findFirst({
      where: { id: BigInt(equipId), userId: BigInt(userId) },
    });

    if (!equip) {
      throw new Error('装备不存在');
    }

    const hero = await this.prisma.userHero.findFirst({
      where: { id: BigInt(heroId), userId: BigInt(userId) },
    });

    if (!hero) {
      throw new Error('武将不存在');
    }

    await this.prisma.userEquipment.update({
      where: { id: BigInt(equipId) },
      data: { heroId: BigInt(heroId) },
    });

    return { success: true };
  }

  async unequipFromHero(userId: string, equipId: string) {
    const equip = await this.prisma.userEquipment.findFirst({
      where: { id: BigInt(equipId), userId: BigInt(userId) },
    });

    if (!equip) {
      throw new Error('装备不存在');
    }

    await this.prisma.userEquipment.update({
      where: { id: BigInt(equipId) },
      data: { heroId: null },
    });

    return { success: true };
  }
}
