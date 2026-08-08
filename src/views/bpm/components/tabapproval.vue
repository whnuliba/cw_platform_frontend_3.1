<template>
  <div style="padding-left:3px ;">
    <div  style="width: 100%;margin-top: 5px; border-bottom: 1px solid #CCD1D0; padding: 5px;">
        <el-row>
        <el-col :span="16"><div  class="grid-content bg-purple" style="color: #05B6FC;font-size: 18px;font-weight: bold; ">
           <span style="margin-left: 5px;font-weight: bold;font-size: 18px;">{{intervalDate}}</span>
           <span style="padding: 10px 0 10px 0;margin-left: 20px;font-weight: bold;font-size: 18px;color: #05B6FC;">{{flowName}}</span>
            <span  style="padding: 10px 0 10px 0;font-weight: bold;font-size: 18px;color: #05B6FC;" v-show="flowNo!=null && flowNo!='' ">[{{flowNo}}]</span>
        </div>
      </el-col>

      <el-col :span="8"><div class="grid-content bg-purple-light" style="align-content: right;float:right">
        <el-button v-show="displayBtn" type="primary" class="filter-item" size="mini" plain @click="save()">
                  {{ $t("common.btn.save") }}
              </el-button>
              <el-button v-show="displayBtn" type="primary" class="filter-item" size="mini" plain @click="submit()">
                  {{ $t("common.btn.submit") }}
              </el-button>
              <el-button  v-show="displayApproverBtn" type="primary" class="filter-item"  size="mini" plain @click="approver()">
                  {{ $t("common.btn.approver") }}
              </el-button>
              <el-button v-show="displayBtn" type="primary" class="filter-item" size="mini" plain @click="query()">
                  {{ $t("common.btn.delete") }}
              </el-button>
              <el-button  type="primary" class="filter-item" size="mini" plain @click="closePage()">
                  {{ $t("common.btn.reback") }}
              </el-button>
      </div>
      </el-col>
      </el-row>
   </div>


   <el-tabs v-model="titleActiveName" @tab-click="handleFlowClick">
    <el-tab-pane label="表单信息" name="titleFlowForm">
      <div style="margin-top: 5px;">
      <!-- <div style="padding: 10px 0 10px 0;font-weight: bold;font-size: 24px;">
        <el-row>
        <el-col :span="24"><div  class="grid-content bg-purple" style="text-align: center;">
            <span>{{flowName}}</span>
            <span v-show="flowNo!=null && flowNo!='' ">[{{flowNo}}]</span>
        </div>
      </el-col>
      </el-row>
      </div> -->
      <slot name="flowForm" :flowData="slotBindData"></slot>

      <div v-show="wfApproveDisplay && wfDisplay">
    <el-tabs slot="title" v-model="activeName" :before-leave="selectApproveItem" >
        <el-tab-pane v-if="tabApproveDispaly" v-for="val in approvetabData" :name="val.field" :label="val.title">
          <el-form :ref="val.field"  :model="val.params" label-width="120px">
        <div v-for="(item) in val.formData" style="display:inline">
          <el-form-item
            v-if="item.type==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="val.params[item.field]" style="width:100%;" />
          </el-form-item>

          <el-form-item
            v-if="item.type==='input-org'"
            v-show="userOrgDisplay"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="val.params[item.field]"
            @focus="userOrOrgClick"
            style="width:100%;" />
          </el-form-item>

          <el-form-item
            v-if="item.type==='textarea'"
            v-show="displayApproveDtsSelect"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
          <el-input v-model="val.params[item.field]"  type="textarea" style="width:100%;"/>
          </el-form-item>
          <el-form-item
            v-if="item.type==='radio'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
          <el-radio-group v-model="val.params[item.field]">
            <el-radio v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.value"
              />{{ item.label }}</el-radio>
          </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="item.type==='radio-approve'"
            v-show="displayApproveSelect"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
          <el-radio-group v-model="val.params[item.field]" @input="(v)=>onSelectChang(v,item)">
            <el-radio  v-for="item in initSelect[item.field]" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="item.type==='radio-sub'"
            v-show="resubmit"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
          <el-radio-group v-model="val.params[item.field]">
            <el-radio  v-for="item in initSelect[item.field]" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="item.type==='select-approve'"
            v-show="displayApproveSelect"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="val.params[item.field]" placeholder="..." style="width:100%" @change="(v)=>onSelectChang(v,item)">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type==='select-sub'" v-show="resubmit"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="val.params[item.field]" placeholder="..." style="width:100%;" @change="$forceUpdate()">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="item.type==='select-user'" v-show="displayNextUser"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="val.params[item.field]" placeholder="..." style="width:100%;" @change="$forceUpdate()">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>



          <el-form-item v-if="item.type==='datetime'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="val.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" style="width:100%" />
          </el-form-item>
          <el-form-item v-if="item.type==='date'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="val.params[item.field]" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly" type="date" :placeholder="commonI18n(item)" style="width: 100%" />
          </el-form-item>
        </div>

      </el-form>
        </el-tab-pane>
  
        <el-tab-pane label="明细" name="an2Tab2">
          <div style="max-height: 300px;overflow-y: auto;">
            <el-table v-loading="listLoading" :data="detaillist" border fit highlight-current-row style="width: 100%" >

<el-table-column width="50px" :label="$t('common.no')" align="center">
  <template slot-scope="scope">
    <span>{{ scope.$index+1 }}</span>
  </template>
</el-table-column>
<!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
<el-table-column v-for="(item) in detailcols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
  <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
  <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
</el-table-column>

</el-table>
       </div>

        </el-tab-pane>
        
      </el-tabs>
    </div>

    </div>


    </el-tab-pane>
    <el-tab-pane label="流程图" name="titleFlowGraph">
       <flowGraph ref="flowGraph" :tempDoc="mytempDoc" :docInfo="docInfo" :items="alreadyApproveList" :formData="slotBindData"></flowGraph>
    </el-tab-pane>
  </el-tabs>
  

  <!-- 动态节点的用户选择-->

  <el-dialog
      v-el-drag-dialog 
      :title="'选择用户'"
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
  </div>
     
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import flowGraph from './flowGraph.vue'
export default {
  directives: { elDragDialog },
  components: { flowGraph },

  props: {
    wfApproveDisplay: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    formName: {
      type: Object
    },
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    tempDoc: {
      type: String,
      default: ''
    },
    title: {  
      type: String,
      default: ''
    },
    nextNodeUser: {  
      type: String,
      default: ''
    },
    nextNodeJob: {  
      type: String,
      default: ''
    },
    nextNodeDept: {  
      type: String,
      default: ''
    },
    nextNodeType: {  
      type: String,
      default: 'USER'
    }
  },
  data() {
    return {
      url: {
        doApprove: '/wf-work-approve/doApprove',
        list: '/wf-work-approve/approveDetails',
        createFrom:'/wf-doc-approve/createForm',
        flowTempUri:'/wf-doc/doc-by-no',
        submitUrl:'/wf-doc-approve/submitFlow',
        docUrl:'/wf-doc-approve/doc-by-id'
      },
      intervalDate: this.dateFormats(new Date()),
      //用户选择处
      isTreeDialogShow:false,
      isCheckSelect:false,
      defaultShowNodes: [],
      defaultShowKeys: [],
      funcMngData: [], // 功能管理变量
      clickRow: undefined,
      userCurrNode: undefined,
      userCurrNodes:undefined,
      userOrgDisplay:false,
      allMenuId:[],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },

      //部门部分

      isDeptTreeDialogShow:false,
      deptDefaultShowNodes: [],
      treeDeptData: [],
      deptCurrNode:{},
      deptCurrRow:{},
      clickDeptData:undefined,
      //用户组
      usergroupDialogShow:false,
      checkedUserGrpData:[],
      groupData:[],
      userGroupRow:{},
      userGroupNode:{},
      flowFormData:undefined,
      titleActiveName:'titleFlowForm',
      wfDisplay:true,
      mytempDoc:'',
      displayBtn:true,
      tabApproveDispaly: true,
      flowNo:'',
      flowName: '',
      tempDocNo:undefined,
      dialogApprove: true,
      listLoading: false,
      displayApproveSelect:false,
      docId:'',
      flowViewForm:undefined,
      docInfo:undefined,
      activeName:'approvetab',
      displayApproverBtn:false,
      displayNextUser:false,
      displayGlobalNextUser:false,
      displayApproveDtsSelect:false,
      
      resubmit:false,
      slotBindData: {
         type:'',
         form:undefined,
         formData: undefined,
         currNode:undefined,
         nextNode: undefined,
         currItem: undefined,
         nextItem: undefined
      },
      alreadyApproveList:undefined,
      approvetabData: [
        {
          title:'审批',
          field:'approvetab',
          formData:[
            //{title:'意见',field: 'approveOpinion',type:'select-approve'},
            {title:'意见',field: 'approveOpinion',type:'radio-approve'},

            {title:'审批对象',field: 'approveObj',type:'input-org'},
            {title:'重新提交到',field: 'reSubmit',type:'radio-sub'},
            {title:'说明',field: 'approveDetails',type:'textarea'},
            {title:'待审批', field: 'nextUser', type:'select-user'},


          ],
          params:{
            id:'',
            reSubmit:'',
            nextUser:'',
            approveObj: ''
          }
        },
        // {
        //   title:'明细',
        //   field:'detailtab',
        //   formData:[
        //     {title:'审批',field: 'approve',type:'radio'},
        //     {title:'时间',field: 'time',type:'date'},
        //     {title:'审批人',field: 'approver',type:'input'}
        //   ],
        //   params:{
        //     id:''
        //   }
        // },
      ],
      startType:'',
      initSelect: {
        approve: [],
        approveRole:[],
        nodeType:[],
        nextUser: []
      },
      detaillist: null,
      detailcols: [
        { field: 'nodeNo', title: '审批节点', align: 'left', query: false, queryType: 'input', set: true, require: true, width:120},
        { field: 'approveOpinion', title: '审批意见', align: 'left', query: false, queryType: 'input', set: true, require: true, width:120},
        // { field: 'currUser', title: '审批人', align: 'left', query: false, queryType: 'input', set: true, require: true, width:200},
        { field: 'approveUsername', title: '审批人', align: 'left', query: false, queryType: 'input', set: true},
        { field: 'approveTime', title: '审批时间', align: 'left', query: false, queryType: 'input', set: true, require: true, width:300},
        { field: 'nodeType', title: '审批类型', align: 'left', query: false, queryType: 'input', set: true, require: true, width:120},
        { field: 'approveDetails', title: '审批明细', align: 'left', query: false, queryType: 'input', set: true},
        { field: 'reSubmit', title: '重新提交', align: 'left',hide:true, query: false, queryType: 'input', set: true},

      ],
    }
  },
  created() {
    setInterval(()=>{
        this.intervalDate =this.dateFormats(new Date())
    }, 1000);
     //TODO//EXT//FORM
    this.initSourceData()
  },
  methods: {
    initFlowForm(flowFormData){
      this.$emit('initData',(docNo)=>{
        this.tempDocNo = this.tempDoc||docNo
        this.initDocTempData()
        this.initFlowData(flowFormData)  
    });
  
    this.bindValue()
    this.selectOptions()
    },
    initSourceData(){
      let query = this.$route.query
      let id = undefined
      let sourceType = undefined
      if(query && query.id)
      {
        id = query.id
        sourceType = query.sourceType
      }
      let url = undefined
      if(sourceType==='TODO'){
         url = '/wf-work-approve/queryById'
      }else if(sourceType==='FORM'){
         url = '/wf-doc-approve/doc-by-id'
      }
      const _data = {
        url: url,
        params: {data:id},
      };
      if(sourceType && sourceType!=='EXT'){
          this.$store
          .dispatch("fmsCommon/actionTaskPost", _data)
          .then((res) => {
              let docId = query.sourceType==='TODO'?res.docId:res.id
              this.flowFormData ={ docId: docId,sourceId:res.id,sourceData:res,sourceType: sourceType} 
              this.initFlowForm(this.flowFormData)
          })
          .catch((err) => {
            console.error(err);
          });
      }
      else if(sourceType && sourceType==='EXT'){
         let docId = query.id
         this.flowFormData ={ docId: docId,sourceId:id,sourceType: sourceType} 
         this.initFlowForm(this.flowFormData)
      }else{
        this.initFlowForm()
      }

    },
    loadFlowData(){
        this.$emit('initData',(docNo)=>{
          this.tempDocNo = docNo||this.tempDoc
           if(this.tempDocNo){
            this.initDocTempData()
            this.initFlowData()  
           }
      });
    },
    userOrOrgClick(){

      const row= this.slotBindData.nextItem
      if(row.approveRole==='USER'){
        this.funcMngClick(row)
      }else{
        this.getDeptTreeData(row)
      }
      
    
    },


    //=================================================部门部分================================================
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
      this.clickDeptData = data

    },
    checkDeptChange(data, isSelect){
      this.$refs.deptTree.setCheckedNodes([])
      this.$refs.deptTree.setChecked(data.id,true)
      let nodes = this.$refs.deptTree.getCheckedNodes();
      this.deptCurrNode=nodes[0]      
    },

    deptLoop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        if (item.children && item.children.length > 0) {
           item["leaf"] = false;
           item["disabled"] = true;
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
      if(row.approveRole=='DEPT'){
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
      this.isDeptTreeDialogShow = false
      this.approvetabData[0].params.approveObj= this.deptCurrNode.name
      let nextNode = {...this.slotBindData.nextItem}
      nextNode.deptNo=this.deptCurrNode.id
      this.executeNextApproveUser(nextNode)
    },
    SubmitUGrp(){
      this.usergroupDialogShow = false;
      this.approvetabData[0].params.approveObj= this.userGroupNode.groupName
      let nextNode = {...this.slotBindData.nextItem}
      nextNode.deptNo=this.userGroupNode.id
      this.executeNextApproveUser(nextNode)
    },
    //========================================================================================================

    //=================================================用户选择部分=============================================

    checkChange(data, isSelect) {
      // 变量获取选中状态
      this.isCheckSelect = isSelect;
    },

    checkFunc(data, treeChoseObj) {
      let { checkedKeys } = treeChoseObj;

      if(this.nodeType!='GROUP'){
        this.$refs.tree.setCheckedNodes([])
      }
  
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
      this.nodeType= row.nodeType
      this.clickRow = row
      this.isTreeDialogShow = true;
      this.userCurrRow = row
      const _data = { url: "/org/org-tree" };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        const newData = this.treeData(data, "0");
        this.funcMngData = newData;
      });

      this.defaultShowKeys.length = 0

        let uids = []
        if(this.userCurrNode && this.userCurrNode.id)
           uids =this.userCurrNode.id.split(",")
     
         this.defaultShowKeys =uids
    },

    funcManage(){
      // this.userCurrRow.approveUserId =this.userCurrNode.id
      // this.userCurrRow.approveUser= this.userCurrNode.userName
      // this.userCurrRow.approveUsername=  this.userCurrNode.realName

      this.approvetabData[0].params.nextUser= this.userCurrNode.userName
      this.approvetabData[0].params.approveObj= this.userCurrNode.realName

      this.isTreeDialogShow = false
      this.$refs.tree.setCheckedNodes([])
      this.userCurrNodes.length=0
    },
    //=========================================================================================================
    handleFlowClick(tab, event){
         if(tab.name==='titleFlowGraph'){
          this.mytempDoc = this.tempDoc
         }
    },
    selectApproveItem(activeName, oldActiveName) {
      if (activeName == 'an2Tab2') {
        let flowFormData = this.flowFormData!==undefined?this.flowFormData:(this.$route.params.formFlowData!==undefined?this.$route.params.formFlowData:undefined)
        if(flowFormData==null)
           return
          this.getList(flowFormData.docId)
          this.flowViewForm = flowFormData
      }
    },
    onSelectChang(v,item){
      this.approvetabData[0].params.reSubmit==null
      if('REJECT'==v)
      {
        this.resubmit=true
        this.displayNextUser = false
      }else{
        this.resubmit=false
        this.displayNextUser = this.displayGlobalNextUser
      }
       this.$forceUpdate()
      
    },
    resetNextNode(){
           this.findNextNodeByIf(this.flowNo,this.startType,this.slotBindData.form,true)
    },
    initFlowData(_flowFormData){
      let flowFormData = _flowFormData!==undefined?_flowFormData:(this.$route.params.formFlowData!==undefined?this.$route.params.formFlowData:undefined)
      if(flowFormData==null)
       {
        this.startType = 'Y'
        this.findNextNodeByIf(null,'Y')
        this.slotBindData.type='CREATE'

        this.$emit('initFromData',undefined,this.slotBindData,(_form)=>{
                  //若有返回函数，则直接返回获取到的表单数据
                  //this.slotBindData.formData=_form
          })
        return
       }
      this.slotBindData.type='DOING'
      let _data = { url: this.url.docUrl, params: {data:flowFormData.docId}}
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
           this.slotBindData.form=data
           this.flowNo=data.docNo
              this.docId = data.id
              let srt = data.docScript
              let srtJson = JSON.parse(srt)
              //this.formData = srtJson
              this.$emit('initFromData',data,this.slotBindData,(_form)=>{
                  //若有返回函数，则直接返回获取到的表单数据
                  this.slotBindData.formData=_form
              });
      //this.displayBtn = false
              if(data.approveState!='CREATE')
                  {this.displayBtn = false
                  this.wfDisplay = true
                  this.displayApproveSelect = true
                  this.displayApproveDtsSelect = true
                  if(data.approveState!='COMPLETE')
                      this.displayApproverBtn = true
                  }
              if(data.approveState=='REJECT')   {
                    this.displayBtn = true
                    this.displayApproverBtn = false
              }
              let startType = 'N'
              this.startType = 'N'
              if(flowFormData.sourceType=='FORM'){
                   this.displayApproverBtn = false
                   if(flowFormData.sourceData.approveState=='CREATE' || flowFormData.sourceData.approveState=='REJECT'){
                    this.slotBindData.type='CREATE' 
                    this.tabApproveDispaly=true
                      this.displayApproveSelect = false
                      this.displayApproveDtsSelect = false
                   }else{
                       this.tabApproveDispaly=false
                   }
                   this.activeName='an2Tab2'
                   startType = 'Y'
                   this.startType = 'Y'
                   this.selectApproveItem(this.activeName)
              }
              //来自其他表达打开
              if(flowFormData.sourceType=='EXT'){
                      this.tabApproveDispaly=false
                      this.displayApproveSelect = false
                      this.displayApproveDtsSelect = false
                      this.displayApproverBtn = false

                      this.activeName='an2Tab2'
                      this.selectApproveItem(this.activeName)
                      return;
              }

             //判断是来自待办还是表单
             if(flowFormData.sourceType=='TODO'){                
                 let sourceData = flowFormData.sourceData
                 this.slotBindData.currNode = sourceData
                 let currUser = sourceData.currUser
                 this.getCurrNoteItem(sourceData.currNodeId)
                 if(sourceData.wtState=='FINISHED'){
                   this.displayBtn = false
                   this.displayApproverBtn = false
                   this.tabApproveDispaly=false
                   this.activeName='an2Tab2'
                   this.selectApproveItem(this.activeName)
                   return;
                   
                 }
             }
             this.findNextNodeByIf(this.flowNo,startType,data)
   

             //获取下一个审批对象
        }).catch(err => {
         console.error(err)
      })


      
    },

    getCurrNoteItem(id){
      let _dataNode = { url: '/wf-work-node-item/selectNodeItem', params:  {data:id}}
         this.$store.dispatch('fmsCommon/actionTaskPost', _dataNode)
        .then(idata => {
           //绑定下一个节点
           this.slotBindData.currItem = idata
          
        }).catch(err => {
         console.error(err)
      })
    },



    //就按条件节点获取到下一个节点，该节点处需要通过编程实现
    findNextNodeByIf(flowNo,startType,doc,e=false){
         //若下一个节点存在多个节点 则需要实现选择计算
         //selectNextNodesByNode
      let script =null
      if( doc && doc.docScript)
          script = doc.docScript
      if(e){
        script = JSON.stringify(this.formData)
      }
      let _dataNode = { url: '/wf-work-node-item/selectNextNodesByNode', params:  {data:{formNo:flowNo,modelNo:this.tempDocNo,startType:startType,params:script}}}
         this.$store.dispatch('fmsCommon/actionTaskPost', _dataNode)
        .then(res => {
          // this.slotBindData.currItem //当前节点
          let idata = res.nextNodeItems
          this.slotBindData.currItem = res.currentNodeItem
          if(idata && idata.length && idata.length==1){
             this.getNextApproveObj(flowNo,startType,doc,e)
             return
          }
          let bizFunction = undefined
          if(this.slotBindData.currItem && this.slotBindData.currItem.nodeParams)
          {           
            bizFunction = eval("("+this.slotBindData.currItem.nodeParams+")") 
            this.slotBindData.func = bizFunction
          } 
          if(idata.length>1 && !(bizFunction && bizFunction.nodeFilter &&  typeof bizFunction.nodeFilter ==='function'))
          {
            this.$message.error("多子节点审批，请联系管理员维护下一个节点的逻辑判定")
                  return
          }
          if(this.slotBindData.currItem){
           if(bizFunction && bizFunction.nodeFilter &&  typeof bizFunction.nodeFilter ==='function'){
               let nextNode = undefined  
                let that = this
                let callbackCalled = false;
                nextNode =  bizFunction.nodeFilter.call(this,this.slotBindData,idata,(nn)=>{
                    callbackCalled = true
                    that.multipleNodeExec(nn,doc,script)
                })||undefined
                //回调函数并未执行
                if(!callbackCalled){

                  that.multipleNodeExec(nextNode,doc,script)
                }
            } 
        }
           //得到下一个节点的审批组，可以根据条件判断选择哪个节点审批
        }).catch(err => {
         console.error(err)
      })

    },
    multipleNodeExec(nextNode,doc,script){ 
              if(nextNode===undefined || nextNode===null || typeof nextNode==='string')
                {

                  this.$message.error("多子节点审批，请联系管理员维护下一个节点的逻辑判定")
                  return
                }
                if(nextNode && Array.isArray(nextNode) && nextNode.length!=1){
                  this.$message.error("多子节点审批，返回选择条件不能是数量大于1或为0的数组")
                  return
                }
                if(nextNode && Array.isArray(nextNode)){
                  nextNode = nextNode[0]
                  return
                }
              //若当前节点是条件节点继续判断条件满足
              //selectNextNodesByCondition
              if(nextNode.nodeType==='COND'){
                let _IdataNode = { url: '/wf-work-node-item/selectNextNodesByCondition', params:  {data:{cwWfWorkNodeItem:nextNode,params:script}}}
                this.$store.dispatch('fmsCommon/actionTaskPost', _IdataNode).then(mynode=>{
                  this.executeNextApproveUser(mynode,doc)
                  //绑定下一个节点
                  this.slotBindData.nextItem = mynode
                  //判断下一个节点是否是动态节点
                  if(mynode.nodeType=='DYNAMIC')
                      this.userOrgDisplay=true
                }).catch(err => {
                  console.error(err)
                })
              }else{             
                this.executeNextApproveUser(nextNode,doc)
                //绑定下一个节点
                this.slotBindData.nextItem = nextNode
                //判断下一个节点是否是动态节点
                if(nextNode.nodeType=='DYNAMIC')
                    this.userOrgDisplay=true
               }
    },
    getNextApproveObj(flowNo,startType,doc,e=false)
    {       
      let script =null
      if( doc && doc.docScript)
          script = doc.docScript
      if(e){
        script = JSON.stringify(this.formData)
      }
      let _dataNode = { url: '/wf-work-node-item/queryNextNode', params:  {data:{formNo:flowNo,modelNo:this.tempDocNo,startType:startType,params:script}}}
         this.$store.dispatch('fmsCommon/actionTaskPost', _dataNode)
        .then(idata => {
           this.executeNextApproveUser(idata,doc)
           //绑定下一个节点
           this.slotBindData.nextItem = idata
           //判断下一个节点是否是动态节点
           if(idata.nodeType=='DYNAMIC')
              this.userOrgDisplay=true
        }).catch(err => {
         console.error(err)
      })
    },
    executeNextApproveUser(data,doc){
      //判断下一个节点是都需要选择用户
      let script = eval("("+data.nodeParams+")")      
      if(script && script.customNextUser){
        this.displayNextUser = false
        this.displayGlobalNextUser=false
        return
      }
      //部门 
       let url = ''
       let params = {}
       if(data.approveRole=='USER' || data.approveRole ==null || data.approveRole=='' )
       {
        this.displayNextUser = false
        this.displayGlobalNextUser=false
        return;
      }
      if(data.nodeType==='LEADER' ||data.nodeType==='DEPT_LEADER' ){
        this.displayNextUser = false
        this.displayGlobalNextUser=false
        return;
      }
      if(doc && doc.reSubmit=='CURRENT'){
        this.displayNextUser = false
        this.displayGlobalNextUser=false
        return;
      }
      if(data.nodeType==='GROUP'){
        this.displayNextUser = false
      this.displayGlobalNextUser=false

      }else{

         this.displayNextUser = false
         this.displayGlobalNextUser=true

      }

      if(data.approveRole=='DEPT'){
         url='/bpm-user/guest/deptUser'
         params = {data:data.deptNo}
        if(data.deptNo==null || data.deptNo =='')
          {
            url='/bpm-user/guest/queryUsersByDeptUserId'
            params = {data:data.approveUser}
          }
    
      }
      if(data.approveRole=='USER')return;
      
      if(data.approveRole=='UGROUP'){
        url='/bpm-user/guest/queryUsersByUserGrp'
         params = {data:data.deptNo}
      }
      if(data.approveRole=='JOB'){
        if(data.nodeType==='GROUP'){
            return
          }
        url='/bpm-user/guest/selectByCurrUserDeptIdAndJobId'
        let deptId = undefined
        let user = this.getCurrentUser().userInfo
        if(user)
           deptId =user.deptId
         if(data.nodeType==='K_POINT_JOB'){
             deptId = data.deptNo
         } 
         params = {data:{jobId:data.jobId,deptId:deptId}}
      }
      let _data = { url: url, params: params}
      this.initSelect.nextUser=[]
      this.$store.dispatch('fmsCommon/actionAuthPost', _data)
        .then(data => {
          this.initSelect.nextUser = data.map(c => {
            return {
              label: `${c.realName}[${c.userName}]`,
              value: c.userName
            }
          })

          if(this.initSelect.nextUser && this.initSelect.nextUser.length==1){
            this.approvetabData[0].params.nextUser = this.initSelect.nextUser[0].value
            this.displayNextUser = false
            this.displayGlobalNextUser = false

          }
          else if(this.initSelect.nextUser && this.initSelect.nextUser.length>1){
            this.displayNextUser = true
            this.displayGlobalNextUser = true
          }
        }).catch(err => {
         console.error(err)
      })
    },
    initDocTempData(){
      let _data = { url: this.url.flowTempUri, params: {data:this.tempDocNo}}
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
            this.flowName = data.docName
            this.docInfo = data
        }).catch(err => {
         console.error(err)
      })
    },
    closePage(){
      this.$store.dispatch("tagsView/delView", this.$route)
      this.$router.go(-1)
    },
    getList(id) {
      const _data = { url: this.url.list, params: {data:id} }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.detaillist = data.filter(c=>c.approveUsername!==null&&c.approveUsername!==undefined)
          this.alreadyApproveList = data
          // this.total = data.total
          //this.listLoading = false
        }).catch(err => {
        console.error(err)
      })
      //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
    },
    selectOptions(){
      let _data = { url: '/wf-constant/approveOpinion', params: {}}
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.initSelect.approveOpinion = data.filter(c=>c.value!='START').map(c => {
            return {
              label: c.name,
              value: c.value
            }
          })
        }).catch(err => {
        console.error(err)
      })

       _data = { url: '/wf-constant/ReSubmits', params: {}}
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.initSelect.reSubmit = data.map(c => {
            return {
              label: c.name,
              value: c.value
            }
          })
        }).catch(err => {
        console.error(err)
      })

     _data = { url: '/wf-constant/ApproveRoles', params: {}}
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
    // reloadData(){
    //   this.dialogApprove = true
    // },
    getValueConvert(arr, value) {
              for (let v of arr) {
                  if (v.value == value) {
                      return v.label
                  }
              }
              return value
          },
    commonFilter(value, type) {
      if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
        return this.getValueConvert(this.initSelect[type], value)
      }
      if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
        return this.initSelect[type][value]
      }
      return value
    },
    approver(){


      // if(this.displayGlobalNextUser && (this.approvetabData[0].params.nextUser==undefined || this.approvetabData[0].params.nextUser==null || this.approvetabData[0].params.nextUser=='')){
      //     this.$message({
      //                   type: 'error',
      //                   message: '没有选择审批用户'
      //                 })
      //                 return;
      //   }
      let aparam = this.approvetabData[0].params
      if(aparam.approveOpinion == undefined || aparam.approveOpinion==null || aparam.approveOpinion=='')
        {
          this.$message({
                        type: 'error',
                        message: '审批意见不能为空'
                      })
           return
        }
        // aparam.nextUserName='',
        // aparam.nextUser='',
        // aparam.nextUserName='',
        let nextUser = aparam.nextUser

        let bizFunction = undefined
        
        if(this.slotBindData.currItem && this.slotBindData.currItem.nodeParams)
          {           
            bizFunction = eval("("+this.slotBindData.currItem.nodeParams+")") 
            this.slotBindData.func = bizFunction
          }      
          if(this.slotBindData.currItem){
           if(bizFunction && bizFunction.nodeIn &&  typeof bizFunction.nodeIn ==='function'){
                bizFunction.nodeIn.call(this,this.slotBindData)
           }
        }
      let approvelFlag = {isCall:false}  
      this.$emit('beforeApprove',{data:this.slotBindData,type:'approver',wfParams:aparam},(_form)=>{   
        approvelFlag.isCall = true
        aparam.nextUser = nextUser||aparam.nextUser
        let script = JSON.stringify(this.formData)
        let _data = { url: this.url.doApprove, params: {data:{docId:this.docId,nodeParams:script,nextNode:this.slotBindData.nextItem,...this.approvetabData[0].params}}}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$emit('submit',{data:this.slotBindData,type:'approver'});
            this.$emit('afterApprove',{data:this.slotBindData,resp:data,type:'approver'});
            if(this.slotBindData.currItem){
              if(bizFunction && bizFunction.nodeOut &&  typeof bizFunction.nodeOut ==='function'){
                    bizFunction.nodeOut.call(this,this.slotBindData)
              }
            }
            this.closePage()         
          }).catch(err => {
          console.error(err)
        })
      }); 
    },

    submit(){
        let script = JSON.stringify(this.formData)
        let dataParams = {
             docNo:this.flowNo,
             tempDocNo:this.tempDocNo,
             docScript: script,
             approveState: 'DOING',
             nextNode:this.slotBindData.nextItem
            //  nextUserName:'',
            //  nextUser:'',
            //  nextUserName:'',
        }
        if(this.displayGlobalNextUser && (this.approvetabData[0].params.nextUser==undefined || this.approvetabData[0].params.nextUser==null || this.approvetabData[0].params.nextUser=='')){
          this.$message({
                        type: 'error',
                        message: '没有选择审批用户'
                      })
                      return;
        }
        this.slotBindData.formData = dataParams
        let bizFunction = undefined
        if(this.slotBindData.currItem && this.slotBindData.currItem.nodeParams)
          {           
            bizFunction = eval("("+this.slotBindData.currItem.nodeParams+")") 
            this.slotBindData.func = bizFunction
          }      
          if(this.slotBindData.currItem){
           if(bizFunction && bizFunction.nodeIn &&  typeof bizFunction.nodeIn ==='function'){
                bizFunction.nodeIn.call(this,this.slotBindData)
           }
        }
        dataParams.nextUser = this.approvetabData[0].params.nextUser
        this.$emit('beforeCreate',{data:this.slotBindData,type:'submit',wfParams:dataParams},(_form,id)=>{
                  if(id){
                    dataParams.formId =id || null
                  }
                  dataParams.nextUser = this.approvetabData[0].params.nextUser || dataParams.nextUser
                  let _data = { url: this.url.submitUrl, params: {data:dataParams}}
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                    .then(data => {
                      this.flowNo=data.docNo
                      this.$message({
                          type: 'success',
                          message: '创建成功'
                        })  
                        this.$emit('submit',{data:this.slotBindData,type:'submit'});
                      // this.$router.push('/bpm/myform/index')   
                      this.$emit('afterApprove',{data:this.slotBindData,resp:data,type:'submit'});

                      if(this.slotBindData.currItem){
                        if(bizFunction && bizFunction.nodeOut &&  typeof bizFunction.nodeOut ==='function'){
                              bizFunction.nodeOut.call(this,this.slotBindData)
                        }
                      }
                      this.closePage()  
                    }).catch(err => {
                    console.error(err)
                  })
                });
    },

    save(){
        let script = JSON.stringify(this.formData)
        let dataParams = {
             docNo:this.flowNo,
             tempDocNo:this.tempDocNo,
             docScript: script,
             approveState: 'CREATE',
        }

        this.$emit('beforeCreate',{data:this.slotBindData,type:'save',wfParams:dataParams},(_form,id)=>{
                      if(id){
                        dataParams.formId = id || null
                      }
                      let _data = { url: this.url.createFrom, params: {data:dataParams}}
                      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                        .then(data => {
                          this.flowNo=data.docNo
                          this.$message({
                              type: 'success',
                              message: '创建成功'
                            })       
                            this.$emit('afterCreate',{data:this.slotBindData,resp:data,type:'save'});
                            this.$emit('submit',{data:this.slotBindData,type:'save'});
                        }).catch(err => {
                        console.error(err)
                      }) 
                });  
    },
    bindValue(){
      this.approvetabData.forEach(item=>{
        Object.assign(item.params, this.initData(item.formData))
      })
    },
    initData(arr) {
      const args = {}
      arr.map(c => {
        if (c.set) {
          args[c.field] = null
        }
      })
      return args
    },
  }
}
</script>

<style lang="scss" >

</style>
