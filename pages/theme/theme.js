import {
  Theme
} from '../theme/theme-model.js';
var theme = new Theme();

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
    this.setData({
      id:options.id,
      titleName:options.name
    })
   
    this._loadData()
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.titleName,
    })
  },
  _loadData: function () {
    theme.getProductsData(this.data.id,(data)=>{
      this.setData({
        themeInfo:data
      })
    })
  },
  onProductsItemTap:function(event){
    var id = theme.getDataSet(event,'id')
    wx.navigateTo({
      url: '../product/product?id='+id
    })
  }
})