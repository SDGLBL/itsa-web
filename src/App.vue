<template>
  <div id="app">
    <el-row>
      <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="(video_info,index) in videos_info" :key="index" >
        <video-card :url="video_info.video_snapshot_url" :name="video_info.video_name" ></video-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="(task_info,index) in tasks_info" :key="index">
        <task-card :url="task_info.task_snapshot_url" :name="task_info.task_name" ></task-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VideoCard from './components/VideoCard.vue'
import TaskCard from './components/TaskCard.vue'
export default {
  name: 'app',
  data(){
    return{
      videos_info : [],
      tasks_info : []
  }
  },

  components: {
    VideoCard,
    TaskCard
  },

  created(){
    // 获取所有可以处理的视频
    var videos_info_url = "/api/video/video_list";
    this.$axios.get(videos_info_url).then(res=>{
      this.videos_info = res.data
    })
    //获取所有的task
    var tasks_info_url = "/api/task/task_list";
    this.$axios.get(tasks_info_url).then(res => {
      this.tasks_info = res.data
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
