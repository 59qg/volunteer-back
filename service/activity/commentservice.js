var Comment = require('./model/commentbo');
var ServiceGenerator = require('../common/servicegenerator');

var CommentService = ServiceGenerator.generate(Comment, '_id');

module.exports = CommentService;