import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { Term } from './term';
import DB from '../../database';

const Segment = new GraphQLObjectType({
  name: 'Segment',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    batchId: {
      type: GraphQLInt,
    },
    termId: {
      type: GraphQLInt,
    },
    start: {
      type: GraphQLString,
      resolve({ start }) {
        return start ? start.toISOString() : null;
      },
    },
    end: {
      type: GraphQLString,
      resolve({ end }) {
        return end ? end.toISOString() : null;
      },
    },
    usedSide1: {
      type: GraphQLBoolean,
    },
    usedSide2: {
      type: GraphQLBoolean,
    },
    usedSide3: {
      type: GraphQLBoolean,
    },
    correct: {
      type: GraphQLBoolean,
    },
    unknown: {
      type: GraphQLBoolean,
    },
    wrong: {
      type: GraphQLBoolean,
    },
    term: {
      type: Term,
      resolve({ termId }) {
        return DB.Terms.findByPk(termId);
      },
    },
  }),
});

export default Segment;
