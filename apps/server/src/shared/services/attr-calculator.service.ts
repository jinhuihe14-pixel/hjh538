import { Injectable } from '@nestjs/common';
import type { HeroAttrs, AttrKey } from '@game/shared';
import { GAME_CONSTANTS } from '@game/shared';

interface AttrBonus {
  attr: string;
  value: number;
  isPercent: boolean;
}

@Injectable()
export class AttrCalculator {
  private readonly baseAttrs: HeroAttrs = {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    critRate: 0,
    critDamage: GAME_CONSTANTS.BASE_CRIT_DAMAGE,
    hitRate: GAME_CONSTANTS.BASE_HIT_RATE,
    dodgeRate: 0,
    effectHit: 0,
    effectResist: 0,
    damageAdd: 0,
    damageReduce: 0,
  };

  calcHeroAttrs(hero: any): HeroAttrs {
    const base = { ...this.baseAttrs };
    const config = hero.hero;

    base.hp = Number(config.baseHp);
    base.attack = Number(config.baseAttack);
    base.defense = Number(config.baseDefense);
    base.speed = Number(config.baseSpeed);

    this.applyLevelBonus(base, config, hero.level);
    this.applyStarBonus(base, config, hero.star);

    return base;
  }

  private applyLevelBonus(
    attrs: HeroAttrs,
    config: any,
    level: number,
  ) {
    attrs.hp += Number(config.growthHp) * (level - 1);
    attrs.attack += Number(config.growthAttack) * (level - 1);
    attrs.defense += Number(config.growthDefense) * (level - 1);
    attrs.speed += Number(config.growthSpeed) * (level - 1);
  }

  private applyStarBonus(
    attrs: HeroAttrs,
    config: any,
    star: number,
  ) {
    const starBonus = 1 + (star - 1) * 0.1;
    attrs.hp *= starBonus;
    attrs.attack *= starBonus;
    attrs.defense *= starBonus;
    attrs.speed *= starBonus;
  }

  applyAttrBonuses(attrs: HeroAttrs, bonuses: AttrBonus[]): HeroAttrs {
    const result = { ...attrs };
    const fixedBonuses: Partial<HeroAttrs> = {};
    const percentBonuses: Partial<HeroAttrs> = {};

    for (const bonus of bonuses) {
      const key = bonus.attr as AttrKey;
      if (bonus.isPercent) {
        percentBonuses[key] = (percentBonuses[key] || 0) + bonus.value;
      } else {
        fixedBonuses[key] = (fixedBonuses[key] || 0) + bonus.value;
      }
    }

    for (const key of Object.keys(result) as AttrKey[]) {
      if (fixedBonuses[key] !== undefined) {
        result[key] += fixedBonuses[key]!;
      }
      if (percentBonuses[key] !== undefined) {
        result[key] *= 1 + percentBonuses[key]!;
      }
    }

    return result;
  }

  calcPower(attrs: HeroAttrs): number {
    const weights: Record<AttrKey, number> = {
      hp: 0.5,
      attack: 2.0,
      defense: 1.5,
      speed: 1.0,
      critRate: 100,
      critDamage: 50,
      hitRate: 0,
      dodgeRate: 80,
      effectHit: 60,
      effectResist: 60,
      damageAdd: 80,
      damageReduce: 80,
    };

    let power = 0;
    for (const key of Object.keys(attrs) as AttrKey[]) {
      power += attrs[key] * (weights[key] || 0);
    }

    return Math.floor(power);
  }

  calcDamage(
    attacker: HeroAttrs,
    defender: HeroAttrs,
    baseDamage: number,
    isCrit: boolean,
  ): number {
    let damage = attacker.attack * baseDamage * (1 + attacker.damageAdd);

    const defenseReduce = defender.defense / (defender.defense + GAME_CONSTANTS.DEFENSE_FACTOR);
    damage *= 1 - defenseReduce;

    damage *= 1 - defender.damageReduce;

    if (isCrit) {
      damage *= attacker.critDamage;
    }

    const randomFactor =
      GAME_CONSTANTS.DAMAGE_RANDOM_MIN +
      Math.random() * (GAME_CONSTANTS.DAMAGE_RANDOM_MAX - GAME_CONSTANTS.DAMAGE_RANDOM_MIN);
    damage *= randomFactor;

    return Math.floor(Math.max(1, damage));
  }
}
