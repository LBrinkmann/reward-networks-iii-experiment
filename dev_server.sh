#!/bin/bash
set -e -x

export MONGO_URL="mongodb://localhost:27017/"

. .venv/bin/activate

docker compose up database -d

# make sure the daemon gets killed once this script is stopped
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# sync types with frontend

frontend_type_file="${RN_FRONTEND}/src/apiTypes.ts"

daemon() {
    chsum1=""

    while [[ true ]]
    do
        chsum2=`find app/ -type f -exec md5 {} \;`
        if [[ $chsum1 != $chsum2 ]] ; then
            if [ -n "$chsum1" ]; then
                pydantic2ts --module app.server --output ./frontend/apiTypes.ts
                cp ./frontend/apiTypes.ts $frontend_type_file
            fi
            chsum1=$chsum2
        fi
        sleep 10
    done
}

daemon > /dev/null 2>&1 &
uvicorn app.server:app --reload
