import type {
  Rarity,
  Profession,
  Camp,
  SkillType,
  SkillEffectType,
  TargetType,
  EquipSlot,
  BattleType,
  SeasonType,
  SeasonStatus,
  Tier,
  MailType,
  ResourceType,
  BuildingType,
} from './enums';

// ========== 属性相关 ==========

export interface HeroAttrs {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
  hitRate: number;
  dodgeRate: number;
  effectHit: number;
  effectResist: number;
  damageAdd: number;
  damageReduce: number;
}

export type AttrKey = keyof HeroAttrs;

// ========== 武将相关 ==========

export interface HeroConfig {
  id: number;
  name: string;
  rarity: Rarity;
  profession: Profession;
  camp: Camp;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  growthHp: number;
  growthAttack: number;
  growthDefense: number;
  growthSpeed: number;
  skillIds: number[];
  talentTree: TalentNode[];
  bonds: BondConfig[];
  description: string;
}

export interface TalentNode {
  id: number;
  name: string;
  desc: string;
  maxLevel: number;
  preId?: number;
  effects: AttrBonus[];
}

export interface AttrBonus {
  attr: AttrKey;
  value: number;
  isPercent: boolean;
}

export interface BondConfig {
  id: number;
  name: string;
  desc: string;
  heroIds: number[];
  effects: AttrBonus[];
}

export interface UserHero {
  id: string;
  userId: string;
  heroId: number;
  level: number;
  exp: number;
  star: number;
  quality: number;
  talentPoints: Record<number, number>;
  pos: number;
  equipmentIds: string[];
  runeIds: string[];
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== 技能相关 ==========

export interface SkillConfig {
  id: number;
  name: string;
  type: SkillType;
  quality: Rarity;
  description: string;
  effectType: SkillEffectType;
  effectValues: SkillEffectValue[];
  cooldown: number;
  targetType: TargetType;
  targetNum: number;
  triggerProb: number;
}

export interface SkillEffectValue {
  level: number;
  value: number;
  valueType: 'fix' | 'percent';
  extra?: Record<string, number>;
}

// ========== 装备相关 ==========

export interface EquipConfig {
  id: number;
  name: string;
  slot: EquipSlot;
  rarity: Rarity;
  quality: number;
  setId?: number;
  baseAttrs: AttrBonus[];
  growAttrs: AttrBonus[];
  mainAttrs: AttrBonus[];
  subAttrs: AttrBonus[];
  levelMax: number;
  description: string;
}

export interface UserEquip {
  id: string;
  userId: string;
  equipId: number;
  level: number;
  exp: number;
  mainAttr: AttrBonus;
  subAttrs: AttrBonus[];
  heroId?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== 战斗相关 ==========

export interface BattleUnit {
  id: string;
  heroId: number;
  pos: number;
  level: number;
  star: number;
  attrs: HeroAttrs;
  skills: BattleSkill[];
  buffs: BuffState[];
  debuffs: BuffState[];
  hp: number;
  maxHp: number;
  isAlive: boolean;
}

export interface BattleSkill {
  skillId: number;
  level: number;
  currentCd: number;
}

export interface BuffState {
  buffId: number;
  name: string;
  effectType: SkillEffectType;
  value: number;
  duration: number;
  fromUnitId: string;
}

export interface BattleReport {
  id: string;
  battleType: BattleType;
  attackerId: string;
  defenderId: string;
  winner: number;
  attackerPower: number;
  defenderPower: number;
  totalRounds: number;
  rounds: BattleRound[];
  attackerLineup: BattleUnit[];
  defenderLineup: BattleUnit[];
  createdAt: string;
}

export interface BattleRound {
  round: number;
  actions: BattleAction[];
  endEffects: BuffEffect[];
}

export interface BattleAction {
  actorId: string;
  actorSide: number;
  skillId: number;
  skillName: string;
  targets: TargetResult[];
  isCrit?: boolean;
}

export interface TargetResult {
  targetId: string;
  damage?: number;
  hpChange: number;
  isCrit?: boolean;
  isDodge?: boolean;
  effects?: BuffEffect[];
}

export interface BuffEffect {
  effectType: SkillEffectType;
  value: number;
  duration: number;
  fromSkill?: number;
}

// ========== 赛季排位相关 ==========

export interface Season {
  id: number;
  name: string;
  type: SeasonType;
  status: SeasonStatus;
  startAt: string;
  endAt: string;
  rewards: SeasonReward[];
  tierRules: TierRule[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeasonReward {
  tier: Tier;
  division?: number;
  minRank?: number;
  maxRank?: number;
  rewards: RewardItem[];
}

export interface TierRule {
  tier: Tier;
  division: number;
  minScore: number;
  maxScore: number;
  icon?: string;
}

export interface ArenaRank {
  id: string;
  seasonId: number;
  userId: string;
  rank: number;
  score: number;
  tier: Tier;
  division: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestRank: number;
  bestTier: Tier;
  lastBattleAt: string;
}

// ========== 城池相关 ==========

export interface UserCity {
  id: string;
  userId: string;
  mainHallLevel: number;
  buildings: Record<BuildingType, BuildingState>;
  defenders: string[];
  wallDefense: number;
  wallMaxDefense: number;
  lastCollectAt: string;
}

export interface BuildingState {
  level: number;
  isUpgrading: boolean;
  upgradeStartAt?: string;
  upgradeEndAt?: string;
}

export interface BuildingConfig {
  id: number;
  name: string;
  type: BuildingType;
  maxLevel: number;
  effects: BuildingLevelEffect[];
  upgradeCosts: BuildingLevelCost[];
  upgradeTimes: number[];
  description: string;
}

export interface BuildingLevelEffect {
  level: number;
  effects: AttrBonus[];
  output?: {
    type: ResourceType;
    perSecond: number;
  };
}

export interface BuildingLevelCost {
  level: number;
  costs: Record<ResourceType, number>;
}

// ========== 用户资源 ==========

export interface UserResources {
  id: string;
  userId: string;
  gold: number;
  silver: number;
  food: number;
  diamond: number;
  stamina: number;
  staminaUpdatedAt: string;
}

export interface RewardItem {
  type: ResourceType | 'hero' | 'equipment' | 'item';
  id?: number;
  count: number;
}

// ========== 邮件相关 ==========

export interface Mail {
  id: string;
  userId: string;
  type: MailType;
  title: string;
  content: string;
  attachments: RewardItem[];
  isRead: boolean;
  isClaimed: boolean;
  expiredAt: string;
  createdAt: string;
}

// ========== 通用响应 ==========

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PageQuery {
  page: number;
  pageSize: number;
}
