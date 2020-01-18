import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

const Backup = new GraphQLObjectType({
  name: 'Backup',
  fields: () => ({
    downloadUrl: {
      type: GraphQLString,
      resolve({ filename }) {
        return `localhost:3000/backups/${encodeURIComponent(filename)}`;
      }
    },
    year: {
      type: GraphQLInt,
      resolve({ filename }) {
        const date = new Date(filename.substring(0, filename.indexOf('.')));
        return date.getFullYear();
      }
    },
    month: {
      type: GraphQLInt,
      resolve({ filename }) {
        const date = new Date(filename.substring(0, filename.indexOf('.')));
        return date.getMonth();
      }
    },
    day: {
      type: GraphQLInt,
      resolve({ filename }) {
        const date = new Date(filename.substring(0, filename.indexOf('.')));
        return date.getDay();
      }
    },
    hour: {
      type: GraphQLInt,
      resolve({ filename }) {
        const date = new Date(filename.substring(0, filename.indexOf('.')));
        return date.getHours();
      }
    },
    minute: {
      type: GraphQLInt,
      resolve({ filename }) {
        const date = new Date(filename.substring(0, filename.indexOf('.')));
        return date.getMinutes();
      }
    }
  })
});

export default Backup;