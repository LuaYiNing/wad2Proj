const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'wad2Proj',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

