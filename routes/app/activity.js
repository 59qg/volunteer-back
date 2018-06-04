var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');
var ParamCheck = require('../../common/paramcheck');
var Page = require('../../common/page');
var ActivityService = require('../../service/activity/activityservice');
var EnrollService = require('../../service/activity/enrollservice');
var CommentService = require('../../service/activity/commentservice');

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
           // console.log(ret)
            let objs = ret.data;
            let total = ret.total;
            let page = new Page();
            if (total > 0) {
                objs = objs.map(_privateFun.prsBO2VO);
            }
            let data = [];
            //统计报名
            let flag = 0;
            for(let i in objs) {
               // console.log(i);
                ActivityService.updateStatus(objs[i], (err, rets) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                   // console.log(ret)
                    objs[i] = rets;
                   // console.log(objs[i]);
                    EnrollService.find({activity_id:objs[i].id},(err, ret) => {
                        if(err) {
                            restmsg.errorMsg(err);
                            return res.send(restmsg);
                        }
                        objs[i].enrollNum = ret.length;
                        objs[i].enroll = ret;
                        objs[i].recruited = 0;
                        if(ret.length > 0) {
                            for(let k in ret) {
                                if(ret[k].status == 1) {
                                    objs[i].recruited = objs[i].recruited+1;
                                }
                            }
                        }
                        flag = flag+1;
                       // console.log(flag);
                        if(flag == total) {
                            page.setData(objs);
                            page.setPageAttr(total);
                            restmsg.successMsg(); // restmsg状态码设置为成功状态
                            restmsg.setResult(page); // restmsg结果部分设置为封装好的page
                            res.send(restmsg); // api返回restmsg
                        }
                    })
                })

            }

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
        ActivityService.find(paramsTmp.query, (err, rets) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            else if(rets){
                let data = _privateFun.prsBO2VO(rets[0]);
               // console.log(data);
                EnrollService.find({activity_id:data.id},(err, ret) => {
                    if(err) {
                        restmsg.errorMsg(err);
                        return res.send(restmsg);
                    }
                   // console.log(ret);
                    data.enrollNum = ret.length;
                    data.enroll = ret;
                    data.recruited = 0;
                    if(ret.length > 0) {
                        for(let k in ret) {
                            if(ret[k].status == 1) {
                                data.recruited = data.recruited+1;
                            }
                        }
                    }
                    restmsg.successMsg('success');
                    restmsg.setResult(data);
                    res.send(restmsg);
                })
            }

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

router.route('/comment')
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

        CommentService.find(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            else if(ret.length > 0){
                let data = ret.map(_privateFun.prsBO2VO);
                restmsg.successMsg('success');
                restmsg.setResult(data);
            }
            else{
                restmsg.setNoData('success');
            }
            res.send(restmsg);
        })
    })
module.exports = router;