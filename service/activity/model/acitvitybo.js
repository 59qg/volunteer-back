/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义活动的结构
var activitySchema = mongoose.Schema({
    "title": String, //标题
    "content": String, //内容
    "time": Date, //活动开展时间
    "duration": String, //活动持续时间
    "address": String, //活动地点
    "recruit_time": Date, //招募截至时间
    "recruitment": Number, //招募人数
    "require": String, // 报名要求
    "review": Number,//是否需要报名审核
    "group": String, //发起组织
    "group_code": String,
    "user": String, //联系人
    "phone": String, //联系电话
    "county": String, //区县
    "county_code": String,
    "img": String,//图片
    "status": {      //状态 0-禁用 1-审核中 2-招募中 3-开展中 4-已结束 5-已拒绝
        type: Number,
        default: 1,
    }
},{
    "timestamps": {
        createdAt: 'createdAt',   //创建时间
        updatedAt: 'updatedAt'    //修改时间
    }
});

var activity = mongoose.model('activity', activitySchema, 'activitys'); // 将定义好的结构封装成model

module.exports = activity; // 导出bo模块
