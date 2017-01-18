
// 微信api 接口

var wechatApi= {
    //获取access_token
    getAccessToken:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
    getJsapiTicket:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi',
    //设备api
    devices:{
        addGroup:'https://api.weixin.qq.com/shakearound/device/group/add?access_token=ACCESS_TOKE',
        getGrouplist:'https://api.weixin.qq.com/shakearound/device/group/getlist?access_token=ACCESS_TOKEN', //查询分组list
        adddeviceToGroup:'https://api.weixin.qq.com/shakearound/device/group/adddevice?access_token=ACCESS_TOKENPOST'
    }
}


exports = module.exports = wechatApi;
