var express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
var router = express.Router();

var wechatApiUtils = require('../utils/wechatApiUtils');

var cryptoUtils = require('../utils/cryptoUtils');

var wechatConfig = require('../configs/wechat'); //微信配置信息

router.get('/', function(req, res, next) {
    
    console.log('开始验证')
    var token = wechatConfig.test.token;

    //携带的参数
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    console.log('req.query',req.query)

    //字典排序,变为字符串
    var str = [timestamp,nonce,token].sort().join('');
    //sha1加密  
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sha1str = sha1.digest('hex');
    console.log('sha1str',sha1str)
    if(sha1str == signature){
        console.log('验证成功')
        res.end(echostr);

    }
});

/* GET jssdk page. */
router.get('/jssdk', function(req, res, next) {
    //拼接请求路径

    var url = req.protocol +'://'+ req.hostname +req.url;
    console.log('url',url);

    var jsapiTicket = wechatApiUtils.getJsapiTicket();

    console.log('jsapiTicket',jsapiTicket);

    var info = cryptoUtils.signature(jsapiTicket,url);

    info.appId = wechatConfig.test.appID;

    console.log('info',info)

    res.render('index', { info: info });
});

router.get('/MP_verify_pBuZ2umPCgnKehlq.txt', function(req, res, next) {
    //拼接请求路径

    var  content  =fs.readFileSync(path.join(__dirname,'../MP_verify_pBuZ2umPCgnKehlq.txt'),'utf8')

    res.send(content);
});




module.exports = router;
