var wechatConfig = require('../configs/wechat'); //微信配置信息
var wechatApi = require('../configs/wechatApi'); //微信接口信息
var fileUtils = require('./fileUtils'); //操作文件的方法

const requestPromise = require('request-promise');

const path = require('path');

/**
 * 获取access_toekn
 * @return {Stirng}    Promise.resolve(access_toekn)
 */
var getAccessToken = function() {

    //先从文件中获取
    // var accessTokenInfo = fs.readFileSync(path.join(__dirname,'../files/accessToken.json'),'utf8');
    var accessTokenInfo = "";
    fileUtils.readFile(path.join(__dirname, '../files/accessToken.json'))
        .then(function(data) {
            if (!data) { //没有值,重新获取的不需要判断时间
                updateAccessToken().then(function(data) {
                    accessTokenInfo = JSON.parse(data); //格式化为对象
                    return Promise.resolve(accessTokenInfo.access_token); //返回access_toekn
                })
            }
            accessTokenInfo = JSON.parse(data); //格式化为对象
            if (accessTokenInfo && accessTokenInfo.api_expires_in && !accessTokenInfo.errcode) {
                if (Date.now() < accessTokenInfo.api_expires_in) {
                    console.log('返回文件中的accesstoken', accessTokenInfo.access_token)
                        return Promise.resolve(accessTokenInfo.access_token); //返回access_toekn
                    // return new Promise(); //返回access_toekn
                } else { //时间超时更新access_token
                    updateAccessToken().then(function(data) {
                        accessTokenInfo = JSON.parse(data); //格式化为对象
                        return Promise.resolve(accessTokenInfo.access_token); //返回access_toekn

                    })
                }
            } else {
                updateAccessToken().then(function(data) {
                    accessTokenInfo = JSON.parse(data); //格式化为对象
                    return Promise.resolve(accessTokenInfo.access_token); //返回access_toekn
                })
            }
        }).catch(function(err) {
            console.log('获取access_toekn 失败', err)
        })
        //没有数据，或者错误的情况下重新获取
        // if (!accessTokenInfo || accessTokenInfo.errcode != undefined) {
        //     updateAccessToken(cb);
        // }

    // accessTokenInfo = JSON.parse(accessTokenInfo); //格式化为对象

    // if (accessTokenInfo && accessTokenInfo.api_expires_in) {
    //     if (Date.now() < accessTokenInfo.api_expires_in) {
    //         console.log('返回文件中的accesstoken')
    //         return accessTokenInfo.access_token; //返回access_toekn
    //     } else {
    //         updateAccessToken();
    //     }
    // } else {
    //     updateAccessToken();
    // }
}


/**
 * 更新access_toekn
 * 返回操作文件返回的Promise
 * @return {[type]}     Promise
 */
var updateAccessToken = function() {
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
    requestPromise(wechatApi.getAccessToken.replace('APPID', wechatConfig.test.appID).replace('APPSECRET', wechatConfig.test.appsecret))
        .then(function(body) {
            console.log('body', body);
            var bodyObj = JSON.parse(body); //格式化为对象
            bodyObj.api_expires_in = Date.now() + bodyObj.expires_in * 1000 - 20 * 1000 //提前20s获取,该值存的是ms
            body = JSON.stringify(bodyObj, null, 4);
            fileUtils.writeFile(path.join(__dirname, '../files/accessToken.json'), body);

            return body;
        })
        .catch(function(err) {
            console.log('err', err);
        })
}


//
/**
 * 获取jsapi_ticket
 * @return Promise.resolve(ticket)   
 */
var getJsapiTicket = function() {

    //先从文件中获取
    // var jsapiTicketInfo = fs.readFileSync(path.join(__dirname, '../files/jsapiTicket.json'), 'utf8');
    fileUtils.readFile(path.join(__dirname, '../files/jsapiTicket.json'))
        .then(function(data) {
            if (!data) { //没有值,重新获取的不需要判断时间
                updateJsapiTicket().then(function(data) {
                    jsapiTicketInfo = JSON.parse(data); //格式化为对象
                    return jsapiTicketInfo.ticket; //返回ticket
                })
            }
            jsapiTicketInfo = JSON.parse(data); //格式化为对象
            if (jsapiTicketInfo && jsapiTicketInfo.jsapi_expires_in && jsapiTicketInfo.errmsg == 'ok') {
                if (Date.now() < jsapiTicketInfo.jsapi_expires_in) {
                    console.log('返回文件中的ticket')
                    return Promise.resolve(jsapiTicketInfo.ticket); //返回ticket
                } else { //时间超时更新ticket
                    updateJsapiTicket().then(function(data) {
                        jsapiTicketInfo = JSON.parse(data); //格式化为对象
                        return Promise.resolve(jsapiTicketInfo.ticket); //返回access_toekn
                    })
                }
            } else {
                updateJsapiTicket().then(function(data) {
                    jsapiTicketInfo = JSON.parse(data); //格式化为对象
                    return Promise.resolve(jsapiTicketInfo.ticket); //返回access_toekn
                })
            }

        })
        // console.log('jsapiTicketInfo',jsapiTicketInfo);

    // if (!jsapiTicketInfo) {
    //     getAccessToken(updateJsapiTicket);
    // }

    // jsapiTicketInfo = JSON.parse(jsapiTicketInfo); //格式化为对象

    // console.log('jsapiTicketInfoObj',jsapiTicketInfo);

    // if (jsapiTicketInfo && jsapiTicketInfo.jsapi_expires_in && jsapiTicketInfo.errmsg == 'ok') {
    //     if (Date.now() < jsapiTicketInfo.jsapi_expires_in) {
    //         console.log('返回文件中的ticket')
    //         return jsapiTicketInfo.ticket; //返回aticket
    //     } else {
    //         getAccessToken(updateJsapiTicket);
    //     }
    // } else {
    //     getAccessToken(updateJsapiTicket);
    // }
}

//更新jsapi_ticket

var updateJsapiTicket = function() {
    console.log('开始更新getJsapiTicket');
    getAccessToken().then(function(data) {
        console.log('用于更新用的accessToken', data);
        //Promise改写
        requestPromise(wechatApi.getJsapiTicket.replace('ACCESS_TOKEN', data))
            .then(function(body) {
                console.log('body', body);
                var bodyObj = JSON.parse(body); //格式化为对象
                bodyObj.api_expires_in = Date.now() + bodyObj.expires_in * 1000 - 20 * 1000 //提前20s获取,该值存的是ms
                body = JSON.stringify(bodyObj, null, 4);
                fileUtils.writeFile(path.join(__dirname, '../files/jsapiTicket.json'), body);
                return body;
            })
            .catch(function(err) {
                console.log('err', err);
            })
    })

    // request(wechatApi.getJsapiTicket.replace('ACCESS_TOKEN', accessToken), function(error, response, body) {
    //     var bodyObj = JSON.parse(body); //格式化为对象
    //     if (!error && response.statusCode == 200 && body.errmsg == 'ok') {
    //         console.log('body', body);
    //         bodyObj.jsapi_expires_in = Date.now() + bodyObj.expires_in * 1000 - 20 * 1000; //提前20s获取
    //         body = JSON.stringify(bodyObj, null, 4)

    //         fs.writeFileSync(path.join(__dirname, '../files/jsapiTicket.json'), body);

    //         getJsapiTicket();
    //     } else {
    //         updateJsapiTicket();
    //     }
    // });
}

//设备分组信息

//获取所有的分组
var getDeviceGroupList = function() {
    console.log('开始获取所有的分组deviceGroupList');
    //获取getAccessToken
    var accessToken = getAccessToken();

    console.log('accessToken', accessToken)
    var formData = {
        "begin": 0,
        "count": 1000
            // "access_token":accessToken
    };
    request.post({
            url: wechatApi.devices.getGrouplist.replace('ACCESS_TOKEN', accessToken),
            form: formData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('body', body);
                body = JSON.parse(body); //格式化为对象
                body = JSON.stringify(body, null, 4)

                fs.writeFileSync(path.join(__dirname, '../files/deviceGroupList.json'), body);

                return body;
            }
        });
}

/**
 * 新增分组信息
 * @param {[type]} info 分组名称
 */
var addDeviceGroup = function(info) {
    console.log('开始获取所有的分组deviceGroupList');
    //获取getAccessToken
    var accessToken = getAccessToken();
    info.access_token = accessToken

    request.post({
        url: wechatApi.devices.addGroup.replace('ACCESS_TOKEN', accessToken),
        form: info
    }, function(error, response, body) {

        if (!error && response.statusCode == 200) {
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
var adddeviceToGroup = function(deviceInfo) {
    console.log('开始添加设备到分组adddeviceToGroup');
    //获取getAccessToken
    var accessToken = getAccessToken();
    deviceInfo.access_token = accessToken

    request.post({
        url: wechatApi.devices.adddeviceToGroup.replace('ACCESS_TOKEN', accessToken),
        form: deviceInfo
    }, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            // console.log('body',body);
            // body = JSON.parse(body); //格式化为对象
            // body = JSON.stringify(body,null,4)

            // fs.writeFileSync(path.join(__dirname,'../files/deviceGroupList.json'),body);

            return true;
        }
    });
}



module.exports = {
    getAccessToken: getAccessToken,
    getJsapiTicket: getJsapiTicket,
    getDeviceGroupList: getDeviceGroupList,
    addDeviceGroup: addDeviceGroup,
    adddeviceToGroup: adddeviceToGroup
}