var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');
var ParamCheck = require('../../common/paramcheck');
var Moment = require('moment');
var UserService = require('../../service/user/userservice');
var Auth = require('../../service/auth/app/auth');
var EnrollService = require('../../service/activity/enrollservice');
var ActivityService = require('../../service/activity/activityservice');
var CollectionService = require('../../service/activity/collectionservice');
var CommentService = require('../../service/activity/commentservice');
var UploadService = require('../../service/common/uploadservice');

var _privateFun = router.prototype;
_privateFun.prsBO2VO = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            if(ret._id){
                ret.id = ret._id;
                delete ret._id;
            }
            if(ret.id_card){
                ret.id_card = ret.id_card.substring(0, 3) + '***********' + ret.id_card.substring(13, ret.id_card.length);
            }
            if(ret.phone) {
                ret.phone = ret.phone.substring(0,3)+'****'+ret.phone.substring(7, ret.phone.length);
            }
            return ret;
        }
    });
    return result;
};

router.route('/register')
    //注册
    .post(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            require: {
                username: '用户名',
                password: '密码',
                phone: '手机号'
            },
            paramType: {
                'username': 'string',
                'password': 'string',
                'phone': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }

        UserService.dumplicate(null, paramsTmp.username, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            if(ret) {
                restmsg.successMsg('用户名重复');
                return res.send(restmsg);
            }
            UserService.findOne({phone: paramsTmp.query.phone}, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                if(ret) {
                    restmsg.successMsg('手机号重复');
                    return res.send(restmsg);
                }
                UserService.save(paramsTmp.query, (err, ret) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                    restmsg.successMsg('注册成功');
                    return res.send(restmsg);

                })
            })
        })
    })

//验证手机号和用户名
router.route('/registercheck')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            other: ['username','phone'],
            paramType: {
                'username': 'string',
                'phone': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }
        if(paramsTmp.query.username) {
            UserService.dumplicate(null, paramsTmp.query.username, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                if(ret) {
                    restmsg.successMsg('用户名重复');
                    return res.send(restmsg);
                }
                restmsg.successMsg('用户名可使用');
                return res.send(restmsg);
            })
        }
        else if(paramsTmp.query.phone) {
            UserService.findOne({phone: paramsTmp.query.phone}, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                if(ret) {
                    restmsg.successMsg('手机号重复');
                    return res.send(restmsg);
                }
                restmsg.successMsg('手机号可使用');
                return res.send(restmsg);
            })
        }
    })

router.route('/login')
    //登陆
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            require: {
                account: '用户名或手机号',
                password: '密码',
            },
            paramType: {
                'account': 'string',
                'password': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }

        UserService.login(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            if(ret.length === 0) {
                restmsg.setNoData('账号或密码错误');
            }
            else if(ret){
                let data = _privateFun.prsBO2VO(ret);
                let token = Auth(null, data.id);
                data.token = token;
                restmsg.successMsg('登陆成功');
                restmsg.setResult(data);
            }
            return res.send(restmsg);
        })

    })

router.route('/')
    //获取用户信息
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.query.token;
        let uid = Auth(token, null);
        UserService.findOne({_id: uid}, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            let data = _privateFun.prsBO2VO(ret);
            restmsg.successMsg();
            restmsg.setResult(data);
            return res.send(restmsg);
        })
    })

    //修改用户信息
    .put(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.params.token;
        let uid = Auth(token, null);
        UserService.update(uid, paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            restmsg.successMsg('修改成功');
            return res.send(restmsg);
        })
    })

router.route('/enroll')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.query.token;
        let query = {}
        query.user_id = Auth(token, null);
        if(req.query.activity_id) {
            query.activity_id = req.query.activity_id;
        //    console.log(query.user_id);
         //   console.log(query.activity_id);
        }
        EnrollService.find(query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            restmsg.successMsg('success');
            restmsg.setResult(ret);
            res.send(restmsg);
        })
    })

    .post(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.body.token;
        let query = {}
        query.user_id = Auth(token, null);
        query.activity_id = req.body.activity_id;
        query.enroll_time = Date.now();
        UserService.findOne({id:query.user_id}, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
           // console.log(ret);
            query.user = ret.username;
            query.user_gender = ret.gender;
            ActivityService.find({id:query.activity_id}, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                query.activity = ret[0].title;
                if(ret[0].review === 0){
                    query.status = 1;
                    query.review_time = Date.now();
                }
                let recruit_time = ret[0].recruit_time;
                if(!(Date.now() < recruit_time)) {
                    restmsg.successMsg('failed');
                    return res.send(restmsg);
                }
                let recruitment = ret[0].recruitment;
                EnrollService.find({activity_id: query.activity_id}, (err, ret) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                    if(ret.length === recruitment){
                        restmsg.successMsg('failed');
                        return res.send(restmsg);
                    }
                    else {
                        for(let i in ret){
                            if(ret[i].user_id === query.user_id){
                                restmsg.successMsg('failed');
                                return res.send(restmsg);
                            }
                        }
                        EnrollService.save(query, (err, ret) => {
                            if(err) {
                                restmsg.errorMsg(err);
                                return res.send(restmsg);
                            }
                            restmsg.successMsg('success');
                            return res.send(restmsg);
                        })
                    }

                })
            })
        })
    })

    .delete(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.query.token;
        let query = {}
        query.user_id = Auth(token, null);
        query.activity_id = req.query.activity_id;
        EnrollService.remove(query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            restmsg.successMsg('success');
            restmsg.setResult(ret);
            res.send(restmsg);
        })
    })

router.route('/collect')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.query.token;
        let query = {}
        query.user_id = Auth(token, null);
        if(req.query.activity_id) {
            query.activity_id = req.query.activity_id;
        }
        CollectionService.find(query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            restmsg.successMsg('success');
            restmsg.setResult(ret);
            res.send(restmsg);
        })
    })

    .post(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.body.token;
        let query = {}
        query.user_id = Auth(token, null);
        query.activity_id = req.body.activity_id;
        UserService.findOne({id:query.user_id}, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            query.user = ret.username;
            ActivityService.find({id:query.activity_id}, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                query.activity = ret[0].title;

                CollectionService.find({activity_id: query.activity_id,user_id: query.user_id}, (err, ret) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                    if(ret.length > 0){
                        restmsg.successMsg('failed');
                        return res.send(restmsg);
                    }
                    else {
                        CollectionService.save(query, (err, ret) => {
                            if(err) {
                                restmsg.errorMsg(err);
                                return res.send(restmsg);
                            }
                            restmsg.successMsg('success');
                            return res.send(restmsg);
                        })
                    }

                })
            })
        })
    })

    .delete(function(req, res, next) {
        let restmsg = new RestMsg();
        let token = req.query.token;
        let query = {}
        query.user_id = Auth(token, null);
        query.activity_id = req.query.activity_id;
        CollectionService.remove(query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            restmsg.successMsg('success');
            restmsg.setResult(ret);
            res.send(restmsg);
        })
    })

router.route('/comment')
    //添加评论
    .post(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            require: {
                token: 'token',
                activity_id: '活动id',
                content: '内容',
                star: '评分',
            },
            paramType: {
                'token': 'string',
                'content': 'string',
                'star': 'number',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }

        let query = {}
        query.star = paramsTmp.query.star;
        query.content = paramsTmp.query.content;
        query.user_id = Auth(paramsTmp.query.token, null);
        query.activity_id = paramsTmp.query.activity_id;
        UserService.findOne({id: query.user_id}, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            query.user = ret.username;
            ActivityService.find({id:query.activity_id}, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                query.activity = ret[0].title;

              //  console.log(query);
                CommentService.save(query, (err, ret) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                 //   console.log(ret);
                    restmsg.successMsg('success');
                    return res.send(restmsg);
                })
            })
        })
    })

router.route('/pic')
    //上传头像
    .post(function(req, res, next) {
        let restmsg = new RestMsg();
        let query = {};

        UploadService.upload(req, (err, rest) => {
            if(err) {
                console.error(err);
                restmsg.errorMsg();
                return res.send(restmsg);
            }
            let token = rest.data.token;
            let id = Auth(token, null);
            let paths = rest.path.split('\\');
            let path = "http:\/\/127.0.0.1:3020\/volunteer\/"+paths[4]+'\/'+paths[5]+
                '\/'+paths[6]+'\/'+paths[7];
            query.pic = path;
            UserService.update(id, query, (err, ret) => {
                if(err) {
                    restmsg.errorMsg(err);
                    return res.send(restmsg);
                }
                restmsg.successMsg('照片上传成功');
                return res.send(restmsg);
            })

        })

    })

router.route('/psd')
    //修改密码
    .put(function(req, res, next) {
        let restmsg = new RestMsg();

        let params = {
            require: {
                token: 'token',
                oldPsd: '旧密码',
                newPsd: '新密码'
            },
            paramType: {
                'token': 'string',
                'oldPsd': 'string',
                'newPsd': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }

        let token = paramsTmp.query.token;
        let uid = Auth(token, null);
        let query = {};
        query.id = uid;
        query.password = paramsTmp.query.oldPsd;

        UserService.findOne(query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
                return res.send(restmsg);
            }
            if(ret){
                query.password = paramsTmp.query.newPsd;
                UserService.update(uid, query, (err, rest) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                    restmsg.successMsg('修改密码成功');
                    return res.send(restmsg);
                });
            }
            else{
                restmsg.successMsg('旧密码错误');
                return res.send(restmsg);
            }
        })
    })
module.exports = router;