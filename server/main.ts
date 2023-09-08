import fastify from 'fastify';
import { client } from './client';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

client.execute(async ({ admin, manager, auth, config, createAuthClient, createManagerClient }) => {
  console.log('getMyOrg', await manager.getMyOrg({}));
  console.log('getMyUser', await auth.getMyUser({}));

  const server = fastify({});

  await server.register(cors, {});

  server.register(cookie, {
    secret: 'my-secret',
    parseOptions: {},
  });

  server.get('/', (req, res) => {
    res.send(200);
  });

  server.get('/create-org', async (req, res) => {
    const org = await manager.getMyOrg({});
    res.status(200).send({ org });
  });

  server.post('/api/v2', async (req, res) => {
    console.log('req.cookies', req.cookies);

    res.status(200).send({});
  });

  server.listen({
    port: config.server.port,
  });

  console.log('server is listening at port', config.server.port);
});
