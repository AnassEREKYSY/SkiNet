FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Stripe publishable key (public by design), injected at build time from CI.
ARG STRIPE_PUBLISHABLE_KEY=""
RUN sed -i "s|__STRIPE_PUBLISHABLE_KEY__|${STRIPE_PUBLISHABLE_KEY}|" src/environments/environment.ts \
 && npm run build

FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
