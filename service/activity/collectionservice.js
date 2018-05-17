var Collection = require('./model/collectionbo');
var ServiceGenerator = require('../common/servicegenerator');

var CollectionService = ServiceGenerator.generate(Collection, '_id');

module.exports = CollectionService;