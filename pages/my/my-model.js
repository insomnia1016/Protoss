import {Base} from '../../utils/base.js';

class My extends Base {
  constructor(){
    super()
  }

  getUserInfo(cb){
    wx.login({
      success:function(){
        wx.getUserInfo({
          success:function(res){
            typeof cb == 'function' && cb(res)
          },
          fail:function(res){
            typeof cb == 'function'  && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '零食小贩'
            })
          }
        })
      }
    })  
  }
}

export {My}