FROM ubuntu:20.04

RUN apt-get -y update

RUN apt-get -y update && apt-get install -qyy \
   -o APT::Install-Recommends=false -o APT::Install-Suggests=false \
   procps \
   python3 python3-dev python3-venv netbase

ENV VIRTUAL_ENV=/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip --no-cache-dir install -U pip

COPY requirements.txt .

RUN pip --no-cache-dir install -r requirements.txt

RUN useradd --create-home server -s /bin/bash

ADD app ./app

COPY app.yml .
COPY setup.py .
COPY run_server.sh .
RUN pip install --no-deps .

USER server
CMD ["./run_server.sh"]
