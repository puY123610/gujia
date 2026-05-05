FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json ./
RUN pnpm install

COPY prisma ./prisma
COPY . .

RUN pnpm build
RUN pnpm prune --prod

FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

CMD ["pnpm", "start:prod"]
