// pages/Info_manage/modify_pwd.js
const $config=require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    psdType: '', //第一次密码
    pwdType: '', //第二次密码
    code:'',
    disabled: false,
    codetext: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  psdType: function(e) {
    var that = this;
    that.setData({
      psdType:e.detail.value
    })
  },
  pwdType: function(e) {
    var that = this;
    that.setData({
      pwdType: e.detail.value
    })
  },
  code:function(e){
    var that = this;
    that.setData({
      code: e.detail.value
    })
  },
  sendcode:function(){
    var that=this;
    if (that.data.psdType.length == 0 || that.data.pwdType.length == 0){
      $config.showAlert("密码不能为空");
      return 
    }
    if (that.data.psdType != that.data.pwdType){
      $config.showAlert("两次密码不一致");
      return 
    }
    var user=wx.getStorageSync('user');
    if(user.tel==null){
      $config.showAlert("没有电话号码");
      return
    }
    $config.post('User/sendcode', { tel: user.tel, type: 3, mendian_id:0 }, function (data) {
      if (data.code == 1) {
        var ooo = user.tel.substr(0, 3) + '****' + user.tel.substr(7)
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
  listenerLogin: function () {
    var that =this;
    var user = wx.getStorageSync('user');
    if (that.data.code =="") {
      $config.showAlert("验证码不能为空");
      return
    }
    wx.showLoading({
      title: '正在修改...',
      mask: true
    })
    $config.Clientpost('User/change_password', { pwd: that.data.pwdType, code: that.data.code, tel: user.tel, mendian_id: 0}, function (data) {
      wx.hideLoading();
      if (data.code == 1) {
        $config.showAlert('密码修改成功');
        wx.navigateBack({
          url: '../../pages/myInfo/index',
        })
      } else {
        $config.showAlert('修改失败,' + data.msg);
        return;
      }
    })
  }
})