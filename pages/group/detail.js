// pages/group/detail.js
const $config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:'',
    rlue:'',
    time:'',
    title:'',
    teamName:'',
    teamSlogan:'',
    mendianId: '',
    shanghuId: '',
    activity_id:'',
    isexpired:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Objc = decodeURIComponent(options.jsonStr)
    let Objcs = JSON.parse(Objc);
    var isexpired = new Date().Format('yyyy-MM-dd HH:mm:ss') > Objcs.time;
    that.setData({
      activity_id: Objcs.activity_id,
      rlue: Objcs.rlue,
      time: Objcs.time,
      title: Objcs.title,
      mendianId: Objcs.mdid,
      shanghuId: Objcs.shid,
      activity_id: Objcs.activity_id,
      isexpired: isexpired
    })
  },
//  获取团队名称
  InputTeamName:function(e){
    var teamName = e.detail.value
    this.setData({
      teamName: teamName
    })
  },
  //  获取团队口号
  InputTeamSlogan: function (e) {
    var teamSlogan = e.detail.value
    this.setData({
      teamSlogan: teamSlogan
    })
  },


  // 点击创团
  clickTocreate:function(e){
    var that=this;
    var pos={};
    pos.mdid= that.data.mendianId,
    pos.shid= that.data.shanghuId,
    pos.activity_id = that.data.activity_id,
    pos.rlue= that.data.rlue,
    pos.time=that.data.time,
    pos.title= that.data.title,
    pos.teamname= that.data.teamName,
    pos.teamslogan= that.data.teamSlogan
    if (pos.teamname.length<=0){
      $config.showAlert("团名不能为空！");
      return;
    }
    if (pos.teamslogan.length <= 0) {
      $config.showAlert("口号不能为空！");
      return;
    }
    let str = JSON.stringify(pos);
    $config.post('activity/activity_Shared_addrecode', pos, function (data) {
        if(data.code==1){
            if(data.data[0]==1){
              pos.team_id = data.data[1]
              let str = JSON.stringify(pos);
              $config.showAlert("创建团队成功！");
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/group/createTeam?jsonStr=' + encodeURIComponent(str),
                })
              }, 1000)
            }
            else{//1.
              $config.showAlert("创建团队失败," + data.data[1]);
            }
        }else{
          $config.showAlert("创建团队失败,"+data.msg);
          return
        }
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

  }
})