<template>
  <div class="find">

    <div class="find_table_container">

        <el-input
          v-model="input"
          placeholder="请输入车牌号"
          prefix-icon="el-icon-search"
          style="width:820px;"
          clearable
        />
        <el-button type="primary" style="margin-left:10px" @click="findclick">查找信息</el-button>
    </div>

    <div class="criminal_list">
      <el-table
        :data="criminal_data"
        stripe
        border
        :height=300
        :header-cell-style="{background:'rgba(239,236,236,0.33)'}"
        style="width: 100%"
        >
        <el-table-column
          v-for="{ prop, label,align } in col_config"
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
            <el-dialog title="违规拍照记录" :visible.sync="dialog_table_visible" center :append-to-body='true' :lock-scroll="false"   width="80%">
              <el-carousel indicator-position="outside" :height="height">
                <el-carousel-item v-for="item in criminal_data[scope.$index].img_path" :key="item" >
                  <el-image
                    style="width: 100%;height: 100%"
                    :src="item"
                    fit="fit">
                  </el-image>
                </el-carousel-item>
              </el-carousel>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.col_config = [
      { prop: 'start_time_hms', label: '违规时间',align: 'center' },
      { prop: 'illegal_type', label: '违规类型',align: 'center' },
      { prop: 'number_plate', label: '车牌号',align: 'center' },
      { prop: 'obj_type', label: '车辆类型',align: 'center' }
    ]
    return {
      input: '',
      dialog_table_visible: false,
      criminal_data:[
      ],
      width:'',
      height:''
    }
  },
  created() {
    this.height=screen.height*0.8+'px'
  },
  computed: {
    start_time: function() {
      return this.cars_info.start_time_ymd + ' ' + this.cars_info.start_time_hms
    },
    vehicle_type: function() {
      // eslint-disable-next-line no-unused-vars
      var type = {
        car: '轿车',
        bus: '巴士',
        truck: '卡车'
      }
      return type[this.cars_info.obj_type]
    },
    // eslint-disable-next-line vue/return-in-computed-property
    illegal_type: function() {
      // eslint-disable-next-line no-unused-vars
      var type = {
        illegal_parking: '违章停车',
        illegal_occupation: '违法占用车道'
      }
      return type[this.cars_info.illegal_type]
    }
  },
  methods: {
    findclick() {
      var url = '/api/search/illegal/' + '?number_plate=' + this.input
      this.$axios.get(url).then(res => {

        if(res.data.hasOwnProperty('info')){
          this.$message.error(res.data['info'])
        }else {
        this.tackledata(res.data)
        }
        console.log(res.data)
        // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        console.log(this.input)
        console.log(url)
        this.$alert('不存在或输入错误', 'Error', {
          confirmButtonText: '确定'
        })
      })
    },
    tackledata(data) {
      // eslint-disable-next-line no-unused-vars
      var criminal_type = {
        illegal_parking: '违规停车',
        illegal_occupation: '违法占用车道'
      }
      var type = {
        car: '轿车',
        bus: '巴士',
        truck: '卡车'
      }
      for(let i =0; i<data.length; i++){
        data[i]['illegal_type']=criminal_type[data[i]['illegal_type']]
        data[i]['obj_type']=type[data[i]['obj_type']]
        data[i]['start_time_hms']=data[i]['start_time_ymd']+' '+ data[i]['start_time_hms']
      }

      this.criminal_data = data
      console.log('违规数据')
      console.log(this.criminal_data)
    },
    pop_dialog() {
        this.dialog_table_visible=true
    }
  }
}
</script>

<style lang="stylus" scoped>
  .find{
    display:flex;
    flex-direction:column;
    justify-content:center;
    margin-top:60px ;
    margin-left:35px;
    width:100%;
  }

  .car_infos_container{
    margin-top:55px;
  }

  .img_info_container{
    display:flex;
    justify-content:space-between;
    padding-right:45px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .car_img_container{
    margin-top:25px;
    width:500px;
  }

  .find_table_container{
    display:flex;
    justify-content:center;
  }
  .criminal_list{
    margin-top: 70px;
    margin-right: 80px;
    display:flex;
    justify-content:center;
  }
</style>
