FROM python:3.13.5-slim-bullseye

WORKDIR /blogger_api

COPY requirements.txt /blogger_api

RUN pip install -r requirements.txt


EXPOSE 8000

CMD ["flask", "--app", "app", "run", "--debug", "--port", "8000", "--host", "0.0.0.0"]