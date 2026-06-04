## Commands

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
