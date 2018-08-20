var self;
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _dzcode = url._dzcode;  // 通过code获取appid
var _recordClick = url._recordClick;
var _recordClose = url._recordClose;
// pages/jumpminwx/jumpminwx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    console.log(options);
    // options.dzcode = "a07388a8978ab9b99c3137bb10d6ebd4";
    var getSessionKey = setInterval(function () {
      if (gblData.sessionKey != null) {
        self.setData({
          options: options,
        });
        self.getAppInfo(options.dzcode);
        clearInterval(getSessionKey);
      }
    }, 100);
  },
  onShow: function () {
    self.recordClose();
  },
  getAppInfo: function (code){
    console.log(code);
    wx.request({
      url: _dzcode + code + "?sessionKey=" + gblData.sessionKey  + gblData.systemInfo,
      method: "GET",
      success: function (res) {
        var appInfo = res.data.data;
        console.log(appInfo);
        self.setData({
          "appId": appInfo.appId,
          "canNavigate": appInfo.canNavigate,
          "experienceState": appInfo.experienceState,
          "jwpage": appInfo.page,
          "points": appInfo.points,
          "code": code,
        });
        if (appInfo.canNavigate==1){
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
        self.recordJump(code);
      }
    })
  },
  recordClose: function () {  // 记录返回
    if (self.data.ifJumpBack == 1) {
      wx.request({
        url: _recordClose + self.data.code + "/closed?sessionKey=" + gblData.sessionKey + gblData.systemInfo,
        method: "POST",
        success: function (res) {
          console.log({
            "记录返回": "记录返回",
          });
          self.setData({
            "ifJumpBack": 0
          });
          gblData.jumpAppInfo ={
            status:res.data.code,
            points: self.data.points,
            experienceState: self.data.experienceState,
            msg:res.data.msg
          }
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },100);
          console.log(res.data);
        }, fail: function (fail) {
          console.log(fail);
        }
      });
    }
  },
  recordJump: function (code) {  //  记录点击
    console.log({
      "记录点击": "记录点击",
    });
    wx.request({
      url: _recordClick + code + "/click?sessionKey=" + gblData.sessionKey + gblData.systemInfo,
      method: "POST",
      success: function (res) {
        console.log(res.data);
        self.setData({
          "ifJumpBack":1
        });
      }, fail: function (fail) {
        console.log(fail);
      }
    });
  },
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

})