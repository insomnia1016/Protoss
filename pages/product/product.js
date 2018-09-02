import {
  Product
} from 'product-model.js';
import { Cart } from '../cart/cart-model.js';
var cart =  new Cart()
var product = new Product()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray:[1,2,3,4,5,6,7,8,9,10],
    productCounts:1,
    currentTabsIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    this._loadData()
  },
  _loadData: function() {
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product: data
      })
    })
  },
  bindPickerChange:function(event){
    var index = event.detail.value
    var selectedCount = this.data.countsArray[index]
    this.setData({
      productCounts: selectedCount
    })
  },
  onTabsItemTap:function(event){
    var index = product.getDataSet(event,'index')
    this.setData({
      currentTabsIndex:index
    })
  },
  onAddingToCartTap:function(event){
    this.addToCart()
    var counts = this.data.cartTotalCounts + this.data.productCounts
    this.setData({
      cartTotalCounts: counts
    })
  },
  addToCart:function(){
    var tempObj = {}
    var keys = ['id','name','main_img_url','price']

    for(var key in this.data.product){
      if(keys.indexOf(key)>=0){
        tempObj[key] = this.data.product[key]
      }
    }
    cart.add(tempObj,this.data.productCounts)

  },
  onCartTap:function(event){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }

})