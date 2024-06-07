### Development

#### I. Clone `.env.example` file as `.env`

#### II.Fill zitadel url to `ZITADEL_URL`

#### III.Create service user:

- Update service user role `IAM_OWNER` in `https://ZITADEL_URL/ui/console/instance/members`

- Get userId and fill to `ZITADEL_SERVICE_USER_ID`

![Create service user](./docs/create-service-user.png)

#### IV.Create service user token: fill token to `ZITADEL_SERVICE_USER_TOKEN`

![Create service user token](./docs/service-user-token.png)

**Vercel deploy**

https://vercel.com/new/clone?repository-url=https://github.com/quochuydev/zitadel-login-ui

**Example**

https://zitadel-login-ui-v2.vercel.app

**Features**

[X] Login

[X] Register

[X] Logout

[X] Account selection

[X] OIDC routers (.well-known oauth/v2 oidc/v1)

[X] Passkey

[X] External login

[ ] External registration

[X] Forget password - Request code and change password

[ ] Forget password - Send code via mail
