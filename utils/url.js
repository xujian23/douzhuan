// var host = "https://wdz-api-prod.gogoapp.cn";  // 线上地址
var host = "http://wdz-api-dev.gogoapp.cn";
var chconfig ={
  "ch_version": "1.0.2"
}
var url = {
  "_getSessionKey": host+"/api/user/auth/wx",  // 获取sessionKey
  "_saveUserInfo": host+"/api/user/wx?sessionKey=", // 保存用户信息
  "_getRecommendation": host +"/api/app/wx/mini/recommendation?sessionKey=", //获取小程序推荐列表
  "_recordClick": host +"/api/app/wx/mini/", // 记录点击
  "_recordClose": host + "/api/app/wx/mini/", // 记录关闭
  "_getIndexBanners": host + "/api/home/banners?sessionKey=", // 获取首页banners
  "_getUserAccount": host + "/api/user/point/account/summary?sessionKey=", // 获取用户账户信息
  "_getPointRecords": host + "/api/user/point/details?sessionKey=", // 获取积分历史记录
  "_getaccountInfo": host + "/api/user/point/account/withdraw/summary?sessionKey=", // 获取提现账户信息
  "_getMoney": host + "/api/user/point/withdraw?sessionKey=", // 积分提现
  "_cashRecord": host + "/api/user/point/withdraw/details?sessionKey=", // 提现历史记录
  "_invitefriendsInfo": host + "/api/user/invite/home?sessionKey=", // 邀请好友首页
  "_switches": host + "/api/home/switches", // 切换
  "_dzcode": host + "/api/app/wx/mini/", // 通过code获取appid
  "_getrule": host + "/api/user/point/rule?sessionKey=", // 通过code获取appid
}
module.exports._url = url;
module.exports._chconfig = chconfig;
exports._chconfig = chconfig;
exports._url = url;