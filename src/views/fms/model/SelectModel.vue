<template>
  <el-col :span="22" :offset=1>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="param-tab-style">
        <el-tab-pane
          label="分档(正常)"
          name="param1"
        >
          <div class="container" style="margin-top: 10px">
            <el-form :inline="true" :label-position="labelPosition" label-width="180px" :model="processContent"
            >
              <el-col :span="24" :class="colHeight"
                      style="text-align: center;color: #606266;font-weight: 700;margin-top: 20px">
                <div style="width: 16%;float: left">
                  内阻：
                  <el-switch
                    v-model="processContent.irEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
                <div style="width: 16%;float: left">
                  电压：
                  <el-switch
                    v-model="processContent.voltageEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
                <div style="width: 16%;float: left">
                  厚度：
                  <el-switch
                    v-model="processContent.thickEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
                <div style="width: 16%;float: left">
                  K值:
                  <el-switch
                    v-model="processContent.kEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
                <div style="width: 16%;float: left">
                  容量：
                  <el-switch
                    v-model="processContent.capacityEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
                <div style="width: 16%;float: left">
                  DCIR:
                  <el-switch
                    v-model="processContent.dcirEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor"
                    :disabled="isFlowDts">
                  </el-switch>
                </div>
              </el-col>

              <el-col :span="24" style="text-align: center;margin-top: 10px">
                <hr style="margin-top: 10px;margin-bottom: 10px"/>
              </el-col>

              <el-col :span="24" :class="colHeight">
                <el-form-item label="默认等级" :style="{float:'left'}">
                  <el-select v-model="processContent.defaultGradeMark" placeholder="默认等级">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" :disabled="isFlowDts">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24" style="text-align: center;margin-top: 20px">
                <hr style="margin-top: 10px;margin-bottom: 10px"/>
              </el-col>

              <el-col :span="24" v-for="(item,i) in processContent.pp" :key="'pp'+i">

                <!-- <el-col :span="24" :class="colHeight">  :style="{float: 'left'}"-->
                  <el-form-item label="等级标识">
                    <!--  :style="{float:'left'}" style="width: 50%" -->
                    <!--<el-input v-model="item.gradeMark" placeholder="等级标识"></el-input>-->
                    <el-select v-model="item.gradeMark"   @change="changeSelect" placeholder="等级标识" :disabled="isFlowDts">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="等级名称">
                     <!-- :style="{float:'left'}" -->
                    <el-input type="text" v-model="item.name" placeholder="等级名称" :disabled="isFlowDts"/>
                  </el-form-item>
                <!-- </el-col> -->

                <!-- <el-col :span="24" :class="colHeight"> -->
                  <el-form-item label="内阻下限(mΩ)">
                    <!--  :style="{float:'left'}" style="width: 50%" -->
                    <el-input type="number" :disabled="!processContent.irEnable" v-model="item.irLow"
                              placeholder="内阻下限"></el-input>
                  </el-form-item>
                  <el-form-item label="内阻上限(mΩ)">
                    <!--  :style="{float:'left'}" -->
                    <el-input type="number" :disabled="!processContent.irEnable" v-model="item.irUp"
                              placeholder="内阻上限"></el-input>
                  </el-form-item>
                <!-- </el-col> -->

                <!-- <el-col :span="24" :class="colHeight"> -->
                  <el-form-item label="电压下限(mV)">
                     <!-- :style="{float:'left'}" style="width: 50%" -->
                    <el-input type="number" :disabled="!processContent.voltageEnable" v-model="item.voltageLow"
                              placeholder="电压下限"></el-input>
                  </el-form-item>
                  <el-form-item label="电压上限(mV)">
                     <!-- :style="{float:'left'}" -->
                    <el-input type="number" :disabled="!processContent.voltageEnable" v-model="item.voltageUp"
                              placeholder="电压上限"></el-input>
                  </el-form-item>
                <!-- </el-col> -->

                <!-- <el-col :span="24" :class="colHeight"> -->
                  <el-form-item label="厚度下限">
                    <!--  :style="{float:'left'}" style="width: 50%" -->
                    <el-input type="number" :disabled="!processContent.thickEnable" v-model="item.thickLow"
                              placeholder="厚度下限"></el-input>
                  </el-form-item>
                  <el-form-item label="厚度上限">
                    <!--  :style="{float:'left'}" -->
                    <el-input type="number" :disabled="!processContent.thickEnable" v-model="item.thickUp"
                              placeholder="厚度上限"></el-input>
                  </el-form-item>
                <!-- </el-col> -->


                <!-- <el-col :span="24" :class="colHeight"> -->
                  <el-form-item label="K值下限">
                    <!-- :style="{float:'left'}"  style="width: 50%" -->
                    <el-input type="number" :disabled="!processContent.kEnable" v-model="item.kLow"
                              placeholder="K值下限"></el-input>
                  </el-form-item>
                  <el-form-item label="K值上限">
                    <!--  :style="{float:'left'}" -->
                    <el-input type="number" :disabled="!processContent.kEnable" v-model="item.kUp"
                              placeholder="K值上限"></el-input>
                  </el-form-item>
                <!-- </el-col> -->

                <!-- <el-col :span="24" :class="colHeight"> -->
                  <el-form-item label="容量下限(mAH)">
                    <!--  :style="{float:'left'}" style="width: 50%" -->
                    <el-input type="number" :disabled="!processContent.capacityEnable" v-model="item.capacityLow"
                              placeholder="容量下限"></el-input>
                  </el-form-item>
                  <el-form-item label="容量上限(mAH)">
                    <!--  :style="{float:'left'}" -->
                    <el-input type="number" :disabled="!processContent.capacityEnable" v-model="item.capacityUp"
                              placeholder="容量上限"></el-input>
                  </el-form-item>

                <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight">  :style="{float:'left'}" style="width: 50%"  :style="{float:'left'}"-->
                  <el-form-item label="DCIR下限(mΩ)">
                    <el-input type="number" :disabled="!processContent.dcirEnable" v-model="item.dcirLow"
                              placeholder="DCIR下限"></el-input>
                  </el-form-item>
                  <el-form-item label="DCIR上限(mΩ)">
                    <el-input type="number" :disabled="!processContent.dcirEnable" v-model="item.dcirUp"
                              placeholder="DCIR上限"></el-input>
                  </el-form-item>

                <!-- </el-col> -->


                <!-- <el-col :span="24" :class="colHeight"> -->
                   <!--  :style="{float:'left'}" style="width: 50%" -->
                  <!-- <el-form-item label="分容标识(1免分容->0分容)">
                   
                    <el-select v-model="item.tab" placeholder="请选择">
                      <el-option
                        v-for="item in optionsTab"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item> -->
                <!-- </el-col> -->


                <el-col :span="24" style="text-align: center;margin-top: 20px">
                  <hr style="margin-top: 10px;margin-bottom: 10px"/>
                </el-col>
              </el-col>

            </el-form>
          </div>
        </el-tab-pane>
<!--        <el-tab-pane
          label="分档(预)"
          name="param2"
        >
          <div class="container" style="margin-top: 10px">
            <el-form :inline="true" :label-position="labelPosition" label-width="180px" :model="processContent"
            >
              <el-col :span="24" :class="colHeight"
                      style="text-align: center;color: #606266;font-weight: 700;margin-top: 20px">
                <div style="width: 20%;float: left">
                  内阻：
                  <el-switch
                    v-model="processContent.irEnable1"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor">
                  </el-switch>
                </div>
                <div style="width: 20%;float: left">
                  电压：
                  <el-switch
                    v-model="processContent.voltageEnable1"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor">
                  </el-switch>
                </div>
                <div style="width: 20%;float: left">
                  厚度：
                  <el-switch
                    v-model="processContent.thickEnable1"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor">
                  </el-switch>
                </div>
                <div style="width: 20%;float: left">
                  K值：
                  <el-switch
                    v-model="processContent.kEnable1"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor">
                  </el-switch>
                </div>
                <div style="width: 20%;float: left">
                  容量：
                  <el-switch
                    v-model="processContent.capacityEnable1"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="activeColor"
                    :inactive-color="inactiveColor">
                  </el-switch>
                </div>
              </el-col>

              <el-col :span="24" style="text-align: center;margin-top: 10px">
                <hr style="margin-top: 10px;margin-bottom: 10px"/>
              </el-col>

              <el-col :span="24" :class="colHeight">
                <el-form-item label="默认等级" :style="{float:'left'}">
                  <el-select v-model="processContent.defaultGradeMark1" placeholder="默认等级">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24" style="text-align: center;margin-top: 20px">
                <hr style="margin-top: 10px;margin-bottom: 10px"/>
              </el-col>

              <el-col :span="24" v-for="(item,i) in processContent.pp1" :key="'pp1'+i" :style="{float: 'left'}">
                <el-col :span="24" :class="colHeight">
                  <el-form-item label="等级标识" :style="{float:'left',width: '50%'}">
                    <el-select v-model="item.gradeMark" @change="changeSelect" placeholder="等级标识">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="等级名称" :style="{float:'left'}">
                    <el-input type="text" v-model="item.name"
                              placeholder="等级名称"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :class="colHeight">
                  <el-form-item label="内阻下限(mΩ)" :style="{float:'left'}" style="width: 50%">
                    <el-input type="number" :disabled="!processContent.irEnable1" v-model="item.IRLow"
                              placeholder="内阻下限"></el-input>
                  </el-form-item>
                  <el-form-item label="内阻上限(mΩ)" :style="{float:'left'}">
                    <el-input type="number" :disabled="!processContent.irEnable1" v-model="item.IRUp"
                              placeholder="内阻上限"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :class="colHeight">
                  <el-form-item label="电压下限(mV)" :style="{float:'left'}" style="width: 50%">
                    <el-input type="number" :disabled="!processContent.voltageEnable1" v-model="item.voltageLow"
                              placeholder="电压下限"></el-input>
                  </el-form-item>
                  <el-form-item label="电压上限(mV)" :style="{float:'left'}">
                    <el-input type="number" :disabled="!processContent.voltageEnable1" v-model="item.voltageUp"
                              placeholder="电压上限"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :class="colHeight">
                  <el-form-item label="厚度下限" :style="{float:'left'}" style="width: 50%">
                    <el-input type="number" :disabled="!processContent.thickEnable1" v-model="item.thickLow"
                              placeholder="厚度下限"></el-input>
                  </el-form-item>
                  <el-form-item label="厚度上限" :style="{float:'left'}">
                    <el-input type="number" :disabled="!processContent.thickEnable1" v-model="item.thickUp"
                              placeholder="厚度上限"></el-input>
                  </el-form-item>
                </el-col>


                <el-col :span="24" :class="colHeight">
                  <el-form-item label="K值下限" :style="{float:'left'}" style="width: 50%">
                    <el-input type="number" :disabled="!processContent.kEnable1" v-model="item.kLow"
                              placeholder="K值下限"></el-input>
                  </el-form-item>
                  <el-form-item label="K值上限" :style="{float:'left'}">
                    <el-input type="number" :disabled="!processContent.kEnable1" v-model="item.kUp"
                              placeholder="K值上限"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :class="colHeight">
                  <el-form-item label="容量下限(mAH)" :style="{float:'left'}" style="width: 50%">
                    <el-input type="number" :disabled="!processContent.capacityEnable1" v-model="item.capacityLow"
                              placeholder="容量下限"></el-input>
                  </el-form-item>
                  <el-form-item label="容量上限(mAH)" :style="{float:'left'}">
                    <el-input type="number" :disabled="!processContent.capacityEnable1" v-model="item.capacityUp"
                              placeholder="容量上限"></el-input>
                  </el-form-item>


                </el-col>
                <el-col :span="24" style="text-align: center;margin-top: 20px">
                  <hr style="margin-top: 10px;margin-bottom: 10px"/>
                </el-col>
              </el-col>
              <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
                <el-button type="primary" @click="changeRequest" v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}">变更申请
                </el-button>
              </el-col>
              <el-col v-if="flowTempShow" :span="24" style="text-align: center;margin-top: 20px">
                <el-button type="primary" @click="nowAdd">立即添加</el-button>
              </el-col>

            </el-form>
          </div>
        </el-tab-pane>-->
      </el-tabs>
      <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
                <el-button type="primary" @click="changeRequest">变更申请</el-button>  <!-- v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" -->
        </el-col>
        <el-col v-if="flowTempShow" :span="24" style="text-align: center;margin-top: 20px">
              <el-button type="primary" @click="nowAdd">立即添加</el-button>
        </el-col>
    </div>
  </el-col>
</template>

<script>
  import httpUtils from '@/api/fms-common'

  export default {
    name: 'standTimeModel',
    props:{
      dialogSubmit:Function,
      'isFlowDts': Boolean
    },
    data() {
      return {
        optionsTab: [{
          value: 1,
          label: '免分容'
        }, {
          value: 0,
          label: '分容'
        }],
        activeName: "param1",
        colHeight: 'colHeight',
        flowShow: true,
        flowTempShow: false,
        activeColor: 'green',
        inactiveColor: '#ccc',
        processContent: {
          irEnable: 0,
          voltageEnable: 0,
          thickEnable: 0,
          kEnable: 0,
          capacityEnable: 0,
          dcirEnable: 0,
          defaultGradeMark: 1,
          irEnable1: 0,
          voltageEnable1: 0,
          thickEnable1: 0,
          kEnable1: 0,
          capacityEnable1: 0,
          defaultGradeMark1: 1,
          pp: [
            // {
            //   gradeMark: "",
            //   name: "",
            //   index: 8,
            //   voltageLow: "",
            //   voltageUp: "",
            //   irLow: "",
            //   irUp: "",
            //   capacityLow: "",
            //   capacityUp: "",
            //   thickLow: "",
            //   thickUp: "",
            //   kLow: "",
            //   kUp: "",
            //   tab: "",
            // dcirLow: "",
            // dcirUp: "",
            // },
          ],
          pp1: [
            // {
            //   gradeMark: "",
            //   index: 8,
            //   voltageLow: "",
            //   voltageUp: "",
            //   irLow: "",
            //   name: "",
            //   irUp: "",
            //   capacityLow: "",
            //   capacityUp: "",
            //   thickLow: "",
            //   thickUp: "",
            //   kLow: "",
            //   kUp: "",
            //   dcirLow: "",
            //   dcirUp: "",
            // },
          ],
        },
        processContentInit: {
          irEnable: 0,
          voltageEnable: 0,
          thickEnable: 0,
          kEnable: 0,
          capacityEnable: 0,
          irEnable1: 0,
          voltageEnable1: 0,
          thickEnable1: 0,
          kEnable1: 0,
          capacityEnable1: 0,
          dcirEnable: 0,
          defaultGradeMark1: 1,
          pp: [
            // {
            //   gradeMark: "",
            //   index: 8,
            //   voltageLow: "",
            //   voltageUp: "",
            //   irLow: "",
            //   irUp: "",
            //   capacityLow: "",
            //   capacityUp: "",
            //   thickLow: "",
            //   thickUp: "",
            //   kLow: "",
            //   kUp: "",
            //   dcirLow: "",
            //   dcirUp: "",
            // },
          ],
          pp1: [
            // {
            //   gradeMark: "",
            //   index: 8,
            //   voltageLow: "",
            //   voltageUp: "",
            //   irLow: "",
            //   irUp: "",
            //   capacityLow: "",
            //   capacityUp: "",
            //   thickLow: "",
            //   thickUp: "",
            //   kLow: "",
            //   kUp: "",
            //   dcirLow: "",
            //   dcirUp: "",
            // },
          ],
        },
        options: [],
        initOptions: [],
        bizId: '',
        dataUpdateParam: {},
        labelPosition: 'left',
      }
    },
    watch: {
      "flowTempShow": {
            handler:function(nVal,oVal) {
                  // console.log(nVal,oVal)
            },
            deep: true
      }
    },
    created() {
        this.initSelect()
    },
    methods: {
      handleClick(){},
      initSelect() {
        httpUtils.actionFmsPost('/process/guest/geGrade', {}).then(data => {
          let optionData = [], aa = [], aaInit = [];
          data.forEach((item, index) => {
            optionData[index] = {label: item, value: item}
            aa.push(
                {
                  gradeMark: "",
                  name: "",
                  index: index + 1,
                  voltageLow: "",
                  voltageUp: "",
                  irLow: "",
                  irUp: "",
                  capacityLow: "",
                  capacityUp: "",
                  thickLow: "",
                  thickUp: "",
                  kLow: "",
                  kUp: "",
                  tab: "",
                  dcirLow: "",
                  dcirUp: "",
                }
            )
            aaInit.push(
                {
                  gradeMark: "",
                  index: index + 1,
                  voltageLow: "",
                  voltageUp: "",
                  irLow: "",
                  irUp: "",
                  capacityLow: "",
                  capacityUp: "",
                  thickLow: "",
                  thickUp: "",
                  kLow: "",
                  kUp: "",
                  dcirLow: "",
                  dcirUp: "",
                })

          })
          this.options = optionData;
          this.initOptions = optionData;
          this.processContent = {
                  irEnable: 0,
                  voltageEnable: 0,
                  thickEnable: 0,
                  kEnable: 0,
                  capacityEnable: 0,
                  dcirEnable: 0,
                  defaultGradeMark: 1,
                  irEnable1: 0,
                  voltageEnable1: 0,
                  thickEnable1: 0,
                  kEnable1: 0,
                  capacityEnable1: 0,
                  defaultGradeMark1: 1,
                  pp: aa,
                  pp1: aa,
          };
          this.processContentInit = {       
              irEnable: 0,
              voltageEnable: 0,
              thickEnable: 0,
              kEnable: 0,
              capacityEnable: 0,
              irEnable1: 0,
              voltageEnable1: 0,
              thickEnable1: 0,
              kEnable1: 0,
              capacityEnable1: 0,
              dcirEnable: 0,
              defaultGradeMark1: 1,
              pp: aaInit,
              pp1: aaInit
            }

        })
      },
      // tab切换的change事件
      handleClick(val) {
        console.log(val)
      },
      changeSelect(val) {
        // console.log(val)
      },
      nowAdd() {
        let ppArray = [];
        let flag = false;
        this.processContent.pp.forEach((item, index) => {
          if (item.gradeMark.length > 0 && ppArray.includes(item.gradeMark)) {
            flag = true;
          }
          ppArray[index] = item.gradeMark;
        })
        if (flag) {
          this.$message.error("当前存在两个想同等级标识,请修改后保存！")
          return false;
        }
        let defaultGradeMark = this.processContent.defaultGradeMark;
        if (defaultGradeMark == undefined || defaultGradeMark.length < 1) {
          this.$message.error("默认等级不能为空,请输入！");
          return false;
        }
        let json = {
          data: {
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
            this.dialogSubmit()
          }
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
        let json = {data: row.id}
        this.dataUpdateParam.processId = row.processId
        this.dataUpdateParam.flowDtId = row.id
        setTimeout(() => {
              httpUtils.actionFmsPost(url, json).then(data => {
                      if (data != null) {
                        this.dataUpdateParam = data
                        let getJson = JSON.parse(data.processContent);
                        for (let key in this.processContent) {
                          if (getJson[key] == undefined) {
                            getJson[key] = {};
                          }
                          // this.dataUpdateParam = data
                          // let getJson1 = JSON.parse(data.processContent1);
                          // for (let key in this.processContent1) {
                          //   if(getJson1[key] == undefined){
                          //     getJson1[key] = {};
                          //   }
                        }
                        try {
                          this.processContent = getJson
                        } catch (e) {
                          this.processContent = JSON.parse(JSON.string0ify(this.processContentInit))
                        }
                      } else {
                        this.dataUpdateParam.id = null;
                        this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
                      }
                    })
        },1000)
      },
      changeRequest() {
        let json = {data: {bizId: this.bizId, changeType: 1}};
        const _data = {url: '/process-flow/process-flow-change-apply', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          if (data) {
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
