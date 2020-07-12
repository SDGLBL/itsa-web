<template>
  <div class="main">
    <div class="main_video_rate_container">
      <!-- 视频部分 begin -->
      <div class="main_video_container" >
        <video-player class="video-js vjs-default-skin vjs-big-play-centered" id="main_video"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
        ></video-player>
      </div>

      <!-- 车流量表 begin -->
      <div class="main_traffic_flow_container">
        <el-table
          :data="pass_count_table"
          style="width: 100%"
          :key='car_key'
          border
          :height=465
          :header-cell-style="{background:'rgba(239,236,236,0.33)'}"
        >
          <el-table-column v-for="(item,index) in table_title" :key="index" :prop="index+''" :label="item">
          </el-table-column>
        </el-table>
      </div>
      <!-- 车流量表 end -->
    </div>

    <div class="blank"></div>

    <div class="main_cars_task">
      <div class="cars_container">
        <span class="cars_font">违规车辆表 </span>
        <div style="margin-bottom: 3px;">
          <i class="el-icon-s-help"></i>
          <span class="cars_font_des">用来记录违规车辆信息 </span>
        </div>
        <el-table
          :data="criminal_cars_table"
          stripe
          :key='illegal_key'
          border
          :height=300
          :header-cell-style="{background:'rgba(239,236,236,0.33)'}"
          style="width: 100%"
        >
          <el-table-column
            v-for="{ prop, label,align } in criminal_table_config"
            :key="prop"
            :prop="prop"
            :align="align"
            :label="label">
          </el-table-column>
          <el-table-column
            label="违规图像"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="pop_dialog()">详情</el-button>
              <el-dialog title="违规拍照记录" :visible.sync="dialog_table_visible" center :append-to-body='true' :lock-scroll="false"   width="80%" >
                <el-carousel indicator-position="outside" :height="height">
                  <el-carousel-item v-for="item in criminal_cars_table[scope.$index].criminal_imgs" :key="item">
                    <el-image
                      style="width: 100%; height: 100%"
                      :src="item"
                      fit="fit"
                      @load="onLoad">
                    </el-image>
                  </el-carousel-item>
                </el-carousel>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--任务表-->
      <div class="task_table_container">
        <span class="task_font">任务提交表 </span>
        <div style="margin-bottom: 3px;">
          <i class="el-icon-s-claim"></i>
          <span class="task_font_des">用来记录已提交的任务 </span>
        </div>
        <el-table
          :data="tasks"
          :height=300
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="任务编号"
            type="index"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="task_name"
            label="任务介绍"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
    export default {

        name: "index",

        data (){
          this.criminal_table_config = [
            { prop: 'end_time', label: '违规时间',align: 'center' },
            { prop: 'id', label: '车辆ID',align: 'center' },
            { prop: 'info_type', label: '违规类型',align: 'center' },
            { prop: 'number_plate', label: '车牌号',align: 'center' },
            { prop: 'obj_type', label: '车辆类型',align: 'center' }
          ]
          this.pass_count_talbe_config = [
            { prop: 'end_time', label: '违规时间',align: 'center' },
          ]
          return{
            task_name:'',
            dialog_table_visible:false,
            //任务表
            tasks:[

            ],
            car_key:0,
            illegal_key:0,
            //表头
            table_title:[],
            //车流列表数据
            pass_count_table: [
                //{0:"car",1:"0.0",2:"3.0",3:"1.0",4:"4.0"},
                //{0:"truck",1:"0.0",2:"1.0",3:"0.0",4:"1.0"},
                //{0:"bus",1:"0.0",2:"0.0",3:"0.0",4:"0.0"},
                //{ 0:"总和",1:"0.0",2:"4.0",3:"1.0",4:"5.0"}
             ],
            // 违规车表
            criminal_cars_table: [
              {
              end_time: "2020-05-27 14:14:13",
              id: "26.0",
              criminal_imgs: ['static/data/criminal/2020-05-27 14-26-50 483.0 0.jpg',
                'static/data/criminal/2020-05-27 14-26-50 483.0 1.jpg'],
              info_type: "pass",
              number_plate: null,
              obj_type: 'car'
              }
             ],
            my_timer:null,

            //视频数据
            playerOptions : {
              playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
              width: '500px',
              height: '324px',
              controls: true,
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: 'zh-CN',
              aspectRatio: '500:324', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              techOrder: ['flash'],
              flash: {
                hls: { withCredentials: false },

                //swf: SWF_URL // 引入静态文件swfF
              },
              sources: [
                  //  { // 流配置，数组形式，会根据兼容顺序自动切换
                  //    type: 'rtmp/flv',
                  //    src: 'rtmp://58.200.131.2:1935/livetv/hunantv' //这是芒果TV现场直播视频，地址是可以用的，最后需要替换成后端给的项目地址
                  //  }
                {
                  type: "rtmp/flv",
                  src: "rtmp://localhost:1935/live/home"
                }
              ],

              notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true  //全屏按钮
              }
            }
          }
        },
        created(){
          this.task_name=this.$route.query.task_name
        },

        mounted(){
          //task表
          var task_url = '/api/task/task_list';
          this.$axios.get(task_url).then(res=>{
            this.tasks = res.data ;
          })
          this.criminal_cars_table=JSON.parse(localStorage.getItem(this.task_name) || '[]')
          console.log('mounted')
          //设置调用时间间隔
          this.my_timer=setInterval(this.flash_res, 3000);

        },
        //销毁之前存储违规数据
        beforeDestroy() {
          console.log('取消定时')
          localStorage.setItem(this.task_name,JSON.stringify(this.criminal_cars_table))
          clearInterval(this.my_timer)
        },
        computed:{
        player(){
          return this.$refs.VuevideoPlayer.player
        }
      },
        methods: {
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePreview(file) {
            console.log(file);
          },
          flash_res(){

            //违规表
            var err_url = '/api/task/info/analysis/' + '?task_name=' + this.task_name
            const e_to_z={
              car: '轿车',
              truck: '卡车',
              bus: '巴士',
              illegal_parking: '违章停车',
              illegal_occupation: '违法占用车道'
            }
            this.$axios.get(err_url).then(res=>{


              if(res.data.hasOwnProperty('info')){
                //this.$message.error(res.data['info'])
              }else{
                if(res.data[0]['info_type']!='pass'&& (this.criminal_cars_table.length===0||res.data[0]['id']!=this.criminal_cars_table[this.criminal_cars_table.length-1]['id'])) {

                  delete res.data[0]['passage_type']
                  delete res.data[0]['start_time']
                  res.data[0]['info_type']=e_to_z[res.data[0]['info_type']]
                  res.data[0]['obj_type']=e_to_z[res.data[0]['obj_type']]
                  //res.data[0]['criminal_imgs']=['static/data/criminal/2020-05-27 14-26-50 483.0 0.jpg',
                    //'static/data/criminal/2020-05-27 14-26-50 483.0 1.jpg']
                  console.log("调用违规表")
                  console.log(res.data)

                  if(this.criminal_cars_table.length===0) {
                    this.criminal_cars_table.push(res.data[0])
                  }else{
                    var flag=true
                    for(let i=0;i<this.criminal_cars_table.length;i++){
                      if(res.data[0]['number_plate']===this.criminal_cars_table['number_plate']&&res.data[0]['info_type']===this.criminal_cars_table['info_type']) {
                            flag=false
                            break
                      }
                    }
                    if(flag)
                      this.criminal_cars_table.push(res.data[0])
                  }
                  this.illegal_key=Math.random()
                  console.log( this.criminal_cars_table)
                }
              }
            })

            // 车流量表
            var task_url = '/api/task/info/count/' + '?task_name=' + this.task_name
            this.$axios.get(task_url).then(res=>{
              //console.log("调用车流量表")
              if(res.data.hasOwnProperty('info')){
                //this.$message.error(res.data['info'])
              }else{
                for(let i=0;i<res.data.length;i++){
                  if(i!=0) {
                    if(e_to_z.hasOwnProperty(res.data[i][0]))
                    res.data[i][0]=e_to_z[res.data[i][0]]
                  }
                }
                this.table_title = res.data[0];
                for(var i = 1;i<res.data.length;i++) {
                  var row_data = {};

                  for (var j = 0; j < this.table_title.length; j++) {
                    row_data[j] = res.data[i][j];
                  }
                  this.pass_count_table[i] = row_data;
                }
                this.car_key=Math.random()
               //console.log(this.pass_count_table)
              }
            })
          },
          pop_dialog() {
            this.dialog_table_visible=true
          },
          onLoad(){
            this.height=screen.height*0.8+'px'
            console.log(screen.height)
            console.log(screen.width)
            console.log(this.height)
          }
        }
    }
</script>

<style scoped>
  .head{
    display: flex;
    width: 100%;
    justify-content: center;
    background-color: #ffffff;
  }

  .head_title{
    margin-top: 25px ;
    font-family:"PingFangSC-light","Helvetica Neue","Hiragino Sans GB","Helvetica","Microsoft YaHei","Arial";
    font-size: 35px;
  }

  .main{
    width: 100%;
    background-color:#f6f9fa;
  }

  .main_video_rate_container{
    display: flex;
    justify-content: center;

  }

  .main_video_container{
    display: flex;
    margin-top: 60px;
    margin-right: 25px;
    margin-left: 25px;
  }

  #main_video{
    width : 750px ;
    height : 486px ;
  }

  .main_traffic_flow_container{
    display: flex;
    margin-top: 60PX;
    margin-left: 25px;
    padding: 8px;
    width:700px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .blank{
    width: 100%;
    height: 45px;
    background-color: white;
  }

  .main_cars_task{
    display: flex;
    justify-content: center;
  }

  .cars_container{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    padding: 8px;
    width: 1000px;
    margin-right: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

  }

  .task_table_container{
    margin-top: 10px;
    padding: 8px;
    margin-left: 25px;
    width: 350px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .cars_font{
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    color: #20aee3 !important;
  }

  .cars_font_des{
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #20aee3 !important;
  }

  .el-icon-s-help{
    margin-right: 3px;
    color:#20aee3 ;
  }

  .task_font{
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    color: #6772e5 !important;
  }

  .task_font_des{
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #6772e5 !important;
  }

  .el-icon-s-claim{
    margin-right: 3px;
    color:#6772e5 ;
  }

  .commit_task_container{
    display: flex;
    justify-content: center;
  }



  .canvas_container{
    display: flex;
    width: 100%;
    height: 710px;
    justify-content: center;
    padding-top: 10px;
  }
</style>
