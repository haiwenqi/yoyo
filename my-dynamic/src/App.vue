<template>
	<div id="app">
		<mt-header fixed title="我的动态">
			<mt-button slot="left" icon="back" @click="gotoAppBack"></mt-button>
			<mt-button slot="right" @click="addSheetVisible = true">+</mt-button>
		</mt-header>

		<div :style="{'-webkit-overflow-scrolling': scrollMode}">
			<mt-loadmore ref="loadmore" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @top-status-change="handleTopStatusChange" auto-fill="false" bottom-pull-text="加载更多">
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
							<div v-for="mediaUrl in item.paths" class="media_item" @click='appshowImg(item.paths,item.id)'>
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
	let requestUrl = "list";
	let addaudienceRequestUrl = 'addaudience';
	let deleteRequestUrl = 'delete';
	let dyList = {
		code: 0,
		codemsg: 'success',
		stamp: 0,
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
			video: "",
			foreground: '',
			audience_count: 0
		}]
	};
	let itemIndex = 0;
	let itemId = 0;
	let userid = 1468676853399808;
	var ua = navigator.userAgent.toLowerCase();
	var mobileType = '';
	//=======================================

	//与安卓端接口
	//1、页面返回
	function gotoAppBackAndriod() {
		window.target.action(1); //返回
	}
	//2、发布动态 mode 0 图片； 1 视频
	function dynamicPublishAndriod(mode) {
		window.target.DynamicPublicFragment(userid, mode);
	}
	//3、跳转到个人主页
	function gotoHomePageAndriod(mode) {
		window.target.HomepageFragment(userid);
	}

	//与安卓端接口结束
	//======================================
	//与ios客户端接口

	//1、页面返回
	function gotoAppBackWebkit() {
		window.webkit.messageHandlers.backPage.postMessage(0);
	}

	//2、查看图片
	function showImagesWebkit() {
		window.webkit.messageHandlers.showImages.postMessage({
			'imageArray': dyList.paths
		});
	}

	//3、观看视频
	function showVideoWebkit() {
		window.webkit.messageHandlers.showVideo.postMessage({
			'videoUrl': dyList.video
		});
	}
	//4、發佈動態　mode 1 圖片；2視頻
	function dynamicPublishAndriod(mode) {
		window.webkit.messageHandlers.issueMoment.postMessage(mode);
	}
	//与ios客户端接口结束

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
				allLoaded: false,
				dyList: dyList,
				topStatus: "",
				scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
				delSheetVisible: false,
				delActions: [{
					name: "确认删除",
					method: this.deleteDataListHttp
				}],
				addSheetVisible: false,
				addActions: [{
						name: "图片动态",
						method: function() {
							if(mobileType == 'andorid') {
								window.target.DynamicPublicFragment(userid, 0);
							} else if(mobileType == 'iphone') {
								window.webkit.messageHandlers.issueMoment.postMessage(1);
							}
						}
					},
					{
						name: "视频动态",
						method: function() {
							if(mobileType == 'andorid') {
								window.target.DynamicPublicFragment(userid, 1);
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
				pagesize: 2,
				stamp: 0,
				userid: userid,
				type: 4
			});

		},
		methods: {
			getDataList(ipUrl, params) {
				this.$http({
					method: "post",
					url: ipUrl,
					body: params,
					before: function(req) {
						//请求发送前  添加loading

					},
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					console.log(res);

					dyList.stamp = res.body.stamp;
					dyList.nextPage = res.body.nextPage;
					//如果是初始化加载/刷新 res.body.data直接覆盖dyList.data 否则拼接
					if(params.stamp == 0) {
						dyList.data = res.body.data;
					} else if(params.stamp != 0) {
						dyList.data = dyList.data.concat(res.body.data);
					}

					if(!res.body.nextPage) {
						this.allLoaded = true;
					}

					this.$nextTick(function() {
						// 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，  
						// 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，  
						// 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好  
						this.scrollMode = "touch";
					});

				}).catch(function(error) {
					console.log(error);
				});
			},
			watchCountHttp(ipUrl, params) {
				console.log('查看');
				this.$http({
					method: 'post',
					body: params,
					url: ipUrl,
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					console.log(res);

				}).catch(function(error) {
					console.log("错误："+error);
				});
			},
			loadTop() {
				//组件刷新动作
				this.getDataList(requestUrl, {
					pagesize: 2,
					stamp: 0,
					userid: userid,
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
					pagesize: 2,
					stamp: dyList.stamp,
					userid: userid,
					type: 4
				});

				setTimeout(() => {
					this.$refs.loadmore.onBottomLoaded();
				}, 500);

			},
			deleteBtn(index,id) {
				this.delSheetVisible = true;
				itemIndex = index;
				itemId = id;
			},
			gotoAppBack() {
				if(mobileType == 'andorid') {
					window.target.action(1);
				} else if(mobileType == 'iphone') {
					window.webkit.messageHandlers.backPage.postMessage(0);
				}
			},
			appshowImg(img,id) {
				//请求 "观看数增加"接口
//				this.watchCountHttp(addaudienceRequestUrl, {
//					'dynamicId': id
//				});
//				var dic = {
//						'imageArray': ["http://pic35.nipic.com/20131104/12954233_100827450197_2.jpg",
//										"http://pic35.nipic.com/20131104/12954233_100827450197_2.jpg",
//										"http://www.taopic.com/uploads/allimg/140326/235113-1403260G01561.jpg"
//										]
//					};

				var imgList = img;
				console.log(typeof imgList +":" + imgList);//["/path/test/1562.png", "/path/test/8956.png", __ob__: Eo]
				
				var dic = {
						'imageArray': imgList
					};
			    
				if(mobileType == 'andorid') {

				} else if(mobileType == 'iphone') {
					alert("查看图片");
					window.webkit.messageHandlers.showImages.postMessage(dic);
				}
				
			},
			appshowVideo(video,id) {
				//请求 "观看数增加"接口
//				this.watchCountHttp(addaudienceRequestUrl, {
//					'dynamicId': id
//				});
				var videoUrl = video;
				
				console.log(typeof videoUrl +":" + videoUrl); //  /path/test/8956.png
				
				var dic2 = {"videoUrl": videoUrl}
				
				if(mobileType == 'andorid') {

				} else if(mobileType == 'iphone') {
					alert("查看视频");
					window.webkit.messageHandlers.showVideo.postMessage(dic2);
				}
			},
			deleteDataListHttp() {
				console.log('删除');
				this.$http({
					method: 'post',
					body: {
						'dynamicId': itemId
					},
					url: deleteRequestUrl,
					responseType: 'json',
					emulateJSON: false
				}).then(res => {
					console.log(res);
		
				}).catch(function(error) {
					console.log(error);
				});
				
				dyList.data.splice(itemIndex, 1);
			}
		}

	}
</script>

<style lang="less">
	@import url("styles/reset.css");
	@import url("styles/app.less");
</style>