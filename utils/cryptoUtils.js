const crypto = require('crypto');

//生成一个时间戳
var createTimesTamp = function () {
    return parseInt(Date.now() / 1000,10);
}

/**
 * 生成一个随机数
 * @return {String} 一个15位的随机字符串
 */
var createNonce = function () {
    return Math.random().toString(36).substr(2,15);
}

/**
 * 生成jssdk的签名
 * 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
 * 使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
 * 这里需要注意的是所有参数名均为小写字符。
 * 对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
 * 即signature=sha1(string1)
 * @param  {string} noncestr    随机数
 * @param  {string} jsapi_ticket 票据
 * @param  {number} timestamp    时间戳
 * @param  {string} url         当前网页的URL，不包含#及其后面部分
 * @return {string}           signature
 */
var sign = function (noncestr,jsapi_ticket,timestamp,url) {

    var params = [
        'noncestr='+noncestr,
        'timestamp='+timestamp,
        'jsapi_ticket='+jsapi_ticket,
        'url='+url
    ];

    console.log('params',params);
    var str = params.sort().join('&');

    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sha1str = sha1.digest('hex');

    return sha1str;
}

//jssdk的签名算法
exports.signature = function (jsapi_ticket,url) {
    var noncestr = createNonce();//随机字符串
    var timestamp = createTimesTamp();//时间戳
    var signature = sign(noncestr,jsapi_ticket,timestamp,url);

    return {
        noncestr:noncestr,
        timestamp:timestamp,
        signature:signature
    }
}

