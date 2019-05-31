// pages/index/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      { id: 0, name: '泰潮', foods: [
        { id: 1, type: 1, name: "白露粉莓", price: 18, img: 1, num: 0},
        { id: 2, type: 1, name: "荔多多", price: 20, img: 2, num: 0 },
        { id: 3, type: 1, name: "泰萌", price: 22, img: 3, num: 0 }
      ] },
      {
        id: 1, name: '泰高冷', foods: [
          { id: 11, type: 2, name: "泰冰冰", price: 16, img: 1, num: 0 },
          { id: 22, type: 2, name: "泰妃", price: 17, img: 2, num: 0 },
          { id: 33, type: 2, name: "多莓奶冰", price: 20, img: 3, num: 0 }
        ] },
      {
        id: 2, name: '泰好喝', foods: [
          { id: 111, type: 3, name: "大皇宫7号", price: 25, img: 1, num: 0 },
          { id: 222, type: 3, name: "蛋糕抹茶", price: 26, img: 2, num: 0 },
          { id: 333, type: 3, name: "泰多多", price: 20, img: 3, num: 0 },
          { id: 333, type: 3, name: "泰红", price: 22, img: 4, num: 0 },
          { id: 333, type: 3, name: "泰绿", price: 23, img: 5, num: 0 }
        ] },
      {
        id: 3, name: '泰咖', foods: [
          { id: 1111, type: 4, name: "榴莲咖啡", price: 18, img: 1, num: 0 },
          { id: 2222, type: 4, name: "象山拿铁", price: 19, img: 2, num: 0 }
        ] },
      {
        id: 4, name: '泰特别', foods: [
          { id: 1121, type: 5, name: "冬阴功", price: 30, img: 1, num: 0 },
          { id: 14, type: 5, name: "绿松石可可", price: 16, img: 2, num: 0 },
          { id: 1513, type: 5, name: "泰榴莲", price: 20, img: 3, num: 0 },
          { id: 14, type: 5, name: "泰芒", price: 24, img: 4, num: 0 }
        ] },
      {
        id: 5, name: '泰炫彩', foods: [
          { id: 1232, type: 6, name: "粉色抹茶", price: 18, img: 1, num: 0 },
          { id: 252, type: 6, name: "木炭奈铁", price: 17, img: 2, num: 0 },
          { id: 3235, type: 6, name: "宇治奈铁", price: 21, img: 3, num: 0 },
          { id: 3235, type: 6, name: "芋香草莓", price: 20, img: 4, num: 0 },
          { id: 3235, type: 6, name: "脏脏抹茶", price: 22, img: 5, num: 0 }
        ] },
      {
        id: 6, name: '象丸', foods: [
          { id: 1451, type: 7, name: "象丸黑糖", price: 15, img: 1, num: 0 },
          { id: 25436, type: 7, name: "象丸可可", price: 15, img: 2, num: 0 },
          { id: 661343, type: 7, name: "象丸抹茶", price: 15, img: 3, num: 0 },
          { id: 661343, type: 7, name: "象丸芋香", price: 15, img: 4, num: 0 }
        ] }
    ],
    optionTabList: ["在线点单", "我的订单"],// 选项卡数据
    optionTabListIndex: 0,// 选项卡标识
    searchValue: "",// 搜索框字段
    activeIndex: 0,// 左边列表标识
    toView: 'a0',//
    scrollTop: 0,// 滚动到的位置
    scrollH: 1000,// 页面高度
    scrollSideH: 1000,
    scrollArr: [], // 获取滚动对应高度
    loading: false,// 显示购物车布局
    cartList: [],// 购物车
    sumMonney: 0,// 总金额
    cupNumber: 0,// 总杯数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getList();
  },
  // 选项卡切换
  optionTabListClick(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      optionTabListIndex: index
    })
  },
  // 监听输入框的值
  searchValueInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 进入页面获取页面高度
  getList() {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    let offsetS = 120
    //兼容iphoe5滚动
    if (sysinfo < 550) {
      offsetS = -40
    }
    //兼容iphoe Plus滚动
    if (sysinfo > 650 && sysinfo < 700) {
      offsetS = 240
    }

    let scrollArr = [0]
    //动态计算联动节点
    for (let i = 0; i < that.data.listData.length; i++) {
      scrollArr.push(scrollArr[i] + 72 * that.data.listData[i].foods.length + 20)
    }
    that.setData({
      scrollArr: scrollArr,
      loading: true,
      scrollH: sysinfo * 2 - offsetS - 100 - 90,
      scrollSideH: sysinfo * 2 - offsetS + 40
    })
  },
  // 点击左边列表切换选中状态
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
    })
  },
  //监听滚动 完成右到左的联动
  scroll: function (e) {
    var dis = e.detail.scrollTop
    var scrollHeight = e.detail.scrollHeight
    for (let i = 0; i < this.data.scrollArr.length; i++) {
      if (i < this.data.scrollArr.length) {
        if (dis > this.data.scrollArr[i] && dis < this.data.scrollArr[i + 1]) {
          this.setData({
            activeIndex: i,
          })
          break;
        }
      } else {
        this.setData({
          activeIndex: 0,
        })
      }
    }
    if (dis == 0) {
      this.setData({
        activeIndex: 0
      })
    }
  },


  selectInfo: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.num;
    var a = this.data;
    var tem = a.listData[type].foods[index]
    num++
    a.listData[type].foods[index].num = num
    var nums = a.listData
    this.setData({
      listData: nums,
      sumMonney: 10
    })
  },

  notice: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.num;
    var a = this.data;
    var tem = a.listData[type].foods[index]
    if (num==0){
      num = 0
    } else {
      num--
    }
    a.listData[type].foods[index].num = num
    var nums = a.listData
    this.setData({
      listData: nums,
      sumMonney: 0
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

  }
})