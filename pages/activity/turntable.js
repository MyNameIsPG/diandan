// pages/activity/turntable.js
const $config = require('../../config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: '#FFDF2F', //圆点颜色1
    colorCircleSecond: '#FE4D32', //圆点颜色2
    //colorAwardDefault: '#F5F0FC',//奖品默认颜色
    //colorAwardSelect: '#ffe400',//奖品选中颜色
    colorAwardDefault: 'DefaultColor', //奖品默认颜色
    colorAwardSelect: 'SelectColor', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    imageAward: [], //奖品图片数组
    NameAward: [],
    shanghu_id: 0,
    mendian_id: 0,
    postdata: {},
    my_Score:0,
    Cur_mendian:'',
    Begin_time: '',
    End_time: '',
    Rule_desc: [],
    showModal: false,
    prizeName: '',
    noPrizeImg:'../../image/yuying-no_prize.png'
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var _this = this;
    var pos = _this.data.postdata
    //获取当前门店和商户的id
    pos.shanghu_id = options.shanghu_id;
    pos.mendian_id = options.mendian_id;
    pos.type=1;
    _this.setData({
      postdata: pos,
      shanghu_id: options.shanghu_id,
      mendian_id: options.mendian_id
    })
    var obj = [];
    $config.post('mendian/mendian_dzp_query', pos, function (data) {
      if (data.code == 1) {
        if (data.length != 0) {
          var $data = data.data[0];
          _this.setData({
            Cur_mendian: $data.mendian_name,
            Begin_time: $data.begin_time.split(" ")[0],
            End_time: $data.end_time.split(" ")[0],
            Rule_desc: $data.rule_desc
          })
        } else {
          console.log('暂无设置活动数据')
        }
      }
      else {
        console.log(data.msg);
      }
    
    })
  
    //console.log('商户id:' + shanghu_id, '门店id:' + mendian_id)
    _this.loadCurScore()
    $config.showLoading('正在加载数据中，请稍后...');
    // 获取奖品
    var obj = [
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png",
      "../../image/CS_prize.png", 
      ]
    $config.post('zhuanpan/prize', pos, function(data) {
      $config.hideLoading();
      var res = data.data
      res.paths.forEach(function(item,index){
        if (res.paths[index] == undefined || res.paths[index] == null || res.paths[index] == '') {
          res.paths[index] = obj[index];
        }
      })
     
      _this.setData({
        imageAward: res.paths,
        NameAward: res.names
      });
      //圆点设置
      var leftCircle = 7.5;
      var topCircle = 7.5;
      var circleList = [];
      for (var i = 0; i < 24; i++) {
        if (i == 0) {
          topCircle = 15;
          leftCircle = 15;
        } else if (i < 6) {
          topCircle = 7.5;
          leftCircle = leftCircle + 102.5;
        } else if (i == 6) {
          topCircle = 15
          leftCircle = 620;
        } else if (i < 12) {
          topCircle = topCircle + 94;
          leftCircle = 620;
        } else if (i == 12) {
          topCircle = 565;
          leftCircle = 620;
        } else if (i < 18) {
          topCircle = 570;
          leftCircle = leftCircle - 102.5;
        } else if (i == 18) {
          topCircle = 565;
          leftCircle = 15;
        } else if (i < 24) {
          topCircle = topCircle - 94;
          leftCircle = 7.5;
        } else {
          return
        }
        circleList.push({
          topCircle: topCircle,
          leftCircle: leftCircle
        });
      }
      _this.setData({
        circleList: circleList
      })
      // //圆点闪烁
      // setInterval(function() {
      //   if (_this.data.colorCircleFirst == '#FFDF2F') {
      //     _this.setData({
      //       colorCircleFirst: '#FE4D32',
      //       colorCircleSecond: '#FFDF2F',
      //     })
      //   } else {
      //     _this.setData({
      //       colorCircleFirst: '#FFDF2F',
      //       colorCircleSecond: '#FE4D32',
      //     })
      //   }
      // }, 500) //设置圆点闪烁的效果
      //奖品item设置
      var awardList = [];
      //间距,怎么顺眼怎么设置吧.
      var topAward = 25;
      var leftAward = 25;
      for (var j = 0; j < 8; j++) {
        if (j == 0) {
          topAward = 25;
          leftAward = 25;
        } else if (j < 3) {
          topAward = topAward;
          //166.6666是宽.15是间距.下同
          leftAward = leftAward + 166.6666 + 15;
        } else if (j < 5) {
          leftAward = leftAward;
          //150是高,15是间距,下同
          topAward = topAward + 150 + 15;
        } else if (j < 7) {
          leftAward = leftAward - 166.6666 - 15;
          topAward = topAward;
        } else if (j < 8) {
          leftAward = leftAward;
          topAward = topAward - 150 - 15;
        }

        var L_imageAward = _this.data.imageAward[j];
        var L_NameAward = _this.data.NameAward[j];
        awardList.push({
          topAward: topAward,
          leftAward: leftAward,
          imageAward: L_imageAward,
          NameAward: L_NameAward
        });
      }
      _this.setData({
        awardList: awardList
      });
    });
  },
  // 显示当前积分
  loadCurScore:function(){
    var that=this
    var pos=that.data.postdata
    $config.post('Score/get', pos, function (data) {
      //console.log(data)
      if (data.code == 1) {
        that.setData({
          my_Score: data.data
        })
      }


    })
  },


  //开始抽奖
  startGame: function() {
    var _this = this;
    var pos = _this.data.postdata
    var my_Score = _this.data.my_Score
    if (_this.data.isRunning) { return }
    _this.setData({
      isRunning: true
    })
    if (my_Score==0){
      $config.showAlert('积分余额不足！')
      return false
    }
    pos.machine_no = 'app'
    $config.post('zhuanpan/draw', pos, function(data) {
      //console.log(data)
      //res.status==0，操作失败。==1 恭喜中奖。 ==2未中奖。 ==3大转盘活动未开启. ==4积分抽奖未开启。 ==5用户积分余额不足
      var res=data.data;
      var prizeName =res.productname
      var max_num=240;
      if (data.code == 1) {
        _this.loadCurScore()
        if (res.status == 0) {
          $config.showAlert('操作失败！')
          return false
        }
        if (res.status == 3) {
          $config.showAlert('活动未开启！')
          return false
        }
        if (res.status == 4) {
          $config.showAlert('积分抽奖未开启！')
          return false
        }
        if (res.status==5){
           $config.showAlert('积分余额不足！')  
           return false
        }
        var indexSelect = 0
        var i = 0;
        var prize = _this.data.NameAward
        var prizeIndex;
        prize.forEach(function (item, index) {

          if (res.productname == item) {
            prizeIndex = index
          }
          if (res.productname == '' || res.productname =='谢谢参与'){
            prizeIndex=7
            prizeName='谢谢参与'
          }
        })
        var timer = setInterval(function() {
         indexSelect++;
          //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
          i += 10;
         max_num = 240 + 10 * prizeIndex
          if (i >= max_num) {
            //去除循环
            clearInterval(timer)
            //获奖提示
            _this.setData({
              isRunning: false,
              showModal: true,
              prizeName: prizeName
            })
            // wx.showModal({
            //   title: '',
            //   content: prizeName,
            //   showCancel: false, //去掉取消按钮
            //   success: function(res) {
            //     if (res.confirm) {
            //       _this.setData({
            //         isRunning: false
            //       })
            //     }
            //   }
            // })
          }
         
          indexSelect = indexSelect % 8;
          _this.setData({
            indexSelect: indexSelect
          })
        }, (200 + i))

      }

    })
  },
  // 关闭模态
  close: function () {
    this.setData({
      showModal: false
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
    // 设置当前头部标题的背景颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#132866',

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

  }
})