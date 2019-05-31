// pages/Info_manage/forget_password.js
const $config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psdType: true, //为password类型
    eyesImg: '../../image/eyes.png', //默认眼睛闭上,
    pwd: '',
    tel: '',
    code: '',
    appcode: '3',
    code: '',
    codetext: '获取验证码',
    disabled: false
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  tel: function(e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  code: function (e) {
    var that = this;
    that.setData({
      code: e.detail.value
    })
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
      type: 3
    }, function(data) {
      if (data.code == 1) {
        $config.showAlert('验证码已发送，请查收');
        var interID = setInterval(function() {
          var seconds = _this.data.codetext.replace('s', '');
          _this.setData({
            codetext: (parseInt(seconds) - 1) + 's'
          })
          if (seconds < 1) {
            clearInterval(_this.data.intervarID);
            _this.setData({
              codetext: '重新获取',
              disabled: false
            })
          }
        }, 1000)
        _this.setData({
          codetext: '60s',
          disabled: true,
          intervarID: interID
        })
      } else {
        $config.showAlert(data.msg);
        return
      }
    })
  },
  password: function(e) {
    var _this = this;
    _this.setData({
      pwd: e.detail.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  listenerLogin: function() {
    var _this = this;
    if (_this.data.pwd.length == 0) {
      $config.showAlert('密码不能为空');
      return
    }
    if (_this.data.tel.length == 0) {
      $config.showAlert('手机号不能为空');
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
    wx.showLoading({
      title: '正在处理...',
      mask: true
    })
    $config.post('AppUser/forgetPwd', _this.data, function(data) {
      wx.hideLoading();
      if (data.code == 1) {
        //成功
        $config.showAlert('修改成功');
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/myInfo/login',
          })
        },100)
     
      } else {
        $config.showAlert(data.msg);
        return
      }
    })

  }
})