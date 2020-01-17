import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './src/graphql'

const server = express();
const port = 3000;

server.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
server.use(express.json());

server.listen(port, () => console.log('Server Online'));
