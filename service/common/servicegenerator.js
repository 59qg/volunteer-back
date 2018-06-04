
var Page = require('../../common/page');

function ServiceGenerator(){

}

ServiceGenerator.generate = function (model, key) {
    var service = {};

    // 列表查询,不分页
    service.find = function (query, callback) {
        if(query.id) {
            query._id = query.id;
            delete query.id;
        }
        let options = {};
        options['sort'] = {'createdAt': -1};    //按时间逆序排序
        model.find(query, null, options, function (err, ret) {
            if (err) {
                return callback(err);
            }
            callback(null, ret);
        })
    };

    // 列表查询,分页
    service.findList = function (query, callback, top) {
        if(!query){
            query = {};
        }

        //处理分页
        var row = query.row;
        var start = query.start;
        var options = {'$slice':2};
        options['limit'] = row;
        options['skip'] = start;
        options['sort'] = {'createAt': -1};    //按时间逆序排序
        if (top) {
            options['sort'] = {'top': -1};
        }
        delete query.row;
        delete query.start;
        var page = new Page();
        model.count(query,function(err,count){
            if (err){
                callback(err);
                return console.error(err);
            }
            if(count===0){//无数据

                callback(null,page);
                return;
            }
            model.find(query,null,options,function (err, bos) {
                if (err){
                    callback(err);
                    return console.error(err);
                }
                page.setPageAttr(count);
                page.setData(bos);
                callback(null,page);
            });
         });
    };


    // 查找单条记录
    service.getById = function (query, callback) {
        model.findOne(query, function (err, ret) {
            if (err) {
                return callback(err);
            }
            callback(null, ret);
        })
    };

    // 更新
    service.update = function (query, bo, callback, muti) {
        if(!query){
            query = {};
        }
        if(typeof bo.toObject === 'function'){
            bo = bo.toObject();
        }
        if(bo._id){
            delete bo._id;
        }
        var option = muti ? muti : null;
        model.update(query, bo, option, function (err, ret) {
            if (err) {
                return callback(err);
            }
            callback(null, ret);
        })
    };

    // 新增
    service.save = function (bo, callback) {
        var Entity = new model();
        for (var key in bo) {
            if(key != '_id') {
                Entity[key] = bo[key];
            }
        }
        Entity.save(function (err, ret) {
            if (err) {
                return callback(err);
            }
            callback(null, ret);
        })
    };

    // 删除
    service.remove = function (query, callback) {
        if(!query){
            query = {};
        }
        model.remove(query, function (err, ret) {
            if (err) {
                return callback(err);
            }
            callback(null, ret);
        })
    };

    // 根据查询条件统计
    service.countByQuery = function (query, callback) {
        if(!query) {
            query = {};
        }
        model.count(query, function(err, count) {
            if(err) {
                return callback(err);
            }
            callback(null, count);
        })
    };

    return service;
};

module.exports = ServiceGenerator;