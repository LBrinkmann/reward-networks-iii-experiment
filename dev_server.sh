#!/bin/bash
set -e -x

. .venv/bin/activate

docker compose up database -d

export MONGO_URL="mongodb://localhost:27017/"
export NETWORK_FILE='/Users/levinbrinkmann/levin/repros/reward-network-ii/data/1000000/selected/test.json'

pydantic2ts --module app.server --output ./frontend/apiTypes.ts
uvicorn app.server:app --reload