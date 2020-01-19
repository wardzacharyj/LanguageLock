import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import fs from 'fs';
import {
  Terms,
  Tags,
  Segments,
  createBackup,
} from '../database';

import {
  Term,
  Tag,
  Backup,
  Segment,
} from './types';


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
      logTerm: {
        type: Segment,
        args: {
          termId: { type: GraphQLInt },
          sessionId: { type: GraphQLInt },
          start: { type: GraphQLString },
          end: { type: GraphQLString },
          usedSide1: { type: GraphQLBoolean },
          usedSide2: { type: GraphQLBoolean },
          usedSide3: { type: GraphQLBoolean },
          correct: { type: GraphQLBoolean },
          unknown: { type: GraphQLBoolean },
          wrong: { type: GraphQLBoolean },
        },
        resolve(parent, args) {
          return Segments.create({
            termId: args.termId,
            sessionId: args.sessionId,
            start: args.start,
            end: args.end,
            usedSide1: !!args.usedSide1,
            usedSide2: !!args.usedSide2,
            usedSide3: !!args.usedSide3,
            correct: !!args.correct,
            unknown: !!args.unknown,
            wrong: !!args.wrong,
          });
        },
      },
    },
  },
);

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});


export default schema;
