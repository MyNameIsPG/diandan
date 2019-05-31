// pages/myInfo/login.js
const $config = require('../../config.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    type_list: [{
        index: 0,
        name: '登录',
        curColor: 'curColor'
      },
      {
        index: 1,
        name: '注册',
        curColor: ''
      }
    ],
    login_state: true, //显示登录
    register_state: false, //隐藏注册,
    psdType: true, //为password类型
    eyesImg: '../../image/eyes.png', //默认眼睛闭上,
    uname: '',
    pwd: '',
    sfcode: '',
    tel: '',
    code: '',
    appcode: '1',
    appid: '',
    zhanghao: '',
    wx_img: '',
    code: '',
    codetext: '获取验证码',
    disabled: false,
    num: 0,
    user_list: [{
      tel: '',
      mendian_id: wx.getStorageSync("referrer_mdid"),
      shanghu_id: wx.getStorageSync("referrer_shid"),
      refferuid: wx.getStorageSync("refferuid"),
      activity_id: wx.getStorageSync("activity_id"),
      type: 1,
      status: 0
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //that.data.register_state = true;
    //that.data.login_state = false;
    // that.type_list[1].curColor = 'curColor';
    // that.type_list[0].curColor = '';
    var reffer_mendian_id = wx.getStorageSync("referrer_mdid");
    if (reffer_mendian_id != null && reffer_mendian_id != ''){
      that.data.register_state = true;
      that.data.login_state = false;
     // that.type_list[1].curColor = 'curColor';
     // that.type_list[0].curColor = '';
    }
    if (options.num == 1) {
      that.setData({
        num: 1
      })
    }
    that.ceshi(function() {})
  },
  ceshi: function(callback) {
    var that = this;
    var appid = wx.getStorageSync('appid');
    if (appid.length == 0) {

    } else {

    }
    callback();
  },

  // 点击眼睛看密码
  onClickEyes: function(e) {
    var that = this;
    var psd = that.data.psdType
    var curType;
    var Img;
    if (psd == true) {
      curType = false;
      Img = '../../image/eyes_show.png'
    } else {
      curType = true;
      Img = '../../image/eyes.png'
    }

    that.setData({
      psdType: curType,
      eyesImg: Img
    })
  },

  // 返回首页
  backIndex: function() {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  // 点击选择
  ClickSort: function(e) {
    var that = this;
    var cur_index = e.currentTarget.dataset.index
    var name = e.currentTarget.dataset.name
    var obj = that.data.type_list;
    var curColor;
    if (cur_index == 0) {
      that.setData({
        login_state: true,
        register_state: false
      })
    }
    if (cur_index == 1) {
      that.setData({
        login_state: false,
        register_state: true
      })
    }
    obj.forEach(function(item, index) {
      if (item.index == cur_index) {
        item.curColor = 'curColor'
      } else {
        item.curColor = ''
      }
    })
    that.setData({
      type_list: obj,

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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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

  },
  username: function(e) {
    var _this = this;
    _this.setData({
      username: e.detail.value
    })
  },
  pwd: function(e) {
    var _this = this;
    _this.setData({
      password: e.detail.value
    })
  },

  onGotUserInfo: function(e) {
    var that = this;
    if (that.data.username.length == 0 || that.data.password.length == 0) {
      $config.showAlert("请输入账号或密码");
      return
    }
    var appid = wx.getStorageSync('appid');

    wx.showLoading({
      title: '正在登陆...',
      mask: true
    })
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          wx.getSetting({
            success: res2 => {
              if (res2.authSetting['scope.userInfo']) {
                var postdata = e.detail.userInfo;
                postdata.code = res.code;
                $config.post('AppUser/getOpenid', postdata,
                  function(data) {
                    if (data.code == 1) {
                      //根据appid判断是否有存在该用户
                      wx.setStorageSync("appid", data.data.appid);
                    } else if (data.code == '8888') {
                      appid = data.data.appid;
                      wx.setStorageSync("appid", data.data.appid);
                      // wx.redirectTo({
                      //   url: '../../pages/myInfo/login',
                      // })
                    } else {
                      $config.showAlert('系统异常');
                      return;
                    }
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                    $config.post('AppUser/applogin', {
                      zhanghao: that.data.username,
                      pwd: that.data.password,
                      appid: appid
                    }, function(data) {
                      wx.hideLoading();
                      if (data.code == 1) {
                        wx.setStorageSync("user", data.data.userinfo);
                        wx.setStorageSync("token", data.data.token);
                        wx.setStorageSync("timestamp", data.data.timestamp);
                        var imgurl = data.data.userinfo.imgurl;
                        var uid = data.data.userinfo.uid;
                        if (imgurl == null || imgurl ==''){
                          imgurl = wx.getStorageSync('userinfo').avatarUrl
                          $config.post('AppUser/log_create_img', { imgurl: imgurl}, function (resdata) {
                            if (resdata.code==1){
                              console.log('更新成功！')
                            }else{
                              $config.showAlert(resdata.msg)
                            }
                          })
                        }
                        if (that.data.num == 1) {
                          wx.navigateBack({
                            changed: true
                          }); //返回上一页
                        } else {
                          wx.switchTab({
                            url: 'index'
                          })
                        }
                      } else {
                        $config.showAlert(data.msg);
                      }
                    })
                  });
              }
            }
          })
        }
      })
    } else {
      $config.showAlert("您怎么忍心拒绝我");
    }
  },




  // 注册
  reg_pwd: function(e) {
    var _this = this;
    _this.setData({
      pwd: e.detail.value
    })
  },
  tel: function(e) {
    var _this = this;

    _this.setData({
      tel: e.detail.value,
      // user_list.tel:
    })
  },
  code: function(e) {
    var _this = this;
    _this.setData({
      code: e.detail.value
    })
  },
  //发生验证码
  sendcode: function() {
    var _this = this;
    if (_this.data.tel.length == 0) {
      $config.showAlert('电话号码不能为空');
      return
    }
    if (_this.data.tel.length != 11) {
      $config.showAlert('手机号位数不正确');
      return
    }
    wx.showLoading({
      title: '验证码已发送,请查收',
      mask: true
    })
    $config.post('AppUser/sendcode', {
      tel: _this.data.tel,
      appcode: _this.data.appcode,
      type: 1
    }, function(data) {
      wx.hideLoading();
      if (data.code == 1) {
        var interID = setInterval(function() {
          var seconds = _this.data.codetext.replace('s', '');
          _this.setData({
            codetext: (parseInt(seconds) - 1) + 's'
          })
          if (seconds < 1) {
            clearInterval(_this.data.intervarID);
            _this.setData({
              codetext: '重新获取',
              disabled: false
            })
          }
        }, 1000)
        _this.setData({
          codetext: '60s',
          disabled: true,
          intervarID: interID
        })
      } else {
        $config.showAlert(data.msg);
        return
      }
    })
  },
  listenerLogin: function(e) {
    var _this = this;
    if (_this.data.pwd.length == 0) {
      $config.showAlert('密码不能为空');
      return
    }
    if (_this.data.tel.length == 0) {
      $config.showAlert('手机号不能为空');
      return
    }
    if (_this.data.code.length == 0) {
      $config.showAlert('验证码不能为空');
      return
    }
    if (_this.data.pwd.length < 6) {
      $config.showAlert('密码必须大于6位数');
      return
    }
    if (_this.data.tel.length != 11) {
      $config.showAlert('手机号位数不正确');
      return
    }
    _this.data.appid = wx.getStorageSync('appid');
    _this.data.wx_img = wx.getStorageSync('wx_img');

    wx.showLoading({
      title: '正在注册...',
      mask: true
    })
    $config.post('AppUser/appregister', _this.data, function(data) {
      wx.hideLoading();
      if (data.code == 1) {
        // _this.user_list.tel = _this.data.tel;
        // tel: '',
        // mendian_id: wx.getStorageSync("referrer_mdid"),
        // shanghu_id: wx.getStorageSync("referrer_shid"),
        // refferuid: wx.getStorageSync("refferuid"),
        // activity_id: wx.getStorageSync("activity_id"),
        // type: 1,
        // status: 0
        var referrer_mdid = wx.getStorageSync("referrer_mdid");
        if (referrer_mdid != null && referrer_mdid != ''){
          $config.post('activity/userreffer_add', {
            tel: _this.data.tel,
            mendian_id: wx.getStorageSync("referrer_mdid"),
            shanghu_id: wx.getStorageSync("referrer_shid"),
            refferuid: wx.getStorageSync("refferuid"),
            activity_id: wx.getStorageSync("activity_id"),
            type: 1,
            status: 0
          }, function (data) {
if(data.code == 1){
  wx.setStorageSync("referrer_shid", '');
  wx.setStorageSync("referrer_mdid", '');
  wx.setStorageSync("activity_type", '');
  wx.setStorageSync("activity_id", '');
}
          })
        }
        //注册成功后跳转登陆
        $config.post('AppUser/applogin', {
          zhanghao: _this.data.tel,
          pwd: _this.data.pwd,
          appid: _this.data.appid
        }, function(data) {
          if (data.code == 1) {
            wx.setStorageSync("user", data.data.userinfo);
            wx.setStorageSync("token", data.data.token);
            wx.setStorageSync("timestamp", data.data.timestamp);
            if (_this.data.num == 1) {
              wx.navigateBack({
                changed: true
              }); //返回上一页
            } else {
              wx.switchTab({
                url: '../../pages/index/index'
              })
            }
          } else {
            $config.showAlert(data.data.msg);
          }
        })
      }
      else {
        $config.showAlert(data.msg);
        return
      }
    })
  }
})