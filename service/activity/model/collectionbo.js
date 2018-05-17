/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义报名表的结构
var collectionSchema = mongoose.Schema({
    "user": String,
    "user_id": String,
    "activity": String,
    "activity_id": String,
    "status": Number,//状态 0-未收藏 1-已收藏

},{
    "timestamps": {
        create_time: 'create_time',   //创建时间
        update_time: 'update_time'    //修改时间
    }
});

var collection = mongoose.model('collection', collectionSchema); // 将定义好的结构封装成model

module.exports = collection; // 导出bo模块
