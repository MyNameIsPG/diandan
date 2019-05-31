// pages/myInfo/Asset_records.js
const $config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort_box: true, //隐藏
    chekcJl: false,
    recordsList: [],
    postdata: {
      PageSize: 25,
      index: 0,
      qianbao_id: "",
      token: "",
      begindate: "",
      enddate: "",
      time_r: '',
      optype: '' //判断是充值还是提现之类的
    },
    time_r: '',
    addtime_year: '',
    addtime_month: '',
    optype: '',
    no_data: false, //无更多数据
    no_detail:false,//没有列表数据
    arrLength:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var date = new Date();
    var myDate = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2));

    var op = options.optype;
    if (op == 1) {
      _this.setData({
        optype: "充值",
        chekcJl: true,
        time_r: myDate,
        addtime_year: date.getFullYear(),
        addtime_month: ("0" + (date.getMonth() + 1)).slice(-2),
      })
    } else {
      _this.setData({
        optype: "",
        time_r: myDate,
        addtime_year: date.getFullYear(),
        addtime_month: ("0" + (date.getMonth() + 1)).slice(-2),
        chekcJl:false
      })
    }
    _this.getList(0);
  },

  // 日期选择
  bindDateChange: function(e) {
    var that = this;
   
    var datetime = e.detail.value
    that.setData({
      time_r: datetime,
      addtime_year: datetime.slice(0, 4),
      addtime_month: datetime.substring(5),
    })


    setTimeout(function() {
      that.getList(0, function() {});
    }, 100)
  },
  // 点击显示排序选择
  ClickAlert: function(e) {
    var that = this;
    var show = true;
    if (that.data.sort_box == true) {
      show = false
    } else {
      show = true
    }
    that.setData({
      sort_box: show
    })
  },
  // 点击选择优先排序
  ClickSort: function(e) {
    var that = this;
    //console.log(e)
    var name = e.currentTarget.dataset.name
    //  if (name){
    // 判断选择的排序类型
    //  }
    that.setData({
      sort_box: true,
      optype: e.currentTarget.dataset.name
    })
    that.getList(0);
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#eeeeee',

    })
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
    wx.showNavigationBarLoading();
    var _this = this;
    _this.getList(0, function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    if (_this.data.arrLength == 0) {
      _this.setData({
        no_detail: true,
        no_data: true,
      });
    }
    // 显示加载图标  
    if (_this.data.no_data)
      return;
    wx.showLoading({
      title: '玩命加载中',
    })
    _this.getList(1, function() {
      wx.hideLoading();
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getList: function(index, callback) {
    var _this = this;
    var pos = _this.data.postdata
    pos.qianbao_id = wx.getStorageSync('qianbao_id');
    pos.optype = _this.data.optype;
    
    if (index == 0) {
      pos.index = 0;
      _this.setData({
        no_data: false,
      });
    } else {
      pos.index++;
    }
    _this.setData({
      postdata: pos
    });
    if (pos.qianbao_id == null || pos.qianbao_id == "") {
      $config.showAlert("没有开通钱包");
      return
    }
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    $config.post('AppUser/get_money_log', pos, function(data) {
      var date_post = JSON.parse(data.data);
      _this.setData({
        arrLength: date_post.length
      });
      var obj=[]
      if (index == 1) {
        obj = _this.data.recordsList;
      }
      wx.hideLoading();
      if (data.code == 1) {
       
        if (date_post.length ==0){
          _this.setData({
            no_detail: true,
          });
        }else{
          date_post.forEach(function(item,_index){
            obj.push({
              addtime: item.addtime,
              id: item.id,
              money1: item.money1,
              op_mendian_name: item.op_mendian_name,
              op_shanghu_name: item.op_shanghu_name,
              optype: item.optype,
              qianbao_id: item.qianbao_id,
              remark: item.remark,
              state: item.state,
              yue_money: item.yue_money
            })
          })
          _this.setData({
            no_detail: true,
            recordsList: obj
          });
        }
      } else {
        $config.showAlert(data.msg);
      }
      if (callback != undefined)
        callback();
    })
  }
})