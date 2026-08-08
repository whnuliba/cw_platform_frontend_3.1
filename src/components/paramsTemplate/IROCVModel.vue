<template>
    <el-col :span="22" :offset=1>
        <el-form :inline="true" :label-position="labelPosition" label-width="180px" :model="processContent">
            <!-- IROCV参数 -->
            <div class="container front_container">
                <el-row>
                    <el-form-item label="电压下限(mV)">
                        <el-input  v-model="processContent.pp.VoltageLowerLmt" placeholder="电压下限(mV)" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                        @input="handleInput('processContent','pp','VoltageLowerLmt')"
                        :disabled="isFlowDts"/>
                    </el-form-item>
                    <el-form-item label="电压上限(mV)">
                        <el-input  v-model="processContent.pp.VoltageUpperLmt" placeholder="电压上限(mV)" :disabled="isFlowDts" oninput ="value = value.replace(/[^0-9.-]/g,'')"
                        @input="handleInput('processContent','pp','VoltageUpperLmt')"/>
                    </el-form-item>

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
                        <el-input v-model="processContent.pp.NGRetestNum" placeholder="NG复测数量(ea)" :disabled="isFlowDts"></el-input>
                    </el-form-item>
                    <el-form-item label="NG复测次数(ea)" >
                        <el-input v-model="processContent.pp.NGRetestCount" placeholder="NG复测次数(ea)" :disabled="isFlowDts"></el-input>
                    </el-form-item>
                    <el-form-item label="NG出库限制(ea)" >
                        <el-input v-model="processContent.pp.NGOutboundLimit" placeholder="NG出库限制(ea)" :disabled="isFlowDts"></el-input>
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
                    <!-- <el-col :span="24" :class="colHeight" :style="{fontWeight: 'bolder',color:'#0000FF'}">
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
                    </el-form-item> -->
                </el-row>
<!-- ----------------------------------------------------- -->
                <el-row class="colHeight">
                    <el-col :span="24" :style="{ display: 'flex' }">
                        <!-- <div class="inline_item label_item"> OCV/IR测试选项 </div> -->
                        <el-form-item label="OCV/IR测试选项">
                            <el-checkbox v-model="processContent.pp.ocvTest" :disabled="isFlowDts">OCV测试</el-checkbox>
                            <el-checkbox v-model="processContent.pp.irTest" :disabled="isFlowDts">IR测试</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="11">
                        <div class="label_item">正常合格品范围</div>
                        <el-row class="colHeight">
                            <el-col :span="6" style="text-align:center">
                                <el-form-item>
                                    <el-input v-model="processContent.pp.acceptOcvLower" placeholder="下限"
                                        :disabled="isFlowDts"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" style="line-height: 40px; text-align: center;">
                                <span class="inline_item"> &lt= </span>
                                <div class="inline_item label_item"> 合格电芯电压(mV)</div>
                                <span class="inline_item"> &lt= </span>
                            </el-col>
                            <el-col :span="6" style="text-align:center">
                                <el-form-item>
                                    <el-input v-model="processContent.pp.acceptOcvUpper" placeholder="上限"
                                        :disabled="isFlowDts"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="colHeight">
                            <el-col :span="6" style="text-align:center">
                                <el-form-item>
                                    <el-input v-model="processContent.pp.acceptAcrLower" placeholder="下限"
                                        :disabled="isFlowDts"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" style="line-height: 40px; text-align: center;">
                                <span class="inline_item"> &lt= </span>
                                <div class="inline_item label_item"> 合格电芯ACR(mΩ)</div>
                                <span class="inline_item"> &lt= </span>
                            </el-col>
                            <el-col :span="6" style="text-align:center">
                                <el-form-item>
                                    <el-input v-model="processContent.pp.acceptAcrUpper" placeholder="上限"
                                        :disabled="isFlowDts"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col :span="2">&nbsp</el-col>

                    <el-col :span="11">
                        <div class="label_item">NG次数的限制参数</div>
                        <el-row class="colHeight">
                            <div class="inline_item label_item"> 测试托盘NG总数限制 </div>
                            <el-form-item label="" :style="{ width: '25%' }">
                                <el-input v-model="processContent.pp.testTrayNgLimit" :disabled="isFlowDts"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row class="colHeight">
                            <div class="inline_item label_item"> 通道连续NG总数限制 </div>
                            <el-form-item label="" :style="{ width: '25%' }">
                                <el-input v-model="processContent.pp.channelNgLimit" :disabled="isFlowDts"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>

                </el-row> -->
            </div>
            <!-- 分档 -->
            <el-tabs v-model="activeName" @tab-click="handleClick" class="param-tab-style">
                <el-tab-pane label="不良品设置" name = "defective_goods">
                        <div class="container defective_goods">
                            <div  class="select_container">
                                <el-select
                                    v-model="defective_Level"
                                    placeholder="Select"
                                    size="large"
                                    style="width: 240px"
                                    >
                                    <el-option
                                        v-for="item in defectiveLevel"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </div>
                            
                            <el-row>
                                <el-col :span=" 12 ">
                                    <el-row class="colHeight" v-for="( t, i ) in  defectiveCols[defective_Level].Param " :key=" i ">
                                        <el-col :span=" 6 " style="line-height: 40px; text-align: center;">
                                            <div class="inline_item label_item"> {{ t.label }} </div>
                                            <span class="inline_item"> &lt </span>
                                        </el-col>

                                        <el-col :span=" 6 " style="text-align:center">
                                            <el-form-item>
                                                <el-input v-model="processContent.recipe[t.value[0].value+'_'+defective_Level] "
                                                    placeholder="" :disabled=" isFlowDts "></el-input>
                                            </el-form-item>
                                        </el-col>


                                        <el-col :span=" 6 " style="line-height: 40px; text-align: center;">
                                            <div class="inline_item label_item"> {{ t.label }} </div>
                                            <span class="inline_item" v-if="t.label == 'CAP(mAh)'"> &gt= </span>
                                            <span class="inline_item" v-else > &gt</span>
                                        </el-col>

                                        <el-col :span=" 6 " style="text-align:center">
                                            <el-form-item>
                                                <el-input v-model=" processContent.recipe[t.value[1].value+'_'+defective_Level] "
                                                    placeholder="" :disabled=" isFlowDts "></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                 
                </el-tab-pane>
                <el-tab-pane label="良品设置" name="accepted_goods">
                        <div class="check_box">
                            <el-row class="colHeight">
                                <el-checkbox v-model="processContent.dcrEnable" value="processContent.dcrEnable"
                                    :disabled="isFlowDts">启用DCR值判定</el-checkbox>
                                <el-checkbox v-model="processContent.sigmaDcrEnable" :disabled="isFlowDts">启用Sigma_DCR筛选</el-checkbox>    
                                <el-checkbox v-model="processContent.sigmaEnable" :disabled="isFlowDts">启用Sigma筛选</el-checkbox>
                                <span class="inline_item"> [ </span>
                                <el-radio v-model="processContent.state" label="0" :disabled="isFlowDts">V品范围</el-radio>
                                <el-radio v-model="processContent.state" label="1" :disabled="isFlowDts">A品范围</el-radio>
                                <span class="inline_item"> ] </span>
                            </el-row>
                        </div>
                        <div class="container accepted_container">
                            <div  class="select_container">
                                <el-select
                                    v-model="accepted_level"
                                    placeholder="Select"
                                    size="large"
                                    style="width: 240px"
                                    >
                                    <el-option
                                        v-for="item in acceptedLevel"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </div>
                            
                            <el-row>
                                <el-col :span="12">
                                    <el-row class="colHeight" v-for="(t, i) in acceptedCols.Param" :key="i">
                                        <el-col :span="6" style="text-align:center">
                                            <el-form-item>
                                                <el-input v-if="t.label == 'DCR(mΩ)'"
                                                    v-model="processContent.recipe[t.value[0].value+'_'+accepted_level]" placeholder="下限"
                                                    :disabled="isFlowDts || !processContent.dcrEnable"></el-input>

                                                <el-input v-else
                                                    v-model="processContent.recipe[t.value[0].value+'_'+accepted_level]" placeholder="下限"
                                                    :disabled="isFlowDts" ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="10" style="text-align: center;height: 32px;">
                                            <span class="inline_item"> &lt= </span>
                                            <div class="inline_item label_item"> {{ t.label }} </div>
                                            <span class="inline_item" v-if="t.label == 'CAP(mAh)'"> &lt </span>
                                            <span class="inline_item" v-else > &lt= </span>
                                        </el-col>
                                        <el-col :span="6" style="text-align:center">
                                            <el-form-item>
                                                <el-input v-if="t.label == 'DCR(mΩ)'"
                                                    v-model="processContent.recipe[t.value[1].value+'_'+accepted_level]" placeholder="上限"
                                                    :disabled="isFlowDts || !processContent.dcrEnable"></el-input>

                                                <el-input v-else
                                                    v-model="processContent.recipe[t.value[1].value+'_'+accepted_level]" placeholder="上限"
                                                    :disabled="isFlowDts"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="1">&nbsp</el-col>
                                <el-col :span="11" v-if="accepted_level == 'A' || accepted_level == 'B' || accepted_level == 'C'">
                                    <el-row class="colHeight">
                                        <el-col :span="7">下限系数</el-col>
                                        <el-col :span="9">&nbsp</el-col>
                                        <el-col :span="7">上限系数</el-col>
                                    </el-row>

                                    <el-row class="colHeight" v-for="(t, i) in acceptedCols.sigmaParam" :key="i">
                                        <el-col :span="6" style="text-align:center">
                                            <el-form-item>
                                                <el-input v-if="t.label == 'Sigma_DCR(mΩ)'"
                                                    v-model="processContent.recipe[t.value[0].value+'_'+accepted_level]" placeholder="下限系数"
                                                    :disabled="isFlowDts || !processContent.sigmaDcrEnable || !processContent.sigmaEnable"></el-input>
                                                <el-input v-else
                                                    v-model="processContent.recipe[t.value[0].value+'_'+accepted_level]" placeholder="下限系数"
                                                    :disabled="isFlowDts || !processContent.sigmaEnable"></el-input>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="10" style="text-align:center;height: 32px;">
                                            <span class="inline_item label_item">{{ t.label }}</span>
                                        </el-col>

                                        <el-col :span="6" style="text-align:center">
                                            <el-form-item>
                                                <el-input v-if="t.label == 'Sigma_DCR(mΩ)'"
                                                    v-model="processContent.recipe[t.value[1].value+'_'+accepted_level]" placeholder="上限系数"
                                                    :disabled="isFlowDts || !processContent.sigmaDcrEnable || !processContent.sigmaEnable"></el-input>

                                                <el-input v-else
                                                    v-model="processContent.recipe[t.value[1].value+'_'+accepted_level]" placeholder="上限系数"
                                                    :disabled="isFlowDts || !processContent.sigmaEnable"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>

                        </div>
                </el-tab-pane>
            </el-tabs>
        </el-form>


        <el-col v-if=" flowShow " :span=" 24 " style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click=" changeRequest ">变更申请</el-button>
            <!-- v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" -->
        </el-col>
        <el-col v-if=" flowTempShow " :span=" 24 " style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click=" nowAdd ">立即添加</el-button>
        </el-col>
    </el-col>
</template>
  
<script>
import httpUtils from '@/api/fms-common'
export default {
    name: 'IROCVModel',
    props: {
        dialogSubmit: Function,
        'isFlowDts': Boolean,
        'ProcessAddSelect': Array,
    },
    data() {
        return {
            ocvSelectArr:[],
            activeName: "defective_goods",
            colHeight: 'colHeight',
            flowShow: true,
            flowTempShow: false,
            bizId: '',
            dataUpdateParam: {},
            labelPosition: 'left',

            processContent: {
                state: '0',
                dcrEnable: false,
                sigmaDcrEnable: false,
                sigmaEnable: false,
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
                    // isKeyCalculate: 0,  // 关闭(0)-开启(1)
                    // ocvChoose: "",
// -----------------------------------------
                    ocvTest: 0,
                    irTest: 0,
                    acceptOcvLower: 0,
                    acceptOcvUpper: 0,
                    acceptAcrLower: 0,
                    acceptAcrUpper: 0,
                    testTrayNgLimit: 0,
                    channelNgLimit: 0,
                },
                recipe: {
                    ocvLower_A: 0,
                    ocvLower_B: 0,
                    ocvLower_C: 0,
                    ocvLower_D: 0,
                    ocvLower_E: 0,
                    ocvLower_F: 0,
                    ocvLower_G: 0,
                    ocvLower_H: 0,
                    ocvLower_I: 0,

                    ocvUpper_A: 0,
                    ocvUpper_B: 0,
                    ocvUpper_C: 0,
                    ocvUpper_D: 0,
                    ocvUpper_E: 0,
                    ocvUpper_F: 0,
                    ocvUpper_G: 0,
                    ocvUpper_H: 0,
                    ocvUpper_I: 0,

                    irLower_A: 0,
                    irLower_B: 0,
                    irLower_C: 0,
                    irLower_D: 0,
                    irLower_E: 0,
                    irLower_F: 0,
                    irLower_G: 0,
                    irLower_H: 0,
                    irLower_I: 0,

                    irUpper_A: 0,
                    irUpper_B: 0,
                    irUpper_C: 0,
                    irUpper_D: 0,
                    irUpper_E: 0,
                    irUpper_F: 0,
                    irUpper_G: 0,
                    irUpper_H: 0,
                    irUpper_I: 0,

                    capLower_A: 0,
                    capLower_B: 0,
                    capLower_C: 0,
                    capLower_D: 0,
                    capLower_E: 0,
                    capLower_F: 0,
                    capLower_G: 0,
                    capLower_H: 0,
                    capLower_I: 0,

                    capUpper_A: 0,
                    capUpper_B: 0,
                    capUpper_C: 0,
                    capUpper_D: 0,
                    capUpper_E: 0,
                    capUpper_F: 0,
                    capUpper_G: 0,
                    capUpper_H: 0,
                    capUpper_I: 0,

                    kLower_A: 0,
                    kLower_B: 0,
                    kLower_C: 0,
                    kLower_D: 0,
                    kLower_E: 0,
                    kLower_F: 0,
                    kLower_G: 0,
                    kLower_H: 0,
                    kLower_I: 0,

                    kUpper_A: 0,
                    kUpper_B: 0,
                    kUpper_C: 0,
                    kUpper_D: 0,
                    kUpper_E: 0,
                    kUpper_F: 0,
                    kUpper_G: 0,
                    kUpper_H: 0,
                    kUpper_I: 0,

                    dcrLower_A: 0,
                    dcrLower_B: 0,
                    dcrLower_C: 0,
                    dcrLower_D: 0,
                    dcrLower_E: 0,
                    dcrLower_F: 0,
                    dcrLower_G: 0,
                    dcrLower_H: 0,
                    dcrLower_I: 0,

                    dcrUpper_A: 0,
                    dcrUpper_B: 0,
                    dcrUpper_C: 0,
                    dcrUpper_D: 0,
                    dcrUpper_E: 0,
                    dcrUpper_F: 0,
                    dcrUpper_G: 0,
                    dcrUpper_H: 0,
                    dcrUpper_I: 0,

                    sigmaOcvLower_A: 0,
                    sigmaOcvLower_B: 0,
                    sigmaOcvLower_C: 0,
                    sigmaOcvLower_D: 0,
                    sigmaOcvLower_E: 0,
                    sigmaOcvLower_F: 0,
                    sigmaOcvLower_G: 0,
                    sigmaOcvLower_H: 0,
                    sigmaOcvLower_I: 0,

                    sigmaOcvUpper_A: 0,
                    sigmaOcvUpper_B: 0,
                    sigmaOcvUpper_C: 0,
                    sigmaOcvUpper_D: 0,
                    sigmaOcvUpper_E: 0,
                    sigmaOcvUpper_F: 0,
                    sigmaOcvUpper_G: 0,
                    sigmaOcvUpper_H: 0,
                    sigmaOcvUpper_I: 0,

                    sigmaIrLower_A: 0,
                    sigmaIrLower_B: 0,
                    sigmaIrLower_C: 0,
                    sigmaIrLower_D: 0,
                    sigmaIrLower_E: 0,
                    sigmaIrLower_F: 0,
                    sigmaIrLower_G: 0,
                    sigmaIrLower_H: 0,
                    sigmaIrLower_I: 0,

                    sigmaIrUpper_A: 0,
                    sigmaIrUpper_B: 0,
                    sigmaIrUpper_C: 0,
                    sigmaIrUpper_D: 0,
                    sigmaIrUpper_E: 0,
                    sigmaIrUpper_F: 0,
                    sigmaIrUpper_G: 0,
                    sigmaIrUpper_H: 0,
                    sigmaIrUpper_I: 0,

                    sigmaKLower_A: 0,
                    sigmaKLower_B: 0,
                    sigmaKLower_C: 0,
                    sigmaKLower_D: 0,
                    sigmaKLower_E: 0,
                    sigmaKLower_F: 0,
                    sigmaKLower_G: 0,
                    sigmaKLower_H: 0,
                    sigmaKLower_I: 0,

                    sigmaKUpper_A: 0,
                    sigmaKUpper_B: 0,
                    sigmaKUpper_C: 0,
                    sigmaKUpper_D: 0,
                    sigmaKUpper_E: 0,
                    sigmaKUpper_F: 0,
                    sigmaKUpper_G: 0,
                    sigmaKUpper_H: 0,
                    sigmaKUpper_I: 0,

                    sigmaDcrLower_A: 0,
                    sigmaDcrLower_B: 0,
                    sigmaDcrLower_C: 0,
                    sigmaDcrLower_D: 0,
                    sigmaDcrLower_E: 0,
                    sigmaDcrLower_F: 0,
                    sigmaDcrLower_G: 0,
                    sigmaDcrLower_H: 0,
                    sigmaDcrLower_I: 0,

                    sigmaDcrUpper_A: 0,
                    sigmaDcrUpper_B: 0,
                    sigmaDcrUpper_C: 0,
                    sigmaDcrUpper_D: 0,
                    sigmaDcrUpper_E: 0,
                    sigmaDcrUpper_F: 0,
                    sigmaDcrUpper_G: 0,
                    sigmaDcrUpper_H: 0,
                    sigmaDcrUpper_I: 0,
                }
            },
            processContentInit: {
                state: '0',
                dcrEnable: false,
                sigmaDcrEnable: false,
                sigmaEnable: false,
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
                    // isKeyCalculate: 0,  // 关闭(0)-开启(1)
                    // ocvChoose: "",
// -----------------------------------------
                    ocvTest: 0,
                    irTest: 0,
                    acceptOcvLower: 0,
                    acceptOcvUpper: 0,
                    acceptAcrLower: 0,
                    acceptAcrUpper: 0,
                    testTrayNgLimit: 0,
                    channelNgLimit: 0,
                },

                recipe: {
                    ocvLower_A: 0,
                    ocvLower_B: 0,
                    ocvLower_C: 0,
                    ocvLower_D: 0,
                    ocvLower_E: 0,
                    ocvLower_F: 0,
                    ocvLower_G: 0,
                    ocvLower_H: 0,
                    ocvLower_I: 0,

                    ocvUpper_A: 0,
                    ocvUpper_B: 0,
                    ocvUpper_C: 0,
                    ocvUpper_D: 0,
                    ocvUpper_E: 0,
                    ocvUpper_F: 0,
                    ocvUpper_G: 0,
                    ocvUpper_H: 0,
                    ocvUpper_I: 0,

                    irLower_A: 0,
                    irLower_B: 0,
                    irLower_C: 0,
                    irLower_D: 0,
                    irLower_E: 0,
                    irLower_F: 0,
                    irLower_G: 0,
                    irLower_H: 0,
                    irLower_I: 0,

                    irUpper_A: 0,
                    irUpper_B: 0,
                    irUpper_C: 0,
                    irUpper_D: 0,
                    irUpper_E: 0,
                    irUpper_F: 0,
                    irUpper_G: 0,
                    irUpper_H: 0,
                    irUpper_I: 0,

                    capLower_A: 0,
                    capLower_B: 0,
                    capLower_C: 0,
                    capLower_D: 0,
                    capLower_E: 0,
                    capLower_F: 0,
                    capLower_G: 0,
                    capLower_H: 0,
                    capLower_I: 0,

                    capUpper_A: 0,
                    capUpper_B: 0,
                    capUpper_C: 0,
                    capUpper_D: 0,
                    capUpper_E: 0,
                    capUpper_F: 0,
                    capUpper_G: 0,
                    capUpper_H: 0,
                    capUpper_I: 0,

                    kLower_A: 0,
                    kLower_B: 0,
                    kLower_C: 0,
                    kLower_D: 0,
                    kLower_E: 0,
                    kLower_F: 0,
                    kLower_G: 0,
                    kLower_H: 0,
                    kLower_I: 0,

                    kUpper_A: 0,
                    kUpper_B: 0,
                    kUpper_C: 0,
                    kUpper_D: 0,
                    kUpper_E: 0,
                    kUpper_F: 0,
                    kUpper_G: 0,
                    kUpper_H: 0,
                    kUpper_I: 0,

                    dcrLower_A: 0,
                    dcrLower_B: 0,
                    dcrLower_C: 0,
                    dcrLower_D: 0,
                    dcrLower_E: 0,
                    dcrLower_F: 0,
                    dcrLower_G: 0,
                    dcrLower_H: 0,
                    dcrLower_I: 0,

                    dcrUpper_A: 0,
                    dcrUpper_B: 0,
                    dcrUpper_C: 0,
                    dcrUpper_D: 0,
                    dcrUpper_E: 0,
                    dcrUpper_F: 0,
                    dcrUpper_G: 0,
                    dcrUpper_H: 0,
                    dcrUpper_I: 0,

                    sigmaOcvLower_A: 0,
                    sigmaOcvLower_B: 0,
                    sigmaOcvLower_C: 0,
                    sigmaOcvLower_D: 0,
                    sigmaOcvLower_E: 0,
                    sigmaOcvLower_F: 0,
                    sigmaOcvLower_G: 0,
                    sigmaOcvLower_H: 0,
                    sigmaOcvLower_I: 0,

                    sigmaOcvUpper_A: 0,
                    sigmaOcvUpper_B: 0,
                    sigmaOcvUpper_C: 0,
                    sigmaOcvUpper_D: 0,
                    sigmaOcvUpper_E: 0,
                    sigmaOcvUpper_F: 0,
                    sigmaOcvUpper_G: 0,
                    sigmaOcvUpper_H: 0,
                    sigmaOcvUpper_I: 0,

                    sigmaIrLower_A: 0,
                    sigmaIrLower_B: 0,
                    sigmaIrLower_C: 0,
                    sigmaIrLower_D: 0,
                    sigmaIrLower_E: 0,
                    sigmaIrLower_F: 0,
                    sigmaIrLower_G: 0,
                    sigmaIrLower_H: 0,
                    sigmaIrLower_I: 0,

                    sigmaIrUpper_A: 0,
                    sigmaIrUpper_B: 0,
                    sigmaIrUpper_C: 0,
                    sigmaIrUpper_D: 0,
                    sigmaIrUpper_E: 0,
                    sigmaIrUpper_F: 0,
                    sigmaIrUpper_G: 0,
                    sigmaIrUpper_H: 0,
                    sigmaIrUpper_I: 0,

                    sigmaKLower_A: 0,
                    sigmaKLower_B: 0,
                    sigmaKLower_C: 0,
                    sigmaKLower_D: 0,
                    sigmaKLower_E: 0,
                    sigmaKLower_F: 0,
                    sigmaKLower_G: 0,
                    sigmaKLower_H: 0,
                    sigmaKLower_I: 0,

                    sigmaKUpper_A: 0,
                    sigmaKUpper_B: 0,
                    sigmaKUpper_C: 0,
                    sigmaKUpper_D: 0,
                    sigmaKUpper_E: 0,
                    sigmaKUpper_F: 0,
                    sigmaKUpper_G: 0,
                    sigmaKUpper_H: 0,
                    sigmaKUpper_I: 0,

                    sigmaDcrLower_A: 0,
                    sigmaDcrLower_B: 0,
                    sigmaDcrLower_C: 0,
                    sigmaDcrLower_D: 0,
                    sigmaDcrLower_E: 0,
                    sigmaDcrLower_F: 0,
                    sigmaDcrLower_G: 0,
                    sigmaDcrLower_H: 0,
                    sigmaDcrLower_I: 0,

                    sigmaDcrUpper_A: 0,
                    sigmaDcrUpper_B: 0,
                    sigmaDcrUpper_C: 0,
                    sigmaDcrUpper_D: 0,
                    sigmaDcrUpper_E: 0,
                    sigmaDcrUpper_F: 0,
                    sigmaDcrUpper_G: 0,
                    sigmaDcrUpper_H: 0,
                    sigmaDcrUpper_I: 0,
                }
            },

            acceptedCols:{
                sigma: true,
                Param: [
                    {
                        label: "IROCV1(mV)",
                        value: [
                            { label: "电压下限(mV)", value: "ocvLower" },
                            { label: "电压上限(mV)", value: "ocvUpper" }
                        ]
                    },
                                {
                                    label: "IR1(mΩ)",
                                    value: [
                                        { label: "内阻下限(mΩ)", value: "irLower" },
                                        { label: "内阻上限(mΩ)", value: "irUpper" },
                                    ]
                                },
                                {
                                    label: "CAP(mAh)",
                                    value: [
                                        { label: "容量下限(mAh)", value: "capLower" },
                                        { label: "容量上限(mAh)", value: "capUpper" }
                                    ]
                                },
                                {
                                    label: "K",
                                    value: [
                                        { label: "K值下限", value: "kLower" },
                                        { label: "K值上限", value: "kUpper" },
                                    ]
                                },
                                {
                                    label: "DCR(mΩ)",
                                    value: [
                                        { label: "DCR下限(mΩ)", value: "dcrLower" },
                                        { label: "DCR上限(mΩ)", value: "dcrUpper" },
                                    ]
                                },
                            ],
                sigmaParam: [
                                {
                                    label: "Sigma_IROCV1(mV)",
                                    step: "1",
                                    value: [
                                        { label: "电压下限(mV)", value: "sigmaOcvLower" },
                                        { label: "电压上限(mV)", value: "sigmaOcvUpper" }
                                    ]
                                },
                                {
                                    label: "Sigma_IR1(mΩ)",
                                    step: "1",
                                    value: [
                                        { label: "内阻下限(mΩ)", value: "sigmaIrLower" },
                                        { label: "内阻上限(mΩ)", value: "sigmaIrUpper" },
                                    ]
                                },
                                {
                                    label: "Sigma_K",
                                    step: "0.01",
                                    value: [
                                        { label: "K值下限", value: "sigmaKLower" },
                                        { label: "K值上限", value: "sigmaKUpper" },
                                    ]
                                },
                                {
                                    label: "Sigma_DCR(mΩ)",
                                    step: "1",
                                    value: [
                                        { label: "DCR下限(mΩ)", value: "sigmaDcrLower" },
                                        { label: "DCR上限(mΩ)", value: "sigmaDcrUpper" },
                                    ]
                                }
                            ],
            },
            defectiveCols:{
                'G':{
                    Param:[
                        {
                            label: "CAP(mAh)",
                            value: [
                                { label: "容量下限(mAh)", value: "capLower" },
                                { label: "容量上限(mAh)", value: "capUpper" }
                            ]
                        }
                    ]
                },
                'H':{
                    Param:[
                        {
                            label: "IR1(mΩ)",
                            value: [
                                { label: "内阻下限(mΩ)", value: "irLower" },
                                { label: "内阻上限(mΩ)", value: "irUpper" },
                            ]
                        },
                    ]
                },
                
                'I':{
                    Param:[
                        {
                            label: "K",
                            value: [
                                { label: "K值下限", value: "kLower" },
                                { label: "K值上限", value: "kUpper" },
                            ]
                        },
                    ]
                },
            },
            processData:{
                state: 0,
                dcrEnable: false,
                sigmaEnable: false,
                sigmaDcrEnable: false,
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
                    // isKeyCalculate: 0,  // 关闭(0)-开启(1)
                    // ocvChoose: "",
// -----------------------------------------
                    ocvTest: 0,
                    irTest: 0,
                    acceptOcvLower: 0,
                    acceptOcvUpper: 0,
                    acceptAcrLower: 0,
                    acceptAcrUpper: 0,
                    testTrayNgLimit: 0,
                    channelNgLimit: 0,
                },
                
                recipe: [
                    {
                        key: 'A',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'B',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'C',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'D',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'E',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'F',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'G',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'H',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    }, {
                        key: 'I',
                        ocvLower: 0,
                        ocvUpper: 0,
                        irLower: 0,
                        irUpper: 0,
                        capLower: 0,
                        capUpper: 0,
                        kLower: 0,
                        kUpper: 0,
                        dcrLower: 0,
                        dcrUpper: 0,
                        sigmaOcvLower: 0,
                        sigmaOcvUpper: 0,
                        sigmaIrLower: 0,
                        sigmaIrUpper: 0,
                        sigmaKLower: 0,
                        sigmaKUpper: 0,
                        sigmaDcrLower: 0,
                        sigmaDcrUpper: 0,
                    },
                ],
            },
            acceptedLevel:[
                {label:'A档  V品',value:'A'},
                {label:'B档  V品',value:'B'},
                {label:'C档  V品',value:'C'},
                {label:'D档  A品',value:'D'},
                {label:'E档  A品',value:'E'},
                {label:'F档  A品',value:'F'},
                
            ],
            defectiveLevel:[
                {label:'G档',value:'G'},
                {label:'H档',value:'H'},
                {label:'I档',value:'I'},
            ],
            accepted_level:'A',
            defective_Level:'G'
        }
    },
    watch: {
        "flowTempShow": {
            handler: function (nVal, oVal) {
                // console.log(nVal,oVal)
            },
            deep: true
        },

    },
    created() {
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
        // tab切换的change事件
        handleClick(val) {
            // console.log(val)
        },
        changeSelect(val) {
            // console.log(val)
        },
        //参数验证
        check() {
            let data = this.processData
            if (parseFloat(data.pp.acceptOcvUpper) < parseFloat(data.pp.acceptOcvLower)) {
                return '合格电芯电压上限[' + data.pp.acceptOcvUpper + ']小于下限[' + data.pp.acceptOcvLower + ']'
            } else if (parseFloat(data.acceptAcrUpper) < parseFloat(data.acceptAcrLower)) {
                return '合格电芯ACR上限[' + data.pp.acceptAcrUpper + ']小于下限[' + data.pp.acceptAcrLower + ']'
            } 

            // 上限应比下限大
            for (let index in data.recipe) {
                let content = data.recipe[index]
                let key = content.key
                if (parseFloat(content.ocvUpper) < parseFloat(content.ocvLower)) {
                    return key + '的电压上限[' + content.ocvUpper + ']小于下限[' + content.ocvLower + ']'
                } else if (parseFloat(content.irUpper) < parseFloat(content.irLower)) {
                    return key + '的内阻上限[' + content.irUpper + ']小于下限[' + content.irLower + ']'
                } else if (parseFloat(content.capUpper) < parseFloat(content.capLower)) {
                    return key + '的容量上限[' + content.capUpper + ']小于下限[' + content.capLower + ']'
                } else if (parseFloat(content.kUpper) < parseFloat(content.kLower)) {
                    return key + '的k值上限[' + content.kUpper + ']小于下限[' + content.kLower + ']'
                } else if (parseFloat(content.dcrUpper) < parseFloat(content.dcrLower)) {
                    return key + '的DCR上限[' + content.dcrUpper + ']小于下限[' + content.dcrLower + ']'
                } 
                //channelNgLimit
                // else if (parseFloat(content.sigmaOcvUpper) < parseFloat(content.sigmaOcvLower)) {
                //     return key + '的sigma_OCV上限系数[' + content.sigmaOcvUpper + ']小于下限系数[' + content.sigmaOcvLower + ']'
                // } else if (parseFloat(content.sigmaIrUpper) < parseFloat(content.sigmaIrLower)) {
                //     return key + '的sigma_IR上限系数[' + content.sigmaIrUpper + ']小于下限系数[' + content.sigmaIrLower + ']'
                // } else if (parseFloat(content.sigmaKUpper) < parseFloat(content.sigmaKLower)) {
                //     return key + '的sigma_k上限系数[' + content.sigmaKUpper + ']小于下限系数[' + content.sigmaKLower + ']'
                // } else if (parseFloat(content.sigmaDcrUpper) < parseFloat(content.sigmaDcrLower)) {
                //     return key + '的sigma_Dcr上限系数[' + content.sigmaDcrUpper + ']小于下限系数[' + content.sigmaDcrLower + ']'
                // }

                else if (parseFloat(content.ocvUpper) < 0) {
                    return key + '的电压上限[' + content.ocvUpper + ']小于0'
                } else if (parseFloat(content.ocvLower) < 0) {
                    return key + '的电压下限[' + content.ocvLower + ']小于0'
                } else if (parseFloat(content.irUpper) < 0) {
                    return key + '的内阻上限[' + content.irUpper + ']小于0'
                } else if (parseFloat(content.irLower) < 0) {
                    return key + '的内阻下限[' + content.irLower + ']小于0'
                } else if (parseFloat(content.capUpper) < 0) {
                    return key + '的容量上限[' + content.capUpper + ']小于0'
                } else if (parseFloat(content.capLower) < 0) {
                    return key + '的容量下限[' + content.capLower + ']小于0'
                } else if (parseFloat(content.dcrUpper) < 0) {
                    return key + '的DCR上限[' + content.dcrUpper + ']小于0'
                } else if (parseFloat(content.dcrLower) < 0) {
                    return key + '的DCR下限[' + content.dcrLower + ']小于0'
                }

            }

            for(var k in this.processContent.pp) {
                if (k !== 'ocvChoose' && !this.processContent.pp[k]) {
                    this.processContent.pp[k] = 0;
                }
            }
        },
        // 立即添加
        nowAdd() {
            let content = this.processContent
            for (let index in content) {
                if (index == 'recipe') {
                    for (let key in content.recipe) {
                        let match = key.split("_")
                        if (match) {
                            let num = match[1].charCodeAt(0) - 65
                            this.processData.recipe[num][match[0]] = parseFloat(content.recipe[key])
                        }
                    }
                } else if (index == 'pp'){ 
                    for (let k in content.pp){
                        if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
                        || k == 'trayKLow' || k == 'trayKUp') {
                            this.processData['pp'][k] = parseFloat(content['pp'][k])
                        } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'isKeyCalculate' || k == 'isKeyTrayCalculate'|| k == 'sigma' ){
                            this.processData['pp'][k] = parseInt(content['pp'][k])
                        } else {
                            this.processData['pp'][k] = content['pp'][k]
                        }

                        if (k == 'irTest' || k == 'ocvTest') {
                            this.processData['pp'][k] = content['pp'][k] ? 1 : 0
                        } else if (k == 'acceptOcvLower' || k == 'acceptOcvUpper'|| k == 'acceptAcrLower'|| k == 'acceptAcrUpper') {
                            this.processData['pp'][k] = parseFloat(content['pp'][k])
                        } else if (k == 'testTrayNgLimit'|| k == 'channelNgLimit') {
                            this.processData['pp'][k] = parseInt(content['pp'][k])
                        }
                    }
                    
                }
                else {
                    this.processData[index] = content[index]
                }
            }  

            //参数上下限check
            let checkBody = this.check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }

            for(let k in this.processContent.pp) {
                if (k == 'ocvTest' || k == 'irTest' || k == 'acceptOcvLower' || k == 'acceptOcvUpper' 
                || k == 'acceptAcrLower' || k == 'acceptAcrUpper'|| k=='testTrayNgLimit' || k=='channelNgLimit') {
                    this.processContent.pp[k] =  this.processContent.pp[k] ? 
                    parseInt(this.processContent.pp[k]) : this.processContent.pp[k]
                    } 
            }
            // console.log(this.processData)
            let json = {
                data: {
                    flowDtId: this.dataUpdateParam.flowDtId,
                    id: this.dataUpdateParam.id,
                    processContent: JSON.stringify(this.processData),
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

        dataUpdate(row, url, state) {
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
            let json = { data: row.id }
            this.dataUpdateParam.processId = row.processId
            this.dataUpdateParam.flowDtId = row.id
            setTimeout(() => {
                httpUtils.actionFmsPost(url, json).then(data => {
                    if (data != null) {
                        this.dataUpdateParam = data
                        let getJson = JSON.parse(data.processContent);
                        let content = JSON.parse(JSON.stringify(this.processContent))
                        getJson.pp.irTest = getJson.pp.irTest && getJson.pp.irTest ? true : false;
                        getJson.pp.ocvTest = getJson.pp.ocvTest && getJson.pp.ocvTest ? true : false;
                        for (let index in content) {
                            if (index == 'recipe') {
                                for (let key in content.recipe) {
                                    let match = key.split("_")

                                    if (match) {
                                        let num = match[1].charCodeAt(0) - 65
                                        if (getJson.recipe[num][match[0]] == undefined) {
                                            content.recipe[key] = '';
                                        } else {
                                            content.recipe[key] = getJson.recipe[num][match[0]]
                                        }
                                    }
                                }
                            } else {
                                content[index] = getJson[index]
                            }
                        }

                        try {
                            this.processContent = content

                        } catch (e) {
                            this.processContent = JSON.parse(JSON.string0ify(this.processContentInit))
                        }
                    } else {
                        this.dataUpdateParam.id = null;
                        this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
                    }

                })
            }, 1000)
        },
        // 变更申请
        changeRequest() {
            const json = { data: { bizId: this.bizId, changeType: 1 } }
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
    }
}
</script>
  
<style lang="less" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa !important;
      color: #888;
    }
.container {
    padding: 10px;
}

.front_container {
    border: 1px solid rgb(201, 201, 201);
}

.accepted_container {
}
.defective_goods {}

.title {
    background-color: rgb(244, 243, 184);
    height: 20px;
    margin-bottom: 10px;
}

::v-deep .el-input__inner {
    width: 100%;
   // height: 40px;
}

::v-deep .param-tab-style {
    .el-tabs__content {
        height: 40vh !important;
        overflow: scroll !important;
        padding: 5px;
        background-color: #d1ecd63d;
    }
}

::v-deep .el-radio__original {
    display: none !important;
    /* 隐藏原生 radio 输入，但仍然允许交互 */
}

::v-deep .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
}
::v-deep .el-form-item{
    margin-bottom: 10px !important;
}
.colHeight {
    min-height: 30px;
}

.inline_item {
    display: inline-block;
    margin-right: 10px;
}

.label_item {
    // border: 1px solid rgb(192, 191, 190);
    line-height: 40px;
   // height: 40px;
    font-weight: bold;
}

.row_container {
    height: 100%;
}

.select_container{
    margin-bottom: 10px;
}
</style>