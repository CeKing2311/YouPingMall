// pages/category/index.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    //右侧滚动条距顶部距离
    scrollTop: 0
  },
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        // 超时，重新发送请求
        this.getCates();
      } else {
        console.log(Cates);
        this.Cates == Cates.data;
        // 构造左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url:"/categories"
    // }).then(res=>{
    //   this.Cates=res.data.message;
    //   //把接口返回的数据存入到本地缓存中
    //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates});
    //   // 构造左侧菜单数据
    //   let leftMenuList =this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //   let rightContent= this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })

    // 1 使用Es7d的 async 和 await 来发送请求
    const res = await request({
      url: "/categories"
    });
    //this.Cates = res.data.message;
    this.Cates=res;
    //把接口返回的数据存入到本地缓存中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    });
    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  // getCates(){
  //   // request({
  //   //   url:"/categories"
  //   // }).then(res=>{
  //   //   this.Cates=res.data.message;
  //   //   //把接口返回的数据存入到本地缓存中
  //   //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates});
  //   //   // 构造左侧菜单数据
  //   //   let leftMenuList =this.Cates.map(v=>v.cat_name);
  //   //   //构造右侧商品数据
  //   //   let rightContent= this.Cates[0].children;
  //   //   this.setData({
  //   //     leftMenuList,
  //   //     rightContent
  //   //   });
  //   // })
  // },

  handleItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    //构造右侧商品数据
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    });
  }
})