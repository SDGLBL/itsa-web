<template>
  <div class="video-card" @mouseenter="show = !show" @mouseleave="show = !show">
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="url" :fit="fit" />
      <transition name="el-zoom-in-top">
        <el-row v-show="show" style="margin:5px">
          <!-- 提交Task -->
          <el-popconfirm title="是否开始提交Task？" @onConfirm="submit_task" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="info" icon="el-icon-s-claim" circle />
          </el-popconfirm>

          <!-- 删除视频 -->
          <el-popconfirm title="你确定要删除此视频？" @onConfirm="delete_video" @onCancel="$message('取消操作')">
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle />
          </el-popconfirm>
        </el-row>
      </transition>
    </el-card>

    <!--交通场景选择对话框-->
    <el-dialog
      title="交通场景"
      :visible.sync="select_scene_visible"
      width="30%"
      :before-close="handleClose">
      <span>Tip: 选择交通场景后, 点击下一步进行功能组件选择</span>
      <span slot="footer" class="dialog-footer">
        <div class="select-box">
      <el-select v-model="scene" filterable placeholder="请选择场景">
        <el-option
          v-for="item in scenes"
          :key="item.task_type"
          :label="item.task_name"
          :value="item.task_type">
        </el-option>
      </el-select>
      </div>
    <el-button @click="select_scene_visible = false">取 消</el-button>
    <el-button type="primary" @click="select_scene_next">下一步</el-button>
  </span>
    </el-dialog>

    <!--数据准备对话框-->
    <el-dialog
      title="功能组件选择"
      :visible.sync="select_components_visible"
      width="30%"
      :before-close="handleClose">
      <span>Tip: 选择后, 点击下一步进行交通场景初始化数据准备</span>
      <span slot="footer" class="dialog-footer">
        <div class="check-box">
          <el-checkbox-group v-model="check_selected_components" size="small">
            <el-checkbox v-for="item in scene_components[scene]"
                         :key="item.com_type"
                         :label="item.com_name"
                         :value="item.com_type" border></el-checkbox>
          </el-checkbox-group>
      </div>
    <el-button @click="select_components_visible = false">取 消</el-button>
    <el-button type="primary" @click="select_component_next">下一步</el-button>
  </span>
    </el-dialog>

    <!--违章停车监控对话框-->
    <el-dialog
      title="违章停车监控区域标注"
      :visible.sync="wztc_visible"
      width="100%"
      :before-close="handleClose">
      <span>Tip: </span>
      <span slot="footer" class="dialog-footer">
        <div class="draw_container">
            <div class="canvas-box" id="canvas-box-container" style="width: 770px; height: 432.4px;">
            <canvas id="cvs" width="770" height="432.4" >
            </canvas>
            </div>
        </div>
    <el-button @click="wztc_visible = false">取 消</el-button>
    <el-button type="primary" @click="select_component_next">下一步</el-button>

        <!--数据准备对话框-->
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: ['url', 'name'],
  data() {
    return {
      fit: 'scale-down',
      show: false,
      scenes: [{
        "task_name": "路口场景",
        "task_type": "crossRoadsTask"
      },
        {
          "task_name": "路口场景Fake",
          "task_type": "crossRoadsTaskFake"
        }],
      //交通场景选择可视化
      select_scene_visible: false,
      //功能组件选择可视化
      select_components_visible:false,
      //违章停车标注可视化
      wztc_visible:false,
      //违法占用车道标注可视化
      wfzycd_visible:false,
      //交通场景
      scene:'',
      //当前标注功能组件
      current_label:'',
      //交通场景功能组件
      scene_components:{
          //路口交通场景
        "crossRoadsTask":[
          {com_name:'违章停车监控',
            com_type:'ParkingMonitoringComponent'
          },
          {com_name:'违法占用车道',
            com_type:'LaneMonitoringComponent'
          }
        ],
        "crossRoadsTaskFake":[
          {com_name:'违章停车监控',
            com_type:'ParkingMonitoringComponent'
          },
          {com_name:'违法占用车道',
            com_type:'LaneMonitoringComponent'
          }
        ],
        //高速公路场景
        "expresswayTask":[
          {com_name:'违章停车监控',
            com_type:'ParkingMonitoringComponent'
          },
          {com_name:'违法占用车道',
            com_type:'LaneMonitoringComponent'
          }
        ],

        //高速公路场景
        "expresswayTaskFake":[
          {com_name:'违章停车监控',
            com_type:'ParkingMonitoringComponent'
          },
          {com_name:'违法占用车道',
            com_type:'LaneMonitoringComponent'
          }
        ],
        //路口饱和度场景
        "saturabilityTask":[

        ],
        //路边违规停车场景
        "roadsideTask":[
          {
            com_name:'违章停车监控',
            com_type:'ParkingMonitoringComponent'
          }
        ],
      },
      check_selected_components:[],
      //表单数据

    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    // 获取所有场景
    var videos_info_url = '/api/task/task_cfg_list'
    this.$axios.get(videos_info_url).then(res => {
      this.scenes = res.data
    })
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
  },
  methods: {
    /**
     * 删除视频函数，请求server删除该视频文件，但不会影响其json emd 等文件
     */
    delete_video: function() {
      // 删除此视频
      var dv_api_url = '/api/video/del/' + this.name
      this.$axios.get(dv_api_url).then(res => {
        // 删除成功弹出消息进行提示
        this.$message({
          message: res.data['info'],
          type: 'success'
        })
      })
    },
    /**
     * 提交Task函数，跳转到提交任务页面并准备进行Task提交
     */
    submit_task: function() {
      //路由跳转
      this.select_scene_visible=true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //选择场景下一步
    select_scene_next (){

      switch (this.scene) {
        case "crossRoadsTask":
          this.select_scene_visible = false
          this.select_components_visible = true
          //console.log(this.scene_components[this.scene])
          break
        case "crossRoadsTaskFake":
          this.select_scene_visible = false
          this.select_components_visible = true
          //console.log(this.scene_components[this.scene])
          break
        case "expresswayTask":
          this.select_scene_visible = false
          this.select_components_visible = true
          //console.log(this.scene_components[this.scene])
          break
        case "expresswayTaskFake":
          this.select_scene_visible = false
          this.select_components_visible = true
          //console.log(this.scene_components[this.scene])
          break
        case "roadsideTask":
          this.select_scene_visible = false
          this.select_components_visible = true
          break
        case "saturabilityTask":
          this.select_scene_visible = false
          this.select_components_visible = true
          break
          default:
            this.$message.error("您还没有选择交通场景请选择")
      }
    },
    //选择功能组件下一步
    select_component_next(){
      var ar_length=this.check_selected_components.length
      //console.log(this.url)
      var data= {
        task_name:this.name,
        task_type:this.scene,
        img_url:this.url,
        components:this.check_selected_components
      }
      localStorage.setItem('video',JSON.stringify(data))
      if (ar_length==0){
        //TODO:用于没有2违规的场景组件
        var submit_task_url = '/api/task/submit'
        console.log(this.form)
        console.log('调用了')
        var data= {
          task_name:this.name,
          cfg_data: {
            filename:this.name
          },
          task_type:this.scene,
        }
        this.$axios.post(submit_task_url,data).then(res => {
          if (!res.data['is_success']) {
            this.$message.error(res.data['info'])
          } else {  // 任务提交成功成功弹出消息进行提示
            this.$message({
              message: res.data['info'],
              type: 'success'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      console.log("flag的值为" +  this.flag);
      }else if (ar_length==1){
        //用于单个违规场景组件
        console.log(this.check_selected_components[0])
        if(this.check_selected_components[0]==='违章停车监控'){
          this.wztc_visible=true

        }else{
          this.wfzycd_visible=true
        }
        this.$router.push({path: '/example/preparedata/index'})

      }else {
        //默认先画违章停车
        this.wztc_visible=true
        this.$router.push({path: '/example/preparedata/index'})
      }
        //document.getElementById("wztc").style.width=img.width+'px';
        //document.getElementById("canvas-box-container").style.width=img.width+'px';
        //document.getElementById("canvas-box-container").style.height=img.height+'px';
        //document.getElementById("cvs").style.width=img.width+'px';
        //document.getElementById("cvs").style.height=img.height+'px';
      this.select_components_visible=false;

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
.select-box{
  margin-top: 50px;
  display:flex;
  justify-content:center;
}
.check-box{
  margin-bottom: 20px;
  display:flex;
  justify-content:center;
}
.canvas-box{
  background-size: 100% 100%;
  margin-bottom: 20px;
}
</style>
