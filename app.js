var url = require("./utils/url.js")._url;
var _chconfig = require("./utils/url.js")._chconfig;
var _getSessionKey = url._getSessionKey;  
var _switches = url._switches;
var _recordClose = url._recordClose;     // 记录关闭
var self;
const ktongji = require("./utils/ktongji/ktongji.min.js");
ktongji.init("5b4f15e2c3666e23428b1685");
App({
  globalData: {
    userInfo: null,  // 用户信息
    pointInfo:null,   // 积分信息
    sessionKey:null, 
    systemInfo:null,  
    avatar:null,
    name:null,
    isNew:null,
    inviteFriendEntrySwitch: null,  // 邀请好友switch
    complaintEntrySwitch: null,     // 投诉switch
    myTabDisplaySwitch: null,       //  我的tab
    loadMainAppSwitch:null,         // 加载switch
    wxcode:null,              // 跳转wx的code
    tiyanstate:null,          //  体验状态
    recordClosed:null,        // 记录关闭
    jumpAppInfo:null,  // 返回的app信息
    inviteLink:null,     // 分享地址
  },
  onShow: function (options) {
    console.log(options);
    let inviteCode = options.query.inviteCode == undefined ? "null" : options.query.inviteCode;
    self = this;
    wx.getSystemInfo({   // 获取系统信息，
      success:function(res){
        let systemInfo = "&SDKVersion=" + encodeURI(res.SDKVersion) + "&brand=" + encodeURI(res.brand) + "&model=" + encodeURI(res.model) + "&language=" + encodeURI(res.language) + "&version=" + encodeURI(res.version) + "&platform=" + encodeURI(res.platform) + "&system=" + encodeURI(res.system) + "&ch_version=" + _chconfig.ch_version;
        self.globalData.systemInfo = systemInfo;
      },fail:function(fail){
        console.log(fail);
      }
    });
    self.switches();
    userLogin();
    function userLogin() {
      wx.login({
        success: function (rescode) {
          wx.request({   
            url: _getSessionKey,
            method: 'POST',
            data: {
              "sessionCode": rescode.code, //微信login后code  
              "source": 0,
              "inviteCode": inviteCode
            },
            success: function (res) {
              var resdata = res.data.data;
              console.log(res);
              self.globalData.sessionKey = resdata.sessionKey;
              self.globalData.pointInfo = resdata.pointInfo;   
              self.globalData.userInfo = resdata.userInfo;
              self.globalData.isNew = resdata.isNew;
              self.globalData.inviteLink = resdata.inviteLink;
              self.globalData.name = resdata.userInfo.name == "" ? "未登录" : resdata.userInfo.name;
              self.globalData.avatar = resdata.userInfo.avatar == "" ? "../images/defaultImage.png" : resdata.userInfo.avatar;
            },
            fail: function (fail) {
              console.log(fail);
              wx.showToast({
                title: "获取code失败",
                icon: 'success',
                duration: 3000
              });
            }
          });
        },
      });
    };
  },
  switches:function(){
    wx.request({
      url: _switches + "?sessionKey=" + self.globalData.sessionKey+ self.globalData.systemInfo,
      method:"GET",
      success:function(res){
        console.log(res.data);
        // res.data.loadMainAppSwitch=1;
        self.globalData.inviteFriendEntrySwitch = res.data.inviteFriendEntrySwitch;
        self.globalData.complaintEntrySwitch = res.data.complaintEntrySwitch;
        self.globalData.myTabDisplaySwitch = res.data.myTabDisplaySwitch;
        self.globalData.loadMainAppSwitch = res.data.loadMainAppSwitch;
        if (res.data.loadMainAppSwitch==1){
          wx.showTabBar();
        }else{
          wx.hideTabBar();
        }
      }
    });
  }
})