<template>
  <el-col :span="24" :offset=1>
    <div>
      <div class="container" style="margin-top: 10px">
        <el-form :inline="true" :label-position="labelPosition" label-width="180px" :model="processContent"
        >

          <el-tabs v-model="activeName" class="param-tab-style">
            <!--下发参数-->
            <el-tab-pane
              label="下发参数"
              name="param1"
            >
          <!-- <el-col :span="24" :class="colHeight">  :style="{float:'left'}"-->
            <el-form-item label="静置时间下限(min)"  >
              <el-input type="number" v-model="processContent.pp.stl" placeholder="静置时间下限(min)" :disabled="isFlowDts"></el-input>
            </el-form-item>
            <el-form-item label="静置时间上限(min)" >
              <el-input type="number" v-model="processContent.pp.stu" placeholder="静置时间上限(min)" :disabled="isFlowDts"></el-input>
            </el-form-item>
          <!-- </el-col> -->
            </el-tab-pane>
          </el-tabs>

          <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="changeRequest">变更申请</el-button>
            <!-- v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" -->
          </el-col>
          <el-col v-if="flowTempShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="nowAdd">立即添加</el-button>
          </el-col>
        </el-form>
      </div>
    </div>
  </el-col>
</template>

<script>
  import httpUtils from '@/api/fms-common'
  export default {
    name: 'standTimeModel',
    data() {
      return {
        activeName:'param1',
        colHeight:'colHeight',
        flowShow: true,
        flowTempShow: false,
        processContent: {
          pp: {
            stl: "500",
            stu: "0",
          },
          doubleCheck: {
            stl: "500",
            stu: "0",
          },
          sp: []
        },
        processContentInit: {
          pp: {
            stl: "500",
            stu: "0",
          },
          doubleCheck: {
            stl: "500",
            stu: "0",
          },
          sp: []
        },
        bizId:'',
        dataUpdateParam: {},
        labelPosition: 'left',
      }
    },
    props: {
      'isShowSubmit': Number,
      'isFlowDts': Boolean
    },
    watch: {
      'isShowSubmit':{
        handler: function(oldV,newV) {
          console.log(oldV, newV)
        },
        deep:true,
      }
    },
    created() {
    },
    methods: {
      nowAdd() {
        /*参数上下限验证*/
        let checkBody = this.check();
        if (checkBody) {
          this.$message({
            message: checkBody,
            type: 'error'
          })
          return false;
        }

        let json = {data:{
            flowDtId: this.dataUpdateParam.flowDtId,
            id: this.dataUpdateParam.id,
            processContent: JSON.stringify(this.processContent),
            processId: this.dataUpdateParam.processId,
          }
        }
        httpUtils.actionFmsPost('/process-dts-tmp/add', json).then(data => {
          if (data) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.$emit('initOldDraggingNode')
          }
        })
      },


      check() {
        if (parseInt(this.processContent.pp.stu) < parseInt(this.processContent.pp.stl)) {
          return '静置时间上限[' + this.processContent.pp.stu + ']小于下限[' + this.processContent.pp.stl + ']'
        }
        return '';
      },

      dataUpdate(row, url, state) {
        if (state == 1) {
          this.flowShow = true
          this.flowTempShow = false
        } else if (state == 2) {
          this.flowShow = false
          this.flowTempShow = true
        } else if (state == 3) {
          this.flowShow = false
          this.flowTempShow = false
        }
                if (this.isShowSubmit === 1) {
           this.flowTempShow = false
        }
        this.bizId = row.id
        let json = { data: row.id }
        this.dataUpdateParam.processId = row.processId
        this.dataUpdateParam.flowDtId = row.id
        httpUtils.actionFmsPost(url, json).then(data => {
          if(data != null ){
            this.dataUpdateParam = data
            let getJson = JSON.parse(data.processContent);
            for (let key in this.processContent) {
              if(getJson[key] == undefined){
                getJson[key] = {};
              }
            }
            try {
              this.processContent = getJson
            }catch (e) {
              this.processContent =  JSON.parse(JSON.stringify(this.processContentInit))
            }
          }else {
            this.dataUpdateParam.id = null;
            this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
          }
        })
      },
      changeRequest(){
        let json = {data:{bizId:this.bizId,changeType:1}};
        const _data = {url:'/process-flow/process-flow-change-apply',params:json}
        this.$store.dispatch('fmsCommon/actionFmsPost',_data).then(data => {
          if(data){
            this.$message({
              message: '提交成功！',
              type: 'success'
            });
            this.$emit('dialogSubmit')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep .el-input.is-disabled .el-input__inner {
        background-color: #f5f7fa !important;
        color: #888;
      }
  ::v-deep .el-input__inner{
    height: 30px;
  }
  ::v-deep .param-tab-style {
     .el-tabs__content {
      height: 60vh !important;
      overflow: scroll !important;
      // padding: 5px;
      background-color: #d1ecd63d;
    }
  }
  .colHeight{
    height: 40px;
  }
</style>
