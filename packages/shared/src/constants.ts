export const GAME_CONSTANTS = {
  MAX_TEAM_SIZE: 6,
  MAX_BATTLE_ROUNDS: 30,
  BASE_CRIT_DAMAGE: 1.5,
  BASE_HIT_RATE: 1.0,
  DEFENSE_FACTOR: 600,
  DAMAGE_RANDOM_MIN: 0.95,
  DAMAGE_RANDOM_MAX: 1.05,
  MAX_WIN_STREAK_BONUS: 15,
  STAMINA_MAX: 200,
  STAMINA_RECOVER_INTERVAL: 360,
  OFFLINE_PRODUCTION_HOURS: 24,
  FREE_UPGRADE_SECONDS: 300,
  SESSION_EXPIRE_DAYS: 7,
} as const;

export const RARITY_NAMES: Record<number, string> = {
  1: 'N',
  2: 'R',
  3: 'SR',
  4: 'SSR',
  5: 'UR',
};

export const PROFESSION_NAMES: Record<number, string> = {
  1: '盾',
  2: '战',
  3: '法',
  4: '弓',
  5: '辅',
};

export const CAMP_NAMES: Record<number, string> = {
  1: '蜀',
  2: '魏',
  3: '吴',
  4: '群',
};

export const TIER_NAMES: Record<number, string> = {
  1: '青铜',
  2: '白银',
  3: '黄金',
  4: '铂金',
  5: '钻石',
  6: '大师',
  7: '王者',
};

export const TIER_ICONS: Record<number, string> = {
  1: '🥉',
  2: '🥈',
  3: '🥇',
  4: '💎',
  5: '💍',
  6: '👑',
  7: '🏆',
};

export const EQUIP_SLOT_NAMES: Record<number, string> = {
  1: '武器',
  2: '头盔',
  3: '铠甲',
  4: '鞋子',
  5: '饰品',
  6: '宝物',
};

export const BUILDING_NAMES: Record<string, string> = {
  mainHall: '主殿',
  farm: '农田',
  silverMine: '银库',
  barracks: '兵营',
  trainingGround: '校场',
  forge: '铁匠铺',
  warehouse: '仓库',
  wall: '城墙',
};

export const RESOURCE_NAMES: Record<string, string> = {
  gold: '金币',
  silver: '银币',
  food: '粮食',
  diamond: '钻石',
  stamina: '体力',
  exp: '经验',
};
