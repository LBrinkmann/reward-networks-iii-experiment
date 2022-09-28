#!/bin/bash
set -e -x

# Runs as the "server" user in the Docker container.
export HOME=/home/server
export PATH="$VIRTUAL_ENV/bin:$PATH"
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

uvicorn app.server:api --port 5000 --host 0.0.0.0
