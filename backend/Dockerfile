FROM python:3.9

COPY requirements.txt .

RUN pip --no-cache-dir install -r requirements.txt

COPY app ./app

COPY run_server.sh .

CMD ["uvicorn", "app.server:api", "--host", "0.0.0.0", "--port", "5000"]
