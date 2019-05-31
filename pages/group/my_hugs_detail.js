const $config = require('../../config');
// pages/group/my_hugs_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_detail: [

    ],
    postdata: [{
      type: ''
      // mdid: '',
      // shid: '',
      // team_id: '',
      // id: ''
    }],
    imglist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var Objc = decodeURIComponent(options.jsonStr)
    let Objcs = JSON.parse(Objc);
    //console.log(Objcs);
    that.setData({
      postdata: Objcs
      // mdid: options.mdid,
      // shid: options.shid,
      // team_id: options.team_id,
      // id: options.team_user_id
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
    wx.stopPullDownRefresh();
    this.loadData(function () {

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
    var that = this;
    console.log(that.data.user_detail)
    var user_detail = that.data.user_detail
    var obj = {}
    obj.team_id = user_detail.team_id
    obj.shid = user_detail.shid
    obj.mdid = user_detail.mdid
    obj.activity_id = user_detail.activity_id
    let str = JSON.stringify(obj);
    return {
      title: '组团开黑送网费',
      path: '/pages/group/groupTeam?jsonStr=' + encodeURIComponent(str),
      success: (res) => { // 成功后要做的事情
        if (res.errMsg == 'shareAppMessage:ok') { //判断分享是否成功
          if (res.shareTickets == undefined) { //判断分享结果是否有群信息
            //分享到好友操作...
          } else {
            //分享到群操作...
            var shareTicket = res.shareTickets[0];
            wx.getShareInfo({
              shareTicket: shareTicket,
              success: function(e) {
                //当前群相关信息
                var encryptedData = e.encryptedData;
                var iv = e.iv;
              }
            })
          }
        }

      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //接口方法
  loadData: function(callback) {
    var that = this;
    $config.post('activity/activity_Shared_baotuanDetail',
      that.data.postdata,
      function(data) {
        if (data.code == 1) {
          var $data = data.data[0];

          $data.starttime = $data.starttime.Format('yyyy-MM-dd hh:mm')
          $data.addtime = $data.addtime.Format('yyyy-MM-dd hh:mm')
          $data.endtime = $data.endtime.Format('yyyy-MM-dd hh:mm')
          that.setData({
            user_detail: $data,
            imglist: data.count
          });
        } else {
          $config.showAlert("加载失败");
        }
        callback();
      })
  },
  update_team: function(e) {

    var that = this;
    var title;
    if (that.data.postdata.open_person == 1) {
      that.data.postdata.type = 1;
      title = '确定要解散吗？'
    }
    if (that.data.postdata.open_person != 1) {
      that.data.postdata.type = 2;
      title = '确定要退出吗？'
    }


    wx.showModal({
      title: '提示',
      content: title,
      success: function(sm) {
        if (sm.confirm) {
          $config.post('activity/edit_team', that.data.postdata, function(data) {
            if (data == 'True') {
              $config.showLoading("操作成功")
              setTimeout(function() {
                wx.navigateBack({ ////返回上一页面或多级页面
                  // url: "/pages/myInfo/index"
                  //url: "/pages/group/myhugs"
                  delta: 2
                })
              }, 1000) //延迟时间 这里是1秒
            } else {
              $config.showAlert("操作失败")
            }
          })
        }
      }
    })

  }

})