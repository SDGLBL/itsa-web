<template>
  <div class="video-card" @mouseenter="show = !show" @mouseleave="show = !show">
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="url" :fit="fit"></el-image>
      <transition name="el-zoom-in-top">
        <el-row v-show="show" style="margin:5px">
          <!-- 提交Task -->
          <el-popconfirm title="是否开始提交Task？" @onConfirm="submit_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="info" icon="el-icon-s-claim" circle></el-button>
          </el-popconfirm>

          <!-- 删除视频 -->
          <el-popconfirm title="你确定要删除此视频？" @onConfirm="delete_video" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
          </el-popconfirm>
        </el-row>
      </transition>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ["url", "name"],
  data() {
    return {
      fit: "scale-down",
      show: false
    };
  },
  methods: {
    /**
     * 删除视频函数，请求server删除该视频文件，但不会影响其json emd 等文件
     */
    delete_video: function() {
      // 删除此视频
      var dv_api_url = "/api/video/del/" + this.name;
      this.$axios.get(dv_api_url).then(res => {
        // 删除成功弹出消息进行提示
        this.$message({
          message: res.data["info"],
          type: "success"
        });
      });
    },
    /**
     * 提交Task函数，跳转到提交任务页面并准备进行Task提交
     */
    submit_task: function() {
      console.log("启动任务");
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>

<style scoped>
/* @import url(); 引入css类 */
/**.video-card 
 * 每个视频card的外边距为 20px
 * 在各个大小下的响应比例为 :xs="12" :sm="10" :md="8" :lg="6" :xl="4"
 */
.video-card {
  margin: 20px;
}
/**.el-button
 * 每个button与邻近的button左边距为10px
 *
 */
.el-button {
  margin-left: 10px;
}
</style>