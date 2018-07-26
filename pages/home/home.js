// pages/home/home.js
import {
  Home
} from 'home-model.js';

var home = new Home()
Page({

  data: {

  },

  onLoad: function(option) {
    this._loadData()
  },
  _loadData: function() {
    var id = 1
    home.getBannerData(id, (res)=> {
      console.log(res)
    })
  }
})