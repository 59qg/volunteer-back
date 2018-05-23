/**
 * 项目BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义用户的结构
var userSchema = mongoose.Schema({
    "name": String, //姓名
    "username":String, //用户名（可用于登陆）
    "gender": Number, //性别 1-男 2-女
    "birth": Date, //出生日期
    "id_card": String, //身份证号
    "phone": String, //手机号（可用于登陆）
    "password": String, //密码
    "email": String, //邮箱
    "address": String, //地址
    "desc": String, //简介
    "education": String, //最高学历
    "education_code": String,
    "nation": String, //民族
    "nation_code": String,
    "political": String, //政治面貌
    "political_code": String,
    "language": Array, //擅长语言
    "service_time": String, //参与服务时间
    "service_time_code": String,
    "service_intention": Array, //服务意向
    "skill": Array, // 知识技能
    "job": String, //工作
    "job_code": String,
    "county": String, //区县
    "county_code": String,
    "street": String, //街道
    "street_code": String,
    "community": String, //社区
    "community_code": String,
    "status": {     //状态 0-禁用 1-正常
        type: Number,
        default: 1,
    }
},{
    "timestamps": {
        create_time: 'create_time',   //创建时间
        update_time: 'update_time'    //修改时间
    }
});

var user = mongoose.model('user', userSchema); // 将定义好的结构封装成model

module.exports = user; // 导出userbo模块
