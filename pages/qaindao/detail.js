// pages/qaindao/detail.js
const $config = require('../../config');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    sysW: null,
    lastDay: null,
    firstDay: null,
    year: null,
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    getDate: null,
    month: null,
    display: "none",
    week: [{
        wook: "一"
      },
      {
        wook: "二"
      },
      {
        wook: "三"
      },
      {
        wook: "四"
      },
      {
        wook: "五"
      },
      {
        wook: "六"
      }, {
        wook: "日"
      },
    ],
    day: [],
    days: [],
    postdata: {},
    my_Score: 0,
    Cur_mendian: '',
    Begin_time: '',
    End_time: '',
    Rule_desc: [],
    my_Score: 0,
    qd_num: 0, //月总签到
    qd_cont_m_num: 0, //月连续签到
    sign_btn: '签到',
    yearMonth: new Date().Format('yyyy-MM'),
    showModal: false,
    productname: ''

  },
  getProWeekList: function() {
    let that = this
    let date = new Date();
    let dateTime = date.getTime(); // 获取现在的时间
    let dateDay = date.getDay(); // 获取现在的
    let oneDayTime = 24 * 60 * 60 * 1000; //一天的时间
    let proWeekList;
    let weekday;
    for (let i = 0; i < 7; i++) {
      let time = dateTime - (dateDay - 1 - i) * oneDayTime;
      proWeekList = new Date(time).getDate(); //date格式转换为yyyy-mm-dd格式的字符串
      weekday = "day[" + i + "].wook"
      that.setData({
        [weekday]: proWeekList,
      })
    }
  },
  dateSelectAction: function(e) {
    let cur_day = e.currentTarget.dataset.idx;
    this.setData({
      todayIndex: cur_day
    })
  },

  setNowDate: function() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    var that = this
    let weekday;
    var obj = []
    const thisMonthDays = that.getThisMonthDays(year, month);
    var firstDay = that.data.firstDay;
    for (let i = 1; i <= thisMonthDays; i++) {
      obj.push({
        item: i,
        src: ''
      });
    }
    for (var i = 1; i < firstDay; i++) {
      obj.unshift({
        item: '',
        src: '',
      })
    }
    that.setData({
      day: obj
    });
    var pos = that.data.postdata
    $config.post('sign/signlist', pos, function(data) {
      if (data.code == 1) {
        if (data.data.length>0) {
          var res = data.data[0];
          for (let i = 1; i <= thisMonthDays; i++) {
            var $date = i;
            if (i < 10)
              $date = '0' + i;
            $date = 'day_' + $date;
            if (res[$date] == 1) {
              obj[firstDay+i - 2].src = '../../image/qiandao_s.png';
            }
          }
          that.setData({
            day: obj,
            qd_num: res.qd_num,
            qd_cont_m_num: res.qd_cont_m_num
          })
        }
      } else {
        console.log(data.msg);
      }
    })

  },

  dataTime: function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var months = date.getMonth() + 1;

    //获取现今年份
    this.data.year = year;

    //获取现今月份
    this.data.month = months;

    //获取今日日期
    this.data.getDate = date.getDate();

    //最后一天是几号
    var d = new Date(year, months, 0);
    this.data.lastDay = d.getDate();

    //第一天星期几
    let firstDay = new Date(year, month, 1);
    this.data.firstDay = firstDay.getDay();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var pos = that.data.postdata
    pos.shanghu_id = options.shanghu_id;
    pos.mendian_id = options.mendian_id;
    pos.type = 2;
    that.setData({
      postdata: pos,
      shanghu_id: options.shanghu_id,
      mendian_id: options.mendian_id
    })
    var obj = [];
    $config.post('mendian/mendian_dzp_query', pos, function(data) {
      var $data = data.data
      if ($data.length != 0) {
        $data = $data[0]
        obj.push({
          Rule_desc: $data.rule_desc
        })
        that.setData({
          Cur_mendian: $data.mendian_name,
          Rule_desc: obj
        })
      } else {
        console.log('暂无设置活动数据')
      }

    })
    //获取当前门店和商户的id
    that.dataTime();
    that.setNowDate();
    that.getProWeekList()
    that.loadCurScore()

    // 判断当天是否签到
    var sign_text;
    var getDate = that.data.getDate
    if (getDate < 10) {
      getDate = '0' + getDate
    }
    $config.post('sign/signlist', that.data.postdata, function(data) {
      if (data.data != '') {
        var index_ = data.data[0]['day_' + getDate]
        if (index_ == 1) {
          sign_text = '已签到'
        } else {
          sign_text = '签到'
        }
        that.setData({
          sign_btn: sign_text
        })
      }
    })
    var res = wx.getSystemInfoSync();
    that.setData({
      sysW: (res.screenWidth * 0.9) / 7 - 5, //更具屏幕宽度变化自动设置宽度
      marLet: that.data.firstDay,
      getDate: that.data.getDate,
      judge: 1,
      month: that.data.month,
    });



  },
  getNewTimeArry: function() {
    // 当前时间的处理
    var newDate = new Date();
    var hour = newDate.getHours(),
      minu = newDate.getMinutes(),
      seco = newDate.getSeconds();
    return [hour, minu, seco];
  },
  // 显示当前积分
  loadCurScore: function() {
    var that = this
    var pos = that.data.postdata
    $config.post('Score/get', pos, function(data) {
      if (data.code == 1) {
        that.setData({
          my_Score: data.data
        })
      }


    })
  },

  // 点击签到
  qiandao_btn: function(e) {
    if (e.target.dataset.text == '已签到') {
      // $config.showAlert('已签到')
      return false
    }
    var that = this;
    var pos = that.data.postdata
    $config.post('sign/index', pos, function(data) {
      var res = data.data
      //data.data.status  1.签到成功，2.已签到，3每日签到未开启、未在签到开始结束时间范围
      if (res.status == 1) {
        that.dataTime();
        that.loadCurScore()
        that.setNowDate();
        that.getProWeekList()
        that.setData({
          sign_btn: '已签到',
          showModal: true,
          productname: res.productname
        })

      }
      if (res.status == 2) {
        $config.showAlert('今日已签到')
        return
      }
      if (res.status == 3) {
        $config.showAlert('活动未开启!')
        return
      }
    })

  },
  // 关闭模态
  close: function() {
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