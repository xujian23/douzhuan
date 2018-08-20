// pages/moneybag/moneybag.js
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _getaccountInfo = url._getaccountInfo; // 获取提现账户信息 
var _getMoney = url._getMoney; // 积分提现 
var _saveUserInfo = url._saveUserInfo; 
var self; 
Page({
  data: {
    pointBalance: 0,//积分总数
    amount: 0,       //可提现金额
    maxWithdrawTimes: 0, //是否可提现
    canWithdraw: false,  //最多提现次数
    primaryFade:false,  // 提现按钮,
    isauthorization: false,  // 是否授权过
    popupBoxFade:false,
  },
  onLoad: function (options) {
    console.log(options);
    self = this;
    //  判断用户是否授权过
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"] == undefined || res.authSetting["scope.userInfo"] == false) {
          self.setData({
            "isauthorization": true,
          });
        } else {
          self.setData({
            "isauthorization": false,
          });
        }
      },
    }); 
    var getSessionKey = setInterval(function () {
      if (gblData.sessionKey != null) {
        self._getaccountInfo(options);
        self.setData({
          options: options
        });
        clearInterval(getSessionKey);
      }
    }, 100);
  },
  _getaccountInfo: function (options) {   // 获取提现账户信息
    let form_id = options.form_id;
    if (options.form_id) {
      console.log(options.form_id);
      let iFUrl = _getaccountInfo + gblData.sessionKey + gblData.systemInfo + "&form_id=" + form_id;
      requestInfo(iFUrl);
    } else {
      let iFUrl = _getaccountInfo + gblData.sessionKey + gblData.systemInfo;
      requestInfo(iFUrl);
      console.log("无form_id");
    }
    function requestInfo(iFUrl){
      wx.request({
        url: iFUrl,
        method: "GET",
        success: function (res) {
          console.log(res.data.data);
          var accountInfo = res.data.data;
          self.setData({
            pointBalance: accountInfo.pointBalance,//积分总数
            amount: accountInfo.amount,       //可提现金额
            maxWithdrawTimes: accountInfo.maxWithdrawTimes, //最多提现次数
            canWithdraw: accountInfo.canWithdraw,  //是否可提现
            notice: accountInfo.notice,
          });
        }, fail: function (fail) {
          console.log(fail);
        }
      })
    }
    
  },
  primary: function (event) {   //积分提现
    console.log(event.detail.formId)
    wx.showLoading({});
    wx.request({
      url: _getMoney + gblData.sessionKey + gblData.systemInfo,
      method: "POST",
      data:{
        formId: event.detail.formId
      },
      success: function (res) {
        console.log(res);
        if(res.data.code!=0){
            wx.showToast({
              title: '提现失败',
            });
        }else{
          wx.navigateTo({
            url: '../tips/tips?type=2'
          })
          wx.hideLoading();
          self.onShow();
        }
      }, fail: function (fail) {
        console.log(fail);
        wx.showToast({
          title: '提现失败',
        });
      }
    })
  },
  onGotUserInfo: function (event) {  // 用户授权、保存用户信息
    if (event.detail.errMsg == "getUserInfo:ok") {
      let userInfo = event.detail.userInfo;
      gblData.userInfo = userInfo;
      wx.request({
        url: _saveUserInfo + gblData.sessionKey + gblData.systemInfo,
        method: "POST",
        data: {
          "name": userInfo.nickName,
          "avatar": userInfo.avatarUrl,
          "userExtra": event.detail,
          "systemInfo": gblData.systemInfo
        },
        success: function (res) {
          console.log("保存用户信息");
          console.log(res.data);
          gblData.avatar = userInfo.avatarUrl;
          gblData.name = userInfo.nickName;
          self.setData({
            isauthorization: false,
          });
        }, fail: function (fail) {
          console.log(fail);
        }
      });
    }
  },
  tixianFail:function(){
    self.setData({
      popupBoxFade: true,
    });
  },
  jumpSubmit: function (event) {
    let form_id = event.detail.formId;
    console.log(form_id);
    wx.navigateTo({
      url: '../cashRecord/cashRecord?form_id=' + form_id,
    });
  },
  onPullDownRefresh: function () {
    self.onLoad(this.data.options);
    wx.stopPullDownRefresh();
  },
  closepopup:function() { // 关闭弹窗
    self.setData({
      popupBoxFade: false,
    });
  },
  onShareAppMessage:function(){
    this.setData({
      popupBoxFade:false
    })
    
    return {
      title: "我体验小程序赚了，你也来试试？",
      path: gblData.inviteLink,
      imageUrl: "http://images.starknows.cn/dzsharecover.jpg"
    }
  }
})