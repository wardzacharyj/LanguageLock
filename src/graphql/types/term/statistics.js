import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

const Statistics = new GraphQLObjectType({
  name: 'Statistics',
  fields: () => ({
    firstStudied: {
      type: GraphQLString,
      resolve({ firstStudied }) {
        return firstStudied ? firstStudied.toISOString() : null;
      },
    },
    lastStudied: {
      type: GraphQLString,
      resolve({ lastStudied }) {
        return lastStudied ? lastStudied.toISOString() : null;
      },
    },
    durationStudied: {
      type: GraphQLInt,
    },
    occurrencesStudied: {
      type: GraphQLInt,
    },
    side1_correct: {
      type: GraphQLInt,
    },
    side2_correct: {
      type: GraphQLInt,
    },
    side3_correct: {
      type: GraphQLInt,
    },
    side1_unknown: {
      type: GraphQLInt,
    },
    side2_unknown: {
      type: GraphQLInt,
    },
    side3_unknown: {
      type: GraphQLInt,
    },
    side1_wrong: {
      type: GraphQLInt,
    },
    side2_wrong: {
      type: GraphQLInt,
    },
    side3_wrong: {
      type: GraphQLInt,
    },
  }),
});

export default Statistics;
