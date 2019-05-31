// pages/Info_manage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhanghao: '',
    qq: '',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  this.loadData(function(){

  })
  },
  loadData:function(callback){
    var that = this;
    var user = wx.getStorageSync('user')
    if (user.uid == null) {
      wx.redirectTo({
        url: '../../pages/myInfo/login',
      })
      return
    }
    var ooo = user.tel.substr(0, 3) + '****' + user.tel.substr(7);
    that.setData({
      zhanghao: user.zhanghao,
      qq: user.qq,
      tel: ooo
    })
    callback();
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
    var that=this;
    wx.showNavigationBarLoading();
    that.loadData(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
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

  }
})