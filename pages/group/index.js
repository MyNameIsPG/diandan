// pages/group/index.js
const $config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_list: [],
    shanghuId: 0,
    mendianId: 0,
    postdata: {
      shid: 0,
      mdid: 0,
      startIndex: 0,
      endIndex: 4
    },
    no_data: false, //无更多数据
    referrer_shid:'',
    referrer_mdid:'',
    activity_type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var shanghuId = options.shanghu_id;
    var mendianId = options.mendian_id;
    var pos = that.data.postdata;
    //取缓存  存缓存
    var getmendian_id = wx.getStorageSync("referrer_mdidsss");
    var options_referrer_mdid = options.referrer_mdid;
    //如果没有收到二维码传值的信息则不做操作  表示不是门店推荐注册的
    if (options_referrer_mdid != null && options_referrer_mdid != ''){//测试的时候先干掉，正式的时候取出来
      //把二维码传过来的取出来成为缓存
        that.data.referrer_shid = options.referrer_shid;
        that.data.referrer_mdid = options.referrer_mdid;
        that.data.activity_type = options.activity_type;
        that.data.activity_id = options.activity_id;
        wx.setStorageSync("referrer_shid", that.data.referrer_shid);
        wx.setStorageSync("referrer_mdid", that.data.referrer_mdid);
        wx.setStorageSync("activity_type", that.data.activity_type);
        wx.setStorageSync("activity_id", that.data.activity_id);

    }
    pos.shid = shanghuId
    pos.mdid = mendianId,
      that.setData({
        shanghuId: shanghuId,
        mendianId: mendianId,
        postdata: pos
      })
    that.loadData(0, function () { });

  },
  loadData: function (start,callback) {
    var that = this
    var pos = that.data.postdata
    if (start == 0) {
      pos.startIndex = 1;
      that.setData({
        no_data: false
      });
    } else {
      pos.startIndex++;
    }
    that.setData({
      postdata: pos
    });
    $config.post('activity/getactivityshared_list', pos, function (data) {
      var obj = []
      if (start == 1) {
        obj = that.data.group_list;
      }
      if (data.code == 1) {
        var List = data.data
        List.forEach(function (item, index) {
          item.endtime = item.endtime.Format('yyyy-MM-dd hh:mm:ss')
          obj.push({
            activity_id:item.id,
            title: item.activityname,
            rlue: item.rule_description,
            time: item.endtime,
          })
        })
      }
      that.setData({
        group_list: obj
      })
      if (callback != undefined)
        callback();
    })

  },

  // 点击去创建团队页面
  CilckToCreateTeam: function (e) {
    var that=this
    var obj = e.currentTarget.dataset
    let str = JSON.stringify(obj);
    var pos={}
    pos.mdid = obj.mdid
    pos.shid = obj.shid
    pos.activity_id = obj.activity_id
    var user = wx.getStorageSync('user');
    if (user.length==0){
      // if (that.data.referrer_shid != null && that.data.referrer_shid != ''){
      //   wx.navigateTo({
      //     url: '/pages/myInfo/login?num=1&referrer_shid=' + that.data.referrer_shid +'&referrer_mdid='+that.data.referrer_mdid+''
      //     //  url: '/pages/myInfo/register'
      //   })
      //   return;
      // }
      if (that.data.referrer_shid != null && that.data.referrer_shid != ''){
        wx.navigateTo({
           url: '/pages/myInfo/login?num=1'
          //url: '/pages/myInfo/login?num=0&referrer_shid=' + that.data.referrer_shid + '&referrer_mdid=' + that.data.referrer_mdid + ''
        })
      }else{
        wx.navigateTo({
           url: '/pages/myInfo/login?num=1'
          //url: '/pages/myInfo/login?num=1&referrer_shid=' + that.data.referrer_shid + '&referrer_mdid=' + that.data.referrer_mdid + ''
        })
      }
      return
    }

    $config.post('activity/activity_Shared_isCreat', pos, function (data) {
      var res=data.data[0]
      if(data.code==1){
        if (res.num >0){
          obj.teamname = res.teamname
          obj.teamslogan = res.teamslogan
          obj.team_id = res.id
          str = JSON.stringify(obj);
          wx.navigateTo({
            url: '/pages/group/createTeam?jsonStr=' + encodeURIComponent(str),
          })

        }else{
          wx.navigateTo({
            url: '/pages/group/detail?jsonStr=' + encodeURIComponent(str),
          })
        }
      }else{
        $config.showAlert('系统繁忙!')
      }


    })
  },

  // 去当前网咖
  ToIndex: function (e) {
    var that = this;
    var mendian_id = that.data.mendianId;
    var shanghu_id = that.data.shanghuId;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        wx.reLaunch({
          url: '/pages/wangka/detail?mendian_id=' + mendian_id + '&shanghu_id=' + shanghu_id + '&latitude=' + latitude + '&longitude=' + longitude,
        })
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.loadData(0, function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.no_data)
      return;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    this.loadData(1, function () {
      // 隐藏加载框  
      wx.hideLoading();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})