/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 一二次注液参数模板
*/
<template>
  <el-col :span="24" :offset="1">
    <div>
      <div class="container" :style="{margiTop: '10px', height: '90%'}">
        <el-form
          :inline="true"
          :label-position="labelPosition"
          label-width="200px"
          :model="processContent"
        >
          <el-tabs v-model="activeName" class="param-tab-style">

            <!--double check参数-->
            <el-tab-pane
              label="double check参数"
              name="param2"
            >
              <el-form-item label="注液前重量下限"  >
                <el-input v-model="processContent.doubleCheck.weightBeforeLiquidInjectionLower" placeholder="注液前重量下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="注液前重量上限" >
                <el-input v-model="processContent.doubleCheck.weightBeforeLiquidInjectionUpper" placeholder="注液前重量上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="注液后重量下限"  >
                <el-input v-model="processContent.doubleCheck.weightAfterLiquidInjectionLower" placeholder="注液后重量下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="注液后重量上限" >
                <el-input v-model="processContent.doubleCheck.weightAfterLiquidInjectionUpper" placeholder="注液后重量上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="注液量下限"  >
                <el-input v-model="processContent.doubleCheck.LiquidInjectionLower" placeholder="注液量下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="注液量上限" >
                <el-input v-model="processContent.doubleCheck.LiquidInjectionUpper" placeholder="注液量上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘测试vd1下限"  >
                <el-input v-model="processContent.doubleCheck.insulationTestVd1Lower" placeholder="绝缘测试vd1下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘测试vd1上限" >
                <el-input v-model="processContent.doubleCheck.insulationTestVd1Upper" placeholder="绝缘测试vd1上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘测试vd2下限"  >
                <el-input v-model="processContent.doubleCheck.insulationTestVd2Lower" placeholder="绝缘测试vd2下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘测试vd2上限" >
                <el-input v-model="processContent.doubleCheck.insulationTestVd2Upper" placeholder="绝缘测试vd2上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘测试电压下限"  >
                <el-input v-model="processContent.doubleCheck.insulationTestVoltageLower" placeholder="绝缘测试电压下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘测试电压上限" >
                <el-input v-model="processContent.doubleCheck.insulationTestVoltageUpper" placeholder="绝缘测试电压上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="保有量下限"  >
                <el-input v-model="processContent.doubleCheck.inventoryLower" placeholder="保有量下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="保有量上限" >
                <el-input v-model="processContent.doubleCheck.inventoryUpper" placeholder="保有量上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="回氦前真空下限"  >
                <el-input v-model="processContent.doubleCheck.vacuumBeforeHeliumReturnLower" placeholder="回氦前真空下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="回氦前真空上限" >
                <el-input v-model="processContent.doubleCheck.vacuumBeforeHeliumReturnUpper" placeholder="回氦前真空上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="回氦后真空下限"  >
                <el-input v-model="processContent.doubleCheck.VacuumAfterHeliumReturnLower" placeholder="回氦后真空下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="回氦后真空上限" >
                <el-input v-model="processContent.doubleCheck.VacuumAfterHeliumReturnUpper" placeholder="回氦后真空上限" :disabled="isFlowDts"></el-input>
              </el-form-item>


            </el-tab-pane>
          </el-tabs>

          <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="changeRequest">变更申请</el-button>
            <!-- v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" -->
          </el-col>
          <el-col v-if="flowTempShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="nowAdd">立即添加</el-button>
            <!--<el-button type="primary" @click="changeRequest">重置</el-button>-->
          </el-col>
        </el-form>
      </div>
    </div>
  </el-col>
</template>

<script>
  import httpUtils from '@/api/fms-common'

  export default {
    name: 'injectingLiquidModel',
    data() {
      return {
        options: [],
        flowShow: true,
        flowTempShow: false,
        colHeight: 'colHeight',
        labelPosition: 'left',
        activeName: 'param2',
        processContent: {
          pp: {},
          sp: [],
          doubleCheck: {
            /**前重*/
            weightBeforeLiquidInjectionUpper:'0',
            weightBeforeLiquidInjectionLower:'0',
            /**后重*/
            weightAfterLiquidInjectionUpper:'0',
            weightAfterLiquidInjectionLower:'0',
            /**注液量*/
            LiquidInjectionUpper:'0',
            LiquidInjectionLower:'0',
            /**绝缘测试VD1*/
            insulationTestVd1Upper:'0',
            insulationTestVd1Lower:'0',
            /**绝缘测试VD2*/
            insulationTestVd2Upper:'0',
            insulationTestVd2Lower:'0',
            /**绝缘测试实际电压*/
            insulationTestVoltageUpper:'0',
            insulationTestVoltageLower:'0',
            /**电池保有量*/
            inventoryUpper:'0',
            inventoryLower:'0',
            /**回氦前真空*/
            vacuumBeforeHeliumReturnUpper:'0',
            vacuumBeforeHeliumReturnLower:'0',
            /**回氦后真空*/
            VacuumAfterHeliumReturnUpper:'0',
            VacuumAfterHeliumReturnLower:'0',
          },
        },
        processContentInit: {
          pp: {},
          sp: [],
          doubleCheck: {
            /**前重*/
            weightBeforeLiquidInjectionUpper:'0',
            weightBeforeLiquidInjectionLower:'0',
            /**后重*/
            weightAfterLiquidInjectionUpper:'0',
            weightAfterLiquidInjectionLower:'0',
            /**注液量*/
            LiquidInjectionUpper:'0',
            LiquidInjectionLower:'0',
            /**绝缘测试VD1*/
            insulationTestVd1Upper:'0',
            insulationTestVd1Lower:'0',
            /**绝缘测试VD2*/
            insulationTestVd2Upper:'0',
            insulationTestVd2Lower:'0',
            /**绝缘测试实际电压*/
            insulationTestVoltageUpper:'0',
            insulationTestVoltageLower:'0',
            /**电池保有量*/
            inventoryUpper:'0',
            inventoryLower:'0',
            /**回氦前真空*/
            vacuumBeforeHeliumReturnUpper:'0',
            vacuumBeforeHeliumReturnLower:'0',
            /**回氦后真空*/
            VacuumAfterHeliumReturnUpper:'0',
            VacuumAfterHeliumReturnLower:'0',
          },
        },
        bizId: '',
        dataUpdateParam: {}
      }
    },
    props:{  'isFlowDts': Boolean },
    created() {
      this.initStepState()
    },
    methods: {
      nowAdd() {
        /*参数上下限验证*/
        // let checkBody = this.check();
        // if(checkBody){
        //   this.$message({
        //     message: checkBody,
        //     type: 'error'
        //   })
        //   return false;
        // }

        const json = { data: {
          flowDtId: this.dataUpdateParam.flowDtId,
          id: this.dataUpdateParam.id,
          processContent: JSON.stringify(this.processContent),
          processId: this.dataUpdateParam.processId
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
      check(){
        if(parseInt(this.processContent.pp.chargeCapacityUp) < parseInt(this.processContent.pp.chargeCapacityDown))
        {
          return '充电容量上限['+this.processContent.pp.chargeCapacityUp+']小于下限['+this.processContent.pp.chargeCapacityDown+']'
        }else if(parseInt(this.processContent.pp.dischargeCapacityUp) < parseInt(this.processContent.pp.dischargeCapacityLow))
        {
          return '放电容量上限['+this.processContent.pp.dischargeCapacityUp+']小于下限['+this.processContent.pp.dischargeCapacityLow+']'
        }else if(parseInt(this.processContent.pp.boardTemperaUp) < parseInt(this.processContent.pp.boardTemperaLow))
        {
          return '驱动板温度上限['+this.processContent.pp.boardTemperaUp+']小于下限['+this.processContent.pp.boardTemperaLow+']'
        }else if(parseInt(this.processContent.pp.channelTemperaUp) < parseInt(this.processContent.pp.channelTemperaLow))
        {
          return '通道温度上限['+this.processContent.pp.channelTemperaUp+']小于下限['+this.processContent.pp.channelTemperaLow+']'
        }
        if(this.processContent.pp.vacuumEnable == 1){
          if(parseInt(this.processContent.pp.endVoltUpOK) < parseInt(this.processContent.pp.endVoltLowOK))
          {
            return '合格电压上限['+this.processContent.pp.endVoltUpOK+']小于下限['+this.processContent.pp.endVoltLowOK+']'
          }else if(parseInt(this.processContent.pp.endCapaUpOK) < parseInt(this.processContent.pp.endCapaLowOK))
          {
            return '合格容量上限['+this.processContent.pp.endCapaUpOK+']小于下限['+this.processContent.pp.endCapaLowOK+']'
          }
        }
        return '';
      },
      changeRequest() {
        const json = { data: { bizId: this.bizId, changeType: 1 }}
        httpUtils.actionFmsPost('/process-flow/process-flow-change-apply', json).then(data => {
          if (data) {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }
          this.$emit('dialogSubmit')
        })
      },
      addSp() {
        const json = {
          cycles: '',
          endStep: '',
          startStep: '',
          stepCurrent: '',
          stepEndCurrent: '',
          stepEndVoltage: '',
          stepNo: this.processContent.sp.length + 1,
          stepRecordTime: '',
          stepState: '',
          stepTime: '',
          stepVacuum: '',
          stepVoltLow: '',
          stepVoltUp: '',
          stepVoltage: ''
        }
        this.processContent.sp.push(json)
      },
      deleteSp(row) {
        const data = this.processContent.sp
        if (data.length < 2) {
          this.$message.error('当前数据为最后一条,无法删除！')
          return false
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].stepNo == row.stepNo) {
            this.processContent.sp.splice(i, 1)
            for (let j = 0; j < data.length; j++) {
              this.processContent.sp[j].stepNo = (j + 1)
            }
            break
          }
        }
      },
      showOperate(row) {
        return this.processContent.sp.length == row.stepNo
      },
      initStepState() {
        const json = { data: 'FMS_STEP' }
        httpUtils.actionAuthPost('/sys/get-param-by-code', json).then(data => {
          this.options = data
        })
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
        this.bizId = row.id
        const json = { data: row.id }
        this.dataUpdateParam.processId = row.processId
        this.dataUpdateParam.flowDtId = row.id
        httpUtils.actionFmsPost(url, json).then(data => {
          if (data != null) {
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
          } else {
            this.dataUpdateParam.id = null;
            this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
          }
        })
      },
      cellStyle(row) { // 根据报警级别显示颜色
        return this.stopInput(row.row.stepState, row.columnIndex, row) + ';padding: 1px 0 !important;'
      },
      stopInput(chargeStep, index, row) {
        if (chargeStep === 'DC') {
          if (index == 4 || index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'Sleep') {
          if (index == 3 || index == 4 || index == 5 || index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red;'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CCCV') {
          if (index == 5) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CC') {
          if (index == 4 || index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CV') {
          if (index == 3 || index == 5) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep .el-input__inner{
    height: 30px;
  }
  ::v-deep .param-tab-style {
     .el-tabs__content {
      height: 60vh !important;
      overflow: scroll !important;
      padding: 5px;
      background-color: #d1ecd63d;
    }
  }
  .colHeight{
    height: 40px;
  }
</style>
