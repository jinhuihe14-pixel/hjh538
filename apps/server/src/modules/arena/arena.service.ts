import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BattleService } from '../battle/battle.service';
import { Tier, GAME_CONSTANTS } from '@game/shared';

@Injectable()
export class ArenaService {
  constructor(
    private prisma: PrismaService,
    private battleService: BattleService,
  ) {}

  async getCurrentSeason() {
    const season = await this.prisma.season.findFirst({
      where: { status: 1, type: 1 },
      orderBy: { id: 'desc' },
    });
    return season;
  }

  async getRankInfo(userId: string, seasonId: number) {
    let rank = await this.prisma.arenaRank.findFirst({
      where: {
        userId: BigInt(userId),
        seasonId,
      },
    });

    if (!rank) {
      rank = await this.prisma.arenaRank.create({
        data: {
          userId: BigInt(userId),
          seasonId,
          score: 0,
          tier: Tier.BRONZE,
          division: 5,
          rank: 99999,
        },
      });
    }

    return {
      id: rank.id.toString(),
      userId: rank.userId.toString(),
      seasonId: rank.seasonId,
      rank: rank.rank,
      score: rank.score,
      tier: rank.tier,
      division: rank.division,
      wins: rank.wins,
      losses: rank.losses,
      winStreak: rank.winStreak,
      bestRank: rank.bestRank,
      bestTier: rank.bestTier,
    };
  }

  async getRankList(seasonId: number, page = 1, pageSize = 20) {
    const ranks = await this.prisma.arenaRank.findMany({
      where: { seasonId },
      orderBy: { score: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { nickname: true, avatar: true, level: true } } },
    });

    const total = await this.prisma.arenaRank.count({
      where: { seasonId },
    });

    return {
      list: ranks.map((r, index) => ({
        rank: (page - 1) * pageSize + index + 1,
        userId: r.userId.toString(),
        nickname: r.user.nickname,
        avatar: r.user.avatar,
        level: r.user.level,
        score: r.score,
        tier: r.tier,
        division: r.division,
      })),
      total,
      page,
      pageSize,
    };
  }

  async startBattle(userId: string) {
    const season = await this.getCurrentSeason();
    if (!season) {
      throw new Error('没有进行中的赛季');
    }

    const rankInfo = await this.getRankInfo(userId, season.id);

    const opponents = await this.findOpponents(userId, rankInfo.score);
    if (opponents.length === 0) {
      throw new Error('没有找到合适的对手');
    }

    const opponent = opponents[Math.floor(Math.random() * opponents.length)];

    const report = await this.battleService.startPvPBattle(
      userId,
      opponent.userId.toString(),
    );

    await this.updateRankAfterBattle(
      userId,
      opponent.userId.toString(),
      report.winner,
      season.id,
    );

    return report;
  }

  private async findOpponents(userId: string, score: number) {
    const minScore = Math.max(0, score - 100);
    const maxScore = score + 100;

    const opponents = await this.prisma.arenaRank.findMany({
      where: {
        userId: { not: BigInt(userId) },
        score: {
          gte: minScore,
          lte: maxScore,
        },
      },
      take: 10,
      orderBy: { score: 'desc' },
    });

    return opponents;
  }

  private async updateRankAfterBattle(
    attackerId: string,
    defenderId: string,
    winner: number,
    seasonId: number,
  ) {
    const attackerRank = await this.prisma.arenaRank.findFirst({
      where: { userId: BigInt(attackerId), seasonId },
    });
    const defenderRank = await this.prisma.arenaRank.findFirst({
      where: { userId: BigInt(defenderId), seasonId },
    });

    if (!attackerRank || !defenderRank) return;

    const attackerWin = winner === 1;
    const scoreChange = this.calcEloScore(
      attackerRank.score,
      defenderRank.score,
      attackerWin ? 1 : 0,
    );

    await this.prisma.arenaRank.update({
      where: { id: attackerRank.id },
      data: {
        score: { increment: scoreChange },
        wins: attackerWin ? { increment: 1 } : undefined,
        losses: attackerWin ? undefined : { increment: 1 },
        winStreak: attackerWin ? { increment: 1 } : 0,
      },
    });

    await this.prisma.arenaRank.update({
      where: { id: defenderRank.id },
      data: {
        score: { decrement: scoreChange },
        wins: attackerWin ? undefined : { increment: 1 },
        losses: attackerWin ? { increment: 1 } : undefined,
        winStreak: attackerWin ? 0 : { increment: 1 },
      },
    });
  }

  private calcEloScore(ra: number, rb: number, sa: number): number {
    const k = 32;
    const ea = 1 / (1 + Math.pow(10, (rb - ra) / 400));
    return Math.floor(k * (sa - ea));
  }
}
