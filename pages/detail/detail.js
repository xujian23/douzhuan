// pages/detail/detail.js
Page({
  data: {
    boxNum:4
  },
  onLoad: function (options) {
    this.setData({
      boxNum: options.box
    });
  },
})