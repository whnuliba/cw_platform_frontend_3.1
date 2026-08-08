<template>
    <div>
      <tabapproval @submit="submit" 
      :formData = defaultForm.params 
      :tempDoc="tempDocNo" 
      :formName ="$refs['defaultForm.params']" 
      :wfApproveDisplay="true" 
      @initFromData="initFromData"
      @initData="init"
      ref="myFlowForm"
      @beforeApprove="beforeApprove"
      @afterApprove="afterApprove"
      @beforeCreate="beforeCreate"
      @afterCreate="afterCreate"
      >
        <template  #flowForm="{flowData}">
            <div>
              <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="220px">
                <div v-for="(item) in cols" :key="item.id" style="display:inline">
                  <el-form-item
                    v-if="(display(item,flowData) || item.flowEdit)  && item.queryType==='input'"
                    :label="commonI18n(item)"
                    :prop="item.field"
                    label-width="150px"
                    :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
                  >
                    <!--:disabled="item.isEdit && item.disable"-->
                    <el-input v-model="defaultForm.params[item.field]"
                    :readonly = "readnoly(item,flowData)"
                    @input =" ()=>{ if(item.onInput && typeof item.onInput =='function') item.onInput(self,item,defaultForm.params,flowData)}"
                      :style="{...item.style}" suffix-icon="xxxx" />
                  </el-form-item>


                  <el-form-item
                    v-if="item.queryType==='text-userProp'"
                    :label="commonI18n(item)"
                    :prop="item.field"
                    label-width="150px"
                    :rules="[{ required: false, message: item.title+'不能为空', trigger: 'blur' }]"
                  >
                  <el-input v-model="defaultForm.params[item.field]"
                    :readonly = "readnoly(item,flowData)"
                    :value="convertUserData(item)"
                    @input =" ()=>{ if(item.onInput && typeof item.onInput =='function') item.onInput(self,item,defaultForm.params,flowData)}"
                      :style="{...item.style}"  suffix-icon="xxxx"/>
                  </el-form-item>

                  <el-form-item
                    v-if="(display(item,flowData) || item.flowEdit)  && item.queryType==='input-dept'"
                    :label="commonI18n(item)"
                    :prop="item.field"
                    label-width="150px"
                    :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
                  >
                    <!--:disabled="item.isEdit && item.disable"-->
                    <el-input v-model="defaultForm.params[item.field]"
                    :readonly = "readnoly(item,flowData)"
                    @input =" ()=>{ if(item.onInput && typeof item.onInput =='function') item.onInput(self,item,defaultForm.params,flowData)}"
                      :style="{...item.style}"  suffix-icon="xxxx"/>
                  </el-form-item>

                  <el-form-item
                    v-if="(display(item,flowData) || item.flowEdit)  && item.queryType==='input-org'"
                    :label="commonI18n(item)"
                    :prop="item.field"
                    label-width="150px"
                    :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
                  >
                    <!--:disabled="item.isEdit && item.disable"-->
                    <el-input v-model="defaultForm.params[item.field]"
                    :readonly = "readnoly(item,flowData)"
                    @input =" ()=>{ if(item.onInput && typeof item.onInput =='function') item.onInput(self,item,defaultForm.params,flowData)}"
                      :style="{...item.style}"  suffix-icon="xxxx"/>
                  </el-form-item>

                  <el-form-item
                    v-if="(display(item,flowData) || item.flowEdit)  && item.queryType==='textarea'"
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
                      :style="{...item.style}"
                    >
                    </el-input>
                    <!-- <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" /> -->
                  </el-form-item>

                  <el-form-item 
                label-width="150px"
                v-if=" (display(item,flowData) || item.flowEdit)&&(item.queryType==='filter-select')"
                :label="item.title"
                :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'change' }]">
                  <el-select 
                    :filter-method="(val) => { if(func.dataSelectFilter && typeof func.dataSelectFilter ==='function') {
                      return  methodFunc(func.dataSelectFilter,val,item)
                    }}" 
                    :filterable="true"
                    @change="(val)=> {if(func.changeSelect &&  typeof func.changeSelect ==='function') {
                      return methodFunc(func.changeSelect,val,item)
                    }}" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" placeholder="请选择"
                      :style="{...item.style}"
                    >
                    <el-option v-for="it in initSelect[item.field]"
                              :key="it.value"
                              :label="it.label"
                              :value="it.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                  <el-form-item
                    v-if="(display(item,flowData) || item.flowEdit) && item.queryType==='select'"
                    :label="commonI18n(item)"
                    label-width="150px"
                    :rules="[{ required: required(item,flowData), message: item.title+'不能为空', trigger: 'change' }]"
                  >
                    <el-select v-model="defaultForm.params[item.field]" 
                    @onchange = "(val) => onchange(item.onchange,val,flowData,item)"
                    :disabled = "disabled(item,flowData)"
                    placeholder="..." :style="{...item.style}" @change="$forceUpdate()">
                      <el-option
                        v-for="item in initSelect[item.field]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item 
                v-if=" (display(item,flowData) || item.flowEdit) &&(item.queryType==='multiSelect')"
                    :rules="[{ required: required(item,flowData), message: item.title+'不能为空', trigger: 'change' }]"
                    :label="commonI18n(item)" >
                    <!-- 换备件下拉 -->
                    <el-select v-model="defaultForm.params[item.field]" multiple placeholder="请选择"  
                    :style="{...item.style}"
                    @onchange = "(val) => onchange(item.onchange,val,flowData,item)"
                    :disabled = "disabled(item,flowData)" >
                        <el-option
                          v-for="item in initSelect[item.field]"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                          >
                        </el-option>
                      </el-select>
                </el-form-item>

                  <el-form-item v-if="(display(item,flowData) || item.flowEdit)  && item.queryType==='datetime'" :label="commonI18n(item)" :prop="item.field" label-width="150px">
                    <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" :style="{...item.style}" />
                  </el-form-item>
                </div>
              </el-form>
    <div  v-if="tableDisplay(table,flowData)">
      <div v-for="item in table.btn"  style="display: inline;">
        <el-button type="primary" class="filter-item" v-if="item.display && item.display(self,flowData)"  @click="() => btnOnclick(item.onclick,item,item.onclick)">
        {{item.label}}
       </el-button>
     </div>
    <el-table
      :data="defaultForm.params.items"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="item in table.column"
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
          <div v-if="tableEdit(table,flowData)">
              <el-input
                  style="width: 170px"
                  v-if="item.edit && item.queryType === 'input'"
                   v-model="row[item.field]"
                   @focus="()=>{if(item.onClick) item.onClick(row) }"
                />

            <el-select
              v-else-if="item.edit && item.queryType === 'select'"
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
            <div  v-else-if="item.queryType=='button'">
              <div v-for="btn in item.btn" style="display: inline;">
                <el-button  v-if="btn.display(self,flowData)" type="primary" size="small"   icon="el-icon-edit" @click="btn.onclick(self,row,defaultForm.params.items)">
                {{ btn.label }}
               </el-button>
              </div>
            </div>
            <span v-else>
                <span>{{ commonFilter(row[item.field], item.field) }}</span>
            </span>
          </div>
          <div v-else>
            <span >
                <span>{{ commonFilter(row[item.field], item.field) }}</span>
            </span>
          </div>
      </template>
      </el-table-column>
    </el-table>
      
        </div>
            </div>
        </template>
      </tabapproval>
    </div>
  </template>
  
  <script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import tabapproval from './components/tabapproval.vue'
  import common from '@/utils/common'
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
          self:this,
          tempDocNo:'',
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
             id: '',
             items:[]
            }
          },
          selectColumn: {
            origin: {},
            fields: [],
            colMap: []
          },
          func:{},
          $script:undefined,
          handler:undefined,
          selectViewCol: [],
          list: null,
          total: 0,
          userInfo:undefined,
          listLoading: false,
          listQuery: {
            current: 1,
            pageSize: 15
          },
          rowData:{},
          addcols:[],
          editcols:[],
          cols: [   

          ],
          table:{
            column:[]
          },
          globalData:undefined
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
    },
    created() {
         let userinfo = sessionStorage.getItem("sess_cuur_userinfo")
         if(userinfo){
            this.userInfo = JSON.parse(userinfo)          
         }
    },
    methods: {
      convertUserData(item){
        if(this.userInfo && item.userProp){
          if(this.defaultForm.params[item.field]&& this.defaultForm.params[item.field]!==null && this.defaultForm.params[item.field]!=='')
            return this.defaultForm.params[item.field]
          this.defaultForm.params[item.field]=this.userInfo[item.userProp]
          return this.userInfo[item.userProp]
        }
      },
      tableEdit(table,flow){   
        if(table && typeof table.tableEdit==='function'){
              return table.tableEdit(table,flow)
            }
          else {
            return false
          }  
      },
      tableDisplay(table,flow){

        if(table && typeof table.tableDisplay==='function'){
              return table.tableDisplay(table,flow)
            }
          else {
            return false
          }   
    },
      btnOnclick(callback,v1,v2){
        const self = this
        if(!this.defaultForm.params.items){
          this.$set(this.defaultForm.params,'items',[])
        }
        if(callback && typeof callback==='function')
          return callback(self,this.defaultForm.params.items,v1,v2)
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
     onchange(callback,v1,v2,v3){
        const self = this
        if(callback && typeof callback==='function')
          return callback(self,v1,v2,v3)
     }, 
     methodFunc(callback,v1,v2){
        const self = this
        if(callback && typeof callback==='function')
          return callback(self,v1,v2)
     },
     post(url,params,callback,errorBack){
      let _dataNode = { url: url, params: params}
         this.$store.dispatch('fmsCommon/action', _dataNode)
        .then(idata => {
           //绑定下一个节点
           if(callback && typeof callback==='function'){
            callback(data)
           }
        }).catch(err => {
          if(errorBack && typeof errorBack==='function')
             errorBack(err)
           else 
              console.error(err)
      })
     }, 
     beforeApprove(data,callback){
      if(callback && typeof callback==='function'){
        callback.call(this,data.formData)
      }
      if(this.handler && this.handler.beforeApprove && typeof this.handler.beforeApprove==='function')
      {
        this.handler.beforeApprove(this,data,this.globalData,callback)
      }
     },
     afterApprove(data){
      if(this.handler && this.handler.afterApprove && typeof this.handler.afterApprove==='function')
      {
        this.handler.afterApprove(this,data,this.globalData)
      }
     },

     beforeCreate(data,callback){
      if(callback && typeof callback==='function'){
        callback.call(this,data.formData)
      }
      if(this.handler && this.handler.beforeCreate && typeof this.handler.beforeCreate==='function')
      {
        this.handler.beforeCreate(this,data,this.globalData,callback)
      }
     },
     afterCreate(data){
      if(this.handler && this.handler.afterCreate && typeof this.handler.afterCreate==='function')
      {
        this.handler.afterCreate(this,data,this.globalData)
      }
     },
     init(callback){
      const _params =this.$route.params
          const fullpath =this.$route.fullPath
          let cpName = undefined
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
       
        let bizCode =  cpName = apArr[apArr.length-1];
        let bizType = apArr[apArr.length-2];
        if(_params.bizCode)
            bizCode = _params.bizCode
        if(_params.bizType)
            bizType = _params.bizType
        const _data = {url:'/page-conf/guest/biz-type-code',params:{data:{bizCode:bizCode,bizType:bizType}}}
         this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        .then(data => {
          if(!data)
            return

          let script = this.resloveScript(data[0].scripts)
          //获取模板
          this.tempDocNo =script.tempDocNo||bizCode
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
              if(c.flowEdit){
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

          this.$script=script
          this.flowSubmit = script.flowSubmit
          this.btn=script.btn
          this.url=script.url
          this.listQuery.current = script.current ||this.listQuery.current
          this.listQuery.pageSize = script.pageSize ||this.listQuery.pageSize
          this.page = script.page
          this.dispatch = script.dispatch
          this.globalData = script.globalData  
          this.table=script.table

          if(script && script.initSelect){
            for(let opt in script.initSelect){
              this.$set(this.initSelect,opt,script.initSelect[opt])
            }
          }
          if(script && script.method && typeof script.method==='object'){
            for(let func in script.method){
                 this.$set(this.func,func,script.method[func])
            }
          }
          this.handler = script.handler||undefined
          if(script && script.main && typeof main ==='function')
            script.main(this)
          if(callback && typeof callback==='function'){
              callback(this.tempDocNo)
          }

        })
          
      },
      display(item,flow){
        if(item.attr && item.attr.display && typeof item.attr.display==='function'){
              return item.attr.display(item,flow)
            }
          else {
            return false
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
      initFromData(flowData,fromData1,callback){
        this.$nextTick(()=>{
          if(callback && typeof callback==='function'){
              callback.call(this,fromData1)
            }
           this.defaultForm.params = fromData1
        })
      },
      initData(arr) {
           const args = {}
              arr.map(c => {
                if (c.flowEdit) {
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
  
  <style lang="less" scoped>

  </style>
  