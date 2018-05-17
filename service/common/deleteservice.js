/**
 * create by xm 2018/1/19
 * 删除文件，且删除该文件后文件夹为空删除文件夹
 */
var fs = require("fs");
var path = require("path");

function deleteService () {

}
//完全逻辑版
// deleteService.delEmptyDir = function(urlArrays, callback) {
//     async.mapSeries(urlArrays, function(urls, cb) {
//         var url = urls.join('/');
//         var rmEmptyDir = function(fileUrl){
//             var files = fs.readdirSync(fileUrl);
//             if (files.length > 0) {
//                 files.forEach(function(fileName) {
//                     if(fileName.indexOf('.')>=0){
//                         return;
//                     }
//                     rmEmptyDir(fileUrl+'/'+fileName);
//                 });
//             } else {
//                 fs.rmdirSync(fileUrl);
//                 var lenStr = fileUrl.trim().split('/');
//                 if (lenStr.length > 1) {
//                     var urls = lenStr.join('/').split('/',lenStr.length-1).join('/');
//                     rmEmptyDir(urls);
//                 }
//             }
//         };
//         rmEmptyDir(url);
//         cb(null);
//     },function(err) {
//         if(err) {
//             callback(err);
//         }else {
//             callback(null, true);
//         }
//     })
// }
//简易版
deleteService.delete = function(url, callback) {
    if (fs.existsSync(url)) {
        fs.unlinkSync(url);
        var dirs = url.split('/')[0];
        var arr = [];
        for(var i = 0; i < url.split('/').length - 2; i++) {
            dirs = dirs + '/' + url.split('/')[i + 1];
            if (i > 0) {
                var temp = {};
                temp.url = dirs;
                arr.push(temp);
            }
        }
        for (var x=arr.length-1; x >= 0; x--) {
            var files = fs.readdirSync(arr[x].url);
            if (files < 1) {
               fs.rmdirSync(arr[x].url);
            }
        }
        // var files = fs.readdirSync(dirs);
        callback(null, true);
    } else {
        callback(null, true);
    }
} 
module.exports = deleteService;