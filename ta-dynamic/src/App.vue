<template>
	<div id="app">
		<mt-header fixed title="Ta的动态">
			<mt-button slot="left" icon="back" @click="gotoAppBack"></mt-button>
		</mt-header>

		<mt-loadmore ref="loadmore" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @top-status-change="handleTopStatusChange">
			<!--循环体-->
			<div class="cell clear" v-for="(item,index) in dyList.data" :key="index">
				<!--头像，昵称等部分 cell_top-->
				<div class="cell_top clear">
					<div class="headerImg"><img :src="item.photo" v-show="item.photo" /></div>
					<!--头像-->
					<ul class="info">
						<li>
							<span class="nickname">{{item.nickname}}</span>
							<span class="age" :class="item.sex == 'male' ?'male':'female'">{{item.age}}</span>
							<span class="vip" v-show="item.vip != 0">VIP</span>
						</li>
						<li class="signature">{{item.signature}}</li>
					</ul>
					<p class="time">{{item.date}}</p>
				</div>

				<!--发布的 title,picture,video-->
				<div class="cell_center">
					<p class="title">{{item.content}}</p>
					<div v-if="item.type == 1" class="media">
						<div v-for="mediaUrl in item.paths" class="media_item">
							<img :src="mediaUrl" />
						</div>
					</div>

					<div v-if="item.type == 2" class="media">
						<div class="media_item">
							<img :src="item.foreground" />
							<img src="../static/img/video_play_btn.png" class="video_play_btn" />
						</div>
					</div>
				</div>

				<!--观看，点赞-->
				<div class="media_bottom clear">
					<span class="watch"><i class="watch_icon"><img src="../static/img/watch_icon.png"/></i>{{item.audience_count}}</span>
					<span class="favor fr" @click="handelFavor(item.id,index)">
						<img src="../static/img/unlike_icon.png" v-if='item.favor_status === false'/>
						<img src="../static/img/liked_icon.png" v-if='item.favor_status == true'/>
						{{item.favor_count}}
					</span>
				</div>
			</div>
			<!--../static/img/unlike_icon.png-->
			<!--循环体结束-->
			
		</mt-loadmore>
	</div>
</template>

<script>
	const flag = true; //true==开发模式。false==生产模式
	let requestUrl='';
	if(flag){
		requestUrl = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html"
	}else{
		requestUrl = "http://192.168.11.233:8090/api/dynamic/list"
	}

	let dyList = {
		code: 0,
		codemsg: 'success',
		stamp: "",
		nextPage: true,
		data: [{
			id: 0,
			nickname: '',
			photo: '',
			signature: '',
			sex: "male",
			age: 0,
			vip: true,
			date: '',
			content: '',
			type: 1,
			paths: [],
			video: '',
			foreground: '',
			audience_count: 0,
			favor_count: 0,
			favor_status: false, //0-没有点赞。1-已经点赞
		}]
	};
	//================
	const refreshKey = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010'];
	let refreshKeyIndex = 0;
	let refreshValue = "A";

	function getRefreshKey() {
		refreshKeyIndex++;
		if(refreshKeyIndex >= refreshKey.length) {
			refreshKeyIndex = refreshKey.length;
		}
		refreshValue = refreshKey[refreshKeyIndex];
	}
	//===================
	export default {
		name: 'app',
		data() {
			return {
				userid: 1468676853399808, //从app获取，并传参给服务端
				firstLoaded: false,
				allLoaded: false,
				dyList: dyList,
				topStatus: "",
			}
		},
		mounted() {
			//初始化数据，首屏加载
			if(flag) {
				this.getDataList(requestUrl, {
					miss: '01',
					refresh: 'A'
				});

			} else {
				this.getDataList(requestUrl, {
					pagesize: 2,
					stamp: 0,
					userid: 1468676853399808,
					type: 4
				});
			}

		},
		methods: {
			getDataList(ipUrl, params) {
				this.$http({
					method: "jsonp",
					url:ipUrl,
					//data为向服务器传递的参数;data属性的值对method为POST，PUT，DElETE等请求会作为请求体来传送，对于GET，JSONP等方式的请求将会拼接在URL查询参数中
					params:params,
					before: function(req) {
						//请求发送前  添加loading
					},
					responseType: 'json',
					//emulateJSON设置true--将request body以application/x-www-form-urlencoded content type发送
					emulateJSON:true,
					//emulateHTTP设置true--HTTP头信息的X-HTTP-Method-Override属性会设置为实例的HTTP方法
					emulateHTTP:true,
					//表示是否跨域
					crossOrigin:true
				}).then(res => {
					console.log(res)
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
								favor_count: item.imgsrc3gtype,
								favor_status: false, //false-没有点赞。true-已经点赞
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
			},
			addFavor(id) {
				this.$http({
					type: 'post',
					data: {
						dynamicId: id
					},
					url: ""
				}).then(res => {
					console.log(res);

				}).catch(function(error) {
					console.log(error);
				});
			},
			gotoAppBack() {
				console.log("gotoapp");
			},
			loadTop() {
				//刷新
				if(flag) {
					getRefreshKey();
					this.getDataList(requestUrl, {
						miss: '01',
						refresh: refreshValue
					});
					setTimeout(() => {
						this.$refs.loadmore.onTopLoaded();
					}, 500);

					console.log(refreshValue);
				} else {
					this.getDataList(requestUrl, {
						pagesize: 0,
						stamp: '',
						userid: 1468676853399808,
						type: 3
					});
				}

			},
			loadBottom() {
				if(flag) {
					getRefreshKey();
					this.getDataList(requestUrl, {
						miss: '00',
						refresh: refreshValue
					});

					setTimeout(() => {
						this.$refs.loadmore.onBottomLoaded();
					}, 500);
					if(refreshKeyIndex > refreshKey.length){
						this.allLoaded = true;
					}
					
				} else {
					this.getDataList(requestUrl, {
						pagesize: 3,
						stamp: dyList.stamp,
						userid: 1468676853399808,
						type: 3
					});
				}

			},
			handleTopStatusChange(status) {
				//处理 刷新状态的文字
				this.topStatus = status;
			},
			handelFavor(id, index) {
				dyList.data[index].favor_count += 1;
				dyList.data[index].favor_status = true;
				console.log(id);
				//addFavor(id);
			}
		}

	}
</script>

<style lang="less">
	@import url("styles/reset.css");
	@import url("styles/app.less");
</style>