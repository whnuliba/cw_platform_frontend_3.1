<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                   :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.name"
            :value="item.value"> 
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>

      </div>
      <el-button type="primary"     class="filter-item"  @click="query()" >
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="warning" v-ele-show="{btnCode:'AddStaGrap'}" class="filter-item" @click="add">
        {{ $t('common.btn.add') }}
      </el-button>
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
              @row-dblclick="showDetails">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols"  :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="300">
        <template slot-scope="scope">

          <el-button type="primary" size="small" v-ele-show="{btnCode:'AddWareInfo'}" icon="el-icon-edit"
                     @click="detail(scope.row)">
            {{ $t('common.btn.detail') }}
          </el-button>

          <el-button type="primary" size="small" v-ele-show="{btnCode:'AddWareInfo'}" icon="el-icon-edit"
                     @click="edit(scope.row)">
            {{ $t('common.btn.edit') }}
          </el-button>
          &nbsp;
          <el-button type="warning" v-ele-show="{btnCode:'DelWareInfo'}" size="small" icon="el-icon-edit"
                     @click="del(scope.$index,scope.row)">
            {{ $t('common.btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <el-dialog :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px">
      <el-form :label-position="labelPosition" label-width="100px" :model="addParam">
        <el-form-item :label="commonI18n(getItem(cols,'grpCode'))">
          <el-input v-model="addParam.grpCode"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'grpName'))">
          <el-input v-model="addParam.grpName"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'laneId'))">
          <el-select clearable  v-model="addParam.laneId" :filterable="true" :clearable="true" :allow-create="true"  style="width:100%">
            <el-option v-for="item in locOption" :value="item.laneId" :label="item.laneName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'carryType'))">
          <el-select clearable  v-model="addParam.carryType" :filterable="true" @change="getLane" style="width:100%">
            <el-option v-for="item in carryTypeArray" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'ctrlCode1'))">
          <el-input v-model="addParam.ctrlCode1"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'ctrlCode2'))">
          <el-input v-model="addParam.ctrlCode2"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'lockState'))">
          <el-select clearable  v-model="addParam.lockState" style="width:100%">
            <el-option v-for="item in lockStateArray" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'useState'))">
          <el-select clearable  v-model="addParam.useState" style="width:100%">
            <el-option v-for="item in initSelect.useState" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="addParamData">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="$t('common.btn.add')+$t('common.btn.detail')" v-el-drag-dialog :visible.sync="areaDtsAddVisible" width="60%" top="5vh">
      <div slot="footer" class="dialog-footer">
        <div style="width: 100%; height: 640px;overflow:auto">
          <el-table v-loading="listLoading" :data="listDtsAdd" border fit highlight-current-row style="width: 100%"
                    @row-dblclick="showDetails"   @selection-change="updateHandleDtsAddSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column v-for="(item) in colsDtsAdd" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                             :width="item.width"
                             :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                             :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
            </el-table-column>
          </el-table>
         <pagination v-show="totalDtsAdd>0" :total="totalDtsAdd" :page.sync="listDtsAddQuery.current"
                  :limit.sync="listDtsAddQuery.pageSize"
                  @pagination="initDtsAddData"/>
        </div>
        <el-button @click="areaDtsAddVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="checkedDataAdd">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>

    <!--配置模态-->
    <el-dialog
      :title="$t('common.btn.detail')"
      :visible.sync="areaItemVisible"
      width="80%"
      top="5vh"
    >
      <div style="margin-bottom: 10px">
        <el-button type="warning" v-ele-show="{btnCode:'wcs_addFuncJob'}" class="filter-item" @click="addDts">
          {{ $t('common.btn.add') }}
        </el-button>
        <el-button type="danger" v-ele-show="{btnCode:'wcs_addFuncJob'}" class="filter-item" @click="deleteDts">
          {{ $t('common.btn.delete') }}
        </el-button>
      </div>
      <div style="width: 100%; height: 640px;overflow:auto">
        <el-table v-loading="listLoading" :data="listDts" border fit highlight-current-row style="width: 100%"
                  @row-dblclick="showDetails"    @selection-change="updateHandleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column v-for="(item) in colsDts" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                           :width="item.width"
                           :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                           :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
          </el-table-column>
        </el-table>
         <pagination v-show="totalDts>0" :total="totalDts" :page.sync="listDtsQuery.current"
                     :limit.sync="listDtsQuery.pageSize"
                     @pagination="getDtsList"/>
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
    name: 'staGraps',
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
    computed:{
      initSelect:{
        get(){
          return {
            useState:[
              {name:this.$t('common.ProcessFlowList.enable'), value:1},
              {name:this.$t('common.ProcessFlowList.disabled'), value:0}
            ]
          }
        }
      },
      lockStateArray:{
        get(){
          return [
          {value:0,name:this.$t('const.useState.normal')},
          {value:1,name:this.$t('const.locked')}
          ]
        }
      }
    },
    data() {
      const _initdata = {
        addParam: {
          laneId: '',
          grpCode: '',
          grpName: '',
          carryType: '',
          ctrlCode1: '',
          lockState: '',
          useState: '',
          grpId: '',
          ctrlCode2: ''
        },
        detailAddParam: {
          areaName: '',
          areaCode: '',
          useState: '',
          areaId: '',
          laneId: '',
          wareId: ''
        },
        locFuncArray:[],
        locArray: [],
        locOption: [],
        carryTypeArray: [],
        dialogFormVisible: false,
        dialogtitle : '编辑',
        areaItemVisible: false,
        areaDtsAddVisible: false,
        queryParams: {
          requestData: {}
        },
        queryParamsDts: {
          requestData: {
            grpId: ''
          }
        },
        queryParamsDtsAdd: {
          requestData: {
            carryType: '',
            grpId:'',
          }
        },
        total: 0,
        totalDts: 0,
        totalDtsAdd: 0,
        defaultForm: {
          row: {},
          params: {
            id: '',
            timeId: ''
          }
        },
        list: [],
        listDts: [],
        listDtsAdd: [],
        labelPosition: 'right',
        //   total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        listDtsQuery: {
          current: 1,
          pageSize: 15
        },
        listDtsAddQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          { field: 'grpCode', title: '站台组编号', minWidth: 120, align: 'center',query:true,queryType:'input',set:true,required:true  },
          { field: 'grpName', title: '站台组名称', minWidth: 120, align: 'center'  },
          { field: 'laneId', title: '关联巷道', minWidth: 120, align: 'center', template: this.laneFormatter },
          { field: 'carryType', title: '搬运类型', minWidth: 120,  align: 'center',template: this.carryTypeFormatter  },
          { field: 'ctrlCode1', title: '调度号1', minWidth: 120, align: 'center' },
          { field: 'ctrlCode2', title: '调度号2', minWidth: 120 , align: 'center'},
          { field: 'lockState', title: '锁定状态', minWidth: 120, align: 'center', template: this.lockStateFormatter },
          { field: 'useState', title: '使用标识', minWidth: 120, align: 'center', template: this.useStateFormatter ,query:true,queryType:'select',set:true,required:true }
        ],
        colsDts: [
          { field: 'staCode', title: '站台编号', minWidth: 100, align: 'center' },
          { field: 'staName', title: '站台名称', minWidth: 100, align: 'center' },
          { field: 'laneId', title: '所属巷道', minWidth: 100, template: this.laneFormatter },
          { field: 'carryType', title: '搬运类型', minWidth: 100, template: this.carryTypeFormatter  },
          { field: 'staFunc', title: '站台功能', minWidth: 100 , template: this.locFuncFormatter },
          { field: 'ctrlCode1', title: '输送线调度号', minWidth: 100 },
          { field: 'ctrlCode2', title: '堆垛机调度号', minWidth: 100 },
          { field: 'forkNum', title: '默认货叉', minWidth: 100 },
        ],
        colsDtsAdd: [
          { field: 'carryType', title: '搬运类型', minWidth: 100, template: this.carryTypeFormatter  },
          { field: 'staFunc', title: '站台功能', minWidth: 100 , template: this.locFuncFormatter },
          { field: 'staCode', title: '站台编号', minWidth: 100, align: 'center' },
          { field: 'staName', title: '站台名称', minWidth: 100, align: 'center' },
          { field: 'laneId', title: '关联巷道', minWidth: 100, template: this.laneFormatter },
          { field: 'useFork', title: '默认货叉', minWidth: 100 },
        ],
        multipleSelection: [],
        multipleSelectionDtsAdd: [],
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.initLoc()
      this.initLocFunc()
      this.initCarryType()
      // this.initUserStatus()
      this.getList()
    },
    methods: {
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
        }
      },
      initLocFunc(){
        const _data = { url: '/api/Const/LocFunc', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.locFuncArray = data
          }).catch(err => {
        })
      },
      query(){
        this.listQuery.current =1
        this.getList()
      },
      reset(){
        for(let p in  this.queryParams.requestData){
          if(this.queryParams.requestData.hasOwnProperty(p)){
            this.queryParams.requestData[p]=''
          }
        }
      },
      addDts(){
        this.areaDtsAddVisible = true;
        this.queryParamsDtsAdd.requestData.grpId = this.queryParamsDts.requestData.grpId;
        this.initDtsAddData();
      },
      initDtsAddData(){
        Object.assign(this.queryParamsDtsAdd, this.listDtsAddQuery)
        const _data = { url: '/api/LocInfo/GetStaInfos', params: this.queryParamsDtsAdd }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.listDtsAdd = data.data
            this.totalDtsAdd = data.total
          }).catch(err => {
        })
      },
      checkedDataAdd(){
        let data = this.multipleSelectionDtsAdd.map(item => {item.grpId = this.queryParamsDts.requestData.grpId;return item})
        const _data = { url: '/api/LocInfo/AddStaGrapItems', params: {data:data} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
          this.$message({
            message:  this.$t('common.btn.addSuccess'),
            type: 'success'
          })
          this.getDtsList()
          this.areaDtsAddVisible = false
        })
      },
      deleteDts(){
        let data = this.multipleSelection;
        let json = {data:data};
        console.log(data)
        this.$confirm(this.$t('common.tip_info.delete_info'), this.$t('common.btn.hint'), {
          confirmButtonText: this.$t('common.btn.ok'),
          cancelButtonText: this.$t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/api/LocInfo/DelStaGrapItems', params: json }
          this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
            this.$message({
              message: this.$t('common.btn.deleteSuccess'),
              type: 'success'
            })
            this.getDtsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
      },
      handleSelectionChange(val,row) {
        let thisP = this;
        if(row.children != null){
          setTimeout(function() {
            thisP.checkedPara(row.children);
          },100)
        }
      },
      updateHandleSelectionChange(val) {
          this.multipleSelection = val;
      },
      updateHandleDtsAddSelectionChange(val) {
        this.multipleSelectionDtsAdd = val;
      },
      checkedPara(row){
        for (let i = 0; i < row.length; i++) {
            if(row[i].children != null){
              this.checkedPara(row[i].children);
            }
         this.$refs.multipleTable.toggleRowSelection(row[i]);
        }
      },
      dataTemp(dataArray, id) {
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].id == id) {
            return dataArray[i]
            break
          }
        }
        return null
      },
      initLoc() {
        const _data = { url: '/api/LocInfo/GetLaneInfos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.locOption = data
            this.locArray = data
          }).catch(err => {
        })
      },
      initCarryType() {
        const _data = { url: '/api/LocInfo/GetCarryTypes', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.carryTypeArray = data
          }).catch(err => {
        })
      },
      useStateFormatter(row, column, cellValue, index) {
        let data = this.initSelect.useState.filter(item => item.value == cellValue);
        return data.length > 0 ? data[0].name : cellValue
      },
      lockStateFormatter(row, column, cellValue, index) {
        let data = this.lockStateArray.filter(item => item.value == cellValue);
        return data.length > 0 ? data[0].name : cellValue
      },
      laneFormatter(row, column, cellValue, index) {
        let data = this.locArray.filter(item => item.laneId === cellValue);
        return data.length > 0 ? data[0].laneName : cellValue
      },
      locFuncFormatter(row, column, cellValue, index) {
        let data = this.locFuncArray.filter(item => item.id == cellValue);
        return data.length > 0 ? data[0].name : cellValue
      },
      carryTypeFormatter(row, column, cellValue, index) {
        let data = this.carryTypeArray.filter(item => item.id == cellValue);
        return data.length > 0 ? data[0].name : cellValue
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
      getLane(wareId) {
        let json = { data: wareId }
        this.initLoc(json)
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/api/LocInfo/GetStaGraps', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      getDtsList(json) {
        this.listLoading = true
        Object.assign(this.queryParamsDts, this.listDtsQuery)
        const _data = { url: '/api/LocInfo/GetStaGrapItems', params: this.queryParamsDts }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.listDts = data.data;
            this.totalDts = data.total;
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      add() {
        this.dialogtitle = this.$t('common.btn.add')
        for (let key in this.addParam) {
          this.addParam[key] = ''
        }
        this.dialogFormVisible = true
      },
      detail(row) {
        this.areaItemVisible = true
        this.listLoading = true
        this.queryParamsDts.requestData.grpId = row.grpId
        this.queryParamsDtsAdd.requestData.carryType = row.carryType
        this.getDtsList()
      },
      check() {
        if (this.checkParam() != null) {
          this.$message({
            message: this.checkParam(),
            type: 'error'
          })
          return true
        }
        return false
      },
      addParamData() {
        if (this.check()) {
          return false
        }
        let json = { data: this.addParam }
        const _data = { url: '/api/LocInfo/AddStaGrap', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: this.dialogtitle +  this.$t('const.result.success'),
              type: 'success'
            })
            this.getList()
            this.dialogFormVisible = false
          }).catch(err => {
          this.$message({
            message: this.dialogtitle + this.$t('const.result.fail'),
            type: 'error'
          })
        })
      },
      showDetails(row, column) {
      },
      edit(row) {
        let data = this.locArray
        this.dialogtitle = this.$t('common.btn.edit')
        for (let key in this.addParam) {
          this.addParam[key] = row[key]
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].laneId === row.laneId) {
            this.addParam.wareId = data[i].wareId
            break
          }
        }
        this.dialogFormVisible = true
      },
      checkParam() {
        if (this.addParam.carryType.length < 1) {
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'carryType'))
        }
        // if (this.addParam.laneId.length < 1) {
        //   return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'laneId'))
        // }
        if (this.addParam.lockState.length < 1) {
          return  this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'lockState'))
        }
        if (this.addParam.useState.length < 1) {
          return  this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'useState'))
        }
        if (this.addParam.grpCode.length < 1) {
          return  this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'grpCode'))
        }
        if (this.addParam.grpName.length < 1) {
          return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'grpName'))
        }
        return null
      },
      del(index, row) {
        this.$confirm(this.$t('common.tip_info.delete_info'), this.$t('common.btn.hint'), {
          confirmButtonText: this.$t('common.btn.ok'),
          cancelButtonText: this.$t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          const _data = { url: '/api/LocInfo/DelStaGrap', params: { data: row.grpId } }
          this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
            this.$message({
              message: this.$t('common.btn.deleteSuccess'),
              type: 'success'
            })
            this.getList()
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message:  this.$t('common.btn.Cancelled')
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

</style>
