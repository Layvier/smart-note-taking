import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';

const schemaWithoutResolvers = loadSchemaSync('./src/graphql/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const executableSchema = addResolversToSchema({
  schema: schemaWithoutResolvers,
  resolvers,
});

export default executableSchema;
