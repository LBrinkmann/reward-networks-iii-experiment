# Python App Template

Demonstrates a JSON API with logging to ElasticSearch.

Python version >= 3.7 is required.


## Setup

```
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## Run Locally

```
env FLASK_APP=server.py FLASK_ENV=development flask run
```


## Example

Add one to `x`.

```
$ curl --header 'Content-Type: application/json' \
       --data-binary '{"x": 5}' \
       http://localhost:5000/
{
  "result": 6
}
```

## Deployed

```
$ curl --header 'Content-Type: application/json' \
       --data-binary '{"x": 5}' \
       https://python-app-template.eks-test-default.mpg-chm.com/
{
  "result": 6
}
```
