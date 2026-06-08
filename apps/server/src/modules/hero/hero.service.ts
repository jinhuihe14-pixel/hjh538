import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttrCalculator } from '../../shared/services/attr-calculator.service';
import type { HeroAttrs, UserHero } from '@game/shared';

@Injectable()
export class HeroService {
  constructor(
    private prisma: PrismaService,
    private attrCalculator: AttrCalculator,
  ) {}

  async getHeroList(userId: string) {
    const heroes = await this.prisma.userHero.findMany({
      where: { userId: BigInt(userId) },
      include: { hero: true },
      orderBy: [{ pos: 'desc' }, { star: 'desc' }, { level: 'desc' }],
    });

    return heroes.map((h) => ({
      id: h.id.toString(),
      heroId: h.heroId,
      name: h.hero.name,
      rarity: h.hero.rarity,
      profession: h.hero.profession,
      camp: h.hero.camp,
      level: h.level,
      star: h.star,
      quality: h.quality,
      pos: h.pos,
      isLocked: h.isLocked,
    }));
  }

  async getHeroDetail(userId: string, heroId: string) {
    const userHero = await this.prisma.userHero.findFirst({
      where: {
        id: BigInt(heroId),
        userId: BigInt(userId),
      },
      include: { hero: true },
    });

    if (!userHero) {
      throw new Error('武将不存在');
    }

    const attrs = this.attrCalculator.calcHeroAttrs(userHero as any);

    return {
      id: userHero.id.toString(),
      heroId: userHero.heroId,
      name: userHero.hero.name,
      rarity: userHero.hero.rarity,
      profession: userHero.hero.profession,
      camp: userHero.hero.camp,
      level: userHero.level,
      star: userHero.star,
      quality: userHero.quality,
      pos: userHero.pos,
      attrs,
      description: userHero.hero.description,
    };
  }

  async getLineup(userId: string) {
    const lineup = await this.prisma.userHero.findMany({
      where: {
        userId: BigInt(userId),
        pos: {
          gt: 0,
        },
      },
      include: { hero: true },
      orderBy: { pos: 'asc' },
    });

    return lineup.map((h) => ({
      id: h.id.toString(),
      heroId: h.heroId,
      name: h.hero.name,
      rarity: h.hero.rarity,
      profession: h.hero.profession,
      camp: h.hero.camp,
      level: h.level,
      star: h.star,
      pos: h.pos,
    }));
  }

  async setLineup(userId: string, heroIds: string[]) {
    if (heroIds.length > 6) {
      throw new Error('阵容最多6个武将');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userHero.updateMany({
        where: { userId: BigInt(userId), pos: { gt: 0 } },
        data: { pos: 0 },
      });

      for (let i = 0; i < heroIds.length; i++) {
        await tx.userHero.updateMany({
          where: {
            id: BigInt(heroIds[i]),
            userId: BigInt(userId),
          },
          data: { pos: i + 1 },
        });
      }
    });

    return this.getLineup(userId);
  }

  async calcTotalPower(userId: string): Promise<number> {
    const lineup = await this.getLineup(userId);
    let totalPower = 0;

    for (const hero of lineup) {
      const userHero = await this.prisma.userHero.findFirst({
        where: { id: BigInt(hero.id), userId: BigInt(userId) },
        include: { hero: true },
      });
      if (userHero) {
        const attrs = this.attrCalculator.calcHeroAttrs(userHero as any);
        totalPower += this.attrCalculator.calcPower(attrs);
      }
    }

    return totalPower;
  }

  async addHero(userId: string, heroId: number) {
    const hero = await this.prisma.configHero.findUnique({ where: { id: heroId } });
    if (!hero) {
      throw new Error('武将配置不存在');
    }

    const userHero = await this.prisma.userHero.create({
      data: {
        userId: BigInt(userId),
        heroId,
        level: 1,
        star: 1,
        quality: 0,
        talentPoints: {},
        equipmentIds: [],
        runeIds: [],
      },
    });

    return userHero;
  }
}
