import {
  Config
} from '../utils/config.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl
  }
  request(params) {
    var url = this.baseRequestUrl + params.url
    if (!params.type) {
      params.type = 'GET'
    }
    wx.request({
      url: url,
      data: params.data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: params.type,
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        params.sCallback && params.sCallback(res.data)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  }

}
export{ Base };