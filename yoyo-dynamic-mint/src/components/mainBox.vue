<template>
	<div id="mainBox" class="mainBox">
<!--		<p>{{activeTab}}</p>-->
		<div v-for="(item,index) in initList.list" class="mainBox_item">
			
			<mt-cell>
			  <span class="time">{{item.time}}</span>
			  <img slot="icon" :src="item.headImgUrl" class="headerImg">
			  <div slot="title" class="information">
			  	<span>{{item.nickname}}</span><span :class="item.sex == 'male' ?'male':'female'" class="age">{{item.age}}</span>
			  	<p class="signature">{{item.signature}}</p>
			  </div>
			  
			</mt-cell>
			
			<div class="mediaWrap">
				
				<div v-if="item.mediaType == 'picture'" class="media">
					<div v-for="mediaUrl in item.media" class="media_item">
						<img :src="mediaUrl"/>
					</div>
				</div>
				
				<div v-if="item.mediaType == 'video'" class="media">
					<div v-for="mediaUrl in item.media" class="media_item">
						<img :src="mediaUrl"/>
						<img src="../../static/img/video_play_btn.png" class="video_play_btn"/>
					</div>
				</div>
				
			</div>
			
			<mt-cell>
			  <span class="like"><img src="../../static/img/unlike.png"/>{{item.lcount}}</span>
			  <img src="../../static/img/watch_icon.png" slot="icon" class="watch_icon"><span slot='title' class="watch_count">{{item.wcount}}</span>
			  
		    </mt-cell>
		    
		</div>
	</div>
</template>

<!--
	向服务器传参：
	"tab":"newset"--"最新"列表/"attention"--"关注"列表
	"firstLoaded":true--
	"isLiked":true--已经点赞。false--没有点赞
-->

<script>
//	let initList={
//		"code":200,
//		"codeTxt":"success"
//		"list":[{
//			id 此条状态唯一标识
//			headImgUrl 头像
//			nickName 昵称
//			sex 性别
//			age 年龄
//			vip:true/false 是否为vip
//			time 发布时间
//			signature 个性签名
//			wcount 观看人数
//			lcount 点赞人数
//          mediaType:"picture/video",
//			media:[url] 发布的图片/视频 地址
//		}]
//	}
	
	export default {
		name:"mainBox",
		mounted(){
			this.$http.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then(data => {
				console.log(data.body);
				
				this.initList.list = data.body.list.filter(item => {
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
						media:['../../static/img/wx.png','../../static/img/wx.png','../../static/img/wx.png',]
					}
				})
			});
		},
		props:['activeTab'],
		data(){
			return{
				initList:{
					code:"",
					list:[]
				}
			}
		},
		computed:{
			
		},
		methods:{
			
		}
	}
	
</script>

<style lang="less">
	.borderRadius(@borderRadius:100%){
	    border-radius: @borderRadius;
	    -webkit-border-radius: @borderRadius;
	    -moz-border-radius: @borderRadius;
	}
	
	.font(@fontSize,@color){
		font-size: @fontSize;
		color: @color;
	}
	.wh(@width,@height){
		width: @width;
		height: @height;
	}
	.flex-display{
	    display: box;                /* OLD - Android 4.4- */
	    display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
	    display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
	    display: -ms-flexbox;      /* TWEENER - IE 10 */
	    display: -webkit-flex;     /* NEW - Chrome */
	    display: flex;
	}
	.flex-wrap(@wrap:nowrap){
	    /* 09版 */
	    -webkit-box-lines: multiple;
	    /* 12版 */
	    -webkit-flex-wrap: @wrap;
	    -moz-flex-wrap: @wrap;
	    -ms-flex-wrap: @wrap;
	    -o-flex-wrap: @wrap;
	    flex-wrap: @wrap;
	}
	.justify-content(@justify:center){
	    /* 09版 */
	    -webkit-box-pack: @justify;/*(主轴为横轴时使用)*/
	    /* 12版 */
	    -webkit-justify-content: @justify;
	    -moz-justify-content: @justify;
	    -ms-justify-content: @justify;
	    -o-justify-content: @justify;
	    justify-content: @justify;
	}
	.flex{
	    -webkit-box-flex: 1;      /* OLD - iOS 6-, Safari 3.1-6 */
	    -moz-box-flex: 1;         /* OLD - Firefox 19- */
	    -webkit-flex: 1;          /* Chrome */
	    -ms-flex: 1;              /* IE 10 */
	    flex: 1;
	}
	/*==============================*/
	.mint-cell-wrapper{
		padding: 0;
		background-image: none;
		
	}
	.mint-cell{
		border: none;
		min-height: 0;
	}
	.mint-cell:last-child{
		background-image: none;
	}
	.mainBox{
		
	}
	.mainBox_item{
		padding-bottom: 0.6rem;
		padding-left: 0.6rem;
		padding-right: 0.6rem;
		border-bottom: 0.25rem solid #f8f8fc;
	}
	.headerImg{
		float: left;
		.wh(3rem,3rem);
		padding-top: 0.4rem;
		padding-left: 0.25rem;
		padding-right: 0.5rem;
	}
	
	.information{
		float: left;
		.font(0.8rem,#333);
		vertical-align: top;
		padding-top: 0.85rem;
		
		.vip{
			.font(0.5rem,#fff);
			background: #ffcd05;
			padding: 0.15rem 0.2rem;
			
			.borderRadius(2px);
		}
		.age{
			margin: 0 0.4rem;
			.font(0.5rem,#fff);
			padding: 2px 2px;
			padding-left: 0.65rem;
			
		}
		.male{
			background:url(../../static/img/male_icon.png) left center no-repeat #3c76f9;
			background-size: 0.55rem 0.55rem;
		}
		.female{
			background:url(../../static/img/female_icon.png) left center no-repeat #ff3b5e;
			background-size: 0.55rem 0.55rem;
		}
		
	}
	
	.signature{
		.font(0.6rem,#666);
		margin-top: 0.5rem;
		
	}
	.time{
		.font(0.5rem,#666);
		position: absolute;
		right: 0.6rem;
		top: 0.85rem;
	}
	.mediaWrap{
		margin: 0.65rem 0;
	}
	.media{
		.flex-display;
		.flex-wrap(wrap);
		.justify-content(space-between);
		
		.media_item{
			/*.flex;*/
			.wh(5.4rem,5.4rem);
			position: relative;
			padding-bottom: 0.3rem;
			
			.video_play_btn{
				position: absolute;
				top: 0;
				left: 0;
				.wh(2rem,2rem)
			}
		}
		
	}
	
	
	.watch_icon{
		.wh(0.9rem,0.9rem);
	}
	.watch_count{
		.font(0.6rem,#666)
	}
	.like{
		.font(0.6rem,#666);
		
		img{
			.wh(0.9rem,0.9rem);
			margin-top: -4px;
			margin-right: 0.25rem;
		}
	} 
</style>