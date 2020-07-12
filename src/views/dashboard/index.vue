<template>
  <div class="dashboard-container">
    <div class="upload_container">
      <el-upload
        class="upload-demo"
        ref="uploader"
        drag
        action="/api/video/upload"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
        :on-success="handleVideoSuccess"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
      </el-upload>
      <el-progress v-show="videoFlag" style="margin-top: 30px" :text-inside="true" :stroke-width="26" :percentage=videoUploadPercent></el-progress>
      <el-button type="primary" style="margin-top: 20px" @click="cancel_upload">取消上传<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      form: {
        tryVideo: "",
        tryVideoImg: "",
      },
      videoFlag: false, //是否显示进度条
      videoUploadPercent: 0, //进度条的进度，
      duration: "", //视频时长
    }
  },
  methods:{
    //上传视频格式限制
    beforeUploadVideo(file) {
      if (['video/mp4'].indexOf(file.type) == -1) {
        this.$message.error('请上传正确的视频格式');
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList){
      this.videoFlag = true;
      this.videoUploadPercent = Math.floor(event.percent)
    },
    handleVideoSuccess(res, file) {                               //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;

      if(res['is_success']){
        this.$message({
          message: file.name+'上传成功',
          type: 'success'
        })
      }else{
        this.$message.error(file.name+'上传失败失败，请重新上传！');
      }
    },
    cancel_upload(){
      this.videoFlag = false
      this.videoUploadPercent = 0
      this.$refs.uploader.abort()

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    display:flex;
    justify-content:center;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    display:flex;
    justify-content:center;
  }
}

</style>
