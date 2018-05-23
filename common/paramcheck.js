/**
 * 路由层参数校验函数
 * @constructor
 */
function ParamCheck() {

}

//请求方法
ParamCheck.paramobj = {
    GET:'query',
    POST:'body',
    PUT:'body',
    DELETE:'body'
};

/**
 * 组合请求参数
 * @param req 路由请求体
 * @param paramArr 自定义参数，require为非空参数，fuzzy为模糊查询参数，other为一般参数，格式为：
 *     var params = {
 *       require: {
 *           row: '分页查询',
 *           start: '分页查询'
 *       },
 *       paramType: {
 *           'row': "number",
 *           'start': "number",
 *       }
 *       fuzzy: ['remark'],
 *       other: ['resource_type', 'type' ]
 *   };
 * @returns {{err: Array, query}} err非空参数错误提示信息，query为组装后的参数对象
 */
ParamCheck.composeParams = function (req, paramArr) {
    var errInfo =[];
    var fuzzyReq = {};
    var query = {};
    if(paramArr instanceof Object) {
        if(!ParamCheck.isEmptyObj(paramArr)) {
            for (var p in paramArr) {
                switch (p) {
                    case 'require':
                        var flagr = true;
                        var isreqType = false;
                        var notNullError = ParamCheck.isNull(req, paramArr.require);
                        if (notNullError) {
                            errInfo.push(notNullError);
                        } else {
                            for (var r in paramArr['require']) {
                                tmpV = req[ParamCheck.paramobj[req.method]][r];
                                for (var t in paramArr['paramType']) {
                                    if (r === t) {
                                        isreqType = true;
                                        if(paramArr['paramType'][t] === 'number') {
                                            tmpV = Number(tmpV);
                                            if(isNaN(tmpV)) {
                                                flagr = false;
                                            }
                                        }
                                        if(!flagr) {
                                            errInfo.push('请检查参数类型！');
                                        } else {
                                            if((typeof tmpV) === paramArr['paramType'][t]) {
                                                query[r] = tmpV;
                                            } else {
                                                errInfo.push('请检查参数类型！');
                                            }
                                        }
                                    }
                                }
                                if(!isreqType) {
                                    query[r] = tmpV;
                                }
                                isreqType = false;
                                flagr = true;
                            }
                        }
                        break;
                    case 'fuzzy':
                        fuzzyReq = ParamCheck.fuzzyQuery(req, paramArr.fuzzy);
                        break;
                    case 'other':
                        var tmpV = '';
                        var flago = true;
                        var isreqType = false;
                        for(var i=0;i<paramArr['other'].length;i++){
                            tmpV = req[ParamCheck.paramobj[req.method]][paramArr['other'][i]];
                            if(tmpV) {
                                for (var t in paramArr['paramType']) {
                                    if(t === paramArr['other'][i]) {
                                        isreqType = true;
                                        if(paramArr['paramType'][t] === 'number') {
                                            tmpV = Number(tmpV);
                                            if(isNaN(tmpV)) {
                                                flago = false;
                                            }
                                        }
                                        if(!flago) {
                                            errInfo.push('请检查参数类型！');
                                        } else {
                                            if((typeof tmpV) === paramArr['paramType'][t]) {
                                                query[paramArr['other'][i]] = tmpV;
                                            } else {
                                                errInfo.push('请检查参数类型！');
                                            }
                                        }
                                    }
                                }
                                if(!isreqType) {
                                    query[paramArr['other'][i]] = tmpV;
                                }
                                isreqType = false;
                                flago = true;
                            }
                        }
                        break;
                }
            }
        }
    }
    if(errInfo.length > 0) {
        console.error(errInfo[0]);
        return {
            err: errInfo[0],
            query: ParamCheck.mergeObj(query, fuzzyReq)
        };
    } else {
        return {
            err: null,
            query: ParamCheck.mergeObj(query, fuzzyReq)
        };
    }

};

/**
 * 校验非空参数
 * @param req 请求体
 * @param paramArr 参数对象
 * @returns {*}
 */
ParamCheck.isNull = function (req, paramArr){ // 非空校验
    var param = ParamCheck.paramobj[req.method];
    for (var p in paramArr) {
        if (req[param][p] == undefined || req[param][p].length == 0) {
            return '缺少' + paramArr[p] + '参数！';
        }
    }
    return false;
};

/**
 *  模糊查找
 * @param req
 * @param paramArr 参数对象
 * @returns {*}
 */
ParamCheck.fuzzyQuery = function(req, paramArr){ // 模糊查询
    var param = ParamCheck.paramobj[req.method];
    var query = {};
    for(var i=0;i<paramArr.length;i++){
        if(req[param][paramArr[i]]){
            query[paramArr[i]] = new RegExp(req[param][paramArr[i]],'i'); // 不区分大小写模糊查询条件
        }
    }
    return query;
}

/**
 *  非空对象判断
 * @param obj
 * @returns {boolean}
 */
ParamCheck.isEmptyObj = function(obj) { // 判断对象是否为空
    for (var name in obj) {
        return false;
    }
    return true;
}

ParamCheck.mergeObj = function(o1,o2){
    for(var key in o2){
        o1[key]=o2[key]
    }
    return o1;
}

module.exports = ParamCheck;