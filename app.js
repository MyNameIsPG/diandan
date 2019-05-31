//index.js    
//引用配置
const $config = require('config');
//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 登录
    wx.login({
      success: res => {
      
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getSetting({
          success: res2 => {
           
            if (res2.authSetting['scope.userInfo']) {
              that.Login(res.code);
            } else {
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  that.Login(res.code);
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
             
              wx.setStorage({
                key: 'userinfo',
                data: res.userInfo
              });
              wx.setStorageSync("userinfo", res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  Login: function(code) {
    var that = this;
    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        var postdata = res.userInfo;
        wx.setStorageSync("wx_img", res.userInfo.avatarUrl);
        postdata.code = code;
        $config.post('AppUser/getOpenid', postdata,
          function(data) {
            if (data.code == 1) {
              //根据appid判断是否有存在该用户
              wx.setStorageSync("appid", data.data.appid);
              wx.setStorageSync("user", data.data.userinfo);
              wx.setStorageSync("token", data.data.token);
              wx.setStorageSync("wx_img", postdata.avatarUrl);
              wx.setStorageSync("timestamp", data.data.timestamp);
            } else if (data.code == '8888') {
              wx.setStorageSync("appid", data.data.appid);
              wx.setStorageSync("wx_img", postdata.avatarUrl);
              wx.setStorageSync("user", '');
              wx.setStorageSync("token", '');
              wx.setStorageSync("timestamp", '');
              // wx.redirectTo({
              //   url: '../../pages/myInfo/login',
              // })
              return
            } else {
              $config.showAlert('系统异常');
              wx.setStorageSync("user", '');
              wx.setStorageSync("token", '');
              wx.setStorageSync("timestamp", '');
              return;
            }

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          });
      }
    })
  }
})


// 2791165732@qq.com
// wjl1984!@