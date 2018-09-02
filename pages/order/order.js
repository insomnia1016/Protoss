import {
  Cart
} from '../cart/cart-model.js';
import {
  Address
} from '../../utils/address.js';
// import {
//   Order
// } from 'order-model.js';
// var order = new Order()
var address = new Address()
var cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var productsArr
    this.data.account = options.account
    productsArr = cart.getCartDataFromLocal(true)

    this.setData({
      productsArr: productsArr,
      account: this.data.account,
      orderStatus: 0
    })
  },

  /*修改或者添加地址信息*/
  editAddress: function(event) {
    var that = this
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        that._bindAddressInfo(addressInfo)

        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作失败', '地址信息更新失败！')
          }
        })
      }
    })
  },
  _bindAddressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },
  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function(title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success:function(res){
        if(flag){
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      }
    })
  },
})