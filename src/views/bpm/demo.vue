<template>
    <div>
      <tabapproval @submit="submit" 
      :formData = defaultForm.params 
      :tempDoc="tempDocNo" 
      :formName ="$refs['myForm']" 
      :wfApproveDisplay="true" 
      @initFromData="initFromData"
      @initData="init"
      @beforeApprove="beforeApprove"
      @beforeCreate="beforeCreate"
      
      >
        <template  #flowForm="{flowData}">
            <div>
              <el-form ref="myForm" :inline="true" :model="defaultForm.params" label-width="120px">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item
              v-if="item.set && item.queryType==='input'"
              :label="commonI18n(item)"
              :prop="item.field"
              label-width="150px"
              :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <!--:disabled="item.isEdit && item.disable"-->
              <el-input v-model="defaultForm.params[item.field]"
               :readonly = "readnoly(item,flowData)"
                style="width:180px;" />
            </el-form-item>
            <el-form-item
              v-if="item.set && item.queryType==='textarea'"
              :label="commonI18n(item)"
              :prop="item.field"
              label-width="150px"
              :rules="[{ required: required(item,flowData), message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <!--:disabled="item.isEdit && item.disable"-->
              <el-input
                type="textarea"
                :rows="1"
                :readonly = "readnoly(item,flowData)"
                v-model="defaultForm.params[item.field]"
                style="width:180px;"
              >
              </el-input>
              <!-- <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" /> -->
            </el-form-item>
            <el-form-item
              v-if="item.set && item.queryType==='select'"
              :label="commonI18n(item)"
              label-width="150px"
              :rules="[{ required: required(item,flowData), message: item.title+'不能为空', trigger: 'change' }]"
            >
              <el-select v-model="defaultForm.params[item.field]" 
              :disabled = "disabled(item,flowData)"
              placeholder="..." style="width:180px;" @change="$forceUpdate()">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='datetime'" :label="commonI18n(item)" :prop="item.field" label-width="150px">
              <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" style="width: 180px" />
            </el-form-item>



                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params))) && item.queryType === 'user'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="item.selectRange|| [300]"  v-model="defaultForm.params[item.field]" :disabled="item.disabled" :orgType="item.orgType||300"  :style="{width: '220px',...item.style}"
                     :initValue="defaultForm.params[item.field]!==undefined&& defaultForm.params[item.field]!==null?defaultForm.params[item.field].split(','):[]"
                     :radio="()=>{
                        return true
                     }"
                     @onChange="(result)=>{
                         if(item.queryType === 'user' && item.userChange && typeof item.userChange==='function'){
                            item.userChange.call(self,result,defaultForm.params,item)
                         }
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>

          </div>
  
        </el-form>
            </div>
        </template>
      </tabapproval>
    </div>
  </template>
  
  <script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import tabapproval from './components/tabapproval.vue'
  import CwUserDropdown from "@/components/Cw/CwUserDropdown";

  export default {
    name: 'flowDemo',
    directives: { elDragDialog },
    components: { tabapproval,CwUserDropdown },
    props: {
      items: {
        type: Array,
        default: function() {
          return []
        }
      },
      title: {
        type: String,
        default: 'vue'
      }
    },
    data() {
      const _initdata = {
          Schedulingobj:{
            codeUrl: '',
            orderNo: '',
          },
          finshobj:{
            decsisonState: '',
            id: '',
          },
          tempDocNo:'20231110000001',
          table_mark: 'ng-disposal',
          qrcodedialogVisible: false,
          dialogfinsh:false,
          self:this,
          dialogFormVisible: false,
                allowDisable: false,
          dialogSelectFieldVisible: false,
          queryParams: {
            requestData: { }
            },
          initSelect: {
            orderState: [],
             orderType: [],
            electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }],
            useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],
            factoryNo: []
          },
          url: {
              add: '/ng-disposal/add',
              del: '/ng-disposal/del',
              list: '/ng-disposal/items'
          },
          defaultForm: {
            row: {},
            params: {
             id: ''
            }
          },
          selectColumn: {
            origin: {},
            fields: [],
            colMap: []
          },
          selectViewCol: [],
          list: null,
          total: 0,
          listLoading: false,
          listQuery: {
            current: 1,
            pageSize: 15
          },
          rowData:{},
          addcols:[],
          editcols:[],
          wfParams:{
              nextUser:'',
              nextUserName:'',
              nextUserId:''
          },
          cols: [
            { field: 'PROJECT_CODE', title: '关联项目', minWidth: 150, align: "center", queryType: 'input', set: true, require: true, query: true, hide: false},
            { field: 'PRODUCT_CODE', title: '物料代码', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true, hide: false,disabled:false, },
            { field: 'PRODUCT_NAME', title: '物料名称', minWidth: 100, align: "center", queryType: 'input',PRODUCT_NAME:['dsCode','dsName'],selUri:'/bak-mes-task/dsconf/list',set: true, require: true, query: true, hide: false},
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 100, align: "center", queryType: 'daterange', set: true, require: true, query: false, hide: false},
            { field: 'PN_DSC', title: '物料描述', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'UNIT', title: '单位', minWidth: 100, align: "center", queryType: 'input', UNIT:['bizValue','bizValue'],selUri:'/bak-mes-task/codes/guest/list',set: true, require: true, query: false, hide: false },
            { field: 'UNIT1', title: '次要单位', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'DN', title: '图号', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'PM_TYPE', title: '采购类型', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'ABC_CATE', title: 'ABC分类', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'SP_PM_TYPE', title: '特殊采购类型', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'SPEC', title: '规格型号', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'IS_KEY', title: '是否关键件', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'IS_LOT', title: '是否批次管理', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'WH_NO', title: '仓库编号', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'WH_NAME', title: '仓库名称', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'MIN_PACK', title: '最小包装数量', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'PACK_SPEC', title: '包装容器规格', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'PULL_TYPE', title: '厂内拉动类型', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'SUPPLIER_NO', title: '供应商编码', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'LOT_NO', title: '批次信息', minWidth: 100, align: "center", queryType: 'textarea', set: true, require: true, query: false, hide: false },
            { field: 'SEQ_NO', title: '序列号', align: 'center', queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'DIST_TYPE', title: '配送方式', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'PERMISSION', title: '权限标识', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'QTY', title: '属性', minWidth: 100, align: "center", queryType: 'checkbox',TEST:[{label: '111',value:1},{label: '222',value:2}], set: false, require: true, query: false, hide: false },
            { field: 'ROW_NIO', title: '行号', minWidth: 100, align: "center", queryType: 'input',set: true, require: true, query: false, hide: false },
            { field: 'APPLY_USER', title: '申请人', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'ORDER_STATE', title: '下单状态', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'INVENTORY_STATE', title: '在库状态', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
        		{ field: 'SIGN_USER', title: '审批人', minWidth: 100, align: "center", queryType: 'user', set: true, require: true, query: false, hide: false,userChange:function(result,params,item){
                    this.wfParams.nextUser = result.code
                    this.wfParams.nextUserId = result.id
                    this.wfParams.nextUserName = result.name
                    params.SIGN_USER = result.id
            }},
          	{ field: 'PRICE', title: 'PRICE', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
   					{ field: 'STATUS', title: '状态', minWidth: 100, align: "center", queryType: 'switch', set: false, require: true, query: false, hide: false },
          ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
    },
    created() {
    },
    methods: {
      init(callback){
        
        if(callback && typeof callback==='function'){
            callback(this.tempDocNo)
        }
      },
      required(item,flow){
        if(item.require)
           {
            if(item.attr && item.attr.require && typeof item.attr.require==='function'){
              return item.attr.required(item,flow)
            }
            return item.require
           }
         else if(item.attr && item.attr.require && typeof item.attr.require==='function')  
         return item.attr.required(item,flow)
        else
           return false
      },
      disabled(item,flow){
        if(!flow.form)
          {
            if(item.attr && item.attr.disabled && typeof item.attr.disabled==='function'){
              return item.attr.disabled(item,flow)
            }
            return false
          }
          else if(item.attr && item.attr.disabled && typeof item.attr.disabled==='function')
          {
            return item.attr.disabled(item,flow)
          }
          else {
            return true
          }    
      },
      readnoly(item,flow){
          if(!flow.form)
          {
            if(item.attr && item.attr.readnoly && typeof item.attr.readnoly==='function'){
              return item.attr.readnoly(item,flow)
            }
            return false
          }
          else if(item.attr && item.attr.readnoly && typeof item.attr.readnoly==='function')
          {
            return item.attr.readnoly(item,flow)
          }
          else {
            return true
          }        
      },
        beforeApprove(data,callback){
          let {wfParams} = data
          if(wfParams.nextUser===null ||wfParams.nextUser===undefined||wfParams.nextUser===''){
            this.$message.error("没有设置审批用户")
            return
          }
          wfParams.nextUser = this.wfParams.nextUser 
          wfParams.nextUserId = this.wfParams.nextUserId 
          wfParams.nextUserName = this.wfParams.nextUserName
        if(callback && typeof callback==='function'){
          callback.call(this,data.formData)
        }
     },
      beforeCreate(args,callback){
        let {wfParams} = args
        console.log(wfParams)
        if(wfParams.nextUser===null ||wfParams.nextUser===undefined||wfParams.nextUser===''){
            this.$message.error("没有设置下一个审批用户")
            return
        }
        this.$refs['myForm'].validate((valid) => {
               if (valid) {                        
                let url = '/cw-pms-app/pms_pro_material/createBaseComponent';
                let _data = { url: url, params: {data:{data:this.defaultForm.params}}}
                this.$store.dispatch('fmsCommon/actionPost', _data)
                  .then(data => {
                    this.$message({
                        type: 'success',
                        message: 'Form Save Success'
                      })  
                    this.defaultForm.params.ID= data.ID

                    //处理流程参数
                 
                    wfParams.nextUser = this.wfParams.nextUser 
                    wfParams.nextUserId = this.wfParams.nextUserId 
                    wfParams.nextUserName = this.wfParams.nextUserName

                    if(callback && typeof callback==='function'){
                        callback.call(this,data,data.ID)
                    }
                  }).catch(err => {
                  console.error(err)
                })
              } else {
                this.$message({
                        type: 'error',
                        message: '输入数据不能为空'
                      })
              }
          })

     },
     initFromData(flowData,fromData1,callback){
       let url = '/cw-pms-app/pms_pro_material/queryById'
       console.log(123,flowData)
       let _data = { url: url, params: {data:flowData.formId}}
       this.$store.dispatch('fmsCommon/actionPost', _data)
          .then(data => {
              if(data && data.length){
                  let form = data[0]
                  this.$nextTick(()=>{
                    if(callback && typeof callback==='function'){
                      callback.call(this,form)
                    }
                    this.defaultForm.params = form
                })           
              }
          }).catch(err => {
          console.error(err)
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
    submit(data){
      console.log(1111,data)
    }
    },

  }
  </script>
  
  <style lang="scss" >
  
  </style>
  