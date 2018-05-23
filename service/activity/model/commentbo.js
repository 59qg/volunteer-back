/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义报名表的结构
var commentSchema = mongoose.Schema({
    "user": String,
    "user_id": String,
    "activity": String,
    "activity_id": String,
    "content": String, //评论内容
    "status": {  //状态 0-删除 1-正常
        type: Number,
        default: 1,
    },
},{
    "timestamps": {
        create_time: 'create_time',   //创建时间
        update_time: 'update_time'    //修改时间
    }
});

var comment = mongoose.model('comment', commentSchema); // 将定义好的结构封装成model

module.exports = comment; // 导出bo模块
