
import express from 'express';
import { graphql } from 'graphql';
import request from 'request-promise';

import schema from './graphql';


const mockServer = (port) => new Promise((resolve, reject) => {
  const server = express();
  server.get('/graphql', (req, res) => {
    const { queryBody } = req.query;

    if (!queryBody) {
      return res.status(500).send('You must provide a valid query');
    }

    return graphql(schema, queryBody)
      .then((data) => res.json(data))
      .catch((err) => {
        throw err;
      });
  });

  const portUsed = port || 8000;
  server.listen(portUsed, () => resolve(
    {
      close: async () => server.close(),
      query: (queryBody) => request(
        {
          baseUrl: `http://localhost:${portUsed}`,
          uri: '/graphql',
          qs: { queryBody },
          resolveWithFullResponse: false,
          json: true,
        },
      ),
    },
  ));
});

export default mockServer;
