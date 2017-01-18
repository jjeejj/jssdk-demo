
var wechatConfig = require('../configs/wechat'); //微信配置信息
var wechatApi = require('../configs/wechatApi'); //微信接口信息

const requestPromise = require('request-promise');
const fs = require('fs');
const path = require('path');

/**
 * 获取access_toekn
 * @param  {Function} cb [description]
 * @return {Stirng}     返回access_toekn
 */
var getAccessToken = function (cb) {

    //先从文件中获取
    var accessTokenInfo = fs.readFileSync(path.join(__dirname,'../files/accessToken.json'),'utf8');

    //没有数据，或者错误的情况下重新获取
    if(!accessTokenInfo || accessTokenInfo.errcode != undefined){
        updateAccessToken(cb);
    }

    accessTokenInfo  = JSON.parse(accessTokenInfo); //格式化为对象

    if(accessTokenInfo && accessTokenInfo.api_expires_in){
        if(Date.now() <  accessTokenInfo.api_expires_in){
            console.log('返回文件中的accesstoken')
            return accessTokenInfo.access_token; //返回access_toekn
        }else{
            updateAccessToken(cb);
        }
    }else{
        updateAccessToken(cb);
    }
}


/**
 * 更新access_toekn
 * @param  {Function} cb 更新完后的回调函数
 * @return {[type]}      [description]
 */
var updateAccessToken = function (cb) {
    // request(wechatApi.getAccessToken.replace('APPID',wechatConfig.test.appID). //该方法是异步的
    //     replace('APPSECRET',wechatConfig.test.appsecret),function (error,response,body) {
    //     if(!error && response.statusCode == 200){
            
    //         // console.log('body',body);
    //         var bodyObj = JSON.parse(body); //格式化为对象
    //         bodyObj.api_expires_in = Date.now() + bodyObj.expires_in * 1000  - 20 *1000 //提前20s获取
    //         body = JSON.stringify(bodyObj,null,4)

    //         fs.writeFileSync(path.join(__dirname,'../files/accessToken.json'),body);

    //         getAccessToken();
    //     }
    // });

//Promise改写
    requestPromise(wechatApi.getAccessToken.replace('APPID',wechatConfig.test.appID).replace('APPSECRET',wechatConfig.test.appsecret))
                .then(function (body) {
                    console.log('body',body);
                    var bodyObj = JSON.parse(body); //格式化为对象
                    bodyObj.api_expires_in = Date.now() + bodyObj.expires_in * 1000  - 20 *1000 //提前20s获取,该值存的是ms
                    body = JSON.stringify(bodyObj,null,4);
                    fs.writeFileSync(path.join(__dirname,'../files/accessToken.json'),body);

                    var accessToken = getAccessToken();
                    cb(accessToken);
                })
                .catch(function (err) {
                    console.log('err',err);
                })

   
}

// updateAccessToken();


//获取jsapi_ticket
var getJsapiTicket = function () {

    //先从文件中获取
    var jsapiTicketInfo = fs.readFileSync(path.join(__dirname,'../files/jsapiTicket.json'),'utf8');

    // console.log('jsapiTicketInfo',jsapiTicketInfo);

    if(!jsapiTicketInfo){
        getAccessToken(updateJsapiTicket);
    }

    jsapiTicketInfo  = JSON.parse(jsapiTicketInfo); //格式化为对象

     // console.log('jsapiTicketInfoObj',jsapiTicketInfo);

    if(jsapiTicketInfo && jsapiTicketInfo.jsapi_expires_in && jsapiTicketInfo.errmsg == 'ok'){
        if(Date.now() <  jsapiTicketInfo.jsapi_expires_in){
            console.log('返回文件中的ticket')
            return jsapiTicketInfo.ticket; //返回aticket
        }else{
            getAccessToken(updateJsapiTicket);
        }
    }else{
        getAccessToken(updateJsapiTicket);
    }
}

//更新jsapi_ticket
//重新获取信息
var updateJsapiTicket = function (accessToken) {
    console.log('开始更新getJsapiTicket');
    // var accessToken =  getAccessToken();
    console.log('accessToken',accessToken);
    request(wechatApi.getJsapiTicket.replace('ACCESS_TOKEN',accessToken),function (error,response,body) {
        var bodyObj = JSON.parse(body); //格式化为对象
        if(!error && response.statusCode == 200 && body.errmsg == 'ok'){
            console.log('body',body);
            bodyObj.jsapi_expires_in = Date.now() + bodyObj.expires_in * 1000 - 20 * 1000; //提前20s获取
            body = JSON.stringify(bodyObj,null,4)

            fs.writeFileSync(path.join(__dirname,'../files/jsapiTicket.json'),body);

            getJsapiTicket();
        }else{
            updateJsapiTicket();
        }
    });
}

//设备分组信息

//获取所有的分组
var getDeviceGroupList = function () {
    console.log('开始获取所有的分组deviceGroupList');
     //获取getAccessToken
    var accessToken =  getAccessToken();

    console.log('accessToken',accessToken)
    var formData = {
         "begin": 0,
         "count": 1000
         // "access_token":accessToken
    };
    request.post({url:wechatApi.devices.getGrouplist.replace('ACCESS_TOKEN',accessToken), form: formData},
        function (error,response,body) {
            if(!error && response.statusCode == 200){
                    console.log('body',body);
                    body = JSON.parse(body); //格式化为对象
                    body = JSON.stringify(body,null,4)

                    fs.writeFileSync(path.join(__dirname,'../files/deviceGroupList.json'),body);

                    return body;
            }
    });
}

/**
 * 新增分组信息
 * @param {[type]} info 分组名称
 */
var addDeviceGroup = function (info) {
    console.log('开始获取所有的分组deviceGroupList');
     //获取getAccessToken
    var accessToken =  getAccessToken();
    info.access_token = accessToken

    request.post({url:wechatApi.devices.addGroup.replace('ACCESS_TOKEN',accessToken), form: info}
        ,function (error,response,body) {
    
            if(!error && response.statusCode == 200){
                // console.log('body',body);
                // body = JSON.parse(body); //格式化为对象
                // body = JSON.stringify(body,null,4)

                // fs.writeFileSync(path.join(__dirname,'../files/deviceGroupList.json'),body);
                return true;
            }
    });
}

/**
 * 添加设备到分组
 * @param  {[type]} deviceInfo 设备信息
 * {
  "group_id": 123,
  "device_identifiers":[
          {
          "device_id":10100,    
          "uuid":"FDA50693-A4E2-4FB1-AFCF-C6EB07647825",    
          "major":10001,
          "minor":10002
          }
          ]
}
 * @return {[type]}            [description]
 */
var adddeviceToGroup = function (deviceInfo) {
    console.log('开始添加设备到分组adddeviceToGroup');
     //获取getAccessToken
    var accessToken =  getAccessToken();
    deviceInfo.access_token = accessToken

    request.post({url:wechatApi.devices.adddeviceToGroup.replace('ACCESS_TOKEN',accessToken), form: deviceInfo}
        ,function (error,response,body) {
    
            if(!error && response.statusCode == 200){
                // console.log('body',body);
                // body = JSON.parse(body); //格式化为对象
                // body = JSON.stringify(body,null,4)

                // fs.writeFileSync(path.join(__dirname,'../files/deviceGroupList.json'),body);

                return true; 
            }
    });
}



module.exports = {
    getAccessToken:getAccessToken,
    getJsapiTicket:getJsapiTicket,
    getDeviceGroupList:getDeviceGroupList,
    addDeviceGroup:addDeviceGroup,
    adddeviceToGroup:adddeviceToGroup
}