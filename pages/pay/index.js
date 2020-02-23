/**
 * 1页面加载的时候
 * 1.1从缓存中获取购物车数据 渲染到页面中，这些数据 checked=true
 * 2微信支付
 * 2.1企业账号
 * 2.2企业账号的小程序后台中 必须给开发者加入白名单
 * 3支付按钮
 * 3.1先判断缓存中有没有token,没有 跳转到授权页面 进行获取token
 * 3.2有token...
 * 3.3创建订单，获取订单编号
 * 3.4已经完成了微信支付
 * 3.5手动删除缓存中已经被选中了的商品
 * 3.6 删除后的购物车数据 填充回缓存
 * 3.7再跳转页面
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中购物车的数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    // 2 给data 赋值
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })

  },
  // 点击 支付
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 1 创建订单
      // 2 准备 请求头参数
      const header = { Authorization: token };
      // 3 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 4 准备发送请求  创建订单  获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams });
      // 返回参数 : 
      console.log(order_number);
      // 5 发起预支付接口请求
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number } });
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number } })
      await showToast({ title: "支付成功!" });
      // 8手动删除缓存中已经 支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 9支付成功了 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      });
    } catch (error) {
      await showToast({ title: "支付失败！" });
      console.log(error);
    }

  }
})
