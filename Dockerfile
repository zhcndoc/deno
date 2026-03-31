FROM node:lts AS builder
WORKDIR /app
COPY . .
RUN npm install -g deno && deno install && deno task generate:reference && deno task lume

FROM zeabur/caddy-static AS runtime
COPY --from=builder /app/_site /usr/share/caddy
