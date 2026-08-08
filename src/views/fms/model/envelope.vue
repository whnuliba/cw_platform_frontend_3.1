/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 包膜参数模板
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
              <el-form-item label="厚度测试压力实际值下限"  >
                <el-input v-model="processContent.doubleCheck.thicknessTestingPressureLower" placeholder="厚度测试压力实际值下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="厚度测试压力实际值上限" >
                <el-input v-model="processContent.doubleCheck.thicknessTestingPressureUpper" placeholder="厚度测试压力实际值上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘测试压力实际值下限"  >
                <el-input v-model="processContent.doubleCheck.insulationTestPressureLower" placeholder="绝缘测试压力实际值下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘测试压力实际值上限" >
                <el-input v-model="processContent.doubleCheck.insulationTestPressureUpper" placeholder="绝缘测试压力实际值上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘电阻测试电压实际值下限"  >
                <el-input v-model="processContent.doubleCheck.insulationResistanceTestLower" placeholder="绝缘电阻测试电压实际值下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘电阻测试电压实际值上限" >
                <el-input v-model="processContent.doubleCheck.insulationResistanceTestUpper" placeholder="绝缘电阻测试电压实际值上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘耐压测试实际值下限"  >
                <el-input v-model="processContent.doubleCheck.insulationWithstandVoltageTestLower" placeholder="绝缘耐压测试实际值下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘耐压测试实际值上限" >
                <el-input v-model="processContent.doubleCheck.insulationWithstandVoltageTestUpper" placeholder="绝缘耐压测试实际值上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="绝缘电阻下限"  >
                <el-input v-model="processContent.doubleCheck.insulationResistanceLower" placeholder="绝缘电阻下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="绝缘电阻上限" >
                <el-input v-model="processContent.doubleCheck.insulationResistanceUpper" placeholder="绝缘电阻上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="漏电流下限"  >
                <el-input v-model="processContent.doubleCheck.leakageCurrentLower" placeholder="漏电流下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="漏电流上限" >
                <el-input v-model="processContent.doubleCheck.leakageCurrentUpper" placeholder="漏电流上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="电池宽度下限"  >
                <el-input v-model="processContent.doubleCheck.batteryWidthLower" placeholder="电池宽度下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="电池宽度上限" >
                <el-input v-model="processContent.doubleCheck.batteryWidthUpper" placeholder="电池宽度上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="电池厚度下限"  >
                <el-input v-model="processContent.doubleCheck.batteryThicknessLower" placeholder="电池厚度下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="电池厚度上限" >
                <el-input v-model="processContent.doubleCheck.batteryThicknessUpper" placeholder="电池厚度上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="正极肩高下限"  >
                <el-input v-model="processContent.doubleCheck.positiveElectrodeShoulderHeightLower" placeholder="正极肩高下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="正极肩高上限" >
                <el-input v-model="processContent.doubleCheck.positiveElectrodeShoulderHeightUpper" placeholder="正极肩高上限" :disabled="isFlowDts"></el-input>
              </el-form-item>


              <el-form-item label="负极肩高下限"  >
                <el-input v-model="processContent.doubleCheck.negativeElectrodeShoulderHeightLower" placeholder="负极肩高下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="负极肩高上限" >
                <el-input v-model="processContent.doubleCheck.negativeElectrodeShoulderHeightUpper" placeholder="负极肩高上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="正极极柱高度下限"  >
                <el-input v-model="processContent.doubleCheck.positivePoleHeightLower" placeholder="正极极柱高度下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="正极极柱高度上限" >
                <el-input v-model="processContent.doubleCheck.positivePoleHeightUpper" placeholder="正极极柱高度上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="负极极柱高度下限"  >
                <el-input v-model="processContent.doubleCheck.negativePoleHeightLower" placeholder="负极极柱高度下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="负极极柱高度上限" >
                <el-input v-model="processContent.doubleCheck.negativePoleHeightUpper" placeholder="负极极柱高度上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="正极对壳体电压下限"  >
                <el-input v-model="processContent.doubleCheck.positiveElectrodeShellPressureLower" placeholder="正极对壳体电压下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="正极对壳体电压上限" >
                <el-input v-model="processContent.doubleCheck.positiveElectrodeShellPressureUpper" placeholder="正极对壳体电压上限" :disabled="isFlowDts"></el-input>
              </el-form-item>

              <el-form-item label="负极对壳体电压下限"  >
                <el-input v-model="processContent.doubleCheck.negativeShellPressureLower" placeholder="负极对壳体电压下限" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="负极对壳体电压上限" >
                <el-input v-model="processContent.doubleCheck.negativeShellPressureUpper" placeholder="负极对壳体电压上限" :disabled="isFlowDts"></el-input>
              </el-form-item>


            </el-tab-pane>
          </el-tabs>

          <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="changeRequest" >变更申请</el-button>
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
    name: 'ChargeModel',
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

            /**厚度测试压力实际值*/
            thicknessTestingPressureUpper:'0',
            thicknessTestingPressureLower:'0',
            /**绝缘测试压力实际值*/
            insulationTestPressureUpper:'0',
            insulationTestPressureLower:'0',
            /**绝缘电阻测试电压实际值*/
            insulationResistanceTestUpper:'0',
            insulationResistanceTestLower:'0',
            /**绝缘耐压测试实际值*/
            insulationWithstandVoltageTestUpper:'0',
            insulationWithstandVoltageTestLower:'0',
            /**绝缘电阻*/
            insulationResistanceUpper:'0',
            insulationResistanceLower:'0',
            /**漏电流*/
            leakageCurrentUpper:'0',
            leakageCurrentLower:'0',
            /**电池宽度*/
            batteryWidthUpper:'0',
            batteryWidthLower:'0',
            /**电池厚度*/
            batteryThicknessUpper:'0',
            batteryThicknessLower:'0',
            /**正极肩高*/
            positiveElectrodeShoulderHeightUpper:'0',
            positiveElectrodeShoulderHeightLower:'0',
            /**负极肩高*/
            negativeElectrodeShoulderHeightUpper:'0',
            negativeElectrodeShoulderHeightLower:'0',
            /**正极极柱高度*/
            positivePoleHeightUpper:'0',
            positivePoleHeightLower:'0',
            /**负极极柱高度*/
            negativePoleHeightUpper:'0',
            negativePoleHeightLower:'0',
            /**正极对壳体电压*/
            positiveElectrodeShellPressureUpper:'0',
            positiveElectrodeShellPressureLower:'0',
            /**负极对壳体电压*/
            negativeShellPressureUpper:'0',
            negativeShellPressureLower:'0',

          },
        },
        processContentInit: {
          pp: {},
          sp: [],
          doubleCheck: {

            /**厚度测试压力实际值*/
            thicknessTestingPressureUpper:'0',
            thicknessTestingPressureLower:'0',
            /**绝缘测试压力实际值*/
            insulationTestPressureUpper:'0',
            insulationTestPressureLower:'0',
            /**绝缘电阻测试电压实际值*/
            insulationResistanceTestUpper:'0',
            insulationResistanceTestLower:'0',
            /**绝缘耐压测试实际值*/
            insulationWithstandVoltageTestUpper:'0',
            insulationWithstandVoltageTestLower:'0',
            /**绝缘电阻*/
            insulationResistanceUpper:'0',
            insulationResistanceLower:'0',
            /**漏电流*/
            leakageCurrentUpper:'0',
            leakageCurrentLower:'0',
            /**电池宽度*/
            batteryWidthUpper:'0',
            batteryWidthLower:'0',
            /**电池厚度*/
            batteryThicknessUpper:'0',
            batteryThicknessLower:'0',
            /**正极肩高*/
            positiveElectrodeShoulderHeightUpper:'0',
            positiveElectrodeShoulderHeightLower:'0',
            /**负极肩高*/
            negativeElectrodeShoulderHeightUpper:'0',
            negativeElectrodeShoulderHeightLower:'0',
            /**正极极柱高度*/
            positivePoleHeightUpper:'0',
            positivePoleHeightLower:'0',
            /**负极极柱高度*/
            negativePoleHeightUpper:'0',
            negativePoleHeightLower:'0',
            /**正极对壳体电压*/
            positiveElectrodeShellPressureUpper:'0',
            positiveElectrodeShellPressureLower:'0',
            /**负极对壳体电压*/
            negativeShellPressureUpper:'0',
            negativeShellPressureLower:'0',

          },
        },
        bizId: '',
        dataUpdateParam: {}
      }
    },
    props: {
      'isFlowDts': Boolean
    },
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
