import {Base} from '../../utils/base.js';
class Home {

  constructor() {

  }

  getBannerData(id,callBack) {
    wx.request({
      url: 'http://y.cn/api/v1/banner/'+id,
      method: 'GET',
      success: function(res) {
       callBack(res)
       
      }
    })
  }
}
export {
  Home
};