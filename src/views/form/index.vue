<template>
  <div id="form1">
    <el-row>
      <el-col v-for="(task_info,index) in tasks_info" :key="index" :xs="12" :sm="10" :md="8" :lg="6" :xl="5">
        <task-card :url="task_info.task_snapshot" :name="task_info.task_name" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TaskCard from '../../components/TaskCard'

export default {
  components: {
    TaskCard
  },
  data() {
    return {
      tasks_info: []
    }
  },
  created() {
    // 获取所有的task
    var tasks_info_url = '/api/task/task_list'
    this.$axios.get(tasks_info_url).then(res => {
      this.tasks_info = res.data
    })
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

#form1 {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

