var Page = require('../../common/restmsg');
var Group = require('./model/groupbo');

var Page = require('../../common/page');

function GroupService() {}

//根据条件查询数据
GroupService.find = function(query, callback) {
    Group.find(query, function(err, ret) {
        if (err) {
            return callback(err);
        }
        callback(null, ret);
    })
}

// 列表查询,分页
GroupService.findList = function(query, callback, top) {
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
    Group.count(query, function(err, count) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        if (count === 0) { //无数据
            callback(null, page);
            return;
        }
        Group.find(query, null, options, function(err, bos) {
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
GroupService.save = function(bo, callback) {
    var entity = new Group(bo);
    entity.save(entity, function(err, ret) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        return callback(null, ret);

    })
}

//修改（根据id）
GroupService.update = function(id, bo, callback) {
    Group.findOne({ _id: id }, function(err, org) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        Group.update({ _id: id }, bo, function(err, ret) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            callback(null, ret);
        })
    })
}

//删除
GroupService.delete = function(query, callback) {
    if (!query) {
        query = {};
    }
    Group.remove(query, function(err, ret) {
        if (err) {
            return callback(err);
        }
        callback(null, ret);
    })
}

// 根据查询条件统计
GroupService.countByQuery = function(query, callback) {
    if (!query) {
        query = {};
    }
    Group.count(query, function(err, count) {
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
module.exports = GroupService;