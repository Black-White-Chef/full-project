# 베이스 이미지 설정
FROM python:3.10-slim

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 프로젝트 폴더 생성 및 설정
WORKDIR /code

# 의존성 파일 복사 및 설치
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 소스 코드 복사
COPY . /code/

# 권한 설정 (예: /code 디렉토리와 하위 디렉토리/파일에 대해 권한 설정)
#RUN chmod -R 755 /code

# Django 서버 실행 - gunicorn 사용
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "BlackWhiteChef.wsgi:application"]
