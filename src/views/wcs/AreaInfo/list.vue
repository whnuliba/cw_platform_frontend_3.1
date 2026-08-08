<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input
          v-if="item.query && item.queryType==='input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 120px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select
          v-if="item.query && item.queryType==='select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 120px"
          clearable 
          class="filter-item"
        >
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType==='datetime'"
          v-model="queryParams.requestData[item.field]"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="commonI18n(item)"
          style="width: 150"
          class="filter-item"
        />
        <el-date-picker
          v-if="item.query && item.queryType==='date'"
          v-model="queryParams.requestData[item.field]"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          :placeholder="commonI18n(item)"
          style="width: 150"
          class="filter-item"
        />

      </div>
      <el-button v-ele-show="{btnCode:'wcs_addFuncJob'}" type="warning" class="filter-item" @click="add">
        {{ $t('common.btn.add') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-dblclick="showDetails"
    >

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="(item) in cols"
        :sortable="true"
        v-if="!item.hide"
        :key="item.id"
        :label="commonI18n(item)"
        :prop="item.field"
        :width="item.width"
        :min-width="item.minWidth"
        :align="item.align"
        show-overflow-tooltip
        :formatter="item.template == undefined ? function(row, column, cellValue, index) {
          return cellValue;
        } : item.template"
      >
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="300">
        <template slot-scope="scope">

          <el-button
            v-ele-show="{btnCode:'AddWareInfo'}"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="detail(scope.row)"
          >
            {{ $t('common.btn.detail') }}
          </el-button>

          <el-button
            v-ele-show="{btnCode:'AddWareInfo'}"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            {{ $t('common.btn.edit') }}
          </el-button>
          &nbsp;
          <el-button
            v-ele-show="{btnCode:'DelWareInfo'}"
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="del(scope.$index,scope.row)"
          >
            {{ $t('common.btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="400px">
      <el-form :label-position="labelPosition" label-width="100px" :model="addParam">
        <el-form-item :label="commonI18n(getItem(cols,'wareId'))">
          <el-select v-model="addParam.wareId" :filterable="true" @change="getLane" clearable :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in wareArray" :value="item.wareId" :label="item.wareName" :key="item.wareId"  />
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'laneId'))">
          <el-select v-model="addParam.laneId" clearable :filterable="true" :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in locOption" :value="item.laneId" :label="item.laneName" :key="item.laneId"  />
          </el-select>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'areaCode'))">
          <el-input v-model="addParam.areaCode" :placeholder="$t('const.pleaseInput')" style="width:200px"/>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'areaName'))">
          <el-input v-model="addParam.areaName" :placeholder="$t('const.pleaseInput')" style="width:200px"/>
        </el-form-item>
        <el-form-item :label="commonI18n(getItem(cols,'useState'))">
          <el-select v-model="addParam.useState" clearable :placeholder="$t('const.pleaseSelect')">
            <el-option v-for="item in useStatusOption" :value="item.value" :label="item.name" :key="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="addParamData">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog :title="$t('common.btn.add')+$t('common.btn.detail')" :visible.sync="areaDtsAddVisible" width="800px">
      <div>
        <el-tree
          ref="tree"
          :data="rackInfoArray"
          show-checkbox
          lazy
          :load="loadNode"
          node-key="rackId"
          :props="defaultProps"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="areaDtsAddVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="getCheckedNodes">{{$t('common.btn.ok')}}</el-button>
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
        <el-button v-ele-show="{btnCode:'wcs_addFuncJob'}" type="warning" class="filter-item" @click="addDts">
          {{ $t('common.btn.add') }}
        </el-button>
        <el-button v-ele-show="{btnCode:'wcs_addFuncJob'}" type="danger" class="filter-item" @click="deleteDts">
          {{ $t('common.btn.delete') }}
        </el-button>
      </div>
      <div style="width: 100%; height: 640px;overflow:auto">
        <el-table
          v-loading="listLoading"
          :data="listDts"
          border
          fit
          highlight-current-row
          ref="multipleTable"
          style="width: 100%"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          row-key="id"
          @row-dblclick="showDetails"
          @selection-change="updateHandleSelectionChange"
          @select="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(item) in colsDts"
            v-if="!item.hide"
            :key="item.id"
            :label="commonI18n(item)"
            :prop="item.field"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            show-overflow-tooltip
            :formatter="item.template == undefined ? function(row, column, cellValue, index) {
              return cellValue;
            } : item.template"
          />
        </el-table>
        <!--     <pagination v-show="totalDts>0" :total="totalDts" :page.sync="listDtsQuery.current"
                         :limit.sync="listDtsQuery.pageSize"
                         @pagination="getDtsList"/>-->
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
    name: 'logicRack',
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
          { name: this.$t('common.ProcessFlowList.enable'), value: 1 },
          { name: this.$t('common.ProcessFlowList.disabled'), value: 0 }
        ]
        }
      }
    },
    data() {
      const _initdata = {
        addParam: {
          areaName: '',
          areaCode: '',
          useState: '',
          areaId: '',
          laneId: '',
          wareId: ''
        },
        detailAddParam: {
          areaName: '',
          areaCode: '',
          useState: '',
          areaId: '',
          laneId: '',
          wareId: ''
        },
        wareArray: [],
        locArray: [],
        locOption: [],
        rackInfoArray: [],
        carryTypeArray: [],
        dialogFormVisible: false,
        dialogtitle :'编辑',
        areaItemVisible: false,
        areaDtsAddVisible: false,
        queryParams: {
          requestData: {}
        },
        queryParamsDts: {
          requestData: {
            areaId: ''
          }
        },
        total: 0,
        totalDts: 0,
        defaultForm: {
          row: {},
          params: {
            id: '',
            timeId: ''
          }
        },
        list: [],
        listDts: [],
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
        defaultProps: {
          children: 'children',
          label: 'rackName'
        },
        cols: [
          { field: 'areaName', title: '区域名称', minWidth: 100, align: 'center' },
          { field: 'areaCode', title: '区域代码', minWidth: 100, align: 'center' },
          { field: 'wareId', title: '所在仓库', minWidth: 100,hide:true },
          { field: 'laneId', title: '所属巷道', minWidth: 100, template: this.laneFormatter },
          { field: 'useState', title: '使用标识', minWidth: 100, template: this.useStateFormatter }
        ],
        colsDts: [
          { field: 'y', title: '位置编号', minWidth: 100, align: 'center' },
          { field: 'rackName', title: '位置名称', minWidth: 100, align: 'center' },
          { field: 'rackFunc', title: '位置功能', minWidth: 100 },
          { field: 'ctrlCode1', title: '调度号1', minWidth: 100 },
          { field: 'ctrlCode2', title: '调度号2', minWidth: 100 }
        ],
        multipleSelection: []
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.initWare()
      this.initLoc({})
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
      getCheckedNodes() {
        let data = this.$refs.tree.getCheckedNodes().filter(item => item.z != null)
        data = data.map(item => {
          item.areaId = this.queryParamsDts.requestData.areaId
          item.locId = item.rackId
          return item
        })
        this.addDtsParam(data)
      },
      addDtsParam(data) {
        const json = { data: data }
        const _data = { url: '/api/LocInfo/AddAreaItems', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: this.$t('common.btn.addSuccess'),
              type: 'success'
            })
            this.getDtsList()
            this.areaDtsAddVisible = false
          }).catch(err => {
          this.$message({
            message: this.$t('common.btn.add')+this.$t('const.result.fail'),
            type: 'error'
          })
        })
      },
      addDts() {
        this.areaDtsAddVisible = true
        this.getRackInfo()
      },
      getRackInfo() {
        const json = { data: this.queryParamsDts.requestData }

        console.log('------x------')
        console.log(json)
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data.map(item => {
              item.rackId = 'x' + item.x + Math.random() * 1000000
              item.rackName = this.$t('table.row')+':' + item.x
              return item
            })
            this.rackInfoArray = data
          }).catch(err => {
        })
      },

      loadNode(node, resolve) {
        if (node.data.laneId != null) {
          return resolve([])
        }
          if (node.data.x != null && node.data.y != null) {
              this.getFloorArray(node.data, resolve)
          } else if (node.data.x != null) {
            this.getColArray(node.data, resolve)
          }
      },
      getFloorArray(dataFloor, resolve) {
        const dataJson = {}
        Object.assign(dataJson, this.queryParamsDts.requestData)
        dataJson.x = dataFloor.x
        dataJson.y = dataFloor.y
        const _data = { url: '/api/LocInfo/GetRackInfos', params: { data: dataJson }}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data.map(item => { item.leaf = true; return item })
            resolve(data)
          }).catch(err => {
          console.error(err)
        })
      },
      getColArray(dataCol, resolve) {
        const dataJson = {}
        Object.assign(dataJson, this.queryParamsDts.requestData)
        dataJson.x = dataCol.x

        console.log('------y------')
        console.log(dataJson)
        const _data = { url: '/api/LocInfo/GetRackInfos', params: { data: dataJson }}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data.map(item => {
              item.rackId = 'y' + item.x + Math.random() * 1000000
              item.rackName = this.$t('table.column')+':' + item.y
              return item
            })
            resolve(data)
          }).catch(err => {
          console.error(err)
        })
      },

      deleteDts() {
        const data = this.multipleSelection.filter(item => item.children == null)
        const json = { data: data }
        this.$confirm(i18n.t("common.tip_info.delete_info"), this.$t('common.btn.hint'), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          const _data = { url: '/api/LocInfo/DelAreaItems', params: json }
          this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
            this.$message({
              message:this.$t('common.btn.deleteSuccess'),
              type: 'success'
            })
            this.getDtsList()
            this.listLoading = false
          }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
      },
      handleSelectionChange(val, row) {
        const thisP = this
        if (row.children != null) {
          setTimeout(function() {
            thisP.checkedPara(row.children)
          }, 100)
        }
      },
      updateHandleSelectionChange(val) {
        this.multipleSelection = val
      },
      checkedPara(row) {
        for (let i = 0; i < row.length; i++) {
          if (row[i].children != null) {
            this.checkedPara(row[i].children)
          }
          this.$refs.multipleTable.toggleRowSelection(row[i])
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
      initLoc(json) {
        console.log(json)
        const _data = { url: '/api/LocInfo/GetLaneInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            if (JSON.stringify(json) == '{}') {
              this.locArray = data
            }
            this.locOption = data
          }).catch(err => {
        })
      },
      initWare() {
        const _data = { url: '/api/LocInfo/GetWareInfos', params: {}}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.wareArray = data
          }).catch(err => {
        })
      },
      initCarryType() {
        const _data = { url: '/api/LocInfo/GetCarryTypes', params: {}}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.carryTypeArray = data
          }).catch(err => {
        })
      },
      useStateFormatter(row, column, cellValue, index) {
        if (cellValue == 1) {
          return this.$t('common.ProcessFlowList.enable')
        }
        return this.$t('common.ProcessFlowList.disabled')
      },
      laneFormatter(row, column, cellValue, index) {
        const data = this.locArray.filter(item => item.laneId == cellValue)
        return data.length > 0 ? data[0].laneName : cellValue
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
      getLane(wareId) {
        const json = { data: wareId }
        console.log(this.locArray)
        this.addParam.laneId = ''
        this.locOption = this.locArray.filter(item => item.wareId == wareId)
        // this.initLoc(json)
      },
      getList() {
        this.listLoading = true
        const _data = { url: '/api/LocInfo/GetAreaInfos', params: {}}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      getDtsList() {
        this.listLoading = true
        Object.assign(this.queryParamsDts, this.listDtsQuery)
        const _data = { url: '/api/LocInfo/GetAreaItems', params: this.queryParamsDts }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            const returnData = []
            for (let i = 0; i < data.length; i++) {
              const tempMap = {}
              tempMap.y = data[i].x
              tempMap.id = 'top' + i
              const tempArray = []
              const yLists = data[i].yLists
              for (let j = 0; j < yLists.length; j++) {
                const tempDtsArray = {}
                tempDtsArray.y = yLists[j].y
                tempDtsArray.id = 'topItem' + j
                tempDtsArray.children = yLists[j].itemList
                tempArray.push(tempDtsArray)
              }
              tempMap.children = tempArray
              returnData.push(tempMap)
            }
            this.listDts = returnData
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      add() {
        this.dialogtitle = this.$t('common.btn.add')
        for (const key in this.addParam) {
          this.addParam[key] = ''
        }
        this.dialogFormVisible = true
      },
      detail(row) {
        this.areaItemVisible = true
        this.listLoading = true
        this.queryParamsDts.requestData.areaId = row.areaId
        this.queryParamsDts.requestData.laneId = row.laneId
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
        const json = { data: this.addParam }
        const _data = { url: '/api/LocInfo/AddAreaInfo', params: json }
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
        const data = this.locArray
        this.dialogtitle = this.$t('common.btn.edit')
        for (const key in this.addParam) {
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
      reset() {

      },
      checkParam() {
        if (this.addParam.wareId.length < 1) {
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'wareId'))
        }
        if (this.addParam.laneId.length < 1) {
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'laneId'))
        }
        if (this.addParam.useState.length < 1) {
          return this.$t('const.pleaseSelect')+this.commonI18n(this.getItem(this.cols,'useState'))
        }
        if (this.addParam.areaName.length < 1) {
          return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'areaName'))
        }
        if (this.addParam.areaCode.length < 1) {
          return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'areaCode'))
        }
        return null
      },
      del(index, row) {
        this.$confirm(i18n.t("common.tip_info.delete_info"), this.$t('common.btn.hint'), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          const _data = { url: '/api/LocInfo/DelAreaInfo', params: { data: row.areaId }}
          this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
            this.$message({
              message:this.$t('common.btn.deleteSuccess'),
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
