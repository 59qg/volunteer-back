/**
 * 数据库连接
 * @type {exports}
 */
var mongoose = require('mongoose');
const Const = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(Const.mongodb.url,{
    useMongoClient: true
});

module.exports = mongoose;

