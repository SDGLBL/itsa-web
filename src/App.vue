<template>
  <div id="app">
    <el-row>
      <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="video_info in videos_info" :key="video_info.video_name" >
        <video-card :url="video_info.video_snapshot_url" :name="video_info.video_name" ></video-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VideoCard from './components/VideoCard.vue'
export default {
  name: 'app',
  data(){
    return{
      videos_info : []
  }
  },

  components: {
    VideoCard
  },

  created(){
    var videos_info_url = "/api/video_list";
    this.$axios.get(videos_info_url).then(res=>{
      this.videos_info = res.data
    })
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
