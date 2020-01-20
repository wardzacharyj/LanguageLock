import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { QueryTypes } from 'sequelize';
import Statistics from './statistics';

import Tag from '../tag';
import Segment from '../segment';
import { sequelize, Segments } from '../../../database';

const Term = new GraphQLObjectType({
  name: 'Term',
  fields: () => ({
    id: {
      type: GraphQLString,
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
      resolve: async ({ id }) => {
        const getTermStats = `
          SELECT
            min(start) AS firstStudied,
            max(end) AS lastStudied,
            count(termId) AS occurencesStudied,
            SUM(timestampdiff(SECOND, start, end)) AS durationStudied,
            SUM(usedSide1=1 AND correct=1) AS side1_correct,
            SUM(usedSide1=1 AND unknown=1) AS side1_unknown,
            SUM(usedSide1=1 AND wrong=1) AS side1_wrong,
            SUM(usedSide2=1 AND correct=1) AS side2_correct,
            SUM(usedSide2=1 AND unknown=1) AS side2_unknown,
            SUM(usedSide2=1 AND wrong=1) AS side2_wrong,
            SUM(usedSide3=1 AND correct=1) AS side3_correct,
            SUM(usedSide3=1 AND unknown=1) AS side3_unknown,
            SUM(usedSide3=1 AND wrong=1) AS side3_wrong
              FROM Segments 
              WHERE termId = ${id} GROUP BY termId
          `;
        const results = await sequelize.query(getTermStats, { raw: true, type: QueryTypes.SELECT });
        const hasStats = results && results.length > 0;
        return hasStats ? results[0] : {};
      },
    },
    segments: {
      type: new GraphQLList(Segment),
      resolve({ id }) {
        return Segments.findAll({ where: { termId: id } });
      },
    },
  }),
});


export default Term;
