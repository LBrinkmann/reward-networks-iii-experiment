## Development environment

Development environment is defined in `docker-compose-dev.yml` file. To simplify docker-compose usage, one can set `docker-compose-dev.yml` as an environmental variable in `.env` file: `COMPOSE_FILE=docker-compose-dev.yml`.

Set up the development environment (it can take several minutes first time):

```bash

docker-compose -f docker-compose-dev.yml up

```

NOTE: you can use `--build` flag to rebuild images and `-d` to run in detached mode.

To run only the backend containers one can use the following command:

```bash

docker-compose -f docker-compose-dev.yml up -d database fastapi

```

Stop everything and remove all volumes:

```bash

docker-compose -f docker-compose-dev.yml down --volumes

```

### `apiTypes.ts`

`apiTypes.ts` file is generated in the `server.py` each time FastAPI server is restarted and then copied in frontend `src` folder.

Useful commands to clean up the system:

```bash

docker system df # check disk usage
docker system prune --all --force # clean up unused images and volumes
docker system prune --volumes --force # clean up unused volumes

```

### Browser windows for development
- React: http://localhost:9000/?userId=f643102a-c56d-4a3a-be39-de467351275f
- Storybook: http://localhost:6006/
- Swagger UI FastAPI: http://localhost:5000/docs
- Backend progress: http://localhost:5000/progress/reward_network_iii/0
- New session simulation: http://localhost:5000/simulation/reward_network_iii/0?generate_new_sessions=true&run_simulation=false

## Deployment

### Logs

https://onenr.io/0EPwJ0NDkj7




