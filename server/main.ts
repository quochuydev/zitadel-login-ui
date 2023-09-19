import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

(async () => {
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
    res.status(200).send({});
  });

  server.post('/api/v2', async (req, res) => {
    console.log('req.cookies', req.cookies);

    res.status(200).send({});
  });

  server.listen({
    port: 4000,
  });

  console.log('server is listening at port');
})();
