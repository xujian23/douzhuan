// pages/投诉页面/投诉页面.js
var self;
var comselected = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    complaintArr: [
      {
        c_text: "色情",
        rightIcon: "",
      },
      {
        c_text: "诱导",
        rightIcon: "",
      },
      {
        c_text: "欺诈",
        rightIcon: "",
      },
      {
        c_text: "其他",
        rightIcon: "",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
  },
  comSelceted: function (event) {
    var curIndex = event.currentTarget.dataset.index;
    comselected = curIndex;
    console.log(curIndex);
    for (var i = 0; i < this.data.complaintArr.length; i++) {
      if (curIndex == i) {
        this.data.complaintArr[i].rightIcon = "../images/right.png";
        self.setData({
          complaintArr: self.data.complaintArr
        });
      } else {
        this.data.complaintArr[i].rightIcon = "";
        self.setData({
          complaintArr: self.data.complaintArr
        });
      }

    }
  },
  primary: function () {
    if (comselected == null) {
      wx.showToast({
        title: '请选择投诉原因',
      })
    } else {
      wx.navigateTo({
        url: '../tips/tips?type=1'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    comselected = null;
  },

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