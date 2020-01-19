import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { QueryTypes } from 'sequelize';
import Statistics from './statistics';

import Tag from '../tag';
import { sequelize } from '../../../database';

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
      },
    },
    statistics: {
      type: Statistics,
      resolve({ id }) {
        const getTermStats = `
          SELECT
            min(start) AS firstStudied,
            max(end) AS lastStudied,
            count(termId) AS occurencesStudied,
            SUM(timestampdiff(SECOND, start, end)) AS durationStudied,
            SUM(side1=1 AND correct=1) AS side1_correct,
            SUM(side1=1 AND unknown=1) AS side1_unknown,
            SUM(side1=1 AND wrong=1) AS side1_incorrect,
            SUM(side2=1 AND correct=1) AS side2_correct,
            SUM(side2=1 AND unknown=1) AS side2_unknown,
            SUM(side2=1 AND wrong=1) AS side2_incorrect,
            SUM(side3=1 AND correct=1) AS side3_correct,
            SUM(side3=1 AND unknown=1) AS side3_unknown,
            SUM(side1=3 AND wrong=1) AS side3_incorrect
              FROM Segments 
              WHERE termId = ${id} GROUP BY termId
          `;

        return sequelize.query(getTermStats, { raw: true, type: QueryTypes.SELECT });
      },
    },
  }),
});


export default Term;
