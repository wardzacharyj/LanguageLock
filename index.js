import express from 'express';
import graphqlHTTP from 'express-graphql';
import fs from 'fs';
import schema from './src/graphql';

const server = express();
const port = 3000;

server.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
server.use(express.json());

server.get('/backups/:id', async (req, res) => {
  const { params } = req;
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  try {
    const backupExists = await new Promise((resolve, reject) => {
      fs.stat(`backups/${decodedId}`, (error) => {
        if (!error) {
          resolve(true);
        } else {
          reject(error);
        }
      });
    });

    if (backupExists instanceof Error) {
      res.send({ error: `Backup ${decodedId} Not Found` });
    } else {
      res.download(`backups/${decodedId}`);
    }
  } catch (error) {
    res.send({ error: `Backup ${decodedId} Not Found` });
  }
});

server.listen(port);
