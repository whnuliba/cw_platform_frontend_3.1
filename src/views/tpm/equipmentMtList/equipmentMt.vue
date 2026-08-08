<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="commonI18n(item)"
                     :value="item.value" />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
      </div>
      <el-button type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ commonFilter(row[item.field],item.field) }}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="160">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }}
          <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <!-- <el-button type="warning" v-ele-show="{btnCode:'equipment_mt_list_edit'}" v-if="scope.row.disposalState != 106"  size="small" @click="edit(scope.row)">
            {{ "完成" }}
          </el-button> -->
          <el-button size="mini" type="primary"  :disabled="scope.row.status==2" @click="edit(scope.row)" >编辑</el-button>
          <el-button size="mini" type="primary" :disabled="scope.row.status==1"  @click="views(scope.row)" >预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if=" item.set  &&(item.queryType==='input')"
                        :label="commonI18n(item)"
                        :prop="item.field"
                        label-width="120px"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item 
          v-if="  item.set &&(item.queryType==='filter-select')"
           :label="item.title"
          :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'change' }]">
            <el-select :filter-method="(val) => {return dataSelectFilter(val, item)}" :filterable="true" @change="(val)=>changeSelect(val,item)" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" placeholder="请选择" style="width:180px;">
              <el-option v-for="it in initSelect[item.field]"
                         :key="it.value"
                         :label="it.label"
                         :value="it.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
                        v-if=" item.set &&(item.queryType==='select')"
                        :label="commonI18n(item)"
                        label-width="120px"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]">
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." @change="(val)=>selectUpdate(val,item.field)" style="width:180px;">
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item 
          v-if=" item.set &&(item.queryType==='multiSelect')"
          :label="commonI18n(item)" :prop="item.field">
              <!-- 换备件下拉 -->
              <el-select v-model="defaultForm.params[item.field]" multiple placeholder="请选择" >
                  <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
          </el-form-item>
          <el-form-item 
          v-if=" item.set &&(item.queryType==='datetime')"
          :label="commonI18n(item)" :prop="item.field">
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" v-model="defaultForm.params[item.field]" type="datetime" :placeholder="commonI18n(item)" style="width: 180px"> </el-date-picker>
          </el-form-item>
          <el-form-item 
          v-if="  item.set && (item.queryType==='date')"
           :label="commonI18n(item)" :prop="item.field">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly" v-model="defaultForm.params[item.field]" type="date" :placeholder="commonI18n(item)" style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="!tableRow.status || tableRow.status!=2" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="!tableRow.status || tableRow.status!=2" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer v-model="selectColumn.fields"
                       :titles="['源字段', '目标字段']"
                       :data="selectColumn.colMap" />
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang'
  export default {
    name: 'equipmentMt',
    components: { Pagination },
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
    data() {
      const _initdata = {
        table_mark: 'mdm_wkc_lst',
        dialogFormVisible: false,
        allowDisable: false,
        dialogSelectFieldVisible: false,
        dialogCalendarVisible: false,
        rightmodalvisiable: undefined,
        rangeData: [],
        value1: new Date(),
        url: {
          add: '/equipmentMtList/add',
          del: '/equipmentMtList/del',
          list: '/equipmentMtList/list',
          finish: '/equipmentMtList/finsh-equipmentMtList'
        },
        queryParams: {
          requestData: {}
        },
        initSelect: {
          useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
          isChangePart: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
          processSure: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
          disposalState: [],
          deviceNo:[], 
          partNo:[],
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
            deviceNo:'',
          }
        },
        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        selectViewCol: [],
        possessioncalendarData: [],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },

        bizType:'',
          bizCode:'',
          viewUrl:'',

        cols: [
          { field: 'deviceNo', title: '设备编码', align: 'left', query: true, queryType: 'input', editReadonly: true, set: true, require: true },
          { field: 'isChangePart', title: '是否更换备件', align: 'left', query: false, queryType: 'select', set: true, require: false },
          { field: 'psersion', title: '报警处理人员', align: 'left', query: false, queryType: 'input', editReadonly: false, set: true, require: false },
          { field: 'disposalState', title: '处理状态', align: 'left', query: false, queryType: 'input', set: false, require: false },
          { field: 'processSure', title: '工序确认状态', align: 'left', query: false, queryType: 'select', set: true, require: false },
          { field: 'disposalWay', title: '故障解决办法', align: 'left', query: false, queryType: 'input', set: true, require: true },
          { field: 'reason', title: '故障原因', align: 'left', query: false, queryType: 'input', set: true, require: true },
          { field: 'mtStartTime', title: '维修发起时间', align: 'center', width: '145px', queryType: 'datetime', editReadonly: true, set: true, require: false },
          { field: 'mtType', title: '维修发起类型', align: 'center', width: '145px', queryType: 'input', set: true, require: false },
          { field: 'extId', title: '发起源ID', align: 'center', width: '145px', queryType: 'input', editReadonly: true, set: true, require: false, hide: true },
          { field: 'extType', title: '发起类型', align: 'center', width: '145px', queryType: 'input', editReadonly: true, set: true, require: false },
          { field: 'completeTime', title: '完成时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
          { field: 'status', title: '状态', align: 'left', width: '80px', queryType: 'input', set: false, require: false },
          { field: 'createTime', title: '创建时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
          { field: 'partNo', title: '备件选择', align: 'left', query: false, queryType: 'multiSelect', set: true, require: true },

        ],
        colsForm: [
          { field: 'deviceNo', title: '设备编码', align: 'left', query: true, queryType: 'filter-select', editReadonly: true, set: true, require: true, add:true },
          { field: 'isChangePart', title: '是否更换备件', align: 'left', query: false, queryType: 'select', set: true, require: false },
          { field: 'psersion', title: '报警处理人员', align: 'left', query: false, queryType: 'input', editReadonly: false, set: true, require: false },
          { field: 'disposalState', title: '处理状态', align: 'left', query: false, queryType: 'input', set: false, require: false },
          { field: 'processSure', title: '工序确认状态', align: 'left', query: false, queryType: 'select', set: true, require: false },
          { field: 'disposalWay', title: '故障解决办法', align: 'left', query: false, queryType: 'input', set: true, require: true },
          { field: 'reason', title: '故障原因', align: 'left', query: false, queryType: 'input', set: true, require: true },
          { field: 'mtStartTime', title: '维修发起时间', align: 'center', width: '145px', queryType: 'datetime', editReadonly: true, set: true, require: false, add:true },
          { field: 'mtType', title: '维修发起类型', align: 'center', width: '145px', queryType: 'input', set: true, require: false },
          { field: 'extId', title: '发起源ID', align: 'center', width: '145px', queryType: 'input', editReadonly: true,set: true, require: false,hide:true },
          { field: 'extType', title: '发起类型', align: 'center', width: '145px', queryType: 'input', editReadonly: true, set: true, require: false },
          { field: 'completeTime', title: '完成时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
          { field: 'status', title: '状态', align: 'left', width: '80px', queryType: 'input', set: false, require: false },
          { field: 'createTime', title: '创建时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
          { field: 'partNo', title: '备件选择', align: 'left', query: false, queryType: 'multiSele', set: true, require: true },
        ],
        partChangeShow: false,
        tableRow:"",
        partNoData:[],
        partNos: []
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.initCustomVol(data => {
        if (data && data.length > 0) {
          const fds = data.map(c => c.item)
          this.cols.forEach(item => {
            if (fds.indexOf(item.field) >= 0) {
              item.hide = false
            } else {
              item.hide = true
            }
          })
        }
      })
      this.selectOptions()
      this.handlerRouteParams()
    },
    methods: {
      views(row){
      
        this.$router.push({
                  name: this.bizCode,
                  params: {bizType: this.bizType,bizCode:this.bizCode,  formFlowData:{docId:row.id,sourceId:row.id,sourceData:row,sourceType: 'EXT'} },
                  });
      },
      handlerRouteParams(callback){
          const fullpath =this.$route.fullPath
          let cpName = undefined
          let cp = fullpath
          if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
          let apArr = cp.split("/");
          if (!apArr.length || apArr.length<3) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          }
        let bizCode =  cpName = apArr[apArr.length-1];
        let bizType = apArr[apArr.length-2];
        this.bizType=bizType
        this.bizCode=bizCode
        const _data = {url:'/page-conf/guest/biz-type-code',params:{data:{bizCode:bizCode,bizType:bizType}}}
         this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        .then(data => {
          if(!data)
            return

          let script = this.resloveScript(data[0].scripts)
          //获取模板
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
          this.viewUrl =  script.viewUrl||this.viewUrl
          if(script.initSelect)  
              this.initSelect = {...this.initSelect,...script.initSelect}
          if(script.selectOptions && typeof script.selectOptions==='function'){
              script.selectOption(this)
          }
          if(script && script.main && typeof main ==='function')
            script.main(this)  
        if(callback && typeof callback==='function'){
            callback()
        }
        this.getList()
        })
        },

      dataSelectFilter(val,item){
         let field = item.field
         if(val && field==='deviceNo'){
          const _data2 = { url: '/equipmentMain/query-eqm-lst',params: {data: val}}
            this.$store.dispatch('fmsCommon/actionTpmPost', _data2)
            .then(data => {
             // this.orderNoData = data
              this.initSelect['deviceNo'] = data.map(c=>{
                return {
                  label:c.deviceName+'|'+c.deviceNo,
                  value:c.deviceNo+"|"+c.deviceName+"|"+c.id
                }
              })
              }).catch(err => {
                console.error(err)
          })
         }
      },
      changeSelect(val,item){
         console.log(val)
        let field = item.field
         if(val && field && field==='deviceNo'){
            let did = val.split('|')
            this.defaultForm.params['deviceNo'] = did[0]
            this.defaultForm.params['deviceName'] = did[1]
            this.defaultForm.params['eqpName']= did[1]
            let id = did[2]
            const _data2 = { url: '/equipmentComponent/guest/get-equipmentComponent',params: {data: id}}
            this.$store.dispatch('fmsCommon/actionTpmPost', _data2)
            .then(data => {
  
             // this.orderNoData = data
              this.initSelect['partNo'] = data.map(c=>{
                return {
                  label:c.compName+'|'+c.compNo,
                  value:c.compNo+'|'+c.compName
                 }
               })

               if(data.length==0){
                this.defaultForm.params['partNo'] = ''
                this.defaultForm.params['partName'] =''
                this.initSelect['partNo']=[]
                this.initSelect['partNo'].push({
                  label:`${did[1]}|${did[0]}`,
                  value:`${did[0]}|${did[1]}`
                })
              }

              }).catch(err => {
                console.error(err)
          })
         }
         if(val  && field && field==='partNo' ){
          let did = val.split('|')
            this.defaultForm.params['partNo'] = did[0]
            this.defaultForm.params['partName'] = did[1]
         }
         this.$forceUpdate()
      },
      // 完成表单换备件下拉框回调
      selectUpdate(val, val1) {
        if (val1 === 'isChangePart'){
          switch (val) {
            case '1':
              this.partChangeShow = true;
              const _data = { url: '/equipmentMtPart/guest/get-equipmentMtPartByMtList', params: { data: this.tableRow } }
              this.$store.dispatch('fmsCommon/actionTpmPost', _data)
                .then(data => {
                  this.$message({
                    type: 'success',
                    message: 'change success'
                  });
                  this.partNos = data.map(item => {
                    item = { value: item.partNo };
                    return item;
                  });
                }).catch(err => {
                  console.error(err)
                })
              return;
            case '0':
              this.partChangeShow = false;
              return;
            default:
              break;
          }
        }     
      },
      rightmodalleave() {
        this.rightmodalvisiable = null;
      },
      rightClick(date) {
        this.rightmodalvisiable = null;
        if (this.allcalendarData.includes(date)) {
          this.rightmodalvisiable = date
        }
      },
      initCustomVol(callback) {
        const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo') }
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
        // this.currScripts.cols.forEach(item=>{
        //    if(item.export){
        //      fields[item.field] = item.title
        //    }
        // })
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

        const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo'), items: arr }
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
      initData(arr) {
        const args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
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
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: this.url.list, params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionTpmPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
            console.error(err)
          })
        //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
        //       console.log(data)
        //   })
      },

      getValueConvert(arr, value) {
        for (const v of arr) {
          if (v.value == value) {
            return v.label
          }
        }
        return value
      },
      destory(hide = false) {
        this.dialogFormVisible = hide
        for (const p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }

      },
      add() {
        this.allowDisable = false
        this.destory(true)
      },
      showDetails(row, column) {
      },
      edit(row) {
        this.dialogFormVisible = true
        this.allowDisable = true
        this.tableRow = row

        for (const p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = row[p]
          }
        }
      },
      submit(formName) {
        let _data = {};
        this.defaultForm.params.status=2
        if(this.defaultForm.params.isChangePart == '1') {
            _data = {
                    url: this.url.submit, params: {
                        data: {
                          data: this.defaultForm.params,
                          partNos: this.partNoData
                        }
                      }
                    }
        } else {
            _data = {
                url: this.url.submit, params: {
                  data: {
                     data: this.defaultForm.params
                  }
                }
          }
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.$store.dispatch('fmsCommon/actionTpmPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                })
                this.dialogFormVisible = false
                this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            })
            this.destory()
          }
        })
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (const p in this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      selectOptions() {

        let _data = { url: '/device-constant/guest/disponsal-states', params: {} }
        this.$store.dispatch('fmsCommon/actionTpmPost', _data)
          .then(data => {
            this.initSelect.disposalState = data.map(c => {
              return {
                label: c.name,
                value: c.value
              }
            })
          }).catch(err => {
            console.error(err)
          })
      },
      save(formName) {
        //this.defaultForm.row = {}
        this.defaultForm.params.status=1
        const _data = { url: this.url.submit, params: { data: {data: this.defaultForm.params}}}
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionTpmPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                })
                this.dialogFormVisible = false
                this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            })
            this.destory()
          }
        })
      },
      del(index, row) {
        this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
          confirmButtonText: i18n.t('common.btn.ok'),
          cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          const _data = { url: this.url.del, params: { data: row.id } }
          this.$store.dispatch('fmsCommon/actionTpmPost', _data)
            .then(data => {
              this.list.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'delete success!'
              })
            }).catch(err => {
              console.error(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          })
        })
      }

    }
  }
</script>

<style scoped>
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

  .model-factory {
    position: relative;
    width: 500px;
    height: calc(100vh - 120px);
    float: left;
    background: #D4D7D7;
  }

  .model-workshop {
    width: calc(100% - 505px);
    height: calc(100vh - 120px);
    float: left;
    margin-left: 5px;
    background: #D4D7D7;
  }

  /deep/.lar-el-calendar .el-calendar-table .el-calendar-day {
    padding: 0 !important;
  }

  .calendaritem {
    margin-top: 10px;
    height: 30px;
    font-size: 24px;
    font-weight: bold;
  }

  .character {
    display: block;
    height: 17px;
  }

  .rightmodal {
    border: 1px solid #999;
    box-shadow: 3px 3px 3px #ccc;
    position: absolute;
    z-index: 10000;
    /* display: flex; */
    background: #f3f3f3;
    /* flex-direction: column;
  justify-content: space-around; */
    width: 50px;
    height: 80px;
    cursor: pointer;
    left: 50px;
    top: 60px;
  }

    .rightmodal div {
      text-align: center;
      width: 100%;
      height: 50%;
      padding-top: 24%;
    }

      .rightmodal div:first-child {
        border-bottom: 1px solid #999;
      }

      .rightmodal div:hover {
        background-color: #F2F8FE;
      }
</style>
