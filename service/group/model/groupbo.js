/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义组织的结构
var groupSchema = mongoose.Schema({
    "code": String, //组织编码
    "name": String, //名称
    "desc": String, //简介
    "user": String, //负责人
    "phone": String, //联系电话
    "address": String, //地址
    "sign_name": String, //登陆名
    "password": String, //密码
    "county": String, //区县
    "county_code": String,
    "street": String, //街道
    "street_code": String,
    "community": String, //社区
    "community_code": String,
    "status": {
        type: Number,
        default: 1,
    }//状态 0-禁用 1-正常
},{
    "timestamps": {
        create_time: 'create_time',   //创建时间
        update_time: 'update_time'    //修改时间
    }
});

var user = mongoose.model('user', userSchema); // 将定义好的结构封装成model

module.exports = user; // 导出userbo模块
