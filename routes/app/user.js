var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');
var ParamCheck = require('../../common/paramcheck');
var Moment = require('moment');
var UserService = require('../../service/user/userservice');
var Auth = require('../../service/auth/app/auth');

var _privateFun = router.prototype;
_privateFun.prsBO2VO = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            if(ret._id){
                ret.id = ret._id;
                delete ret._id;
            }
            if(ret.id_card){
                ret.id_card = ret.id_card.substring(0, 3) + '***********' + ret.id_card.substring(13, str.length);
            }
            if(ret.phone) {
                ret.phone = ret.phone.substring(0,3)+'****'+ret.phone.substring(7, str.length);
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
                name: 'string',
                username: 'string',
                gender: 'Number',
                birth: 'string',
                id_card: 'string',
            }
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
            else if(ret.length ===1){
               // req.session.id = ret._id;
                let data = ret.map(_privateFun.prsBO2VO);
                data.token = Auth(data.id);
                restmsg.successMsg();
                restmsg.setResult(data);
            }
            return res.send(restmsg);
        })

    })

module.exports = router;