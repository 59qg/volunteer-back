var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg');

var _privateFun = router.prototype;
_privateFun.prsBO2VO = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            return {
                id: ret._id,
                
            }
        }
    });
    return result;
};

router.route('/list')
    .get(function(req, res, next) {
        
    })

module.exports = router;