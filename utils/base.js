import {
  Config
} from 'config.js';
import {
  Token
} from 'token.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl
  }
  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params, noRefetch) {
    var url = this.baseRequestUrl + params.url
    if (!params.type) {
      params.type = 'GET'
    }
    var that = this
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
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        var code = res.statusCode.toString()
        var startChar = code.charAt(0)
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data)
        } else {
          //AOP
          if (code == '401') {
            if (!noRefetch) {
              that._refetch(params)
            }

          }
          if (noRefetch) {
            params.eCallback && params.eCallback(res.data)
          }
        }

      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  }

  _refetch(params) {
    var token = new Token()
    token.getTokenFromServer((token) => {
      this.request(params, true)
    })
  }

  getDataSet(event, key) {
    return event.currentTarget.dataset[key]
  }

}
export {
  Base
};