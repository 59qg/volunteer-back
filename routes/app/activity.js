var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');
var ParamCheck = require('../../common/paramcheck');
var Page = require('../../common/page');
var ActivityService = require('../../service/activity/activityservice')
var EnrollService = require('../../service/activity/enrollservice')

var _privateFun = router.prototype;
_privateFun.prsBO2VO = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            if(ret._id){
                ret.id = ret._id;
                delete ret._id;
            }
            return ret;
        }
    });
    return result;
};

router.route('/list')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            other: ['county','row','start'],
            fuzzy: ['title'],
            paramType: {
                'county': 'string',
                'title': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }
        if(!paramsTmp.query.row) {
            paramsTmp.query.row = 10;
        }else {
            paramsTmp.query.row = Number(paramsTmp.query.row);
        }
        if(!paramsTmp.query.start) {
            paramsTmp.query.start = 0;
        }else {
            paramsTmp.query.start = Number(paramsTmp.query.start);
        }
        ActivityService.findList(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            let objs = ret.data;
            let total = ret.total;
            let page = new Page();
            if (total > 0) {
                objs = objs.map(_privateFun.prsBO2VO);
                page.setData(objs);
                page.setPageAttr(total);
            }
            restmsg.successMsg(); // restmsg状态码设置为成功状态
            restmsg.setResult(page); // restmsg结果部分设置为封装好的page
            res.send(restmsg); // api返回restmsg
        })
    })

router.route('/detail')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            require: {
                id: '活动id'
            },
            paramType: {
                'id': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }
        ActivityService.find(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            else if(ret){
                let data = _privateFun.prsBO2VO(ret[0]);
                restmsg.successMsg('success');
                restmsg.setResult(data);
            }

            res.send(restmsg);
        })
    })

router.route('/enroll')
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        let params = {
            require: {
                activity_id: '活动id'
            },
            paramType: {
                'activity_id': 'string',
            }
        }
        let paramsTmp = ParamCheck.composeParams(req, params);
        if(paramsTmp.err) {
            restmsg.errorMsg(paramsTmp.err);
            return res.send(restmsg);
        }
        EnrollService.find(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            else if(ret.length > 0){
                let data = ret.map(_privateFun.prsBO2VO);
                restmsg.successMsg('success');
                restmsg.setResult(data);
            }
            else{
                restmsg.successMsg('success');
                restmsg.setResult(ret);
            }
            res.send(restmsg);
        })
    })

module.exports = router;