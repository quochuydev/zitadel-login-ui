### Document

https://deepwiki.com/quochuydev/zitadel-login-ui

### Development

1. Clone `.env.example` file as `.env`
2. Update ZITADEL url to env `ZITADEL_URL`
3. Create service user:

- Update service user role `IAM_OWNER` in `https://ZITADEL_URL/ui/console/instance/members`
- Get `userId` and update to env `ZITADEL_SERVICE_USER_ID`

![Create service user](./docs/create-service-user.png)

**Run the app**

```bash
yarn dev
```

#### IV.Create service user token: update token to env `ZITADEL_SERVICE_USER_TOKEN`

![Create service user token](./docs/service-user-token.png)

### Commands

_Useful command to add a trust domain in self host server_

```
# Add a trusted domain
docker ps

docker exec -it zitadel_postgres_container_id psql -U postgres -c "\l"

docker exec -it zitadel_postgres_container_id psql -U postgres -d zitadel -c "SELECT * FROM projections.instance_trusted_domains;"

docker exec -it zitadel_postgres_container_id psql -U postgres -d zitadel -c "INSERT INTO projections.instance_trusted_domains (instance_id, creation_date, change_date, sequence, domain) VALUES ('instance_ids', NOW(), NOW(), 1, 'zitadel-login-ui-v2.vercel.app');"

# Verify trusted domain
curl https://system-v1-fpms4l.zitadel.cloud/.well-known/openid-configuration \
-H 'x-zitadel-public-host: zitadel-login-ui-v2.vercel.app'

curl https://zitadel-login-ui-v2.vercel.app/.well-known/openid-configuration
```

### Demo

https://zitadel-login-ui-v2.vercel.app

