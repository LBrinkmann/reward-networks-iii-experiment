## Development environment

Development environment is defined in `docker-compose-dev.yml` file. To simplify docker-compose usage, one can set `docker-compose-dev.yml` as an environmental variable in `.env` file: `COMPOSE_FILE=docker-compose-dev.yml`.

Set up the development environment (it can take several minutes first time):

```bash

docker-compose -f docker-compose-dev.yml up

```

NOTE: you can use `--build` flag to rebuild images and `-d` to run in detached mode.

Stop everything and remove all volumes:

```bash

docker-compose -f docker-compose-dev.yml down --volumes

```

### `apiTypes.ts`

`apiTypes.ts` file is generated in the `server.py` each time FastAPI server is restarted and then copied in frontend `src` folder.

## Deployment

### Logs

https://onenr.io/0EPwJ0NDkj7




