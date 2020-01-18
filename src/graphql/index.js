import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
} from 'graphql';

import fs from 'fs';
import { Terms, Tags, createBackup } from '../database';
import { Term, Tag, Backup } from './types';


const RootQuery = new GraphQLObjectType(
  {
    name: 'RootQuery',
    fields: {
      term: {
        type: Term,
        args: {
          id: { type: GraphQLInt },
        },
        resolve(root, { id }) {
          return Terms.findByPk(id);
        },
      },
      tag: {
        type: Tag,
        args: {
          id: { type: GraphQLInt },
        },
        resolve(root, { id }) {
          return Tags.findByPk(id);
        },
      },
      tags: {
        type: new GraphQLList(Tag),
        resolve() {
          return Tags.findAll();
        },
      },
      terms: {
        type: new GraphQLList(Term),
        resolve() {
          return Terms.findAll();
        },
      },
      backups: {
        type: new GraphQLList(Backup),
        resolve() {
          return new Promise((resolve, reject) => fs.readdir('backups', (error, filenames) => {
            if (error) {
              reject(error);
            } else {
              resolve(filenames.map((name) => ({ filename: name })));
            }
          }));
        },
      },
    },
  },
);

const Mutation = new GraphQLObjectType(
  {
    name: 'Mutation',
    fields: {
      createBackup: {
        type: Backup,
        resolve: async () => ({
          filename: await createBackup(),
        }),
      },
    },
  },
);

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});


export default schema;
