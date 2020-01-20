import fs from 'fs';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

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

const parseSortDirection = (sortDirection) => {
  const isDefined = typeof sortDirection !== 'undefined';
  const isString = isDefined && typeof sortDirection === 'string';
  const isNumber = isDefined
    && typeof sortDirection === 'number'
    && (sortDirection === 0 || sortDirection === 1);

  let sortAscending = false;
  let sortDescending = false;

  if (isString) {
    const ignoreCaseCompare = sortDirection.toLowerCase();
    sortAscending = ignoreCaseCompare === 'asc' || ignoreCaseCompare === 'ascending';
    sortDescending = ignoreCaseCompare === 'desc' || ignoreCaseCompare === 'descending';
  } else if (isNumber) {
    sortAscending = sortDirection === 0;
    sortDescending = sortDirection === 1;
  }

  return { sortAscending, sortDescending };
};


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
      batch: {
        type: new GraphQLList(Segment),
        args: {
          id: { type: GraphQLInt },
        },
        resolve(root, { id }) {
          return Segments.findAll({ where: { batchId: id } });
        },
      },
      batches: {
        type: new GraphQLList(Segment),
        args: {
          sort: { type: GraphQLString },
        },
        resolve(root, { sort }) {
          const { sortAscending, sortDescending } = parseSortDirection(sort);
          if (sortAscending) {
            return Segments.findAll({ order: [['end', 'ASC']] });
          }
          if (sortDescending) {
            return Segments.findAll({ order: [['end', 'DESC']] });
          }
          return Segments.findAll();
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
        args: {
          sort: { type: GraphQLString },
        },
        resolve(root, { sort }) {
          const { sortAscending, sortDescending } = parseSortDirection(sort);
          if (sortAscending) {
            return Terms.findAll({ order: [['updatedAt', 'ASC']] });
          }
          if (sortDescending) {
            return Terms.findAll({ order: [['updatedAt', 'DESC']] });
          }
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
          batchId: { type: GraphQLInt },
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
            batchId: args.batchId,
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
