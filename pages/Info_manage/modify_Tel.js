// pages/Info_manage/modify_Tel.js

const $config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    code: '',
    codetext: '获取验证码',
    disabled: false,
    olddisabled: false,
    oldcodetext: '获取验证码',
    oldcode: '',
    yincan:true,
    oldyincan:false,
    oldvalue:'',
    oldtel:''
  },
  tel: function(e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    })
  },
  code: function(e) {
    var that = this;
    that.setData({
      code: e.detail.value
    })
  },
  oldcode: function(e) {
    var that = this;
    that.setData({
      oldcode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    var user = wx.getStorageSync('user');
    if (user.tel == null) {
      $config.showAlert("没有旧电话号码");
      return
    }
    var ooo = user.tel.substr(0, 3) + '****' + user.tel.substr(7);
    that.setData({
      oldvalue: ooo,
      oldtel: user.tel
    })
  },
  sendcode: function() {
    var that = this;
    if (that.data.tel.length == 0) {
      $config.showAlert("电话不能为空");
      return
    }
    var user = wx.getStorageSync('user');
    if (user.tel == null) {
      $config.showAlert("没有旧电话号码");
      return
    }
    $config.post('User/sendcode', {
      tel: that.data.tel,
      type: 6,
      mendian_id: 0
    }, function(data) {
      if (data.code == 1) {
        var ooo = that.data.tel.substr(0, 3) + '****' + that.data.tel.substr(7);
        $config.showAlert("验证码已发送至手机号：" + ooo);
        var interID = setInterval(function () {
          var seconds = that.data.codetext.replace('s', '');
          that.setData({
            codetext: (parseInt(seconds) - 1) + 's'
          })
          if (seconds < 1) {
            clearInterval(that.data.intervarID);
            that.setData({
              codetext: '重新获取',
              disabled: false
            })
          }
        }, 1000)
        that.setData({
          codetext: '60s',
          disabled: true,
          intervarID: interID
        })
      } else {
        $config.showAlert("验证码发送失败" + data.msg);
        return;
      }
    })
  },
  listenerLogin: function() {
    var that = this;
    var user = wx.getStorageSync('user');
    if (that.data.code == "") {
      $config.showAlert("验证码不能为空");
      return;
    }
    wx.showLoading({
      title: '正在修改...',
      mask: true
    })
    $config.Clientpost('User/change_phone', {
      tel: that.data.tel,
      code: that.data.code,
      oldtel: user.tel,
      mendian_id: 0,
      userid: user.uid
    }, function(data) {
      wx.hideLoading();
      if (data.code == 1) {
        $config.showAlert('手机号修改成功');
        user.tel = that.data.tel;
        wx.setStorageSync('user', user);
        wx.navigateBack({
          url: '../../pages/Info_manage/index'
        })
        return;
      } else {
        $config.showAlert('手机号修改失败,' + data.msg);
        return;
      }
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

  odlsendcode: function() {
    var that = this;
    var user = wx.getStorageSync('user');
    if (user.tel == null) {
      $config.showAlert("没有旧电话号码");
      return
    }
    $config.Clientpost('User/sendcode', {
      tel: user.tel,
      type: 4,
      mendian_id: 0
    }, function(data) {
      if (data.code == 1) {
        var ooo = user.tel.substr(0, 3) + '****' + user.tel.substr(7);
        $config.showAlert("验证码已发送至手机号：" + ooo);
        var interID = setInterval(function () {
          var seconds = that.data.oldcodetext.replace('s', '');
          that.setData({
            oldcodetext: (parseInt(seconds) - 1) + 's'
          })
          if (seconds < 1) {
            clearInterval(that.data.intervarID);
            that.setData({
              oldcodetext: '重新获取',
              olddisabled: false
            })
          }
        }, 1000)
        that.setData({
          oldcodetext: '60s',
          olddisabled: true,
          intervarID: interID
        })
      } else {
        $config.showAlert("验证码发送失败" + data.msg);
        return;
      }
    })
  },
  xiayibu: function() {
    var that = this;
    if (that.data.oldcode.length==0) {
      $config.showAlert('请输入验证码');
      return;
     }
    $config.Clientpost('User/checkcode', {
      tel: that.data.oldtel,
      type: 4,
      code: that.data.oldcode,
      mendian_id:0
    }, function(data) {
      if (data.code == 1) {
        that.setData({
          yincan:false,
          oldyincan:true
        })
      }else{
        $config.showAlert('您输入的验证码不正确！');
        return;
      }
    })
  }

})