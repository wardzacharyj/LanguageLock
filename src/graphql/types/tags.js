import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} from 'graphql';
import { Tags } from '../../database';

const TermTag = new GraphQLObjectType({
  name: 'TermTag',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLInt,
      resolve(source, { tagId }) {
        return Tags.findByPk(tagId); 
      }
    },
  })
});

const Tag = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
  })
});

export { 
  Tag,
  TermTag,
};