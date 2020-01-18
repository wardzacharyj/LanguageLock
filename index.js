import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './src/graphql'
import fs from 'fs';

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
      fs.stat(`backups/${decodedId}`, (error, statResult) => {
        if(!error) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  
    if (backupExists) {
      res.download(`backups/${decodedId}`);
    } else {
      res.send({ error: `Backup ${decodedId} Not Found` });
    }
  } catch(error) {
    res.send({ error: `Backup ${decodedId} Not Found` });
  }

});

server.listen(port, () => console.log('Server Online'));
