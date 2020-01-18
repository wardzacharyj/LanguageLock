import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import { Terms, Tags } from '../database'
import { Term, Tag } from './types'


const queryType =  new GraphQLObjectType(
  {
    name: 'Query',
    fields: {
      term: {
        type: Term,
        args: {
          id: { type: GraphQLInt }
        },
        resolve(root, { id }) {
          return Terms.findByPk(id);  
        }
      },
      tag: {
        type: Tag,
        args: {
          id: { type: GraphQLInt }
        },
        resolve(root, { id }) {
          return Tags.findByPk(id);
        }
      },
      tags: {
        type: new GraphQLList(Tag),
        resolve() {
          return Tags.findAll();
        }
      },
      terms: {
        type: new GraphQLList(Term),
        resolve() {
          return Terms.findAll();
        }
      }
    }
  }
);

const schema = new GraphQLSchema({
  query: queryType
})


export default schema;