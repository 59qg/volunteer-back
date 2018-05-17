/**
 * 加密工具
 * Created by duanying on 2015/8/13.
 */

var crypto = require('crypto');
var rsa = require('node-rsa');

/**
 * RSA私钥
 * @type {*|exports|module.exports}
 */
var key = new rsa('-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICXgIBAAKBgQDUXY0kwlcxWDv1WmkKvREBh7Pyw2n59MdMhJIeKpMfCknCazUq\n' +
    'JSQdLn4NtcPgm9ZOvgE0YJK+r6OYBnQKbe5C30XoOCdvL+oRKEvURXtjbN7hIxKN\n' +
    '5jsR4l76VKpEpVipIq5QxRfJp5ZaGCj/b+Miy56BwHgrx0gjuon/tIacPQIDAQAB\n' +
    'AoGBAJK9tfrRgvho1L175Jtz+11ITNKRrxf1yQUZkfHgT1qifEcoV0sw8NxtNNL6\n' +
    'Z0g7xoEQj7qGhL/Yk71HsEVIoto15Ony6vA0aJ7zMhDkNeXTDnNwKxGLu1BkRFnx\n' +
    'ojoPHYqB5c+DRwqX/6xcCZ7rzvHO4z7Txd4NsTXXU58QLFoBAkEA9CrYOkXZSts9\n' +
    '7TkF0gswHWX3AswBGvs/ZmvScMGjm3qk/5PSuuKc0pERXUGe/pZ43F/v+6OU1YQC\n' +
    'DeJVtunTgQJBAN6oK4djMuPqvr648crevw+F5w2OK6h46XpHKNQp9TYICxf1nt9c\n' +
    'HrXhxmlAMU4CDQdH8Z9bm+HM4pmULPZodr0CQQDT7uBybDB4tiZhYy53K7jeu6OU\n' +
    '7OhEuDJGv24Q6zMMgH75TCEMkChY6QwuawgLqSZM+oT+YfWNAyEZVgzaUMmBAkAq\n' +
    'GBUSpXhrimfBWumrdu0cHC6Qa35pfWJ2kZlwcvY+3spqHy+H/rx3mlWOdGpd2xln\n' +
    'dPyDKiiQSdHVQyQ0+Y7pAkEAiHHDiYtL7H9nPJQHdDHdqTSbAeCDShil+BbXjh4/\n' +
    'nZoj5d7+KLO4vvkU5445DHKWvYNqlFT+FOQQxsY7f7LevA==\n' +
    '-----END RSA PRIVATE KEY-----');

/**
 * RSA解密
 * @param str
 * @returns {Buffer|Object|string}
 */
crypto.rsade = function(str){
    var a = key.decrypt(str,'utf8');
    return a
}


/**
 * sha1算法加密
 * @param {str|需要加密的字符串}
 * @param {addSalt|密钥，默认为"db-extract@0123x100$#365#$"}
 */
crypto.sha1Hash = function (str, addSalt) {
    var salt = (addSalt) ? new Date().getTime() : "";
    return crypto.createHmac('sha1', salt + "").update(str + "").digest('hex');
}

/**
 * md5算法加密
 * @param {str|需要加密的字符串}
 */
crypto.md5Hash = function (str) {
    return crypto.createHash('md5').update(str + "").digest('hex');
}

/**
 * des-ede算法加密
 * @param {str|需要加密的字符串}
 */
crypto.encode = function (str) {
    var cipher = crypto.createCipher('des-ede', key);
    var crypted = cipher.update(str, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
}

/**
 * des-ede算法解密
 * @param {str|需要解密的字符串}
 */
crypto.dencode = function (str) {
    var decipher = crypto.createDecipher('des-ede', key);
    var dec = decipher.update(str, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = crypto;
