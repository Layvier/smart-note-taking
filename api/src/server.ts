import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';

import schema from './graphql/schema';
// import { validateAndDecodeJWT, JWTPayload } from '../services/auth/jwt';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { env } from './env';

const server = new ApolloServer({
  schema,
  introspection: true,
  // mocks: env.API.GRAPHQL_MOCK_ENABLED === 'true' && {
  //   Date: () => new Date(),
  // },
  // formatError: (err) => {
  //   logger.error(err);
  //   !!err.extensions.exception?.stacktrace && err.extensions.exception.stacktrace.map((s) => logger.error(s));
  //   return err;
  // },
  mockEntireSchema: true,
  // context: async (context): Promise<APIContext> => {
  //   const jwt = context.ctx.request.header.authorization;
  //   if (!!jwt) {
  //     try {
  //       return { user: await validateAndDecodeJWT(jwt) };
  //     } catch (err) {
  //       throw new AuthenticationError('Invalid token');
  //     }
  //   }
  //   return {};
  // },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    {
      requestDidStart: async (c) => {
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
