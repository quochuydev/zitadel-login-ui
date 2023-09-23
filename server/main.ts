import Fastify from 'fastify';

const fastify = Fastify({
  logger: false,
});

fastify.register(require('@fastify/cookie'), {
  secret: 'my-secret',
  hook: 'onRequest',
  parseOptions: {},
});

fastify.get('/api/v2', (request, reply) => {
  reply.header('set-cookie', ['key2=value1; Max-Age=0;']);

  reply.send({
    hello: 'world',
    cookies: request['cookies'],
  });
});

fastify.post('/api/v2', (request, reply) => {
  reply.send({
    hello: 'world',
    cookies: request['cookies'],
  });
});

fastify.listen({ port: 3333 }, (err) => {
  if (err) throw err;
  console.log('start app v2');
});
