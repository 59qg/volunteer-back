/**
 * Created by Wujianxiong on 2016/12/19.
 * Updated by GLJ on 2018/02/06
 */
var formidable = require('formidable');
var fs = require('fs');

function UploadService() {

}

/**
 *  上传文件(前端input的name="file")
 * @param req request
 * @param dir 文件保存目录
 */
UploadService.upload = function (req, dir, callback) {
    var dirs = dir.split('/')[0];
    for(var i = 0; i < dir.split('/').length; i++) {
        if (!fs.existsSync(dirs)) {
            fs.mkdirSync(dirs);
        }
        dirs = dirs + '/' + dir.split('/')[i + 1];
    }
    var timestamp = new Date().getTime();
    fs.mkdirSync(dir + '/' + timestamp);
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';      //设置编码
    form.uploadDir = dir + '/' + timestamp;  //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 3 * 1024 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
        if (err) {
            callback(err);
            return;
        }
        if (!files.file) {
            callback('请上传文件');
            return;
        }
        fs.rename(files.file.path, dir + '/' + timestamp + '/' + files.file.name, function (err) {
            if (err) {
                callback(err);
                return;
            }
            var ret = {};
            ret.path = dir + '/' + timestamp + '/' + files.file.name;
            ret.data = fields;
            callback(null, ret);
        });
    });
};

/**
 *  删除已上传文件
 * @param dir 文件所在文件夹
 */
UploadService.remove = function (dir, callback) {
    dir = '..' + dir;
    var files = [];
    if( fs.existsSync(dir) ) {
        files = fs.readdirSync(dir);
        files.forEach(function(file, index){
            var curPath = dir + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                UploadService.remove(curPath, null);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
        callback(null);
    } else {
        callback('没有此路径');
    }
};

module.exports = UploadService;