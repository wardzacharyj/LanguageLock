import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { QueryTypes } from 'sequelize';
import { Term } from './term';
import DB from '../../database';


const Tag = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    createdAt: {
      type: GraphQLString,
      resolve({ createdAt }) {
        return createdAt ? createdAt.toISOString() : null;
      },
    },
    updatedAt: {
      type: GraphQLString,
      resolve({ updatedAt }) {
        return updatedAt ? updatedAt.toISOString() : null;
      },
    },
    name: {
      type: GraphQLString,
    },
    terms: {
      type: GraphQLList(Term),
      resolve({ id }) {
        const getTermsWithTagIdQuery = `
          SELECT Terms.*
          FROM Terms 
          INNER JOIN TermTags 
            ON TermTags.termId = Terms.id
          INNER JOIN Tags 
            ON TermTags.tagId = Tags.id
          WHERE Tags.id = ${id}`;

        return DB.root.query(getTermsWithTagIdQuery, { raw: true, type: QueryTypes.SELECT });
      },
    },
  }),
});

export default Tag;
