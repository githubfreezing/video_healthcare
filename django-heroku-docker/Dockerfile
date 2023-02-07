# pull official base image
FROM python:3.9

RUN pip install gdown

RUN mkdir -p ~/.u2net
RUN gdown https://drive.google.com/uc?id=1tNuFmLv0TSNDjYIkjEdeH1IWKQdUA4HR -O ~/.u2net/u2netp.onnx
RUN gdown https://drive.google.com/uc?id=1tCU5MM1LhRgGou5OpmpjBQbSrYIUoYab -O ~/.u2net/u2net.onnx
RUN gdown https://drive.google.com/uc?id=1ZfqwVxu-1XWC1xU1GHIP-FM_Knd_AX5j -O ~/.u2net/u2net_human_seg.onnx
RUN gdown https://drive.google.com/uc?id=15rKbQSXQzrKCQurUjZFg8HqzZad8bcyz -O ~/.u2net/u2net_cloth_seg.onnx

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG 0

RUN pip install --upgrade pip

# Add the following line to get native library of OpenCV.
RUN apt-get update && apt-get install -y libopencv-dev
# rembg==2.0.21
#RUN pip install rembg==2.0.21
RUN pip install rembg==2.0.30

# install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

# collect static files
RUN python manage.py collectstatic --noinput


# run gunicorn
CMD gunicorn hello_django.wsgi:application --bind 0.0.0.0:$PORT