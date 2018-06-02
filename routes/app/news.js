var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');
var ParamCheck = require('../../common/paramcheck');
var Page = require('../../common/page');
var NewsService = require('../../service/News/Newsservice')

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
            other: ['row','start'],
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
        NewsService.findList(paramsTmp.query, (err, ret) => {
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
                id: '新闻id'
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
        NewsService.find(paramsTmp.query, (err, ret) => {
            if(err) {
                restmsg.errorMsg(err);
            }
            else if(ret){
                let data = _privateFun.prsBO2VO(ret);
                restmsg.successMsg('登陆成功');
                restmsg.setResult(data);
            }

            res.send(restmsg);
        })
    })
module.exports = router;