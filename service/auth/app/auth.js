var crypto = require('./encrypt');

var Auth = function(utoken, uid) {
    if(utoken) {
        let id = crypto.encode(utoken);
        return id;
    }
    else if(uid) {
        let token = crypto.decrypt(uid);
        return token;
    }
}

module.exports = Auth;