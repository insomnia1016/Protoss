import {My} from 'my-model.js';
import { Order } from '../order/order-model.js';
import { Address} from '../../utils/address.js';
var my = new My()
var order =  new Order()
var address = new Address()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    orderArr:[],
    isLoadedAll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
    this._getAddressInfo()
  },
  onShow:function(){
    var newOrderFlag = order.hasNewOrder()
    if(newOrderFlag){
      this.refresh()
    }
    
  },
  refresh:function(){
    this.data.orderArr = []
    this._getOrders(()=>{
      this.data.isLoadedAll = false //是否加载完全
      this.data.pageIndex = 1
      order.execSetStorageSync(false) //更新标志位
    })
  },
  _loadData:function(){
    this._getOrders();
  },
  _getAddressInfo:function(){
    address.getAddress((addressInfo)=>{
      this._bindAddressInfo(addressInfo)
    })
  },
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },
  _getOrders:function(callback){
    order.getOrders(this.data.pageIndex,(res)=>{
      var data = res.data
      if(data.length > 0){
        this.data.orderArr.push.apply(this.data.orderArr,res.data)
        this.setData({
          orderArr: this.data.orderArr
        })
      }else{
        this.data.isLoadedAll = true
      }
      callback && callback()
    })
  },
  onReachBottom:function(){
    if(!this.data.isLoadedAll){
      this.data.pageIndex++
      this._getOrders()
    }
  },
  showOrderDetailInfo:function(event){
    var id = my.getDataSet(event,'id')
    wx.navigateTo({
      url: '../order/order?from=order&id='+ id,
    })
  },
  rePay:function(event){
    var id = my.getDataSet(event,'id')
    var index = my.getDataSet(event,'index')

    this._execPay(id,index)
  },
  _execPay:function(id,index){
    order.execPay(id,(statusCode)=>{
      if(statusCode > 0 ){
        var flag = statusCode == 2

        //支付成功，更新订单显示状态
        if(flag){
          this.data.orderArr[index].status = 2
          this.setData({
            orderArr:this.data.orderArr
          })
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my',
        })
      }else{
        this.showTips('支付失败','商品已下架或者库存不足')
      }
    })
  },
  showTips:function(title,content){
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success:function(res){

      }
    })
  },
  /*修改或者添加地址信息*/
  editAddress: function (event) {
    var that = this
    wx.chooseAddress({
      success: function (res) {
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
  }
 
})