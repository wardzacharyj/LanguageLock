
import mockServer from '../../mockServer';
import DB from '../../database';

const MockTermId = {
  STRING: '"string"',
  FLOAT: 1.1,
  NEGATIVE: -1,
  EMPTY: null,
  NONE: undefined,
};

const ValidTermRequestMessage = `{
  term(id: 1) {
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
      id
    },
    statistics {
      firstStudied
    },
    segments {
      id
    }
  }
}`;

const generateTestTermMessage = (idValue) => {
  let header;
  if (typeof idValue === 'undefined') {
    header = '';
  } else if (idValue === null) {
    header = '(id: )';
  } else {
    header = `(id: ${idValue})`;
  }
  return `{
    term${header} {
      id
    }
  }`;
};

const expectEmptyTermResponse = (result, done) => {
  expect(result).toBeDefined();
  const { data } = result;
  expect(data).toBeDefined();
  const { term } = data;
  expect(term).toBe(null);
  done();
};

const expectErrorTermResponse = (errors, expectedErrorMessage, done) => {
  expect(errors).toBeDefined();
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toBeGreaterThan(0);
  const { message } = errors[0];
  expect(message).toBeDefined();
  expect(message).toEqual(expectedErrorMessage);
  done();
};

describe('Term', () => {
  let graphServer;

  beforeAll(async (done) => {
    graphServer = await mockServer();
    await DB.ready();
    done();
  });

  afterAll(async (done) => {
    await graphServer.stop();
    await DB.root.close();
    done();
  });

  describe('Queries', () => {
    it('Should fail to resolve term query with id as string', async (done) => {
      const { errors } = await graphServer.query(generateTestTermMessage(MockTermId.STRING));
      expectErrorTermResponse(errors, 'Expected type Int, found "string".', done);
    });

    it('Should fail to resolve term query with id as floating point number', async (done) => {
      const { errors } = await graphServer.query(generateTestTermMessage(MockTermId.FLOAT));
      expectErrorTermResponse(errors, `Expected type Int, found ${MockTermId.FLOAT}.`, done);
    });

    it('Should fail to resolve term query with empty id', async (done) => {
      const { errors } = await graphServer.query(generateTestTermMessage(MockTermId.EMPTY));
      expectErrorTermResponse(errors, 'Syntax Error: Unexpected )', done);
    });

    it('Should resolve term query with non-existent negative number id as null', async (done) => {
      const result = await graphServer.query(generateTestTermMessage(MockTermId.NEGATIVE));
      expectEmptyTermResponse(result, done);
    });

    it('Should resolve term query with no id provided as null', async (done) => {
      const result = await graphServer.query(generateTestTermMessage(MockTermId.NONE));
      expectEmptyTermResponse(result, done);
    });

    it('Should resolve term query when a valid id is provided', async (done) => {
      const result = await graphServer.query(ValidTermRequestMessage);
      expect(result).toBeDefined();
      const { data } = result;
      expect(data).toBeDefined();
      const { term } = data;
      expect(term).toBeDefined();
      const requiredKeys = [
        'id',
        'createdAt',
        'updatedAt',
        'side1',
        'side2',
        'side3',
        'translation',
        'partOfSpeech',
        'notes',
        'tags',
        'statistics',
        'segments',
      ];
      const missingKeys = Object.keys(term)
        .filter((keyInResponse) => !requiredKeys.includes(keyInResponse));
      expect(missingKeys.length).toBe(0);
      done();
    });
  });
});
