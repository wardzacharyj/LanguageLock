
import express from 'express';
import { graphql } from 'graphql';
import request from 'request-promise';
import schema from '..';
import MockValidator from './MockValidator';

const MockTypes = {
  tag: 'tag',
  term: 'term',
  batch: 'batch',
  segment: 'segment',
  statistics: 'statistics',
};

const MockIds = {
  valid: 1,
  string: '"string"',
  decicmal: 1.1,
  negative: -1,
  boolean: false,
  blank: null,
  missing: undefined,
};

const MockSignularQueries = {
  term: `{
    id,
    createdAt,
    updatedAt,
    side1,
    side2,
    side3,
    translation,
    partOfSpeech,
    notes,
    tags {
      id,
      createdAt,
      updatedAt,
      name,
      terms {
        id
      }
    },
    statistics {
      firstStudied,
      lastStudied,
      durationStudied,
      occurrencesStudied,
      side1_correct,
      side2_correct,
      side3_correct,
      side1_unknown,
      side2_unknown,
      side3_unknown,
      side1_wrong,
      side2_wrong,
      side3_wrong,
    },
    segments {
      id,
      batchId,
      termId,
      start,
      end,
      usedSide1,
      usedSide2,
      usedSide3,
      correct,
      unknown,
      wrong,
      term {
        id
      }
    }
  }`,
  segment: `{
    id,
    batchId,
    termId,
    start,
    end,
    usedSide1,
    usedSide2,
    usedSide3,
    correct,
    unknown,
    wrong,
    term {
      id
    }
  }`,
};


const generateSingularMessage = (type, idValue) => {
  let header;
  let messageBody = `{
    id
  }`;
  switch (idValue) {
    case MockIds.missing:
      header = '';
      break;
    case MockIds.blank:
      header = '(id: )';
      break;
    case MockIds.boolean:
      header = `(id: ${idValue})`;
      break;
    case MockIds.decicmal:
      header = `(id: ${idValue})`;
      break;
    case MockIds.negative:
      header = `(id: ${idValue})`;
      break;
    case MockIds.string:
      header = `(id: ${idValue})`;
      break;
    case MockIds.valid:
      header = `(id: ${idValue})`;
      messageBody = MockSignularQueries[type];
      break;
    default:
      throw new Error(`Invalid Mock Id Type Provided, ${type}`);
  }

  const singularMessage = `{
    ${type}${header} ${messageBody}
  }`;

  return singularMessage;
};

const MockBatchWithId = (idType) => generateSingularMessage(MockTypes.batch, idType);
const MockTermWithId = (idType) => generateSingularMessage(MockTypes.term, idType);


const MockServer = (port) => new Promise((resolve, reject) => {
  const app = express();
  app.get('/graphql', (req, res) => {
    const { queryBody } = req.query;

    if (!queryBody) {
      return res.status(500).send('You must provide a valid query');
    }

    return graphql(schema, queryBody)
      .then((data) => res.json(data))
      .catch((err) => {
        throw err;
      });
  });

  const portUsed = port || 8000;
  const server = app.listen(portUsed);

  resolve(
    {
      stop: async () => server.close(),
      query: (queryBody) => request(
        {
          baseUrl: `http://localhost:${portUsed}`,
          uri: '/graphql',
          qs: { queryBody },
          resolveWithFullResponse: false,
          json: true,
        },
      ),
    },
  );
});


const expectEmptyResponse = (type, result) => {
  expect(result).toBeDefined();
  const { data } = result;
  expect(data).toBeDefined();
  expect(Array.isArray(data[type]) || data[type] === null).toBe(true);
};

const expectErrorResponse = (errors, expectedErrorMessage) => {
  expect(errors).toBeDefined();
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toBeGreaterThan(0);
  const { message } = errors[0];
  expect(message).toBeDefined();
  expect(message).toEqual(expectedErrorMessage);
};


const expectValidResponse = (type, result) => {
  expect(result).toBeDefined();
  const { data } = result;
  expect(data).toBeDefined();
  expect(data[type]).toBeDefined();
  const body = data[type];
  const validationMethod = MockValidator[type];
  const validationResult = validationMethod(body);
  expect(validationResult).toBe(true);
};

export {
  MockServer,
  MockIds,
  MockTypes,
  MockBatchWithId,
  MockTermWithId,
  expectValidResponse,
  expectEmptyResponse,
  expectErrorResponse,
};
