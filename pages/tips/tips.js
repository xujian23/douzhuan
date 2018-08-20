// pages/tips/tips.js
Page({

  data: {
  
  },
  onLoad: function (options) {
    var otype = options.type;
    if(options.type==1){
      this.setData({
        tipsText2:"您的投诉已提交，平台将进行处理",
        otype: otype
      });
    }else{
      this.setData({
        tipsText2: "提现申请已提交，将在1个工作日内受理",
        otype: otype
      });
    }
  },
  backIndex:function(){
    wx.navigateBack({
      delta: 2
    })
  },
})