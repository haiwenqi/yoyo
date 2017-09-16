function getDataList(ipUrl, params) {
	this.$http({
		method: "jsonp",
		url: ipUrl,
		//data为向服务器传递的参数;data属性的值对method为POST，PUT，DElETE等请求会作为请求体来传送，对于GET，JSONP等方式的请求将会拼接在URL查询参数中
		params: params,
		before: function(req) {
			//请求发送前  添加loading
		},
		responseType: 'json',
		//emulateJSON设置true--将request body以application/x-www-form-urlencoded content type发送
		//emulateJSON:true,
		//emulateHTTP设置true--HTTP头信息的X-HTTP-Method-Override属性会设置为实例的HTTP方法
		//emulateHTTP:true,
		//表示是否跨域
		//crossOrigin:true
	}).then(res => {
		//获取的数据
		let requestData = [];
		if(flag) {
			//开发模式
			requestData = res.body.list.filter(item => {
				return item.addata == null
			}).map(item => {
				return {
					id: item.docid,
					nickname: item.category,
					photo: item.picInfo[0].url,
					signature: item.title,
					sex: "male",
					age: "18",
					vip: true,
					date: item.ptime,
					content: item.digest,
					type: 1,
					paths: ['../static/img/wx.png', '../static/img/wx.png', '../static/img/wx.png', '../static/img/wx.png'],
					video: '',
					foreground: '../static/img/wx.png',
					audience_count: item.tcount,
					//favor_count:item.imgsrc3gtype,

				}
			});
			dyList.stamp = "A";
			dyList.nextPage = true;

		} else {
			requestData = res.body.data;
			//获取stamp 并存储到本地this.stamp中
			dyList.stamp = res.body.stamp;
			dyList.nextPage = res.body.nextPage;
		}

		//如果初次加载 、刷新 用 requestData 替换dyList.data;否则 与dyList.data拼接
		if(params.miss == "01" || params.stamp == '') {
			dyList.data = requestData;
		} else {
			dyList.data = dyList.data.concat(requestData);
		}
	}).catch(function(error) {
		console.log(error);
	});
}