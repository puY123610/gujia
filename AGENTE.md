# AGENTE.md

## 1. 项目定位

本项目是一个面向养宠用户的宠物急救、寻宠、宠物档案与本地宠物服务协同平台。

项目采用前后端分离架构，目标是优先解决以下场景：

- 用户快速查看宠物急救知识；
- 用户快速查找附近宠物医院；
- 用户发布寻宠信息；
- 用户建立宠物档案；
- 管理员审核内容、维护医院和运营数据。

本项目不是第一阶段就做大而全宠物平台，不优先做复杂商城、担保交易、保险、IM 聊天或全国服务人员接单。

## 2. 技术栈

### 2.1 用户端

- 跨端框架：uni-app
- 前端框架：Vue3
- 开发语言：TypeScript
- 状态管理：Pinia
- 样式：SCSS
- 目标平台：微信小程序、Android App、H5

### 2.2 后端

- 后端框架：NestJS
- 开发语言：TypeScript
- 数据库：PostgreSQL
- 地理位置扩展：PostGIS
- 缓存：Redis / Valkey
- 登录认证：JWT
- 参数校验：class-validator
- 接口文档：OpenAPI / Swagger

### 2.3 文件存储与部署

- 文件存储：MinIO / 阿里云 OSS / 腾讯云 COS
- 容器化：Docker / Docker Compose
- 反向代理：Nginx

## 3. 登录策略

本项目用户端采用 **游客模式 + 渐进式登录**。

用户首次进入应用时，不强制登录。用户可以直接浏览：

- 首页；
- 急救知识；
- 宠物医院列表；
- 宠物医院详情；
- 寻宠列表；
- 寻宠详情；
- 领养列表；
- 领养详情；
- 社区帖子列表；
- 社区帖子详情；
- 用户协议；
- 隐私政策。

当用户执行以下操作时，再引导登录：

- 创建宠物档案；
- 编辑宠物档案；
- 发布寻宠；
- 发布领养；
- 发布帖子；
- 评论；
- 点赞；
- 收藏；
- 上传图片；
- 查看我的宠物；
- 查看我的发布；
- 查看我的收藏；
- 修改个人资料。

管理后台不支持游客模式，必须管理员登录后访问。

## 4. 权限分层

项目统一使用三类权限：

| 权限等级 | 含义 | 示例 |
|---|---|---|
| Public | 游客可访问 | 首页、急救知识、医院列表、寻宠详情 |
| UserAuth | 普通用户登录后访问 | 发布、收藏、评论、宠物档案 |
| AdminAuth | 管理员登录后访问 | 内容审核、用户管理、医院管理 |

AI 开发时必须遵守：

1. Public 接口不得强制登录。
2. UserAuth 接口必须校验普通用户 Token。
3. AdminAuth 接口必须校验管理员 Token 和管理员权限。
4. 后端不得直接相信前端传来的 userId。
5. 用户身份必须从 Token 中解析。
6. 登录成功后，前端应返回用户原本想访问的页面或继续原本操作。

## 5. 项目目录约定

项目根目录建议结构：

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

## 6. 前端开发规则

前端位于：

```txt
frontend/pet-uniapp/
```

推荐结构：

```txt
src/
├── pages/
│   ├── public/
│   ├── private/
│   ├── auth/
│   └── common/
├── components/
├── api/
├── types/
├── stores/
├── guards/
├── utils/
├── platform/
├── static/
└── styles/
```

### 6.1 页面分层

| 目录 | 说明 |
|---|---|
| pages/public | 游客可访问页面 |
| pages/private | 需要登录页面 |
| pages/auth | 登录、注册、授权相关页面 |
| pages/common | 协议、隐私、404、WebView 等通用页面 |

### 6.2 登录守卫

前端应封装统一登录判断，不允许在页面中重复写散乱逻辑。

建议文件：

```txt
src/guards/require-login.ts
src/utils/auth.ts
src/stores/auth.store.ts
```

点击需要登录的功能时，应弹出登录引导，而不是阻止用户浏览公开内容。

### 6.3 接口请求

所有请求必须通过统一封装，不允许在页面中大量直接写 `uni.request`。

建议目录：

```txt
src/api/
```

接口文件示例：

```txt
auth.api.ts
user.api.ts
pet.api.ts
emergency.api.ts
hospital.api.ts
lost.api.ts
adopt.api.ts
community.api.ts
upload.api.ts
```

### 6.4 类型定义

所有核心业务对象和接口返回值必须定义 TypeScript 类型。禁止大量使用 `any`。不确定类型时优先使用 `unknown`，再做类型判断。

## 7. 后端开发规则

后端位于：

```txt
backend/pet-nestjs/
```

### 7.1 数据库与接口来源

数据库结构必须以 `backend/pet-nestjs/prisma/schema.prisma` 和 `backend/pet-nestjs/prisma/migrations/` 为唯一来源。

接口契约必须以 `api-contract/openapi.yaml` 为唯一来源，`api-contract/generated-types/api-types.ts` 必须通过 `pnpm generate:types` 生成。

`database/postgresql/*.sql` 只保留扩展、初始化说明或开发辅助，不允许在其中另写业务表结构。

推荐结构：

```txt
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── result/
├── config/
├── database/
├── cache/
├── storage/
├── modules/
└── tasks/
```

### 7.1 权限相关文件

建议增加：

```txt
common/decorators/public.decorator.ts
common/decorators/current-user.decorator.ts
common/decorators/roles.decorator.ts

common/guards/jwt-auth.guard.ts
common/guards/optional-auth.guard.ts
common/guards/admin.guard.ts
```

### 7.2 模块规则

业务模块统一放在：

```txt
src/modules/
```

模块示例：

```txt
auth/
user/
pet/
emergency/
hospital/
lost/
adopt/
community/
comment/
favorite/
upload/
admin/
notification/
```

Controller 只负责接收请求、读取参数、调用 Service、返回结果。复杂业务必须放在 Service 中。

### 7.3 DTO 和 VO

所有前端传入后端的数据必须定义 DTO，并使用 `class-validator` 校验。

返回给前端的数据建议定义 VO。不要直接返回包含敏感字段的数据库对象。

## 8. 数据库规则

数据库使用 PostgreSQL。涉及附近医院、寻宠位置、地理范围查询时使用 PostGIS。

核心规则：

1. 核心表必须有主键 `id`。
2. 核心表必须有 `createdAt` 和 `updatedAt`。
3. 用户私有数据必须有关联用户字段。
4. 图片、视频、附件不直接存入数据库。
5. 文件本体存入对象存储，数据库只保存文件 URL 和元信息。
6. 数据库结构变更必须通过迁移文件管理。

## 9. 缓存规则

缓存层使用 Redis / Valkey。

允许缓存：

- 验证码；
- Token 黑名单；
- 热门急救知识；
- 热门寻宠信息；
- 附近医院查询结果；
- 接口限流数据；
- 临时锁。

缓存不是主数据库，缓存失效后必须能从 PostgreSQL 恢复数据。

## 10. 文件存储规则

开发环境可使用 MinIO，生产环境可使用阿里云 OSS、腾讯云 COS 或自建 MinIO。

上传规则：

1. 限制文件大小；
2. 限制文件类型；
3. 禁止上传可执行脚本；
4. 后端统一返回文件 URL；
5. 数据库只保存文件元信息和访问地址。

## 11. 安全规则

1. 密码必须哈希保存。
2. JWT 密钥必须放在环境变量。
3. 数据库账号、对象存储密钥不得硬编码。
4. 后端不能直接信任前端传来的 userId。
5. 用户只能操作自己的数据。
6. 管理端接口必须校验管理员权限。
7. 上传文件必须做类型和大小限制。
8. 所有用户输入必须做参数校验。

## 12. 文档同步规则

以下情况必须同步更新文档：

| 变更 | 需要更新 |
|---|---|
| 新增接口 | docs/接口文档.md、api-contract/openapi.yaml |
| 修改数据库 | docs/数据库设计.md |
| 修改登录策略 | README.md、docs/项目介绍.md、docs/技术架构说明.md、AGENTE.md |
| 修改部署方式 | docs/部署说明.md |
| 修改协作流程 | docs/前后端协作规范.md |

## 13. AI 修改后输出要求

AI 完成任务后必须说明：

1. 修改了哪些文件；
2. 是否新增或修改接口；
3. 是否修改数据库；
4. 是否需要执行迁移；
5. 是否需要新增环境变量；
6. 如何运行验证；
7. 已知风险或未完成项。
