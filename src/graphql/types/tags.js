import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql';
import { Tags, sequelize } from '../../database';
import Term from './term';
import { QueryTypes } from 'sequelize';

const TermTag = new GraphQLObjectType({
  name: 'TermTag',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLInt,
      resolve({ tagId }) {
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

        return sequelize.query(getTermsWithTagIdQuery, { raw: true, type: QueryTypes.SELECT })
      }
    }
  })
});

export { 
  Tag,
  TermTag,
};