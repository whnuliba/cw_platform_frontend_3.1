<template>
  <el-col :span="23" :offset="1">
    <div>
      <div class="container" style="margin-top: 10px">
        <el-form
          :inline="true"
          :label-position="labelPosition"
          label-width="180px"
          :model="processContent"
        >

          <el-tabs v-model="activeName" class="param-tab-style">
            <!--保护参数-->
            <el-tab-pane
              label="下发参数"
              name="param1"
            >
              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="充电电压上限(mV)">
                <el-input v-model="processContent.pp.pdOverVoltage" placeholder="充电电压上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电流上限(mA)">
                <el-input v-model="processContent.pp.pdChargeOverCurrent" placeholder="充电电流上限" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="充电容量上限(mAh)">
                <el-input v-model="processContent.pp.pdChargeCapacity" placeholder="充电容量上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="DeltaI 监测(mA)">
                <el-input v-model="processContent.pp.pdDeltaI" placeholder="DeltaI 监测" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="放电电压下限(mV)">
                <el-input v-model="processContent.pp.pdLackVoltage" placeholder="放电电压下限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电流上限(mA)">
                <el-input v-model="processContent.pp.pdDischargeOverCurrent" placeholder="放电电流上限" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="放电容量上限(mAh)">
                <el-input v-model="processContent.pp.pdDischargeCapacity" placeholder="放电容量上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="延时保护(S)">
                <el-input v-model="processContent.pp.pdDelay" placeholder="延时保护" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="DCIR下限(mΩ)">
                <el-input v-model="processContent.pp.DcirLowLimit" placeholder="DCIR下限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="DCIR上限(mΩ)">
                <el-input v-model="processContent.pp.DcirHighLimit" placeholder="DCIR上限" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="V1工步号">
                <el-input v-model="processContent.pp.StepNo_First" placeholder="V1工步号" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T1时间">
                <el-input v-model="processContent.pp.FirstPointTime" placeholder="T1时间" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="V2工步号">
                <el-input v-model="processContent.pp.StepNo_Second" placeholder="V2工步号" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="V2时间">
                <el-input v-model="processContent.pp.SecondPointTime" placeholder="V2时间" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->

              <el-col :span="24">
                <el-table
                  :data="processContent.sp"
                  stripe
                  border
                  :cell-style="cellStyle"
                  style="width: 100%;"
                >
                  <el-table-column
                    prop="stepNo"
                    label="步次"
                    align="center"
                  />
                  <el-table-column
                    prop="stepState"
                    label="工步"
                    width="155"
                  >
                    <template slot-scope="scope" style="height: 30px">
                      <el-select v-model="scope.row.stepState" filterable placeholder="请选择" :disabled="isFlowDts">
                        <el-option
                          v-for="item in options"
                          :key="item.paramValue"
                          :label="item.paramDsc"
                          :value="item.paramValue"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepTime"
                    label="时间(s)"
                    width="85"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-model="scope.row.stepTime" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepCurrent"
                    width="80"
                    label="电流(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-if="scope.row.show3" v-model="scope.row.stepCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepVoltage"
                    width="80"
                    label="电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-if="scope.row.show4" v-model="scope.row.stepVoltage" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndVoltage"
                    width="105"
                    label="结束电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-if="scope.row.show5" v-model="scope.row.stepEndVoltage" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCurrent"
                    width="105"
                    label="结束电流(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-if="scope.row.show6" v-model="scope.row.stepEndCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepRecordTime"
                    width="95"
                    label="记录间隔(s)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input v-model="scope.row.stepRecordTime" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="220"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button v-if="showOperate(scope.row)" type="text" size="small" @click="addSp()" :disabled="isFlowDts">新增</el-button>
                      <el-button type="text" size="small" @click="deleteSp(scope.row)" :disabled="isFlowDts">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-tab-pane>


            <!-- <el-tab-pane
              label="double check参数"
              name="param2"
            >

              <el-form-item label="直流电阻下限(mΩ)">
                <el-input v-model="processContent.doubleCheck.dCResistanceLower" placeholder="直流电阻下限(mΩ)" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="直流电阻上限(mΩ)">
                <el-input v-model="processContent.doubleCheck.dCResistanceUpper" placeholder="直流电阻上限(mΩ)" :disabled="isFlowDts"></el-input>
              </el-form-item>

            </el-tab-pane> -->

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
    name: 'PointsForModel',
    data() {
      return {
        colHeight: 'colHeight',
        options: [],
        flowShow: true,
        flowTempShow: false,
        labelPosition: 'left',
        activeName:'param1',
        processContent: {
          pp: {
            pdOverVoltage: '',  //充电电压上限
            pdChargeOverCurrent: '', //充电电流上限
            pdChargeCapacity: '',  //充电容量上限
            pdDeltaI: '',  //DeltaI 监测
            pdLackVoltage: '', //放电电压下限
            pdDischargeOverCurrent: '', //放电电流上限
            pdDischargeCapacity: '', //放电容量上限
            pdDelay: '', //延时保护
            DcirLowLimit: '', //DCIR下限
            DcirHighLimit: '', //DCIR上限
            StepNo_First: '',  //V1工步号
            FirstPointTime: '', //T1时间
            StepNo_Second: '', //V2工步号
            SecondPointTime: '' //V2时间

          },
          sp: [{
            cycles: '',
            endStep: '',
            startStep: '',
            stepCurrent: '', //电流(mA)
            stepEndCurrent: '', //结束电流(mA)
            stepEndVoltage: '', //结束电压(mV)
            stepNo: 1,
            stepRecordTime: '', //记录间隔(s)
            stepState: '',
            stepTime: '', //时间(s)
            stepVacuum: '',
            stepVoltLow: '',
            stepVoltUp: '',
            stepVoltage: '' //电压
          }],
          // doubleCheck:{
          //   dCResistanceUpper:'0',
          //   dCResistanceLower:'0',
          // },
        },
        processContentInit: {
          pp: {
            pdOverVoltage: '',
            pdChargeOverCurrent: '',
            pdChargeCapacity: '',
            pdDeltaI: '',
            pdLackVoltage: '',
            pdDischargeOverCurrent: '',
            pdDischargeCapacity: '',
            pdDelay: '',
            DcirLowLimit: '',
            DcirHighLimit: '',
            StepNo_First: '',
            FirstPointTime: '',
            StepNo_Second: '',
            SecondPointTime: ''
          },
          sp: [{
            cycles: '',
            endStep: '',
            startStep: '',
            stepCurrent: '',
            stepEndCurrent: '',
            stepEndVoltage: '',
            stepNo: 1,
            stepRecordTime: '',
            stepState: '',
            stepTime: '',
            stepVacuum: '',
            stepVoltLow: '',
            stepVoltUp: '',
            stepVoltage: ''
          }],
          // doubleCheck:{
          //   dCResistanceUpper:'0',
          //   dCResistanceLower:'0',
          // },
        },
        dataUpdateParam: {},
        bizId: ''
      }
    },
    props: {
      'isShowSubmit': Number,
      'isFlowDts': Boolean
    },
    watch: {
      'isShowSubmit': {
        handler: function (oldV, newV) {
          console.log(oldV, newV)
        },
        deep: true,
      }
    },
    created() {
      this.initStepState()
    },
    methods: {
      nowAdd() {
        let checkBody = this.check();
        if (checkBody) {
          this.$message({
            message: checkBody,
            type: 'error'
          })
          return false;
        }

        const json = {
          data: {
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
      check() {
        if (parseInt(this.processContent.pp.voltageUp) < parseInt(this.processContent.pp.voltageLow)) {
          return '电压上限[' + this.processContent.pp.voltageUp + ']小于下限[' + this.processContent.pp.voltageLow + ']'
        } else if (parseInt(this.processContent.pp.DCIRUp01) < parseInt(this.processContent.pp.DCIRLow01)) {
          return 'IR1上限[' + this.processContent.pp.DCIRUp01 + ']小于下限[' + this.processContent.pp.DCIRLow01 + ']'
        } else if (parseInt(this.processContent.pp.DCIRUp02) < parseInt(this.processContent.pp.DCIRLow02)) {
          return 'IR2上限[' + this.processContent.pp.DCIRUp02 + ']小于下限[' + this.processContent.pp.DCIRLow01 + ']'
        }
        return '';
      },
      changeRequest() {
        const json = {data: {bizId: this.bizId, changeType: 1}}
        httpUtils.actionFmsPost('/process-flow/process-flow-change-apply', json).then(data => {
          if (data) {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
            // this.$emit('dialogSubmit')
            this.$emit('dialogSubmit')
          }
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
        const json = {data: 'FMS_STEP'}
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
        if (this.isShowSubmit === 1) {
          this.flowTempShow = false
        }
        this.bizId = row.id
        const json = {data: row.id}
        this.dataUpdateParam.processId = row.processId
        this.dataUpdateParam.flowDtId = row.id
        httpUtils.actionFmsPost(url, json).then(data => {
          if (data != null) {
            this.dataUpdateParam = data
            let getJson = JSON.parse(data.processContent);
            for (let key in this.processContent) {
              if (getJson[key] == undefined) {
                getJson[key] = {};
              }
            }
            try {
              this.processContent = getJson
            } catch (e) {
              this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
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
            row['show' + index] = false
            return 'background:#7d7d7d;color:red'
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
  ::v-deep .el-input__inner {
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

  .colHeight {
    height: 40px;
  }
</style>
