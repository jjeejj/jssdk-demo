var express = require('express');

var router = express.Router();

var wechatApiUtils = require('../utils/wechatApiUtils');

router.get('/getDeviceGroupList',function (req,res) {
    var deviceGroupList = wechatApiUtils.getDeviceGroupList();

    res.send(deviceGroupList);
});

module.exports = router;