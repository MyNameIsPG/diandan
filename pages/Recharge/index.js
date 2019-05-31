// pages/Recharge/index.js
const $config = require('../../config.js');
const $md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Listmoney: [{
        id: 1,
        money: 10,
        B_color: '',
        value: 10
      },
      {
        id: 2,
        money: 20,
        B_color: '',
        value: 20
      },
      {
        id: 3,
        money: 50,
        B_color: 'b_green',
        value: 50
      },
      {
        id: 4,
        money: 100,
        B_color: '',
        value: 100
      },
      {
        id: 5,
        money: 200,
        B_color: '',
        value: 200
      },
      {
        id: 6,
        money: '其他',
        B_color: '',
        value: 0
      }
    ],
    money: '50',
    pay_btn_state: true,
    pay_text:'支付',
    pay_disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 选择充值金额
  onClickMoney: function(e) {
    var that = this;
    var Id = e.currentTarget.dataset.id;
    var $money = e.currentTarget.dataset.money;
    var item = that.data.Listmoney;
    var btn_state;
    item.forEach(function(obj, index) {
      if (obj.id == Id) {
        item[index].B_color = 'b_green';
      } else {
        item[index].B_color = '';
      }
    });
    if ($money == 0) {
      btn_state = false;
      // if (that.data.money > 0)
      //   $money = that.data.money;
    } else {
      btn_state = true
      //that.chongzhi($money);
    }
    that.setData({
      pay_btn_state: btn_state,
      Listmoney: item,
      money: $money
    })
  },
  chongzhi: function(money) {
    var that = this; 
    var toqianbao_id = wx.getStorageSync('qianbao_id');
    var appid = wx.getStorageSync('appid');
    var user = wx.getStorageSync('user');
    var sub_openid = wx.getStorageSync('sub_openid');
    if (user.length == 0 || appid.length == 0) {
      wx.redirectTo({
        url: '../../pages/myInfo/login',
      })
      return
    }

    if (toqianbao_id.length == 0) {
      $config.showAlert("没有开通钱包");
      return
    }
    if (money < 0.01) {
      $config.showAlert("充值金额不能小于0.01元");
      return
    }
    wx.showLoading({
      title: '正在生成订单中...',
      mask: true
    })
    $config.Fubei('FubeiPay/App_Order_Mina', {
      total_fee: parseFloat(money).toFixed(2),
      sub_openid: sub_openid, //待传
      // merchant_order_sn:merchant_order_sn, //订单号这里没有单号可以不传
      // body:body //描述 这里也可以不传
    }, function(data) {
      wx.hideLoading();
      that.setData({
        pay_text: '支付',
        pay_disabled: false
      })
      if (data.code == 1) {
        var obj={
          timeStamp: data.data.timeStamp,
          nonceStr: data.data.nonceStr,
          package: data.data.package,
          signType: data.data.signType,
          paySign: data.data.paySign,
          total_fee: parseFloat(money).toFixed(2),
          'success': function (res) {
            var zhuangzhang_type = '充值';
            $config.post('AppUser/chongzhi', {
              qianbao_id: toqianbao_id,
              chongzhi_money: money,
              uid: user.uid
            }, function (data) {
              if (data.code == 1) {
                //充值成功后
                $config.showAlert("充值成功");
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../../pages/myInfo/index',
                  })
                }, 1000)
              } else {
                //充值成功后
                $config.showAlert("充值失败");
                return
              }
            })
          }, 'fail': function (res) {
            if (res.errMsg == "requestPayment:fail cancel") {
              $config.showAlert("取消支付");
              return
            } else {
              $config.showAlert("支付失败" + res.errMsg);
            }
          }
        }
        wx.requestPayment(obj);
      }
    })
  },


  input_q: function(e) {
    var that = this;
    that.setData({
      money: e.detail.value
    })
  },
  btnOnclick: function(e) {
    var that = this;
    that.setData({
      pay_text: '支付中，请稍等',
      pay_disabled:true
    })
    var $money = that.data.money;
    if ($money > 0) {
      if (e.detail.userInfo) {
        wx.login({
          success: res => {
            wx.getSetting({
              success: res2 => {
                if (res2.authSetting['scope.userInfo']) {
                  var postdata = e.detail.userInfo;
                  postdata.code = res.code;
                  $config.Fubei('FubeiPay/App_public_auth', postdata,
                    function (data) {
                      if (data.code == 1) {
                        //根据appid判断是否有存在该用户
                        wx.setStorageSync("sub_openid", data.data);
                        that.chongzhi($money);
                      } else {
                        $config.showAlert('授权失败,请重试');
                        return;
                      }
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                    });
                }
              }
            })
          }
        })
      } else {
        $config.showAlert("您怎么忍心拒绝我");
      }
    } else {
      $config.showAlert('请输入充值金额')
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

  }
})