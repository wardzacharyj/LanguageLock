
import mockServer from '../mockServer';
import DB from '../database';


describe('GraphQL', () => {
  let graphServer;

  beforeAll(async () => {
    await DB.reset();
    graphServer = await mockServer();
  });
  afterAll(() => graphServer.close());

  describe('Term Queries', () => {
    describe('Term', () => {
      it('Should fail to resolve malformed term query', () => {
        // String
        // Float
        // null
        // undefined
        // -1
      });

      it('Should fail to resolve non-existent term id', () => {
        // 3232322
      });

      it('Should fail to resolve request with invalid key', () => {
        /*
          {
            id
            invalidKey
          }
        */
      });

      it('Should resolve full term with valid id ', () => {
        // 1
      });
    });

    describe('Terms', () => {
      it('Should fail to resolve malformed terms query', () => {
        /*
          {
            id
            invalidKey
          }
        */
      });
      it('Should resolve terms without sort', () => {
        /*
          terms {

          }
        */
      });
      it('Should resolve terms for all valid sort options', () => {
        /*
          terms {
            id
          }
        */
      });
      it('Should fail to resolve invalid sort option', () => {
        /*
          terms(sort: 'ASC') {
            id
          }
        */
      });
    });
  });

  /*
  it('Should resolve Term', async () => {
    const message = `{
      term(id: 1) {
        id
      }
    }`;
    const expected = {
      term: {
        id: 1,
      },
    };

    const result = await graphServer.query(message);
    console.log(result);

    return true;

    return query(app, queryMessage).then((response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expected);
    });
    */
});
