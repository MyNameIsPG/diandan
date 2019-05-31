// pages/group/groupTeam.js
const $config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postdata: {
      team_id: '',
      activity_id: '',
      mdid: '',
      shid: '',
      userid: ''
    },
    starttime: '',
    endtime: '',
    rule_description: '',
    CountNum: '',
    surplus: '',
    team_id: '',
    shid: '',
    mdid: '',
    activity_id: '',
    mendian_name: '',
    team_members: [],
    create_team:'我要参团'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var Objc = decodeURIComponent(options.jsonStr)
    let Objcs = JSON.parse(Objc);
    var pos = that.data.postdata
    pos.team_id = Objcs.team_id
    pos.activity_id = Objcs.activity_id
    pos.mdid = Objcs.mdid
    pos.shid = Objcs.shid
    that.setData({
      postdata: pos
    })
    that.loadData();
  },
  // 去创建团队
  clickToCreateTeam: function() {
    var that = this
    var userinfo = wx.getStorageSync('user')
    var Sid = that.data.shid
    var Mid = that.data.mdid
    if (userinfo.uid == '') {
      wx.redirectTo({
        url: '/pages/myInfo/register'
      })
    } else {
      wx.redirectTo({
        // url: '/pages/group/index?Sid=' + Sid + '&Mid=' + Mid,
        url: '/pages/group/index?shanghu_id=' + Sid + '&mendian_id=' + Mid,
      })
    }
  },
  // 返回首页
  backIndex: function() {
    wx.reLaunch({
      url: '/pages/index/index',
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
    var that=this;
    //修改头部标题
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#13131b',

    })
    that.loadData();
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 隐藏导航栏加载框
    that.loadData();
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var that = this;
    var obj = {}
    obj.team_id = that.data.team_id
    obj.shid = that.data.shid
    obj.mdid = that.data.mdid
    obj.activity_id = that.data.activity_id
    let str = JSON.stringify(obj);
    var shareObj = {
      title: '组团开黑送网费',
      path: '/pages/group/groupTeam?jsonStr=' + encodeURIComponent(str),
      success: function(res) { // 成功后要做的事情
      },
    };
    return shareObj
  },
  //页面加载方法
  loadData: function() {
    var that = this;
    $config.post('activity/activity_Shared_activityDetail',
      that.data.postdata,
      function(data) {
        var res = data.data[0]
        var list = data.count
        if (data.code == 1) {
          var surplus = res.participants - res.CountNum
          var starttime = res.starttime.Format('yyyy/MM/dd')
          var endtime = res.endtime.Format('yyyy/MM/dd')
          that.setData({
            starttime: starttime,
            endtime: endtime,
            rule_description: res.rule_description,
            CountNum: res.CountNum,
            surplus: surplus,
            team_id: res.team_id,
            shid: res.shid,
            mdid: res.mdid,
            activity_id: res.activity_id,
            mendian_name: res.mendian_name
          })
          var obj = []
          // 获取团队人员
          list.forEach(function(item, index) {
            if (item.wx_img == null && item.wx_img ==''){
              var wximg = wx.getStorageSync('wx_img');
              obj.push({
                wx_img: wximg
              })
            }else{
              obj.push({
                wx_img: item.wx_img
              })
            }
           
          })
          that.setData({
            team_members: obj
          })
        }
      })
  },

  // 我要参团
  clickToInviting_friends: function() {
    var that = this;

    if (that.data.postdata.userid == "" || that.data.postdata.userid == null) {
      wx.navigateTo({
        url: '/pages/myInfo/login?num=1'
      })
      return
    }
    $config.post('activity/activity_Shared_is_repeat',
      that.data.postdata,
      function(data) { 
        if (data.code == 1) {
            $config.showAlert("参加成功");
          that.loadData(); 
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/my/my_hugs'
              })
            }, 1000) 
        } else {
          $config.showAlert("参加失败,"+data.msg); 
        }
      })
    wx.showLoading({
      title: '正在参团中...',
      mask: true
    })
    //that.data.create_team = '已参团'; 
  }
})