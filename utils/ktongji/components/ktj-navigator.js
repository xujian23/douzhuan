Component({
  properties: {
    appId: String,
    path: String,
    version: String,
    extraData: Object,
  },
  ready(){
    const app = getApp();
    let path = app.ktongji.appendUserIdToPath(this.data["path"]);
    this.setData({
      path
    });
  },
  methods: {
    handleTap: function (e) {
      const app = getApp();
      let payload = this.data;
      let pathParams = app.ktongji.extractParams(this.data["path"]);
      if(pathParams["openid"])  {
        payload["openId"] = pathParams["openid"]
      }
      app.ktongji.trackNavigateToMiniProgram(payload);
      this.triggerEvent('click', payload, {});
    },
  }
})
