// pages/prize/index.js
const $config = require('../../config');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort_box: true, //隐藏
    chekcJl: false,
    recordsList: [],
    postdata: {
      pageSize: 25,
      pageIndex: 1,
      token: "",
      begindate: "",
      enddate: "",
      addtime: '',
      activity_type: 0 //判断哪种活动  默认0，1.幸运大转盘 2.每日签到 3.整点红包,4、开机红包

    },
    addtime: '',
    addtime_year:'',
    addtime_month: '',
    activity_type: '',
    no_data: false, //无更多数据
    no_detail: false,//没有列表数据
    arrLength:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.getList(1)
  },
  getList: function (index, callback) {
    var _this = this;
    var $list = _this.data.recordsList;
    _this.data.postdata.addtime = _this.data.addtime;
    if (index == 1) {
      _this.data.postdata.pageIndex = index;
      $list = [];
      _this.setData({
        no_data: false
      });
    } else {
      _this.data.postdata.pageIndex++;
    }
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })

    $config.post('activity1/getlist', _this.data.postdata, function (data) {
      wx.hideLoading();
      var res=data.data
      _this.setData({
        arrLength:res.length
      });
      var addtime
      if (data.code == 1) {
        if(res==''){
          _this.setData({
            no_detail: false,
          });
        }else{
        res.forEach(function(item,index){
          addtime = item.addtime.Format('MM-dd hh:mm')
          $list.push({
            addtime: addtime,
            activity_type: item.activity_type,
            mendian_name: item.mendian_name,
            prize_name: item.prize_name
          })
        })
        _this.setData({
          recordsList: $list,
          no_detail:true
        });
        }
      } else {
        $config.showAlert(data.msg);
      }
      if (callback != undefined)
        callback();
    })
  },
  // 日期选择
  bindDateChange: function (e) {
    var that = this;
    var datetime = e.detail.value
    that.setData({
      addtime: datetime,
      addtime_year: datetime.slice(0, 4),
      addtime_month: datetime.substring(5),
    })
    setTimeout(function () {
      that.getList(1);
    }, 100)
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
      backgroundColor: '#d74a45',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
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
    wx.showNavigationBarLoading();
    var _this = this;
    _this.getList(1, function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.arrLength==0){
      that.setData({
        no_detail: true,
          no_data: true,
          });
    }
    // 显示加载图标  
    if (that.data.no_data)
       return;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.getList(0, function () {
      wx.hideLoading();
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})