# 三国策略OL - 回合制策略H5网页网游

> 一款主打武将收集、阵容搭配、城池经营、跨服联赛、赛季排位玩法的回合制策略H5网页网游。

## 📋 项目概述

本项目采用 **Monorepo** 架构，基于 **pnpm workspaces** 管理，包含：

- `apps/server` - 后端服务（NestJS + TypeScript + Prisma + MySQL + Redis）
- `apps/web` - 前端H5应用（React 18 + TypeScript + Vite + Ant Design Mobile）
- `packages/shared` - 前后端共享类型与常量

## 🛠️ 技术栈

### 后端
- **框架**: NestJS 10
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **实时通信**: Socket.io
- **任务调度**: @nestjs/schedule

### 前端
- **框架**: React 18
- **构建**: Vite 5
- **UI组件**: Ant Design Mobile
- **状态管理**: Zustand
- **样式**: TailwindCSS
- **路由**: React Router v6

## 📁 项目结构

```
hjh538/
├── apps/
│   ├── server/          # 后端服务
│   │   ├── src/
│   │   │   ├── modules/     # 业务模块
│   │   │   │   ├── user/        # 用户模块
│   │   │   │   ├── hero/        # 武将模块
│   │   │   │   ├── battle/      # 战斗模块
│   │   │   │   ├── city/        # 城池模块
│   │   │   │   ├── arena/       # 竞技场/排位
│   │   │   │   ├── mail/        # 邮件模块
│   │   │   │   └── equipment/   # 装备模块
│   │   │   ├── shared/      # 共享服务（属性计算等）
│   │   │   ├── config/      # 配置模块
│   │   │   ├── prisma/      # Prisma模块
│   │   │   ├── redis/       # Redis模块
│   │   │   └── common/      # 公共组件
│   │   └── prisma/          # Prisma Schema & 种子
│   └── web/             # 前端应用
│       └── src/
│           ├── pages/        # 页面
│           ├── components/   # 组件
│           ├── stores/       # 状态管理
│           ├── services/     # API服务
│           ├── layouts/      # 布局
│           └── styles/       # 样式
├── packages/
│   └── shared/          # 共享类型 & 常量
├── docs/                # 项目文档
├── docker/              # Docker相关配置
└── docker-compose.yml   # 本地开发环境
```

## 🚀 快速开始

### 环境要求
- Node.js >= 20
- pnpm >= 8
- MySQL >= 8.0
- Redis >= 7

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地数据库

```bash
docker-compose up -d mysql redis
```

### 3. 配置环境变量

```bash
cd apps/server
cp .env.example .env
```

### 4. 初始化数据库

```bash
cd apps/server

# 生成 Prisma Client
pnpm prisma:generate

# 执行数据库迁移
pnpm prisma:migrate

# 初始化配置数据
pnpm seed
```

### 5. 启动开发服务

```bash
# 根目录下
pnpm dev:server   # 启动后端服务 (端口: 3000)
pnpm dev:web      # 启动前端应用 (端口: 5173)

# 或者同时启动
pnpm dev
```

### 6. 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:3000/api
- API文档: http://localhost:3000/api (待接入Swagger)

## 📖 核心玩法模块

### 1. 武将系统
- 武将收集、升级、升星、突破
- 天赋系统、羁绊系统
- 阵容搭配（最多6名武将）
- 多层级属性计算

### 2. 战斗系统
- 回合制自动战斗
- 技能系统（普攻/主动/被动）
- 战报生成与回放
- PVE副本 / PVP对战

### 3. 排位赛系统
- 7大段位（青铜→王者）
- ELO积分匹配
- 赛季周期（28天）
- 赛季奖励与段位重置

### 4. 城池经营
- 8种建筑升级
- 资源产出（银币/粮食）
- 离线收益结算
- 守军配置

### 5. 装备系统
- 6个装备部位
- 稀有度/套装效果
- 装备强化/洗练
- 随机主副属性

### 6. 邮件系统
- 系统邮件/奖励邮件
- 附件领取
- 未读计数

## 📚 设计文档

详细设计文档请查看 [docs/](./docs/) 目录：

- [整体架构设计](./docs/ARCHITECTURE.md)
- [数据库设计](./docs/DATABASE.md)
- [核心模块详细设计](./docs/CORE_MODULES.md)

## 🧪 开发命令

```bash
# 后端
pnpm dev:server          # 开发模式
pnpm build:server        # 生产构建
pnpm test:server         # 运行测试
pnpm prisma:studio       # 打开Prisma Studio

# 前端
pnpm dev:web            # 开发模式
pnpm build:web          # 生产构建
pnpm preview:web        # 预览构建结果

# 全项目
pnpm lint               # 代码检查
pnpm test               # 运行所有测试
```

## 🐳 Docker 部署

```bash
# 启动所有服务（包括数据库、后端、前端）
docker-compose up -d

# 仅启动数据库（开发用）
docker-compose up -d mysql redis

# 查看日志
docker-compose logs -f server web
```

## 📌 Demo阶段规划

- **Phase 1** ✅ 基础框架搭建
- **Phase 2** 🔄 核心玩法（武将系统、战斗系统）
- **Phase 3** 扩展玩法（城池经营、排位赛、战报）
- **Phase 4** 进阶玩法（跨服联赛、赛季系统、运营后台）

## ⚠️ 注意事项

1. 本项目为Demo版本，部分功能为原型实现
2. 生产环境使用前请进行安全审计和性能优化
3. 跨服架构、配置中心等高级功能为设计文档阶段，待实现

## 📄 License

MIT
