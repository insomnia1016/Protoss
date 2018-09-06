import {
  Cart
} from '../cart/cart-model.js';

import {
  Address
} from '../../utils/address.js';
import {
  Order
} from 'order-model.js';
var order = new Order()
var address = new Address()
var cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    addressInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var from = options.from
    //来自于购物车
    if(from == 'cart'){
      this._fromCart(options.account)
    }
    //旧订单
    else{
      this.data.id = options.id
    }
  },
  _fromCart:function(account){
    var productsArr
    this.data.account = account
    productsArr = cart.getCartDataFromLocal(true)

    this.setData({
      productsArr: productsArr,
      account: this.data.account,
      orderStatus: 0
    })
    address.getAddress((res) => {
      this._bindAddressInfo(res)
    })
  },
  _fromOrder:function(id){
    if (id) {
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      order.getOrderInfoById(id, (data) => {
       
        this.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        })
        // 快照地址
        var addressInfo = data.snap_address
        addressInfo.totalDetail = address.setAddressInfo(addressInfo)
        this._bindAddressInfo(addressInfo)

      })

      
    }
  },
  onShow: function() {
    this._fromOrder(this.data.id)
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
      showCancel: false,
      success: function(res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      }
    })
  },
  pay: function() {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址')
      return
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay()
    } else {
      this._oneMoreTimePay()
    }
  },
  _firstTimePay: function() {
    var orderInfo = [],
      productInfo = this.data.productsArr,
      order = new Order()
    for (let i = 0; i < productInfo.length; i++) {
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      })
    }

    var that = this
    order.doOrder(orderInfo, (data) => {
      if (data.pass) {
        var id = data.order_id
        that.data_id = id
        that._execPay(id)
      } else {
        that._orderFail(data)
      }
    })
  },
  _oneMoreTimePay: function() {
    this._execPay(this.data.id)
  },

  /*
   *下单失败
   * params:
   * data - {obj} 订单结果信息
   * */
  _orderFail: function(data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name
        if (name.length > 15) {
          name = name.substr(0, 12) + '...'
        }
        nameArr.push(name)
        if (nameArr.length >= 2) {
          break
        }
      }
    }
    str += nameArr.join('、')
    if (nameArr.length > 2) {
      str += ' 等'
    }
    str += ' 缺货'
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false
    })
  },
  _execPay: function(id) {

    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        //将已经下单的商品从购物车删除 
        this.deleteProducts()
        var flag = statusCode == 2
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + 'from=order',
        })
      }
    })
  },

  deleteProducts: function() {
    var ids = [],
      arr = this.data.productsArr
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id)
    }
    cart.delete(ids)
  }
})