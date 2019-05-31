// pages/activity/detail.js
const $config = require('../../config');
var QQMapWX = require('../../map/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wk_list: [],
    postdata: {
      Pageindex: 0,
      PageSize: 5,
      mendian_name: '',
      lat: '',
      lon: '',
      sort: 0,
    },
    range: '',
    ranged: '',
    sort_box: true, //隐藏
    LinkAddress: false, //显示
    searchBox: true, //隐藏
    Animation: '',
    addressText: '正在定位中...',
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 50,
    size: 16,
    addressTextLength: 1,
    orientation: 'left', //滚动方向
    interval: 30, // 时间间隔
    //distance: (1, 1, 2, 2),
    latitude: '',
    longitude: '',
    mendian_latitude: '',
    mendian_longitude: '',
    no_data: false, //无更多数据
    star: '',
    kms: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取位置
    var that = this;

    wx.showLoading({
      title: '正在加载数据中，请稍候...',
    })

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XC5BZ-SBA3U-LGYVH-4H53S-5ZK6V-6YF2I'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var post = that.data.postdata;
        post.lat = res.latitude;
        post.lon = res.longitude;
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            //var address='湖南省长沙市岳麓区麓谷国际工业园'
            var addressTextLength = address.length
            if (addressTextLength >= 16) {
              //that.run2(); // 第一个字消失后立即从右边出现
            }

            that.setData({
              addressText: address,

            });
          },
          fail: function (res) {
          }
        });
        that.setData({
          postdata: post
        });
        that.loadData(0, function () {
          wx.hideLoading();
        });
      },
    })
  },
  distance: function (la2, lo2) {
    var that = this;
    var lat = that.data.latitude;
    var long = that.data.longitude;
    var La1 = lat * Math.PI / 180.0;
    if (!la2 > 0) {
      la2 = lat;
    }
    if (!lo2 > 0) {
      lo2 = long;
    }
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = long * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10000;
    return s
  },

  loadData: function (start, callback) {
    var that = this;
    var star_src = that.data.star;
    var kma = that.data.kms
    var pos = that.data.postdata;
    pos.type = '1';
    var $data = [];
    if (start == 0) {
      pos.Pageindex = 0;
      that.setData({
        no_data: false
      });
    } else {
      pos.Pageindex++;
      $data = that.data.wk_list;
    }
    $config.post('mendian/mendian_dzp_query', pos, function (data) {
        console.log(data)
      if (data.code == 1) {
        if (data.data != '') {
          var $tmpdata = data.data;
          //  var star = $data.concat(data.data.mendian_star);
          var sum = 0;
          $tmpdata.forEach(function (value, index, arrSelf) {
            var star = value.mendian_star;
            var kms = value.KM;
            if (kms < 1) {
              value.KM = (kms * 1000.0).toFixed(0) + 'm';
            } else {
              value.KM = (kms * 1.0).toFixed(2) + 'km';
            }
            value.mendian_star = '../../image/' + star + 'x.png';
            if (star < 1 || star > 5) {
              value.mendian_star = '../../image/1x.png';
            }
            if (value.mendian_image != null && value.mendian_image.length > 0) {
              value.mendian_image = $config.yumaohost_file + value.mendian_image;
            }else{
              value.mendian_image ='../../image/wk_img.png'
            }
          });
          $data = $data.concat($tmpdata);
     
          that.setData({
            wk_list: $data
          });
        } else {
          that.setData({
            wk_list: $data,
            no_data: true
          });
        }
      } else {
        $config.showAlert("加载失败");
      }
      callback();
    })
  },
  search: function (e) {
    var that = this;
    var pos = that.data.postdata;
    pos.mendian_name = e.detail.value;
    that.setData({
      postdata: pos
    });
    wx.showLoading({
      title: '正在加载数据',
    })
    that.loadData(0, function () {
      wx.hideLoading()
    });
  },
  // 点击搜索门店
  ClickSearch: function () {
    var that = this;
    var ads = true;
    var shb = false;
    var Animate = ''
    if (that.data.searchBox == true) {
      ads = true;
      shb = false
      Animate = 'animation'
    } else {
      ads = false;
      shb = true;
      Animate = ''
    }
    that.setData({
      LinkAddress: ads,
      searchBox: shb,
      Animation: Animate,
      //mendian_name: pos
    })
  },

  // 点击去活动操作
  onClickToDetail: function (e) {
    var that=this
    // var Mid = e.currentTarget.dataset.mid  门店id
    // var Sid = e.currentTarget.dataset.sid   商户id
    // var Name = e.currentTarget.dataset.name  门店名称
    // var begin_time = e.currentTarget.dataset.begin_time  活动开始时间
    // var end_time = e.currentTarget.dataset.end_time 活动结束时间
    // var rule_desc = e.currentTarget.dataset.rule_desc  活动规则
    var obj = e.currentTarget.dataset
    let str = JSON.stringify(obj);
     console.log(str)
    var pos=that.data.postdata
    pos.mendian_id = obj.mid
    pos.shanghu_id = obj.sid
    $config.post('mendian/get_mendianuid', pos, function (data) {
      if(data.code==1){
        wx.navigateTo({
          // url: '/pages/activity/turntable?Sid=' + Sid + '&Mid=' + Mid + '&Name=' + Name,
          url: '/pages/activity/turntable?jsonStr=' + encodeURIComponent(str),
          success: function (re) {
            // success 
          },
        })
      }else{
        $config.showAlert('您尚未在该网咖激活！')
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