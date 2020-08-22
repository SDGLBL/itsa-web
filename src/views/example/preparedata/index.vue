<template>
  <div class="app">

    <div class="draw_axis_container">
      <div class="draw_container" >
        <div class="canvas-box" id="canvas-box-container" style="width: 770px; height: 432.4px;" >
          <canvas id="cvs" width="770" height="432.4">
          </canvas>
        </div>
      </div>
      <el-steps :active="active" finish-status="success" style="margin-top:20px;width:80%;color:#409EFF" simple>

        <el-step title="绘图场景选择" icon="el-icon-upload"></el-step>
        <el-step title="进入任务提交" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>


    <div class="step">
      <el-timeline>
        <el-timeline-item>
          <span>绘制场景选择</span>
          <el-form ref="form" :model="form1" label-width="100px">
            <el-form-item label="区域绘制">
              <el-select v-model="form1.paint" placeholder="请选择绘制场景" @change="select_one">
                <el-option v-for="(item,index) in data.components"
                           :key="index"
                           :label="item"
                           :value="item" border></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-timeline-item>

        <el-timeline-item>
          <span>禁止车辆类型选择</span>
          <el-checkbox-group v-model="checkList">
            <div class="forbid_car" v-show="forbid">
              <el-checkbox v-for="item in obj_type"
                           :key="item.obj_en"
                           :label="item.obj_name"
                           :value="item.obj_en" class="forbid_car_item"></el-checkbox>
            </div>
          </el-checkbox-group>
        </el-timeline-item>

        <el-timeline-item>
          <span>数据提交</span>
          <div style="margin-top:10px">
            <el-button type="primary" round  @click="submit_data">提交当前数据</el-button>
          </div>
        </el-timeline-item>

        <el-timeline-item>
          <span>提交所有数据</span>
          <div style="margin-top:10px">
            <el-button type="primary" round  @click="submit_all">提交所有数据</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>

    </div>
    <div>
      <el-button @click="test" v-show="false">测试</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        form1: {
          name: '',
          paint:'未选择',
        },
        obj_type:[
          {obj_name:'巴士',
            obj_en:'bus'},
          {obj_name:'卡车',
            obj_en:'truck'},
          {obj_name:'轿车',
            obj_en:'car'},
        ],
        img:{
          width:0,
          height:0
        },
        video_info:{

        },
        //禁止车辆选择
        forbid:false,
        data:{
          task_name:'',
          task_type:'',
          img_url:'',
          components:[]
        },
        form:{

        },
        active: 0,
        checkList: [],
        selected_component:[],
        cfg_data: {
          filename:'',
          lane_monitoring_area: [
          ],
          parking_monitoring_area: [],
          //违规行人检测
          person_monitoring_area:[],
          lane_no_allow_cars:{}
        },
        area_points:[] ,
        cavans_point:[],
        v:"" ,
      }

    },
    created(){
      this.data=JSON.parse(localStorage.getItem('video') || '[]')
      console.log(this.data)
    },
    mounted(){
      //console.log("url(\"C://Users//stay night//Desktop//车牌号.jpg\")");
      //this.img=new Image()
      //this.img.src=this.data.img_url
      var video_info_url='api/video/video_info/' + '?video_name=' + this.data.task_name
      this.$axios.get(video_info_url).then(res=>{
        this.video_info=res.data
        this.img.width=this.video_info['video_shape'][1]
        this.img.height=this.video_info['video_shape'][0]
        this.initCanvas(this.data.img_url)
      })

      document.getElementById("canvas-box-container").style.backgroundImage="url(" +this.data.img_url + ")"
      console.log('data'+this.data)
    },
    beforeDestroy() {
      localStorage.removeItem('video')
    },
    methods:{
      initCanvas() {
        var c = document.getElementById("cvs")
        var ctx = c.getContext("2d")
        var cvs = document.getElementById("cvs")
        var cvsClientRect = cvs.getBoundingClientRect()
        var points = []

        cvs.addEventListener("mousedown", mousedownHandler, false)
        var ctx = cvs.getContext('2d')
        var flag = false
        var temp_point_list = []
        var that = this
        const width = this.img.width
        const height = this.img.height

        function mousedownHandler(event) {
          if (event.button == 0 && !flag) {


            points.push({
              x: event.pageX - cvsClientRect.x,
              y: event.pageY - cvsClientRect.y
            });
            // 记录点集合
            console.log('长宽')
            console.log(width)
            console.log(height)
            var x = (event.pageX - cvsClientRect.x) * width / 770;
            var y = (event.pageY - cvsClientRect.y) * height / 432.4;
            //console.log(x)
            //console.log(y)
            var list = new Array();
            list.push(x);
            list.push(y);
            temp_point_list.push(list);

            // console.log("ex:"+x)
            // console.log("ey:"+y)
            if (points.length >= 1) {
              cvs.addEventListener("mousemove", mousemoveHandler, false);
            }
            drawPolygon(points);
          } else if (event.button === 2) {
            flag = true;
            // 占用车道错误
            //console.log(that.cfg_data.parking_monitoring_area.points) ;
            that.area_points = temp_point_list;
            temp_point_list = [];
            // 违章停车
            cvs.removeEventListener("mousemove", mousemoveHandler);

            temp_point_list = [];
          }
        }

        function drawPolygon(points) {
          //console.log(width)
          //console.log(height)
          ctx.clearRect(0, 0, width, height);
          //线条颜色
          ctx.strokeStyle = '#409EFF';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.closePath();
          ctx.stroke();
        }

        function mousemoveHandler(event) {
          drawPolygon(points.concat({
            x: event.pageX - cvsClientRect.x,
            y: event.pageY - cvsClientRect.y
          }));
        }
      },
      submit_data(){
        var obj_type={
          轿车:'car',
          卡车:'truck',
          巴士:'bus'
        }
        var is_success=false

        if (this.form1.paint==='违法占用车道'){
          if (this.checkList.length!=0&&this.area_points.length!=0){
            for(let i=0;i<this.checkList.length;i++){
              this.checkList[i]=obj_type[this.checkList[i]]
            }
            this.cfg_data['lane_monitoring_area'].push(this.area_points)
            const index=(Object.keys(this.cfg_data['lane_no_allow_cars']).length+2)+''
            console.log(index)
            this.cfg_data['lane_no_allow_cars'][index]=this.checkList
            is_success=true
            this.active = 1
          }else{
            this.$message({
              message: '您没有进行违法占用车道标注或选择禁止停车类型,请重新标注或选择',
              type: 'warning'
            })
          }
        }else if(this.form1.paint==='违章停车监控'){
          if(this.area_points.length!=0) {
            this.cfg_data['parking_monitoring_area'].push(this.area_points)
            this.active = 1
            is_success=true
          }
          else {
            this.$message({
              message: '您没有进行违章停车监控标注,请进行标注',
              type: 'warning'
            })
          }
        }else if(this.form1.paint==='违规行人检测'){
          if(this.area_points.length!=0) {
            this.cfg_data['person_monitoring_area'].push(this.area_points)
            this.active = 1
            is_success=true
          }
          else {
            this.$message({
              message: '您没有进行违规行人检测标注,请进行标注',
              type: 'warning'
            })
          }
        }else {
          this.$message({
            message: '您没有选择区域绘制,请进行选择',
            type: 'warning'
          })
        }
        this.checkList=[]
        this.area_points=[]
        console.log(this.area_points)
        if(is_success){
          this.$notify({
            title: '提示',
            message: '单次数据已提交成功',
            duration: 2000
          })}

        var c=document.getElementById("cvs")
        var ctx=c.getContext("2d")

        ctx.clearRect(0,0,this.img.width,this.img.height);
        this.initCanvas(this.data.img_url)
      },

      submit_all(){

        console.log(this.cfg_data) ;
        var l_length=this.cfg_data.lane_monitoring_area.length
        var p_length=this.cfg_data.parking_monitoring_area.length
        var s_length=this.cfg_data.person_monitoring_area.length
        var c_length=this.data.components.length
        var content=''
        var is_success=true


        //删除this.cfg_data多余的键
        var z_to_e={
          违法占用车道:'no',
          违章停车监控:'no',
          违规行人检测:'no'
        }
        var z_to_e_l={违法占用车道:'lane_monitoring_area',
          违章停车监控:'parking_monitoring_area',
          违规行人检测:'person_monitoring_area'}
        for(let i=0;i<this.data.components.length;i++) {
          if(z_to_e.hasOwnProperty(this.data.components[i])) {
            z_to_e[this.data.components[i]]='yes'
          }
        }
        for(let key in z_to_e_l){
          if(z_to_e[key]==='no')
            delete this.cfg_data[z_to_e_l[key]]
        }


        if(c_length===3){
          if(l_length===0||p_length===0||s_length===0){
            if(l_length===0){
              content='您选择了违法占用车道检测功能，但没有进行标注，请标注'
            }else if (p_length===0) {
              content='您选择了违章停车监控功能，但没有进行标注，请标注'
            }else if(s_length===0){
              content='您选择了违规行人检测功能，但没有进行标注，请标注'
            }
            is_success=false
          }
        }else if(c_length===2){
          if(this.selected_component.length<2){
            content='你选择两项功能,请检查其中是否有未进行标注的，请标注'
            is_success=false
          }
        } else if(c_length===1) {
          if(this.data.components[0]==='违法占用车道'){
            if (l_length === 0) {
              content = '您选择了违法占用车道检测功能，但没有进行标注，请标注'
              is_success=false
            }
          }else if(this.data.components[0]==='违章停车监控'){
            if (p_length === 0) {
              content = '您选择了违章停车监控功能，但没有进行标注，请标注'
              is_success=false
            }
          } else {
            if (s_length === 0) {
              content = '您选择了违规行人检测功能，但没有进行标注，请标注'
              is_success=false
            }
          }
        }else{
          content = '您没有选择相应的功能组件,请进行功能组件选择'
          is_success=false
        }

        var submit_task_url = '/api/task/submit'
        if(is_success) {
          this.active = 2
          this.cfg_data['filename']=this.data.task_name
          this.form['task_name']=this.data.task_name
          this.form['cfg_data']=this.cfg_data
          this.form['task_type']=this.data.task_type

          console.log(this.form)
          console.log('调用了')

          this.$axios.post(submit_task_url, this.form).then(res => {
            if (!res.data['is_success']) {
              this.$message.error(res.data['info'])
            } else {  // 任务提交成功成功弹出消息进行提示
              this.$message({
                message: res.data['info'],
                type: 'success'
              })
              this.$router.push({path:'/example/index'})
            }
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.$message.error(content)
        }

        console.log("flag的值为" +  this.flag);

      },
      select_one(){
        this.selected_component.push(this.form1.paint)
        console.log('select_one'+this.form1.paint)
        if(this.form1.paint==='违法占用车道'){
          this.forbid=true
        }else {
          this.forbid=false
        }

      },
      test(){
        console.log(this.cfg_data)
      }
    }
  }
</script>


<style scoped>

  .app{
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 60px;
    width:100%;
  }

  .canvas-box{

    background-size: 100% 100%;
  }



  .forbid_car{
    display: flex;
    flex-direction: column;
    margin-top: 10px;;
  }

  .forbid_car_item{
    margin-top: 5px;
  }



</style>




