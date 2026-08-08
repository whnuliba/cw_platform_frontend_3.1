<template>
    <div>
      <div style="width: 100%">
        <el-table ref="multipleTable" v-loading="loadLoading" :data="data" border fit highlight-current-row style="width: 100%"
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            @row-click = "rowClick"
            @select-all = "handleSelectAll"
            @row-dblclick="rowDbClick">
            <el-table-column v-if="boxSelect" type="selection" width="55" />
            <el-table-column v-if="showIndex" width="50px" :label="commonI18n('common.no')" align="center" fixed="left">
            <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
            </template>
            </el-table-column>
            <el-table-column v-for="item in cols" :key="item.field" :label="commonI18n(item)" :prop="item.field"
            :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
            <template slot-scope="scope" >
                <span v-if="item.queryType === 'input' && item.eidt === true">
                  <el-input v-model="scope.row[item.field]" :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false">
                  </el-input>   
                </span>
                <span v-else-if="item.queryType === 'select' && item.eidt === true" style="display :flex">
                  <el-select v-model="scope.row[item.field]" @change="(val)=>{
                    if(item.selectChange && typeof item.selectChange ==='function')
                    {
                      item.selectChange.call(self,val,self,scope.row)
                    }
                  }" :disabled="item.disabled ? item.disabled : false" 
                  placeholder="请选择" clearable>
                    <el-option v-for="it in initSelect[item.field]"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value">
                    </el-option>
                  </el-select>
                </span>
                <span v-else-if="item.queryType === 'time-picker' && item.eidt === true" style="display :flex">
                      <el-time-picker
                        v-model="scope.row[item.field]"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false" clearable/>
                </span>
            <!-- 根据其它字段值显示或隐藏input列 -->
                <span v-else-if="item.queryType === 'inputByValControl' && item.eidt === true && item.valControlShow && typeof item.valControlShow == 'function' && item.valControlShow.call(self,scope.row)">
                  <el-input v-model="scope.row[item.field]" :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false">
                  </el-input>   
                </span>
            <!-- 根据其它字段值显示或隐藏select列 -->
                <span v-else-if="item.queryType === 'selectByValControl' && item.eidt === true && item.valControlShow && typeof item.valControlShow == 'function' && item.valControlShow.call(self,scope.row)" style="display :flex">
                  <el-select v-model="scope.row[item.field]" @change="(val)=>{
                    if(item.selectChange && typeof item.selectChange ==='function')
                    {
                      item.selectChange.call(self,val,self,scope.row)
                    }
                  }" :disabled="item.disabled ? item.disabled : false" 
                  placeholder="请选择" clearable>
                    <el-option v-for="it in initSelect[item.field]"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value">
                    </el-option>
                  </el-select>
                </span>
            <!-- 根据其它字段值显示或隐藏time-picker列 -->
                <span v-else-if="item.queryType === 'timePickerByValControl' && item.eidt === true && item.valControlShow && typeof item.valControlShow == 'function' && item.valControlShow.call(self,scope.row)" style="display :flex">
                      <el-time-picker
                        v-model="scope.row[item.field]"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :disabled="item.disabled ? item.disabled : false" clearable/>
                </span>
                <span v-else-if="item.queryType === 'switchByNumber' && item.eidt === true && item.switchShow && typeof item.switchShow == 'function' && item.switchShow.call(self,scope,self)" :style="{display:'flex',justifyContent:item.justifyContent}">
                  <el-switch
                    v-model="scope.row[item.field]"
                    @change="(val) => {
                      if (item.selectChange && typeof item.selectChange === 'function') {
                          item.selectChange.call(self, val,self, scope.row);
                        }
                    }"
                    active-color="#13ce66"
                    inactive-color="#ff4949" :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false">
                  </el-switch>
                </span>
                <span v-else-if="item.queryType === 'switch' && item.eidt === true" :style="{display:'flex',justifyContent:item.justifyContent}">
                  <el-switch
                    v-model="scope.row[item.field]"
                    active-color="#13ce66"
                    inactive-color="#ff4949" :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false">
                  </el-switch>
                </span>
                <span  v-else-if="item.queryType === 'dropInput' && item.eidt === true" :style="{display:'flex'}">
                  <el-input  v-model="scope.row[item.field]" :disabled="item.disabled ? (typeof item.disabled === 'function' ? item.disabled(scope) : item.disabled) : false"/>  
                  <div class="logCondition" :style="{left:conDitionLeft,right:conDitionRight,display: conDitionDisplay}">
                    <el-form ref="form" :model="scope.row[item.field]" label-width="80px">
                      <el-form-item  v-for="(log,i) in item[item.field]" :key="'log'+i" :label="log.label">
                        <el-input v-model="scope.row[item.field]"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </span>
                <span v-else-if="item.queryType === 'text' && item.eidt === true" :style="{display:'flex'}">
                {{commonFilter(scope.row[item.field], item.field)}}
                </span>
            </template>
                <template slot="header" slot-scope="scope">
                {{commonI18n(item)}}
                <i v-if="item.showFilter" style="margin-left: 10px; cursor: pointer" class="el-icon-document-checked" @click="selectFields"  title="字段选择"/>
                </template>
            </el-table-column>
            <el-table-column v-for="item in operColumns" :key="item.field" :label="commonI18n(item)" :prop="item.field" :fixed="item.fixed"
            :width="item.width" :min-width="item.minWidth" v-if="!item.hide && operColumns && operColumns.length>0" :align="item.align" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
                {{ commonI18n(item) }}  
                <i v-if="item.showFilter" style="margin-left: 10px; cursor: pointer" class="el-icon-document-checked" @click="selectFields"  title="字段选择"/>
            </template>
            <template slot-scope="scope">
                <span  v-for="btn in item.buttons" v-ele-show="{ btnCode: btn.permCode}" >
                <el-button type="primary" v-if="(btn.show && typeof btn.show === 'function' && btn.show.call(self,scope.row))"  @click="(e)=>{
                 if(btn.callback && typeof btn.callback ==='function')
                  {
                    btn.callback.call(self,e,self,scope.row,boxSelectValue)
                  }
                }" :icon="btn.icon" :size="btn.size || 'mini'" style="margin-right: 10px;">
               {{commonI18n(btn.text) }}
          </el-button>
          </span>
            </template>
            </el-table-column>
        </el-table>
      </div>
      <pagination v-show="page.total > 0 && showPage" :total="page.total" 
        :page.sync="page.listQuery.current" :limit.sync="page.listQuery.pageSize" @pagination="loadData" />
     <!--     <CwDialog  title="编辑" :dialogVisible="dialogFormVisible"  width="50%" @handleClose="handleEditClose">
             <template slot="body">
              <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="150px">
                <div v-for="item in cols" :key="item.field" style="display: inline">
                  <el-form-item v-if="item.set && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
                    :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                    <el-input :show-password="item.password" v-model="defaultForm.params[item.field]" style="width: 220px" />
                  </el-form-item>
  
                  <el-form-item v-if="item.set && item.queryType === 'textarea'" :prop="item.field" :label="item.title" :rules="[
                        {
                          required: item.require,
                          message: item.title + '不能为空',
                          trigger: 'blur',
                        },
                      ]">
                      <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled" style="width: 220px" />
                    </el-form-item>
  
                  <el-form-item v-if="item.set && item.queryType === 'select'" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                    <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"
                      style="width: 220px">
                      <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
  
                  <el-form-item v-if="item.set && item.queryType === 'date'" :prop="item.field" :label="item.title" :rules="[
                        {
                          required: item.require,
                          message: item.title + '不能为空',
                          trigger: 'change',
                        },
                      ]">
                      <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
                        v-model="defaultForm.params[item.field]" type="date" placeholder="请选择" style="width: 150"
                        class="filter-item">
                      </el-date-picker>
                    </el-form-item>
  
                     <el-form-item v-if="item.set && item.queryType === 'switch'" :prop="item.field" :label="item.title" :rules="[
                        {
                          required: item.require,
                          message: item.title + '不能为空',
                          trigger: 'change',
                        },
                      ]">
                      <el-switch
                          v-model="defaultForm.params[item.field]"
                          active-color="#13ce66"
                          inactive-color="#ff4949" :disabled="item.disabled" style="width: 220px">
                          </el-switch>
                    </el-form-item>
                </div>
              </el-form>
             </template>
             <template slot="foot">
            <el-button @click="destory(false)">
              {{ $t("common.btn.cancel") }}</el-button>
            <el-button type="primary" v-if="defaultForm.params.ID === '' || defaultForm.params.ID === null"
              @click="save('defaultForm.params')">
              {{ $t("common.btn.save") }}</el-button>
            <el-button type="primary" v-if="defaultForm.params.ID != '' && defaultForm.params.ID != null"
              @click="submit('defaultForm.params')">
              {{ $t("common.btn.submit") }}</el-button>
            </template>
        </CwDialog>
       <CwDialog  title="字段选择" :dialogVisible="dialogSelectFieldVisible" width="700px" @handleClose="handleSelectClose">
            <template slot="body">
            <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">
            <template>
                <el-transfer v-model="selectColumn.fields" :titles="['源字段', '显示字段']" :data="selectColumn.colMap" />
            </template>
            </el-form>
            </template>
            <div slot="foot">
            <el-button  @click="saveSelectField()" plain>保存</el-button>
            </div>
        </CwDialog> -->
  
    </div>
  </template>
  
  <script>
    import CwButton from "@/components/Cw/CwButton"
    import waves from "@/directive/waves"; 
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from "@/components/Pagination" 
    import i18n from "@/lang";
    import CwDialog from "@/components/Cw/CwDialog"; 
    import exportExcel from "@/components/Excel/export-excel"; 
  
    export default {
      name: 'tableCommon',
      components: { Pagination,CwDialog,exportExcel,CwButton },
      directives: { waves, elDragDialog },
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '未启用',
            1: '启用'
          }
          return statusMap[status]
        }
      },
      props: {
        cols: {
          type:Array,
          default: function() {
            return [
        
              ];
          },
        },
        operColumns: {
          type: Array,
          default: function() {
            return []
          }
        },
        columns: {
          type: Array,
          default: function() {
          return []
         }
        },
        vueContext: {
          type: Object,
          default: function() {
            return {}
          }
        },
        customToolBar: {
          type: Object,
          default: function() {
          return {
            bottons: []
          }
         }
        },
        tableInitSelect: {
          type: Object,
          default: function() {
            return {}
          }
        },
        toolColumns: {
          type: Array,
          default: function() {
          return []
         }
        },
        bizCode: {
           type: String,
           default: ""
        },
        page: {
          type: Object,
          default: function() {
            return {
                  showPage: true,
                  total: 0,
                  listQuery: {
                    current: 1,
                    pageSize: 15
               },
               queryParams: {
                 requestData: {
                  tableName: '',
                  orderBy: '',
                  columns: [],
                  sqlWhere: [],
                }
              }
            }
          }
        },
        data: {
          type: Array,
          default: function() {
                        return []
                    }
        },
        showColOper: {
          type: Boolean,
          default: false
        },
        loadLoading: {
          type: Boolean,
          default: false
        },
        boxSelect: {
          type: Boolean,
          default: true
        },
        multipleSelect: {
          type: Boolean,
          default: false
        },
        showIndex: {
          type: Boolean,
          default: true
        }
      },
      data() {
        const _initdata = {
          rowSelected: 0,
          switchNo: 0,
          conDitionLeft:0,
          conDitionRight:0,
          conDitionDisplay: 'none',
          initRadioBox: {},
          initCheckBox: {},
          formInline: false,
          self: this,
          dialogFormVisible: false,
          scriptsVisible: false,
          dialogSelectFieldVisible: false,
          dialogExportVisible:false,
          selectColumn: {
            origin: {},
            fields: [],
            colMap: []
          },
          selectViewCol: [],
          dtsOfswitch: 'script_editer',
          scriptsEditer: '',
          scriptOps: {
            scriptValue: '',
            scriptId: ''
          },
          searchobj: {},
          matchobj: {},
          initSelect: {
            trayType: [],
            condition: [
              { label: "等于", value: "=" },
              { label: "不等于", value: "<>" },
              { label: "大于", value: ">" },
              { label: "大于等于", value: ">=" },
              { label: "小于", value: "<" },
              { label: "小于等于", value: "<=" },
              { label: "包含", value: "LIKE" },
              { label: "左包含", value: "LEFT JOIN" },
              { label: "右包含", value: "RIGHT JOIN" },
            ],
            column: [],
          },
          defaultForm: {
            row: {},
            params: {
              ID: '',
            },
            
          },
          filter:[],
          header:[],
          list: null,
          showPage: true,
          // cols: [],
          //operColumns:[],
          origin_tableData: [], //存储提交的过滤条件
          tableInfo:{
            roleField:[],
            table:{},
            tableCtrlScript:undefined
          },
          toolBar:{
            toolBarStyle:{},
             buttons:[
               
             ]
          },
          boxSelectValue:[],
          selData: [],
        }
       // Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      watch: {
        tableInitSelect: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.initSelect = {...newVal,...this.initSelect}
          }
        },
        deep: true
        },
      },
      created() {
        //console.log(this.data)
      },
     mounted(){
        if(this.columns && this.columns.length>0)
          {
           // this.cols = this.columns
            this.operColumns = this.toolColumns
          }
          else{
            // this.initRoleField()
          }
          this.$nextTick(() => {
            let tableEle = document.getElementById('dropInput'); //this.$refs.multipleTable\
            // if (tableEle) {
            //         console.log(tableEle,this.conDitionLeft, this.conDitionDisplay) 
            //         tableEle.addEventListener('contextmenu', (e) => {
            //           console.log(tableEle,this.conDitionLeft, this.conDitionDisplay) 
            //           e.preventDefault();
            //                   this.conDitionDisplay = "block"
            //                   this.conDitionLeft = e.pageX +'px'
            //                   this.conDitionRight = e.pageY+'px'
            //                   console.log(this.conDitionLeft, this.conDitionDisplay) 
            //                 })
            //                 }
          })    
      },
      methods: {
        handleFormClose() {
            this.dialogFormVisible = false;
        },
        init(script){
          this.$emit('init',script);
        },
        handleReset(){ 
          this.$refs.sqlSearch.reset();     
          // this.$emit('handleReset')   
        },
        handleUpdate(e,self,row,boxSelectValue) {
          this.$emit('handleUpdate',e,self,row,boxSelectValue) 
        },
        handleDelete(e,self,row,boxSelectValue,url){
          if(row==undefined || row==null)
           {
           this.$message({
                type: 'error',
                message: '没有选择行信息'
              })
              return
           }
          this.$emit('handleDelete',e,self,row,boxSelectValue,url)   
        },
        rowDbClick(row, column, event){
          // this.$emit('handleRowDbClick',row, column, event)   
        },
        rowClick(row, column, event){
          this.handleSelect(null,row)
          if(this.multipleSelect){
            this.$refs.multipleTable.toggleRowSelection(row)
          }
          this.$emit('handleRowClick',row, column, event)
        },
        handleSelectAll(selection){
          if(!this.multipleSelect)
            this.$refs.multipleTable.clearSelection()
        },
        handleSelect(selection, row){
          this.rowSelected = row
          if(this.multipleSelect)
            return
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(row);
        },
        handleSelectionChange(selection) {
          this.boxSelectValue = selection
        },
  
        initRoleField(){
            //抓取表信息,并获取到脚本
            const bizCode =this.bizCode
            const _data = { url: '/field-role/query-field', params: {data:bizCode} }
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                  const roleField = data
                  if(roleField && roleField.length){
                    this.tableInfo.roleField=roleField
                    this.initTableInfo(roleField[0]['TABLE_ID'])
                  }
              }).catch(err => {
                console.error(err)
              })
        },
        initTableInfo(id){
          const _data = { url: '/dyn-table/queryTableById', params: {data:id} }
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                 if(!data)
                   return ;
                this.tableInfo.table=data[0]
                this.handlerTableInfo(data[0])
              }).catch(err => {
                console.error(err)
              })
          },

          initSelOptionData(uri,selParamArr,selArrData) {
              let pageParams = { current:1,pageSize: 1000,requestData: {} };
              const _data = {url: uri, params: pageParams}
              this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                data.data.forEach(item => {
                  selArrData.push({
                    label: item[selParamArr[0]],
                    value: item[selParamArr[1]],
                  })
                })
              },(error)=>{
                 console.error(error)
              })   
          },
          handlerTableInfo(table){
            const tableScript = eval("("+table.CTRL_SCRIPT+")")
            tableScript.cols.forEach(item => {
              if (item.queryType === 'select') {
                if(item.selUri) {
                  let selArrData = []
                  this.initSelOptionData(item.selUri,item[item.field],selArrData)
                  this.initSelect[item.field] = selArrData;
                } else if(item.jsonSelData){
                  this.initSelect[item.field] = item[item.field]
                }  
                
              } else if (item.queryType === 'checkbox') {
                this.initCheckBox[item.field] = item[item.field]
              } else if (item.queryType === 'radio') {
                this.initRadioBox[item.field] = item[item.field]
              }
            })
            this.init(tableScript)
            this.tableInfo.tableCtrlScript =tableScript 
            const roleColumn = this.tableInfo.roleField.map(item=>item.COLUMN_NAME)
            this.cols = tableScript.cols.filter(item => {
               return roleColumn.indexOf(item.field)>=0
            })

            let columns = []
            let head = []
            this.cols.forEach(c=>{
              if (c.set) {
                this.$set(this.defaultForm.params,c.field,undefined)
               }
               columns.push(c.field)
               head.push(c.title)
            })
            
            this.page.queryParams.columns = columns
            this.filter = columns
            this.header = head
            this.operColumn = tableScript.operColumn
            this.operColumns = tableScript.toolColumns
            if(this.customToolBar && this.customToolBar.buttons && this.customToolBar.buttons.length)
              {
                this.toolBar = this.customToolBar
              }
            else if (tableScript.customToolBar){
              this.toolBar = tableScript.customToolBar
            }
            // form表单配置项
            if (tableScript.formConfig){
                this.formInline = tableScript.formConfig.inline
            }
            const page = tableScript.page || this.page
            this.showPage = page.showPage||this.showPage
            this.listQuery = page.listQuery||this.listQuery
            this.loadData()
          },
        initCustomVol(callback) {
          const customColumn = { mark: this.bizCode, userName: sessionStorage.getItem('userInfo') }
          const _data = { url: '/custom-item/guest/query', params: customColumn }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              if (callback && typeof callback === 'function') {
                callback(data)
              }
            }).catch(err => {
            console.error(err)
          }).finally(() => {
  
          })
        },
        selectFields() {
          this.dialogSelectFieldVisible = true
          this.initCustomVol((data) => {
            this.selectColumn.colMap = []
            this.selectColumn.fields = []
            this.selectColumn.origin = {}
            this.selectColumn.fields = data.map(c => c.item)
            this.cols.forEach(item => {
              this.selectColumn.origin[item.field] = item.title
              this.selectColumn.colMap.push({
                key: item.field,
                label: item.title,
                disabled: false
              })
            })
          })
        },
        saveSelectField() {
            const fields = {}
            const arr = []
            this.selectViewCol.length = 1
            this.selectColumn.fields.forEach(item => {
            if (this.selectColumn.origin[item]) {
                fields[item] = this.selectColumn.origin[item]
                arr.push({ item: item })
                this.selectViewCol.push(item)
            }
            })
    
            if (this.selectColumn.fields.length == 0) {
            this.$message({
                type: 'info',
                message: '没有选择字段'
            })
            return
            }
    
            const customColumn = { mark: this.bizCode, userName: sessionStorage.getItem('userInfo'), items: arr }
            const _data = { url: '/custom-item/guest/save', params: customColumn }
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
                this.$message({
                type: 'success',
                message: 'change success!=>' + data
                })
                this.dialogSelectFieldVisible = false
                this.cols.forEach(item => {
                if (this.selectViewCol.indexOf(item.field) >= 0) {
                    item.hide = false
                } else {
                    item.hide = true
                }
                })
                // this.query()
            }).catch(err => {
            console.error(err)
            }).finally(() => {
    
            })
      },
  
        // 表格内查询按钮的提交回调(json脚本配置时使用)
        fieldFormQuery() {
          this.page.queryParams.requestData.sqlWhere = this.$refs.sqlSearch.query().sqlWhere;
          this.origin_tableData = JSON.parse(JSON.stringify(this.$refs.sqlSearch.query().sqlWhere))
          this.query()
        },
        // 自定义字段搜索过滤dialog提交
        fieldFilterSubmit(arr) {
          this.cols.map(item => {
                item.query = false;
                return item;
          })
          let aa = [...this.cols];
          let newCol = aa.map(item => {
              arr.forEach(a => {
                  if (a.column === item.field) {
                      item.query = true;
                  }
              })
              return item;
          })
          this.cols = newCol;
          this.keyC = !this.keyC
          this.dialogFillterFieldColumnVisible = false;
        },
        handleSelectClose(){
          this.dialogSelectFieldVisible = false
        },

        handleEditClose(){
          this.dialogFormVisible = false
        },
        handleClose(done) {
          this.$confirm(this.$t('common.btn.sureClose'))
            .then(_ => {
              done();
            })
            .catch(_ => { });
        },

        initData(arr) {
          let args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
          return args
        },
        commonFilter(value, type) {
          if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
            return this.getValueConvert(this.initSelect[type], value)
          }
          if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
            return this.initSelect[type][value]
          }
          return value
        },
        loadData(page){
             this.$emit('loadData',page);
        },
        getValueConvert(arr, value) {
          for (let v of arr) {
            if (v.value == value) {
              return v.label
            }
          }
          return value
        },
        destory(hide = false) {
          this.dialogFormVisible = hide
          for (let p in this.defaultForm.params) {
            if (this.defaultForm.params.hasOwnProperty(p)) {
              this.defaultForm.params[p] = ''
            }
          }
        },
        add() {
          this.destory(true)
        },
        showDetails(row, column) {
        },
        edit(row) {
         if(row==undefined || row==null)
           {
           this.$message({
                type: 'error',
                message: '没有选择行信息'
              })
              return
           }
          this.dialogFormVisible = true
          for (let p in this.defaultForm.params) {
            if (this.defaultForm.params.hasOwnProperty(p)) {
              this.defaultForm.params[p] = row[p]
            }
          }
  
        },
        submit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$emit('handleAdd','update',this.defaultForm.params,(success)=>{
                this.dialogFormVisible = false
                this.query()
              },(error)=>{
                console.error(error)
              },(complete)=>{
                this.destory()
              });
            } else {
              this.$message({
                type: 'error',
                message: '输入数据不能为空'
              });
              this.destory()
            }
          });
        },
        query() {
          this.page.listQuery.current = 1
          this.loadData()
        },
        reset() {
          this.handleReset()
        },

        save(formName) {
          this.defaultForm.row = {}
          this.defaultForm.params.ID = ''
          this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$emit('handleAdd','add',this.defaultForm.params,(success)=>{
                this.dialogFormVisible = false
                this.query()
              },(error)=>{
                console.error(error)
              },(complete)=>{
                this.destory()
              });
            } else {
              this.$message({
                type: 'error',
                message: '输入数据不能为空'
              });
              this.destory()
            }
          });
        },
        dele({ $index, row }) {
          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
            const _data = { url: '/data-base/deleteById', params: { data: row.ID } }
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                //this.list.splice($index, 1)
                this.getList();
                this.$message({
                  type: 'success',
                  message: 'delete success!'
                });
              }).catch(err => {
                console.error(err)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'cancel delete'
            });
          })
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    .logCondition{
      position: absolute;
      width:200px;
      height:200px;
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
  
    ::v-deep .el-input-group__append {
      width: 18px;
      border: 1px solid #0370AA;
      border-left: none;
      background-color: white;
    }
  
    .input-with-select {}
  
    .dropdownicon {
      display: inline-block;
      height: 28px;
      border: 1px solid #0370AA;
      border-left: none;
      border-radius: 0 3px 3px 0;
      line-height: 28px;
      margin-right: 10px;
      padding: 0 10px;
    }
  
    ::v-deep .el-form--inline .el-form-item {
      margin-right: 0;
    }
  
    ::v-deep .el-input__inner:hover {
      border: 1px solid #0370AA;
    }
  
    .dropdownicon:hover {
      /* border: 1px solid #DCDFE6; */
      /* border-left: none; */
      cursor: pointer;
    }
    .cwtable-tool-bar{
      width: 100%;
      min-height: 40px;
      padding: 5px;
     /* background: #0370AA*/
    }
  </style>