![Is It Alive?](https://isitalive.dev/api/badge/github/quochuydev/zitadel-login-ui)
![Passkeys](https://img.shields.io/badge/Passkeys-Supported-success?style=flat-square)
![TOTP](https://img.shields.io/badge/TOTP-Supported-success?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-Multi--Language-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## Development

1. Clone `.env.example` file as `.env`
2. Update ZITADEL url to env `ZITADEL_URL`
3. Create service user:
   - Update service user role `IAM_OWNER` in `https://ZITADEL_URL/ui/console/instance/members`
   - Get `userId` and update to env `ZITADEL_SERVICE_USER_ID`

   ![Create service user](./docs/create-service-user.png)

4. Create service user token: update token to env `ZITADEL_SERVICE_USER_TOKEN`

   ![Create service user token](./docs/service-user-token.png)

### Run the app

```bash
cd login
yarn install
yarn dev
```

## Run with Docker

```bash
docker run -p 3333:3333 \
  -e APP_URL=http://localhost:3333 \
  -e ZITADEL_URL=<your-zitadel-url> \
  -e ZITADEL_SERVICE_USER_ID=<service-user-id> \
  -e ZITADEL_SERVICE_USER_TOKEN=<service-user-token> \
  quochuydev/zitadel-login-ui:latest
```

## Demo

https://zitadel-login-ui-v2.vercel.app
