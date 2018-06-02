var crypto = require('crypto');



let des = {
    algorithm: { ecb:'des-ecb',cbc:'des-cbc' },
    key: '49872974',
    encrypt:function(plaintext,iv){
        var key = new Buffer(this.key);
        var iv = new Buffer(iv ? iv : 0);
        var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
       // cipher.setAutoPadding(true) //default true
        console.log(plaintext);
        var ciph = cipher.update(plaintext, 'utf8', 'base64');
        ciph += cipher.final('base64');
        return ciph;
    },
    decrypt:function(encrypt_text,iv){
        var key = new Buffer(this.key);
        var iv = new Buffer(iv ? iv : 0);
        var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
       // decipher.setAutoPadding(true);
        var txt = decipher.update(encrypt_text, 'base64', 'utf8');
        txt += decipher.final('utf8');
        return txt;
    }
};

module.exports = des;