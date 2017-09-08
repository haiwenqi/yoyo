<template>
  <div id="app">
    <el-row>
    	<el-col :span="24">
    		 <el-tabs v-model="topTab" >
					  <el-tab-pane label="关注" name="attention" :span="12">关注</el-tab-pane>
						<el-tab-pane label="最新" name="newest">最新</el-tab-pane>
					</el-tabs>
    	</el-col>
		</el-row>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
  	return {
  		topTab:"newest"
  	}
  }
}
</script>

<style>
 @import url("style/reset.css");
 
.el-tabs__nav{
	margin-left: 6rem;
	
}
</style>
