import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttrCalculator } from '../../shared/services/attr-calculator.service';
import { HeroService } from '../hero/hero.service';
import { GAME_CONSTANTS, BattleType } from '@game/shared';
import type {
  BattleUnit,
  BattleReport,
  BattleRound,
  BattleAction,
  TargetResult,
  HeroAttrs,
} from '@game/shared';

interface BattleState {
  attackerUnits: BattleUnit[];
  defenderUnits: BattleUnit[];
  rounds: BattleRound[];
  currentRound: number;
  winner: number;
}

@Injectable()
export class BattleService {
  constructor(
    private prisma: PrismaService,
    private attrCalculator: AttrCalculator,
    private heroService: HeroService,
  ) {}

  async startPvEBattle(
    userId: string,
    stageId: number,
  ): Promise<BattleReport> {
    const userHeroes = await this.getUserBattleHeroes(userId);
    const enemyHeroes = this.generateEnemyHeroes(stageId);

    const state = this.initBattle(userHeroes, enemyHeroes);
    this.runBattle(state);

    const report = this.buildReport(state, userId, stageId);
    await this.saveReport(report);

    return report;
  }

  async startPvPBattle(
    attackerId: string,
    defenderId: string,
  ): Promise<BattleReport> {
    const attackerHeroes = await this.getUserBattleHeroes(attackerId);
    const defenderHeroes = await this.getUserBattleHeroes(defenderId);

    const state = this.initBattle(attackerHeroes, defenderHeroes);
    this.runBattle(state);

    const report = this.buildPvPReport(state, attackerId, defenderId);
    await this.saveReport(report);

    return report;
  }

  private async getUserBattleHeroes(userId: string): Promise<BattleUnit[]> {
    const lineup = await this.prisma.userHero.findMany({
      where: {
        userId: BigInt(userId),
        pos: { gt: 0 },
      },
      include: { hero: true },
      orderBy: { pos: 'asc' },
    });

    return lineup.map((uh, index) => {
      const attrs = this.attrCalculator.calcHeroAttrs(uh as any);
      return {
        id: `a_${uh.id}`,
        heroId: uh.heroId,
        pos: index + 1,
        level: uh.level,
        star: uh.star,
        attrs,
        skills: [],
        buffs: [],
        debuffs: [],
        hp: attrs.hp,
        maxHp: attrs.hp,
        isAlive: true,
      };
    });
  }

  private generateEnemyHeroes(stageId: number): BattleUnit[] {
    const enemies: BattleUnit[] = [];
    const basePower = stageId * 1000;

    for (let i = 0; i < 5; i++) {
      const hp = 1000 + stageId * 200 + i * 100;
      const attack = 100 + stageId * 20 + i * 10;
      const defense = 50 + stageId * 10 + i * 5;
      const speed = 100 + i * 5;

      enemies.push({
        id: `e_${i}`,
        heroId: 1000 + stageId * 10 + i,
        pos: i + 1,
        level: stageId,
        star: 1,
        attrs: {
          hp,
          attack,
          defense,
          speed,
          critRate: 0.05,
          critDamage: 1.5,
          hitRate: 1,
          dodgeRate: 0,
          effectHit: 0,
          effectResist: 0,
          damageAdd: 0,
          damageReduce: 0,
        },
        skills: [],
        buffs: [],
        debuffs: [],
        hp,
        maxHp: hp,
        isAlive: true,
      });
    }

    return enemies;
  }

  private initBattle(
    attackers: BattleUnit[],
    defenders: BattleUnit[],
  ): BattleState {
    return {
      attackerUnits: attackers,
      defenderUnits: defenders,
      rounds: [],
      currentRound: 0,
      winner: 0,
    };
  }

  private runBattle(state: BattleState): void {
    for (let round = 1; round <= GAME_CONSTANTS.MAX_BATTLE_ROUNDS; round++) {
      state.currentRound = round;
      const roundData = this.executeRound(state);
      state.rounds.push(roundData);

      if (this.checkBattleEnd(state)) {
        break;
      }
    }

    if (state.winner === 0) {
      const attackerAlive = state.attackerUnits.filter((u) => u.isAlive).length;
      const defenderAlive = state.defenderUnits.filter((u) => u.isAlive).length;
      state.winner = attackerAlive >= defenderAlive ? 1 : 2;
    }
  }

  private executeRound(state: BattleState): BattleRound {
    const actions: BattleAction[] = [];
    const allUnits = [
      ...state.attackerUnits.map((u) => ({ ...u, side: 1 })),
      ...state.defenderUnits.map((u) => ({ ...u, side: 2 })),
    ].sort((a, b) => b.attrs.speed - a.attrs.speed);

    for (const unit of allUnits) {
      if (!unit.isAlive) continue;

      const action = this.executeAction(state, unit);
      if (action) {
        actions.push(action);
      }

      if (this.checkBattleEnd(state)) {
        break;
      }
    }

    const endEffects = this.processEndOfRound(state);

    return {
      round: state.currentRound,
      actions,
      endEffects,
    };
  }

  private executeAction(
    state: BattleState,
    unit: BattleUnit & { side: number },
  ): BattleAction | null {
    const enemies =
      unit.side === 1 ? state.defenderUnits : state.attackerUnits;
    const aliveEnemies = enemies.filter((e) => e.isAlive);

    if (aliveEnemies.length === 0) return null;

    const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

    const isCrit = Math.random() < unit.attrs.critRate;
    const damage = this.attrCalculator.calcDamage(
      unit.attrs,
      target.attrs,
      1,
      isCrit,
    );

    target.hp = Math.max(0, target.hp - damage);
    if (target.hp <= 0) {
      target.isAlive = false;
    }

    const targetResult: TargetResult = {
      targetId: target.id,
      damage,
      hpChange: -damage,
      isCrit,
    };

    return {
      actorId: unit.id,
      actorSide: unit.side,
      skillId: 0,
      skillName: '普通攻击',
      targets: [targetResult],
      isCrit,
    };
  }

  private processEndOfRound(state: BattleState) {
    return [];
  }

  private checkBattleEnd(state: BattleState): boolean {
    const attackerAlive = state.attackerUnits.some((u) => u.isAlive);
    const defenderAlive = state.defenderUnits.some((u) => u.isAlive);

    if (!attackerAlive) {
      state.winner = 2;
      return true;
    }
    if (!defenderAlive) {
      state.winner = 1;
      return true;
    }
    return false;
  }

  private buildReport(
    state: BattleState,
    userId: string,
    stageId: number,
  ): BattleReport {
    const attackerPower = state.attackerUnits.reduce(
      (sum, u) => sum + this.attrCalculator.calcPower(u.attrs),
      0,
    );
    const defenderPower = state.defenderUnits.reduce(
      (sum, u) => sum + this.attrCalculator.calcPower(u.attrs),
      0,
    );

    return {
      id: Date.now().toString(),
      battleType: BattleType.PVE,
      attackerId: userId,
      defenderId: `stage_${stageId}`,
      winner: state.winner,
      attackerPower,
      defenderPower,
      totalRounds: state.rounds.length,
      rounds: state.rounds,
      attackerLineup: state.attackerUnits,
      defenderLineup: state.defenderUnits,
      createdAt: new Date().toISOString(),
    };
  }

  private buildPvPReport(
    state: BattleState,
    attackerId: string,
    defenderId: string,
  ): BattleReport {
    const attackerPower = state.attackerUnits.reduce(
      (sum, u) => sum + this.attrCalculator.calcPower(u.attrs),
      0,
    );
    const defenderPower = state.defenderUnits.reduce(
      (sum, u) => sum + this.attrCalculator.calcPower(u.attrs),
      0,
    );

    return {
      id: Date.now().toString(),
      battleType: BattleType.PVP,
      attackerId,
      defenderId,
      winner: state.winner,
      attackerPower,
      defenderPower,
      totalRounds: state.rounds.length,
      rounds: state.rounds,
      attackerLineup: state.attackerUnits,
      defenderLineup: state.defenderUnits,
      createdAt: new Date().toISOString(),
    };
  }

  private async saveReport(report: BattleReport): Promise<void> {
    const roundsData = Buffer.from(JSON.stringify(report.rounds), 'utf-8');

    await this.prisma.battleReport.create({
      data: {
        battleType: report.battleType,
        attackerId: BigInt(report.attackerId),
        defenderId: BigInt(report.defenderId) || BigInt(0),
        winner: report.winner,
        attackerPower: report.attackerPower,
        defenderPower: report.defenderPower,
        totalRounds: report.totalRounds,
        roundsData,
        attackerLineup: report.attackerLineup as any,
        defenderLineup: report.defenderLineup as any,
      },
    });
  }

  async getReport(reportId: string): Promise<BattleReport | null> {
    const report = await this.prisma.battleReport.findUnique({
      where: { id: BigInt(reportId) },
    });

    if (!report) return null;

    const rounds = JSON.parse(report.roundsData.toString('utf-8'));

    return {
      id: report.id.toString(),
      battleType: report.battleType,
      attackerId: report.attackerId.toString(),
      defenderId: report.defenderId.toString(),
      winner: report.winner,
      attackerPower: report.attackerPower,
      defenderPower: report.defenderPower,
      totalRounds: report.totalRounds,
      rounds,
      attackerLineup: report.attackerLineup as any,
      defenderLineup: report.defenderLineup as any,
      createdAt: report.createdAt.toISOString(),
    };
  }

  async getReportList(
    userId: string,
    page = 1,
    pageSize = 20,
  ): Promise<{ list: BattleReport[]; total: number }> {
    const where = {
      OR: [
        { attackerId: BigInt(userId) },
        { defenderId: BigInt(userId) },
      ],
    };

    const [total, reports] = await Promise.all([
      this.prisma.battleReport.count({ where }),
      this.prisma.battleReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = reports.map((r) => ({
      id: r.id.toString(),
      battleType: r.battleType,
      attackerId: r.attackerId.toString(),
      defenderId: r.defenderId.toString(),
      winner: r.winner,
      attackerPower: r.attackerPower,
      defenderPower: r.defenderPower,
      totalRounds: r.totalRounds,
      rounds: [],
      attackerLineup: r.attackerLineup as any,
      defenderLineup: r.defenderLineup as any,
      createdAt: r.createdAt.toISOString(),
    }));

    return { list, total };
  }
}
