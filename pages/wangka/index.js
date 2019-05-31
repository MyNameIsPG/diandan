const $config = require('../../config');
var QQMapWX = require('../../map/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp()
//pages/wangka/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wk_list: [],
    type_list: [{
        index: 0,
        name: '距离优先',
        curColor: 'curColor'
      },
      {
        index: 1,
        name: '星级优先',
        curColor: ''
      }
    ],
    postdata: {
      Pageindex: 0,
      PageSize: 8,
      mendian_name: '',
      lat: '',
      lon: '',
      sort: 1,
    },
    range: '',
    ranged: '',
    searchBox: true, //隐藏
    Animation: '',
    addressText: '正在定位中...',
    addressTextLength: 1,
    latitude: '',
    longitude: '',
    mendian_latitude: '',
    mendian_longitude: '',
    no_data: false, //无更多数据
    star: '',
    kms: '',
    mainHeight: 0,
    pageheader: false, //头部是否隐藏
    query_res:true,
    inputValue: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取位置
    var that = this;

    // 取参数
    that.setData({
      typePage: options.typePage
    })

//二维码测试
    const scene = decodeURIComponent(options.scene)
//授权测试
    wx.getSetting({
      success(res) {
      }
    })
    wx.openSetting({
      success(res){
        console.log(res)
      }
    })



    wx.showLoading({
      title: '正在加载数据中，请稍候...',
    })

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XC5BZ-SBA3U-LGYVH-4H53S-5ZK6V-6YF2I'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            var addressTextLength = address.length
            that.setData({
              addressText: address,

            });
          },
          fail: function(res) {}
        });
        that.setData({
          postdata: post
        });
        that.loadData(0, function() {
          wx.hideLoading();
        });
      },
    })
    that.loadData(0, function () {
      wx.hideLoading();
    });
  },
  distance: function(la2, lo2) {
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

  loadData: function(start, callback) {
    var that = this;
    var star_src = that.data.star;
    var kma = that.data.kms
    var pos = that.data.postdata;
    var $data = [];
    var obj = [];

    if (start == 0) {
      pos.Pageindex = 0;
      that.setData({
        no_data: false
      });
    } else {
      pos.Pageindex++;
      $data = that.data.wk_list;
    }
    $config.post('mendian/GetMendiansImageList', pos, function(data) {
      if (data.code == 1) {
        if (data.data != '') {
          var $tmpdata = data.data;
          //  var star = $data.concat(data.data.mendian_star);
          var sum = 0;
          var i;
          var bg_num;
          $tmpdata.forEach(function(value, index, arrSelf) {

            i = index % 4
            switch (i) {
              case 0:
                bg_num ='icon_bg_0'
                break;
              case 1:
                bg_num ='icon_bg_1'
                break;
              case 2:
                bg_num ='icon_bg_2'
                break;
              case 3:
                bg_num ='icon_bg_3'
              default:
            }
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
            }
            obj.push({
              mendian_id: value.mendian_id,
              shanghu_id: value.shanghu_id,
              KM: value.KM,
              mendian_star: value.mendian_star,
              mendian_image: value.mendian_image,
              bg_num: bg_num,
              mendian_name: value.mendian_name,
              addr: value.addr

            })

          });
          $data = $data.concat(obj);

         
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
   // 监听滚动事件
  onPageScroll: function (e) {
    var that = this;
    var ishide
    if (e.scrollTop > 100) {
      ishide = true
    } else {
      ishide = false
     
    }
    that.setData({
      pageheader: ishide,

    })
  },

  // 点击选择优先排序
  ClickSort: function(e) {
    var that = this;
    var pos = that.data.postdata;
    var cur_index = e.currentTarget.dataset.index
    var name = e.currentTarget.dataset.name
    var obj = that.data.type_list;
    var curColor;
    if (name == '星级优先') {
      pos.sort = 0
    } else if (name == '距离优先') {
      pos.sort = 1
    }
     wx.pageScrollTo({
            scrollTop: 0,
            duration: 100
          })
    obj.forEach(function(item, index) {
      if (item.index == cur_index) {
        item.curColor = 'curColor'
      } else {
        item.curColor = ''
      }
    })
    that.setData({
      postdata: pos,
      type_list: obj,
      searchBox: true
    })
    //判断当前点击是否为选中状态，如果不是，就重新加载数据
    var bclor = e.currentTarget.dataset.bclor
    if (bclor == '') {
      that.loadData(0, function() {});
    } else {
      return
    }
  },
  //搜索
  search: function(e) {
    var that = this;
    var pos = that.data.postdata;
    pos.mendian_name = e.detail.value;
    that.setData({
      postdata: pos
    });
    wx.showLoading({
      title: '正在加载数据',
    })
    that.loadData(0, function() {
     // console.log(that.data.wk_list)
      var isShow, query_res,no_data;
      if (that.data.wk_list.length>0){
        isShow=true;
        query_res=true;
      }else{
        isShow = false;
        query_res=false;
        no_data=false

      }
      wx.hideLoading()
      that.setData({
        searchBox: isShow,
        query_res:query_res,
        no_data: no_data
        
      })
    });
  },
  // 清空搜索内容
  clearInputEvent: function (res) {
    this.setData({
      'inputValue': ''
    })
  },
  // 点击搜索门店
  ClickSearch: function() {
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
      searchBox: shb,
      Animation: Animate,
      //mendian_name: pos
    })
  },

  // 点击查看门店详情
  onClickToDetail: function(e) {
    var that = this;
    var types = that.data.typePage;
    if (types==1){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        _mendian_id: e.currentTarget.dataset.mid,
        _shanghu_id: e.currentTarget.dataset.sid,
        _range: e.currentTarget.dataset.range
      });

      wx.navigateBack({

      });
      prevPage.onLoad();
    } else {
      // 跳转
      wx.redirectTo({
        url: '../../pages/index/list'
      })
    }
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.loadData(0, function() {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      //wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (that.data.no_data)
      return;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    this.loadData(1, function() {
      // 隐藏加载框  
      wx.hideLoading();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  openMap: function(e) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        var post = that.data.postdata;
        post.lat = res.latitude;
        post.lon = res.longitude;
        that.setData({
          addressText: res.address,
          postdata: post
        })
        that.loadData(0, function() {

        });
      }
    })

  },
})