const $config = require('../../config');
var QQMapWX = require('../../map/qqmap-wx-jssdk.js');
var qqmapsdk;
// pages/wangka/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    userImg: '',
    my_Score: 0,
    balance: '0.00',
    islogin: '',
    wangka_img_list: [],
    wangka_img_arr: [],
    hideImg: false,
    movies: [{
      index: 0,
      name: '组团开黑',
      imgurl: '../../image/group_banner.png',
      url: '/pages/group/index'
    },
    {
      index: 1,
      name: '签到',
      imgurl: '../../image/qiandao_banner.png',
      url: '/pages/qaindao/detail'
    },
    {
      index: 2,
      name: '大转盘',
      imgurl: '../../image/yxhd_1.png',
      url: '/pages/activity/turntable'
    },

    ],

    postdata: {
      Pageindex: 0,
      PageSize: 1,
      lat: '',
      lon: '',
      sort: 1,
    },
    _mendian_id: '', //选择门店后返回的id
    _shanghu_id: '',
    _range: '',
    star: '', //门店星级
    host: [], //门店图片服务器地址
    latitude: '', //当前纬度
    longitude: '', //当前经度
    shanghu_id: '', //商户id
    mendian_id: '', //门店id
    mendian_remake: '', //门店简介
    menmdian_name: '', //门店名称
    mendian_latitude: '', //门店纬度
    mendian_longitude: '', //门店经度
    addressText: '', //门店地址
    range: 0, //门店距离
    CostList: [{
      name: '英勇黄铜区',
      price: '6'
    },
    {
      name: '不屈白银区',
      price: '8'
    },
    {
      name: '倔强黄金区',
      price: '10'
    },
    {
      name: '无畏白金区',
      price: '15'
    },
    ],
    tags: [{
      id: 0,
      name: '小姐姐陪你玩'
    },
    {
      id: 1,
      name: '大神带你上分'
    },
    {
      id: 2,
      name: '赔本送饮料'
    },
    {
      id: 3,
      name: '环境好的受不了'
    },
    {
      id: 4,
      name: '服务态度超级好'
    },
    ],
    environment_img: [], //环境缩略图
    activity_img: [], //活动缩略图
    environment_imgArr: [], //环境大图
    activity_imgArr: [], //活动大图
    yumaohost: $config.yumaohost_file,
    activity_imgHide: false,
    environment_imgHide: false,
    ellipsis: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.Get_qianbao();
    if (options == undefined || options.mendian_id == undefined ||options.mendian_id == '') {
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
          that.setData({
            postdata: post,
            latitude: res.latitude,
            longitude: res.longitude,
          });
          that.loadmendian();
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
              var addressTextLength = address.length
              that.setData({
                addressText: address,
              });
            },
            fail: function (res) { }
          });
        },
      })
      
    }else{
      
      that.setData({
        _mendian_id: options.mendian_id,
        _shanghu_id: options.shanghu_id,
        latitude: options.latitude,
        longitude: options.longitude
      })
     
      that.loadmendian();
    }
  },

  // 网费充值
  bolcok: function () {
    var that = this;
    var toqianbao_id = wx.getStorageSync('qianbao_id');
    var appid = wx.getStorageSync('appid');
    var user = wx.getStorageSync('user');
    if (user.length == 0 || appid.length == 0) {
      wx.redirectTo({
        url: '../../pages/myInfo/login',
      })
      return
    }
    if (toqianbao_id.length == 0) {
      $config.showAlert("没有开通钱包");
      return
    } else {
      wx.navigateTo({
        url: '../../pages/Recharge/index',
      })
    }
  },
  // 开始点单
  showok: function () {
    var that = this;
    var toqianbao_id = wx.getStorageSync('qianbao_id');
    var appid = wx.getStorageSync('appid');
    var user = wx.getStorageSync('user');
    if (user.length == 0 || appid.length == 0) {
      wx.redirectTo({
        url: '../../pages/myInfo/login',
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/wangka/index?typePage=2',
    })
  },

  // 加载当前最近门店
  loadmendian: function () {
    var that = this;
    var pos = that.data.postdata;
    var _mendian_id = that.data._mendian_id
    var _shanghu_id = that.data._shanghu_id
    var _range = that.data.range
    if (_mendian_id == '' && _shanghu_id == '') {
      $config.post('mendian/GetMendiansImageList', pos, function (data) {
        if (data.code == 1) {
          if (data.data != '') {
            var value = data.data[0]
            var kms = value.KM;
            if (kms < 1) {
              value.KM = (kms * 1000.0).toFixed(0) + 'm';
            } else {
              value.KM = (kms * 1.0).toFixed(2) + 'km';
            }

          }
        }
        that.setData({
          mendian_id: value.mendian_id,
          shanghu_id: value.shanghu_id,
          range: value.KM,
          mendian_name: value.mendian_name,
        });
        that.loadData();
      
      })
    } else {
      that.setData({
        mendian_id: _mendian_id,
        shanghu_id: _shanghu_id,
        range: _range,
        host: $config.yumaohost_file
      })
      that.loadData();
    }
    that.loadScore();
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
  // 预览图片
  previewImage: function (e) {
    var that = this;
    var btntype = e.currentTarget.dataset.btntype;
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    var imgArr = [];
    if (btntype == 1) {
      imgArr = that.data.environment_imgArr;
    }
    if (btntype == 2) {
      imgArr = that.data.activity_imgArr;
    }
    wx.previewImage({
      //当前显示图片
      current: imgArr[index],
      //所有图片
      urls: imgArr
    })
  },
  // 点击去当前活动
  clickToList: function (e) {
    var url = e.currentTarget.dataset.url;
    var Sid = e.currentTarget.dataset.sid;
    var Mid = e.currentTarget.dataset.mid;
    var index = e.currentTarget.dataset.index;
    var postUrl;
    switch (index) {
      case 0:
        postUrl = 'activity/activity_Shared_mdhaving'
        break;
      case 1:
        postUrl = 'mendian/qd_open'
        break;
      case 2:
        postUrl = 'mendian/dzp_open'
      default:
    }

    $config.post(postUrl, {
      mdid: Mid,
      shid: Sid,
      mendian_id: Mid,
      shanghu_id: Sid
    }, function (data) {
      if (data.code == 1) {
        if (data.data) {
          $config.post('mendian/get_mendianuid', {
            mendian_id: Mid,
            shanghu_id: Sid
          }, function (res) {
            if (res.code == 1) {
              url = url + '?shanghu_id=' + Sid + '&mendian_id=' + Mid
              wx.navigateTo({
                url: url,
              })
            }else{
               url = url + '?shanghu_id=' + Sid + '&mendian_id=' + Mid
              //url = url + '?shanghu_id=' + Sid + '&mendian_id=' + Mid + '&referrer_mdid=231&referrer_shid=3212'
              wx.navigateTo({
                //url: '/pages/myInfo/login',
                url: url
              })
            }

          })
        } else {
          $config.showAlert('门店暂未开启该活动！')
        }
      }
    })
  },
  // 点击展开全文
  clickShow: function () {
    this.setData({
      ellipsis: ''
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
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  //  钱包余额
  Get_qianbao: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    var userinfo = wx.getStorageSync('userinfo');
    var qianbao_id = wx.getStorageSync('qianbao_id');
    var _islogin, username, userImg;
    if (user.uid == null) {
      _islogin = false;
    } else {
      _islogin = true;
      username = user.username;
      if (user.imgurl == null || user.imgurl == '') {
        userImg = userinfo.avatarUrl;
        if (userinfo.avatarUrl == null || userinfo.avatarUrl == '') {
          userImg = "../../image/header_img.png"
        }
      } else {
        userImg = user.imgurl
      }
      //  调钱包接口
      $config.post('AppUser/Get_qianbao_baseinfo', {
        shanghu_id: '1',
        qianbao_id: qianbao_id,
        uid: user.uid,
        type: '0'
      }, function (data) {
        if (data.code == 1) {
          that.setData({
            balance: parseFloat(data.data.yue_money).toFixed(2)
          })
        }
      });
    }
    that.setData({
      islogin: _islogin,
      username: username,
      userImg: userImg
    });
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
    this.loadData();
    this.Get_qianbao();
    setTimeout(function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 500)


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

  },

  //接口方法
  loadData: function () {
    var that = this;
    var mendian_id = that.data.mendian_id;
    var lat = that.data.latitude;
    var lon = that.data.longitude;
    $config.showLoading('数据正在加载，请稍候...')
    $config.post('mendian/getmendianone', {
      mendian_id: mendian_id,
      lat: lat,
      lon: lon,
    }, function (data) {
      if (data.code == 1) {
        $config.hideLoading();
        var $data = data.data;
        if ($data != null) {
          var star = $data.mendian_star;
          $data.mendian_star = '../../image/' + star + 'x.png';
          if (star < 1 || star > 5) {
            $data.mendian_star = '../../image/1x.png';
          }
          var kms = $data.KM;
          if (kms < 1) {
            $data.KM = (kms * 1000.0).toFixed(0) + 'm';
          } else {
            $data.KM = (kms * 1.0).toFixed(2) + 'km';
          }
          var mark = [];
          if ($data.mendian_latitude == "") {
            $data.mendian_latitude = 28.23529;
          }
          if ($data.mendian_longitude == "") {
            $data.mendian_longitude = 112.93134;
          }
          mark.push({
            id: 1,
            latitude: $data.mendian_latitude,
            longitude: $data.mendian_longitude
          });
          var ellipsis;
          console.log()
         
          if ($data.mendian_remake!=undefined&& $data.mendian_remake.length > 1000) {
              ellipsis = 'ellipsis-5'
            } else {
              ellipsis = ''
            }
          that.setData({
            mendian_name: $data.mendian_name,
            addr: $data.addr,
            range: $data.KM,
            mendian_longitude: $data.mendian_longitude,
            mendian_latitude: $data.mendian_latitude,
            star: $data.mendian_star,
            mendian_remake: $data.mendian_remake,
            markers: mark,
            ellipsis: ellipsis
          });
          //设置头部标题
          wx.setNavigationBarTitle({
            title: $data.mendian_name
          })
        } else {
          return
        }
      } else {
        $config.showAlert("加载失败");
      }
    })
    $config.post('mendian/getmendian_id_hjimage', {
      mendian_id: mendian_id
    }, function (data) {
      var environment_img = [],
        environment_imgArr = [],
        activity_img = [],
        activity_imgArr = [];
      if (data.code == 1) {
        var $data = data.data;
        var activity = data.count;
        var environment_imgHide = false
        if ($data.length != 0) {
          environment_imgHide = true
          $data.forEach(function (item, index) {
            if (item.hj_url != null) {
              item.hj_url = that.data.yumaohost + item.hj_url;
              environment_imgArr.push(item.hj_url)
              // item.hj_url = item.hj_url.replace('.jpg', '_2.jpg').replace('.png', '_2.png');
              environment_img = $data;
            }
          })
        } else {
          environment_imgHide: true
        }
        var activity_imgHide = false
        if (activity.length !== 0) {
          activity_imgHide = true
          activity.forEach(function (item, index) {
            if (item.hj_url != null) {
              item.hj_url = that.data.yumaohost + item.hj_url;
              activity_imgArr.push(item.hj_url);
              // item.hj_url = item.hj_url.replace('.jpg', '_2.jpg').replace('.png', '_2.png');
              activity_img = activity;
            }
          })
        } else {
          activity_imgHide = false
        }
        that.setData({
          environment_img: environment_img,
          activity_img: activity_img,
          environment_imgArr: environment_imgArr, //环境大图
          activity_imgArr: activity_imgArr, //活动大图
          activity_imgHide: activity_imgHide,
          environment_imgHide: environment_imgHide
        })
      } else {
        $config.showAlert("加载失败");
      }
    })
    that.loadScore()
  },

  // 获取当前门店积分
  loadScore: function () {
    var that = this;
    $config.post('Score/get', {
      shanghu_id: that.data.shanghu_id,
      mendian_id: that.data.mendian_id
    }, function (data) {
      if (data.code == 1) {
        that.setData({
          my_Score: data.data
        })
      }
    });
  },
  map: function () {
    var that = this.data
    wx.openLocation({
      latitude: parseFloat(that.mendian_latitude),
      longitude: parseFloat(that.mendian_longitude)
    })
  }
})