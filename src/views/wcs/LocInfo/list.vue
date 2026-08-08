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
            :label="item.label"
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
      <el-button type="warning" v-ele-show="{btnCode:'wcs_addFuncJob'}" class="filter-item" @click="add">
        {{ $t('common.btn.add') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
              @row-dblclick="showDetails">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id":label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols"  :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
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


    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <el-dialog :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px">
      <el-form :label-position="labelPosition" label-width="120px" :model="addParam">
        <el-form-item :label="commonI18n(getItem(cols,'wareId'))">
          <el-select clearable  v-model="addParam.wareId" :filterable="true" :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in wareArray" :value="item.wareId" :label="item.wareName" :key="item.wareId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'laneCode'))">
          <el-input v-model="addParam.laneCode"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'laneName'))">
          <el-input v-model="addParam.laneName"></el-input>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'carryType'))">
          <el-select clearable  v-model="addParam.carryType" :filterable="true" :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in carryTypeArray" :value="item.id" :label="item.name" :key="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'useState'))">
          <el-select clearable  v-model="addParam.useState" :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in useStatusOption" :value="item.value" :label="item.name" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="addParamData">{{$t('common.btn.submit')}}</el-button>
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
    name: 'LocInfoList',
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
      useStatusOption:{
        get(){
          return [
          {name:this.$t('common.ProcessFlowList.enable'), value:1},
          {name:this.$t('common.ProcessFlowList.disabled'), value:0}
        ]
        }
      }
    },
    data() {
      const _initdata = {
        // useStatusOption: [
        //   { name: '启用', value: 1 },
        //   { name: '禁用', value: 0 }
        // ],
        addParam: {
          laneCode: '',
          laneName: '',
          useState: '',
          carryType: '',
          wareId: '',
          laneId: ''
        },
        wareArray: [],
        carryTypeArray: [],
        dialogtitle:'编辑',
        dialogFormVisible: false,
        queryParams: {
          requestData: {}
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
            timeId: ''
          }
        },
        list: null,
        labelPosition: 'right',
        //   total: 0,
        listLoading: true,
        listQuery: {},
        cols: [
          { field: 'wareId', title: '仓库名称', minWidth: 100, align: 'center', template: this.wareIntoFormatter },
          { field: 'laneName', title: '巷道名称', minWidth: 100, align: 'center' },
          { field: 'laneCode', title: '巷道编号', minWidth: 100 },
          { field: 'carryType', title: '搬运类型', minWidth: 100, template: this.carryTypeFormatter },
          { field: 'useState', title: '使用标识', minWidth: 100, template: this.useStateFormatter }
        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.initWare()
      this.initCarryType()
      this.getList()
    },
    methods: {
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
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
      initWare() {
        const _data = { url: '/api/LocInfo/GetWareInfos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.wareArray = data
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
        if(cellValue == 1){
            return this.$t('common.ProcessFlowList.enable')
          }
          return this.$t('common.ProcessFlowList.disabled')
      },
      wareIntoFormatter(row, column, cellValue, index) {
        let data = this.wareArray;
        for (let i = 0; i < data.length; i++) {
            if(data[i].wareId === cellValue){
              return data[i].wareName;
            }
        }
        return cellValue
      },
      carryTypeFormatter(row, column, cellValue, index) {
        let data = this.dataTemp(this.carryTypeArray, cellValue)
        if (data != null) {
          return data.name
        }
        return cellValue
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
      getList() {
        this.listLoading = true
        const _data = { url: '/api/LocInfo/GetLaneInfos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.list = data
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      add() {
        this.dialogtitle = this.$t('common.btn.add');
        for (let key in this.addParam) {
          this.addParam[key] = ''
        }
        this.dialogFormVisible = true
      },
      check(){
        if(this.checkParam() != null){
          this.$message({
            message: this.checkParam(),
            type: 'error'
          })
          return true;
        }
        return false;
      },
      addParamData() {
        if(this.check()){
          return false;
        }
        let json = { data: this.addParam }
        const _data = { url: '/api/LocInfo/AddLaneInfo', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: this.dialogtitle + this.$t('const.result.success'),
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
        this.dialogtitle =  this.$t('common.btn.edit');
        for (let key in this.addParam) {
          this.addParam[key] = row[key]
        }
        this.dialogFormVisible = true
      },
      reset() {

      },
      checkParam(){
        if(this.addParam.wareId.length < 1){
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'wareId'));
        }if(this.addParam.carryType.length < 1){
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'carryType')) ;
        }if(this.addParam.useState.length < 1){
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'useState')) ;
        }if(this.addParam.laneName.length < 1){
          return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'laneName')) ;
        }if(this.addParam.laneCode.length < 1){
          return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'laneCode'));
        }
        return null;
      },
      del(index, row) {
        this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          console.log(row)
          this.listLoading = true
          const _data = { url: '/api/LocInfo/DelLaneInfo', params: { data: row.laneId } }
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
            message: this.$t('common.btn.Cancelled')
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
