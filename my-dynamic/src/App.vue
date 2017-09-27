<!--我的动态-->
<template>
	<div id="app">
		<mt-header fixed title="我的动态">
			<mt-button slot="left" icon="back" @click="gotoAppBack"></mt-button>
			<mt-button slot="right" @click="addSheetVisible = true">+</mt-button>
		</mt-header>
		
		<div :style="{'-webkit-overflow-scrolling': scrollMode}" style="margin-top: 2.4rem;">
			<p class="loading" v-show="isLoading">加载中...</p>
			<mt-loadmore ref="loadmore" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" auto-fill="false" bottom-pull-text="加载更多">
				<!--循环体-->
				<div class="cell clear" v-for="(item,index) in dyList.data" :key="index">
					<!--头像，昵称等部分 cell_top-->
					<div class="cell_top clear">
						<div class="headerImg"><img :src="item.photo" v-show="item.photo" /></div>
						<!--头像-->
						<ul class="info">
							<li>
								<span class="nickname">{{item.nickname | formatenickname}}</span>
								<span class="age" :class="item.sex == 'male' ?'male':'female'">{{item.age}}</span>
								<span class="vip" v-show="item.vip">VIP</span>
							</li>
							<li class="signature">{{item.signature}}</li>
						</ul>
						<p class="time">{{item.date}}</p>
					</div>

					<!--发布的 title,picture,video-->
					<div class="cell_center">
						<p class="title">{{item.content}}</p>
						<div v-if="item.type == 1" class="media">
							<div v-for="(mediaUrl,index) in item.paths" class="media_item" @click='appshowImg(item.paths,item.id,index)'>
								<img :src="mediaUrl" />
							</div>
						</div>

						<div v-if="item.type == 2" class="media">
							<div class="media_item" @click="appshowVideo(item.video,item.id)">
								<img :src="item.foreground" />
								<img src="../static/img/video_play_btn.png" class="video_play_btn" />
							</div>
						</div>
					</div>

					<!--观看，删除-->
					<div class="media_bottom clear">
						<span class="watch"><i class="watch_icon"><img src="../static/img/watch_icon.png"/></i>{{item.audience_count}}</span>
						<i class="delete fr" @click="deleteBtn(index,item.id)"><img src="../static/img/delete_icon.png"/></i>
					</div>
				</div>
				<!--循环体结束-->
			</mt-loadmore>
			<p class="noMoreLine" v-if='dyList.data.length != 0 && this.allLoaded'>我是有底线的</p>
			<!--请求成功 且 没有数据时 显示“没有动态”-->
			<div  v-if="dyList.data.length <= 0 && this.isLoading == false">
				<div class="noRecord">
					<img src="../static/img/no_dynamic.png" />
					<p>没有动态</p>
				</div>
			</div>
		</div>
		<!--删除动态组件-->
		<mt-actionsheet :actions="delActions" v-model="delSheetVisible" cancelText="取消">
		</mt-actionsheet>
		<!--添加动态组件-->
		<mt-actionsheet :actions="addActions" v-model="addSheetVisible" cancelText="取消">
		</mt-actionsheet>
	</div>
</template>

<script>
	var requestUrl = "list";
	var addaudienceRequestUrl = 'addaudience';
	var deleteRequestUrl = 'delete';
	var dyList = {
		code: 0,
		codemsg: '',
		stamp: 0,
		nextPage: true,
		data: []
	};
	var itemIndex = 0;
	var itemId = 0;
	var ua = navigator.userAgent.toLowerCase();
	var mobileType = '';
	
	//从安卓端获取用户信息
	function updateUserInfo(str) {
		var res = JSON.parse(str);
		var res_userInfo = JSON.parse(res.userinfo);
	}
	//测试
//	function setColor(color){
//		alert('调用了');
//		var obj = document.getElementById("test");
//		obj.style.backgroundColor  = color;
//	}
	//5、安卓端 用户“返回” 传更改信息给客户端
	var timeInMs = Date.now();
	function requestGoBack() {
		window.target.setResultData("用户请求回退，并更新数据"+timeInMs);
		window.target.action(1);
	}
	
	
	//分辨设备
	function phoneType() {
		if(/android (\d+\.\d+)/.test(ua)) {
			return "andorid";
		} else if(ua.indexOf('iphone') > -1) {
			return "iphone";
		} else {
			return "其他设备";
		}
	};
	mobileType = phoneType();

	export default {
		name: 'app',
		data() {
			return {
				isLoading: false,
				allLoaded: false,
				dyList: dyList,
				scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
				delSheetVisible: false,
				delActions: [{
					name: "确认删除",
					method: this.deleteDataListHttp  //发送服务端请求
				}],
				addSheetVisible: false,
				addActions: [{
						name: "图片动态",
						method: function() {
							if(mobileType == 'andorid') {
								window.target.gotoAppPage('DynamicPublishFragment','{"strValue1":0}');
							} else if(mobileType == 'iphone') {
								window.webkit.messageHandlers.issueMoment.postMessage(1);
							}
						}
					},
					{
						name: "视频动态",
						method: function() {
							if(mobileType == 'andorid') {
								window.target.gotoAppPage('DynamicPublishFragment','{"strValue1":1}');
							} else if(mobileType == 'iphone') {
								window.webkit.messageHandlers.issueMoment.postMessage(2);
							}
						}
					}
				],
			}
		},
		mounted() {
			//初始化加载数据
			this.getDataList(requestUrl, {
				pagesize: 0,
				stamp: 0,
				type: 4
			});

		},
		filters:{
			//格式化昵称 第一个**最后一个
			formatenickname(nickname){
				var nickname_len = nickname.length;
				var newNickname = '';
				var firstName = '';
				var lastName = '';
				if(nickname_len > 4){
					firstName = nickname.substring(0,1);
					lastName = nickname.substr(nickname_len-1,1);
					newNickname = firstName + '**' + lastName;
				}else{
					newNickname = nickname;
				}
				return newNickname;
			}
		},
		methods: {
			getDataList(ipUrl, params) {
				this.$http({
					method: "post",
					url: ipUrl,
					body: params,
					headers: {
						'header-encrypt-code' : httpHeader
					},
					before: function(xhr) {
						//请求发送前  添加loading
						this.isLoading = true
					},
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					this.isLoading = false;
					dyList.stamp = res.body.stamp;
					dyList.nextPage = res.body.nextPage;
					//如果是初始化加载/刷新 res.body.data直接覆盖dyList.data 否则拼接
					if(params.stamp == 0) {
						dyList.data = res.body.data;
					} else if(params.stamp != 0) {
						dyList.data = dyList.data.concat(res.body.data);
					}

					if(res.body.nextPage == false) {
						this.allLoaded = true;
					}

					this.$nextTick(function() {
						// 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，  
						// 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，  
						// 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好  
						this.scrollMode = "touch";
					});
					alert(res.body.nextPage);
				}).catch(function(error) {
					console.log(error);
				});
			},
			watchCountHttp(ipUrl, params) {
				this.$http({
					method: 'post',
					body: params,
					url: ipUrl,
					headers: {
						'header-encrypt-code': httpHeader
					},
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					console.log(res);

				}).catch(function(error) {
					console.log("错误：" + error);
				});
			},
			deleteDataListHttp() {
				this.$http({
					method: 'post',
					body: {
						'dynamicId': itemId
					},
					url: deleteRequestUrl,
					headers: {
						'header-encrypt-code': httpHeader
					},
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					console.log(res);

				}).catch(function(error) {
					console.log(error);
				});

				dyList.data.splice(itemIndex, 1);
			},
			loadTop() {
				this.isLoading = false;//禁止额外"加载中"字样
				//组件刷新动作
				this.getDataList(requestUrl, {
					pagesize: 0,
					stamp: 0,
					type: 4
				});

				setTimeout(() => {
					// 固定方法，查询完要调用一次，用于重新定位
					this.$refs.loadmore.onTopLoaded();
				}, 500);

			},
			loadBottom() {
				//下拉加载更多
				this.getDataList(requestUrl, {
					pagesize: 0,
					stamp: dyList.stamp,
					type: 4
				});

				setTimeout(() => {
					this.$refs.loadmore.onBottomLoaded();
				}, 500);

			},
			deleteBtn(index, id) {
				this.delSheetVisible = true;
				itemIndex = index;
				itemId = id;
			},
			gotoAppBack() {
				if(mobileType == 'andorid') {
					requestGoBack();
				} else if(mobileType == 'iphone') {
					window.webkit.messageHandlers.backPage.postMessage(0);
				}
			},
			appshowImg(imgArr, id, index) {
				//请求 "观看数增加"接口
				alert('查看图片,' + typeof imgArr + "," + imgArr);
				
				this.watchCountHttp(addaudienceRequestUrl, {
					'dynamicId': id
				});
				
//					{
//						'imageArray': ["http://pic35.nipic.com/20131104/12954233_100827450197_2.jpg",
//										"http://pic35.nipic.com/20131104/12954233_100827450197_2.jpg",
//										"http://www.taopic.com/uploads/allimg/140326/235113-1403260G01561.jpg"
//									  ],
//						'index': 2
//					};
				var NumIndex = Number(index);
				var imgListWebKit = {
					'imageArray': imgArr,
					'index':NumIndex
				};

				var imgListAndroid = {
					"strValue1": index,
					"strValue2": imgArr
				}

				if(mobileType == 'andorid') {
					window.target.gotoAppPage('GalleryDialog', JSON.stringify(imgListAndroid));
				} else if(mobileType == 'iphone') {
					window.webkit.messageHandlers.showImages.postMessage(imgListWebKit);
				}

			},
			appshowVideo(video, id) {
				alert('观看视频,' + typeof video + "," + video);
				//请求 "观看数增加"接口
				this.watchCountHttp(addaudienceRequestUrl, {
					'dynamicId': id
				});

				var videoWebkit = {
					"videoUrl": video
				}
				var videoAndroid = {
					"strValue1": video
				}

				if(mobileType == 'andorid') {
					window.target.gotoAppPage('VideoPlayDlg', JSON.stringify(videoAndroid));
				} else if(mobileType == 'iphone') {
					window.webkit.messageHandlers.showVideo.postMessage(videoWebkit);
				}
			},
			gotoTest(){
				alert("跳转");
				window.target.gotoAppPage('WebSingleSaveFragment','{"strValue1":"http://192.168.20.31:20000/shark-miai-service/api/dynamic/test"}');
			}
		}

	}
</script>

<style lang="less">
	@import url("styles/reset.css");
	@import url("styles/app.less");
</style>