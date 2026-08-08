<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData.beginTime" type="date"
                      :placeholder="$t('const.time.beginTime')" style="width: 150" class="filter-item"></el-date-picker>
      <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData.endTime" type="date"
                      :placeholder="$t('const.time.endTime')" style="width: 150" class="filter-item"></el-date-picker>


      <div v-for="(items,index) in cols" :key="index" style="display:inline">
        <div v-for="(item,index) in items.list" :key="index" style="display:inline">
          <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                    :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          </el-input>
          <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                     :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            <el-option
              v-for="item in initSelect[item.field]"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]"
                          type="datetime"
                          :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
          <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                          :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>

        </div>
      </div>
      <el-button type="primary" :style="{marginLeft:'10px'}" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="createHandTask">
        {{ $t('common.btn.add') }}
      </el-button>
      <el-button type="warning" class="filter-item" @click="EditTasks">
        <i class="el-icon-edit-outline"></i>
         {{ $t('common.btn.edit') }}
      </el-button>
      <el-button type="danger" class="filter-item" @click="DeleteTask">
        <i class="el-icon-document-delete"></i>
        {{ $t('common.btn.delete') }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="AssignTask">
        <i class="el-icon-circle-check"></i>
        {{ $t('taskOperate.postTask') }}
      </el-button>
      <el-table
        :data="list"
        @selection-change="selectionChangeCancel"
        @row-dblclick="rowDblClick"
        :cell-style="cellStyle"
        style="width: 100%">
        <el-table-column v-for="(item) in cols" :label="commonI18n(item)" :type="item.type">

          <el-table-column v-for="(items) in item.list"  :sortable="true" :key="items.id" :label="commonI18n(items)" :prop="items.field"
                           :width="items.width"
                           :min-width="items.minWidth" v-if="!items.hide" :align="items.align" show-overflow-tooltip
                           :formatter="items.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : items.template">
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                  @pagination="getList"/>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormCurrentOperate"
               width="50%"
               top="5vh"
    >
      <el-form label-position="right" label-width="150px" :model="addParam">

        <el-col :span="24">
          <el-form-item :label="translateText('taskType')">
            <el-select clearable  v-model="selectValue" :disabled="isDisable.isSelectValue" :placeholder="$t('const.pleaseSelect')" style="width: 100%"
                       @change="selectChange">
              <el-option
                v-for="item in selectOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-col :span="24">
            <el-form-item :label="commonI18n(getItem(cols,'containerCtrlCode'))">
              <el-input v-model="addParam.containerCtrlCode" @keyup.enter.native="pltIdEnter"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'pltCode'))">
              <el-input v-model="addParam.pltCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'containerCtrlCode'))">
              <el-input v-model="addParam.containerCtrlCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromLocType'))">
              <el-select clearable  v-model="addParam.fromLocType" disabled :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('LocType')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromLocName'))">
              <el-input v-model="addParam.fromLocName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromMatlState'))">
              <el-select clearable  v-model="addParam.fromMatlState" disabled :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('MatlState')"
                  :key="item.stateNum"
                  :label="item.stateName"
                  :value="item.stateNum">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromCtrlCode'))">
              <el-input v-model="addParam.fromCtrlCode" :disabled="isDisable.containerCtrlCode"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromCodeState'))">
              <el-select clearable  v-model="addParam.fromCodeState" disabled :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('CodeState')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'fromMesState'))">
              <el-select clearable  v-model="addParam.fromMesState" disabled :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('MesState')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="24">
            <el-form-item :label="commonI18n(getItem(cols,'toLocId'))">
              <el-select clearable 
                v-model="addParam.toLocId"
                :placeholder="$t('const.pleaseSelect')"
                filterable
                remote
                reserve-keyword
                :loading="loading"
                :remote-method="remoteMethodFrom"
                @change="changeToOption"
                style="width: 100%">
                <el-option
                  v-for="item in fromLocOption"
                  :key="item.locId"
                  :label="item.locNameAndLocCode"
                  :value="item.locId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toLocType'))">
              <el-select clearable  v-model="addParam.toLocType" disabled :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('LocType')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toLocName'))">
              <el-input v-model="addParam.toLocName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toMatlState'))">
              <el-select clearable  v-model="addParam.toMatlState" :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('MatlState')"
                  :key="item.stateNum"
                  :label="item.stateName"
                  :value="item.stateNum">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toCtrlCode'))">
              <el-input v-model="addParam.toCtrlCode" :disabled="isDisable.toCtrlCode"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toCodeState'))">
              <el-select clearable  v-model="addParam.toCodeState" :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('CodeState')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'toMesState'))">
              <el-select clearable  v-model="addParam.toMesState" :placeholder="$t('const.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in getData('MesState')"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCurrentOperate = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="editParamData">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import constParam from './constParam'
  import moment from 'moment' 
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'
  import i18n from '@/lang'

  export default {
    name: 'handTask',
    components: { Pagination },
    directives: { waves, elDragDialog },
    computed:{
      selectOption:{
        get(){
          return [
            { label: this.$t('const.handTaskType.convey'), value: 0 },
            { label: this.$t('const.handTaskType.changeStation'), value: 3 }
          ]
        }
      }
    },
    data() {
      return {
        textI18n:{
          pleaseSelectOne:{zh:'请选择一条任务！',en:"Please select one item."},
          taskType:{zh:'创建类型',en:"TaskType"},
        },
        selectValue: 0,
        tableData: [],
        fromLocOption: [],
        dialogTitle:'',
        cols: [
          {
            title: '任务信息',
            field:'taskInfo',
            type: 'selection',
            list: []
          },
          {
            title: '托盘信息',
            field:'pltInfo',
            list: [
              { field: 'carryType', title: '搬运类型', minWidth: 150, align: 'center',
                query: true, queryType: 'select', set: true, required: true,
                template: constParam.formatter.CarryType},
              { field: 'pltCode', title: '托盘条码', minWidth: 120, align: 'center' },
              { field: 'containerCtrlCode', title: '托盘组号', minWidth: 120, align: 'center' }
            ]
          },
          {
            title: '起点信息',
            field:'fromLoc',
            list: [
              {
                field: 'fromLocType', title: '位置类型', minWidth: 110, align: 'center',
                template: constParam.formatter.LocType
              },
              {
                field: 'fromLocId', title: '位置', minWidth: 110, align: 'center',
                template: constParam.formatter.LocInfo
              },
              {
                field: 'fromLocName', title: '位置名称', minWidth: 110, align: 'center',hide:true
              },
              { field: 'fromCtrlCode', title: '调度号', minWidth: 100, align: 'center' },
              {
                field: 'fromMatlState', title: '电池状态', minWidth: 80, align: 'center',
                template: constParam.formatter.MatlState
              },
              {
                field: 'fromCodeState', title: '扫码状态', minWidth: 100, align: 'center',
                template: constParam.formatter.CodeState
              },
              {
                field: 'fromMesState', title: '接口状态', minWidth: 100, align: 'center',
                template: constParam.formatter.MesState
              }
            ]
          },
          {
            title: '目的信息',
            field:'toLoc',
            list: [
              {
                field: 'toLocType', title: '位置类型', minWidth: 110, align: 'center',
                template: constParam.formatter.LocType
              },
              {
                field: 'toLocId', title: '位置', minWidth: 110, align: 'center',
                template: constParam.formatter.LocInfo
              },
              {
                field: 'toLocName', title: '位置名称', minWidth: 110, align: 'center',hide:true
              },
              { field: 'toCtrlCode', title: '调度号', minWidth: 100, align: 'center' },
              {
                field: 'toMatlState', title: '电池状态', minWidth: 80, align: 'center',
                template: constParam.formatter.MatlState
              },
              {
                field: 'toCodeState', title: '扫码状态', minWidth: 100, align: 'center',
                template: constParam.formatter.CodeState
              },
              {
                field: 'toMesState', title: '接口状态', minWidth: 100, align: 'center',
                template: constParam.formatter.MesState
              }
            ]
          },
          {
            title: '下达信息',
            field:'postInfo',
            list: [
              {
                field: 'createTime',
                title: '创建时间',
                minWidth: 150,
                align: 'center'
              },
              {
                field: 'createUserId', title: '创建人', minWidth: 120, align: 'left'
              },
              {
                field: 'postUserId',
                title: '下达人',
                minWidth: 100,
                align: 'center'
              },
              {
                field: 'postTime',
                title: '下达时间',
                minWidth: 150,
                align: 'center'
              },
              {
                field: 'postState',
                title: '下达状态',
                minWidth: 100,
                align: 'center',
                template: constParam.formatter.TaskPostState,
                query: true, queryType: 'select', set: true, required: true
              }
            ]
          }
        ],
        queryParams: {
          requestData: {
            beginTime: new Date().toISOString().slice(0,10)+' 00:00:00',
            endTime: new Date().toISOString().slice(0,10)+' 23:59:59'
          }
        },
        listLoading: true,
        dialogFormCurrentTask: false,
        dialogFormCurrentOperate: false,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        addParam: {
          /*搬运状态*/
          carryType: -1,
          fromCodeState: 0,
          /*调度号*/
          fromCtrlCode:'',
          containerCtrlCode: '',
          /*起始位置*/
          fromLocId: '',
          fromLocName: '',
          /*起始位置类型*/
          fromLocType: 5,
          fromMatlState: 0,
          fromMesState: 0,
          /*托盘编号*/
          pltCode:'',
          postState: 0,
          toCodeState: 0,
          toCtrlCode: '',
          toLocId: '',
          toLocName: '',
          toLocType: 5,
          toMatlState: 0,
          toMesState: 0
        },
        addParamInit: {
          /*搬运状态*/
          carryType: -1,
          fromCodeState: 0,
          /*调度号*/
          containerCtrlCode: '',
          /*起始位置*/
          fromLocId: '',
          fromLocName: '',
          /*起始位置类型*/
          fromLocType: 5,
          fromMatlState: 0,
          fromMesState: 0,
          /*托盘编号*/
          pltId: '',
          postState: 0,
          toCodeState: 0,
          toCtrlCode: '',
          toLocId: '',
          toLocName: '',
          toLocType: 5,
          toMatlState: 0,
          toMesState: 0
        },
        createParam: [],
        total: 0,
        list: [],
        labelPosition: 'left',
        loading: false,
        isDisable: {
          fromLocType: true,
          fromMatlState: true,
          fromCodeState: true,
          fromMesState: true,
          containerCtrlCode: true,
          toCtrlCode: true,
          toMatlState: true,
          toCodeState: true,
          toMesState: true,
          toLocType: true,
          carryType: true,
          postState: true,
          isSelectValue: false
        },
        initSelect:{}
      }
    },
    created() {
      //时间范围设置在最近一周
      //this.queryParams.requestData.beginTime = moment(new Date(new Date().getTime() - 3600*1000*24*7)).format("yyyy-MM-DD HH:mm:ss")
      //this.queryParams.requestData.endTime =  moment(new Date()).format("yyyy-MM-DD HH:mm:ss")
      constParam.finalPara.CarryType()
      constParam.finalPara.MatlState()
      constParam.finalPara.CodeState()
      constParam.finalPara.MesState()
      constParam.finalPara.TaskPostState()
      constParam.finalPara.LocType()
      constParam.finalPara.LocInfo()
      this.getList()
    },
    methods: {
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
          if(item.hasOwnProperty('list') && typeof item['list'] !=undefined && Array.isArray( item['list'])){
            var i =  this.getItem(item.list,field)
            if(i!=null)
              return i;
          }
        }
        return null
      },
      translateText(type){
        return this.textI18n[type][this.$store.state.app.language];
      },
      pltIdEnter() {
        const _data = {
          url: '/api/CarryTask/CheckHandTaskFromByPltCtrlCode',
          params: { data: { pltCode: this.addParam.containerCtrlCode, handTaskType: this.selectValue } }
        }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.addParam.fromMatlState = data[0].matlState
            this.addParam.fromCodeState = data[0].codeState
            this.addParam.toMesState = data[0].mesState
            this.addParam.fromLocId = data[0].locId
            this.addParam.containerCtrlCode = data[0].containerCtrlCode
            this.addParam.pltCode = ''
            data.forEach(f=>this.addParam.pltCode+=f.pltCode+',')
            this.addParam.pltCode = this.addParam.pltCode.substring(0,this.addParam.pltCode.lastIndexOf(','))
            const _data = { url: '/api/Job/GetLocInfoApi', params: { data: { locId: data[0].locId } } }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
                for (let i = 0; i < data.length; i++) {
                  this.addParam.fromLocName = data[i].locName
                  this.addParam.fromCtrlCode = data[i].ctrlCode1
                }
              })
          })
      },
      remoteMethodFrom(query) {
        // if (query.length < 2) {
        //   this.$message.warning('默认最少输入二位数,请输入排列！')
        //   return false
        // }
        this.loading = true
        const _data = {
          url: '/api/Job/GetLocInfoApi',
          params: { data: { locType: this.addParam.toLocType, locCode: query } }
        }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data.map(item => {
              item.locNameAndLocCode = '[' + item.locCode + ']' + item.locName
            })
            this.fromLocOption = data
            this.loading = false
          })
      },
      getData(val) {
        return constParam.getData(val)
      },
      reset() {
        let data = this.queryParams.requestData
        for (let item in data) {
          data[item] = ''
        }
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/api/CarryTask/GetHandTask', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
            this.initSelect.carryType = this.getData('CarryType')
            this.initSelect.postState = this.getData('TaskPostState')
          }).catch(err => {
          console.error(err)
        })
      },
      cellStyle(row) {
        if (row.row.postState == 1) {
          return 'color:blue'
        }
        if (row.row.postState == 0) {
          return 'color:orange'
        }
        if (row.row.taskstate == 1) {
          return 'color:red'
        }
      },
      selectionChangeCancel(val) {
        this.createParam = val
      },
      rowDblClick(row, column, event) {
        this.dialogFormCurrentTask = true
      },
      createHandTask() {
        this.isDisable.isSelectValue = false
        this.addParam = this.addParamInit
        this.dialogTitle = this.$t('common.btn.add')
        this.dialogFormCurrentOperate = true
      },
      getLocNameByLocId(item, locId) {
        const _data = { url: '/api/Job/GetLocInfoApi', params: { data: { locId: locId } } }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            for (let i = 0; i < data.length; i++) {
              this.addParam[item] = data[i].locName
              this.remoteMethodFrom(data[i].locCode)
            }
          })
      },
      EditTasks() {
        this.dialogTitle = this.$t('common.btn.edit')
        this.isDisable.isSelectValue = true
        if (this.createParam.length != 1) {
          this.$message.error(this.translateText('pleaseSelectOne'))
          return false
        }
        this.dialogFormCurrentOperate = true
        for (let i = 0; i < this.createParam.length; i++) {
          this.addParam = this.createParam[i]
          this.getLocNameByLocId('fromLocName', this.createParam[i].fromLocId)
          this.getLocNameByLocId('toLocName', this.createParam[i].toLocId)
        }
      },
      AssignTask() {
       if (this.createParam.length != 1) {
          this.$message.error(this.translateText('pleaseSelectOne'))
          return false
        }
        const _data = { url: '/api/CarryTask/PostHandTask', params: { data: { taskId: this.createParam[0].taskId } } }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: this.$t('common.btn.operateSuccess')
            });
            this.getList();
          })

      },
      DeleteTask() {
        if (this.createParam.length != 1) {
          this.$message.error(this.translateText('pleaseSelectOne'))
          return false
        }
        this.$confirm(i18n.t("common.tip_info.delete_info"), this.$t('common.btn.hint'), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/api/CarryTask/DelHandTask', params: { data: { taskId: this.createParam[0].taskId } } }
          this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: this.$t('common.btn.deleteSuccess'),
              });
              this.getList();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          });
        });

      },
      editParamData() {
        const _data = { url: '/api/CarryTask/CreateHandTask', params: { data: this.addParam } }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message.success(this.messageAddOrEdit)
            this.dialogFormCurrentOperate = false
            this.getList()
          })
      },
      selectChange(val) {
        if (val == 0 || val == 3) {
          this.addParam.fromLocType = 5
          this.addParam.toLocType = 5
          this.addParam.carryType = -1
        } else if (val == 1) {
          this.addParam.fromLocType = 5
          this.addParam.toLocType = 4
          this.addParam.carryType = -1
        } else if (val == 2) {
          this.addParam.fromLocType = 4
          this.addParam.toLocType = 5
          this.addParam.carryType = -1
        } else if (val == 4) {
          this.addParam.fromLocType = 4
          this.addParam.toLocType = 4
          this.addParam.carryType = -1
        }
      },
      cellStyle(row) {
        if (row.row.postState == 1) {
          return 'color:blue'
        }
        if (row.row.postState == 0) {
          return 'color:orange'
        }
        if (row.row.taskstate == 1) {
          return 'color:red'
        }
      },
      changeToOption(val) {
        let data = this.fromLocOption.filter(item => item.locId === val)
        for (let i = 0; i < data.length; i++) {
          this.addParam.toCtrlCode = data[i].ctrlCode1
          this.addParam.toLocName = data[i].locName
        }
      }
    }
  }
</script>
