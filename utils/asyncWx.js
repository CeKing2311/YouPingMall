// Promise 形式的 getSetting
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}

// Promise 形式的 getSetting
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}


// Promise 形式的 getSetting
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}

/**
 * Promise 形式的 showModal
 * @param {content} param0  参数
 */
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        resolve(result)
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

/**
 * Promise 形式的 showToast
 * @param {content} param0  参数
 */
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
    
  })
}

/**
 * Promise 形式的 login
 * 
 */
export const login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
    
  })
}

/**
 * Promise 形式的 小程序的微信支付
 * @param {object} pay  支付必须的参数
 */
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
    
  })
}