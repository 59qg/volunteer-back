var crypto = require('../../../common/desencrypt');

var Auth = function(utoken, uid) {
    if(utoken) {
        let id = crypto. decrypt(utoken.toString());
        return id;
    }
    else if(uid) {
        let token = crypto.encrypt(uid.toString());
        return token;
    }
}

module.exports = Auth;