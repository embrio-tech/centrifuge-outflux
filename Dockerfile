FROM --platform=linux/amd64 node:18.14-alpine as dev-build

WORKDIR /opt/outflux 

    RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

    COPY package*.json ./
    COPY yarn*.lock ./
    RUN yarn install --production=false
    COPY . .
    RUN yarn build

## This does not work for now. Only starting with yarn develop and
## with all the dev dependencies installed has a successful app startup

FROM --platform=linux/amd64 node:18.14-alpine as prod-install

    WORKDIR /opt/outflux 

    COPY package*.json ./
    COPY yarn*.lock ./
    RUN yarn install --production=true --frozen-lockfile

FROM --platform=linux/amd64 node:18.14-alpine

    WORKDIR /opt/outflux 
    COPY --from=dev-build /opt/outflux/dist/ ./dist/
    COPY --from=prod-install /opt/outflux/node_modules/ ./node_modules/

    COPY package*.json ./
    COPY yarn*.lock ./
    
    RUN apk add --update --no-cache python3
    RUN ln -sf /usr/bin/python3 /usr/bin/python

EXPOSE 5000

CMD ["yarn", "start"]
# CMD ["yarn", "develop"]
