# Centrifuge Outflux

[![fastify](https://img.shields.io/static/v1?label=built+with&message=fastify&color=363636)](https://www.fastify.io/)
[![GraphQL Yoga](https://img.shields.io/static/v1?label=built+with&message=GraphQL+Yoga&color=c026d3)](https://the-guild.dev/graphql/yoga-server)
[![Docker](https://img.shields.io/static/v1?label=shipped+with&message=Docker&color=287cf9)](https://www.docker.com/)
[![embrio.tech](https://img.shields.io/static/v1?label=by&message=EMBRIO.tech&color=24ae5f)](https://embrio.tech)
[![Centrifuge](https://img.shields.io/static/v1?label=for&message=Centrifuge&color=2762ff)](https://centrifuge.io/)

An API service to consume data of the centrifuge ecosystem.

## :seedling: Staging

:construction:

Coming soon...

<!-- Access staging of [`main`](https://github.com/embrio-tech/centrifuge-insights) branch at [https://insights.s.centrifuge.embrio.tech/](https://insights.s.centrifuge.embrio.tech/). -->

<!-- [![Screen Shot 2022-07-28 at 11 50 10](https://user-images.githubusercontent.com/16650977/181477369-6a563446-7e8b-45c4-a837-6ace275d28f5.png)](https://insights.s.centrifuge.embrio.tech/) -->

## :construction_worker: Development

We highly recommend to develop using the overarching [centrifuge-development](https://github.com/embrio-tech/centrifuge-development) repository. It allows to run all required services and databases with [Docker Compose](https://docs.docker.com/compose/).

If you prefer to run the frontend without Docker the following instructions get you started.

### Prerequisites

- [Node Version Manager](https://github.com/nvm-sh/nvm)
  - node: version specified in [`.nvmrc`](/.nvmrc)
- [Yarn](https://classic.yarnpkg.com/en/)
- Development environment variables file

  - Copy the template with

        cp sample.env .env

### Install

    yarn install

### Run

    yarn develop

### Access

The service can be accessed under http://localhost:5000 or the `PORT` specified in the `.env` file.

### Commit

This repository uses commitlint to enforce commit message conventions. You have to specify the type of the commit in your commit message. Use one of the [supported types](https://github.com/pvdlg/conventional-changelog-metahub#commit-types).

    git commit -m "[type]: foo bar"

## Contact

[EMBRIO.tech](https://embrio.tech)  
[hello@embrio.tech](mailto:hello@embrio.tech)  
+41 44 552 00 75

## License

The code is licensed under the [GNU Lesser General Public License v2.1](https://github.com/embrio-tech/centrifuge-insights/blob/main/LICENSE)
