// pages/myInfo/register.js
const $config = require('../../config.js');

const $md5 = require('../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    psdType: true, //为password类型
    eyesImg: '../../image/eyes.png', //默认眼睛闭上,
    uname: '',
    pwd: '',
    sfcode: '',
    tel: '',
    code: '',
    appcode: '1',
    appid: '',
    zhanghao:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 点击眼睛看密码
  onClickEyes: function(e) {
    var that = this;
    var psd = that.data.psdType
    var curType;
    var Img;
    if (psd == true) {
      curType = false;
      Img = '../../image/eyes_show.png'
    } else {
      curType = true;
      Img = '../../image/eyes.png'
    }

    that.setData({
      psdType: curType,
      eyesImg: Img
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  zhanghao: function(e) {
    var _this = this;
    _this.setData({
      zhanghao: e.detail.value
    })
  },
  pwd: function(e) {
    var _this = this;
    _this.setData({
      pwd: e.detail.value
    })
  },
  username: function(e) {
    var _this = this;
    _this.setData({
      uname: e.detail.value
    })
  },
  sfcode: function(e) {
    var _this = this;
    _this.setData({
      sfcode: e.detail.value
    })
  },
  tel: function(e) {
    var _this = this;
    _this.setData({
      tel: e.detail.value
    })
  },
  code: function(e) {
    var _this = this;
    _this.setData({
      code: e.detail.value
    })
  },
  //发生验证码
  sendcode: function() {
    var _this = this;
    if (_this.data.tel.length == 0) {
      $config.showAlert('电话号码不能为空');
      return
    }
    if (_this.data.tel.length != 11) {
      $config.showAlert('手机号位数不正确');
      return
    }
    $config.post('AppUser/sendcode', {
      tel: _this.data.tel,
      appcode: _this.data.appcode,
      type: 1
    }, function(data) {
      if (data.code == 1) {
        $config.showAlert('验证码已发送，请查收');
      } else {
        $config.showAlert('出现错误，请重试');
        return
      }
    })
  },
  listenerLogin: function() {
    var _this = this;

    if (_this.data.zhanghao.length == 0) {
      $config.showAlert('账号不能为空');
      return
    }
    if (_this.data.pwd.length == 0) {
      $config.showAlert('密码不能为空');
      return
    }
    if (_this.data.uname.length == 0) {
      $config.showAlert('姓名不能为空');
      return
    }
    if (_this.data.sfcode.length == 0) {
      $config.showAlert('身份证号码不能为空');
      return
    }
    if (_this.data.tel.length == 0 ){
      $config.showAlert('电话号码不能为空');
      return
    }
    if (_this.data.code.length == 0) {
      $config.showAlert('验证码不能为空');
      return
    }
    if (_this.data.pwd.length < 6) {
      $config.showAlert('密码必须大于6位数');
      return
    }
    if (_this.data.tel.length != 11) {
      $config.showAlert('手机号位数不正确');
      return
    }
    _this.data.appid = wx.getStorageSync('appid');
    wx.showLoading({
      title: '正在注册...',
      mask: true
    })
    $config.post('AppUser/appregister', _this.data, function(data) {
      wx.hideLoading();
      if (data.code == 1) {
        //注册成功后跳转登陆
        $config.post('AppUser/applogin', {
          zhanghao: _this.data.zhanghao,
          pwd: _this.data.pwd,
          appid: _this.data.appid
        }, function(data) {
          if (data.code == 1) {
            wx.setStorageSync("user", data.data.userinfo);
            wx.setStorageSync("token", data.data.token);
            wx.setStorageSync("timestamp", data.data.timestamp);
            wx.switchTab({
              url: '../../pages/index/index'
            })
          } else {
            $config.showAlert(data.data.msg);
          }
        })
      } else {
        $config.showAlert(data.msg);
        return
      }
    })
  }
})