# 数据库设计文档

## 一、数据库选型
- **主数据库**: MySQL 8.0 (InnoDB引擎)
- **缓存数据库**: Redis 7
- **字符集**: utf8mb4 (支持emoji)
- **排序规则**: utf8mb4_unicode_ci

---

## 二、核心数据表设计

### 2.1 用户表 (users)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | 用户ID | PK | 自增主键 |
| username | VARCHAR(64) | 用户名 | UNIQUE | 登录账号 |
| password | VARCHAR(128) | 密码 | - | bcrypt加密 |
| nickname | VARCHAR(64) | 昵称 | - | 游戏内显示名 |
| avatar | VARCHAR(255) | 头像 | - | 头像URL |
| level | INT UNSIGNED | 玩家等级 | - | 默认1 |
| exp | BIGINT UNSIGNED | 经验值 | - | |
| vip_level | TINYINT UNSIGNED | VIP等级 | - | 默认0 |
| status | TINYINT | 账号状态 | IDX | 0正常 1封禁 2冻结 |
| last_login_at | DATETIME | 最后登录时间 | - | |
| last_login_ip | VARCHAR(45) | 最后登录IP | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.2 用户资源表 (user_resources)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | UNIQUE | 外键 |
| gold | BIGINT UNSIGNED | 金币 | - | 基础货币 |
| silver | BIGINT UNSIGNED | 银币 | - | 常用货币 |
| food | BIGINT UNSIGNED | 粮食 | - | 城池消耗 |
| diamond | INT UNSIGNED | 钻石 | - | 充值货币 |
| stamina | SMALLINT UNSIGNED | 体力 | - | 挑战消耗 |
| stamina_updated_at | DATETIME | 体力更新时间 | - | 用于回复计算 |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.3 武将配置表 (config_heroes)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 武将ID | PK | 配置ID |
| name | VARCHAR(32) | 武将名 | - | |
| rarity | TINYINT UNSIGNED | 稀有度 | IDX | 1N 2R 3SR 4SSR 5UR |
| profession | TINYINT UNSIGNED | 职业 | - | 1盾 2战 3法 4弓 5辅 |
| camp | TINYINT UNSIGNED | 阵营 | - | 1蜀 2魏 3吴 4群 |
| base_hp | INT UNSIGNED | 基础生命 | - | |
| base_attack | INT UNSIGNED | 基础攻击 | - | |
| base_defense | INT UNSIGNED | 基础防御 | - | |
| base_speed | INT UNSIGNED | 基础速度 | - | |
| growth_hp | DECIMAL(10,4) | 生命成长 | - | 每级增加 |
| growth_attack | DECIMAL(10,4) | 攻击成长 | - | |
| growth_defense | DECIMAL(10,4) | 防御成长 | - | |
| growth_speed | DECIMAL(10,4) | 速度成长 | - | |
| skill_ids | JSON | 技能ID列表 | - | [skillId1, skillId2] |
| talent_tree | JSON | 天赋树 | - | 天赋配置 |
| bonds | JSON | 羁绊 | - | 羁绊配置 |
| description | VARCHAR(500) | 描述 | - | |
| version | INT UNSIGNED | 版本号 | - | 配置版本 |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.4 用户武将表 (user_heroes)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | IDX | |
| hero_id | INT UNSIGNED | 武将配置ID | IDX | |
| level | SMALLINT UNSIGNED | 等级 | - | 默认1 |
| exp | INT UNSIGNED | 经验 | - | |
| star | TINYINT UNSIGNED | 星级 | - | 升星/进阶 |
| quality | TINYINT UNSIGNED | 品质 | - | 突破次数 |
| talent_points | JSON | 天赋点 | - | 各天赋已点等级 |
| pos | TINYINT UNSIGNED | 阵容位置 | IDX | 0表示未上阵 |
| equipment_ids | JSON | 装备ID列表 | - | 6个装备槽位 |
| rune_ids | JSON | 符文ID列表 | - | 符文槽位 |
| is_locked | TINYINT | 是否锁定 | - | 0否 1是 |
| created_at | DATETIME | 获取时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.5 技能配置表 (config_skills)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 技能ID | PK | |
| name | VARCHAR(32) | 技能名 | - | |
| type | TINYINT UNSIGNED | 类型 | - | 1普攻 2主动 3被动 |
| quality | TINYINT UNSIGNED | 品质 | - | |
| description | VARCHAR(500) | 技能描述 | - | |
| effect_type | TINYINT UNSIGNED | 效果类型 | - | 伤害/治疗/增益/减益/控制 |
| effect_value | JSON | 效果数值 | - | 按等级配置 |
| cooldown | TINYINT UNSIGNED | 冷却回合 | - | |
| target_type | TINYINT UNSIGNED | 目标类型 | - | 单体/群体/随机/自身 |
| target_num | TINYINT UNSIGNED | 目标数量 | - | |
| trigger_prob | DECIMAL(5,2) | 触发概率 | - | 百分比 |
| version | INT UNSIGNED | 版本号 | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.6 装备配置表 (config_equipment)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 装备ID | PK | |
| name | VARCHAR(64) | 装备名 | - | |
| slot | TINYINT UNSIGNED | 部位 | IDX | 1武器 2头盔 3铠甲 4鞋子 5饰品 6宝物 |
| rarity | TINYINT UNSIGNED | 稀有度 | IDX | 1-5星 |
| quality | TINYINT UNSIGNED | 品质 | - | |
| set_id | INT UNSIGNED | 套装ID | IDX | 0表示无套装 |
| base_attrs | JSON | 基础属性 | - | {hp: 100, attack: 50} |
| grow_attrs | JSON | 成长属性 | - | 每级增加量 |
| main_attrs | JSON | 主属性 | - | 随机主属性池 |
| sub_attrs | JSON | 副属性 | - | 随机副属性池 |
| level_max | SMALLINT UNSIGNED | 最大等级 | - | |
| description | VARCHAR(500) | 描述 | - | |
| version | INT UNSIGNED | 版本号 | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.7 用户装备表 (user_equipment)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | IDX | |
| equip_id | INT UNSIGNED | 装备配置ID | IDX | |
| level | SMALLINT UNSIGNED | 等级 | - | 默认1 |
| exp | INT UNSIGNED | 经验 | - | |
| main_attr | JSON | 主属性 | - | {type: 'attack', value: 100} |
| sub_attrs | JSON | 副属性 | - | [{type:'hp', value:50}, ...] |
| hero_id | BIGINT UNSIGNED | 装备武将ID | IDX | 0表示未装备 |
| is_locked | TINYINT | 是否锁定 | - | |
| created_at | DATETIME | 获取时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.8 城池表 (user_cities)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | UNIQUE | |
| main_hall_level | TINYINT UNSIGNED | 主殿等级 | - | 决定其他建筑上限 |
| buildings | JSON | 建筑列表 | - | {farm: {level: 10}, ...} |
| defenders | JSON | 守军阵容 | - | 守城武将ID列表 |
| wall_defense | INT UNSIGNED | 城防值 | - | |
| wall_max_defense | INT UNSIGNED | 最大城防 | - | |
| last_collect_at | DATETIME | 上次收取时间 | - | 用于离线收益 |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.9 建筑配置表 (config_buildings)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 建筑ID | PK | |
| name | VARCHAR(32) | 建筑名 | - | |
| type | VARCHAR(32) | 类型 | IDX | 主殿/农田/银库/兵营/校场/铁匠铺/仓库 |
| max_level | TINYINT UNSIGNED | 最大等级 | - | |
| effects | JSON | 效果列表 | - | 每级效果配置 |
| upgrade_costs | JSON | 升级消耗 | - | 每级消耗资源 |
| upgrade_time | INT UNSIGNED | 升级时间(秒) | - | 每级所需时间 |
| description | VARCHAR(500) | 描述 | - | |
| version | INT UNSIGNED | 版本号 | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.10 排位赛表 (arena_ranks)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| season_id | INT UNSIGNED | 赛季ID | IDX | |
| user_id | BIGINT UNSIGNED | 用户ID | IDX | |
| rank | INT UNSIGNED | 排名 | IDX | |
| score | INT UNSIGNED | 积分 | - | |
| tier | TINYINT UNSIGNED | 大段位 | IDX | 1青铜...7王者 |
| division | TINYINT UNSIGNED | 小段位 | - | 5段/3段/0段 |
| wins | INT UNSIGNED | 胜场 | - | |
| losses | INT UNSIGNED | 负场 | - | |
| win_streak | TINYINT UNSIGNED | 连胜 | - | |
| best_rank | INT UNSIGNED | 最高排名 | - | |
| best_tier | TINYINT UNSIGNED | 最高大段 | - | |
| last_battle_at | DATETIME | 最后战斗时间 | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

**唯一索引**: `(season_id, user_id)`

### 2.11 赛季表 (seasons)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 赛季ID | PK | 自增 |
| name | VARCHAR(64) | 赛季名 | - | S1赛季 |
| type | TINYINT UNSIGNED | 赛季类型 | - | 1常规 2季后赛 3跨服联赛 |
| status | TINYINT UNSIGNED | 状态 | IDX | 0未开始 1进行中 2结算中 3已结束 |
| start_at | DATETIME | 开始时间 | IDX | |
| end_at | DATETIME | 结束时间 | IDX | |
| rewards | JSON | 赛季奖励 | - | 各段位奖励 |
| tier_rules | JSON | 段位规则 | - | 积分段位对照表 |
| is_archived | TINYINT | 是否已归档 | IDX | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.12 战报表 (battle_reports)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | 战报ID | PK | 自增 |
| battle_type | TINYINT UNSIGNED | 战斗类型 | IDX | 1PVE 2PVP 3排位 4联赛 |
| attacker_id | BIGINT UNSIGNED | 攻击方用户ID | IDX | |
| defender_id | BIGINT UNSIGNED | 防守方用户ID | IDX | |
| winner | TINYINT | 胜负 | - | 1攻方胜 2守方胜 0平 |
| attacker_power | INT UNSIGNED | 攻方战力 | - | |
| defender_power | INT UNSIGNED | 守方战力 | - | |
| total_rounds | TINYINT UNSIGNED | 总回合数 | - | |
| rounds_data | BLOB | 回合数据 | - | 压缩存储 |
| attacker_lineup | JSON | 攻方阵容 | - | 阵容快照 |
| defender_lineup | JSON | 守方阵容 | - | 阵容快照 |
| is_read | TINYINT | 是否已读 | - | |
| created_at | DATETIME | 创建时间 | IDX | |

### 2.13 邮件表 (mails)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | 邮件ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | IDX | |
| type | TINYINT UNSIGNED | 邮件类型 | - | 1系统 2奖励 3战报 4社交 |
| title | VARCHAR(128) | 标题 | - | |
| content | TEXT | 内容 | - | |
| attachments | JSON | 附件 | - | 奖励道具列表 |
| is_read | TINYINT | 是否已读 | IDX | |
| is_claimed | TINYINT | 是否已领取 | IDX | |
| expired_at | DATETIME | 过期时间 | IDX | |
| created_at | DATETIME | 创建时间 | IDX | |

### 2.14 配置版本表 (config_versions)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | INT UNSIGNED | 版本ID | PK | 自增 |
| config_type | VARCHAR(32) | 配置类型 | IDX | hero/equipment/skill等 |
| version | INT UNSIGNED | 版本号 | - | |
| status | TINYINT UNSIGNED | 状态 | IDX | 0草稿 1测试 2灰度 3正式 |
| gray_ratio | TINYINT UNSIGNED | 灰度比例 | - | 0-100 |
| data | JSON | 配置数据 | - | 完整配置 |
| operator | VARCHAR(64) | 操作人 | - | |
| remark | VARCHAR(255) | 备注 | - | |
| created_at | DATETIME | 创建时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

### 2.15 道具背包表 (user_items)

| 字段名 | 类型 | 说明 | 索引 | 备注 |
|--------|------|------|------|------|
| id | BIGINT UNSIGNED | ID | PK | 自增 |
| user_id | BIGINT UNSIGNED | 用户ID | IDX | |
| item_id | INT UNSIGNED | 道具ID | IDX | |
| count | INT UNSIGNED | 数量 | - | |
| created_at | DATETIME | 获取时间 | - | |
| updated_at | DATETIME | 更新时间 | - | |

**唯一索引**: `(user_id, item_id)`

---

## 三、Redis 数据结构设计

### 3.1 用户会话
```
Key: session:{token}
Type: Hash
Fields:
  - userId: 用户ID
  - username: 用户名
  - loginAt: 登录时间戳
  - expireAt: 过期时间戳
TTL: 7天
```

### 3.2 在线用户
```
Key: online:users
Type: Set
Members: userId列表
```

### 3.3 排行榜
```
Key: arena:rank:{seasonId}
Type: Sorted Set
Score: 积分 score
Member: userId
```

### 3.4 用户战力缓存
```
Key: user:power:{userId}
Type: String (JSON)
Value: { total: 10000, lineup: [...], heroes: {...} }
TTL: 5分钟
```

### 3.5 资源产出队列
```
Key: resource:settle:queue
Type: ZSet
Score: 结算时间戳
Member: userId
```

### 3.6 配置缓存
```
Key: config:{type}:{version}
Type: String (JSON)
Value: 配置数据
TTL: 永久 (主动失效)
```

---

## 四、索引设计原则

1. **主键索引**: 所有表都有自增BIGINT主键
2. **唯一索引**: 业务唯一字段加唯一索引
3. **查询索引**: 常用where条件字段加普通索引
4. **联合索引**: 多条件查询按区分度从高到低排序
5. **时间索引**: 时间范围查询加索引
6. **避免过度索引**: 索引不是越多越好，影响写入性能

---

## 五、数据分区策略 (未来扩展)

1. **用户表**: 按user_id取模分库分表
2. **战报表**: 按月分表
3. **排行榜**: Redis分片
4. **历史数据归档**: 定期归档到历史库

---

## 六、数据安全

1. **密码加密**: bcrypt 单向哈希
2. **敏感数据**: 手机号、身份证等加密存储
3. **数据备份**: 每日全量备份 + 增量备份
4. **审计日志**: 关键操作全记录
