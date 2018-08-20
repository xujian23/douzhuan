var self;
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _getUserAccount = url._getUserAccount;   // 获取用户账户信息
var _getPointRecords = url._getPointRecords;  // 获取积分历史记录
var _saveUserInfo = url._saveUserInfo;  // 保存用户信息
var _getRecommendation = url._getRecommendation;  // 获取小程序推荐列表
var pageSize = 1; // 当前显示积分记录页数
Page({
  data: {
    isauthorization:false,
    userImage:"../images/defaultImage.png",
    imgUrls: [   // banner图片
      {
        isktj: 0,
        image: "http://pic.616pic.com/bg_w1180/00/03/38/dx1bjEw73Y.jpg!/fw/1120",
        _path: "https://pic.ibaotu.com/00/33/77/91y888piC4u2.jpg-0.jpg!ww700",
        _appid: "wxc99570435b5d0697",
      },
    ],
    integralArr: [], // 积分列表
    lookmoreFade:false,
    lowerControl:false,
    username:"未登录",
    scrollViewFade:false,
    invitedFriendPoints:0,
    invitedFriends:0,
    pointBalance:0,
    todayExpCount:0
  },
  onShow: function (options) {
    self = this;
    var getSessionKey = setInterval(function () {
      if (gblData.sessionKey != null) {
        self.getUserAccount();
        self.getPointRecords();
        self.setData({
          username: gblData.name == null ? "未登录" : gblData.name,
          userImage: gblData.avatar == null ? "../images/defaultImage.png" : gblData.avatar,
          integralArr: [], // 积分列表
          complaintEntrySwitch: gblData.complaintEntrySwitch,
          myTabDisplaySwitch: gblData.myTabDisplaySwitch
        });
        self._getRecommendation()
        clearInterval(getSessionKey);
      }
    }, 100);
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
  },
  _getRecommendation: function () {   // 获取推荐小程序列表
    wx.request({
      url: _getRecommendation + gblData.sessionKey + "&pageNum=1&pageSize=100" + gblData.systemInfo,
      method: "GET",
      success: function (res) {
        var recommend_wx = res.data.data;
        console.log(recommend_wx);
        self.setData({
          myBanners: recommend_wx.myBanners
        });
        if (recommend_wx.myBanners.length==0){
          self.setData({
            myTabDisplaySwitch: 0
          });
        }
      }, fail: function (fail) {
        console.log(fail);
      }
    })
  },
  onGotUserInfo: function (event) {  // 用户授权、保存用户信息
    console.log(event);
    if (event.detail.errMsg =="getUserInfo:ok"){
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
            username: userInfo.nickName,
            userImage: userInfo.avatarUrl,

          });
        }, fail: function (fail) {
          console.log(fail);
        }
      });
    }
    
  },
  getUserAccount:function(){   // 获取用户账户信息
    wx.request({
      url: _getUserAccount+ gblData.sessionKey + gblData.systemInfo,
      success:function(res){
        let userAccountInfo = res.data.data;
        console.log(userAccountInfo);
        self.setData({
          pointBalance: userAccountInfo.balance,
          todayExpCount: userAccountInfo.todayExpCount,
          invitedFriendPoints: userAccountInfo.invitedFriendPoints,
          invitedFriends: userAccountInfo.invitedFriends,
        });
      },fail:function(fail){
        console.log(fail);
      }
    });
  },
  getPointRecords: function () {   // 获取积分历史记录
    wx.request({
      url: _getPointRecords + gblData.sessionKey + "&pageSize=20&pageNum=" + pageSize+ gblData.systemInfo,
      success: function (res) {
        let pointList = res.data.data;
        console.log(pointList);
        if (pointList.list.length > 3) {
          self.setData({
            lookmoreFade: true,
            surplusNum: pointList.list.length-3
          });
        }
        for (var i = 0; i < pointList.list.length; i++) {
          if (i < 3) {
            self.data.integralArr.push(pointList.list[i]);
            self.setData({
              integralArr: self.data.integralArr,
              pointList: pointList
            });
          }
        };
        self.setData({
          pageSize: pointList.pageSize,
          pages: pointList.pages,
          pageNum: pointList.pageNum
        });
      }, fail: function (fail) {
        console.log(fail);
      }
    });
  },
  lookmore: function (){
    this.setData({
      lookmoreFade: false,
      lowerControl: true,
      integralArr: self.data.pointList.list
    });
  },
  lower: function () {
    if (this.data.lowerControl && pageSize < self.data.pages){
      pageSize = pageSize+1;
      wx.request({
        url: _getPointRecords + gblData.sessionKey + "&pageNum=20&pageSize=" + pageSize + gblData.systemInfo,
        success: function (res) {
          let pointList = res.data.data;
          for (var i = 0; i < pointList.length; i++) {
            self.data.integralArr.push({
              mpName: pointList[i].category,
              time: pointList[i].date,
              score: pointList[i].points,
            });
            self.setData({
              integralArr: self.data.integralArr
            });
          }
        }, fail: function (fail) {
          console.log(fail);
        }
      });
    }
  },
  jumpSubmit: function (event) {
    let form_id = event.detail.formId;
    console.log(form_id);
    wx.navigateTo({
      url: '../invitingFriends/invitingFriends?form_id=' + form_id,
    });
  },
  jumpSubmit2: function (event) {
    let form_id = event.detail.formId;
    console.log(form_id);
    wx.navigateTo({
      url: '../moneybag/moneybag?form_id=' + form_id,
    });
  },
  onPullDownRefresh: function () {
    self.onLoad();
    wx.stopPullDownRefresh();
  },
})
