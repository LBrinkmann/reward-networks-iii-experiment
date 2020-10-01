import json
import logging
import tempfile
import sys
import uuid
from flask import Flask
from flask_cors import CORS


logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)


def log(data):
    print(json.dumps(data), file=sys.stderr)


app = Flask(__name__)
CORS(app)

@app.route("/")
def hi():
    log({"route": "/", "more_info": "foo bar"})
    return "hello\n"
