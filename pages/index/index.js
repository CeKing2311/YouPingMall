import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cateList:[],
    floorList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //发送异步请求   通过es6 的promise来优化
    var that = this;

    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function(res) {
    //     if (res.statusCode==200) {
    //        that.setData({swiperList:res.data.message});
    //     }
    //   }
    // });

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        this.setData({
          swiperList: result
        });
      })
  },
  //获取分类导航数据
  getCateList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          cateList: result
        });
      })
  },
  //获取楼层数据
  getFloorList() {
    request({
        url: "/home/floordata"
      })
      .then(result => {
        this.setData({
          floorList: result
        });
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