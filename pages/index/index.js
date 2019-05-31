const $config = require('../../config');

const $md5 = require('../../utils/md5.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    NewsList: [],
    postdata: {
      Pageindex: 0,
      PageSize: 10
    },
    submit_dis: false,
    display: 'none',
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
    no_data: false, //无更多数据

    // hot 动画
    hot_curimg: '../../image/hot1.png',

    //新闻类型选择
    type_list: [
      { index: 0, name: '推荐', curColor: 'curColor' },
      { index: 1, name: '煜鹰公告', curColor: '' }
      
    ],
    // banner图-活动链接
    movies: [
      { ImgUrl: 'https://app.yumaocn.com/banner/activity/group_banner.png', LinkUrl: '' },
      { ImgUrl: 'https://app.yumaocn.com/banner/activity/yxhd_1.png', LinkUrl:''},
      { ImgUrl: 'https://app.yumaocn.com/banner/activity/qiandao_banner.png', LinkUrl: '' }      
    ],
  },
  // banner图跳转到对应页面
  ClickTopage:function(e){
   // var id = e.currentTarget.dataset.id //获取活动id
    var Url = e.currentTarget.dataset.url //获取跳转页面的url
    
    if (Url != undefined || Url != null || Url !=''){
      wx.navigateTo({
        url: Url,
        success: function (re) {
          // success 
        },
      })
    }else{
      // $config.showAlert('正在开发中')
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
  showok: function() {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData(0, function() {  });
  },
  loadData: function(start, callback) {
    var that = this;
    var pos = that.data.postdata;
    if (start == 0) {
      pos.Pageindex = 0;
      that.setData({
        no_data: false
      });
    } else {
      pos.Pageindex++;
    }
    $config.post('news/newslist', pos, function(data) {
      if (data.code == 1) {
        if (data.data != '') {
          that.setData({
            NewsList: data.data
          });
        } else {
          that.setData({
            no_data: true
          });
        }
      } else {
        $config.showAlert("门店公告加载失败");
      }
      callback();
    })
  },
  bindGetUserInfo: function(e) {},

  // 选择充值金额
  onClickMoney: function(e) {
    var that = this;
    var Id = e.currentTarget.dataset.id;
    var item = this.data.Listmoney;

    item.forEach(function(obj, index) {
      if (obj.id == Id) {
        item[index].B_color = 'b_green';
      } else {
        item[index].B_color = '';
      }
    });
    this.setData({
      Listmoney: item,
      money: e.currentTarget.dataset.money
    })
  },
  // 首页导航去详情
  ToDetail:function(e){
    var url = e.currentTarget.dataset.url
    if (url ==undefined||url==null||url==''){
      $config.showAlert('正在开发中，敬请期待！')
      return false
    }
    wx.navigateTo({
      url: url,
      success: function(res) {
          // 跳到详情
      },
     
    })
   wx.switchTab({
      url: url,
      success: function (res) {
        // 跳到详情
      },

    })

  },
  // 点击选择优先排序
  ClickSort: function (e) {
    var that = this;
    console.log(e)
    var pos = that.data.postdata;
    var cur_index = e.currentTarget.dataset.index
    var name = e.currentTarget.dataset.name
    var obj = that.data.type_list;
    var curColor;
    if (name == '推荐') {
      pos.sort = 0
    } else if (name == '煜鹰公告') {
      pos.sort = 1
    }
    obj.forEach(function (item, index) {
      if (item.index == cur_index) {
        item.curColor = 'curColor'
      } else {
        item.curColor = ''
      }
    })
    that.setData({
      postdata: pos,
      type_list: obj
    }) 
     //判断当前点击是否为选中状态，如果不是，就重新加载数据
    var bclor = e.currentTarget.dataset.bclor
    if (bclor == '') {
      // that.loadData(0, function () { });
    } else {
      return
    }
  },
  ShopEntry:function(){
    $config.showAlert('开发小哥哥们正在没日没夜的开发中...')

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
    //hot 动画
    var that=this;
    var hot_cur
    var hot = ['../../image/hot1.png', '../../image/hot2.png']
       var i=0;
      setInterval(function () {
         i++;
        if (i >= hot.length) {
          i = 0
        }
        that.setData({
          hot_curimg: hot[i]
        })
      
      }, 200)
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.loadData(0, function() {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
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
  bolcok: function() {
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
    }else{
      wx.navigateTo({
        url: '../../pages/Recharge/index',
      }) 
    }
  },
  // chongzhi: function(money) {
  //   var that = this;
  //   var toqianbao_id = wx.getStorageSync('qianbao_id');
  //   var appid = wx.getStorageSync('appid');
  //   var user = wx.getStorageSync('user');
  //   if (user.length == 0 || appid.length == 0) {
  //     wx.redirectTo({
  //       url: '../../pages/myInfo/login',
  //     })
  //     return
  //   }

  //   if (toqianbao_id.length == 0) {
  //     $config.showAlert("没有开通钱包");
  //     return
  //   }
  //   if(money < 0.01){
  //     $config.showAlert("充值金额不能小于0.01元");
  //     return
  //   }
  //   wx.showLoading({
  //     title: '正在生成订单中...',
  //     mask: true
  //   })

  //   $config.post('AppUser/getprepayId', {
  //     total_fee: parseFloat(money).toFixed(2) ,
  //     openid: appid
  //   }, function(data) {
  //     wx.hideLoading();
  //     if (data.code == 1) {
  //       var obj = {
  //         timeStamp: parseInt(new Date().getTime() / 1000) + '',
  //         nonceStr: that.S4() + that.S4() + "-" + that.S4() + "-" + that.S4() + "-" + that.S4() + "-" + that.S4() + that.S4() + that.S4(),
  //         package: 'prepay_id=' + data.data.prepayId + '',
  //         signType: 'MD5',
  //         paySign: '',
  //         total_fee: money,
  //         'success': function(res) {
  //           var zhuangzhang_type = '充值';
  //           $config.post('AppUser/chongzhi', {
  //             qianbao_id: toqianbao_id,
  //             chongzhi_money: money,
  //             uid: user.uid
  //           }, function(data) {
  //             if (data.code == 1) {
  //               //充值成功后
  //               $config.showAlert("充值成功");
  //               setTimeout(function() {
  //                 wx.reLaunch({
  //                   url: '../../pages/myInfo/index',
  //                 })
  //               }, 1000)
  //             } else {
  //               //充值成功后
  //               $config.showAlert("充值失败");
  //               return
  //             }
  //           })
  //         },
  //         'fail': function(res) {
  //           if (res.errMsg == "requestPayment:fail cancel") {
  //             $config.showAlert("取消支付");
  //             return
  //           } else {
  //             $config.showAlert("支付失败" + res.errMsg);
  //           }

  //         }
  //       };
  //       obj.paySign = $md5.hex_md5('appId=wx49e632a3f27fad54&nonceStr=' + obj.nonceStr + '&package=' + obj.package + '&signType=' + obj.signType + '&timeStamp=' + obj.timeStamp + '&key=Yumaopingtai20180119000000000001')
  //       wx.requestPayment(obj);
  //     } else {
  //       $config.showAlert("请求失败" + data.msg);
  //     }
  //   })
  // },
  // hideview: function() {
  //   this.setData({
  //     display: "none"
  //   })
  // },
  // input_q: function(e) {
  //   var that = this;
  //   that.setData({
  //     money: e.detail.value
  //   })
  // },
  // btnOnclick: function() {
  //   var that = this;
  //   var $money = that.data.money;
  //   if ($money > 0) {
  //     that.chongzhi($money);
  //   }
  // },
  getUserInfo: function(e) {
    if (e.target.userInfo) {
      // 点击Button弹窗授权，如果授权了，执行login
      // 因为Login流程中有wx.getUserInfo，此时就可以获取到了
      app.onLaunch();
    }
  }
})