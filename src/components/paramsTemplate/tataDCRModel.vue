<template>
    <el-col :span="24" :offset="1">
      <div id="DCRParamTemp">
        <div class="container" :style="{margiTop: '10px', height: '90%'}">
          <el-form
            :inline="true"
            :label-position="labelPosition"
            label-width="200px"
            :model="processContent"
          >
            <el-tabs v-model="activeName" class='param-tab-style'>
              <!--工步参数-->
              <el-tab-pane
                label="工步参数"
                name="param1"
              >
                <el-col :span="24">
                  <el-table
                    :data="processContent.sp"
                    border
                    :row-style="rowStyle"
                    :default-expand-all="true"
                    @row-click="rowClick"
                    style="width: 100%;"
                    size="mini"
                  >
                <!-- "type="expand"   -->
                <!-- <el-table-column
                          align="center"
                          width="60" >                      
                      <template slot-scope="props">
                        <el-table
                          :data="props.row.subSp"
                          border
                          style="width: 100%;"
                          size="mini"
                        >
                        <el-table-column
                          prop=""
                          label=""
                          align="center"
                          width="60"                     
                          />
                          <el-table-column
                            prop="stepNo"
                            label="工步号"
                            align="center"
                            width="155"                      
                          />
                       
                          <el-table-column
                            label="操作"
                            width="220"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <el-button  type="text" size="small" @click="addSp()" :disabled="isFlowDts">新增</el-button>
                              <el-button  type="text" size="small" @click="deleteSp(scope.row)" :disabled="isFlowDts">删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                  </el-table-column> -->
                  <!--  :row-class-name="setRowClassName":cell-style="cellStyle" stripe v-if="showOperate(scope.row)"-->
                    <el-table-column
                      prop="stepNo"
                      label="工步号"
                      align="center"
                      width="60"                      
                    >
                    </el-table-column>

                    <el-table-column
                      prop="controlType"
                      label="控制类型"
                      width="155"
                    >
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.controlType" filterable placeholder="请选择" :disabled="isFlowDts">
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
                      prop="current"
                      label="电流(mA)"
                      width="160"
                    >
                      <template slot-scope="scope">
                        <el-input  type="number" style="font-size: 10px" v-if="scope.row.show2" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                        @input="handleInput(scope,'row','current')" v-model="scope.row.current" :disabled="isFlowDts" />
                      </template>
                    </el-table-column>

                    <el-table-column
                            prop="exitCondition"
                            label="结束条件"
                            width="160"
                            
                          >
                          <!-- :render-header="(h, obj) => renderHeader(h, obj, '结束条件')" -->
                            <template slot-scope="scope">
                              <el-select v-for="(con,a) in scope.row.subSpCondition" :key="'con' + a" v-model="scope.row.exitCondition['value' + a]" filterable placeholder="请选择"
                               :disabled="isFlowDts" @change="a===1?conditionChange1(scope.row):conditionChange0(scope.row)">
                                <el-option
                                  v-for="item in ConditionOptions"
                                  :key="item.paramValue"
                                  :label="item.paramDsc"
                                  :value="item.paramValue"
                                />
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column
                          prop="sign"
                          label="条件符号"
                          align="center" width="100">
                          <template slot-scope="scope">
                            <el-select v-for="(sig,b) in scope.row.subSpSign" :key="'sig' + b"  v-model="scope.row.sign['value'+b]" filterable placeholder="请选择" :disabled="isFlowDts">
                                <el-option
                                  v-for="item in SignOptions"
                                  :key="item.paramValue"
                                  :label="item.paramDsc"
                                  :value="item.paramValue"
                                />
                              </el-select>
                          </template>
                    </el-table-column>
                    <el-table-column
                            prop="endValue"
                            label="结束值"
                            width="250"
                          >
                            <template slot-scope="scope">
                              <div v-for="(endV,c) in scope.row.subSpEndVal" :key="'endV' + c" >
                                <el-input v-if="scope.row.endValue[c]['type'] == 'input'" v-model="scope.row.endValue[c]['value'+c]" type="number" style="font-size: 10px"  oninput ="value = value.replace(/[^0-9.-]/g,'')"
                                @input="handleInput(scope,'row','current')" :disabled="isFlowDts" />
                              <!-- </div> -->
                              <!-- <div > -->
                                <el-time-picker
                                v-if="scope.row.endValue[c]['type'] == 'date'"
                                v-model="scope.row.endValue[c]['value'+c]"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss"
                                :disabled="isFlowDts"/>
                              </div>
                           <!-- v-for="(endV,c) in scope.row.subSpEndVal" :key="'sel' + c"  -->
                            </template>
                    </el-table-column>
                    <el-table-column
                      prop="logData.DeltaT"
                      width="250"
                      label="记录条件时间差"
                    > 
                      <template slot-scope="scope">
                        <el-time-picker
                          v-if="scope.row.show3"
                          v-model="scope.row.logData.DeltaT"
                          format="HH:mm:ss"
                          value-format="HH:mm:ss"
                          :disabled="isFlowDts"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="logData.DeltaV"
                      width="250"
                      label="记录条件电压差"
                    > 
                      <template slot-scope="scope">
                        <el-input  type="number" style="font-size: 10px" v-if="scope.row.show2" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                        @input="handleInput(scope,'row','current')" v-model="scope.row.logData.DeltaV" :disabled="isFlowDts" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="logData.DeltaI"
                      width="250"
                      label="记录条件电流差"
                    > 
                      <template slot-scope="scope">
                        <el-input  type="number" style="font-size: 10px" v-if="scope.row.show2" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                        @input="handleInput(scope,'row','current')" v-model="scope.row.logData.DeltaI" :disabled="isFlowDts" />
                      </template>
                    </el-table-column>
                    <el-table-column
                            prop="GOTO"
                            width="150"
                            label="结束类型"
                          >
                            <template slot-scope="scope">
                              <el-select  v-for="(types,d) in scope.row.subSpEndType" :key="'types' + d" v-model="scope.row.GOTO['value'+d]" filterable placeholder="请选择" :disabled="isFlowDts">
                                <el-option
                                  v-for="item in GOTOOptions"
                                  :key="item.paramValue"
                                  :label="item.paramDsc"
                                  :value="item.paramValue"
                                />
                              </el-select>
                            </template>
                    </el-table-column>

                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="220"
                      align="center">
                      <template slot-scope="scope">
                        <el-button v-if="showOperate(scope.row)" type="text" size="small" @click="addSp()" :disabled="isFlowDts">新增</el-button>
                        <el-button type="text" size="small" @click="addCondition(scope)" :disabled="isFlowDts">＋结束条件</el-button>
                        <el-button type="text" size="small" @click="delCondition(scope)" :disabled="isFlowDts">－结束条件</el-button>
                        <el-button  type="text" size="small" @click="deleteSp(scope.row)" :disabled="isFlowDts">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-tab-pane>
            </el-tabs>
            <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
              <el-button type="primary" @click="changeRequest">变更申请
              </el-button>
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
      name: 'tataDCRModel',
      data() {
        return {
          VoltageType:[{label:"结束电压",value:0},{label:"开始电压",value:1}],  // V0电压
          processLibraryData: [],
          processLibraryDataUse:'当前未使用配方库配方',
          /******************************/
          chargeMixtureShow: true,
          dialogVisibleProcessLibrary: false,
          dialogVisibleProcessLibraryList: false,
          dialogVisibleprocessLibraryName: false,
          processLibraryOptions: [],
          processLibraryOptionsParam: '',
          processLibraryName: '',
          /*********************************/
          options: [],
          ConditionOptions: [],
          SignOptions: [],
          GOTOOptions: [],
          flowShow: true,
          flowTempShow: false,
          colHeight: 'colHeight',
          labelPosition: 'left',
          activeName: "param1",
          isCapacityDivision: false,
          isEndVot:false,
          processContent: {
            sp: [{
                stepNo: 1,
                controlType:"",
                current:"",
                voltage:"",
                show2: true,  
                show3: true,
                show4: true,
                show5: true,
                show6: true,
                show7: true,
                exitCondition:{
                  value0:"",
                  value1:"",
                }, 
                sign: {
                  value0:"",
                  value1:"",
                },
                // exitCondition1:"", 
                endValue:
                // {
                //   value0:"",
                //   value1:"",
                // },
                [
                {value0:"",type:"input"},
                {value1:"",type:"input"}
              ],
                GOTO:{
                  value0:"",
                  value1:"",
                },
                logData:{
                  DeltaT:"",
                  DeltaV:"",
                  DeltaI:"",
                },
                subSpCondition:[{No:1}],
                subSpSign:[{No:1}],
                subSpEndVal:[{No:1}],
                subSpEndType:[{No:1}],
              }],
          },
          processContentInit: {
            sp: [{
              stepNo: 1,
              controlType:"",
              current:"",
              voltage:"",
              show2: true,  
              show3: true,
              show4: true,
              show5: true,
              show6: true,
              show7: true,
              exitCondition:{
                value0:"",
                value1:"",
              }, 
              sign: {
                value0:"",
                value1:"",
              },
              // exitCondition1:"", 
              endValue:
              // {
              //     value0:"",
              //     value1:"",
                // },
                [
                {value0:"",type:"input"},
                {value1:"",type:"input"}
              ],
              GOTO:{
                value0:"",
                value1:"",
              },
              logData:{
                  DeltaT:"",
                  DeltaV:"",
                  DeltaI:"",
                },
              // GOTO1:"",
              subSpCondition:[{No:1}],
              subSpSign:[{No:1}],
              subSpEndVal:[{No:1}],
              subSpEndType:[{No:1}],
            }],
          },
          conditionVal:[],
          conditionVal1:[],
          bizId: '',
          dataUpdateParam: {},
          currrentSelRowId: '',
          addValArea: false,
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
        // this.initProcessLibraryOptions(3)
      },
      methods: {
              renderHeader(h, { column, $index }, type){
                let that = this;
                return h(
                  'div',[
                    // 列名称
                    h('span', column.label),
                    // 按钮
                    h('el-button', {
                      props: {
                        type: 'text',
                        size: 'small',
                      },
                      style: 'margin-left: 5px;border:1px  solid #409eff;',
                      on: {
                        click: function() {
                          that.clickButton(type);
                        }
                      }
                    }, '+')
                  ],
                )
            },
            
            // 按钮点击事件
            clickButton(type) {
                console.log('我点击了' + type + '的列');
                this.addValArea = !this.addValArea
            },

            conditionChange0(row){
              this.conditionVal = [row.exitCondition.value0,row.stepNo]
              this.processContent.sp.map((item,i) => {
                  if(row.stepNo === (i+1) && this.conditionVal[0] === 'exitStepTime') {
                    console.log('结束值1','时间',row.stepNo,item)
                      item.endValue[0].type = "date"
                  } else if(row.stepNo === (i+1) && this.conditionVal[0] != 'exitStepTime'){
                    console.log('结束值1','INPUT',row.stepNo,item)
                      item.endValue[0].type = "input"
                  } 
                  console.log(this.processContent.sp)
                  return item   
              })
              
            },
            conditionChange1(row){
              this.conditionVal1 = [row.exitCondition.value1,row.stepNo]
              this.processContent.sp.map((item,i) => {
                  if(row.stepNo === (i+1) && this.conditionVal1[0] === 'exitStepTime') {
                    console.log('结束值2','时间',row.stepNo,item)
                      item.endValue[1].type = "date"
                  } else if(row.stepNo === (i+1) && this.conditionVal1[0] != 'exitStepTime'){
                    console.log('结束值2','时间',row.stepNo,item)
                      item.endValue[1].type = "input"
                  }
                  console.log(this.processContent.sp)
                  return item  
              })
            },
            rowClick(row, col, e){
                this.currrentSelRowId = row.stepNo
            },
            setRowClassName({row, rowIndex}){
                console.log(row, rowIndex)                
            },
            rowStyle({row, rowIndex}){
                if(row.stepNo == this.currrentSelRowId) {
                    return {
                      backgroundColor: 'lightblue',
                      color: 'white'
                    }
                } else {
                    return  { color: 'black' };
                }  
            },
            // el-input框设定浮点型
            handleInput(obj,attr,name) {
                // 先把非数字的都替换掉，除了数字和 .
                obj[attr][name] = obj[attr][name].replace(/[^\d.]/g, "")
                // 保证只有出现一个 . 而没有多个 .
                obj[attr][name] = obj[attr][name].replace(/\.{2,}/g, ".")
                // 必须保证第一个为数字而不是 .
                obj[attr][name] = obj[attr][name].replace(/^\./g, "")
                // 保证 . 只出现一次，而不能出现两次以上
                obj[attr][name] = obj[attr][name]
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                // 只能输入 1 位小数
                obj[attr][name] = obj[attr][name].replace(
                  /^(\\-)*(\d+)\.(\d).*$/,
                  "$1$2.$3"
                )
                // 8是允许输入的整数最大位数，8是允许输入的小数最大位数
                obj[attr][name] = obj[attr][name].replace(
                  /^\D*(\d{0,8}(?:\.\d{0,1})?).*$/g,
                  "$1"
                )
  
              },
        editProcessClick(row) {
          const json = {
            data: {
              id: row.id,
              parameter: JSON.stringify(this.processContent)
            }
          }
          this.$confirm('是否替换工艺库名称为：[' + row.processName + ']的工艺参数！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            httpUtils.actionFmsPost('/processlibrary/add', json).then(data => {
              if (data) {
                this.$message.success('工艺库名称：[' + row.processName + ']替换成功！')
              } else {
                this.$message.error('工艺库名称：[' + row.processName + ']替换失败！')
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消替换'
            });
          });
        },
        deleteProcessClick(row) {
          const json = {
            data: row.id
          }
          this.$confirm('是否删除工艺库名称为：[' + row.processName + ']的工艺参数！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            httpUtils.actionFmsPost('/processlibrary/del', json).then(data => {
              if (data) {
                this.$message.success('工艺库名称：[' + row.processName + ']删除成功！')
                this.initProcessLibraryOptions()
              } else {
                this.$message.error('工艺库名称：[' + row.processName + ']删除失败！')
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
  
  
        handleCloseProcessLibrary(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {
            });
        },
        initProcessLibraryOptions(state) {
          const json = {
            current: 1,
            pageSize: 99999,
            requestData: {
              processCode: this.dataUpdateParam.processId,
              value1: this.dataUpdateParam.flowId
            }
          }
          httpUtils.actionFmsPost('/processlibrary/list', json).then(data => {
            let res = data.data
            this.processLibraryData = res
            this.processLibraryOptions = []
            res.forEach(item => {
              if(item.value3 === "1"){
                this.processLibraryDataUse = "当前使用配方库配方为：[" + item.processName + "]"
              }
              this.processLibraryOptions.push({
                label: item.processName,
                value: item.id + "#" + item.processName + "#" + item.parameter
              })
            })
            if (state == 0)
              this.dialogVisibleProcessLibrary = true
            else if (state == 1)
              this.dialogVisibleProcessLibraryList = true
          })
        },
        processLibraryOptionsClick() {
          let param = this.processLibraryOptionsParam.split("#")
          this.$confirm('是否确定使用工艺库名称为：[' + param[1] + ']的工艺参数！使用后请前往确认参数是否正确符合使用！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            /**区别最新在用的工艺库*/
            const json = {data: param[0]}
            httpUtils.actionFmsPost('/processlibrary/editUse', json).then(data => {})
            /**使用工艺配方*/
            let jsonNew = JSON.parse(param[2])
            if(jsonNew.doubleCheck == undefined){
              jsonNew.doubleCheck = {}
            }
            this.processContent = jsonNew
            this.dialogVisibleProcessLibrary = false
            this.processLibraryDataUse = "当前使用配方库配方为：[" + param[1] + "]"
            this.$message.success('工艺库配方[' + param[1] + ']使用成功！')
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '已取消使用配方['+param[1]+']'
            });
          });
        },
        processLibraryAddClick() {
          const json = {
            data: {
              parameter: JSON.stringify(this.processContent),
              processCode: this.dataUpdateParam.processId,
              value1: this.dataUpdateParam.flowId,
              processName: this.processLibraryName
            }
          }
          httpUtils.actionFmsPost('/processlibrary/add', json).then(data => {
            if (data) {
              this.$message({
                message: '提交成功！',
                type: 'success'
              })
              this.dialogVisibleprocessLibraryName = false
            }
          })
        },
  
        /*************************************/
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
          const json = {
            data: {
              flowDtId: this.dataUpdateParam.flowDtId,
              id: this.dataUpdateParam.id,
              processContent: JSON.stringify(this.processContent),
              processId: this.dataUpdateParam.processId
            }
          }
          console.log(JSON.parse(json.data.processContent))
          // httpUtils.actionFmsPost('/process-dts-tmp/add', json).then(data => {
          //   if (data) {
          //     this.$message({
          //       message: '添加成功！',
          //       type: 'success'
          //     })
          //     this.$emit('initOldDraggingNode')
          //   }
          // })
        },
        check() {
          // if (parseInt(this.processContent.pp.t1TimeUp) < parseInt(this.processContent.pp.t1TimeLow)) {
          //   return 'T1时间电压上限[' + this.processContent.pp.t1TimeUp + ']小于下限[' + this.processContent.pp.t1TimeLow + ']'
          // } else if (parseInt(this.processContent.pp.t2TimeUp) < parseInt(this.processContent.pp.t2TimeLow)) {
          //   return 'T2时间电压上限[' + this.processContent.pp.t2TimeUp + ']小于下限[' + this.processContent.pp.t2TimeLow + ']'
          // } else if (parseInt(this.processContent.pp.t5CurrentUp) < parseInt(this.processContent.pp.t5CurrentLow)) {
          //   return 'T5时间电流上限[' + this.processContent.pp.t5CurrentUp + ']小于下限[' + this.processContent.pp.t5CurrentLow + ']'
          // } 
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
            }
            this.$emit('dialogSubmit')
          })
        },
        addSp() {
          const json = {
              stepNo: this.processContent.sp.length + 1,
              controlType:"",
              current:"",
              voltage:"",
              show2: true,  
              show3: true,
              show4: true,
              show5: true,
              show6: true,
              show7: true,
              exitCondition:{
                value0:"",
                value1:"",
              }, 
              sign: {
                value0:"",
                value1:"",
              },
              // exitCondition1:"", 
              endValue:
              // {
              //     value0:"",
              //     value1:"",
              //   },
                [
                {value0:"",type:"input"},
                {value1:"",type:"input"}
              ],
              GOTO:{
                value0:"",
                value1:"",
              },
              logData:{
                  DeltaT:"",
                  DeltaV:"",
                  DeltaI:"",
                },
              subSpCondition:[{No:1}],
              subSpSign:[{No:1}],
              subSpEndVal:[{No:1}],
              subSpEndType:[{No:1}],
          }
          this.processContent.sp.push(json)
        },
        addCondition(scope) {
            this.processContent.sp.forEach((item, i) => {
                if (scope.row.stepNo-1 == i) {
                  const condition = {  No: item.subSpCondition.length + 1 }
                  if(item.subSpCondition.length < 2 || item.subSpSign.length<2 || item.subSpEndVal.length<2 || item.subSpEndType.length<2) {
                      item.subSpCondition.push(condition)
                      item.subSpSign.push(condition)
                      item.subSpEndVal.push(condition)
                      item.subSpEndType.push(condition)
                  }
                  
                }
            })
          console.log(this.processContent.sp)
        },
        delCondition(scope) {
            const data = this.processContent.sp
            data.forEach((item, i) => {
                if (scope.row.stepNo-1 == i) {
                 for (let a = 0; a < item.subSpCondition.length; a++) {
                  if (item.subSpCondition.length>1) {
                      item.subSpCondition.splice(item.subSpCondition.length-1, 1)
                      break
                    }
                  }
                 for (let a = 0; a < item.subSpSign.length; a++) {
                  if (item.subSpSign.length>1) {
                      item.subSpSign.splice(item.subSpSign.length-1, 1)
                      break
                    }
                  }
                 for (let a = 0; a < item.subSpEndVal.length; a++) {
                  if (item.subSpEndVal.length>1) {
                      item.subSpEndVal.splice(item.subSpEndVal.length-1, 1)
                      break
                    }
                  }
                 for (let a = 0; a < item.subSpEndType.length; a++) {
                  if (item.subSpEndType.length>1) {
                      item.subSpEndType.splice(item.subSpEndType.length-1, 1)
                      break
                    }
                  }
                }
              })
          console.log(this.processContent.sp)
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
          // const json = {data: 'FMS_STEP'}
          // httpUtils.actionAuthPost('/sys/get-param-by-code', json).then(data => {
            this.options = [ {paramDsc:'恒流充电',paramValue:'CCC'},{paramDsc:'恒流放电',paramValue:'CCD'},{paramDsc:'静置',paramValue:'SLEEP'} ]
            this.ConditionOptions = [ {paramDsc:'电压',paramValue:'exitVoltage'},{paramDsc:'电流',paramValue:'exitCurrent'},
                                    {paramDsc:'容量',paramValue:'exitCapacity'},{paramDsc:'工步时间',paramValue:'exitStepTime'} ]
            this.SignOptions = [ {paramDsc:'>=',paramValue:'>='},{paramDsc:'<=',paramValue:'<='},
                                    {paramDsc:'>',paramValue:'>'},{paramDsc:'<',paramValue:'<'} ]
            this.GOTOOptions = [ {paramDsc:'完成',paramValue:'finish'},{paramDsc:'继续',paramValue:'continue'}]
          // })
        },
        dataUpdate(row, url, state) {
          if(row.processCode === "3003" || row.processCode === "3004" || row.processCode === "3005") {  //分容节点就可设置分容容量条件
              // 3003 分容 3004 充放电1 3005 充放电2
            this.isCapacityDivision = true
          } else {
            this.isCapacityDivision = false
          }
          if(row.processCode === "3001" || row.processCode === "3002") {  // 3001预化成 3002 化成
            //预化成或化成节点显示结束电压下限和上限
            this.isEndVot = true
          } else {
            this.isEndVot = false
          }
          /* 如果现在模版是点树节点显示的话用以下判断显示相应配方*/
          if (row.label) {
            if(row.label.split("_")[1] === "3003" || row.label.split("_")[1] === "3004" || row.label.split("_")[1] === "3005") {  //分容节点就可设置分容容量条件
              this.isCapacityDivision = true
            } else {
              this.isCapacityDivision = false
            }
            if(row.label.split("_")[1]  === "3001" || row.label.split("_")[1]  === "3002") {            
              //预化成或化成节点显示结束电压下限和上限
              this.isEndVot = true
            } else {
              this.isEndVot = false
            }
          } 
          
  
          if (state == 1) {
            this.flowShow = true
            this.flowTempShow = false
            this.chargeMixtureShow = false
          } else if (state == 2) {
            this.flowShow = false
            this.flowTempShow = true
            this.chargeMixtureShow = true
          } else if (state == 3) {
            this.flowShow = false
            this.flowTempShow = false
            this.chargeMixtureShow = false
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
              this.dataUpdateParam.flowId = row.flowId
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
          // return this.stopInput(row.row.stepState, row.columnIndex, row) + ';padding: 1px 0 !important;'
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    #DCRParamTemp {
      .table-row-class-name{
        background-color: red;  
        color: red;
      }
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
    }
  
  </style>
  <style>
     .capacity-division .el-form-item {
          margin-right:  7%;
      }
  </style>
  