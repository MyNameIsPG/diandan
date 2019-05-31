const $config = require('../../config');
// pages/group/my_hugs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
teamlist:[
],
    mendian_name:[],
    startIndex: 0,
    endIndex: 5,
    no_data:false,
    no_detail: false,//没有列表数据
    // mendian_name:'',
    // activityname:'',
    // open_person:'',
    // listUser:[],
    // addtime:'',
    // teamstate:'',
    testlist:[]
    //testlist:''
    //imglist:[]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(0,function () {

    });
  },
  // 点击查看详情
  clikcToDetail:function(e){
      wx.navigateTo({
        url: '/pages/group/my_hugs_detail',
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
    wx.stopPullDownRefresh();
    this.loadData(0, function () {
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

  },
  //接口方法
  loadData: function (start,callback){
        var that = this;
    //var $list = this.data.testlist;
    //$list = [];
    if (start == 0) {
      that.data.startIndex = 1;
      //$list = '';
      that.data.teamlist = [];
      that.setData({
        no_data: false,
      });
    } else {
      that.data.startIndex++;
    } 
    var $list = this.data.teamlist;
    $config.post('activity/activity_Shared_myList', {
      startIndex: that.data.startIndex,
      endIndex: that.data.endIndex
    }, function (data) {
      if (data.code == 1) {
        if (data.data != '') {
        var $data = data.data;
        for (var i in $data){
          if ($data[i].teamstate == 0) {
            $data[i].teamstate = '已撤销'
            $data[i].extendrule = 'hugs-revoke-color'
          } else if ($data[i].teamstate == 1 && $data[i].state == 1) {
            $data[i].teamstate = '进行中'
            $data[i].extendrule = 'hugs-doing-color'
          } else if ($data[i].teamstate == 2){
            $data[i].teamstate = '已成功'
            $data[i].extendrule = 'hugs-success-color'
          } else if ($data[i].teamstate == 1 && $data[i].state == 3) {
            $data[i].teamstate = '已退团'
            $data[i].extendrule = 'hugs-revoke-color'
          } else{
            $data[i].teamstate = ''
          }
        }
          // $data.forEach(function (item, index) {
          //    $list.push({
          //      activityname: item.activityname,
          //      mendian_name: item.mendian_name,
          //      open_person: item.open_person,
          //      listUser: item.listUser,
          //      addtime: item.addtime,
          //      teamstate: item.teamstate
          //   })
          //  })
         $data.forEach(function(item,index){
            $list.push({
              testlist: item,
              //teamlist:item
            })
         })
        that.setData({
          teamlist: $list,
          // teamlist: $data,
          //imglist: $data.listUser
        });
        } else {
          that.setData({
            no_data: true
          });
        }
      }else{
        $config.showAlert("加载失败");
      }
      callback();
    })
  },
  // 点击查看队伍个人详情
  clikcToDetail: function (e) {
    var obj = e.currentTarget.dataset
    let str = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/group/my_hugs_detail?jsonStr=' + encodeURIComponent(str),
      success: function (re) {
      },
    })
  }
})