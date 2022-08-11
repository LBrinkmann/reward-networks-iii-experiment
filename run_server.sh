#!/bin/bash
set -e -x

# Runs as the "server" user in the Docker container.

export HOME=/home/server
export PATH="$VIRTUAL_ENV/bin:$PATH"
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

echo $(pwd)

ls
# For development
# env FLASK_APP=server.py FLASK_ENV=development flask run --host=0.0.0.0

# For production

uvicorn app.server:app --port 5000 --host 0.0.0.0
