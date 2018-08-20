// pages/ewm/ewm.js
var self;
Page({
  data: {
    ewmImage:"",
    onshowNums:0,
  },
  onLoad: function (options) {
    self = this;
    // console.log(options);
    this.setData({
      ewmImage: options.path
    });
    // 调取预览图片
    // console.log("调取预览图片");
    var getPath = setInterval(function(){
      if (options.path){
        wx.previewImage({
          current: options.path, // 当前显示图片的http链接
          urls: [options.path], // 需要预览的图片http链接列表
          success: function (res) {
            // console.log("调取预览图片成功");
            // console.log(res)
          }, fail: function (fail) {
            console.log(fail);
          }
        })
        clearInterval(getPath);
      }
    },200);
  },
  previewEwm: function () {
    wx.previewImage({
      current: self.data.ewmImage, // 当前显示图片的http链接
      urls: [self.data.ewmImage], // 需要预览的图片http链接列表
      success: function (res) {
        // console.log(res)
      }, fail: function (fail) {
        console.log(fail);
      }
    })
  },
  onShow: function () {
    
    if (self.data.onshowNums+1!=2){
      this.setData({
        onshowNums: self.data.onshowNums + 1
      });
    }else{
      setTimeout(function () {
        // wx.switchTab({
        //   url: '/pages/index/index?ifJumpBack=1',
        // })
        wx.navigateBack({
          delta: 1
        })
      }, 50);
      this.setData({
        onshowNums: 0
      });
    }
  },
  onHide:function(){
    if (this.data.onshowNums==2){
      
    }
  }
})

