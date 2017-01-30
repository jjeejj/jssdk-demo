const fs = require('fs');

/**
 * 读取文件的内容
 * @param  {[type]} fpath 文件的路径
 * @return {[type]}     Promise
 */
var readFile = function(fpath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, 'utf8', function(err, data) {
            if (err) {
                reject(err);
            } else {
                console.log('data',data);
                resolve(data);
            }
        })
    })
}

/**
 * 写入文件内容
 * @param  {[type]} fpath   需要写入文件
 * @param  {[type]} conetnt 写入的内容
 * @return {[type]}         Promise
 */
var writeFile = function(fpath, conetnt) {

    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, conetnt, (err, conetnt) => {
            if (err) {
                reject(err);
            } else {
                resolve(conetnt);
            }
        })
    })
}

exports.readFile = readFile;
exports.writeFile = writeFile;