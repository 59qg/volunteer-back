var Page = require('../../common/restmsg');
var Activity = require('./model/acitvitybo');
var Collection = require('./model/collection');
var Comment = require('./model/comment');
var Enroll = require('./model/enroll');

var Page = require('../../common/page');

function ActivityService() {}

//根据条件查询数据
ActivityService.find = function(query, callback) {
    Activity.find(query, function(err, ret) {
        if (err) {
            return callback(err);
        }
        callback(null, ret);
    })
}

// 列表查询,分页
ActivityService.findList = function(query, callback, top) {
    if (!query) {
        query = {};
    }

    //处理分页
    var row = query.row;
    var start = query.start;
    var options = { '$slice': 2 };
    options['limit'] = row;
    options['skip'] = start;
    options['sort'] = { 'createdAt': -1 }; //按时间逆序排序
    if (top) {
        options['sort'] = { 'top': -1 };
    }
    delete query.row;
    delete query.start;
    var page = new Page();
    Activity.count(query, function(err, count) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        if (count === 0) { //无数据
            callback(null, page);
            return;
        }
        Activity.find(query, null, options, function(err, bos) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            page.setPageAttr(count);
            page.setData(bos);
            return callback(null, page);
        });
    });
};


//保存
ActivityService.save = function(bo, callback) {
    if (!bo.clients || bo.clients == '') {
        bo.clients = ['app', 'sms']
    }
    if (!bo.desctype || bo.desctype == '') {
        bo.desctype = 'txt';
    }
    var entity = new Activity(bo);
    entity.save(entity, function(err, ret) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        return callback(null, ret);

    })
}

//修改（根据id）
ActivityService.update = function(id, bo, callback) {
    Activity.findOne({ _id: id }, function(err, org) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        Activity.update({ _id: id }, bo, function(err, ret) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            callback(null, ret);
        })
    })
}

//删除
ActivityService.delete = function(query, callback) {
    if (!query) {
        query = {};
    }
    Activity.remove(query, function(err, ret) {
        if (err) {
            return callback(err);
        }
        callback(null, ret);
    })
}

// 根据查询条件统计
ActivityService.countByQuery = function(query, callback) {
    if (!query) {
        query = {};
    }
    Activity.count(query, function(err, count) {
        if (err) {
            return callback(err);
        }
        callback(null, count);
    })
};

// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}
module.exports = ActivityService;