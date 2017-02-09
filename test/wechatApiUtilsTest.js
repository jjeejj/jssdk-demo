const assert = require('assert');
var wechatApiUtils = require('../utils/wechatApiUtils');

// console.log(typeof wechatApiUtils.updateAccessToken().then)

describe('accessToken',function () {
    describe('updateAccessToken',function () {
        it('updateAccessToken 应该返回Promise',function() {
            assert.equal(true,typeof wechatApiUtils.updateAccessToken().then == 'function' );
        })
    })
})