<template>
	<div id="app">
		<mt-header fixed title="动态">
			<mt-button slot="right" @click="addSheetVisible = true">+</mt-button>
		</mt-header>
		
		<mt-navbar v-model="activeTab" fixed>
			<mt-tab-item id="attention">关注</mt-tab-item>
			<mt-tab-item id="newest">最新</mt-tab-item>
		</mt-navbar>
		
		<mt-tab-container v-model="activeTab">

			<mt-tab-container-item id="attention">
				<MainBoxAttention :activeTab.sync="activeTab"></MainBoxAttention>
			</mt-tab-container-item>

			<mt-tab-container-item id="newest">
				<MainBoxNewest :activeTab.sync="activeTab"></MainBoxNewest>
			</mt-tab-container-item>

		</mt-tab-container>

		<mt-actionsheet :actions="addActions" v-model="addSheetVisible">
		</mt-actionsheet>
	</div>
</template>

<script>
	var ua = navigator.userAgent.toLowerCase();
	var mobileType = '';
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
	

	//从安卓端获取用户信息
	function updateUserInfo(str) {
		var res = JSON.parse(str);
		var res_userInfo = JSON.parse(res.userinfo);
	}
	
	//5、用户“返回” 传更改信息给客户端
	var timeInMs = Date.now();
	function requestGoBack() {
		window.target.setResultData("用户请求回退，并更新数据"+timeInMs);
		window.target.action(1);
	}
	
	import MainBoxNewest from './components/MainBoxNewest'
	import MainBoxAttention from './components/MainBoxAttention'
	
	export default {
		name: 'app',
		data() {
			return {
				activeTab: "newest",
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
		components: {
			MainBoxNewest,
			MainBoxAttention
		},
		mounted(){
			
		},
		methods: {
			gotoTest(){
				alert("跳转");
				window.target.gotoAppPage('WebSingleSaveFragment','{"strValue1":"http://192.168.20.31:20000/shark-miai-service/api/dynamic/test"}');
			}
			
		},

	}
</script>

<style lang="less">
	@import url("styles/reset.css");
	@import url("styles/app.less");
</style>