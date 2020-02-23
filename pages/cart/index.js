// pages/cart/index.js
// 1 获取用户的收货地址
// 1.1 绑定点击事件
// 1.2 调用小程序内置的api 获取用户的收货地址 wx.chooseAddress

// 2  获取用户对小程序所授予的获取地址的权限状态 scope
// 2.1 假设 用户 点击获取收货地址的提示框 确定 scope 值 ture 
//  直接调用 获取收货地址
// authSetting scop.address
// 2.2 假设 用户 从来没有调用过获取地址的api scope undefined 直接调用 获取收货地址
// 2.3 假设 用户 点击获取收货地址的提示框 取现 scope 值 false
// 2.3.1 诱导用户 打开授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候
// 2.3.2 获取收货地址
// 3 把获取到收货地址存储到本地缓存中

// 4 页面加载完毕
// 4.1 获取本地存储中的数据 onload onShow
// 4.2 把数据设置给data中的一个变量
// 5 onShow
// 5.1 获取缓存中购物车数据
// 5.2 把购物车数据填充到data中
// 6 全选的实现 数据的展示
// 6.1 onShow 获取到缓存中的购物车数组
// 6.2 根据购物车中的商品数据 所有的商品都被选中 checked=true 所有商品都被选中

// 7 商品的总价格和总数量
// 7.1都需要商品被选中 我们才拿他来计算
// 7.2获取购物车数组
// 7.3遍历 判断商品是否被选中
// 7.4总价格+= 商品单价*商品数量
// 总数量+= 商品数量
// 7.5把计算后的总价格和总数量设置到data中

// 8商品的选中
// 8.1绑定change事件
// 8.2获取到被修改的商品对象
// 8.3商品对象的选中状态取反
// 8.4重新填回data中和缓存中
// 8.5重新计算全选 总价格 总数量

// 9 全选和反选
// 9.1全选复选框绑定change事件
// 9.2获取data中的全选变量 allChecked 直接取反
// 9.3遍历购物车数组 让里面的商品选中状态 跟随 allChecked改变而改变
// 9.4把购物车数组 和 allChecked 重新设置回data中，购物车数组设置回缓存中

// 10商品数量的编辑功能
// 10.1 "+" 和"-" 绑定同一个事件 区分关键 自定义属性 "+" :"+1","-":"-1"
// 10.2传递被点击的goods_id
// 10.3获取data中的购物车数组 来获取需要被修改的商品对象
// 10.3.1当购物车的数量=1 同时点击"-",弹窗提示是否需要删除
// 10.4直接修改商品对象的数量 num
// 10.5把cart数组重新设置回缓存和data中 ，this.setCart

// 11点击结算
// 11.1判断有没有收货地址信息
// 11.2判断用户有没有选购商品
// 11.3经过验证，跳转到支付页面
import { getSetting, chooseAddress, openSetting,showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    // 1 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true ,那么every 的返回值为true ,只要有一个回调函数返回false 那么不再循环执行 直接返回false  ,空数组 调用every 返回值就是true
    // const allChecked = cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    this.setCart(cart);

  },
  // 点击收货地址
  async handleChoseAddress() {
    try {
      // 1 获取 权限状态
      // wx.getSetting({
      //   success: (result)=>{
      //      const  scopeAddress= result.authSetting["scope.address"]
      //      if (scopeAddress===true || scopeAddress===undefined) {
      //        wx.chooseAddress({
      //          success: (res)=>{
      //            console.log(res);               
      //          }
      //        });
      //      }else{
      //       // 用户 拒绝过授予权限 
      //       wx.openSetting({
      //         success: (res1)=>{
      //           wx.chooseAddress({
      //             success: (res2)=>{
      //               console.log(res2);               
      //             }
      //           });
      //         }
      //       });
      //      }
      //   },
      //   fail: ()=>{},
      //   complete: ()=>{}
      // });

      // 1获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"]
      // 2判断权限状态
      if (scopeAddress === false) {
        //  先诱导用户打开授权页面
        await openSetting();
      }
      // 4调用获取收货地址的 api    
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
      console.log(res2);
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取的被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数量
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把购物车数据重新设置回 data中和缓存中
    this.setData({
      cart
    });
    this.setCart(cart);

  },
  // 设置购物车状态 同时重新计算 底部工具栏数据 全选 总价格 购买数量
  setCart(cart){
    
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    // 2 给data 赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);

  },
  // 商品的全选功能
  handleItemAllChecked(){
    // 获取data中的数据
    let {cart,allChecked}=this.data;
    // 修改值
    allChecked =!allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v => {
      v.checked=allChecked
    });
    // 把修改后的值填充回data或缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e){  
    // 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // var that=this;
    // 获取购物车数组
    let {cart}=this.data;
    // 找到需要修改的商品的索引
    const index= cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除
    if (cart[index].num===1 && operation===-1 ) {
      const res= await showModal({content:"您是否要删除？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+= operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }

  },
  // 点击结算
  async handlePay(){
    
    const {address,totalNum}=this.data;
    // 判断收货地址
    if (!address.userName) {    
      await showToast({title:"您还没有选择收货地址"});      
      return;
    }
    // 判断有没有选购商品
    if (totalNum===0) {
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }
})