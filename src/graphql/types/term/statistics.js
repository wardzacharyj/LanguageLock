import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

const Statistics = new GraphQLObjectType({
  name: 'Statistics',
  fields: () => ({
    lastStudied: {
      type: GraphQLString,
    },
    durationStudied: {
      type: GraphQLInt,
    },
    occurencesStudied: {
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
    side1_incorrect: {
      type: GraphQLInt,
    },
    side2_incorrect: {
      type: GraphQLInt,
    },
    side3_incorrect: {
      type: GraphQLInt,
    },
  }),
});

export default Statistics;
