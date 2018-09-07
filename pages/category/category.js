// pages/category/category.js
import {
  Category
} from 'category-model.js'
var category = new Category()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentMenuIndex: 0,
    loadingHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData()
  },

  /*加载所有数据*/
  _loadData: function(callback) {
    category.getCategoryType((categoryData) => {
      this.setData({
        categoryTypeArr: categoryData
      })
      category.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }
        this.setData({
          loadingHidden: true,
          categoryInfo0: dataObj
        })
        callback && callback()
      })
    })
  },

  /*切换分类*/
  changeCategory: function(event) {
    var index = category.getDataSet(event, 'index'),
      id = category.getDataSet(event, 'id')

    this.setData({
      currentMenuIndex: index
    })

    //是否加载过，加载过就不再从服务器获取
    if (!this.isLoadedData(index)) {
      this.getProductsByCategory(id, (data) => {
        this.setData(this.getDataObjForBind(index, data))
      })
    }

  },
  isLoadedData: function(index) {
    if (this.data['categoryInfo' + index]) {
      return true
    }
    return false
  },
  getDataObjForBind: function(index, data) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryTypeArr[index]
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.img.url,
          title: baseData.name
        }
        return obj
      }
    }
  },
  getProductsByCategory: function(id, callback) {
    category.getProductsByCategory(id, (data) => {
      callback && callback(data)
    })
  },

  /*跳转到商品详情*/
  onProductsItemTap:function(event){
    var id = category.getDataSet(event,'id')
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  //下拉刷新
  onPullDownRefresh:function(){
    this._loadData(()=>{
      wx.stopPullDownRefresh()
    })
  },
  //分享效果
  onShareAppMessage:function(){
    return {
      title: '零食商贩 Pretty Vendor',
      path: 'pages/category/category'
    }
  }

})