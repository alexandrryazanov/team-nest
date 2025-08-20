FROM python:3.13

WORKDIR /app

COPY python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY python/src/py_app.py /app
COPY python/data/*.png /app

CMD ["python", "py_app.py"]