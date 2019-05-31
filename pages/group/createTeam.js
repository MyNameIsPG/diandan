// pages/group/createTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: '',
    rlue: '',
    time: '',
    title: '',
    teamName: '',
    teamSlogan: '',
    mendianId: '',
    shanghuId: '',
    team_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Objc = decodeURIComponent(options.jsonStr)
    let Objcs = JSON.parse(Objc);
    that.setData({
      activity_id: Objcs.activity_id,
      rlue: Objcs.rlue,
      time: Objcs.time,
      title: Objcs.title,
      mendianId: Objcs.mdid,
      shanghuId: Objcs.shid,
      teamName: Objcs.teamname,
      teamSlogan: Objcs.teamslogan,
      team_id: Objcs.team_id,
    })
  },
// 去邀请好友
  clickToInviting_friends:function(e){
    var that = this
    var obj = {}
    obj.team_id = that.data.team_id
    obj.shid = that.data.shanghuId
    obj.mdid = that.data.mendianId
    obj.activity_id = that.data.activity_id
    let str = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/group/groupTeam?jsonStr=' + encodeURIComponent(str),
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#13131b',

    })
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
    var that=this
    var obj={}
    obj.team_id = that.data.team_id
    obj.shid = that.data.shanghuId
    obj.mdid = that.data.mendianId
    obj.activity_id = that.data.activity_id
    let str = JSON.stringify(obj);
    return {     
      title: that.data.teamSlogan + '@' + that.data.teamName,
      path: '/pages/group/groupTeam?jsonStr=' + encodeURIComponent(str),
      success: (res) => {    // 成功后要做的事情
        if (res.errMsg == 'shareAppMessage:ok') {//判断分享是否成功
          if (res.shareTickets == undefined) {//判断分享结果是否有群信息
            //分享到好友操作...
          } else {
            //分享到群操作...
            var shareTicket = res.shareTickets[0];
            wx.getShareInfo({
              shareTicket: shareTicket,
              success: function (e) {
                //当前群相关信息
                var encryptedData = e.encryptedData;
                var iv = e.iv;
              }
            })
          }
        }
       
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
 
   },

})