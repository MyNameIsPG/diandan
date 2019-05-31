// pages/index/news_detail.js
const $config = require('../../config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    news_list: [],
    newsida: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      newsida: options.id
    })
    this.loadData(function() {

    });
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
  loadData: function(callback) {
    var that = this;
    var newsid = that.data.newsida;
    $config.post('news/listone', {
      newsid: newsid
    }, function(data) {
      if (data.code == 1) {
        that.setData({
          news_list: data.data
        });
      } else {
        $config.showAlert("加载失败");
      }
      callback();
    })
  },

})