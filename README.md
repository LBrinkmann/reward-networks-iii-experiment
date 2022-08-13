## Development environment
Development environment is defined in `docker-compose-dev.yml` file. To simplify docker-compose usage, one can set `docker-compose-dev.yml` as an environmental variable in `.env` file: `COMPOSE_FILE=docker-compose-dev.yml`.

Set up the development environment and ensure that all images are recreated (`--build`) in detached mode (`-d`):

```bash

docker-compose -f docker-compose-dev.yml up --build -d

```

To stop everything and remove all volumes:

```bash

docker-compose -f docker-compose-dev.yml down --volumes

```

## Deployment

### Logs

https://onenr.io/0EPwJ0NDkj7




