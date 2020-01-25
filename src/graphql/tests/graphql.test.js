
import DB from '../../database';
import {
  MockServer,
  MockIds,
  MockTypes,
  MockBatchWithId,
  expectErrorResponse,
  expectEmptyResponse,
  expectValidResponse,
  MockTermWithId,
} from './MockUtils';


describe('Queries', () => {
  let graphServer;

  beforeAll(async (done) => {
    graphServer = await MockServer();
    await DB.ready();
    done();
  });

  afterAll(async (done) => {
    await graphServer.stop();
    await DB.root.close();
    done();
  });

  describe('Term', () => {
    it('Should fail to resolve term query with id as string', async (done) => {
      const { errors } = await graphServer.query(MockTermWithId(MockIds.string));
      expectErrorResponse(errors, 'Expected type Int, found "string".');
      done();
    });

    it('Should fail to resolve term query with id as floating point number', async (done) => {
      const { errors } = await graphServer.query(MockTermWithId(MockIds.decicmal));
      expectErrorResponse(errors, `Expected type Int, found ${MockIds.decicmal}.`);
      done();
    });

    it('Should fail to resolve term query with blank id', async (done) => {
      const { errors } = await graphServer.query(MockTermWithId(MockIds.blank));
      expectErrorResponse(errors, 'Syntax Error: Unexpected )');
      done();
    });

    it('Should resolve term query with non-existent negative number id as null', async (done) => {
      const result = await graphServer.query(MockTermWithId(MockIds.negative));
      expectEmptyResponse(MockTypes.term, result);
      done();
    });

    it('Should resolve term query with no id provided as null', async (done) => {
      const result = await graphServer.query(MockTermWithId(MockIds.missing));
      expectEmptyResponse(MockTypes.term, result);
      done();
    });

    it('Should resolve term query when a valid id is provided', async (done) => {
      const result = await graphServer.query(MockTermWithId(MockIds.valid));
      expectValidResponse(MockTypes.term, result);
      done();
    });
  });

  describe('Batches', () => {
    it('Should fail to resolve batch query with id as string', async (done) => {
      const { errors } = await graphServer.query(MockBatchWithId(MockIds.string));
      expectErrorResponse(errors, 'Expected type Int, found "string".');
      done();
    });

    it('Should fail to resolve batch query with id as floating point number', async (done) => {
      const { errors } = await graphServer.query(MockBatchWithId(MockIds.decicmal));
      expectErrorResponse(errors, `Expected type Int, found ${MockIds.decicmal}.`);
      done();
    });

    it('Should fail to resolve batch query with blank id', async (done) => {
      const { errors } = await graphServer.query(MockBatchWithId(MockIds.blank));
      expectErrorResponse(errors, 'Syntax Error: Unexpected )');
      done();
    });

    it('Should resolve batch query with non-existent id as an empty array', async (done) => {
      const result = await graphServer.query(MockBatchWithId(MockIds.negative));
      expectEmptyResponse(MockTypes.batch, result);
      done();
    });

    it('Should resolve batch query with no id provided as null', async (done) => {
      const { errors } = await graphServer.query(MockBatchWithId(MockIds.missing));
      expectErrorResponse(errors, 'Invalid batch id provided');
      done();
    });
  });
});
