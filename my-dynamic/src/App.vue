<template>
  <div id="app">
    <mt-header fixed title="我的动态">
    	<mt-button slot="left" icon="back" @click="gotoAppBack"></mt-button>
    	<mt-button slot="right">+</mt-button>
    </mt-header>
    
    <mt-loadmore ref="loadmore" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @top-status-change="handleTopStatusChange">
	    <!--循环体-->
	    <div class="cell clear" v-for="(item,index) in dyList.list">
	    	<!--头像，昵称等部分 cell_top-->
	    	<div class="cell_top clear">
	    		<div class="headerImg"><img :src="item.headImgUrl" v-show="item.headImgUrl"/></div> <!--头像-->
					<ul class="info">
						<li>
							<span class="nickname">{{item.nickname}}</span>
							<span class="age" :class="item.sex == 'male' ?'male':'female'">{{item.age}}</span>
							<span class="vip" v-show="item.isVIP">VIP</span>
						</li>
						<li class="signature">{{item.signature}}</li>
					</ul>
					<p class="time">{{item.time}}</p>
	    	</div>
					
				<!--发布的 title,picture,video-->
				<div class="cell_center">
					<p class="title">{{item.title}}</p>
					<div v-if="item.mediaType == 'picture'" class="media">
						<div v-for="mediaUrl in item.media" class="media_item">
							<img :src="mediaUrl"/>
						</div>
					</div>
					
					<div v-if="item.mediaType == 'video'" class="media">
						<div v-for="mediaUrl in item.media" class="media_item">
							<img :src="mediaUrl"/>
							<img src="../static/video_play_btn.png" class="video_play_btn"/>
						</div>
					</div>
				</div>
					
					<!--观看，删除-->
					<div class="media_bottom clear">
						<span class="watch"><i class="watch_icon"><img src="../static/watch_icon.png"/></i>{{item.wcount}}</span>
						<i class="delete fr" @click="handelDel(index)"><img src="../static/delete_icon.png"/></i>
					</div>
			</div>
			<!--循环体结束-->
			<!--设置下拉显示文字-->
			<div slot="top" class="mint-loadmore-top">
			  <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
			  <span v-show="topStatus === 'loading'">Loading...</span>
			</div>
		</mt-loadmore>
		
		<!--actionsheet组件-->
		<mt-actionsheet
		  :actions="actions"
		  v-model="sheetVisible"
		  cancelText="取消">
		</mt-actionsheet>
  </div>
</template>

<script>
const requestUrl = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html"	
let itemID = 0;
let dyList = {
	list:[]
};
//const page = 0;
//const prepage = 10;
//let start = 0;
//let end = 9;
let resquestList;

const refreshKey = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010'];
let refreshKeyIndex = 0;
let refreshValue = "A";
function getRefreshKey() {
	refreshKeyIndex++;
	if (refreshKeyIndex >= refreshKey.length) {
	    refreshKeyIndex = 0;
	}
	refreshValue = refreshKey[refreshKeyIndex];
}

export default {
  name: 'app',
  data(){
  	return{
  		firstLoaded:false,
  		allLoaded:false,
  		dyList:dyList,
  		stamp:"A",
  		nextPage:true,
  		topStatus:"",
  		sheetVisible:false,
  		actions:[
	  		{
	  			name:"是否删除",
	  			method:function(id){
  					dyList.list.splice(id,1);
	  				
	  				console.log(itemID)
	  			}
	  		}
  		]
  	}
  },
  mounted(){
  	//初始化数据，首屏加载
  	this.getDataList(requestUrl,{});
		
		
  },
  methods:{
  	getDataList(url,params){
  		this.$http.jsonp(url,{
			 //向服务器传递的数据
  			params:params
  		}).then(res => {
  			//获取的数据
					let resquestList = res.body.list.filter(item => {
						return item.addata == null 
					}).map(item => {
							return {
								headImgUrl:item.picInfo[0].url,
								nickname:item.source,
								sex:"male",
								age:"22",
								isVIP:true,
								signature:item.title,
								time:item.ptime,
								title:item.digest,
								wcount:item.tcount,
								lcount:item.imgsrc3gtype,
								mediaType:"picture",
								media:['../../static/wx.png','../../static/wx.png','../../static/wx.png']
							}
					});

				if(params.miss == '01'){
					dyList.list = resquestList;
				}else{
					dyList.list = dyList.list.concat(resquestList);
				}
			}).then(err => {
				
			});
  	},
  	gotoAppBack(){
  		console.log("gotoapp")
	  	
  	},
  	loadTop(){
  		getRefreshKey();
  		this.getDataList(requestUrl,{miss:'01',refresh:refreshValue});

  		setTimeout(() => {
  			this.$refs.loadmore.onTopLoaded();
  		},500);
  		
			
			console.log(refreshValue);
  	},
  	loadBottom(){
//		http://3g.163.com/touch/jsonp/sy/recommend/"+start+"-"+end+".html
      getRefreshKey();
      this.getDataList(requestUrl,{miss:'00',refresh:refreshValue});
      
			setTimeout(() => {
  			this.$refs.loadmore.onBottomLoaded();
  		},500);
			
		},
  	handleTopStatusChange(status){
  		this.topStatus = status;
  	},
  	handelDel(index){
  		this.sheetVisible = true;
  		itemID = index;
  		//console.log(index)
  	}
  }
  
}
</script>

<style lang="less">
	
@import url("styles/reset.css");
@import url("styles/app.less");

</style>
