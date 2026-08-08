<template>
  <el-col :span="23" :offset=1>
    <div>
      <div class="container" style="margin-top: 10px">
        <el-form :inline="true" :label-position="labelPosition" label-width="180px" :model="processContent"
        >

          <el-tabs v-model="activeName" class="param-tab-style">
            <el-tab-pane
              label="下发参数"
              name="param1"
            >
              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="电压下限(mV)">
                <el-input  v-model="processContent.pp.VoltageLowerLmt" placeholder="电压下限(mV)" @input="handleInput('processContent','pp','VoltageLowerLmt')" 
                oninput ="value = value.replace(/[^0-9.-]/g,'')"
                 :disabled="isFlowDts"/>
                 <!-- type="number" -->
              </el-form-item>
              <el-form-item label="电压上限(mV)">
                <el-input  v-model="processContent.pp.VoltageUpperLmt" placeholder="电压上限(mV)" :disabled="isFlowDts" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','VoltageUpperLmt')"/>
              </el-form-item>
              <!-- </el-col>  type="number"-->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="内阻下限(mΩ)">
                <el-input v-model="processContent.pp.IRLowerLmt" placeholder="内阻下限(mΩ)" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','IRLowerLmt')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="内阻上限(mΩ)">
                <el-input v-model="processContent.pp.IRUpperLmt" placeholder="内阻上限(mΩ)" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','IRUpperLmt')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <!-- </el-col> -->

              <!-- <el-col :span="24" :class="colHeight"> :style="{float:'left'}" style="width: 50%" :style="{float:'left'}"-->
              <el-form-item label="NG复测数量(ea)">
                <el-input type="number" v-model="processContent.pp.NGRetestNum" placeholder="NG复测数量(ea)" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="NG复测次数(ea)" >
                <el-input type="number" v-model="processContent.pp.NGRetestCount" placeholder="NG复测次数(ea)" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="NG出库限制(ea)" >
                <el-input type="number" v-model="processContent.pp.NGOutboundLimit" placeholder="NG出库限制(ea)" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="K值下限" >
                <el-input v-model="processContent.pp.kLow" placeholder="K值下限" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','kLow')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="K值上限" >
                <el-input v-model="processContent.pp.kUp" placeholder="K值上限" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','kUp')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <!-- </el-col> -->
              <!-- k计算 -->
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',color:'#0000FF'}">
                K值计算
              </el-col>
              <el-form-item label="是否开启K值计算" :style="{width:'45%'}">
                <el-switch
                    v-model="processContent.pp.isKeyCalculate"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="isFlowDts"
                  />
              </el-form-item>
              <el-form-item label="OCV选择"  :style="{width:'45%'}">
                <el-select v-model="processContent.pp.ocvChoose" filterable placeholder="请选择" :disabled="isFlowDts">
                        <el-option
                          v-for="item in ocvSelectArr"
                          :key="item.paramValue"
                          :label="item.paramDsc"
                          :value="item.paramValue"
                        />
                      </el-select>
              </el-form-item>
              <!-- 单盘K值计算 -->
              <!-- <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',color:'#0000FF'}">
                单盘K值计算
              </el-col>
              <el-form-item label="是否开启单盘K值计算"  :style="{width:'50%'}">
                <el-switch
                    v-model="processContent.pp.isKeyTrayCalculate"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="isFlowDts"
                  />
              </el-form-item>
              <el-form-item label="sigma倍数"  :style="{width:'50%'}">
                <el-input v-model="processContent.pp.sigma" placeholder="sigma倍数"  oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','sigma')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="单盘K值下限" >
                <el-input v-model="processContent.pp.trayKLow" placeholder="单盘K值下限" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','trayKLow')" :disabled="isFlowDts"></el-input>
              </el-form-item>
              <el-form-item label="单盘K值上限" >
                <el-input v-model="processContent.pp.trayKUp" placeholder="单盘K值上限"  oninput ="value = value.replace(/[^0-9.-]/g,'')"
                @input="handleInput('processContent','pp','trayKUp')" :disabled="isFlowDts"></el-input>
              </el-form-item>-->

              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',color:'#0000FF'}">
                OCV / IR测试选项
              </el-col>
              <el-col :span="24"  :style="{display:'flex'}">
                <el-form-item label=""  :style="{width:'15%'}">
                  <el-checkbox v-model="processContent.pp.ocvTest" :disabled="isFlowDts">OCV测试</el-checkbox>
                </el-form-item>
                <el-form-item label=""  :style="{width:'15%'}">
                  <el-checkbox v-model="processContent.pp.irTest" :disabled="isFlowDts">IR测试</el-checkbox>
                </el-form-item>
              </el-col> 

            </el-tab-pane>

            <!-- <el-tab-pane
              label="double check参数"
              name="param2"
              disabled
            >
              <el-form-item label="电压下限(mV)">
                <el-input v-model="processContent.doubleCheck.voltageLower" placeholder="电压下限(mV)"/>
              </el-form-item>
              <el-form-item label="电压上限(mV)">
                <el-input v-model="processContent.doubleCheck.voltageUpper" placeholder="电压上限(mV)"></el-input>
              </el-form-item>

              <el-form-item label="交流电阻下限(mΩ)">
                <el-input v-model="processContent.doubleCheck.irLower" placeholder="交流电阻下限(mΩ)"></el-input>
              </el-form-item>
              <el-form-item label="交流电阻上限(mΩ)">
                <el-input v-model="processContent.doubleCheck.irUpper" placeholder="交流电阻上限(mΩ)"></el-input>
              </el-form-item>

            </el-tab-pane> -->

          </el-tabs>



          <el-col v-if="flowShow" :span="24" style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="changeRequest">变更申请</el-button>
            <!--  v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" -->
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
    name: 'OCV1Model',
    data() {
      return {
        Ocvoptions:[],
        colHeight:'colHeight',
        flowShow: true,
        flowTempShow: false,
        activeName: "param1",
        ocvSelectArr:[],
        processContent: {
          // doubleCheck:{
          //   voltageUpper:0,
          //   voltageLower:0,
          //   irUpper:0,
          //   irLower:0,
          // },
          pp: {
            VoltageLowerLmt: 0,
            VoltageUpperLmt: 4200,
            IRLowerLmt: 0,
            IRUpperLmt: 20,
            NGRetestNum: 0,
            NGRetestCount: 0,
            NGOutboundLimit: 0,
            kLow: 0,
            kUp: 10,
            /* k值计算 */ 
            isKeyCalculate: 0,  // 关闭(0)-开启(1)
            ocvChoose: "",
            /* 单盘K值计算 */ 
            // isKeyTrayCalculate: 0,
            // sigma:3,
            // trayKLow: 0,
            // trayKUp: 0,
            /* ocv/ir测试选项 */ 
            ocvTest: 0,
            irTest: 0,
            // IRLow: "0",
            // IRUp: "10",
            // caseVoltLow: "0",
            // caseVoltUp: "5000",
            // voltageLow: "0",
            // voltageUp: "5000",
          },
          // sp: []
        },
        processContentInit: {
          pp: {
            // IRLow: "0",
            // IRUp: "10",
            // caseVoltLow: "0",
            // caseVoltUp: "5000",
            // voltageLow: "0",
            // voltageUp: "5000",
            VoltageLowerLmt: 0,
            VoltageUpperLmt: 4200,
            IRLowerLmt: 0,
            IRUpperLmt: 20,
            NGRetestNum: 0,
            NGRetestCount: 0,
            NGOutboundLimit: 0,
            kLow: 0,
            kUp: 10,
            /* k值计算 */ 
            isKeyCalculate: 0,  // 关闭(0)-开启(1)
            ocvChoose: "",
            /* 单盘K值计算 */ 
            // isKeyTrayCalculate: 0,
            // sigma:3,
            // trayKLow: 0,
            // trayKUp: 0,
            // /* ocv/ir测试选项 */ 
            ocvTest: 0,
            irTest: 0,
          },
          // doubleCheck:{
          //   voltageUpper:0,
          //   voltageLower:0,
          //   irUpper:0,
          //   irLower:0,
          // },
          // sp: []
        },
        bizId:'',
        dataUpdateParam: {},
        labelPosition: 'left',
      }
    },
    props: {
      'isShowSubmit': Number,
      'ProcessAddSelect': Array,
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
    mounted() {
      this.ocvSelectArr = this.ProcessAddSelect.filter(item => item.processName.slice(0,3) === 'OCV').map(sel => {
        return {
          paramDsc: sel.processName,
          paramValue: sel.processCode
        }
      })
    },
    methods: {
      // handleInput(modelData,obj,name){
                    
      //               this[modelData][obj][name] = this[modelData][obj][name]
      //                   .replace(/[^\-\d.]/g, '')  //只能输入   数字 小数点 -
      //                   .replace(/\-{2,}/g, "-") // 只能出现一次- 
      //                   .replace(/^0+(\d)/, '$1') //如果第一位是 0 就替换成后面的数字
      //                   .replace(/^\./, '0.') //如果第一位是 . 就 替换成  0.
      //                   .match(/^[\d\-]*(\.?\d{0,5})/g)[0] || ''  //开头只能允许数字或者 -
                
      // },
    // el-input框设定浮点型
    handleInput(obj,attr,name) {
        // 先把非数字的都替换掉，除了数字和 .
        this[obj][attr][name] = this[obj][attr][name].replace(/[^\d.]/g, "")
        // 保证只有出现一个 . 而没有多个 .
        this[obj][attr][name] = this[obj][attr][name].replace(/\.{2,}/g, ".")
        // 必须保证第一个为数字而不是 .
        this[obj][attr][name] = this[obj][attr][name].replace(/^\./g, "")
        // 第一位数不能输入0
        // this[obj][attr][name] = this[obj][attr][name].replace(/^0[0-9]*/g, '')
        // 保证 . 只出现一次，而不能出现两次以上
        this[obj][attr][name] = this[obj][attr][name]
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".")
        // 只能输入 8 位小数
        this[obj][attr][name] = this[obj][attr][name].replace(
          /^(\\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,
          "$1$2.$3"
        )
        // 8是允许输入的整数最大位数，8是允许输入的小数最大位数
        this[obj][attr][name] = this[obj][attr][name].replace(
          /^\D*(\d{0,8}(?:\.\d{0,8})?).*$/g,
          "$1"
        )

      },
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

        for(let k in this.processContent.pp) {
          if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
           || k == 'trayKLow' || k == 'trayKUp') {
            this.processContent.pp[k] =  this.processContent.pp[k] ? parseFloat(this.processContent.pp[k]) : this.processContent.pp[k]
          } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'isKeyCalculate' || k == 'isKeyTrayCalculate'|| k == 'sigma' ){
            this.processContent.pp[k] =  this.processContent.pp[k] ? parseInt(this.processContent.pp[k]) : this.processContent.pp[k]
          } 
          else if (k == 'irTest' || k == 'ocvTest'){
            this.processContent.pp[k] =  this.processContent.pp[k] ? 1 : 0
          }
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
            this.$emit("dialogSubmit")
          }
        })
      },

      check() {
        if (parseFloat(this.processContent.pp.VoltageUpperLmt) < parseFloat(this.processContent.pp.VoltageLowerLmt)) {
          return '电压上限[' + this.processContent.pp.VoltageUpperLmt + ']小于下限[' + this.processContent.pp.VoltageLowerLmt + ']'
        } 
        else if (parseFloat(this.processContent.pp.IRUpperLmt) < parseFloat(this.processContent.pp.IRLowerLmt)) {
          return '内阻上限[' + this.processContent.pp.IRUpperLmt + ']小于下限[' + this.processContent.pp.IRLowerLmt + ']'
        } 
        else if (parseFloat(this.processContent.pp.kUp) < parseFloat(this.processContent.pp.kLow)) {
          return 'K值上限[' + this.processContent.pp.kUp + ']小于下限[' + this.processContent.pp.kLow + ']'
        }else if (parseFloat(this.processContent.pp.trayKUp) < parseFloat(this.processContent.pp.trayKLow)) {
          return '单盘K值上限[' + this.processContent.pp.trayKUp + ']小于下限[' + this.processContent.pp.trayKLow + ']'
        }
        for(var k in this.processContent.pp) {
          if (k !== 'ocvChoose' && !this.processContent.pp[k]) {
              this.processContent.pp[k] = 0;
          }
          // if (this.processContent.pp[k].length > 1) {
          //   if (String(this.processContent.pp[k]).split("")[0] === 0) {
          //     return `参数值首位数字不能为0 !!`
          //   } 
          // }
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
            getJson.pp.irTest = getJson.pp.irTest && getJson.pp.irTest ? true : false;
            getJson.pp.ocvTest = getJson.pp.ocvTest && getJson.pp.ocvTest ? true : false;
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
      padding: 5px;
      background-color: #d1ecd63d;
    }
  }
  .colHeight{
    height: 40px;
    font-size: 15px;
  }
</style>
