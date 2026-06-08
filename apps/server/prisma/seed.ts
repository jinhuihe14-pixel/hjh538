import { PrismaClient, Rarity, Profession, Camp, SkillType, SkillEffectType, TargetType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化配置数据...');

  // 清空旧数据
  await prisma.configSkill.deleteMany({});
  await prisma.configEquipment.deleteMany({});
  await prisma.configHero.deleteMany({});
  await prisma.configBuilding.deleteMany({});

  // 创建技能配置
  const skills = [
    {
      id: 1,
      name: '普通攻击',
      type: SkillType.NORMAL,
      quality: 1,
      description: '对单个敌人造成物理伤害',
      effectType: SkillEffectType.PHYSICAL_DAMAGE,
      effectValue: [{ level: 1, value: 1.0, valueType: 'percent' }],
      cooldown: 0,
      targetType: TargetType.SINGLE_ENEMY,
      targetNum: 1,
      triggerProb: 100,
    },
    {
      id: 2,
      name: '烈焰斩',
      type: SkillType.ACTIVE,
      quality: 3,
      description: '对单个敌人造成大量物理伤害',
      effectType: SkillEffectType.PHYSICAL_DAMAGE,
      effectValue: [{ level: 1, value: 2.5, valueType: 'percent' }],
      cooldown: 3,
      targetType: TargetType.SINGLE_ENEMY,
      targetNum: 1,
      triggerProb: 100,
    },
    {
      id: 3,
      name: '横扫千军',
      type: SkillType.ACTIVE,
      quality: 4,
      description: '对全体敌人造成物理伤害',
      effectType: SkillEffectType.PHYSICAL_DAMAGE,
      effectValue: [{ level: 1, value: 1.2, valueType: 'percent' }],
      cooldown: 4,
      targetType: TargetType.ALL_ENEMY,
      targetNum: 99,
      triggerProb: 100,
    },
    {
      id: 4,
      name: '治疗术',
      type: SkillType.ACTIVE,
      quality: 3,
      description: '恢复单个友方生命值',
      effectType: SkillEffectType.HEAL,
      effectValue: [{ level: 1, value: 1.5, valueType: 'percent' }],
      cooldown: 3,
      targetType: TargetType.LOWEST_HP_ALLY,
      targetNum: 1,
      triggerProb: 100,
    },
  ];

  for (const skill of skills) {
    await prisma.configSkill.create({ data: skill });
  }
  console.log(`创建了 ${skills.length} 个技能`);

  // 创建武将配置
  const heroes = [
    {
      id: 1001,
      name: '关羽',
      rarity: Rarity.SSR,
      profession: Profession.WARRIOR,
      camp: Camp.SHU,
      baseHp: 1200,
      baseAttack: 180,
      baseDefense: 80,
      baseSpeed: 100,
      growthHp: 120,
      growthAttack: 18,
      growthDefense: 8,
      growthSpeed: 2,
      skillIds: [1, 2],
      talentTree: [],
      bonds: [],
      description: '蜀汉五虎上将之首，忠义无双。',
    },
    {
      id: 1002,
      name: '张飞',
      rarity: Rarity.SR,
      profession: Profession.TANK,
      camp: Camp.SHU,
      baseHp: 1500,
      baseAttack: 120,
      baseDefense: 150,
      baseSpeed: 80,
      growthHp: 150,
      growthAttack: 12,
      growthDefense: 15,
      growthSpeed: 1,
      skillIds: [1],
      talentTree: [],
      bonds: [],
      description: '蜀汉五虎上将之一，勇猛过人。',
    },
    {
      id: 1003,
      name: '诸葛亮',
      rarity: Rarity.UR,
      profession: Profession.MAGE,
      camp: Camp.SHU,
      baseHp: 900,
      baseAttack: 220,
      baseDefense: 60,
      baseSpeed: 110,
      growthHp: 90,
      growthAttack: 22,
      growthDefense: 6,
      growthSpeed: 2.5,
      skillIds: [1, 3],
      talentTree: [],
      bonds: [],
      description: '蜀汉丞相，智谋无双。',
    },
    {
      id: 1004,
      name: '华佗',
      rarity: Rarity.SR,
      profession: Profession.SUPPORT,
      camp: Camp.QUN,
      baseHp: 800,
      baseAttack: 100,
      baseDefense: 50,
      baseSpeed: 120,
      growthHp: 80,
      growthAttack: 10,
      growthDefense: 5,
      growthSpeed: 3,
      skillIds: [1, 4],
      talentTree: [],
      bonds: [],
      description: '神医，妙手回春。',
    },
    {
      id: 1005,
      name: '曹操',
      rarity: Rarity.SSR,
      profession: Profession.WARRIOR,
      camp: Camp.WEI,
      baseHp: 1100,
      baseAttack: 200,
      baseDefense: 90,
      baseSpeed: 105,
      growthHp: 110,
      growthAttack: 20,
      growthDefense: 9,
      growthSpeed: 2.2,
      skillIds: [1, 2],
      talentTree: [],
      bonds: [],
      description: '魏武帝，一代枭雄。',
    },
    {
      id: 1006,
      name: '周瑜',
      rarity: Rarity.SSR,
      profession: Profession.ARCHER,
      camp: Camp.WU,
      baseHp: 950,
      baseAttack: 210,
      baseDefense: 70,
      baseSpeed: 115,
      growthHp: 95,
      growthAttack: 21,
      growthDefense: 7,
      growthSpeed: 2.8,
      skillIds: [1, 3],
      talentTree: [],
      bonds: [],
      description: '东吴大都督，雄姿英发。',
    },
  ];

  for (const hero of heroes) {
    await prisma.configHero.create({
      data: {
        ...hero,
        growthHp: hero.growthHp as any,
        growthAttack: hero.growthAttack as any,
        growthDefense: hero.growthDefense as any,
        growthSpeed: hero.growthSpeed as any,
        skillIds: hero.skillIds as any,
        talentTree: hero.talentTree as any,
        bonds: hero.bonds as any,
      },
    });
  }
  console.log(`创建了 ${heroes.length} 个武将`);

  // 创建建筑配置
  const buildings = [
    {
      id: 1,
      name: '主殿',
      type: 'mainHall',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '核心建筑，决定其他建筑等级上限',
    },
    {
      id: 2,
      name: '农田',
      type: 'farm',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '产出粮食资源',
    },
    {
      id: 3,
      name: '银库',
      type: 'silverMine',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '产出银币资源',
    },
    {
      id: 4,
      name: '兵营',
      type: 'barracks',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '提升守城部队战力',
    },
    {
      id: 5,
      name: '校场',
      type: 'trainingGround',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '提升武将经验获取速度',
    },
    {
      id: 6,
      name: '铁匠铺',
      type: 'forge',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '装备强化相关',
    },
    {
      id: 7,
      name: '仓库',
      type: 'warehouse',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '提升资源存储上限',
    },
    {
      id: 8,
      name: '城墙',
      type: 'wall',
      maxLevel: 30,
      effects: [],
      upgradeCosts: [],
      upgradeTimes: [],
      description: '提升城池防御',
    },
  ];

  for (const building of buildings) {
    await prisma.configBuilding.create({
      data: {
        ...building,
        effects: building.effects as any,
        upgradeCosts: building.upgradeCosts as any,
        upgradeTimes: building.upgradeTimes as any,
      },
    });
  }
  console.log(`创建了 ${buildings.length} 个建筑`);

  // 创建赛季
  const season = await prisma.season.create({
    data: {
      name: 'S1赛季',
      type: 1,
      status: 1,
      startAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      rewards: [],
      tierRules: [],
    },
  });
  console.log(`创建了赛季: ${season.name}`);

  console.log('数据初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
