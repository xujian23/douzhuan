//index.js
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _getSessionKey = url._getSessionKey;    // 获取sessionKey
var _getRecommendation = url._getRecommendation;  // 获取小程序推荐列表
var _saveUserInfo = url._saveUserInfo;    // 保存用户信息
var _recordClick = url._recordClick;     // 记录点击
var _recordClose = url._recordClose;     // 记录关闭
var _getIndexBanners = url._getIndexBanners;  // 获取首页banners
var _getrule = url._getrule;  // 获取积分规则
var _dzcode = url._dzcode;  // 通过code获取appid
var self;
Page({
  data: {
    bannersArr:[],    // banner数组
    listItemArr: [],  // 小程序列表
    isauthorization:false,  // 是否授权过
    popupFade: false,       // 插屏弹窗
    experienceFade: false,  // 小于10秒弹窗
    failBoxFade:false,      // 网络原因出错弹窗
    redBagFade: false,      // 红包弹窗
    popupBoxFade:false,     // 三合一弹窗
    title2: "",              //三合一弹窗标题文字
    experienceMsgText: "", //三合一弹窗内容文字
    confirm: "",            //三合一弹窗按钮文字
    points: 10,              //三合一弹窗得分
    inviteFriendEntrySwitch:0,
    banneradText:"推荐",
    code:null,  // 小程序code
    ifJumpBack: 0,// 0不是从其他小程序返回的
    jwpopupFade:false,
  },
  
  onLoad: function (options) {
     self = this;
     var getSessionKey = setInterval(function () {
      //  console.log(gblData.sessionKey);
       if (gblData.sessionKey != null) {
         self.setData({
           bannersArr: [],
           listItemArr: [],  // 小程序列表
           inviteFriendEntrySwitch: gblData.inviteFriendEntrySwitch,
           lineversion: gblData.loadMainAppSwitch==1?true:false,
           options: options
         });
         self._getRecommendation();
         //  options.dzcode = "b2f80a4e6abf75384843346cab3539ff";
         if(options.dzcode!=undefined){
           self.setData({
             jwpopupFade: true,
           })
           self.getAppInfo(options.dzcode);
         }
         if (gblData.isNew && gblData.loadMainAppSwitch == 1 && options.dzcode == undefined){
           self.openrule();
         }
         clearInterval(getSessionKey);
       }
     }, 100);
  },
  onShow: function () {
    self.recordClose(self.data.ifJumpBack, self.data.code);
  },
  getAppInfo: function (code) {
    wx.request({
      url: _dzcode + code + "?sessionKey=" + gblData.sessionKey + gblData.systemInfo,
      method: "GET",
      success: function (res) {
        var appInfo = res.data.data;
        console.log(appInfo);
        self.setData({
          "jwappId": appInfo.appId,
          "canNavigate": appInfo.canNavigate,
          "state": appInfo.experienceState.code,
          "jwpage": appInfo.page,
          "points": appInfo.points,
          "code": code,
          "jxIcon": appInfo.logo,
          "jwtitle": appInfo.name,
          "jwcontent": appInfo.description,
        });
        if (appInfo.canNavigate == 1) {
          self.canNavigate(appInfo, code);
        }
      }, fail: function (fail) {
        console.log(fail);
      }
    })
  },
  canNavigate: function (appInfo, code) {// canjump
    wx.navigateToMiniProgram({
      appId: appInfo.appId,
      path: appInfo.page,
      extraData: appInfo.extraData,
      envVersion: 'release',
      success(res) {
        console.log("打开成功");
        var eventData = {
          "points": appInfo.points,
          "code": code,
          "state": appInfo.experienceState.code,
        }
        self.recordJump(eventData);
        self.setData({
          "jwpopupFade": false
        })
      }
    })
  },
  openrule:function(){  // 打开规则
    wx.request({
      url: _getrule + gblData.sessionKey + gblData.systemInfo,
      success:function(res){
        console.log(res.data.data.rule.split("\n"));
        self.setData({
          rulecontent: res.data.data.rule.split("\n"),
          popupFade:true,
        });
        gblData.isNew = false;
      },fail:function(fail){
        console.log(fail);
      }
    })
  },
  
  recordClose: function (ifJumpBack, code){  // 记录返回
    console.log("ifJumpBack=" + ifJumpBack);
    // console.log(code);
    if(ifJumpBack==1){
      wx.request({
        url: _recordClose + code + "/closed?sessionKey=" + gblData.sessionKey + gblData.systemInfo,
        method: "POST",
        success: function (res) {
          // console.log("ifJumpBack=" + self.data.ifJumpBack);
          console.log(res.data);
          if (res.data.code == 0 && self.data.tiyanstate == 0) {
            self.setData({
              popupBoxFade: true,     // 三合一弹窗
              experienceMsgText: "您通过本次体验，收获" + self.data.points + "积分！",
              title2: "获得积分",
              confirm: "我知道了",
              groupImage: "../images/img_time.png",
              rotate: 0
            });
            self._getRecommendation();
          } else if (res.data.code == "20005" && self.data.tiyanstate == 0) {
            self.setData({
              popupBoxFade: true,     // 三合一弹窗
              experienceMsgText: res.data.msg,
              title2: "体验时间不足",
              confirm: "继续体验",
              groupImage: "../images/img_coin.png",
              rotate: 1,
            });
          }
          self.setData({
            ifJumpBack:0
          });
        }, fail: function (fail) {
          console.log(fail);
        }
      });
    }
  },

  recordJump: function (eventData) {  //  记录点击
    console.log({
      "记录点击": "记录点击",
      "ifJumpBack": 1,
      "points": eventData.points,
      "code": eventData.code,
      "tiyanstate": eventData.state
    });
    self.setData({
      "points": eventData.points,
      "code": eventData.code,
      "tiyanstate": eventData.state,
      "ifJumpBack": 1
    });
    wx.request({
      url: _recordClick + eventData.code + "/click?sessionKey=" + gblData.sessionKey + gblData.systemInfo,
      method: "POST",
      success: function (res) {
        console.log(res.data);
      }, fail: function (fail) {
        console.log(fail);
      }
    });
  },
  _getRecommendation: function (){   // 获取推荐小程序列表
      wx.request({
        url: _getRecommendation + gblData.sessionKey + "&pageNum=1&pageSize=100" + gblData.systemInfo,
        method:"GET",
        success:function(res){
          var recommend_wx = res.data.data;
          console.log(recommend_wx);
          self.setData({
            "listItemArr": recommend_wx.apps,
            "bannersArr": recommend_wx.banners,
            "banneradText": recommend_wx.banneradText == undefined ? "推荐" : recommend_wx.banneradText
          });
        },fail:function(fail){
          console.log(fail);
        }
      })
  },
  jumpSubmit: function (event) {
    let form_id = event.detail.formId;
    wx.navigateTo({
      url: '../invitingFriends/invitingFriends?form_id=' + form_id,
    });
  },
  closePop: function () { // 关闭规则说明弹窗
    this.setData({
      popupFade: false
    })
  },
  closejwpopup: function () { // 关闭跳转推荐弹窗
    this.setData({
      jwpopupFade: false
    })
  },
  confirm: function () {   // 关闭三合一弹窗
    this.setData({
      popupBoxFade: false
    })
  },
  onPullDownRefresh: function () {
    self.onLoad({});
    wx.stopPullDownRefresh();
  },
  onNavigatorClick: function (event){
    console.log("onNavigatorClick=======");
    let eventData = {
      code: event.currentTarget.dataset.code,
      points: event.currentTarget.dataset.points,
      state: event.currentTarget.dataset.state,
    };
    this.recordJump(eventData);
  },
  jumpEwm:function(event){
    let eventData = {
      code: event.currentTarget.dataset.code,
      points: event.currentTarget.dataset.points,
      state: event.currentTarget.dataset.state,
    }
    this.recordJump(eventData);
    wx.navigateTo({
      url: '../ewm/ewm?path=' + event.currentTarget.dataset.redirecturl,
    })
  },
  onShareAppMessage: function () {
    return {
      title: "我体验小程序赚了，你也来试试？",
      path: "pages/index/index",
      imageUrl: "http://images.starknows.cn/dzsharecover.jpg"
    }
  }
})

