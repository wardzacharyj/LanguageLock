import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

const Segment = new GraphQLObjectType({
  name: 'Segment',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    sessionId: {
      type: GraphQLInt,
    },
    termId: {
      type: GraphQLInt,
    },
    start: {
      type: GraphQLString,
    },
    end: {
      type: GraphQLString,
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
  }),
});

export default Segment;
