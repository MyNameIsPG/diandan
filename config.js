//数字时间戳转换格式
String.prototype.GetDate = function () {
  var date = this.replace('/Date(', '').replace(')/', '');
  return new Date(parseInt(date));
}

//+---------------------------------------------------
// 使用 Date(1504236138000)/'.Format('yyyy-MM-dd hh:mm:ss')
//+---------------------------------------------------
String.prototype.Format = function (fmt) {
  if (!fmt || fmt.length == 0) {
    return '';
  }
  var date = this.replace('/Date(', '').replace(')/', '');
  return new Date(parseInt(date)).Format(fmt);
}

Number.prototype.Format = function (fmt) {
  return new Date(this * 1000).Format(fmt);
}

//+---------------------------------------------------
// 使用 new Date().Format('yyyy-MM-dd hh:mm:ss')
//+---------------------------------------------------
Date.prototype.Format = function (fmt) {  //
  var o = {
    "M+": this.getMonth() + 1,
    //月份 
    "d+": this.getDate(),
    //日 
    "h+": this.getHours(),
    //小时 
    "m+": this.getMinutes(),
    //分 
    "s+": this.getSeconds(),
    //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //季度 
    "S": this.getMilliseconds()  //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

 

var $clienthost = 'https://app.yumaocn.com';
var $Fubei ='https://fubei.yumaocn.com';
var yumaohost = 'https://www.yumaocn.com';
var config = {
  host_file: $clienthost,
  yumaohost_file: yumaohost,
  host: $clienthost + "/app/",
  Clienthost: $clienthost + "/app/",
  Fubeihost: $Fubei + "/api/",
  // 登录地址，用于建立会话
  postdata: { userid: 1, token: "token", timestamp: "11111" },
  post: function (url, data, callback) {
    config.postdata = wx.getStorageSync('user');
    data.userid = config.postdata.uid;
    data.uid = config.postdata.uid;
    data.token = wx.getStorageSync('token');
    data.timestamp = wx.getStorageSync('timestamp');
    wx.request({
      url: this.host + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 9999){
          wx.redirectTo({
            url: '../../pages/myInfo/login',
          })
          return
        }
        callback(res.data);
      }, fail: function () {
        callback({ flag: false, data: {}, msg: '接口异常，请重试！' });
      }
    })
  },
  Clientpost: function (url, data, callback) {
    config.postdata = wx.getStorageSync('user');
    data.userid = config.postdata.uid;
    data.token = wx.getStorageSync('token');
    data.timestamp = wx.getStorageSync('timestamp');
    wx.request({
      url: this.Clienthost + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        if (res.data.code == 9999) {
          wx.redirectTo({
            url: '../../pages/myInfo/login',
          })
          return
        }
        callback(res.data);
      }, fail: function () {

        console.log("这是res+" + res.data)
        
        callback({ flag: false, data: {}, msg: '接口异常，请重试！' });
      }
    })
  },
  Fubei: function (url, data, callback) {
    config.postdata = wx.getStorageSync('user');
    data.userid = config.postdata.uid;
    data.token = wx.getStorageSync('token');
    data.timestamp = wx.getStorageSync('timestamp');
    wx.request({
      url: this.Fubeihost + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 9999) {
          wx.redirectTo({
            url: '../../pages/myInfo/login',
          })
          return
        }
        callback(res.data);
      }, fail: function () {
        console.log("这是res+" + res.data)
        callback({ flag: false, data: {}, msg: '接口异常，请重试！' });
      }
    })
  },
  showSuccess: function (msg) {//成功提示
    if (msg == undefined)
      msg = '操作成功';
    wx.showToast({
      title: msg,
      icon: "success"
    });
  },
  showAlert: function (msg) {//普通提示
    if (msg == undefined)
      msg = '操作失败';
    wx.showToast({
      title: msg,
      icon: "none"
    });
  },
  hideAlert: function () {
    wx.hideToast();
  },
  showLoading: function (msg, callback) {//进度条提示
    if (msg == undefined)
      msg = '正在处理中';
    wx.showLoading({
      title: msg,
      mask: true,
      complete: function () {
        if (callback != undefined)
          callback();
      }
    });
  },
  hideLoading: function () {
    wx.hideLoading();
  },

   
  };
module.exports = config