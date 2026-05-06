FROM node:20-alpine AS build

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/pet-nestjs/package.json backend/pet-nestjs/package.json

RUN pnpm install --filter pet-nestjs... --frozen-lockfile

COPY backend/pet-nestjs backend/pet-nestjs

WORKDIR /workspace/backend/pet-nestjs
RUN pnpm prisma:generate
RUN pnpm build
RUN pnpm --filter pet-nestjs deploy --legacy --prod /app

FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY --from=build /app ./
COPY --from=build /workspace/backend/pet-nestjs/dist ./dist
COPY --from=build /workspace/backend/pet-nestjs/prisma ./prisma

CMD ["pnpm", "start:prod"]
