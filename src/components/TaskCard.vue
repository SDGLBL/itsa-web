<template>
  <div class="task-card">
    <el-card :body-style="{ padding: '0px' }" >
      <el-image  :src="url" :fit="fit"></el-image>
      <div style="padding: 14px;">
        <span>{{name}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    props:['url','name'],
  data() {
    return {
      fit: "scale-down",
    };
  },
  methods: {
      show_info: function(){

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
    margin:10px; 
}
</style>