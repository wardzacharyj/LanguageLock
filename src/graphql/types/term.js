import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { QueryTypes } from 'sequelize';
import { Tag } from './tag';
import { sequelize } from '../../database';

const Term = new GraphQLObjectType({
  name: 'Term',
  fields: () => ({
    id: { 
      type: GraphQLString,
    },
    side1: {
      type: GraphQLString,
    }, 
    side2: {
      type: GraphQLString,
    },
    side3: {
      type: GraphQLString,
    },
    translation: {
      type: GraphQLString,
    },
    partOfSpeech: {
      type: GraphQLString,
    },
    notes: {
      type: GraphQLString,
    },
    tags: {
      type: GraphQLList(Tag),
      resolve({ id }) {
        const getTermTagsQuery = `
          SELECT Tags.* 
            FROM TermTags 
            INNER JOIN Tags 
            ON TermTags.tagId = Tags.id 
            WHERE TermTags.termId = ${id}`;

        return sequelize.query(getTermTagsQuery, { raw: true, type: QueryTypes.SELECT });
      }
    },
    history: {
      type: History,
      resolve({ lastStudied, occurencesStudied, durationStudied }) {
        return {
          lastStudied,
          occurencesStudied,
          durationStudied
        };
      }
    },
    statistics: {
      type: Statistics,
      resolve(params) {
        return {
          // Correct
          side1_correct: params.side1_correct,
          side2_correct: params.side2_correct,
          side3_correct: params.side3_correct,

          // Unknown
          side1_unknown: params.side1_unknown,
          side2_unknown: params.side2_unknown,
          side3_unknown: params.side3_unknown,

          // Incorrect
          side1_incorrect: params.side1_incorrect,
          side2_incorrect: params.side2_incorrect,
          side3_incorrect: params.side3_incorrect,
        };
      }
    }
  })
});


const Statistics = new GraphQLObjectType({
  name: 'Statistics',
  fields: {
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
  }
});

const History = new GraphQLObjectType({
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
  })
});

export default Term;