# 宠物急救与寻宠协同平台

## 1. 项目简介

本项目是一个面向养宠用户的宠物急救、寻宠、宠物档案与本地宠物服务协同平台。

项目第一阶段聚焦：

- 宠物急救知识；
- 附近宠物医院；
- 宠物档案；
- 寻宠发布；
- 领养发布；
- 宠物社区基础内容；
- 管理后台审核与运营管理。

本项目采用前后端分离架构，用户端使用 uni-app 支持微信小程序、Android App 和 H5，后端使用 NestJS 提供 API 服务。

## 2. 登录策略

用户端采用 **游客模式 + 渐进式登录**。

用户首次进入应用时不强制登录，可以直接访问：

- 首页；
- 急救知识；
- 宠物医院信息；
- 寻宠信息；
- 领养信息；
- 社区内容。

当用户执行创建宠物档案、发布内容、评论、点赞、收藏、上传图片、查看个人数据等操作时，再引导用户登录。

管理后台不支持游客模式，必须管理员登录后访问。

## 3. 权限分层

| 权限等级 | 说明 |
|---|---|
| Public | 游客可访问 |
| UserAuth | 普通用户登录后访问 |
| AdminAuth | 管理员登录后访问 |

## 4. 技术栈

### 4.1 用户端

- uni-app
- Vue3
- TypeScript
- Pinia
- SCSS

### 4.2 后端

- NestJS
- TypeScript
- PostgreSQL
- PostGIS
- Redis / Valkey
- JWT
- OpenAPI / Swagger

### 4.3 文件存储与部署

- MinIO / 阿里云 OSS / 腾讯云 COS
- Docker / Docker Compose
- Nginx

## 5. 项目目录

```txt
pet-platform/
├── AGENTE.md
├── package.json
├── pnpm-workspace.yaml
├── README.md
├── docs/
├── frontend/
├── backend/
├── admin/
├── database/
├── storage/
├── deploy/
├── api-contract/
└── scripts/
```

## 6. 本地交接启动

本项目根目录已经收口为 pnpm 工作区，下一位开发者从根目录执行：

```bash
pnpm check:env
pnpm install
pnpm services:start
pnpm prisma:generate
pnpm prisma:migrate
pnpm generate:types
pnpm dev:backend
pnpm dev:frontend:h5
pnpm dev:admin
```

如果只是检查骨架，不想安装依赖：

```bash
SKIP_INSTALL=1 bash scripts/init-project.sh
```

## 7. 当前阶段目标

第一阶段优先完成 MVP：

- 首页；
- 急救知识；
- 医院列表与详情；
- 宠物档案；
- 寻宠发布与列表；
- 领养发布与列表；
- 社区基础功能；
- 文件上传；
- 管理后台审核。

第一阶段暂不优先实现：

- 复杂商城；
- 资金担保交易；
- 宠物保险；
- 复杂 IM 聊天；
- 全国服务人员接单；
- AI 医疗诊断。

## 8. 文档入口

```txt
docs/
├── 项目介绍.md
├── 技术架构说明.md
├── 接口文档.md
├── 数据库设计.md
├── 部署说明.md
├── 开发规范.md
├── 前后端协作规范.md
├── 交接说明.md
└── 项目进度.md
```

## 9. 当前骨架状态

当前状态是“基础设施已加固的可交接开发骨架”：

- 三端目录和基础 TypeScript 配置已存在，H5 与微信小程序脚本已明确；
- Android App 先走 uni-app App 发行路径，不引入独立原生 Android 工程；
- 根目录 pnpm 工作区已建立；
- `pnpm-lock.yaml` 已生成，依赖版本已从浮动范围收紧到明确版本；
- Docker Compose 已包含 PostgreSQL/PostGIS、Redis、MinIO、后端和 Nginx；
- Nginx 已预留 `/api`、`/h5`、`/admin` 入口；
- Prisma 已建立第一版 MVP 数据模型和 migration，数据库结构以 Prisma 为唯一来源；
- OpenAPI 首版权限分层契约已存在，接口类型以 `api-contract/openapi.yaml` 生成结果为准；
- Auth/JWT 基础闭环已接入，UserAuth/AdminAuth 可基于 token 注入用户身份；
- 上传模块已建立统一对象存储抽象，默认 MinIO，OSS/COS 仅保留后续扩展边界；
- 业务页面和业务接口仍处于骨架阶段，下一步应按接口契约逐模块实现。
