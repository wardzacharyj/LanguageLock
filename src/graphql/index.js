import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import { Terms, Tags, TermTags } from '../database'
import { Term, Tag, TermTag } from './types'


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
      termsForTag: {
        type: new GraphQLList(Term),
        args: {
          id: { type: GraphQLInt }
        },
        resolve: async (root, { tagId }) => {
          // TODO        
        }
      },
      tag: {
        type: Tag,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: async (root, { id }) => {
          return Tags.findByPk(id);
        }
      },
      tags: {
        type: new GraphQLList(Tag),
        resolve: async () => {
          return Tags.findAll();
        }
      },
      terms: {
        type: new GraphQLList(Term),
        resolve: async () => {
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