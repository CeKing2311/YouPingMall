import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],

  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表的数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    //获取总条数
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh();

  },
  // 标题的点击事件 从自主键传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  // 页面触底加载数据
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据',
      })
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
     
    }
  },
  // 页面下拉刷新
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    })    
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();    
  }
})