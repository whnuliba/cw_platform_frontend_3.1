<template>
  <el-col :span="24" :offset="1">
    <div id="chargeParamTemp3">
      <div class="container" :style="{margiTop: '10px', height: '90%'}">
        <el-form
          :inline="true"
          :label-position="labelPosition"
          label-width="200px"
          :model="processContent"
        >
          <!--<el-col :span="24" :class="colHeight">-->
          <!--<el-form-item label="过压(mV)" :style="{float:'left'}" style="width: 50%">-->
          <!--<el-input type="number" v-model="processContent.pp.voltgeUp" placeholder="过压" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="过流(mA)" :style="{float:'left'}">-->
          <!--<el-input type="number" v-model="processContent.pp.currentUp" placeholder="过流" />-->
          <!--</el-form-item>-->
          <!--</el-col>-->

          <!-- <el-button type="primary" v-if="chargeMixtureShow" @click="initProcessLibraryOptions(0)" disabled>配方库</el-button>
          <el-button type="primary" v-if="chargeMixtureShow" @click="dialogVisibleprocessLibraryName =true" disabled >添加配方</el-button>
          <el-button type="primary" v-if="chargeMixtureShow" @click="initProcessLibraryOptions(1)" disabled>查看配方</el-button>
          <el-button disabled="" v-html="processLibraryDataUse"></el-button> -->

          <!--配方查询-->
          <el-dialog
            title="工艺配方查看"
            :visible.sync="dialogVisibleProcessLibraryList"
            width="30%"
            :append-to-body="true"
            :before-close="handleCloseProcessLibrary">
            <span>
              <el-table
                :data="processLibraryData"
                height="250"
                border
                style="width: 100%;margin-top: 10px">
                        <el-table-column
                          prop="processName"
                          label="工艺库名称"
                          align="center"
                        >
                        </el-table-column>
                       <el-table-column
                         fixed="right"
                         align="center"
                         label="操作"
                       >
                        <template slot-scope="scope">
                          <el-button v-ele-show="{btnCode:'PROCESS_LIBRARY_ADD'}" @click="editProcessClick(scope.row)"
                                     type="primary" size="small">替换</el-button>
                          <el-button v-ele-show="{btnCode:'PROCESS_LIBRARY_DELETE'}"
                                     @click="deleteProcessClick(scope.row)" type="danger" size="small">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
           </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleProcessLibraryList = false">关 闭</el-button>
           </span>
          </el-dialog>

          <!--配方库-->
          <el-dialog
            title="工艺配方库"
            :visible.sync="dialogVisibleProcessLibrary"
            width="30%"
            :append-to-body="true"
            :before-close="handleCloseProcessLibrary">
            <span>
               <el-select v-model="processLibraryOptionsParam" filterable placeholder="请选择">
                  <el-option
                    v-for="item in processLibraryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleProcessLibrary = false">取 消</el-button>
            <el-button type="primary" @click="processLibraryOptionsClick()">确 定</el-button>
           </span>
          </el-dialog>

          <!--添加配方-->
          <el-dialog
            title="创建配方"
            :visible.sync="dialogVisibleprocessLibraryName"
            width="30%"
            :append-to-body="true"
            :before-close="handleCloseProcessLibrary">
            <el-input
              placeholder="请输入配方名称"
              v-model="processLibraryName">
            </el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleprocessLibraryName = false">取 消</el-button>
            <el-button type="primary" @click="processLibraryAddClick()">确 定</el-button>
           </span>
          </el-dialog>

          <!-- <el-col :span="24" :class="colHeight">  style="width: 50%"-->
          <el-tabs v-model="activeName" class='param-tab-style'>
           <!--保护参数-->
            <el-tab-pane
              label="保护参数"
              name="param1"
            >
            <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
               8线保护参数
              </el-col>
             
              <el-form-item label="充电电压上限(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltUp8" placeholder="充电电压上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电过流保护(mV)">
                <el-input type="number" v-model="processContent.pp.chargeCurrUp8" placeholder="充电过流保护" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-form-item label="T1时间(s)"> -->

              <!-- <el-col :span="24" :class="colHeight">  :style="{float:'left'}" style="width: 50%"  :style="{float:'left'}"-->
              <el-form-item label="充电容量保护(mAh)">
                <el-input type="number" v-model="processContent.pp.chargeCapUp8" placeholder="充电容量保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流电压波动保护(mV)">
                <el-input type="number" v-model="processContent.pp.constCurrVoltFluProtect8" placeholder="恒流电压波动保护" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->
              <el-form-item label="恒压电压偏差保护(mV)">
                <el-input type="number" v-model="processContent.pp.constVoltVoltFluProtect8" placeholder="恒压电压偏差保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压连续下降检测电压(mV)">
                <el-input type="number" v-model="processContent.pp.chargeDownContinuousVolt8" placeholder="充电电压连续下降检测电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电时定时刻电压检测时间(s)">
                <el-input type="number" v-model="processContent.pp.chargeVoltCheckTime8" placeholder="充电时定时刻电压检测时间" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电时定时刻检测电压(mV)">
                <el-input type="number" v-model="processContent.pp.chargeCheckVolt8" placeholder="充电时定时刻检测电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电限制时间(s)">
                <el-input type="number" v-model="processContent.pp.chargeLimitTime8" placeholder="充电限制时间" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流电流波动保护(mA)">
                <el-input type="number" v-model="processContent.pp.currentOffset8" placeholder="恒流电流波动保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电压波动保护(mV)">
                <el-input type="number" v-model="processContent.pp.voltOffset8" placeholder="恒流电流波动保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流连续上升保护(mA)">
                <el-input type="number" v-model="processContent.pp.constVoltRiseContinuous8" placeholder="恒压电流连续上升保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电瞬间电压上升保护电压(mV)">
                <el-input type="number" v-model="processContent.pp.voltageRiseInstantlyVolt8" placeholder="充电瞬间电压上升保护电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电瞬间电压上升保护间隔(mV)">
                <el-input type="number" v-model="processContent.pp.voltageRiseInstantlyTime8" placeholder="充电瞬间电压上升保护间隔" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电瞬间电压下降保护电压(mV)">
                <el-input type="number" v-model="processContent.pp.voltageDropInstantlyVolt8" placeholder="充电瞬间电压下降保护电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压累计下降保护电压(mV)">
                <el-input type="number" v-model="processContent.pp.chargetotalDropVolt8" placeholder="充电电压累计下降保护电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压充电电流瞬时回跳(mA)">
                <el-input type="number" v-model="processContent.pp.constantVoltRefluxinstantly8" placeholder="恒压充电电流瞬时回跳" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压累计下降次数">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownCount8" placeholder="充电电压累计下降次数" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压连续下降次数">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownContinuous8" placeholder="充电电压连续下降次数" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltLow8" placeholder="放电电压下限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电过流保护(mA)">
                <el-input type="number" v-model="processContent.pp.dischargeOverCurrent8" placeholder="放电过流保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电容量保护(mAh)">
                <el-input type="number" v-model="processContent.pp.dischargeOverCapa8" placeholder="放电容量保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电时电压连续上升检测(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeContinuousvoltagerise" placeholder="放电时电压连续上升检测" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电限制时间(s)">
                <el-input type="number" v-model="processContent.pp.dischargeLimitTime8" placeholder="放电限制时间" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电时电池欠压保护(mV)">
                <el-input type="number" v-model="processContent.pp.underVoltProtect8" placeholder="放电时电池欠压保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压瞬间上升保护(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltRiseInstant8" placeholder="放电电压瞬间上升保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流时电流偏差保护(mA)">
                <el-input type="number" v-model="processContent.pp.constantcurrentOffset8" placeholder="恒流时电流偏差保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电流电压线电压偏差保护(mV)">
                <el-input type="number" v-model="processContent.pp.currLinevoltDeviation8" placeholder="电流电压线电压偏差保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="异常电压变化值(mV)">
                <el-input type="number" v-model="processContent.pp.abnormalVoltagevalue8" placeholder="异常电压变化值" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="线路电阻异常保护(mΩ)">
                <el-input type="number" v-model="processContent.pp.LineIRabnormal8" placeholder="线路电阻异常保护(mΩ)" :disabled="isFlowDts"/>
              </el-form-item>
            
              <!----------------------------------------------------------------分界线---------------------------------------------------------------->
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
               9线/10线保护参数
              </el-col>
              <el-form-item label="充电上限电压(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltUp" placeholder="充电上限电压" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电上限容量(mAh)">
                <el-input type="number" v-model="processContent.pp.chargeCapUp" placeholder="充电上限容量" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电流下限(mA)">
                <el-input type="number" v-model="processContent.pp.currentLow" placeholder="充电电流下限(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T1时间(s)">
                <el-input type="number" v-model="processContent.pp.t1Time" placeholder="T1时间(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T1时间电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.t1TimeLow" placeholder="T1时间电压下限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T1时间电压上限(mV)">
                <el-input type="number" v-model="processContent.pp.t1TimeUp" placeholder="T1时间电压上限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T2时间(s)">
                <el-input type="number" v-model="processContent.pp.t2Time" placeholder="T2时间(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T2时间电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.t2TimeLow" placeholder="T2时间电压下限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T2时间电压上限(mV)">
                <el-input type="number" v-model="processContent.pp.t2TimeUp" placeholder="T2时间电压上限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T3-CC转CV时间下限(s)">
                <el-input type="number" v-model="processContent.pp.t3Time" placeholder="T3-CC转CV时间下限(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T4-CC转CV时间上限(s)">
                <el-input type="number" v-model="processContent.pp.t4Time" placeholder="T4-CC转CV时间上限(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T5时间(s)">
                <el-input type="number" v-model="processContent.pp.t5Time" placeholder="T5时间(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T5时间电流下限(mA)">
                <el-input type="number" v-model="processContent.pp.t5CurrentLow" placeholder="T5时间电流下限(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="T5时间电流上限(mA)">
                <el-input type="number" v-model="processContent.pp.t5CurrentUp" placeholder="T5时间电流上限(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压偏差(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltOffset" placeholder="充电电压偏差(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电限制时间(s)">
                <el-input type="number" v-model="processContent.pp.chargeLimitTime" placeholder="充电限制时间(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压下降检查间隔(s)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownTime" placeholder="充电电压下降检查间隔(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压下降值(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownValue" placeholder="充电电压下降值(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流上升幅度(mA)">
                <el-input type="number" v-model="processContent.pp.constVoltRise" placeholder="恒压电流上升幅度(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流上升累计(mA)">
                <el-input type="number" v-model="processContent.pp.constVoltRiseCount" placeholder="恒压电流上升累计(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流上升连续(mA)">
                <el-input type="number" v-model="processContent.pp.constVoltRiseContinuous" placeholder="恒压电流上升连续(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压下降幅度(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownRange" placeholder="充电电压下降幅度(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压下降累计(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownCount" placeholder="充电电压下降累计(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电压下降连续(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownContinuous" placeholder="充电电压下降连续(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电检查时刻(mV)">
                <el-input type="number" v-model="processContent.pp.chargeCheckTime" placeholder="充电检查时刻(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电检查电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.chargecheckVoltLow" placeholder="充电检查电压下限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.voltVoltLow" placeholder="放电电压下限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电限制时间(s)">
                <el-input type="number" v-model="processContent.pp.dischargeTimeLow" placeholder="放电限制时间(s)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电下限容量(mAh)">
                <el-input type="number" v-model="processContent.pp.dischargeCapacityLow" placeholder="放电下限容量(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压上升幅度(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltUp" placeholder="放电电压上升幅度(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压上升累计(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltCount" placeholder="放电电压上升累计(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压上升连续(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltContinuous" placeholder="放电电压上升连续(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流电流偏差(恒流波动保护)(mA)">
                <el-input type="number" v-model="processContent.pp.currentOffset" placeholder="恒流电流偏差(恒流波动保护)(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="过流保护(mA)">
                <el-input type="number" v-model="processContent.pp.overCurrentProtection" placeholder="过流保护(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="休眠回路电流(mA)">
                <el-input type="number" v-model="processContent.pp.dormancyLoopCurrent" placeholder="休眠回路电流(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="过压保护(mV)">
                <el-input type="number" v-model="processContent.pp.overVolt" placeholder="过压保护(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电流线电压上限(mV)">
                <el-input type="number" v-model="processContent.pp.currentLineOverVolt" placeholder="电流线电压上限(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充放电时电压差(mV)">
                <el-input type="number" v-model="processContent.pp.cCVoltageDrop" placeholder="充放电时电压差(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="休眠时电压差(mV)">
                <el-input type="number" v-model="processContent.pp.vlotDiff" placeholder="休眠时电压差(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="接触阻抗(mΩ)">
                <el-input type="number" v-model="processContent.pp.contactImpedance" placeholder="接触阻抗(mΩ)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电池温度报警(℃)">
                <el-input type="number" v-model="processContent.pp.batteryTempAlarm" placeholder="电池温度报警(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="急停电压(全局电压上限)(mV)">
                <el-input type="number" v-model="processContent.pp.scramVolt" placeholder="急停电压(全局电压上限)(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="V1采样时间(mV)">
                <el-input type="number" v-model="processContent.pp.v1CollectTime" placeholder="V1采样时间(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电压突降保护(mV)">
                <el-input type="number" v-model="processContent.pp.voltDropProtection" placeholder="电压突降保护(mV)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电池温度预警(℃)">
                <el-input type="number" v-model="processContent.pp.batteryTempEarlyAlarm" placeholder="电池温度预警(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电流百分比保护(mA)">
                <el-input type="number" v-model="processContent.pp.currentPercentProtection" placeholder="电流百分比保护(mA)" :disabled="isFlowDts"/>
              </el-form-item>
              
              <!-- 多电池检测功能 -->
              <!-- <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                  多电池检测功能
              </el-col>
              <el-col :span="24">
                <el-form-item label="多电池检测功能">
                  <el-radio-group v-model="processContent.pp.multiBatteryCheck">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false">屏蔽[慎选]</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->

            </el-tab-pane>

            <!-- 通用参数 -->
            <el-tab-pane
              label="通用参数"
              name="param2"
            >
              <el-form-item label="结束电压选择步次">
                <el-input type="number" v-model="processContent.pp.endVoltStep" placeholder="结束电压选择步次" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="结束容量选择步次">
                <el-input type="number" v-model="processContent.pp.endCapaStep" placeholder="结束容量选择步次" :disabled="isFlowDts"/>
              </el-form-item>

              <el-form-item label="开始电压选择步次">
                <el-input type="number" v-model="processContent.pp.startVoltStep" placeholder="开始电压选择步次" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="结束充电容量选择步次">
                <el-input type="number" v-model="processContent.pp.endCCCVCapacityStep" placeholder="结束充电容量选择步次" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="结束放电容量选择步次">
                <el-input type="number" v-model="processContent.pp.endCapacityStep" placeholder="结束放电容量选择步次" :disabled="isFlowDts"/>
              </el-form-item>

              <el-form-item label="NG个数上限">
                <el-input type="number" v-model="processContent.pp.nGNumUp" placeholder="NG个数上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="OCVNG数量(ea)">
                <el-input type="number" v-model="processContent.pp.ocvNgCount" placeholder="OCVNG数量(ea)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="接触测试NG数量(ea)">
                <el-input type="number" v-model="processContent.pp.contactNgCount" placeholder="接触测试NG数量(ea)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充放电NG数量(ea)">
                <el-input type="number" v-model="processContent.pp.chargeNgCount" placeholder="充放电NG数量(ea)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="全部NG上限(ea)">
                <el-input type="number" v-model="processContent.pp.globalNGLimit" placeholder="全部NG上限(ea)" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="出库NG上限(ea)">
                <el-input type="number" v-model="processContent.pp.outTrayNglimit" placeholder="出库NG上限(ea)" :disabled="isFlowDts"/>
              </el-form-item>

              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                曲线采样时间设置
              </el-col>
              <el-col :span="12">
                <el-form-item label="曲线采样时间(s)">
                  <el-input  type="number"  v-model="processContent.pp.collectTime" placeholder="曲线采样时间(s)"  :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>

              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
               电压判定名称(cj)
              </el-col>
              <el-col :span="8">
                <el-form-item label="初始电压下限(mV)">
                  <el-input type="number" v-model="processContent.cj.startVoltLow" placeholder="初始电压下限(mV)" :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="初始电压上限(mV)">
                  <el-input type="number" v-model="processContent.cj.startVoltUp" placeholder="初始电压上限(mV)" :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="是否开启初始电压">
                <el-switch
                    v-model="processContent.cj.isEnable"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="isFlowDts"
                  />
              </el-form-item>
              </el-col>
              <el-col :span="24">
              <div v-if="isEndVot">
                <el-col :span="8">
                <el-form-item label="结束电压下限(mV)">
                  <el-input type="number" v-model="processContent.cj.endVoltLow" placeholder="结束电压下限(mV)" :disabled="isFlowDts"/>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束电压上限(mV)">
                    <el-input type="number" v-model="processContent.cj.endVoltUp" placeholder="结束电压上限(mV)" :disabled="isFlowDts"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否开启结束电压">
                    <el-switch
                        v-model="processContent.cj.isEndEnable"
                        :active-value="1"
                        :inactive-value="0"
                        :disabled="isFlowDts"
                      />
                  </el-form-item>
                </el-col>
              </div>
            </el-col>

              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
               放电容量判定名称(dcj)
              </el-col>
              <el-col :span="12">
                <el-form-item label="第一步放电容量下限(mAh)">
                  <el-input type="number" v-model="processContent.dcj.firstDischargeCapacityLow" placeholder="第一步放电容量下限(mAh)" :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="第一步放电容量上限(mAh)">
                  <el-input type="number" v-model="processContent.dcj.firstDischargeCapacityUp" placeholder="第一步放电容量上限(mAh)" :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="第二步放电容量下限(mAh)">
                  <el-input type="number" v-model="processContent.dcj.secondDischargeCapacityLow" placeholder="第二步放电容量下限(mAh)" :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="第二步放电容量上限(mAh)">
                  <el-input  v-model="processContent.dcj.secondDischargeCapacityUp" placeholder="第二步放电容量上限(mAh)"  :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>

              <div v-if="isCapacityDivision">
              <!-- 容量补偿设置 -->
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
               容量补偿设置
              </el-col>
              <el-col :span="24">
                <el-form-item label="补偿值">
                  <!-- <el-col :span="10"> -->
                    <el-input type="textarea" v-model="processContent.pp.capacityCompensation"  :disabled="isFlowDts"/>
                  <!-- </el-col> -->
                  <!-- type="textarea" -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="K1">
                  <el-input type="number" v-model="processContent.pp.K1"  :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="K2">
                <el-input type="number" v-model="processContent.pp.K2"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="K3">
                <el-input type="number" v-model="processContent.pp.K3"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="K4">
                <el-input type="number" v-model="processContent.pp.K4"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="B">
                <el-input type="number" v-model="processContent.pp.B"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <!-- DCR参数设定 -->
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                  DCR参数设定
              </el-col>
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:16,color:'#000'}">
                <div :style="{display:'flex'}">
                  <p>{{ "参数设定："}} </p>
                  <p>{{ "V0=0E,V1=0,I=0" }}</p>
                </div>
              </el-col>
              <el-col :span="24">
                <div :style="{display:'flex',fontWeight:'bolder'}">
                  <!-- <p>{{ "V0 = 第" }}</p> -->
                  <el-form-item label="V0 = 第">
                    <el-input type="number" v-model="processContent.pp.V0"  :disabled="isFlowDts"/>
                  </el-form-item>
                  <p :style="{marginLeft:'10px',marginRight:'10px'}">{{ "步" }}</p>
                  <!-- <span> -->
                      <el-select v-model="processContent.pp.VoltageType" filterable placeholder="请选择">
                        <el-option
                          v-for="item in VoltageType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  <!-- </span> -->
                </div>
              </el-col>
              <el-col :span="24">
                <div :style="{display:'flex',fontWeight:'bolder'}"> 
                  <!-- // ,justifyContent:'space-around' -->
                  <!-- <p>{{"V1 = 第"}}</p> -->
                  <el-form-item label="V1 = 第">
                    <el-input type="number" v-model="processContent.pp.V1"  :disabled="isFlowDts"/>
                  </el-form-item>
                  <p :style="{marginLeft:'10px',marginRight:'10px'}">{{"步"}}</p>
                  <p>{{ "结束电压" }}</p>
                </div>
              </el-col>
              <el-col :span="24">
                <div :style="{display:'flex',fontWeight:'bolder'}">
                  <!-- <p>{{"I = 第"}}</p> -->
                  <el-form-item label="I = 第">
                    <el-input type="number" v-model="processContent.pp.I"  :disabled="isFlowDts"/>
                  </el-form-item>
                  <p :style="{marginLeft:'10px',marginRight:'10px'}">{{"步"}}</p>
                  <p>{{"平均电流"}}</p>
                </div>
              </el-col>
              <!-- DCR容量补偿设置 -->
              <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                DCR容量补偿设置
              </el-col>
              <el-col :span="24">
                <el-form-item label="补偿值">
                    <el-input type="textarea" v-model="processContent.pp.DCRCapacityCompensation"  :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="H1">
                  <el-input type="number" v-model="processContent.pp.H1"  :disabled="isFlowDts"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="H2">
                <el-input type="number" v-model="processContent.pp.H2"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="H3">
                <el-input type="number" v-model="processContent.pp.H3"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="H4">
                <el-input type="number" v-model="processContent.pp.H4"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="C">
                <el-input type="number" v-model="processContent.pp.C"  :disabled="isFlowDts"/>
              </el-form-item>
            </el-col>
              <!-- 分容步次筛选条件 -->
              
                <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                  步次设置 | 分容筛选条件
                </el-col>
                <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',fontSize:13,color:'#0000FF'}">
                  <el-form-item label="步次">
                    <el-input  v-model="processContent.pp.setStep" placeholder="步次" :disabled="isFlowDts"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <div  :style="{display:'flex',fontWeight:'bolder'}"  class="capacity-division">
                    <el-form-item label="">
                    <el-input type="number" v-model="processContent.pp.capacityDivision1Low" placeholder="分容容量1下限" :disabled="isFlowDts"/>
                    </el-form-item>
                    <!-- <div class="capacity-division"> {{ "<=  分容容量1 <=" }} </div> -->
                    <el-form-item label="<=  分容容量1 <=">
                      <el-input type="number" v-model="processContent.pp.capacityDivision1Up" placeholder="分容容量1上限" :disabled="isFlowDts"/>
                    </el-form-item>
                    <el-form-item label="是否开启分容容量1">
                      <el-switch
                          v-model="processContent.pp.isCapacityDivision1Enable"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="isFlowDts"
                        />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div :style="{display:'flex',fontWeight:'bolder'}"  class="capacity-division">
                    <el-form-item label="">
                    <el-input type="number" v-model="processContent.pp.capacityDivision2Low" placeholder="分容容量2下限" :disabled="isFlowDts"/>
                    </el-form-item>
                    <!-- <div class="capacity-division"> {{ "<=  分容容量2 <=" }} </div> -->
                    <el-form-item label="<=  分容容量2 <=">
                      <el-input type="number" v-model="processContent.pp.capacityDivision2Up" placeholder="分容容量2上限" :disabled="isFlowDts"/>
                    </el-form-item>
                    <el-form-item label="是否开启分容容量2">
                      <el-switch
                          v-model="processContent.pp.isCapacityDivision2Enable"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="isFlowDts"
                        />
                    </el-form-item>
                  </div>
                </el-col>
              </div>

            </el-tab-pane>



            <!--工步参数-->
            <el-tab-pane
              label="工步参数"
              name="param4"
            >
              <el-col :span="24">
                <el-table
                  :data="processContent.sp"
                  stripe
                  border
                  :cell-style="cellStyle"
                  style="width: 100%;"
                  size="mini"
                >
                  <el-table-column
                    prop="stepNo"
                    label="步次"
                    align="center"
                    width="60"
                  />
                  <el-table-column
                    prop="stepState"
                    label="工步"
                    width="150"
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
                    label="时间(min)"
                    width="120"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input style="font-size: 10px"  v-model="scope.row.stepTime" :disabled="isFlowDts"
                      oninput ="value = value.replace(/[^0-9.-]/g,'')"
                      @input="handleInput(scope,'row','stepTime')"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepCurrent"
                    width="120"
                    label="电流(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show3" v-model="scope.row.stepCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepVoltage"
                    width="120"
                    label="电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show4" v-model="scope.row.stepVoltage" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column
                    prop="stepEndVoltage"
                    width="120"
                    label="结束电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show5" v-model="scope.row.stepEndVoltage"/>
                    </template>
                  </el-table-column> -->

                  <el-table-column
                    prop="stepEndCurrent"
                    width="120"
                    label="结束电流(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show6" v-model="scope.row.stepEndCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束容量(mAh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepEndCap" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>


                  <!-- <el-table-column
                    prop="stepVacuum"
                    width="120"
                    label="负压(Kpa)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepVacuum"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepRecordTime"
                    width="120"
                    label="时间差(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepRecordTime"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="voltageDifference"
                    width="120"
                    label="电压差(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.voltageDifference"/>
                    </template>
                  </el-table-column> -->


                  <!-- <el-table-column
                    prop="currentDifference"
                    width="120"
                    label="电流差(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.currentDifference"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepVacuum"
                    width="120"
                    label="负压偏差(kPa)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepVacuumD"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepVacuum"
                    width="120"
                    label="温度下限"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepTempLow"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepVacuum"
                    width="120"
                    label="温度上限"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepTempUp"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepVoltUp"
                    width="120"
                    label="电压保护下限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.voltageProtectionLow"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="voltageProtectionUp"
                    width="120"
                    label="电压保护上限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.voltageProtectionUp"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepVoltUp"
                    width="120"
                    label="容量保护上限(mAH)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.CapProtectionUp"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="CapProtectionUp"
                    width="120"
                    label="能量保护上限(mWh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.energyProtectionUp"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepVoltLow"
                    width="120"
                    label="结束电压下限"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepVoltLow"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepVoltUp"
                    width="120"
                    label="结束电压上限"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepVoltUp"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepEndCapLow"
                    width="120"
                    label="结束容量下限(mAh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepEndCapLow"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepEndEngyUp"
                    width="120"
                    label="结束容量上限(mAh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepEndCapUp"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepEndEngyLow"
                    width="120"
                    label="结束能量下限(mWh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepEndEngyLow"/>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="stepEndCapUp"
                    width="120"
                    label="结束能量上限(mWh)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-model="scope.row.stepEndEngyUp"/>
                    </template>
                  </el-table-column> -->


                  <!--
                                <el-table-column
                                  prop="stepRecordTime"
                                  width="120"
                                  label="记录间隔(s)"
                                >
                                  <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                                    <el-input type="number" v-model="scope.row.stepRecordTime" />
                                  </template>
                                </el-table-column>
                                <el-table-column
                                prop="stepVacuum"
                                width="120"
                                label="真空值(kpa)"
                              >
                                <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                                  <el-input type="number" v-model="scope.row.stepVacuum" />
                                </template>
                              </el-table-column>
                  -->


                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="220"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button v-if="showOperate(scope.row)" type="text" size="small" @click="addSp()" :disabled="isFlowDts">新增</el-button>
                      <el-button  type="text" size="small" @click="deleteSp(scope.row)" :disabled="isFlowDts">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-tab-pane>

            <!--获取数据步次-->
            <!-- <el-tab-pane
              label="获取数据步次"
              name="param5"
            >
              <el-form-item label="起始电压">
                <el-input type="number" v-model="processContent.pp.getStartVoltage" placeholder="起始电压"/>
              </el-form-item>
              <el-form-item label="结束电压">
                <el-input type="number" v-model="processContent.pp.getEndVoltage" placeholder="结束电压"/>
              </el-form-item>

              <el-form-item label="结束容量">
                <el-input type="number" v-model="processContent.pp.getTotalCapacity" placeholder="结束容量"/>
              </el-form-item>
              <el-form-item label="结束能量">
                <el-input type="number" v-model="processContent.pp.getEndEnergy" placeholder="结束能量"/>
              </el-form-item>


              <el-form-item label="启始时间">
                <el-input type="number" v-model="processContent.pp.getStartTime" placeholder="启始时间"/>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-input type="number" v-model="processContent.pp.getEndTime" placeholder="结束时间"/>
              </el-form-item>

              <el-form-item label="负压">
                <el-input type="number" v-model="processContent.pp.getNegativePressure" placeholder="负压"/>
              </el-form-item>
              <el-form-item label="充电能量(Wh)">
                <el-input type="number" v-model="processContent.pp.getChargingEnergy" placeholder="充电能量(Wh)"/>
              </el-form-item>

              <el-form-item label="放电能量(Wh)">
                <el-input type="number" v-model="processContent.pp.getDischargeEnergy" placeholder="放电能量(Wh)"/>
              </el-form-item>
              <el-form-item label="电池温度">
                <el-input type="number" v-model="processContent.pp.getBatteryTemperature" placeholder="电池温度"/>
              </el-form-item>


              <el-form-item label="起始温度">
                <el-input type="number" v-model="processContent.pp.getStartTemperature" placeholder="起始温度"/>
              </el-form-item>
              <el-form-item label="结束温度">
                <el-input type="number" v-model="processContent.pp.getEndTemperature" placeholder="结束温度"/>
              </el-form-item>


              <el-form-item label="拟合容量">
                <el-input type="number" v-model="processContent.pp.getFitCapacity" placeholder="拟合容量"/>
              </el-form-item>

            </el-tab-pane> -->


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
    name: 'chargeModel',
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
        flowShow: true,
        flowTempShow: false,
        colHeight: 'colHeight',
        labelPosition: 'left',
        activeName: "param1",
        isCapacityDivision: false,
        isEndVot:false,
        processContent: {
          pp: {
            /*9线/10线保护参数*/ 
            chargeVoltUp:1,
            chargeCapUp:0,
            currentLow:0,
            t1Time:0,
            t1TimeLow: 0,
            t1TimeUp: 0,
            t2Time:0,
            t2TimeLow:0,
            t2TimeUp:0,
            t2TimeUp:0,
            t3Time:0,
            t4Time:0,
            t5Time:0,
            t5CurrentLow:0,
            t5CurrentUp:0,
            chargeVoltOffset:0,
            chargeLimitTime:0,
            chargeVoltDownTime:0,
            chargeVoltDownValue:0,
            constVoltRise:0,
            constVoltRiseCount:0,
            constVoltRiseContinuous:0,
            chargeVoltDownRange:0,
            chargeVoltDownCount:0,
            chargeVoltDownContinuous:0,
            chargeCheckTime:0,
            chargecheckVoltLow:0,
            voltVoltLow:0,
            dischargeTimeLow:0,
            dischargeCapacityLow:0,
            dischargeVoltUp: 0,
            dischargeVoltCount:0,
            dischargeVoltContinuous:0,
            currentOffset:0,
            overCurrentProtection:0,
            dormancyLoopCurrent:0,
            overVolt:0,
            currentLineOverVolt:0,
            cCVoltageDrop:0,
            vlotDiff:0,
            contactImpedance:0,
            batteryTempAlarm:0,
            scramVolt:0,
            v1CollectTime:0,
            voltDropProtection:0,
            currentPercentProtection:0,
            batteryTempEarlyAlarm:0,
            /*8线保护参数*/ 
            chargeVoltUp8:0,
            chargeCurrUp8:0,
            chargeCapUp8:0,
            constCurrVoltFluProtect8:0,
            constVoltVoltFluProtect8:0,
            chargeDownContinuousVolt8:0,
            chargeVoltCheckTime8:0,
            chargeCheckVolt8:0,
            chargeLimitTime8:0,
            currentOffset8:0,
            voltOffset8:0,
            constVoltRiseContinuous8:0,
            voltageRiseInstantlyVolt8:0,
            voltageRiseInstantlyTime8:0,
            voltageDropInstantlyVolt8:0,
            chargetotalDropVolt8:0,
            constantVoltRefluxinstantly8:0,
            chargeVoltDownCount8:0,
            chargeVoltDownContinuous8:0,
            chargeVoltDownContinuous8:0,
            dischargeVoltLow8:0,
            dischargeOverCurrent8:0,
            dischargeOverCapa8:0,
            dischargeContinuousvoltagerise:0,
            dischargeLimitTime8:0,
            underVoltProtect8:0,
            dischargeVoltRiseInstant8:0,
            constantcurrentOffset8:0,
            currLinevoltDeviation8:0,
            abnormalVoltagevalue8:0,
            LineIRabnormal8:0,
            /* 容量补偿配置 */ 
            capacityCompensation: "(H1*T4)+(H2*T3)+(H3*T2)+(H4*T)+C",
            K1:0,
            K2:0,
            K3:0,
            K4:0,
            B:0,
            /* DCR参数设定 */ 
            V0:0,
            V1:0,
            I:0,
            VoltageType:0,  // V0的电压类型
            // DCR容量补偿设置
            DCRCapacityCompensation: "(H1*T4)+(H2*T3)+(H3*T2)+(H4*T)+C",
            H1:0,
            H2:0,
            H3:0,
            H4:0,
            C:0,
            /* 多电池检测功能 */
            multiBatteryCheck: true,
            /* 步次 */ 
            setStep: 0,
            capacityDivision1Low: 0, // 分容容量1下限
            capacityDivision1Up: 0, // 分容容量1上限
            capacityDivision2Low: 0, // 分容容量2下限
            capacityDivision2Up: 0, // 分容容量2上限
            isCapacityDivision1Enable:0,  // 是否开启分容容量1
            isCapacityDivision2Enable:0,  // 是否开启分容容量2
            /*通用参数*/ 
            endVoltStep: 0,
            endCapaStep: 0,
            startVoltStep: 0,
            endCCCVCapacityStep: 0,
            endCapacityStep: 0,
            nGNumUp: 0,
            outTrayNglimit:0,
            ocvNgCount: 0,
            contactNgCount: 0,
            chargeNgCount: 0,
            globalNGLimit: 0,
            collectTime:0, // 曲线采样时间

          },
          cj: {
            startVoltLow:0,
            startVoltUp: 0,
            isEnable:0,
            endVoltLow:0,
            endVoltUp:0,
            isEndEnable:0,
          },
          dcj:{
            firstDischargeCapacityLow: 0,
            firstDischargeCapacityUp: 0,
            secondDischargeCapacityLow: 0,
            secondDischargeCapacityUp: 0,
          },
          sp: [{
            stepCurrent: 0,
            stepEndCurrent: 0,
            stepEndCap:0,
            // stepEndVoltage: '',
            stepNo: 1,
            //stepRecordTime: '',
            stepState: '',
            stepTime: 0,
            //stepVacuum: '',
            //stepVoltLow: '',
            // stepVoltUp: '',
            stepVoltage: 0,

            /**新增工步*/
            // stepEndEngyUp: '', //结束能量上限(mWh)
            // stepEndEngyLow: '', //结束能量下限(mWh)
            // CapProtectionUp: '', //容量保护上限(mAH)
            // energyProtectionUp: '',//容量保护上限(mWh)
            // voltageProtectionUp: '', //电压保护上限(mV)
            // voltageProtectionLow: '',//电压保护下限(mV)
            // currentDifference: '',//电流差(mA)
            // voltageDifference: '',//电压差(mV)
            // timeDifference:'',//时间差(hh:mm:ss)
            // negativePressure:'',//负压(kPa)
            show3: false,
            show4: false,
            show5: false,
            show6: false,
          }],
          // doubleCheck:{
          //   /**开始电压上下限*/
          //   startVoltageUpper:'0',
          //   startVoltageLower:'0',
          //   /**结束电压上下限*/
          //   stopVoltageUpper:'0',
          //   stopVoltageLower:'0',
          //   /**负压电压上下限*/
          //   negativePressureUpper:'0',
          //   negativePressureLower:'0',
          //   /**放电容量上下限*/
          //   dischargeCapacityUpper:'0',
          //   dischargeCapacityLower:'0',
          //   /**拟合容量上下限*/
          //   fitCapacityUpper:'0',
          //   fitCapacityLower:'0',

          // }
        },
        processContentInit: {
          pp: {
            /*9线/10线保护参数*/ 
            chargeVoltUp:0,
            chargeCapUp:0,
            currentLow:0,
            t1Time:0,
            t1TimeLow: 0,
            t1TimeUp: 0,
            t2Time:0,
            t2TimeLow:0,
            t2TimeUp:0,
            t2TimeUp:0,
            t3Time:0,
            t4Time:0,
            t5Time:0,
            t5CurrentLow:0,
            t5CurrentUp:0,
            chargeVoltOffset:0,
            chargeLimitTime:0,
            chargeVoltDownTime:0,
            chargeVoltDownValue:0,
            constVoltRise:0,
            constVoltRiseCount:0,
            constVoltRiseContinuous:0,
            chargeVoltDownRange:0,
            chargeVoltDownCount:0,
            chargeVoltDownContinuous:0,
            chargeCheckTime:0,
            chargecheckVoltLow:0,
            voltVoltLow:0,
            dischargeTimeLow:0,
            dischargeCapacityLow:0,
            dischargeVoltUp: 0,
            dischargeVoltCount:0,
            dischargeVoltContinuous:0,
            currentOffset:0,
            overCurrentProtection:0,
            dormancyLoopCurrent:0,
            overVolt:0,
            currentLineOverVolt:0,
            cCVoltageDrop:0,
            vlotDiff:0,
            contactImpedance:0,
            batteryTempAlarm:0,
            scramVolt:0,
            v1CollectTime:0,
            voltDropProtection:0,
            currentPercentProtection:0,
            batteryTempEarlyAlarm:0,
            /*8线保护参数*/ 
            chargeVoltUp8:0,
            chargeCurrUp8:0,
            chargeCapUp8:0,
            constCurrVoltFluProtect8:0,
            constVoltVoltFluProtect8:0,
            chargeDownContinuousVolt8:0,
            chargeVoltCheckTime8:0,
            chargeCheckVolt8:0,
            chargeLimitTime8:0,
            currentOffset8:0,
            voltOffset8:0,
            constVoltRiseContinuous8:0,
            voltageRiseInstantlyVolt8:0,
            voltageRiseInstantlyTime8:0,
            voltageDropInstantlyVolt8:0,
            chargetotalDropVolt8:0,
            constantVoltRefluxinstantly8:0,
            chargeVoltDownCount8:0,
            chargeVoltDownContinuous8:0,
            chargeVoltDownContinuous8:0,
            dischargeVoltLow8:0,
            dischargeOverCurrent8:0,
            dischargeOverCapa8:0,
            dischargeContinuousvoltagerise:0,
            dischargeLimitTime8:0,
            underVoltProtect8:0,
            dischargeVoltRiseInstant8:0,
            constantcurrentOffset8:0,
            currLinevoltDeviation8:0,
            abnormalVoltagevalue8:0,
            LineIRabnormal8:0,
            /* 容量补偿配置 */ 
            capacityCompensation: "(K1*T4)+(K2*T3)+(K3*T2)+(K4*T)+B",
            K1:0,
            K2:0,
            K3:0,
            K4:0,
            B:0,
            /* DCR参数设定 */ 
            V0:0,
            V1:0,
            I:0,
            VoltageType:0, 
            // DCR容量补偿设置
            DCRCapacityCompensation: "(H1*T4)+(H2*T3)+(H3*T2)+(H4*T)+C",
            H1:0,
            H2:0,
            H3:0,
            H4:0,
            C:0,
              /* 步次 */ 
            setStep: 0,
            capacityDivision1Low: 0, // 分容容量1下限
            capacityDivision1Up: 0, // 分容容量1上限
            capacityDivision2Low: 0, // 分容容量2下限
            capacityDivision2Up: 0, // 分容容量2上限
            isCapacityDivision1Enable:0,  // 是否开启分容容量1
            isCapacityDivision2Enable:0,  // 是否开启分容容量2
            /*通用参数*/ 
            endVoltStep: 0,
            endCapaStep: 0,
            startVoltStep: 0,
            endCCCVCapacityStep: 0,
            endCapacityStep: 0,
            nGNumUp: 0,
            outTrayNglimit:0,
            ocvNgCount: 0,
            contactNgCount: 0,
            chargeNgCount: 0,
            globalNGLimit: 0,
            collectTime:0, // 曲线采样时间
          },
          cj: {
            startVoltLow:0,
            startVoltUp: 0,
            isEnable:0,
            endVoltLow:0,
            endVoltUp:0,
            isEndEnable:0,
          },
          dcj:{
            firstDischargeCapacityLow: 0,
            firstDischargeCapacityUp: 0,
            secondDischargeCapacityLow: 0,
            secondDischargeCapacityUp: 0,
          },
          sp: [{
            //cycles: '',
            //endStep: '',
            //startStep: '',
            stepCurrent: 0,
            stepEndCurrent: 0,
            stepEndCap:0,
            // stepEndVoltage: '',
            stepNo: 1,
            //stepRecordTime: '',
            stepState: '',
            stepTime: 0,
            //stepVacuum: '',
            //stepVoltLow: '',
            // stepVoltUp: '',
            stepVoltage: 0,
            /**新增工步*/
            // stepEndEngyUp: '', //结束能量上限(mWh)
            // stepEndEngyLow: '', //结束能量下限(mWh)
            // CapProtectionUp: '', //容量保护上限(mAH)
            // energyProtectionUp: '',//容量保护上限(mWh)
            // voltageProtectionUp: '', //电压保护上限(mV)
            // voltageProtectionLow: '',//电压保护下限(mV)
            // currentDifference: '',//电流差(mA)
            // voltageDifference: '',//电压差(mV)
            // timeDifference:'',//时间差(hh:mm:ss)
            // negativePressure:'',//负压(kPa)

            show3: false,
            show4: false,
            show5: false,
            show6: false,
          }],
          // doubleCheck:{
          //   /**开始电压上下限*/
          //   startVoltageUpper:'0',
          //   startVoltageLower:'0',
          //   /**结束电压上下限*/
          //   stopVoltageUpper:'0',
          //   stopVoltageLower:'0',
          //   /**负压电压上下限*/
          //   negativePressureUpper:'0',
          //   negativePressureLower:'0',
          //   /**放电容量上下限*/
          //   dischargeCapacityUpper:'0',
          //   dischargeCapacityLower:'0',
          //   /**拟合容量上下限*/
          //   fitCapacityUpper:'0',
          //   fitCapacityLower:'0',

          // }
        },
        bizId: '',
        dataUpdateParam: {}
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
              // el-input框设定浮点型
              handleInput(obj,attr,name) {
            // console.log(obj, attr, name)
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
        let checkBody = this.check();
        if(checkBody){
          this.$message({
            message: checkBody,
            type: 'error'
          })
          return false;
        }

        for(let k in this.processContent.pp) {
          if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
          || k=='voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k=='constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' || 
          k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' || 
          k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8' 
          || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k== 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
          k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' || 
          k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
           k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k =='constVoltRiseCount' || 
           k == 'constVoltRiseContinuous' || k =='chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k =='voltVoltLow' || k == 'dischargeTimeLow' || k =='dischargeCapacityLow' || k=='dischargeUpCapacity' || k=='dischargeCurrentOffsetUp' || k=='dischargeVoltUp' || k =='dischargeVoltCount' ||
           k == 'dischargeVoltContinuous' || k=='currentOffset' || k=='overCurrentProtection' || k=='dormancyLoopCurrent' || k=='overVolt' || k=='currentLineOverVolt' ||
           k =='cCVoltageDrop' || k=='contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k== 'voltDropProtection' ||
           k=='batteryTempEarlyAlarm' || k=='currentPercentProtection' || k =='endVoltStop' || k=='endCapaStop' || k=='endCCCVCapacityStep' || k=='endCapacityStep'
            || k=='globalNGLimit'|| k=='t5CurrentUp' || k=='t1TimeUp' || k=='isCapacityDivision1Enable' || k=='isCapacityDivision2Enable'
            || k=='isEnable' || k=='chargeCheckVolt8'|| k=='isEndEnable' || k=='setStep' || k=='VoltageType' || k=='V0' || k=='V1' || k=='I' || k=='collectTime') 
            {
              this.processContent.pp[k] =  this.processContent.pp[k] ? parseInt(this.processContent.pp[k]) : this.processContent.pp[k]
            } 
            if(k == 'K1' || k == 'K2' || k == 'K3' || k == 'K4' || k == 'B'|| k == 'H1' || k == 'H2' || k == 'H3' || k == 'H4' || k == 'C' 
            || k == 'capacityDivision1Low' || k == 'capacityDivision1Up' || k == 'capacityDivision2Low' || k == 'capacityDivision2Up'
              ) {
              this.processContent.pp[k] =  this.processContent.pp[k] ? parseFloat(this.processContent.pp[k]) : this.processContent.pp[k]
            }

        }
        for(let k in this.processContent.cj) {
          if (k == 'startVoltLow' || k == 'startVoltUp' || k=='endVoltLow' || k=='endVoltUp') {
            this.processContent.cj[k] =  this.processContent.cj[k] ? parseInt(this.processContent.cj[k]) : this.processContent.cj[k]
          }
        }
        for(let d in this.processContent.dcj) {
          if(d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp'){
            this.processContent.dcj[d] =  this.processContent.dcj[d] ? parseInt(this.processContent.dcj[d]) : this.processContent.dcj[d]
          }
        }

        this.processContent.sp.forEach((item,i) => {
          for(let k in item){
              if (k=='stepNo' || k=='stepCurrent' || k=='stepVoltage' || k=='stepEndCurrent' || k=='stepEndCap') {
                this.processContent.sp[i][k] =  this.processContent.sp[i][k] ? parseInt(this.processContent.sp[i][k]): this.processContent.sp[i][k]
              }
              if(k=='stepTime') {
                this.processContent.sp[i][k] =  this.processContent.sp[i][k] ? parseFloat(this.processContent.sp[i][k]): this.processContent.sp[i][k]
            }
          }
        })
        // let ttp = {...this.processContent.pp}, paramsSp = [...this.processContent.sp], newT = {},newSp=[];
        // for (let k in ttp) {
        //       if (!ttp[k]) {
        //         delete ttp[k]
        //       }
        //   }
        // paramsSp.forEach((item,a) => {
        //     for(let k1 in item) {
        //       console.log(k1,item)
        //       if (!paramsSp[a][k1]) {
        //         delete item[k1]
        //       }
        //     }
        // })
          
        // console.log(ttp,paramsSp,newSp) 
        const json = {
          data: {
            flowDtId: this.dataUpdateParam.flowDtId,
            id: this.dataUpdateParam.id,
            processContent: JSON.stringify(this.processContent),
            processId: this.dataUpdateParam.processId
          }
        }
        // console.log(JSON.parse(json.processContent))
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
        if (parseInt(this.processContent.pp.t1TimeUp) < parseInt(this.processContent.pp.t1TimeLow)) {
          return 'T1时间电压上限[' + this.processContent.pp.t1TimeUp + ']小于下限[' + this.processContent.pp.t1TimeLow + ']'
        } else if (parseInt(this.processContent.pp.t2TimeUp) < parseInt(this.processContent.pp.t2TimeLow)) {
          return 'T2时间电压上限[' + this.processContent.pp.t2TimeUp + ']小于下限[' + this.processContent.pp.t2TimeLow + ']'
        } else if (parseInt(this.processContent.pp.t5CurrentUp) < parseInt(this.processContent.pp.t5CurrentLow)) {
          return 'T5时间电流上限[' + this.processContent.pp.t5CurrentUp + ']小于下限[' + this.processContent.pp.t5CurrentLow + ']'
        } 
        for(var k in this.processContent.pp) {
          if (k !== 'DCRCapacityCompensation' && k!=='capacityCompensation' && !this.processContent.pp[k]) {
              this.processContent.pp[k] = 0;
          }
        }
        for(let k in this.processContent.cj) {
          if (!this.processContent.cj[k]) {
              this.processContent.cj[k] = 0;
          }
        }
        for(let k in this.processContent.dcj) {
          if (!this.processContent.dcj[k]) {
              this.processContent.dcj[k] = 0;
          }
        }
        

        this.processContent.sp.forEach((item,i) => {
          for(let k in item){
              if (k != "stepState" && k!= "show3" && k!= "show4"&& k!= "show5" && k!= "stepNo") {
                if(!this.processContent.sp[i][k]) {
                    this.processContent.sp[i][k] = 0;
                }
          }
            }
          })
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
          //cycles: '',
          //endStep: '',
          //startStep: '',
          stepCurrent: 0,
          stepEndCurrent: 0,
          stepEndCap:0,
         // stepEndVoltage: '',
          stepNo: this.processContent.sp.length + 1,
          //stepRecordTime: '',
          stepState: '',
          stepTime: 0,
          //stepVacuum: '',
          //stepVoltLow: '',
         // stepVoltUp: '',
          stepVoltage: 0
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
        if(row.label &&row.label.split("_")[1] === "3003" || row.label &&row.label.split("_")[1] === "3004" || row.label &&row.label.split("_")[1] === "3005") {
          //分容节点就可设置分容容量条件
          this.isCapacityDivision = true
        } else {
          this.isCapacityDivision = false
        }
        if((row.label &&row.label.split("_")[1]  === "3001") || (row.label &&row.label.split("_")[1]  === "3002")) {  
          //预化成或化成节点显示结束电压下限和上限
          this.isEndVot = true
        } else {
          this.isEndVot = false
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
            getJson.pp.capacityCompensation?
            getJson.pp.capacityCompensation:getJson.pp.capacityCompensation  = "(K1*T4)+(K2*T3)+(K3*T2)+(K4*T)+B"
            getJson.pp.DCRCapacityCompensation?
            getJson.pp.DCRCapacityCompensation:getJson.pp.DCRCapacityCompensation  = "(H1*T4)+(H2*T3)+(H3*T2)+(H4*T)+C"
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
        if (chargeStep === 'DC') { // 放电
          if (index == 4) {
            this.processContent.sp[row.rowIndex]['show' + index] = true //false
            return 'background:#7d7d7d;color:red'
          }else if (index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          }  
          else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'Sleep') {  // 休眠
          if (index == 3 || index == 4 || index == 5 || index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red;'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CCCV') { //恒流恒压充电
          if (index == 5) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CC') { // 恒流充电
          if (index == 4) {  // || index == 6
            this.processContent.sp[row.rowIndex]['show' + index] = true //false
            return 'background:#7d7d7d;color:red'
          } else if (index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } 
          else if (index >= 2) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CV') {  // 恒压充电
          if (index == 3) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
            return 'background:#7d7d7d;color:red'
          } else if(index == 5) {
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
  #chargeParamTemp3 {
    // ::v-deep #inputGS .el-input__inner{
    //     width:300px !important;
    // }
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
    // ::v-deep .wee div.el-form-item {
    //   margin-bottom:0 !important;
    // }
    // .capacity-division {
    //   // display: flex;
    //   // justify-content: center;
    //   // align-items: center;
    //   margin-left: 10px;
    //   margin-right: 10px;
    // }
    .colHeight {
      height: 40px;
    }

    .colTextHeight {
      font-weight: bolder;
      font-size: 15px;
      color: red;
      .space-style {
        height: 1px;
      }
      .param-illustrate {
        color: #409efe;
      }
    }
  }

</style>
<style>
   .capacity-division .el-form-item {
        margin-right:  7%;
    }
</style>
