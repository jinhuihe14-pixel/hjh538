// 稀有度
export enum Rarity {
  N = 1,
  R = 2,
  SR = 3,
  SSR = 4,
  UR = 5,
}

// 职业
export enum Profession {
  TANK = 1,    // 盾
  WARRIOR = 2, // 战
  MAGE = 3,    // 法
  ARCHER = 4,  // 弓
  SUPPORT = 5, // 辅
}

// 阵营
export enum Camp {
  SHU = 1,  // 蜀
  WEI = 2,  // 魏
  WU = 3,   // 吴
  QUN = 4,  // 群
}

// 技能类型
export enum SkillType {
  NORMAL = 1,  // 普攻
  ACTIVE = 2,  // 主动
  PASSIVE = 3, // 被动
  AWAKEN = 4,  // 觉醒
}

// 技能效果类型
export enum SkillEffectType {
  PHYSICAL_DAMAGE = 1,  // 物理伤害
  MAGIC_DAMAGE = 2,     // 法术伤害
  TRUE_DAMAGE = 3,      // 真实伤害
  DOT = 4,              // 持续伤害
  HEAL = 5,             // 治疗
  HOT = 6,              // 持续治疗
  BUFF = 7,             // 增益
  DEBUFF = 8,           // 减益
  SHIELD = 9,           // 护盾
  CONTROL = 10,         // 控制
  REVIVE = 11,          // 复活
}

// 目标类型
export enum TargetType {
  SINGLE_ENEMY = 1,     // 单体敌人
  ALL_ENEMY = 2,        // 全体敌人
  RANDOM_ENEMY = 3,     // 随机敌人
  SINGLE_ALLY = 4,      // 单体友方
  ALL_ALLY = 5,         // 全体友方
  SELF = 6,             // 自身
  LOWEST_HP_ALLY = 7,   // 血量最低友方
  HIGHEST_ATK_ENEMY = 8,// 攻击最高敌人
}

// 装备部位
export enum EquipSlot {
  WEAPON = 1,   // 武器
  HELMET = 2,   // 头盔
  ARMOR = 3,    // 铠甲
  BOOTS = 4,    // 鞋子
  ACCESSORY = 5,// 饰品
  TREASURE = 6, // 宝物
}

// 战斗类型
export enum BattleType {
  PVE = 1,      // PVE副本
  PVP = 2,      // 普通PVP
  ARENA = 3,    // 排位赛
  LEAGUE = 4,   // 跨服联赛
  CITY_DEFEND = 5, // 城池防守
}

// 赛季类型
export enum SeasonType {
  NORMAL = 1,    // 常规赛季
  PLAYOFF = 2,   // 季后赛
  LEAGUE = 3,    // 跨服联赛
}

// 赛季状态
export enum SeasonStatus {
  NOT_STARTED = 0, // 未开始
  RUNNING = 1,     // 进行中
  SETTLING = 2,    // 结算中
  ENDED = 3,       // 已结束
}

// 段位
export enum Tier {
  BRONZE = 1,   // 青铜
  SILVER = 2,   // 白银
  GOLD = 3,     // 黄金
  PLATINUM = 4, // 铂金
  DIAMOND = 5,  // 钻石
  MASTER = 6,   // 大师
  KING = 7,     // 王者
}

// 邮件类型
export enum MailType {
  SYSTEM = 1,    // 系统邮件
  REWARD = 2,    // 奖励邮件
  BATTLE = 3,    // 战报邮件
  SOCIAL = 4,    // 社交邮件
}

// 配置类型
export enum ConfigType {
  HERO = 'hero',
  SKILL = 'skill',
  EQUIPMENT = 'equipment',
  BUILDING = 'building',
  SEASON = 'season',
  STAGE = 'stage',
  ACTIVITY = 'activity',
  CONSTANT = 'constant',
}

// 配置状态
export enum ConfigStatus {
  DRAFT = 0,    // 草稿
  TEST = 1,     // 测试
  GRAY = 2,     // 灰度
  OFFICIAL = 3, // 正式
}

// 资源类型
export enum ResourceType {
  GOLD = 'gold',       // 金币
  SILVER = 'silver',   // 银币
  FOOD = 'food',       // 粮食
  DIAMOND = 'diamond', // 钻石
  STAMINA = 'stamina', // 体力
  EXP = 'exp',         // 经验
}

// 建筑类型
export enum BuildingType {
  MAIN_HALL = 'mainHall',  // 主殿
  FARM = 'farm',           // 农田
  SILVER_MINE = 'silverMine', // 银库
  BARRACKS = 'barracks',   // 兵营
  TRAINING_GROUND = 'trainingGround', // 校场
  FORGE = 'forge',         // 铁匠铺
  WAREHOUSE = 'warehouse', // 仓库
  WALL = 'wall',           // 城墙
}

// 用户状态
export enum UserStatus {
  NORMAL = 0,
  BANNED = 1,
  FROZEN = 2,
}
