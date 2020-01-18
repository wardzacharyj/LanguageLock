import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

const TermHistory = new GraphQLObjectType({
  name: 'History',
  fields: () => ({
    lastStudied: {
      type: GraphQLString,
    },
    occurencesStudied: {
      type: GraphQLInt,
    },
    durationStudied: {
      type: GraphQLInt,
    },
  }),
});

export default TermHistory;
