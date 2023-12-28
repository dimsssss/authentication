# Authentication
jwt 인증에 대해 정리한 내용을 코드로 구현하였습니다. 코드를 사용하고 발생한 결과는 책임지지 않습니다. 

## config
```sh
## ./config/.env.dev에 아래 설정을 셋팅
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE=
DATABASE_DIRECT=
SECRET=
```

## web server
```sh
npm install
npm ci

```

## database docker

```sh
docker run -p 1234:3306 \
           -e MYSQL_DATABASE=db \
              MYSQL_USER=user \
              MYSQL_PASSWORD=pass \
           -d mysql:version
```