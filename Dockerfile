FROM node:alpine AS build

WORKDIR /app

RUN npx corepack enable

COPY ./ ./

RUN pnpm i

RUN pnpm build

FROM node:alpine AS runner

WORKDIR /app

COPY --from=build ./app/dist ./dist

COPY --from=build ./app/node_modules ./node_modules

EXPOSE 80

CMD [ "node","./dist/main.js" ]
