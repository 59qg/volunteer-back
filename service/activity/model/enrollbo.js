/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义报名表的结构
var enrollSchema = mongoose.Schema({
    "user": String,
    "user_id": String,
    "activity": String,
    "activity_id": String,
    "status": Number,//状态 0-报名申请中 1-报名通过 2-已拒绝 3-未报名
    "enroll_time": Date, //报名时间
    "review_time": Date, //审核时间
},{
    "timestamps": {
        create_time: 'create_time',   //创建时间
        update_time: 'update_time'    //修改时间
    }
});

var enroll = mongoose.model('enroll', enrollSchema); // 将定义好的结构封装成model

module.exports = enroll; // 导出bo模块
