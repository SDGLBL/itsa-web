<template>
  <div class="task-card" @mouseenter="show = !show" @mouseleave="show = !show">
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="url" :fit="fit" />
      <transition name="el-zoom-in-top">
        <el-row v-show="show" style="margin:5px">
          <!-- 启动Task -->
          <el-popconfirm title="是否启动此任务？" @onConfirm="start_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="info" icon="el-icon-s-claim" circle />
          </el-popconfirm>

          <!-- 挂起Task -->
          <el-popconfirm title="你确定要挂起此任务？" @onConfirm="suspend_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="warning" icon="el-icon-remove-outline" circle />
          </el-popconfirm>

          <!-- 杀死Task -->
          <el-popconfirm title="你确定要杀死此任务？" @onConfirm="kill_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle />
          </el-popconfirm>

          <!-- 查看任务信息 -->
          <el-popconfirm title="你确定要查看任务信息？" @onConfirm="check_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="success" icon="el-icon-info" circle />
          </el-popconfirm>
        </el-row>
      </transition>
      <div style="padding: 14px;">
        <span>{{ name }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['url', 'name'],
  data() {
    return {
      fit: 'scale-down',
      show: false,
      status:'off'
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    show_info: function() {
    },
    /**
     * 杀死Task
     */
    kill_task: function() {
      // 杀死Task
      var dv_api_url = '/api/task/kill/' + this.name
      this.$axios.get(dv_api_url).then(res => {
        // 杀死失败弹出消息进行提示
        if(!res.data['is_success']){
          this.$message.error(res.data['info'])
        }else{  // 杀死成功弹出消息进行提示
          this.$message({
            message: res.data['info'],
            type: 'success'
          })
          this.status='off'
        }
        localStorage.removeItem(this.name)
      })
    },

    /**
     * 挂起Task
     */
    suspend_task: function() {
      // 挂起Task
      var su_api_url = '/api/task/suspend/' + this.name
      this.$axios.get(su_api_url).then(res => {
        // 挂起失败弹出消息进行提示
        if(!res.data['is_success']){
          this.$message.error(res.data['info'])
        }else{  // 挂起成功弹出消息进行提示
          this.$message({
            message: res.data['info'],
            type: 'success'
          })
          this.status='on'
        }
      })
      console.log('挂起Task')
    },

    /**
     * 启动Task函数
     */
    start_task: function() {
      var st_api_url = '/api/task/start/' + this.name
      this.$axios.get(st_api_url).then(res => {
        // 启动失败弹出消息进行提示
        if(!res.data['is_success']){
          this.$message.error(res.data['info'])
        }else{  // 启动成功弹出消息进行提示
          this.$message({
            message: res.data['info'],
            type: 'success'
          })
          this.select_scene_visible=true
          this.status='on'
        }
      })
      console.log('启动Task')
    },

    /**
     * 查看Task函数
     */
    check_task:function () {
      if(this.status==='on') {
        this.$router.push({path: '/form/checkinfo/index',query:{task_name:this.name}})
      }
      else{
        this.$message.error("您可能没有启动或者杀死了该任务")
      }
    }
  }




}
</script>

<style scoped>
  /* @import url(); 引入css类 */
  /**.video-card
   * 每个视频card的外边距为 20px
   * 在各个大小下的响应比例为 :xs="12" :sm="10" :md="8" :lg="6" :xl="4"
   */
  .task-card {
    margin: 10px;
  }
</style>
