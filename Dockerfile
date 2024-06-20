FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-stage /app/dist ./dist/
COPY conf.d/* /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]