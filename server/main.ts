import fastify from 'fastify';
import { client } from './client';

client.execute(async ({ admin, manager, auth, config, createAuthClient, createManagerClient }) => {
  console.log('getMyOrg', await manager.getMyOrg({}));
  console.log('getMyUser', await auth.getMyUser({}));

  const server = fastify({});

  server.get('/', (req, res) => {
    res.send(200);
  });

  server.get('/create-org', async (req, res) => {
    const org = await manager.getMyOrg({});
    res.status(200).send({ org });
  });

  server.listen({
    port: config.server.port,
  });

  console.log('server is listening at port', config.server.port);
});
