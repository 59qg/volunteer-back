var User = require('./model/userbo');
var Page = require('../../common/page');

function UserService() {}

//根据条件查询一条数据
UserService.findOne = function (query, callback) {
    User.findOne(query, function (err, ret) {
        if (err) {
            return callback(err);
        }
        callback(null, ret);
    })
}

//重名校验
UserService.dumplicate = function(id, username, callback) {
    let query = {username: username};
    if(id) {
        query._id = {$ne: id};
    }
    User.count(query, function(err, count) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        if (count) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
}

//保存
UserService.save = function (bo, callback) {
    let entity = new User(bo);
    entity.save(entity, function (err, ret) {
        if(err) {
            callback(err);
            return console.error(err);
        }
        callback(null, ret);
    })
}

//修改（根据id）
UserService.update = function (id, bo, callback) {
    User.findOne({_id: id}, function (err, org) {
        if(err) {
            callback(err);
            return console.error(err);
        }
        User.update({_id: id}, bo, function(err, ret) {
           if(err) {
               callback(err);
               return console.error(err);
           }
           callback(null, ret);
        })
    })
}

//根据条件查询分页
UserService.findList = function (query, callback) {
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
    let page = new Page();
    User.count(query, function(err, count) {
        if (err) {
            callback(err);
            return console.error(err);
        }
        if (count === 0) { //无数据
            callback(null, page);
            return;
        }
        User.find(query, null, options, function(err, bos) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            page.setPageAttr(count);
            page.setData(bos);
            return callback(null, page);
        });
    });
}
