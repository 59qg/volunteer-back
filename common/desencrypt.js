var crypto = require('crypto');
var des = {
    dekey: 'eshimin@',
    enkey: '37788f5c',
    algorithm: { ecb: 'des-ecb', cbc: 'des-cbc' },
    encrypt: function(plaintext, iv) {
        var key = new Buffer(this.dekey);
        var iv = new Buffer(iv ? iv : 0);
        var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
        cipher.setAutoPadding(true) //default true
        var ciph = cipher.update(plaintext, 'utf8', 'hex');
        ciph += cipher.final('hex');
        return ciph;
    },
    decrypt: function(encrypt_text, iv) {
        var key = new Buffer(this.enkey);
        var iv = new Buffer(iv ? iv : 0);
        var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
        decipher.setAutoPadding(true);
        var txt = decipher.update(encrypt_text, 'hex', 'utf8');
        // txt += decipher.final('utf8');
        return txt;
    },
    userdecrypt: function(encrypt_text, iv) {
        var key = new Buffer(this.dekey);
        var iv = new Buffer(iv ? iv : 0);
        var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
        decipher.setAutoPadding(true);
        var txt = decipher.update(encrypt_text, 'hex', 'utf8');
        txt += decipher.final('utf8');
        return txt;
    }
};

module.exports = des;