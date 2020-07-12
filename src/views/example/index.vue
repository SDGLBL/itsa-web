<template>

  <div id="table1">
    <el-row>
      <el-col v-for="(video_info,index) in videos_info" :key="index" :xs="12" :sm="10" :md="8" :lg="6" :xl="5">
        <video-card :url="video_info.video_snapshot_url" :name="video_info.video_name" />
      </el-col>
    </el-row>
  </div>

</template>

<script>
import VideoCard from '../../components/VideoCard'
export default {
  components: {
    VideoCard
  },
  data() {
    return {
      videos_info: [],
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  created() {
    // 获取所有可以处理的视频
    var videos_info_url = '/api/video/video_list'
    this.$axios.get(videos_info_url).then(res => {
      this.videos_info = res.data
      console.log(this.videos_info)
    })
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
}
</script>

<style scoped>
  #table1 {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .upload_are{
    display:flex;
    justify-content:center;
  }
</style>

