var Enroll = require('./model/enrollbo');
var ServiceGenerator = require('../common/servicegenerator');

var EnrollService = ServiceGenerator.generate(Enroll, '_id');

module.exports = EnrollService;