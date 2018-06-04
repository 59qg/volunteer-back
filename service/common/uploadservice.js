/**
 * Created by Wujianxiong on 2016/12/19.
 */
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var config = require('../../config');

function UploadService() {

}

/**
 *  上传文件(前端input的name="file")
 * @param req request
 * @param dir 文件保存目录
 */
UploadService.upload = function (req, callback) {

    var dirs = path.join(config.root, 'public', 'images','photo')

    if (!fs.existsSync(dirs)) {
        fs.mkdirSync(dirs);
    }

    var timestamp = new Date().getTime();
    fs.mkdirSync(path.join(dirs, timestamp.toString()));
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';      //设置编码
    form.uploadDir = path.join(dirs, timestamp.toString());  //设置上传目录
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
        fs.rename(files.file.path, path.join(dirs, timestamp.toString(), files.file.name), function (err) {
            if (err) {
                callback(err);
                return;
            }
            var ret = {};
            ret.path = path.join(dirs, timestamp.toString(), files.file.name);
            ret.data = fields;
            callback(null, ret);
        });
    });
}

module.exports = UploadService;