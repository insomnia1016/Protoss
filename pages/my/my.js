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
  _getOrders:function(){
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
  }
 
})