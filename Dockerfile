FROM node:22 as basebuilder

RUN apt-get update;apt-get install python3 -y

# Download packages
FROM basebuilder as Builder

WORKDIR /build

copy . .

RUN npm ci
RUN npm run build

# Install with dev only
FROM basebuilder as Installer

WORKDIR /installer
copy ./package*.json ./
RUN npm ci --omit=dev

# The actual image
FROM node:22-alpine as Runner

WORKDIR /app
COPY --from=Installer /installer/node_modules /app/node_modules
COPY --from=Builder /build/dist /app/dist
COPY --from=Builder /build/config.json /app
COPY --from=Builder /build/package.json /app

CMD ["npm", "run", "start"]
