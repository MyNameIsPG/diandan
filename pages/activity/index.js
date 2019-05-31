// pages/activity/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList:[
      { activityImg: "/image/yxhd_1.png", DetailUrl:'../../pages/activity/detail'},
      { activityImg: "/image/yxhd_2.png", DetailUrl: '' },
      { activityImg: "/image/yxhd_3.png", DetailUrl: '' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onclickUrl:function(e){
    var Url = e.currentTarget.dataset.url;
    if (Url == null || Url == '' || Url==undefined){
      wx.showToast({
        title: '敬请期待！',
        icon:'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    wx.navigateTo({
      url: Url,
      success: function(res) {
        
      },
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})