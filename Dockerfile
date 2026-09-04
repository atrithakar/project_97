FROM node:24.15.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

FROM node:24.15.0-alpine AS runner

WORKDIR /app



RUN apk update && apk upgrade --no-cache && \
    addgroup -S project_97_grp && \
    adduser -S project_97_user -G project_97_grp && \
    apk add --no-cache tini && \
    # Strip global npm, npx, and yarn to kill their bundled vulnerabilities
    rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/yarn* \
           /opt/yarn* && \
    mkdir -p /app/uploads/originals && chown -R project_97_user:project_97_grp /app/uploads

COPY --from=builder --chown=project_97_user:project_97_grp /app ./

USER project_97_user

EXPOSE 9797

ENTRYPOINT ["/sbin/tini", "--", "node", "server.js"]