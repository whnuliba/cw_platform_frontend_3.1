<template>
  <el-col :span="24" :offset="1">
    <div id="chargeParamTemp">
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
            <!--工步参数-->
            <el-tab-pane
              label="工步参数"
              name="param1"
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
                    label="工步类型"
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
                    prop="current"
                    label="电流(mA)"
                    width="160"
                  >
                    <template slot-scope="scope">
                      <el-input  type="number" style="font-size: 10px" v-if="scope.row.show2 && scope.row.stepState != 'LOOP'" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                      @input="handleInput(scope,'row','current')" v-model="scope.row.current" :disabled="isFlowDts" 
                      />
                      <el-input type="number"  v-else-if="scope.row.stepState === 'LOOP'"  v-model="scope.row.loopStart" :disabled="isFlowDts"> 
                        <template slot="prepend">起始:</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="voltage"
                    width="160"
                    label="电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number"  v-if="scope.row.show3 && scope.row.stepState != 'LOOP'" v-model="scope.row.voltage" :disabled="isFlowDts"/>
                      <el-input type="number"  v-else-if="scope.row.stepState === 'LOOP'" v-model="scope.row.loopCount" :disabled="isFlowDts"> 
                        <template slot="prepend">次数:</template>
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepVoltage"
                    width="250"
                    label="结束时间"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <!-- <el-input type="number" v-if="scope.row.show4" v-model="scope.row.endTime" :disabled="isFlowDts"/> -->
                      <el-time-picker
                        v-if="scope.row.show4"
                        v-model="scope.row.endTime"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCurrent"
                    width="120"
                    label="结束电流(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show5" v-model="scope.row.endCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束电压(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number"  v-if="scope.row.show6" v-model="scope.row.endVoltage" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束容量(mAH)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number"  v-if="scope.row.show7" v-model="scope.row.endCapacity" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="负压(kPa)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show8" v-model="scope.row.negPressure" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="250"
                    label="时间差"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <!-- <el-input type="number" v-model="scope.row.DVTime" :disabled="isFlowDts"/> -->
                      <el-time-picker
                        v-if="scope.row.show9"
                        v-model="scope.row.DVTime"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="电压差(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show10" v-model="scope.row.DVVoltage" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="电流差(mA)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show11" v-model="scope.row.DVCurrent" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="负压偏差(kPa)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show12" v-model="scope.row.DVnegPressure" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="电压下限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show13" v-model="scope.row.voltLowerLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="电压上限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show14" v-model="scope.row.voltUpperLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="温度下限(℃)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show15" v-model="scope.row.tempLowerLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="温度上限(℃)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show16" v-model="scope.row.tempUpperLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="电压波动(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show17" v-model="scope.row.voltageFluctuation" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束电压下限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show18" v-model="scope.row.endVoltLowerLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束电压上限(mV)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show19" v-model="scope.row.endVoltUpperLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束容量下限(mAH)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show20" v-model="scope.row.endCapacityLowerLimit" :disabled="isFlowDts"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stepEndCap"
                    width="120"
                    label="结束容量上限(mAH)"
                  >
                    <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
                      <el-input type="number" v-if="scope.row.show21" v-model="scope.row.endCapacityUpperLimit" :disabled="isFlowDts"/>
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
                      <el-button  type="text" size="small" @click="deleteSp(scope.row)" :disabled="isFlowDts">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-tab-pane>
           <!--保护参数-->
            <el-tab-pane
              label="保护参数"
              name="param2"
            >
              <el-form-item label="充电电压上限(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltUpperLimit" placeholder="充电电压上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流电压波动保护(mV)">
                <el-input type="number" v-model="processContent.pp.constCurrVoltFluProtect" placeholder="充电过流保护" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-form-item label="T1时间(s)"> -->

              <!-- <el-col :span="24" :class="colHeight">  :style="{float:'left'}" style="width: 50%"  :style="{float:'left'}"-->
              <el-form-item label="电流电压线电压偏差限制(mV)">
                <el-input type="number" v-model="processContent.pp.diffVoltCurrentLine" placeholder="电流电压线电压偏差限制" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="启动前电压检测下限(mV)">
                <el-input type="number" v-model="processContent.pp.voltBefStartUpLowerLimit" placeholder="启动前电压检测下限" :disabled="isFlowDts"/>
              </el-form-item>
              <!-- </el-col> -->
              <el-form-item label="平均电压偏差检测偏差上限(mV)">
                <el-input type="number" v-model="processContent.pp.averageVoltDeviationUpperLimit" placeholder="平均电压偏差检测偏差上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压下限(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltLowerLimit" placeholder="放电电压下限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电压波动保护(mV)">
                <el-input type="number" v-model="processContent.pp.voltFluProtectConsVolt" placeholder="恒压电压波动保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="DeltaV监测(mV)">
                <el-input type="number" v-model="processContent.pp.DeltaV" placeholder="DeltaV监测" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="启动前电压检测上限(mV)">
                <el-input type="number" v-model="processContent.pp.voltBefStartUpUpperLimit" placeholder="启动前电压检测上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="平均电压偏差检测延时(mV)">
                <el-input type="number" v-model="processContent.pp.averageVoltDeviationDetectionDelay" placeholder="平均电压偏差检测延时" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电时电压连续下降(mV)">
                <el-input type="number" v-model="processContent.pp.voltageDropContinueCharge" placeholder="充电时电压连续下降" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压上升限制(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltRiseLimit" placeholder="放电电压上升限制" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="定时刻最小电压检测(mV)">
                <el-input type="number" v-model="processContent.pp.voltBefStartUpAllowNGQuality" placeholder="定时刻最小电压检测" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="启动前电压检测允许NG个数">
                <el-input type="number" v-model="processContent.pp.voltageRiseInstantlyTime8" placeholder="充电瞬间电压上升保护间隔" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="连续次数">
                <el-input type="number" v-model="processContent.pp.consecutiveTime" placeholder="连续次数" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电压瞬间上升保护(mV)">
                <el-input type="number" v-model="processContent.pp.dischargeVoltRiseInstant" placeholder="放电电压瞬间上升保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="定时刻[最小电压检测](Min)">
                <el-input type="number" v-model="processContent.pp.voltDropDuringCharge" placeholder="定时刻[最小电压检测]" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电中电压下降(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownCount8" placeholder="充电中电压下降" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电中瞬间电压上升(mV)">
                <el-input type="number" v-model="processContent.pp.chargeVoltDownContinuous8" placeholder="充电中瞬间电压上升" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="累计次数">
                <el-input type="number" v-model="processContent.pp.cumulativeNumTimes" placeholder="累计次数" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电中瞬间电压下降(mV)">
                <el-input type="number" v-model="processContent.pp.voltDropInstantDuringCharge" placeholder="充电中瞬间电压下降" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="母线电压保护(mV)">
                <el-input type="number" v-model="processContent.pp.busVoltProtection" placeholder="母线电压保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电电流上限(mA)">
                <el-input type="number" v-model="processContent.pp.chargeCurrentUpperLimit" placeholder="充电电流上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="电流波动保护(mA)">
                <el-input type="number" v-model="processContent.pp.currentFluProtection" placeholder="电流波动保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流连续上升保护(mA)">
                <el-input type="number" v-model="processContent.pp.currentContinueRiseProtectWhileCVC" placeholder="恒压电流连续上升保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电电流上限(mA)">
                <el-input type="number" v-model="processContent.pp.disChargeCurrentUpperLimit" placeholder="放电电流上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒流时电流偏差保护(mA)">
                <el-input type="number" v-model="processContent.pp.constantcurrentOffset8" placeholder="恒流时电流偏差保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="DeltaI监测(mA)">
                <el-input type="number" v-model="processContent.pp.DeltaI" placeholder="DeltaI监测" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="恒压电流瞬间上升保护(mA)">
                <el-input type="number" v-model="processContent.pp.currentRiseInstantWhileCVC" placeholder="恒压电流瞬间上升保护" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电容量上限(mAH)">
                <el-input type="number" v-model="processContent.pp.chargeCapacityUpperLimit" placeholder="充电容量上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="充电时间限制(Min)">
                <el-input type="number" v-model="processContent.pp.chargeTimeLimit" placeholder="充电时间限制" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电容量上限(mAH)">
                <el-input type="number" v-model="processContent.pp.dischargeCapacityUpperLimit" placeholder="放电容量上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="放电时间限制(Min)">
                <el-input type="number" v-model="processContent.pp.dischargeLimit" placeholder="放电时间限制" :disabled="isFlowDts"/>
              </el-form-item>
            
            </el-tab-pane>

            <!-- 通用参数 -->
            <el-tab-pane
              label="容量补偿"
              name="param3"
            >
            <el-col :span="24" class="colStyle">
              [公式] 补偿容量 = 总容量 / a
            </el-col>
              <el-form-item label="补偿容量下限">
                <el-input type="number" v-model="processContent.pp.endCapaStep" placeholder="补偿容量下限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="补偿容量上限">
                <el-input type="number" v-model="processContent.pp.startVoltStep" placeholder="补偿容量上限" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="容量补偿工步号">
                <el-input type="number" v-model="processContent.pp.capacityCompensationStepNo" placeholder="容量补偿工步号" :disabled="isFlowDts"/>
              </el-form-item>
              <el-form-item label="容量补偿系数A">
                <el-input type="number" v-model="processContent.pp.capacityCompensationCoefficientA" placeholder="容量补偿系数A" :disabled="isFlowDts"/>
              </el-form-item>
              
              <el-col :span="24" :style="{height:'15px'}"/>
              <el-col :span="12">
                <el-form-item label="能量工步号">
                  <el-input type="number" v-model="processContent.pp.energyStepNo" placeholder="能量工步号" :disabled="isFlowDts"/>
                </el-form-item>
                <el-form-item label="能量下限">
                  <el-input type="number" v-model="processContent.pp.energyLowerLimit" placeholder="能量下限" :disabled="isFlowDts"/>
                </el-form-item>
                <el-form-item label="能量上限">
                  <el-input type="number" v-model="processContent.pp.energyUpperLimit" placeholder="能量上限" :disabled="isFlowDts"/>
                </el-form-item>
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
            chargeVoltUpperLimit:"",
            constCurrVoltFluProtect:"",
            diffVoltCurrentLine:"",
            voltBefStartUpLowerLimit:"",
            averageVoltDeviationUpperLimit:"",
            DeltaV:"",
            voltBefStartUpUpperLimit:"",
            averageVoltDeviationDetectionDelay:"",
            voltageDropContinueCharge:"",
            dischargeVoltRiseLimit:"",
            fixTimeMinVoltDetection:"",
            voltBefStartUpAllowNGQuality:"",
            consecutiveTime:"",
            dischargeVoltRiseInstant:"",
            MinVoltDetectionSetTime:"",
            voltDropDuringCharge:"",
            voltRiseInstantDuringCharge:"",
            cumulativeNumTimes:"",
            voltDropInstantDuringCharge:"",
            busVoltProtection:"",
            chargeCurrentUpperLimit:"",
            currentFluProtection:"",
            currentContinueRiseProtectWhileCVC:"",
            disChargeCurrentUpperLimit:"",
            DeltaI:"",
            currentRiseInstantWhileCVC:"",
            chargeCapacityUpperLimit:"",
            chargeTimeLimit:"",
            dischargeCapacityUpperLimit:"",
            dischargeLimit:"",
          },
          cc: {
            capacityCompensationStepNo:0,
            compensationCapacityLowerLimit: 0,
            compensationCapacityUpperLimit:0,
            capacityCompensationCoefficientA:0,
            energyLowerLimit:0,
            energyUpperLimit:0,
          },
          sp: [{
            stepNo: 1,
            mode:"",
            current:"",
            voltage:"",
            loopStart:"",
            loopCount:"",
            endTime:"",
            endCurrent:"",
            endVoltage:"",
            endCapacity:"",
            DVTime:"",
            negPressure:"",
            DVVoltage:"",
            DVCurrent:"",
            DVnegPressure:"",
            voltLowerLimit:"",
            voltUpperLimit:"",
            tempLowerLimit:"",
            tempUpperLimit:"",
            voltageFluctuation:"",
            endVoltLowerLimit:"",
            endVoltUpperLimit:"",
            endCapacityLowerLimit:"",
            endCapacityUpperLimit:"",
            show2: true,  
            show3: true,
            show4: true,
            show5: true,
            show6: true,
            show7: true,
          }],

        },
        processContentInit: {
          pp: {
            chargeVoltUpperLimit:"",
            constCurrVoltFluProtect:"",
            diffVoltCurrentLine:"",
            voltBefStartUpLowerLimit:"",
            averageVoltDeviationUpperLimit:"",
            DeltaV:"",
            voltBefStartUpUpperLimit:"",
            averageVoltDeviationDetectionDelay:"",
            voltageDropContinueCharge:"",
            dischargeVoltRiseLimit:"",
            fixTimeMinVoltDetection:"",
            voltBefStartUpAllowNGQuality:"",
            consecutiveTime:"",
            dischargeVoltRiseInstant:"",
            MinVoltDetectionSetTime:"",
            voltDropDuringCharge:"",
            voltRiseInstantDuringCharge:"",
            cumulativeNumTimes:"",
            voltDropInstantDuringCharge:"",
            busVoltProtection:"",
            chargeCurrentUpperLimit:"",
            currentFluProtection:"",
            currentContinueRiseProtectWhileCVC:"",
            disChargeCurrentUpperLimit:"",
            DeltaI:"",
            currentRiseInstantWhileCVC:"",
            chargeCapacityUpperLimit:"",
            chargeTimeLimit:"",
            dischargeCapacityUpperLimit:"",
            dischargeLimit:"",
          },
          cc: {
            capacityCompensationStepNo:0,
            compensationCapacityLowerLimit: 0,
            compensationCapacityUpperLimit:0,
            capacityCompensationCoefficientA:0,
            energyLowerLimit:0,
            energyUpperLimit:0,
          },
          sp: [{
            stepNo: 1,
            mode:"",
            current:"",
            voltage:"",
            loopStart:"",
            loopCount:"",
            endTime:"",
            endCurrent:"",
            endVoltage:"",
            endCapacity:"",
            DVTime:"",
            negPressure:"",
            DVVoltage:"",
            DVCurrent:"",
            DVnegPressure:"",
            voltLowerLimit:"",
            voltUpperLimit:"",
            tempLowerLimit:"",
            tempUpperLimit:"",
            voltageFluctuation:"",
            endVoltLowerLimit:"",
            endVoltUpperLimit:"",
            endCapacityLowerLimit:"",
            endCapacityUpperLimit:"",
            show2: true,  
            show3: true,
            show4: true,
            show5: true,
            show6: true,
            show7: true,
          }],
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
            console.log(obj, attr, name)
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

        // for(let k in this.processContent.pp) {
        //   if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
        //   || k=='voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k=='constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' || 
        //   k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' || 
        //   k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8' 
        //   || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k== 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
        //   k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' || 
        //   k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
        //    k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k =='constVoltRiseCount' || 
        //    k == 'constVoltRiseContinuous' || k =='chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k =='voltVoltLow' || k == 'dischargeTimeLow' || k =='dischargeCapacityLow' || k=='dischargeUpCapacity' || k=='dischargeCurrentOffsetUp' || k=='dischargeVoltUp' || k =='dischargeVoltCount' ||
        //    k == 'dischargeVoltContinuous' || k=='currentOffset' || k=='overCurrentProtection' || k=='dormancyLoopCurrent' || k=='overVolt' || k=='currentLineOverVolt' ||
        //    k =='cCVoltageDrop' || k=='contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k== 'voltDropProtection' ||
        //    k=='batteryTempEarlyAlarm' || k=='currentPercentProtection' || k =='endVoltStop' || k=='endCapaStop' || k=='endCCCVCapacityStep' || k=='endCapacityStep'
        //   || k=='globalNGLimit'|| k=='t5CurrentUp' || k=='t1TimeUp' || k=='isEnable' || k=='chargeCheckVolt8'|| k=='isEndEnable' || k=='collectTime'
        //      ) 
        //     {
        //       this.processContent.pp[k] =  this.processContent.pp[k] ? parseInt(this.processContent.pp[k]) : this.processContent.pp[k]
        //     } 


        // }
        // for(let k in this.processContent.cj) {
        //   if (k == 'startVoltLow' || k == 'startVoltUp' || k=='endVoltLow' || k=='endVoltUp') {
        //     this.processContent.cj[k] =  this.processContent.cj[k] ? parseInt(this.processContent.cj[k]) : this.processContent.cj[k]
        //   }
        // }
        // for(let d in this.processContent.dcj) {
        //   if(d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp'){
        //     this.processContent.dcj[d] =  this.processContent.dcj[d] ? parseInt(this.processContent.dcj[d]) : this.processContent.dcj[d]
        //   }
        // }

        // this.processContent.sp.forEach((item,i) => {
        //   for(let k in item){
        //       if (k=='stepNo' || k=='stepCurrent' || k=='stepVoltage' || k=='stepEndCurrent' || k=='stepEndCap') {
        //                 this.processContent.sp[i][k] =  this.processContent.sp[i][k] ? parseInt(this.processContent.sp[i][k]): this.processContent.sp[i][k]
        //       }
        //     if(k=='stepTime') {
        //           this.processContent.sp[i][k] =  this.processContent.sp[i][k] ? parseFloat(this.processContent.sp[i][k]): this.processContent.sp[i][k]
        //     }
        //   }
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
        console.log(JSON.parse(json.data.processContent))
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
        // for(var k in this.processContent.pp) {
        //   if (!this.processContent.pp[k]) {
        //       this.processContent.pp[k] = 0;
        //   }
        // }
        // for(let k in this.processContent.cj) {
        //   if (!this.processContent.cj[k]) {
        //       this.processContent.cj[k] = 0;
        //   }
        // }
        // for(let k in this.processContent.dcj) {
        //   if (!this.processContent.dcj[k]) {
        //       this.processContent.dcj[k] = 0;
        //   }
        // }

        // this.processContent.sp.forEach((item,i) => {
        //   for(let k in item){
        //       if (k != "stepState" && k!= "show3" && k!= "show4"&& k!= "show5" && k!= "stepNo") {
        //         if(!this.processContent.sp[i][k]) {
        //             this.processContent.sp[i][k] = 0;
        //         }
        //   }
        //     }
        //   })
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
        const json = 
          {
            stepNo: this.processContent.sp.length + 1,
            mode:"",
            current:"",
            voltage:"",
            endTime:"",
            endCurrent:"",
            endVoltage:"",
            endCapacity:"",
            DVTime:"",
            negPressure:"",
            DVVoltage:"",
            DVCurrent:"",
            DVnegPressure:"",
            voltLowerLimit:"",
            voltUpperLimit:"",
            tempLowerLimit:"",
            tempUpperLimit:"",
            voltageFluctuation:"",
            endVoltLowerLimit:"",
            endVoltUpperLimit:"",
            endCapacityLowerLimit:"",
            endCapacityUpperLimit:"",
            show2: true,  
            show3: true,
            show4: true,
            show5: true,
            show6: true,
            show7: true,
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
        // const json = {data: 'FMS_STEP'}
        // httpUtils.actionAuthPost('/sys/get-param-by-code', json).then(data => {
          this.options = [
                  {paramDsc:'恒流恒压充电',paramValue:'CCCV'},{paramDsc:'恒流充电',paramValue:'CCC'},{paramDsc:'恒流放电',paramValue:'CCD'},
                  {paramDsc:'恒流恒压放电',paramValue:'CCDV'},{paramDsc:'静置',paramValue:'REST'},{paramDsc:'循环',paramValue:'LOOP'}
                ]
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
            getJson.pp.capacityCompensation?
            getJson.pp.capacityCompensation:getJson.pp.capacityCompensation  = "(K1*T4)+(K2*T3)+(K3*T2)+(K4*T)+B"

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
        console.log(chargeStep, index, row)
        if (chargeStep === 'CCCV') { // 恒流恒压充电
          
          if (index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          }
           else if (index >= 1) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CCC') {  // 恒流充电
          if (index == 3 || index == 5) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red;'
          }
          else if (index >= 1) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CCD') { //恒流放电
          if (index == 3 || index == 5) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } 
          else if (index >= 1) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'CCDV') { // 恒流恒压放电
          if (index == 6) {
            this.processContent.sp[row.rowIndex]['show' + index] = false //false
            return 'background:#7d7d7d;color:red'
          }
          else if (index >= 1) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'REST') {  // 静置
          if (index == 2 ||index == 3 || index == 5 || index == 6|| index == 7) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          } 
          else if (index >= 1) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
        }

        if (chargeStep === 'LOOP') {  // 循环
          if (index == 2 || index == 3 || index == 9 || index == 10 || index == 11 ) {
            this.processContent.sp[row.rowIndex]['show' + index] = true
          }
          else if (index > 1 && row.columnIndex != 22) {
            this.processContent.sp[row.rowIndex]['show' + index] = false
            return 'background:#7d7d7d;color:red'
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #chargeParamTemp {
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
    //   ::v-deep .el-form--inline .el-form-item {
    //     margin-right: 60px;
    //   }
    // }
    .colStyle {
      height: 40px;
      font-weight: bolder;
      font-size:17px;
      color:#0000FF
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
