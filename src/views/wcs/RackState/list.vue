<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="item.title" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                   :filterable="true"
                   :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>



        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>

      </div>
      <el-input  v-model="queryIs.x"
                 placeholder="请输入排" style="width: 120px" class="filter-item">
      </el-input>
      <el-input  v-model="queryIs.y"
                 placeholder="请输入列" style="width: 120px" class="filter-item">
      </el-input>
      <el-input  v-model="queryIs.z"
                 placeholder="请输入层" style="width: 120px" class="filter-item">
      </el-input>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
              :load="load"
              lazy
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              row-key="rackId"
    >
      <el-table-column v-for="(item) in cols"  :sortable="true" :key="item.id" :label="item.title" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.laneId != null" type="primary" size="small"
                     v-ele-show="{btnCode:'UpdateRackInfos'}" icon="el-icon-edit"
                     @click="edit(scope.row)">
            {{ $t('common.btn.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisibleEdit" width="800px">
      <el-form :label-position="labelPosition" label-width="90px" :model="editParam">

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="出入限定">
              <el-select v-model="editParam.moveState" >
                <el-option v-for="item in final.moveStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="载货状态">
              <el-select v-model="editParam.loadState" >
                <el-option v-for="item in final.loadStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="使用标识">
              <el-select v-model="editParam.useState" >
                <el-option v-for="item in final.userStatusArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动状态">
              <el-select v-model="editParam.autoState" >
                <el-option v-for="item in final.autoStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="工步状态">
              <el-select v-model="editParam.workState" >
                <el-option v-for="item in final.workStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校准状态">
              <el-select v-model="editParam.carlibratState" >
                <el-option v-for="item in final.carlibratStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="针床状态">
              <el-select v-model="editParam.pressState" >
                <el-option v-for="item in final.pressStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="箱门状态">
              <el-select v-model="editParam.boxState" >
                <el-option v-for="item in final.boxStatesArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="异常状态">
              <el-select v-model="editParam.errorState" >
                <el-option v-for="item in final.errorStatesArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editParamData">确 定</el-button>
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
    name: 'rackState',
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
        editParam: {
          autoState: 0,
          boxState: 0,
          carlibratState: 0,
          errorState: 0,
          loadState: 0,
          moveState: 0,
          pressState: 0,
          rackId: "",
          useState: 0,
          workState: 0,
        },
        initSelect: {
          laneId: [],
          wareId: [],
        },
        locArray: [],
        dialogtitle: '编辑',
        dialogFormVisible: false,
        dialogFormVisibleEdit: false, 
        queryParams: {
          requestData: {
            laneId: '',
            x: ''
          }
        },
        total: 0,
        defaultForm: {
          row: {},
          params: {
            id: '',
            timeId: ''
          }
        },
        list: [],
        idArray: [],
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
          { field: 'wareId', title: '仓库ID', minWidth: 180, align: 'center',hide: true,query:true,queryType:'select',set:true,required:true},
          { field: 'laneId', title: '巷道ID', minWidth: 180, align: 'center',hide: true,query:true,queryType:'select',set:true,required:true},
          { field: 'rackCode', title: '货架编号', minWidth: 180, align: 'center'},
          { field: 'rackName', title: '货架名称', minWidth: 160, align: 'center' },
          { field: 'x', title: '排号', minWidth: 60, align: 'center' },
          { field: 'y', title: '列号', minWidth: 60, align: 'center' },
          { field: 'z', title: '层号', minWidth: 60, align: 'center' },
          { field: 'moveState', title: '出入限定', minWidth: 80, align: 'center' , template: this.MoveStateFormatter },
          { field: 'rackLoadState', title: '载货状态', minWidth: 100, align: 'center', template: this.LoadStateFormatter },
          { field: 'rackUseState', title: '使用状态', minWidth: 100, align: 'center', template: this.UserStatusFormatter },
          { field: 'autoState', title: '自动状态', minWidth: 100, align: 'center', template: this.AutoStateFormatter },
          { field: 'workState', title: '工步状态', minWidth: 100, align: 'center', template: this.WorkStateFormatter },
          { field: 'carlibratState', title: '校准状态', minWidth: 100, align: 'center', template: this.CarlibratStateFormatter },
          { field: 'pressState', title: '针床状态', minWidth: 100, align: 'center', template: this.PressStateFormatter },
          { field: 'boxState', title: '箱门状态', minWidth: 100, align: 'center', template: this.BoxStatesFormatter },
          { field: 'rackErrorState', title: '异常状态', minWidth: 100, align: 'center', template: this.ErrorStatesFormatter },
        ],
        multipleSelection: [],
        final: {
          moveStateArray: [],
          loadStateArray: [],
          autoStateArray: [],
          workStateArray: [],
          carlibratStateArray: [],
          pressStateArray: [],
          boxStatesArray: [],
          errorStatesArray: [],
          userStatusArray: [],
        },
        queryIs: {
          x:'',
          y:'',
          z:''
        },
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      /*仓库*/
      this.initWare()
      /**巷道*/
      this.initLoc({})
      /**出入状态 */
      this.initMoveState()
      /**载货状态*/
      this.initLoadState()
      /**载货状态*/
      this.initAutoState()
      /**载货状态*/
      this.initWorkState()
      /**载货状态*/
      this.initCarlibratState()
      /**载货状态*/
      this.initPressState()
      /**载货状态*/
      this.initBoxStates()
      /**载货状态*/
      this.initErrorStates()
      /**载货状态*/
      this.initUserStatus()
      this.getList()
    },
    watch:{
      'queryParams.requestData.wareId'(val){
        this.initSelect.laneId = this.locArray.filter(item => item.wareId === val)
        this.queryParams.requestData.laneId = ''
      }
    },
    methods: {
      initLoc(json) {
        const _data = { url: '/api/LocInfo/GetLaneInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            console.log(data)
            data = data.map(item => {
              item.label = item.laneName
              item.value = item.laneId
              return item
            })
            this.locArray = data;
            this.initSelect.laneId = data
          }).catch(err => {
        })
      },
      initWare() {
        const _data = { url: '/api/LocInfo/GetWareInfos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data = data.map(item => {
              item.label = item.wareName
              item.value = item.wareId
              return item
            })
            this.initSelect.wareId = data
          }).catch(err => {
        })
      },

      MoveStateFormatter(row, column, cellValue, index) {
        let data = this.final.moveStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      LoadStateFormatter(row, column, cellValue, index) {
        let data = this.final.loadStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      AutoStateFormatter(row, column, cellValue, index) {
        let data = this.final.autoStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      WorkStateFormatter(row, column, cellValue, index) {
        let data = this.final.workStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      CarlibratStateFormatter(row, column, cellValue, index) {
        let data = this.final.carlibratStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      PressStateFormatter(row, column, cellValue, index) {
        let data = this.final.pressStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      BoxStatesFormatter(row, column, cellValue, index) {
        let data = this.final.boxStatesArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      ErrorStatesFormatter(row, column, cellValue, index) {
        let data = this.final.errorStatesArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      UserStatusFormatter(row, column, cellValue, index) {
        let data = this.final.userStatusArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },


      initMoveState() {
        const _data = { url: '/api/Const/RackMoveState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.moveStateArray = data
          }).catch(err => {
        })
      },
      initLoadState() {
        const _data = { url: '/api/Const/RackLoadState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.loadStateArray = data
          }).catch(err => {
        })
      },
      initAutoState() {
        const _data = { url: '/api/Const/RackAutoState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.autoStateArray = data
          }).catch(err => {
        })
      },
      initWorkState() {
        const _data = { url: '/api/Const/RackWorkState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.workStateArray = data
          }).catch(err => {
        })
      },
      initCarlibratState() {
        const _data = { url: '/api/Const/RackCarlibratState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.carlibratStateArray = data
          }).catch(err => {
        })
      },
      initPressState() {
        const _data = { url: '/api/Const/RackPressState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.pressStateArray = data
          }).catch(err => {
        })
      },
      initBoxStates() {
        const _data = { url: '/api/Const/RackBoxStates', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.boxStatesArray = data
          }).catch(err => {
        })
      },
      initErrorStates() {
        const _data = { url: '/api/Const/RackErrorStates', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.errorStatesArray = data
          }).catch(err => {
        })
      },
      initUserStatus() {
        const _data = { url: '/api/Const/UseState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.userStatusArray = data
          }).catch(err => {
        })
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
      load(tree, treeNode, resolve) {
        if (tree.state == 0) {
          this.queryParams.requestData.x = tree.xParam
          this.getColArray(resolve)
        }
        if (tree.state == 1) {
          this.queryParams.requestData.x = tree.xParam
          this.queryParams.requestData.y = tree.yParam
          this.getFloorArray(resolve)
        }
      },
      getFloorArray(resolve) {
        let json = { data: this.queryParams.requestData }
        const _data = { url: '/api/LocInfo/GetRackStates', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            if(this.queryIs.z.length > 0){
              data = data.filter(item => item.z === this.queryIs.z)
            }
            resolve(data)
          }).catch(err => {
          console.error(err)
        })
      },
      getColArray(resolve) {
        this.queryParams.requestData.y = '';
        let json = { data: this.queryParams.requestData }
        const _data = { url: '/api/LocInfo/GetRackStates', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            if(this.queryIs.y.length > 0){
              data = data.filter(item => item.y === this.queryIs.y)
              setTimeout(function() {
                let className = document.getElementsByClassName('el-table__row--level-1')
                if(className.length > 0){
                  let name = className[0].getElementsByClassName('el-table__expand-icon')
                  if(name.length > 0){
                    name[0].click();
                  }
                }
              }, 500)
            }
            data = data.map(item => {
              let y = item.y
              let x = item.x
              let rackCount = item.rackCount
              for (let p in item) {
                item[p] = ''
              }
              item.rackId = Math.random() * 10000
              item.rackCode = '列号:' + y + '(货位数:' + rackCount + ')'
              item.yParam = y
              item.xParam = x
              item.state = 1
              item.hasChildren = true
              return item
            })
            resolve(data)
          }).catch(err => {
          console.error(err)
        })
      },
      query() {
        this.queryParams.requestData.x = '';
        this.queryParams.requestData.y = '';
        this.listQuery.current = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        let json = { data: this.queryParams.requestData }
        const _data = { url: '/api/LocInfo/GetRackStates', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            if(this.queryIs.x.length > 0){
              data = data.filter(item => item.x === this.queryIs.x)
              setTimeout(function() {
                let className = document.getElementsByClassName('el-table__expand-icon')
                if(className.length > 0){
                  className[0].click();
                }
              }, 500)
            }
            data = data.map(item => {
              let x = item.x
              let rackCount = item.rackCount
              for (let p in item) {
                item[p] = ''
              }
              item.rackId = Math.random() * 10000
              item.rackCode = '排号:' + x
              item.xParam = x
              item.state = 0
              item.hasChildren = true
              return item
            })
            this.list = data
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      add() {
        this.addUpdateMessage = '增加'
        this.dialogFormVisible = true
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
      editParamData() {
        let json = { data: this.editParam }
        const _data = { url: '/api/LocInfo/UpdateRackState', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: this.addUpdateMessage + '成功！',
              type: 'success'
            })
            this.queryParams.requestData.x = ''
            this.queryParams.requestData.y = ''
            this.queryParams.requestData.laneId = ''
            this.getList()
            this.dialogFormVisibleEdit = false
          }).catch(err => {
          this.$message({
            message: this.addUpdateMessage + '失败！',
            type: 'error'
          })
        })
      },
      edit(row) {
        console.log(row)
        this.addUpdateMessage = '修改'
        for (let key in this.editParam) {
          this.editParam[key] = row[key]
        }
        this.editParam['useState'] = row['rackUseState']
        this.editParam['errorState'] = row['rackErrorState']
        this.editParam['loadState'] = row['rackLoadState']
        this.dialogFormVisibleEdit = true
      },
      reset() {
        this.queryParams.requestData.x = ''
        this.queryParams.requestData.laneId = ''
        this.queryParams.requestData.wareId = ''
        let data = this.queryIs;
        for (let item in data) {
          this.queryIs[item] = '';
        }
      },
      checkParam() {
        if (this.addParam.laneId.length < 1) {
          return '巷道未选择,请选择！'
        }
        if (this.addParam.x.length < 1) {
          return '系统排号未输入,请输入！'
        }
        if (this.addParam.rackFunc.length < 1) {
          return '位置功能未选择,请选择！'
        }
        if (this.addParam.rackPos.length < 1) {
          return '货架方位未选择,请选择！'
        }
        if (this.addParam.rackDir.length < 1) {
          return '货架方向未选择,请选择！'
        }
        if (this.addParam.deep.length < 1) {
          return '深度未选择,请选择！'
        }
        if (this.addParam.yCount.length < 1) {
          return '列数未输入,请输入！'
        }
        if (this.addParam.startY.length < 1) {
          return '起始列号未输入,请输入！'
        }
        if (this.addParam.zCount.length < 1) {
          return '层数未输入,请输入！'
        }
        if (this.addParam.startZ.length < 1) {
          return '起始层数未输入,请输入！'
        }
        if (this.addParam.xCode.length < 1) {
          return '调度排号未输入,请输入！'
        }
        if (this.addParam.deepCode.length < 1) {
          return '纵深调度号未输入,请输入！'
        }
        if (this.addParam.boxCodeX.length < 1) {
          return '箱号排诶输入,请输入！'
        }
        if (this.addParam.forkMode.length < 1) {
          return '货叉分配未选择,请选择！'
        }
        if (parseInt(this.addParam.x) > 99 || parseInt(this.addParam.x) < 0) {
          return '系统排号不可小于0或大于99,请重新输入！'
        }
        if (parseInt(this.addParam.z) > 99 || parseInt(this.addParam.z) < 0) {
          return '层数不可小于0或大于99,请重新输入！'
        }
        return null
      },
      getRowDelId(row) {
        let json = { data: { x: row.xParam } }
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            for (let i = 0; i < data.length; i++) {
              this.getColDelId(row.xParam, data[i].y)
            }
          }).catch(err => {
          console.error(err)
        })
      },
      getColDelId(x, y) {
        let json = { data: { x: x, y: y } }
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.idArray = []
            for (let i = 0; i < data.length; i++) {
              this.idArray.push(data[i].rackId)
            }
            this.delParam()
          }).catch(err => {
          console.error(err)
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
