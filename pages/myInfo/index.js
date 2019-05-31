// pages/myInfo/index.js

const $config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    Virtual_money: '0',
    usersName: '******',
    header_img: '',
    postdata: {
      PageSize: 10,
      index: 0,
      qianbao_id: "",
      optype: "",
      begindate: "",
      enddate: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData(function(){

    });
  },
  loadData:function(callback){
    var _this = this;
    var user = wx.getStorageSync('user');
    var userinfo = wx.getStorageSync('userinfo');
    var uid = user.uid;
    if (uid == null) {
      wx.redirectTo({
        url: 'login',
      });
      return;
    }
    if (user.imgurl == null || user.imgurl==''){
      user.imgurl = userinfo.avatarUrl;
      if (userinfo.avatarUrl == null || userinfo.avatarUrl==''){
        user.imgurl = "../../image/header_img.png"
      }
    }
    _this.setData({
      usersName: user.username,
      header_img: user.imgurl
    })

    $config.post('AppUser/getqianbao_id', {
      type: '0',
      shanghu_id: '1'
    }, function (data) {
      wx.setStorageSync("qianbao_id", data.data);
      $config.post('AppUser/Get_qianbao_baseinfo', {
        shanghu_id: '1',
        qianbao_id: data.data,
        uid: uid,
        type: ''
      }, function (item) {
        if (item.code == 1) {
          _this.setData({
            balance: parseFloat(item.data.yue_money).toFixed(2)
          })
        } else {
          $config.post('AppUser/get_qianbao_kaitong', {}, function (data){
            wx.setStorageSync("qianbao_id", data.data);
          })
          _this.setData({
            balance: '0.00'
          })
        }
        callback();
      })
    })
  },
  // 充值按钮
  bolcok: function () {
   
    var that = this;
    var toqianbao_id = wx.getStorageSync('qianbao_id'); 
    var appid = wx.getStorageSync('appid');
    var user = wx.getStorageSync('user');
    if (user.length == 0 || appid.length == 0) {
      wx.redirectTo({
        url: '../../pages/myInfo/login',
      })
      return
    }
    if (toqianbao_id.length == 0) {
      $config.showAlert("没有开通钱包");
      return
    }else{
      wx.navigateTo({
        url: '../../pages/Recharge/index',
      })  

    }
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var user = wx.getStorageSync('user');
    if (user.uid == null) {
      // wx.redirectTo({
      //   url: '../../pages/myInfo/login',
      // })
    }
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
    var that = this;
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.loadData(function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
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
  tuichu: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function(sm) {
        if (sm.confirm) { 
          wx.setStorageSync("user", '');
          wx.setStorageSync("token", '');
          wx.setStorageSync("timestamp", '');
          wx.redirectTo({
            url: '../../pages/myInfo/login',
          })
        } else if (sm.cancel) {
        }
      }
    })
  }
})