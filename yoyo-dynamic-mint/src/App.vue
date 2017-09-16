<template>
	<div id="app">
		<mt-header fixed title="动态">
			<mt-button slot="left" icon="back" @click="gotoAppBack"></mt-button>
			<mt-button slot="right" @click="addSheetVisible = true">+</mt-button>
		</mt-header>

		<mt-navbar v-model="activeTab" fixed>
			<mt-tab-item id="attention">关注</mt-tab-item>
			<mt-tab-item id="newest">最新</mt-tab-item>
			<mt-button class="addBtn" plain @click="sheetVisible=true"></mt-button>
		</mt-navbar>

		<mt-tab-container v-model="activeTab" swipeable>

			<mt-tab-container-item id="attention">
				<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" @top-status-change="handleTopStatusChange">

					<MainBox :activeTab="activeTab"></MainBox>

				</mt-loadmore>
			</mt-tab-container-item>

			<mt-tab-container-item id="newest">
				<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadComponent" @top-status-change="handleTopStatusChange">

					<MainBox :activeTab="activeTab"></MainBox>

					<div slot="top" class="mint-loadmore-top">
						<span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
						<span v-show="topStatus === 'loading'">Loading...</span>
					</div>

				</mt-loadmore>
			</mt-tab-container-item>

		</mt-tab-container>

		<mt-actionsheet :actions="actions" v-model="sheetVisible">
		</mt-actionsheet>
	</div>
</template>

<script>
	import MainBox from './components/mainBox'
	export default {
		name: 'app',
		data() {
			return {
				activeTab: "newest",
				firstLoad:true,
				allLoaded: false,
				topStatus: "",
				addSheetVisible: false,
				addActions: [{
						name: "图片动态",
						method: function() {
							console.log("图片动态");
						}
					},
					{
						name: "视频动态",
						method: function() {
							console.log("视频动态");
						}
					}
				],

			}
		},
		components: {
			MainBox
		},
		methods: {
			loadTop() {
				this.$http.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html', {
					miss: '00',
					refresh: 'B03'

				}).then(data => {
					let dyList = data.body.list.filter(item => {
						return item.addata == null
					}).map(item => {
						return {
							headImgUrl: item.picInfo[0].url,
							nickname: item.source,
							sex: "male",
							age: "22",
							vip: false,
							signature: item.title,
							time: item.ptime,
							title: item.digest,
							wcount: item.tcount,
							lcount: item.imgsrc3gtype,
							mediaType: "picture",
							media: ['../../static/wx.png', '../../static/wx.png', '../../static/wx.png', '../../static/wx.png', ]
						}
					});

					console.log(dyList)
				});
			},
			loadBottom() {
				console.log("loadBottom")
			},

			handleTopStatusChange(status) {
				this.topStatus = status;
			},
			gotoAppBack(){
				console.log()
			}
		},
		created() {
			//	 this.$http.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then(response => {
			//		    // success callback
			//		    console.log(response.body)
			//		    
			//		 }, response => {
			//		    // error callback
			//		 });
		}
	}
</script>

<style lang="less">
	@import url("styles/reset.css");
	body {}
	
	.mint-navbar {
		background: #fff;
		color: #333;
		height: 2.4rem;
		.mint-tab-item {
			padding: 0;
			.mint-tab-item-label {
				font-size: 16px;
				line-height: 2.4rem;
				a {
					color: #333;
				}
			}
		}
		.mint-tab-item.is-selected {
			border-bottom: 0.1rem solid #FF3B5E;
			margin-bottom: 0;
			a {
				color: #333;
			}
		}
	}
	
	.mint-button {
		position: absolute;
		top: 0;
		right: 0.6rem;
		border-radius: 0;
		height: 2.4rem;
		line-height: 2.4rem;
		&::after {
			content: "+";
			font-size: 1.2rem;
			color: #fff;
			opacity: 1;
			background: transparent;
		}
	}
	
	.mint-button--default.is-plain {
		border: none;
	}
	
	.mint-tab-container {
		margin-top: 2.4rem;
		/*padding: 0 0.6rem;*/
	}
	
	.mint-cell {
		border-bottom: 1px solid #eee;
	}
</style>