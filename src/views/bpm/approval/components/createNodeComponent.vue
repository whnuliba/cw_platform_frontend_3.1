<template>
  <div class="app-container">

    
  <!--制作流程图-->


    <div>
      <div style="width:100%;text-align:center;font-size:30px;font-weight:bold;margin-bottom:10px">
        <span>{{`${modeDocName}[${modeDocNo}]`}}</span>
      </div>
      <div style="margin-bottom:10px">
        <el-button  class="filter-item" @click="reback()" icon="el-icon-refresh-left" plain>
        {{ $t("common.btn.reback") }}
      </el-button>
        <el-button class="filter-item"  @click="query()" icon="el-icon-search" plain>
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button class="filter-item" @click="saveCreateNode" icon="el-icon-circle-check" plain>
        {{ $t("common.btn.save") }}
      </el-button>
      <!-- <el-button type="info" class="filter-item" @click="addRowItem">
        {{ $t("common.btn.add") }}
       </el-button> -->

      </div>

      <div  style="position: relative;">
         <div style="width: calc(100% - 300px); display: flex; justify-content: space-between; float: left;">
           <div id="myPaletteDiv" style="width: 105px; margin-right: 2px; background-color: whitesmoke; border: 1px solid black; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;"><canvas tabindex="0" width="103" height="618" style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 103px; height: 618px; cursor: auto;"></canvas><div style="position: absolute; overflow: auto; width: 103px; height: 618px; z-index: 1;"><div style="position: absolute; width: 1px; height: 1px;"></div></div></div>
           <div id="myDiagramDiv" style="flex-grow: 1; height: calc(100vh - 200px); border: 1px solid black; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;"><canvas tabindex="0" width="1011" height="618" style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 1011px; height: 618px; cursor: auto;"></canvas><div style="position: absolute; overflow: auto; width: 1011px; height: 618px; z-index: 1;"><div style="position: absolute; width: 1px; height: 1px;"></div></div></div>
        </div>
        <div style="width: 300px; float: left; height:618px ; display: flex; justify-content: space-between;overflow-y:auto" id="nodePropForm">
         <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px" size="mini">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item v-if="item.edit && item.editType==='input'" :label="commonI18n(item)" :prop="item.field"
                          :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]">
              <el-input 
              v-model="defaultForm.params[item.field]" 
              :disabled="item.disabled || editDisabled[item.field]" 
              placeholder="" 
              @focus="()=>{if(item.onClick) item.onClick.call(self,defaultForm.params) }"
              style="width: 170px" />
            </el-form-item>
            <el-form-item v-if="item.edit && item.editType==='button'" :label="commonI18n(item)" :prop="item.field">
              <el-button 
              :disabled="item.disabled || editDisabled[item.field]" 
              type="success" plain @click="()=>{if(item.onClick) item.onClick.call(self,defaultForm.params) }">{{'开始编写'}}</el-button>
            </el-form-item>


            <el-form-item v-if="item.edit && item.editType==='date'" :label="commonI18n(item)" :prop="item.field">
                    <el-date-picker
                       style="width: 170px"
                       :disabled="item.disabled || editDisabled[item.field]"

                        v-model="defaultForm.params[item.field]"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.edit && item.editType==='select'" :label="item.title">
              <el-select v-model="defaultForm.params[item.field]" 
              :disabled="item.disabled || editDisabled[item.field]"
              @change="(v)=>{if(item.onChange) item.onChange(v,item,defaultForm.params)}"
              placeholder="请选择"  style="width: 170px">
                <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                 >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  v-if="item.edit && item.editType==='filter'" :label="commonI18n(item)" :prop="item.field">
              <CwFilterSelectDropdown
                   style="width: 170px"
                    v-model="defaultForm.params[item.field]"
                    :disabled="item.disabled || editDisabled[item.field]"
                    :initValue="initValue"
                    :url="''"  
                    :lazy="true"
                    :radio="()=>{ return true }"
                    :loadData="loadData"
                    @onChange="onChange"
                ></CwFilterSelectDropdown>
            </el-form-item>
          </div>
          <div class="node-condition" v-if="wfConditionDisplay && defaultForm.params['nodeType']=='COND'" style="align-content:center;text-align:center;width:95%;padding-left:5px;">
            <el-row :gutter="10">  
              <el-col :span="8"><div class="grid-content bg-purple" >
                节点
              </div></el-col>
              <el-col :span="12"><div class="grid-content bg-purple" >
                条件参数
              </div></el-col>
              <el-col :span="4"><div class="grid-content bg-purple" >
                <i class="el-icon-circle-plus-outline" style="margin-top:5px" @click="addDondition(defaultForm.params.conditions)"></i>
              </div></el-col>
            </el-row>
            <el-row v-for="(item) in defaultForm.params.conditions" :gutter="10">
              <el-col :span="8"><div class="grid-content bg-purple">
                <el-input 
                    
                    size="mini"
                    v-model="item.nextNodeNo" 
                    placeholder="" 
                    style="width: 80px;padding:0"/>
              </div></el-col>
              <el-col :span="12"><div class="grid-content bg-purple" >
                <el-input 
                    v-model="item.nodeOutput" 
                    placeholder="" 
                    size="mini"
                    style="width: 100%;padding:0" />
              </div></el-col>
              <el-col :span="4"><div class="grid-content bg-purple" >
                <i class="el-icon-remove-outline" style="margin-top:5px" @click="removeDondition(defaultForm.params.conditions,item)"></i>
              </div></el-col>
            </el-row>
          </div>
        </el-form>
        </div>

     </div>
    </div>
     <div class="filter-container" >
      <div v-for="(item, index) in cols" :key="index" style="display: inline">
        <el-input
          v-if="item.query && item.queryType === 'input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select
          v-if="item.query && item.queryType === 'select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
          
        >
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType === 'datetime'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="datetime"
          :placeholder="item.title"
          style="width: 150"
          class="filter-item"
        >
        </el-date-picker>
        <el-date-picker
          v-if="item.query && item.queryType === 'date'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="date"
          :placeholder="item.title"
          style="width: 150"
          class="filter-item"
        >
        </el-date-picker>
      </div>
    </div>


    <el-table
      v-loading="listLoading"
      :data="list"
      border
      v-if="false"
      fit
      highlight-current-row
      style="width: 100%"
      @row-dblclick="showDetails"
    >
      <el-table-column width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="item in cols"
        :key="item.id"
        :label="item.title"
        :prop="item.field"
        :width="item.width"
        :min-width="item.minWidth"
        v-if="!item.hide"
        :align="item.align"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <div v-if="row.rowState==2 || row.rowState==3">
            <el-input
                  style="width: 170px"
                  v-if="item.edit && item.editType === 'input' && item.field == 'approveUsername'"
                   v-model="row[item.field]"
                   :disabled="row.userDisabled"
                   @focus="()=>{if(item.onClick) item.onClick(row) }"
                />
          <el-input
                  style="width: 170px"
                  v-else-if="item.edit && item.editType === 'input' && item.field === 'jobName'"
                   v-model="row[item.field]"
                   :disabled="row.jobDisabled"
                   @focus="()=>{if(item.onClick) item.onClick(row) }"
                />

            <el-input
                  style="width: 170px"
                  v-else-if="item.edit && item.editType === 'input'&& item.field === 'groupName'"
                   v-model="row[item.field]"
                   :disabled="row.groupDisabled"
                   @focus="()=>{if(item.onClick) item.onClick(row) }"
                />
              <el-input
                  style="width: 170px"
                  v-else-if="item.edit && item.editType === 'input'"
                   v-model="row[item.field]"
                   @focus="()=>{if(item.onClick) item.onClick(row) }"
                />

            <el-select
              v-else-if="item.edit && item.editType === 'select'"
              v-model="row[item.field]"
              @change="(v)=>{if(item.onChange) item.onChange(v,item,row)}"
            >
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-else>
                <span>{{ commonFilter(row[item.field], item.field) }}</span>
            </span>
          </div>
          <div v-else>
            <span >
                <span>{{ commonFilter(row[item.field], item.field) }}</span>
            </span>
          </div>

          
          <!-- {{
          commonFilter(row[item.field], item.field)
          }}
         -->
      </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200" v-if="false">
        <template slot-scope="scope">
          <!-- <el-button
           v-if="scope.row.rowState==2 || scope.row.rowState==3"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="toOk(scope.row)"
          >
            确定
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="scope.row.rowState=2"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="toRemove(scope.row)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    /> -->
    <el-dialog
      title="编辑"
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="defaultForm.params"
        :inline="true"
        :model="defaultForm.params"
        label-width="80px"
      >
        <div v-for="item in cols" :key="item.id" style="display: inline">
          <el-form-item
            v-if="item.set && item.queryType === 'input'"
            :label="item.title"
            :prop="item.field"
          
            :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input
              v-model="defaultForm.params[item.field]"
              style="width: 220px"
              :disabled="allowDisable && item.editReadonly"
            />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'select'"
            :label="item.title"
            :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'change',
              },
            ]"
          >
            <el-select
              v-model="defaultForm.params[item.field]"
              @change="$forceUpdate()"
              :disabled="allowDisable && item.editReadonly"
              placeholder="请选择"
              style="width: 220px"
            >
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">
          {{ $t("common.btn.cancel") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id === '' || defaultForm.params.id === null"
          @click="save('defaultForm.params')"
        >
          {{ $t("common.btn.save") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id != '' && defaultForm.params.id != null"
          @click="submit('defaultForm.params')"
        >
          {{ $t("common.btn.submit") }}</el-button
        >
      </div>
    </el-dialog>

     <!-- 用户页面 -->
     <el-dialog
      v-el-drag-dialog
      :title="funcName"
      :visible.sync="isTreeDialogShow"
    >
      <div :style="{ height: '400px', overflowY: 'scroll' }">
        <el-tree
          :data="funcMngData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="defaultShowNodes"
          :default-checked-keys="defaultShowKeys"
          :check-strictly="true"
          :check-on-click-node="true"
          @check="checkFunc"
          @check-change="checkChange"
          :load="loadNode"
          lazy
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isTreeDialogShow = false">{{
          $t("button.cancel")
        }}</el-button>
        <el-button type="primary" @click="funcManage()">{{
          $t("button.confirm")
        }}</el-button>
      </div>
    </el-dialog>


         <!-- 部门页面 -->
    <el-dialog
      v-el-drag-dialog
      :title="'选择部门'"
      :visible.sync="isDeptTreeDialogShow"
    >
      <div :style="{ height: '400px', overflowY: 'scroll' }">
        <el-tree
         ref="deptTree"
        :data="treeDeptData"
        :props="defaultProps"
         node-key="id"
         show-checkbox
         :check-strictly="true"
        :highlight-current='true'
        :check-on-click-node="true"
        :default-expanded-keys="deptDefaultShowNodes"
        @node-click="deptTreeNodeClick"
        @check="checkDeptChange"
        
      />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeptTreeDialogShow = false">{{
          $t("button.cancel")
        }}</el-button>
        <el-button type="primary" @click="deptManage()">{{
          $t("button.confirm")
        }}</el-button>
      </div>
    </el-dialog>


    <el-dialog
      :title="'用户组选择'"
      v-el-drag-dialog
      :visible.sync="usergroupDialogShow"
    >
      <el-radio-group v-model="checkedUserGrpData" >
        <div v-for="item in groupData" :key="item.id">
          <el-radio :label="item.id" @input.native = "(val)=>{groupUserInput(val,item)}">{{ item.groupName }}</el-radio>
        </div>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="usergroupDialogShow = false">{{
          $t("common.btn.cancel")
        }}</el-button>
        <el-button type="primary" @click="SubmitUGrp">{{
          $t("common.btn.ok")
        }}</el-button>
      </div>
    </el-dialog>

    <el-drawer
        :title="'业务函数编写'"
        :visible.sync="scriptsVisible"
        :direction="'ltr'"
        :size="'80%'"
        :withHeader="false"
        :before-close="handleClose"
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
            <div style="margin-left:42%">
             <el-button @click="scriptCancelClick">  {{ $t("common.btn.cancel") }}</el-button>
             <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
            </div>
      </el-drawer>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import CwFilterSelectDropdown from "@/components/Cw/CwFilterSelectDropdown";
import EditScript from '@/components/EditScript'

import i18n from "@/lang";
export default {
  name: "ConstantCode",
  components: { Pagination ,CwFilterSelectDropdown,EditScript},
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未启用",
        1: "启用",
      };
      return statusMap[status];
    },
  },
  data() {
    //    //行状态 1 预览  2编辑 3增加 4删除
    const _initdata = {

      //查找岗位信息
      jobId:'',
      initValue: [],
      dtsOfswitch:EditScript,
      scriptsVisible:false,
      scriptsEditer:'',
      scriptOps:{
          scriptValue:'',
          scriptId:''
      },
      scriptCurrentNode:undefined,
      self:this,
      dialogFormVisible: false,
      allowDisable: false,
      queryParams: {
        requestData: {wtState:'WAIT'},
      },

      graphProperties:{
         approbveRole:'',
         

      },
      //部门部分
      isDeptTreeDialogShow:false,
      deptDefaultShowNodes: [],
      treeDeptData: [],

      deptCurrNode:{},
      deptCurrRow:{},

      nodeType:'NORMAL', //正常  

      editDisabled:{
          groupName:false,
          approveUsername:false,
          approveRole:true,
          jobName:true

      },

      usergroupDialogShow:false,
      wfConditionDisplay:true,
      checkedUserGrpData:[],
      groupData:[],
      userGroupRow:{},
      userGroupNode:{},
      modeId:'',

      myDiagram:'',

      modeDocNo:'',
      modeDocName:'',
      initSelect: {
        trayType: [],
        nodeType:[],
        approveRole: [
          { label: "请选择", value: "" },
          { label: "用户", value: "USER" },
          { label: "部门", value: "DEPT" },
          { label: "岗位", value: "JOB" },
          { label: "用户组", value: "UGROUP" },
        ],
        start: [
          { label: "是", value: "Y" },
          { label: "否", value: "N" },
        ],
        approveOpinion: [
          { label: "同意", value: "AGREE" },
          { label: "驳回", value: "REJECT" },
        ],
      },
      defaultForm: {
        row: {},
        params: {
          id: "",
          conditions:[{nodeNo:'',nodeNextNo:'',nodeOutput:''}]
        },
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      nodeLinks:[],
      currSelectNode:undefined,
      currSelectLink:undefined,
      funcName: "",
      funcMngData: [], // 功能管理变量
      funcResData: [], // 功能管理按钮点击回调的数据
      defaultShowNodes: [],
      defaultShowKeys: [],
      isTreeDialogShow: false,
      isCheckSelect:false,
      userCurrNode:{},
      userCurrNodes:[],
      userCurrRow:{},
      routeObj:{},
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 1000,
      },
      nodeMaxNumber:0,
      cols: [
        { field: "nodeNo", title: "节点编码", align: "center",width:200,editType:'input',edit:true,disabled:false },
        { field: "nodeName", title: "节点标识",hide:true, align: "center" ,width:200,editType:'input',edit:true},
        { field: "nextNodeNo", title: "后节点",hide:false, align: "center" ,width:200,editType:'test',edit:true},
        { field: "approveRole", title: "审批角色", align: "center",width:200,editType:"select" ,edit:true,onChange:(val,item,row)=>{this.onSelectChang(val,item,row)}},
        { field: "nodeType", title: "节点类型", align: "center",width:200 ,disabled:true,editType:'select',edit:true,onChange:(val,item,row)=>{this.onNodeTypeChang(val,item,row)}},
        { field: "nodeState", title: "节点状态",hide:true, align: "center",width:200 ,editType:'select',edit:false},
        { field: "groupCode", title: "组织编码",hide:true, align: "center",width:200 ,editType:'input',edit:false},
        { field: "groupName", title: "组织名称",hide:false, align: "center",width:200 ,editType:'input',edit:true,onClick:(row)=>{this.getDeptTreeData(row)}},
        { field: "jobNo", title: "岗位编码",hide:true, align: "center",width:200,editType:'input' ,edit:false},
        { field: "approveUser", title: "审批人1",hide:true, align: "center",width:200 ,editType:'text',edit:true},
        { field: "approveUsername", title: "审批人", align: "center",width:200,editType:'input',edit:true,onClick:(row)=>{
          this.funcMngClick(row)
        }},
        { field: "nodeExpress", title: "条件参数",hide:false, align: "center",width:200 ,editType:'input',edit:false},
        { field: "start", title: "起始节点",hide:false, align: "center" ,width:200,editType:'text',edit:true},
        { field: "jobName", title: "岗位名称",hide:true, align: "center",width:200,editType:'filter' ,edit:true},
        { field: "nodeParams", title: "业务函数",hide:true, align: "center",width:200,editType:'button' ,edit:true,onClick:function(params){
              this.scriptCurrentNode = params
              //增加默认函数
              this.scriptsEditer = params.nodeParams||
 `{
  nodeIn:function(data){},
  nodeOut:function(data){},
  nodeFilter:function(flowInfo,nodeItems){}  
}`
              this.scriptsVisible=true
              this.$nextTick(function(){
                this.$refs.scriptsEditer.initScript(this.scriptsEditer)
   
              })

        }},
        { field: "userDisabled", title: "",hide:true, align: "center",width:200,editType:'text'},
        { field: "groupDisabled", title: "",hide:true, align: "center",width:200,editType:'text'},
        { field: "jobDisabled", title: "",hide:true, align: "center",width:200,editType:'text' },
        { field: "rowState", title: "",hide:true, align: "center",width:200,editType:'text' },
      ],
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols));
    return _initdata;
  },
  created() {
    const fullpath =this.$route.fullPath
          let cp = fullpath
          if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
          let apArr = cp.split("/");
          if (!apArr.length || apArr.length<2) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          } 
         this.routeObj = {
            id: apArr[apArr.length - 1],
         };

    this.selectOptions()
    // const _params =this.$route.params
    this.modeId = this.routeObj.id
    //window.addEventListener('DOMContentLoaded', this.init);

  },
  mounted(){
    //window.addEventListener('DOMContentLoaded', this.init);
    this.init()
    this.initDocumentModel()
    //监听表单
    // 获取div元素
const divElement = document.getElementById('nodePropForm');
 // 监听div下的所有input元素
 divElement.addEventListener('input', function(event) {
   if (event.target.tagName === 'INPUT') {
      
   }
 });
  },
  methods: {
    saveScript(){
      try {
        //this.scriptCurrentNode
        if(this.scriptsEditer!==null && this.scriptsEditer!==undefined && this.scriptsEditer!=='')
            eval("("+this.scriptsEditer+")") //JSON.parse(val.scripts)
        this.scriptCurrentNode.nodeParams =  this.scriptsEditer
        this.saveCreateNode()
        this.scriptsVisible=false

        } catch (e) {
             this.$message({ 
                    type: 'info', 
                    message: '脚本失败'+JSON.stringify(e)
           });
           return
      }
    },
    scriptCancelClick(){
      this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            this.scriptsVisible = false
            done();
          })
          .catch(_ => {});
    },
    setScript(data){
        this.scriptOps.scriptValue=data
        this.scriptsEditer = this.scriptOps.scriptValue    
    },
    handleClose(){
      this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
   loadData(val,callback){
    let _data = { url: '/job/guest/filter-job', params: {data:val}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data)
          .then(data => {
             if(data && data.length){
             let arrJob = data.map(item=>{
                return {code:item.jobNo,id:item.id,name:item.jobName}
              })
              if(callback && typeof callback==='function')
                 callback(arrJob)
             }     
          }).catch(err => {
          console.error(err)
        })

   },
   onChange(result){
       this.$set(this.defaultForm.params,"jobId",result.id)
       this.$set(this.defaultForm.params,"jobNo",result.code)
       this.$set(this.defaultForm.params,"jobName",result.name)
   },
   nodeTypeDisabled(node){
       if(!node)
          return ;
        if(node.data.nodeType==='COND'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='NORMAL' && node.data.start=='Y'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='NORMAL'){
          this.editDisabled.approveUsername=false
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true
        }

        if(node.data.nodeType==='LEADER'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='POINT_USER'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=true
        }
         //
         
         if(node.data.nodeType==='POINT_JOB'){
          this.defaultForm.params.approveRole='JOB'
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=false
         }
        if(node.data.nodeType==='DEPT_LEADER'){
          this.defaultForm.params.approveRole='DEPT'
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=true

        }

        

        if(node.data.nodeType==='K_POINT_JOB'){
          this.defaultForm.params.approveRole='JOB'
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=false

        }

        if(node.data.nodeType==='DYNAMIC'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='NORMAL' && node.data.props.approveRole=='USER'){
          this.editDisabled.approveUsername=false
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='NORMAL' && node.data.props.approveRole=='DEPT'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }

        if(node.data.nodeType==='NORMAL' && node.data.props.approveRole=='UGROUP'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }

        if(node.data.nodeType==='GROUP'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true
        }

        if(node.data.nodeType==='GROUP' && node.data.props.approveRole=='USER'){
          this.editDisabled.approveUsername=false
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='GROUP' && node.data.props.approveRole=='DEPT'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true

        }
        if(node.data.nodeType==='GROUP' && node.data.props.approveRole=='UGROUP'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=true


        }
        if(node.data.nodeType==='GROUP' && node.data.props.approveRole=='JOB'){
           
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=false
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=false
          this.editDisabled.jobName=false


        }
        if(node.data.nodeType==='NORMAL' && node.data.props.approveRole=='JOB'){
          this.editDisabled.approveUsername=true
          this.editDisabled.groupName=true
          this.editDisabled.nodeExpress=true
          this.editDisabled.approveRole=true
          this.editDisabled.jobName=false
        }

   },
   bingPropertieValue(value){

   },


   addDondition(data){
       if(data){
         data.push({nodeNo:'',nodeNextNo:'',nodeOutput:''})
       }
   },
   removeDondition(data,row){
       if(data){
         let idx=data.indexOf(row)
         data.splice(idx,1)
       }
   },

   rendermyDiagram(data){
        
      if(data && data.graphScript){
        this.myDiagram.model = go.Model.fromJson(data.graphScript); 
      }
      this.getList();
   },

   getMyDiagramNodes(){
    if(this.myDiagram && this.myDiagram.nodes){
      let lst = []
      this.myDiagram.nodes.map(c=>{
         if(c.data && c.data.props)
         lst.push(c.data.props)
      })
       this.list=lst||this.list
    }
   },
   redenerNodeList(list){
       if(!list || list==null || list.length==0)
          return
       if(this.myDiagram && this.myDiagram.nodes)
         this.myDiagram.nodes.map(c=>{
          const node = list.filter(row=>row.nodeNo==c.data.props.nodeNo)
          if(node && node.length>0)
          {
            if(!node[0].conditions && node[0].nodeType=='COND'){
               node[0].conditions = [{nodeNo:'',nodeNextNo:'',nodeOutput:''}]
            }
            this.myDiagram.model.setDataProperty(c.data,'props',node[0])
            if(node[0].approveRole=='USER' && node[0].approveUsername){
              if(node[0].nodeType==='GROUP'){
                let txt = c.data.text
                if(txt.indexOf(node[0].nodeNo)==-1){
                 this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${txt}`)
                 this.myDiagram.model.setDataProperty(c.data,'nodeTypeText',`[${node[0].nodeNo}]123${txt}`)

              }
              }else{
                this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${node[0].approveUsername}`)
              }
            }else if((node[0].approveRole=='DEPT' || node[0].approveRole=='UGROUP') && node[0].groupName){
              this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${node[0].groupName}`)
            }else if(node[0].approveRole=='JOB'  && node[0].jobName){
              this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${node[0].jobName}`)
            }else{
              let txt = c.data.text
              if(txt.indexOf(node[0].nodeNo)==-1){
                 this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${txt}`)
              }
            }          
          }
       })
   },

 selectWfNode(node){
  this.currSelectNode = node
      //this.$set(this.defaultForm.params,'nodeType',node.data.nodeType)
      let props = node.data.props
      if(!props){
        if(node.data.nodeType=='COND')
          {
            props = {...this.initfromData(this.cols),nodeType:node.data.nodeType,start:node.data.start,conditions:[{nodeNo:'',nodeNextNo:'',nodeOutput:''}]}          
          }else{
            props = {...this.initfromData(this.cols),nodeType:node.data.nodeType,start:node.data.start}          
           }
          }
      if(node.data.nodeType!=='COND'){
        // node.setProperties('fromMaxLinks',1)
        // node.fromMaxLinks=1       
      }  
      this.defaultForm.params=props
      this.myDiagram.model.setDataProperty(node.data,'props',props)
      //计算线条
      this.myDiagram.links.map(link=>{
          let toNode = link.toNode
          let fromNode = link.fromNode
          let toDataProps = toNode.data.props
          let fromDataProps = fromNode.data.props
          if(toDataProps && fromDataProps)
          fromDataProps.nextNodeNo = toDataProps.nodeNo
      })
      let lst  = []
      this.myDiagram.nodes.map(nd=>{
        if(nd.data.props)
          lst.push(nd.data.props)
      })
      this.list = lst
      this.nodeTypeDisabled(node)

 },  

  initMaxNodeNo(node){
    this.nodeMaxNumber = 0
    let nodeNo = node.nodeNo
    this.myDiagram.nodes.map(item=>{
       let _item = item.data
       if(node===_item)
          return
      if(nodeNo!=_item.nodeNo){
          return
      }

      if (item.data.props.nodeNo.indexOf(nodeNo) > -1) {
            let c = item.data.props.nodeNo.match(/\d+/g);
            if (c) {
              let num = parseInt(c[0]);
              this.nodeMaxNumber =  this.nodeMaxNumber <= num ? num :  this.nodeMaxNumber;
            } 
        }
    })
   node.props.nodeNo = `${nodeNo}${ this.nodeMaxNumber+1}`
   node.props.nodeName = `${nodeNo}${ this.nodeMaxNumber+1}`

    return  this.nodeMaxNumber
} ,
 init() {

// Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
// For details, see https://gojs.net/latest/intro/buildingObjects.html
const $ = go.GraphObject.make;  // for conciseness in defining templates

let myDiagram = this.myDiagram =
  new go.Diagram("myDiagramDiv",  // must name or refer to the DIV HTML element
    {
      grid: $(go.Panel, "Grid",
        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
      ),
      "draggingTool.dragsLink": true,
      "draggingTool.isGridSnapEnabled": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      "relinkingTool.fromHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
      "relinkingTool.toHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
      "linkReshapingTool.handleArchetype":
        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      "rotatingTool.handleAngle": 270,
      "rotatingTool.handleDistance": 30,
      "rotatingTool.snapAngleMultiple": 15,
      "rotatingTool.snapAngleEpsilon": 15,
      "undoManager.isEnabled": true
    });

// when the document is modified, add a "*" to the title and enable the "Save" button
myDiagram.addDiagramListener("Modified", e => {
  var button = document.getElementById("SaveButton");
  if (button) button.disabled = !myDiagram.isModified;
  var idx = document.title.indexOf("*");
  if (myDiagram.isModified) {
    if (idx < 0) document.title += "*";
  } else {
    if (idx >= 0) document.title = document.title.slice(0, idx);
  }
});
//ExternalObjectsDropped
//ChangedSelection

myDiagram.addDiagramListener("ChangedSelection", (e) => {
     if(e.subject && e.subject.$e && e.subject.$e.value)
       {        
        this.selectWfNode(e.subject.$e.value)
       }
       
      //  let n = []
      //  myDiagram.nodes.map(c=>{
      //      if(c.start=='Y')
      //       n.push(c)
      //  })
      //  if(n.length>1)
      //      myDiagram.model.removeNodeData(e.subject.$e.value)
})




myDiagram.addDiagramListener("ExternalObjectsDropped", (e) => {
     if(e.subject && e.subject.$e && e.subject.$e.value)
       {        
        this.selectWfNode(e.subject.$e.value)
        this.initMaxNodeNo(e.subject.$e.value.data)
       }
})


myDiagram.addDiagramListener("LinkDrawn", function (e) {
      // 不同的颜色
      myDiagram.model.setDataProperty(
        e.subject.data,
        "fill",
        go.Brush.randomColor()
      );
      // 未匹配节点不能连线


      var nodeFrom = myDiagram.model.findNodeDataForKey(e.subject.data.from);
           
      //var nodeTo = myDiagram.model.findNodeDataForKey(e.subject.data.to)
      if(e.subject.data && !e.subject.data.to)
       {

        myDiagram.model.removeLinkData(e.subject.data)

        //myDiagram.model.removeNodeData()
       }

       //获取开始节点
          let toNode =  e.subject.toNode
          let fromNode =  e.subject.fromNode
          if(fromNode && toNode){
            let fromNodeType = fromNode.data.nodeType 
            let toNodeType = toNode.data.nodeType 
            if(fromNodeType==='COND' && toNodeType=='COND'){
              myDiagram.model.removeLinkData(e.subject.data)
            }        
          }

       //获取结束节点


      //var nodeTo = myDiagram.model.findNodeDataForKey(e.subject.data.to);
      // if(nodeFrom.nodeType=='03' || nodeTo.nodeType=='03'){
      //   that.$message.error('未匹配节点无需连线！');
      //   //删除连线
      //   myDiagram.model.removeLinkData(e.subject.data)
        
      //   //myDiagram.model.removeNodeData()//删除节点
      //  }

 })
// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
// and where the port is positioned on the node, and the boolean "output" and "input" arguments
// control whether the user can draw links from or to the port.
function makePort(name, spot, output, input) {
  // the port is basically just a small transparent circle
  return $(go.Shape, "Circle",
    {
      fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(7, 7),
      alignment: spot,  // align the port on the main Shape
      alignmentFocus: spot,  // just inside the Shape
      portId: name,  // declare this object to be a "port"
      fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
      fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
      cursor: "pointer"  // show a different cursor to indicate potential link point
    });
}

var nodeSelectionAdornmentTemplate =
  $(go.Adornment, "Auto",
    $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
    $(go.Placeholder)
  );

var nodeResizeAdornmentTemplate =
  $(go.Adornment, "Spot",
    { locationSpot: go.Spot.Right },
    $(go.Placeholder),
    $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

    $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

    $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
  );

var nodeRotateAdornmentTemplate =
  $(go.Adornment,
    { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
    $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
  );      
let nodeClick =(e,node)=>{

  myDiagram.model.setDataProperty(node.data,'fill',"#2E0AF1")

};
function performLinkValidation(fromNode, fromGraphObject, toNode, toGraphObject, link, maxOutboundLinks){
            //所有节点都允许多出 多进 edit by wanghao 2024-05-23 22:38
            return true
        if(fromNode && fromNode.data.nodeType!=='COND'){

           let childrenLinks = fromNode.findTreeChildrenLinks();
            if (childrenLinks.count>maxOutboundLinks-1){
              return false;
            } else {
              return true;
            }
        }
         return true
        }

myDiagram.nodeTemplate =
  $(go.Node, "Spot",
    { locationSpot: go.Spot.Center },
    {linkValidation: function(fromNode, fromGraphObject, toNode, toGraphObject, link){

       //return true  //所有节点都允许多出 多进
       return performLinkValidation(fromNode, fromGraphObject, toNode, toGraphObject, link, 1)
     }
     },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
    { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
    new go.Binding("angle").makeTwoWay(),
    // the main object is a Panel that surrounds a TextBlock with a Shape
    $(go.Panel, "Auto",
      { name: "PANEL" },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Shape, "Rectangle",  // default figure
        {
          portId: "", // the default port: if no spot on link data, use closest side
          fromLinkable: true, toLinkable: true, cursor: "pointer",
          fill: "white",  // default color
          strokeWidth: 2
        },
        new go.Binding("figure"),
        new go.Binding("fill")),
        new go.Binding("props"),
        new go.Binding("nodeType"),
        new go.Binding("nodeNo"),

      $(go.TextBlock,
        {
          font: "bold 10pt Helvetica, Arial, sans-serif",
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    // four small named ports, one on each side:
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false),
    { // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => {
        showSmallPorts(node, true)
      },
      mouseLeave: (e, node) => showSmallPorts(node, false),
      mouseDragEnter:(e,node) =>{
         //console.log(node)
      },
      mouseDrop:(e,node) =>{
         //console.log(node)
      },
    },
    {
      doubleClick:(e,node)=>{
        //nodeClick(e,node)

        // let t = (n) =>{
        //   myDiagram.model.setDataProperty(n.data,'fill',"#2E0AF1")
        // }
       // myDiagram.model.setDataProperty(node.data,'fill',"#2E0AF1")

        //t(node)
         const _node = myDiagram.model.findNodeDataForKey(node.part.data.key)
        //  _node._mynane="wanghao"
         // node.data.fill='#2E0AF1'
        //  console.log(myDiagram,myDiagram.model)
        //  console.log(_node)

       // this.myDiagramEntity.model = go.Model.fromJson(JSON.stringify(nodeArrt)); 
        //myDiagram.model.setDataProperty(node.data,'fill',"#2E0AF1")
        //myDiagram.model.setDataProperty(node.data,'text',"wanghao")

        //myDiagram.model=go.Model.fromJson(myDiagram.model.toJson()); 
        myDiagram.links.map(c=>{
        })

        myDiagram.nodes.map(c=>{
         // console.log(c)
         // console.log(c.data)
        })
    },
    click:(e,node)=>{
      this.selectWfNode(node)
    }
  },
  );
myDiagram.nodeTemplate1 =
  $(go.Node, "Spot",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
    { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
    new go.Binding("angle").makeTwoWay(),
    // the main object is a Panel that surrounds a TextBlock with a Shape
    $(go.Panel, "Auto",
      { name: "PANEL" },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Shape, "Rectangle",  // default figure
        {
          portId: "", // the default port: if no spot on link data, use closest side
          fromLinkable: true, toLinkable: true, cursor: "pointer",
          fill: "white",  // default color
          strokeWidth: 2
        },
        new go.Binding("figure"),
        new go.Binding("fill")),
      $(go.TextBlock,
        {
          font: "bold 10pt Helvetica, Arial, sans-serif",
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
        
        
    ),
    // four small named ports, one on each side:
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false),
    { // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => showSmallPorts(node, true),
      mouseLeave: (e, node) => showSmallPorts(node, false)
    }
  );

function showSmallPorts(node, show) {
  node.ports.each(port => {
    if (port.portId !== "") {  // don't change the default port, which is the big shape
      port.fill = show ? "rgba(0,0,0,.3)" : null;
    }
  });
}

var linkSelectionAdornmentTemplate =
  $(go.Adornment, "Link",
    $(go.Shape,
      // isPanelMain declares that this Shape shares the Link.geometry
      { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
  );

myDiagram.linkTemplate =
  $(go.Link,  // the whole link panel
    { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4
    },
    new go.Binding("points").makeTwoWay(),

    $(go.Shape,  // the link path shape
      { isPanelMain: true, strokeWidth: 2 }),
    $(go.Shape,  // the arrowhead
      { toArrow: "Standard", stroke: null }),
    $(go.Panel, "Auto",
      new go.Binding("visible", "isSelected").ofObject(),
      $(go.Shape, "RoundedRectangle",  // the link shape
        { fill: "#F8F8F8", stroke: null }),
     new go.Binding("strokeWidth").makeTwoWay(),
      $(go.TextBlock,
        {
          textAlign: "center",
          font: "10pt helvetica, arial, sans-serif",
          stroke: "#919191",
          margin: 2,
          minSize: new go.Size(10, NaN),
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    { click:(e,link)=>{
    }}
  );

//load();  // load an initial diagram from some JSON text

// initialize the Palette that is on the left side of the page
let myPalette =
  new go.Palette("myPaletteDiv",  // must name or refer to the DIV HTML element
    {
      maxSelectionCount: 1,
      nodeTemplate: myDiagram.nodeTemplate1,  // share the templates used by myDiagram
      //nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram

      linkTemplate: // simplify the link template, just in this Palette
        $(go.Link,
          { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
            // to line up the Link in the same manner we have to pretend the Link has the same location spot
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate:
              $(go.Adornment, "Link",
                { locationSpot: go.Spot.Center },
                $(go.Shape,
                  { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                $(go.Shape,  // the arrowhead
                  { toArrow: "Standard", stroke: null })
              )
          },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points"),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null })
        ),
      model: new go.GraphLinksModel([  // specify the contents of the Palette
       // { text: "开始", figure: "Ellipse", "size":"75 75", fill: "#00AD5F" },
        { text: "开始", figure: "RoundedRectangle",nodeType:'NORMAL', fill: "#075B46",start:'Y',nodeNo:'I' },
        // { text: "Step" },
        // { text: "DB", figure: "Database", fill: "lightgray" },
        { text: "条件", figure: "Diamond", fill: "lightskyblue",nodeType:'COND',start:'N',nodeNo:'IF' },
        { text: "常规", figure: "Ellipse", "size":"75 75", fill: "#0DC2C4" ,nodeType:'NORMAL' ,start:'N',nodeNo:'N'},
        { text: "会签", figure: "Rectangle", "size":"75 75", fill: "#1CFC88" ,nodeType:'GROUP',start:'N',nodeNo:'C'},
        { text: "动态", figure: "Ellipse", "size":"75 75", fill: "#03AB41" ,nodeType:'DYNAMIC',start:'N',nodeNo:'D'},
        { text: "直属领导", figure: "Ellipse", "size":"75 75", fill: "#05A5FF" ,nodeType:'LEADER',start:'N',nodeNo:'H'},
        { text: "部门领导", figure: "Rectangle", "size":"75 75", fill: "#08E0EF" ,nodeType:'DEPT_LEADER',start:'N',nodeNo:'T'},
        { text: "选择审批人", figure: "Rectangle", "size":"75 75", fill: "#F19E7C" ,nodeType:'POINT_USER',start:'N',nodeNo:'U'},
        { text: "本部门岗位", figure: "Rectangle", "size":"75 75", fill: "#09C0F4" ,nodeType:'POINT_JOB',start:'N',nodeNo:'P'},
        { text: "跨部门岗位", figure: "Rectangle", "size":"75 75", fill: "#AEFAC9" ,nodeType:'K_POINT_JOB',start:'N',nodeNo:'D'},
        { text: "结束", figure: "RoundedRectangle", fill: "#CE0620",nodeType:'NORMAL' ,start:'N',nodeNo:'O'},
        //{ text: "Comment", figure: "RoundedRectangle", fill: "lightyellow" ,start:'N'}
      ], [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          { points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
        ])
    });
},


    initDocumentModel(){
      let _data = { url: '/wf-doc/doc-by-id', params: {data:this.modeId}}
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                 this.modeDocName=data.docName
                 this.modeDocNo=data.docNo
                 this.rendermyDiagram(data)
              }).catch(err => {
              console.error(err)
            })

    },
    toOk(row){
       row.rowState=1
       //this.$forceUpdate()
       //console.log(row)

    },
    reback(){
      this.$store.dispatch("tagsView/delView", this.routeObj)
      this.$router.go(-1)
    },
    toRemove(row){
      let idx=this.list.indexOf(row)
      if(idx>-1){
          let item =  this.list.splice(idx,1) 
          let i = 1;
          this.list.forEach(c=>{
          c.nodeNo = `${i++}`
          c.status=i
        })
      }
      this.resetNodeNo(this.list)
    },
    SubmitUGrp(){
      this.usergroupDialogShow = false;
      this.userGroupRow.deptNo = this.userGroupNode.id
      this.userGroupRow.groupCode = this.userGroupNode.groupCode
      this.userGroupRow.groupName = this.userGroupNode.groupName
      this.userGroupNode = {}
    },
    groupUserInput(e,item){
      this.checkedUserGrpData = item.id
      this.userGroupNode = item
    },
    userGroupData(row) {
      this.userGroupRow = row
      this.groupId = row.id;
      let queryParams = {
        requestData: {},
        current: 1,
        pageSize: 10000,
      }
      const _data = {
        url: "/userGrp/guest/items",
        params: queryParams,
      };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((res) => {
          let data = res.data;
          // data.forEach((item) => {
          //   this.checkedroleData.push(item.id);
          // });
          this.groupData = data
          this.usergroupDialogShow = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },

        // 点击树节点回调
    deptTreeNodeClick(data) {
      this.isClickMenu = true
      if(this.clickData.id != data.id){
        //this.getMenuTableData(data)
        this.clickData = data
      }

    },

    deptLoop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        if (item.children && item.children.length > 0) {
           item["leaf"] = false;
           //DEPT_LEADER
           //console.log(123,this.currSelectNode.data.nodeType)
           //item["disabled"] = true;
           item.children = this.deptLoop(item.children, item.id);
        }
        res.push(item);
      });

      return res;
    },
    deptTreeData(data, id) {
      //.this.loop(data, id);
      return this.deptLoop(data, id);
    },
    getDeptTreeData(row) {
      if(row.approveRole=='UGROUP'){
        this.userGroupData(row)
      }
      if(row.approveRole=='DEPT' || row.approveRole=='JOB'){
        this.isDeptTreeDialogShow = true
        this.deptCurrRow = row
        const _data = {url: '/org/org-tree'}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          const newData = this.deptTreeData(data, '0')
           this.treeDeptData = newData
           this.deptDefaultShowNodes = [newData[0].id]
        })
      }
    },
    deptManage(){
      this.deptCurrRow.groupCode =this.deptCurrNode.code
      this.deptCurrRow.groupName= this.deptCurrNode.name
      this.deptCurrRow.deptNo=  this.deptCurrNode.id
      this.isDeptTreeDialogShow = false
      this.$refs.deptTree.setCheckedNodes([])
      this.deptCurrNode  = {}
    },
    checkDeptChange(data, isSelect){
      this.$refs.deptTree.setCheckedNodes([])
      this.$refs.deptTree.setChecked(data.id,true)
      let nodes = this.$refs.deptTree.getCheckedNodes();
      this.deptCurrNode=nodes[0]      
    },
    onSelectChang(v,item,row){
       if(v!='USER')
         { 
          row.userDisabled = true
          this.editDisabled.approveUsername=true

        } 
        else
        {         
           row.userDisabled = false 
           this.editDisabled.approveUsername=false

        }        
          
        if(v!='DEPT' && v!='UGROUP')
        {         
           row.groupDisabled = true   
                
           this.editDisabled.groupName=true
        }        
        else
        {          
          row.groupDisabled = false 
          this.editDisabled.groupName=false

        }   
        this.editDisabled.jobName = true
        if(v=='JOB'){
          this.editDisabled.jobName = false
        }
        if(v==='JOB' && row.nodeType==='GROUP'){
          this.editDisabled.jobName = false
          this.editDisabled.groupName = false
        }
 },
    onNodeTypeChang(v,item,row){

      if(v!='GROUP' && row.approveUserId){
          let uids = row.approveUserId.split(",")
          if(uids.length>0){
            row.approveUserId=''
            row.approveUser=''
            row.approveUsername=''
          }
      }
    },
    checkChange(data, isSelect) {
      // 变量获取选中状态
      this.isCheckSelect = isSelect;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
      }else{
        // resolve(node.data.children);
        let _data = {url: '/user/dept-user',params: {data:node.data.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          let arr = []

          if(data.length > 0){
            arr = data.map(val=>{
              val.label = val.realName;
              val.value = val.id;
              val["leaf"] = true;
              return val
            })
          }


          resolve([...node.data.children,...arr])
        })
      }
    },
        // 复选框点击改变事件
        checkChange(data, isSelect) {
      // 变量获取选中状态
      this.isCheckSelect = isSelect;
    },
    funcManage(){
      let uids = []
      let uname = []
      let ulogin = []
      this.userCurrNodes.forEach(c=>{
        uids.push(c.id)
        uname.push(c.realName)
        ulogin.push(c.userName)
      })
      if(this.nodeType==='GROUP'){
        this.userCurrRow.approveUserId = uids.join()
        this.userCurrRow.approveUser=ulogin.join()
        this.userCurrRow.approveUsername=  uname.join()
      }else{
        if(this.userCurrNode===undefined)
            this.userCurrNode={}
        this.userCurrRow.approveUserId =this.userCurrNode.id||''
        this.userCurrRow.approveUser= this.userCurrNode.userName||''
        this.userCurrRow.approveUsername=  this.userCurrNode.realName||''
      }
      this.isTreeDialogShow = false
      this.$refs.tree.setCheckedNodes([])
      this.userCurrNode  = {}
      this.userCurrNodes.length=0
    },
    checkFunc(data, treeChoseObj) {
      let { checkedKeys } = treeChoseObj;

      if(this.nodeType!='GROUP'){
        this.$refs.tree.setCheckedNodes([])
      }
  
      //check事件 当复选框被点击的时候触发
      //this.hanleCheck(data, treeChoseObj, "tree");
      // let menuData = this.funcResData;
      // let tt = [...checkedKeys]
      // if (this.isCheckSelect) {
      //    this.dgTreeData(data,menuData,tt); //获取父级节点ID
      // }
      if(this.allMenuId && this.allMenuId.indexOf(data.id)!=-1){
        this.$refs.tree.setChecked(data.id,false)
      }else{
        this.$refs.tree.setChecked(data.id,true)
      }

      this.allMenuId = this.$refs.tree.getCheckedKeys();
      
      let nodes = this.$refs.tree.getCheckedNodes();
      this.userCurrNode = nodes[0]
      this.userCurrNodes = nodes
      //this.$refs.tree.setCheckedKeys(this.allMenuId)
    },
    hanleCheck(data, node, treeName) {
      const _this = this;
      // 获取当前节点是否被选中
      const isChecked = this.$refs[treeName].getNode(data).checked;
      // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消选中
      if (isChecked) {
        // 判断是否有上级节点，如果有那么遍历设置上级节点选中
        if (data.pid || data.pid === 0) {
          setParentChecked(data.pid);
        }
        // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
        data.children &&
          data.children.length > 0 &&
          setChildreChecked(data.children, true);
      } else {
        // 如果节点取消选中，则取消该节点下的子节点选中
        data.children &&
          data.children.length > 0 &&
          setChildreChecked(data.children, false);
      }
      function setParentChecked(pid) {
        // 获取该id的父级node
        const parentNode = _this.$refs[treeName].getNode(pid);
        // 如果该id的父级node存在父级id则继续遍历

        parentNode &&
          parentNode.data &&
          parentNode.data.pid &&
          setParentChecked(parentNode.data.pid);
        //  设置该id的节点为选中状态
        _this.$refs[treeName].setChecked(pid, true);
      }
      function setChildreChecked(node, isChecked) {
        node.forEach((item) => {
          data.children &&
            item.children.length > 0 &&
            setChildreChecked(item.children, isChecked);
          _this.$refs[treeName].setChecked(item.id, isChecked);
        });
      }
    },
    // 递归生成菜单树结构数据
    loop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item["leaf"] = false;
        item["disabled"] = true;
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.id);
        }
        res.push(item);
      });

      return res;
    },
    treeData(data, id) {
      //.this.loop(data, id);
      return this.loop(data, id);
    },
    funcMngClick(row) {
      if(row.approveRole!='USER')
         return
      this.nodeType=  row.nodeType 
      this.clickRow = row
      this.isTreeDialogShow = true;
      this.userCurrRow = row
      const _data = { url: "/org/org-tree" };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        const newData = this.treeData(data, "0");
        this.funcMngData = newData;
      });

      this.defaultShowKeys.length = 0

      //判断是否是会签的用户节点
      if(row.nodeType==='GROUP' && row.approveUserId){
          let uids = row.approveUserId.split(",")
          this.defaultShowKeys = uids
      }else{
        let uids = []
        if(row.approveUserId)
           uids =row.approveUserId.split(",")

        if(uids.length>1){
          this.defaultShowKeys.push([])
        }else{
          this.defaultShowKeys =  uids
        }
        //this.defaultShowKeys.push(row.approveUserId)
      }
      // const _data1 = { url: "/userGrp/guest/userGrp-user" ,params: { data: row.id },};
      // this.$store.dispatch("fmsCommon/actionAuthPost", _data1).then((data) => {
      //   this.defaultShowKeys = data.map(val=>{
      //     return val.id
      //   })

      // });
    },
    /** 代办状态样式 */
    getType(row) {
      if (row.wtState == "WAIT") {
        return "warning";
      } else if (row.wtState == "FINISHED") {
        return "success";
      }
    },

    initData(arr) {
      let args = {};
      arr.map((c) => {
        if (c.edit) {
          args[c.field] = null;
        }
      });
      return args;
    },
    initfromData(arr) {
      let args = {};
      arr.map((c) => {
        args[c.field] = null;
      });
      return args;
    },
    commonFilter(value, type) {
      if (
        this.initSelect.hasOwnProperty(type) &&
        typeof this.initSelect[type] != undefined &&
        Array.isArray(this.initSelect[type])
      ) {
        return this.getValueConvert(this.initSelect[type], value);
      }
      if (
        this.initSelect.hasOwnProperty(type) &&
        !Array.isArray(this.initSelect[type]) &&
        this.initSelect[type].hasOwnProperty(value)
      ) {
        return this.initSelect[type][value];
      }
      return value;
    },
    //行状态 1 预览  2编辑 3增加 4删除
    getList() {
      this.listLoading = false;
      Object.assign(this.queryParams, this.listQuery);
      const _data = { url: "/wf-work-node-item/selectByWfId", params: {data: this.modeId} };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          this.list =data;
          this.list.forEach(c=>{
            c.userDisabled = true
            c.groupDisabled= true  
            c.jobDisabled= true  
            c.rowState = 1
            if(c.approveRole=='USER')
              {  c.userDisabled= false}
            if(c.approveRole=='DEPT' || c.approveRole=='UGROUP')
                c.groupDisabled= false  
            if(c.approveRole=='JOB')
                c.jobDisabled= false    
          })
         //this.resetNodeNo(this.list)
         this.redenerNodeList(this.list)
         //初始化节点

        })
        .catch((err) => {
          console.error(err);
        });
      //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
    },

    getValueConvert(arr, value) {
      for (let v of arr) {
        if (v.value == value) {
          return v.label;
        }
      }
      return value;
    },
    destory(hide = false) {
      this.dialogFormVisible = hide;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = "";
        }
      }
    },
    resetNodeNo1(data){
      let i = 1;
      this.list.forEach(c=>{
        c.status=i
        c.nodeNo = `${i++}`
      })
 
      for(let n in this.list){
            let item = this.list[n]
            if(n==0){
              item.preNodeNo = '#'
              this.list[n].start='Y'
              continue
            }
            this.list[n].start='N'

            if(n<this.list.length){
              let preNode = this.list[n-1]
              item.preNodeNo =  preNode.nodeNo
              preNode.nextNodeNo =item.nodeNo 
              item.nextNodeNo = '#'
            }
        }
  },
  //通过后一节点驱动前一节点
  resetNodeNo(data){
      //计算节点
      //计算线条
      this.nodeLinks = []
      this.myDiagram.links.map(link=>{
          let toNode = link.toNode
          let fromNode = link.fromNode
          let toDataProps = toNode.data.props
          let fromDataProps = fromNode.data.props
          if(toDataProps && fromDataProps)
          fromDataProps.nextNodeNo = toDataProps.nodeNo
          let nodeLink = {nodeNo:fromDataProps.nodeNo,nextNodeNo:toDataProps.nodeNo}
          this.nodeLinks.push(nodeLink)
      })
      this.list.length=0
      this.myDiagram.nodes.map(nd=>{
        if(nd.data.props)
        this.list.push(nd.data.props)
      })
      //获取节点脚本

      let i = 1;
      this.list.forEach(c=>{
        c.status=i++
        if(!c.nodeName)
           c.nodeName = c.nodeNo
        //处理表达式
         if((!c.conditions || c.conditions.length) && c.nodeExpress && c.nodeType=='COND'){
          const expr = c.nodeExpress
         if(expr && expr!=null && expr!='' && c.nodeType=='COND'){
          const expJson = JSON.parse(expr)
          c.conditions = []
          for(let item in expJson){
            c.conditions.push({nodeNo:c.nodeNo,nextNodeNo:item,nodeOutput:expJson[item]})
          }
         }  
        }      
      })
      
      // for(let n in this.list){
      //       let item = this.list[n]
      //       if(n==0){
      //         item.preNodeNo = '#'
      //         this.list[n].start='Y'
      //         continue
      //       }
      //       this.list[n].start='N'
      //   }

        // for(let n in this.list){
        //     let item = this.list[n]
        //     if(n>0 && (item.preNodeNo==null || item.preNodeNo==='' || item.preNodeNo==undefined)){
        //       this.$message({
        //               type: 'error',
        //               message: '非开始节点的前一节点不能为空'
        //           });
        //     }
        // }

  },
    addRowItem(){
      //增加行项目
      let item = {}
       this.cols.forEach(c=>{
            item[c.field] = null
      })
      item['rowState'] = 3 
      this.list.push(item)
      this.resetNodeNo(this.list)



    },
    showDetails(row, column) {},
    edit(row) {
      this.allowDisable = true;
      this.dialogFormVisible = true;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p];
        }
      }
    },
    selectOptions(){
      let _data = { url: '/wf-constant/ApproveRoles', params: {}}
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                this.initSelect.approveRole = data.map(c => {
                  return {
                    label: c.name,
                    value: c.value
                  }
                })
              }).catch(err => {
              console.error(err)
            })

            _data = { url: '/wf-constant/NodeTypes', params: {}}
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                this.initSelect.nodeType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.value
                  }
                })
              }).catch(err => {
              console.error(err)
            })
    },

    saveCreateNode(){
      this.resetNodeNo()
      let data = {
        modeId:this.modeId,
        items:this.list,
        nodeLinks:this.nodeLinks,
        graph:this.myDiagram.model.toJson()
      }

      for(let item of this.list){
          if(item.nodeType==='K_POINT_JOB'){
             if(item.deptNo===null||item.deptNo===undefined || item.jobId===null||item.jobId===undefined){
              this.$message.error("在跨部门模式下必须选择部门和岗位")
              return
             }
          }
      }
      this.$confirm(i18n.t("common.tip_info.common_info"), i18n.t("common.tip_info.tips"), {
                  confirmButtonText: i18n.t("common.btn.ok"),
                  cancelButtonText: i18n.t("common.btn.cancel"),
                  type: 'warning'
              }).then(() => {
                  const _data = { url: '/wf-work-node-item/createNodeItem', params: { data: data } }
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                      .then(data => {
                          this.$message({
                              type: 'success',
                              message: this.$t('common.btn.saveSuccess')
                          });
                          this.getList();
                      }).catch(err => {
                          console.error(err)
                      })
              }).catch(() => {
                  this.$message({
                      type: 'info',
                      message: 'cancel save'
                  });
              })

    },

    submit(formName) {
      const _data = {
        url: "/codes/add",
        params: {
          data: this.defaultForm.params,
        },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: "change success!=>" + data,
              });
              this.dialogFormVisible = false;
              this.query();
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.destory();
            });
        } else {
          this.$message({
            type: "error",
            message: "输入数据不能为空",
          });
          this.destory();
        }
      });
    },
    query() {
      this.listQuery.current = 1;
      this.getList();
    },
    reset() {
      for (let p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = "";
        }
      }
    },
    /** 预览 */
    toFlowView(row) {
      this.$router.push({
        //path: row.tempDocUri,
        name: row.docUri,
        // prop: true,
        params: { formFlowData: { docId: row.docId,sourceId:row.id,sourceData:row,sourceType: 'TODO'} },
      });
    },
  },
};
</script>

<style scoped>
 .el-row {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item {
  margin-left: 3px;
}
</style>
