FROM ubuntu:20.04

RUN apt-get -y update

RUN apt-get -y update && apt-get install -qyy \
   -o APT::Install-Recommends=false -o APT::Install-Suggests=false \
   procps \
   python3 python3-dev python3-venv netbase \
   xorg xserver-xorg-video-dummy x11-apps \
   xfoil

ENV DEBIAN_FRONTEND noninteractive
ENV DISPLAY :0

ENV VIRTUAL_ENV=/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip --no-cache-dir install -U pip

COPY xserver.config start.sh /root/
COPY requirements.txt .

RUN pip --no-cache-dir install -r requirements.txt

RUN useradd --create-home server -s /bin/bash

COPY server.py run_server.sh /home/server/
COPY xfoil/simulation.py /home/server/xfoil/

CMD /root/start.sh
