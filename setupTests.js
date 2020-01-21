// Required to make iconv load the encodings module,
// otherwise jest crashes from the lazy loading.
// See Github Issue: https://github.com/sidorares/node-mysql2/issues/489
require('mysql2/node_modules/iconv-lite').encodingExists();
