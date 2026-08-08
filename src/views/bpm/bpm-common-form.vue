<template>
    <div>
      <tabapproval @submit="submit" 
      :formData = defaultForm.params 
      :tempDocNo="'111'" 
      :formName ="$refs['defaultForm.params']" 
      :wfApproveDisplay="true" 
      @initFromData="initFromData"
      
      >
        <template  #flowForm="{flowData}">
            <div>
              <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
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

  export default {
    directives: { elDragDialog },
    components: { tabapproval },
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
          table_mark: 'ng-disposal',
          qrcodedialogVisible: false,
          dialogfinsh:false,
          dialogFormVisible: false,
                allowDisable: false,
          dialogSelectFieldVisible: false,
          queryParams: {
            requestData: { }
            },
          flowSubmit:undefined,   
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
          cols: [   

          ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
    },
    created() {
        const _params =this.$route.params
      const _data = {url:'/page-conf/guest/biz-type-code',params:{data:_params}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
        if(!data)
          return
         let script = this.resloveScript(data[0].scripts)

         if(script==undefined){
           this.$message({
             type:"warin",
             message: '脚本不存在'
           })
           return
         }
         this.cols = script.cols
         //Object.assign(this.defaultForm.params,this.initData(this.cols))

         this.cols.map(c=>{
            if(c.set){
              this.$set(this.defaultForm.params,c.field,undefined)
            }
          })
         
         this.cols.forEach(c=>{
            if(c.queryType && c.queryType=="select"){
                if(script.initConstant && script.initConstant[c.field]){
                    script.initConstant[c.field](this,c,_params)
                }
            }
         })
         this.flowSubmit = script.flowSubmit
         this.btn=script.btn
         this.url=script.url
         this.listQuery.current = script.current ||this.listQuery.current
         this.listQuery.pageSize = script.pageSize ||this.listQuery.pageSize
         this.page = script.page
         this.dispatch = script.dispatch     
        // this.selectOptions()
       }).catch(err => {
          console.error(err)
       })
    },
    methods: {
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
      initFromData(flowData,fromData1){
        this.$nextTick(()=>{
            this.defaultForm.params = fromData1
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
        if(this.flowSubmit && typeof this.flowSubmit ==='function')
            this.flowSubmit(data)
    }
    },

  }
  </script>
  
  <style lang="scss" >
  
  </style>
  