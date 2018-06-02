/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义活动的结构
var newsSchema = mongoose.Schema({
    "title": String, //标题
    "content": String, //内容
    "time": Date,//时间
    "status": {      //状态 0-禁用 1-正常
        type: Number,
        default: 1,
    }
},{
    "timestamps": {
        createdAt: 'createdAt',   //创建时间
        updatedAt: 'updatedAt'    //修改时间
    }
});

var news = mongoose.model('news', newsSchema, 'news'); // 将定义好的结构封装成model

module.exports = news; // 导出bo模块
