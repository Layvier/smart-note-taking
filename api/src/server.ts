import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { env } from './env';
import schema from './graphql/schema';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    {
      requestDidStart: async c => {
        const requestStartedAt = Date.now();
        return {
          async willSendResponse(a) {
            console.log(`Operation ${a.operationName} took ${Date.now() - requestStartedAt}ms`);
          },
        };
      },
    },
  ],
});

const app = new Koa();
const port = Number(env.OTHER.PORT) || 4202;

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

export { startServer };
