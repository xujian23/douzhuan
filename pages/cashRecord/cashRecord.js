// pages/cashRecord/cashRecord.js
var gblData = getApp().globalData;
var url = require("../../utils/url.js")._url;
var _cashRecord = url._cashRecord;   // 提现历史记录
var self;
Page({
  data: {
    shoplist:[],
    lookmoreFade: false,
    recordsBox:false,
  },
  onLoad: function (options) {
    console.log(options);
    self = this;
    var getSessionKey = setInterval(function () {
      if (gblData.sessionKey != null) {
        self.setData({
          shoplist: [],
          options: options
        });
        self._cashRecord(options);
        clearInterval(getSessionKey);
      }
    }, 100);
  },
  _cashRecord: function (options) {   // 提现历史记录
    let form_id = options.form_id;
    if (options.form_id) {
      console.log(options.form_id);
      let iFUrl = _cashRecord + gblData.sessionKey + gblData.systemInfo + "&form_id=" + form_id + "&pageNum=1&pageSize=100";
      requestInfo(iFUrl);
    } else {
      let iFUrl = _cashRecord + gblData.sessionKey + gblData.systemInfo + "&pageNum=1&pageSize=100";
      requestInfo(iFUrl);
      console.log("无form_id");
    }
    function requestInfo(iFUrl){
      wx.request({
        url: iFUrl,
        method: "GET",
        success: function (res) {
          console.log(res);
          let _shoplist = res.data.data.list;
          for (var i = 0; i < _shoplist.length; i++) {
            if (i < 3) {
              self.data.shoplist.push(_shoplist[i]);
              self.setData({
                shoplist: self.data.shoplist
              });
            }
          }
          if (_shoplist.length > 3) {
            self.setData({
              lookmoreFade: true
            });
          };
          if (_shoplist.length > 0) {
            self.setData({
              recordsBox: true
            });
          };
        }, fail: function (fail) {
          console.log(fail);
        }
      })
    }

    
  },
  lookmore: function (options) {
      self.setData({
        lookmoreFade: false,
      });
      wx.request({
        url: _cashRecord + gblData.sessionKey + gblData.systemInfo + "&pageNum=1&pageSize=100",
        method: "GET",
        success: function (res) {
          var shoplist = res.data.data.list;
          self.setData({
            shoplist: shoplist
          });
        }, fail: function (fail) {
          console.log(fail);
        }
      })
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    // console.log("enablePullDownRefresh");
    self.onLoad(this.data.options);
    wx.stopPullDownRefresh();
  },
})