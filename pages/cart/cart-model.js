import {
  Base
} from '../../utils/base.js';

class Cart extends Base {
  constructor() {
    super()
    this._storageKeyName = 'cart'
  }

  add(item, counts) {
    var cartData = this.getCartDataFromLocal()
    var isHasInfo = this._isHasThatOne(item.id, cartData)
    if (isHasInfo.index == -1) {
      item.counts = counts
      item.selectStatus = true
      cartData.push(item)
    } else {
      cartData[isHasInfo.index].counts += counts
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }
  getCartDataFromLocal() {
    var res = wx.getStorageSync(this._storageKeyName)
    if (!res) {
      res = []
    }
    return res
  }
  /**
   * 计算购物车内商品总数量
   * flag true 考虑商品选择状态
   */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal()
    var counts = 0
    for (var i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts
        }
      } else {
        counts += data[i].counts
      }
    }
    return counts
  }
  _isHasThatOne(id, arr) {

    var item, result = {
      index: -1
    }

    for (var i = 0; i < arr.length; i++) {
      item = arr[i]
      if (item.id == id) {
        result = {
          index: i,
          data: item
        }
        break
      }
    }
    return result
  }

  _changeCounts(id,counts){
    var cartData = this.getCartDataFromLocal(),
    hasInfo = this._isHasThatOne(id,cartData)
    if(hasInfo.index != -1){
      if(hasInfo.data.counts>=1){
        cartData[hasInfo.index].counts += counts
      }
    }
    wx.setStorageSync(this._storageKeyName,cartData)
  }

  addCounts(id){
    this._changeCounts(id,1)
  }

  cutCounts(id){
    this._changeCounts(id,-1)
  }

  delete(ids){
    if(!(ids instanceof Array)){
      ids = [ids]
    }
    var cartData = this.getCartDataFromLocal()
    for(let i = 0; i< ids.length;i++){
      var hasInfo = this._isHasThatOne(ids[i],cartData)
      if(hasInfo.index != -1){
        cartData.splice(hasInfo.index,1)
      }
    }
    wx.setStorageSync(this._storageKeyName,cartData)
  }

  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data)
  }

}

export {
  Cart
};