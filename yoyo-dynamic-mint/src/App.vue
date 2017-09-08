<template>
  <div id="app">
    
		<mt-navbar v-model="activeTab" fixed>
		  <mt-tab-item id="attention"><router-link to="/dyList/attention">关注</router-link></mt-tab-item>
		  <mt-tab-item id="newest"><router-link to="/dyList/newest">最新</router-link></mt-tab-item>
		  <mt-button class="addBtn" plain @click="sheetVisible=true"></mt-button>
		</mt-navbar>
		
		
		
   	<mt-tab-container v-model="activeTab" swipeable>
   		
   		<mt-tab-container-item :id="activeTab">
	   		<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" @top-status-change="handleTopStatusChange">
	   				{{activeTab}}
	   				<router-view></router-view>
	   			  
	   		</mt-loadmore>
		  </mt-tab-container-item>
		  
		  <!--<mt-tab-container-item id="newest">
		    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadComponent" @top-status-change="handleTopStatusChange">
   				{{activeTab}}
   				<router-view></router-view>
   				
   				<div slot="top" class="mint-loadmore-top">
			      <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
			      <span v-show="topStatus === 'loading'">Loading...</span>
			    </div>
			    
	   		</mt-loadmore>
		  </mt-tab-container-item>-->
		  
		</mt-tab-container>
		
		<mt-actionsheet
		  :actions="actions"
		  v-model="sheetVisible">
		</mt-actionsheet>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
  	return{
  		"activeTab":"newest",
  		"allLoaded":false,
  		"topStatus":"",
  		"sheetVisible":false,
  		"actions":[{
  			"name":"图片",
  			"method":function(){console.log("图片")}
  		},{
  			"name":"视频",
  			"method":function(){console.log("视频")}
  		}]
  		
  	}
  },
  methods:{
  	loadTop(){
  	 this.$http.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html',{
  	 	  miss: '00',
        refresh: 'B03'
  	 	 
  	 }).then(data => {
				this.dyList.list = data.body.list.filter(item => {
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
						media:['../../static/wx.png','../../static/wx.png','../../static/wx.png','../../static/wx.png',]
					}
				})
			});
  	},
  	loadBottom(){
  	 console.log("loadBottom")
  	},
  	
  	handleTopStatusChange(status){
  		this.topStatus = status;
  	}
  },
  created(){
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
	
	body{
	
	}
	.mint-navbar{
		width: 100%;
		background: #ff2b5e;
		color: #fff;
		height: 2.4rem;
		display: block !important;
		
		.mint-tab-item{
			padding-top:0.75rem;
			padding-bottom:0.25rem;
			width: 1.7rem;
			float: left;
			
			
			&:nth-child(1){
				margin-left: 7.2rem;
				margin-right: 0.625rem;
			}
			&:nth-child(2){
				margin-left: 0.625rem;
			}
			
			.mint-tab-item-label{
				font-size: 16px;
			}
		}
		
		.mint-tab-item.is-selected{
			color: #fff;
			border-bottom:0.1rem solid #fff;
			margin-bottom: 0;
		}
	}
	
	.mint-button{
		position: absolute;
		top:0;
		right:0.6rem;
		border-radius: 0;
		height:2.4rem;
		line-height: 2.4rem;
		&::after{
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
	
	
	.mint-tab-container{
		margin-top:2.4rem;
		/*padding: 0 0.6rem;*/
	}
	.mint-cell{
		border-bottom: 1px solid #eee;
	}
</style>
