import json
import logging
import tempfile
import sys
import uuid
from flask import Flask, request
from flask_cors import CORS


logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)


# Log to stderr, where it will be delivered to ElasticSearch.
# `data` should be JSON serializable.

def log(data):
    print(json.dumps(data), file=sys.stderr)


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def add_one():
    def error(code, err):
        log({"error": err, "code": code})
        return { "error": err }, code

    input = request.get_json()

    if not (type(input) is dict and
            "x" in input and
            (type(input["x"]) is int or type(input["x"]) is float)):
        return error(400, "invalid input")

    x = input["x"]
    result = x + 1

    log({"input": x, "result": result})

    return {"result": result}
