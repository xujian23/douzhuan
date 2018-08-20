// pages/invitingFriends/invitingFriends.js 
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _invitefriendsInfo = url._invitefriendsInfo; // 邀请好友首页
var self;
Page({
  data: {
    notices: [],
    friends:[],
    inviteLink:null, //邀请好友链接
    inviteTitle: null,          //邀请好友链接title
    interval: 2000,
    duration:500,
    current:0,
    autoplay:true,
  },
  onLoad: function (options) {
    console.log(options.flag);
    self = this;
    var getSessionKey = setInterval(function () {
      if (gblData.sessionKey != null) {
        self.setData({
          notices: [],
          friends: [],
          options: options,
          msgLogeIn: options.flag == undefined?false:true
        });
        self._invitefriendsInfo(options);
        clearInterval(getSessionKey);
      }
    }, 200);
  },
  onShow:function(){
    self.setData({
      autoplay:true
    });
  },
  
  onHide:function(){
    self.setData({
      autoplay: false
    });
  },
  _invitefriendsInfo: function (options) {   // 提现历史记录
    let form_id = options.form_id;
    if (options.form_id){
      console.log(options.form_id);
      let iFUrl = _invitefriendsInfo + gblData.sessionKey + gblData.systemInfo + "&form_id=" + form_id;
      requestInfo(iFUrl);
    }else{
      let iFUrl = _invitefriendsInfo + gblData.sessionKey + gblData.systemInfo;
      requestInfo(iFUrl);
      console.log("无form_id");
    }
    function requestInfo(iFUrl){
      wx.request({
        url: iFUrl,
        method: "GET",
        success: function (res) {
          console.log("====邀请好友首页======");
          console.log(res);
          self.setData({
            lookmoreFade: true,
            "rewardPoints": res.data.data.rewardPoints, //邀请好友奖励积分
            "withdrawCount": res.data.data.withdrawCount, //总提现人数
            "invitePoints": res.data.data.invitePoints, //邀请好友得到积分数
            "inviteLink": res.data.data.inviteLink, //邀请好友链接
            "inviteTitle": res.data.data.inviteTitle,          //邀请好友链接title
            "friends": res.data.data.friends,
            "notices": res.data.data.notices,
            "inviteImageUrl": res.data.data.inviteImageUrl
          });
        }, fail: function (fail) {
          console.log(fail);
        }
      })
    }
    
  },
  jumpSubmit: function (event) {
    let form_id = event.detail.formId;
    console.log(form_id);
    wx.navigateTo({
      url: '../moneybag/moneybag?form_id=' + form_id,
    });
  },
  swiperchange:function(event){
    // self.data.notices.push(self.data.notices[event.detail.current]);
    if (event.detail.current == self.data.notices.length-1){
      console.log("=====")
      self.setData({
        interval: 0,
        duration: 0,
        // current: 0,
      });
      setTimeout(function(){
        self.setData({
          current: 0,
          interval: 2000,
          duration: 500,
        });
      },200);
    }
  },
  onShareAppMessage: function () {
    return {
      title: self.data.inviteTitle == null ? "邀好友得现金" : self.data.inviteTitle,
      path: self.data.inviteLink == null ? "/pages/index/index" : self.data.inviteLink,
      imageUrl: self.data.inviteImageUrl
    }
  },
  
  onPullDownRefresh: function () {
    self.onLoad(this.data.options);
    wx.stopPullDownRefresh();
  },
})