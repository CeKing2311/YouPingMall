// pages/auth/index.js
import { request } from "../../request/index.js"
import { login } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  // 获取用户信息
 async handleGetuserinfo(e){
    try {
      // 获取用户信息
    const {encryptedData,rawData,iv,signature}= e.detail;
    // 获取小程序登录成功后的code
    const {code}= await login();
    //console.log(code);
    const loginParams={
      encryptedData,rawData,iv,signature,code
    }
    // 发送请求获取用户的token
    const res= await request({url:"/users/wxlogin",data:loginParams,methods:"post"})
    // console.log(res);
    // 把token 存入缓存中 同时跳转回上一个页面
    wx.setStorageSync("token", res);
    wx.navigateBack({
      delta: 1
    });
    } catch (error) {
      console.log(error);
    }
  }
})