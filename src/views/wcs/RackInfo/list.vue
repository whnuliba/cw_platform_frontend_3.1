<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
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
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="warning" v-ele-show="{btnCode:'AddRackInfos'}" class="filter-item" @click="add">
        {{ $t('common.btn.add') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
              @row-dblclick="showDetails"
              :load="load"
              lazy
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              row-key="rackId"
    >
      <el-table-column v-for="(item) in cols"  :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width||defalutWidth"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.laneId !=  null" type="primary" size="small"
                     v-ele-show="{btnCode:'UpdateRackInfos'}" icon="el-icon-edit"
                     @click="edit(scope.row)">
            {{ $t('common.btn.edit') }}
          </el-button>
          <el-button type="warning" v-ele-show="{btnCode:'DelRackInfos'}" size="small" icon="el-icon-edit"
                     @click="del(scope.$index,scope.row)">
            {{ $t('common.btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px">
      <el-form :label-position="labelPosition" label-width="90px" :model="addParam">

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'wareId'))">
              <el-select v-model="addParam.wareId" :filterable="true" @change="wareUpdate">
                <el-option v-for="item in final.wareArray" :value="item.wareId" :label="item.wareName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'laneId'))">
              <el-select v-model="addParam.laneId" :filterable="true">
                <el-option v-for="item in locOption" :value="item.laneId" :label="item.laneName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="commonI18n(getItem(cols,'x'))">
            <el-input type="number" v-model="addParam.x"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackFunc'))">
              <el-select v-model="addParam.rackFunc" :filterable="true">
                <el-option v-for="item in final.funcArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackPos'))">
              <el-select v-model="addParam.rackPos">
                <el-option v-for="item in final.posArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackDir'))">
              <el-select v-model="addParam.rackDir">
                <el-option v-for="item in final.dirStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackDeep'))">
              <el-select v-model="addParam.deep">
                <el-option v-for="item in final.deepArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="translateText('yCount')">
              <el-input type="number" v-model="addParam.yCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="translateText('startY')">
              <el-input type="number" v-model="addParam.startY"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="translateText('zCount')">
              <el-input type="number" v-model="addParam.zCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="translateText('startZ')">
              <el-input type="number" v-model="addParam.startZ"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="translateText('ctrlX')">
              <el-input type="number" v-model="addParam.xCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="translateText('deepCode')">
              <el-input type="number" v-model="addParam.deepCode"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="translateText('boxCodeX')">
              <el-input type="number" v-model="addParam.boxCodeX"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="translateText('forkMode')">
              <el-select v-model="addParam.forkMode">
                <el-option v-for="item in final.forkDis" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="addParamData">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="$t('common.btn.edit')" v-el-drag-dialog :visible.sync="dialogFormVisibleEdit" width="800px">
      <el-form :label-position="labelPosition" label-width="90px" :model="editParam">

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'laneId'))">
              <el-select v-model="editParam.laneId" :filterable="true" :disabled="true">
                <el-option v-for="item in locOption" :value="item.laneId" :label="item.laneName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackCode'))">
              <el-input type="number" v-model="editParam.rackCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackName'))">
              <el-input v-model="editParam.rackName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'x'))">
              <el-input  v-model="editParam.x" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'y'))">
              <el-input  v-model="editParam.y" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'z'))">
              <el-input  v-model="editParam.z" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackFunc'))">
              <el-select v-model="editParam.rackFunc">
                <el-option v-for="item in final.funcArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackDeep'))">
              <el-select v-model="editParam.rackDeep">
                <el-option v-for="item in final.deepArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'rackPos'))">
              <el-select v-model="editParam.rackPos">
                <el-option v-for="item in final.posArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="commonI18n(getItem(cols,'rackDir'))">
              <el-select v-model="editParam.rackDir">
                <el-option v-for="item in final.dirStateArray" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item  :label="commonI18n(getItem(cols,'forkNum'))">
              <el-input type="number" v-model="editParam.forkNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="translateText('lanePosition')">
              <el-input type="number" v-model="editParam.lanePosition"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'ctrlCode1'))">
              <el-input  v-model="editParam.ctrlCode1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'ctrlCode2'))">
              <el-input v-model="editParam.ctrlCode2"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'boxCode'))">
              <el-input type="number" v-model="editParam.boxCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'sourceCode'))">
              <el-input  v-model="editParam.sourceCode"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item :label="commonI18n(getItem(cols,'allotOrder'))">
              <el-input type="number" v-model="editParam.allotOrder"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="editParamData">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog title="明细新增" v-el-drag-dialog :visible.sync="areaDtsAddVisible" width="800px">
      <div>
        <el-tree
          :data="rackInfoArray"
          show-checkbox
          ref="tree"
          node-key="rackId"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="areaDtsAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </div>
    </el-dialog>
-->
    <!--配置模态-->
    <el-dialog
      title="货区明细"
      :visible.sync="areaItemVisible"
      width="80%"
      top="5vh"
    >
      <!--  <div style="margin-bottom: 10px">
          <el-button type="warning" v-ele-show="{btnCode:'wcs_addFuncJob'}" class="filter-item" @click="addDts">
            {{ $t('common.btn.add') }}
          </el-button>
          <el-button type="danger" v-ele-show="{btnCode:'wcs_addFuncJob'}" class="filter-item" @click="deleteDts">
            {{ $t('common.btn.delete') }}
          </el-button>
        </div>
        <div style="width: 100%; height: 640px;overflow:auto">
          <el-table v-loading="listLoading" :data="listDts" border fit highlight-current-row style="width: 100%"
                    @row-dblclick="showDetails" @selection-change="updateHandleSelectionChange"
                    @select="handleSelectionChange"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="rackId" ref="multipleTable"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column v-for="(item) in colsDts" :key="item.id" :label="item.title" :prop="item.field"
                             :width="item.width"
                             :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                             :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                             return cellValue;
                           } : item.template">
            </el-table-column>
          </el-table>
          &lt;!&ndash;     <pagination v-show="totalDts>0" :total="totalDts" :page.sync="listDtsQuery.current"
                           :limit.sync="listDtsQuery.pageSize"
                           @pagination="getDtsList"/>&ndash;&gt;
        </div>-->
    </el-dialog>
  </div>

</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang'

  export default {
    name: 'rackInfo',
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
        defalutWidth:110,
        useStatusOption: [
          { name: '启用', value: 1 },
          { name: '禁用', value: 0 }
        ],
        textI18n:{
          yCount:{zh:'列数',en:"yCount"},
          startY:{zh:'起始列号',en:"startY"},
          zCount:{zh:'层数',en:"zCount"},
          startZ:{zh:'起始层号',en:"startZ"},
          ctrlX:{zh:'调度排号',en:"ctrlX"},
          deepCode:{zh:'调度排号',en:"deepCode"},
          boxCodeX:{zh:'箱号排',en:"boxCodeX"},
          forkMode:{zh:'货叉分配',en:"forkMode"},
          lanePosition:{zh:'巷道位置',en:"lanePosition"},
          rackCount:{zh:'货位数',en:"rackCount"},
        },
        addParam: {
          laneId: '',
          rackFunc: '',
          startY: '',
          yCount: '',
          startZ: '',
          zCount: '',
          deep: '',
          rackPos: '',
          rackDir: '',
          xCode: '',
          deepCode: '',
          forkMode: '',
          boxCodeX: ''
        },
        editParam: {
          allotOrder: '',
          areaId: '',
          boxCode: '',
          ctrlCode1: '',
          ctrlCode2: '',
          forkNum: '',
          laneId: '',
          lanePosition: '',
          rackCode: '',
          rackCount: '',
          rackDeep: '',
          rackDir: '',
          rackFunc: '',
          rackId: '',
          rackName: '',
          rackPos: '',
          reMark: '',
          sourceCode: '',
          x: '',
          y: '',
          z: ''
        },
        initSelect: {
          laneId: []
        },
        locArray: [],
        locOption: [],
        dialogtitle: '编辑',
        dialogFormVisible: false,
        dialogFormVisibleEdit: false,
        areaItemVisible: false,
        areaDtsAddVisible: false,
        queryParams: {
          requestData: {
            laneId: '',
            x: ''
          }
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
          { field: 'rackFunc', title: '位置功能', minWidth: 180, align: 'center', template: this.rackFuncFormatter },
          { field: 'rackCode', title: '位置编号', minWidth: 80, align: 'center' },
          { field: 'rackName', title: '位置名称', minWidth: 170, align: 'center' ,width:115},
          { field: 'x', title: '排号', minWidth: 60, align: 'center',width:60 },
          { field: 'y', title: '列号', minWidth: 60, align: 'center',width:60 },
          { field: 'z', title: '层号', minWidth: 60, align: 'center',width:60 },
          { field: 'boxCode', title: '箱号', minWidth: 80, align: 'center' },
          { field: 'rackDeep', title: '位置深度', minWidth: 100, align: 'center', template: this.rackDeepFormatter },
          { field: 'rackPos', title: '货架方位', minWidth: 100, align: 'center', template: this.rackPosFormatter },
          { field: 'rackDir', title: '托盘方向', minWidth: 100, align: 'center', template: this.rackDirFormatter },
          { field: 'forkNum', title: '默认货叉', minWidth: 100, align: 'center' },
          {
            field: 'wareId',
            title: '仓库',
            minWidth: 80,
            align: 'center',
          },
          {
            field: 'laneId',
            title: '巷道',
            minWidth: 80,
            align: 'center',
            query: true,
            queryType: 'select',
            set: true,
            required: true,
            template: this.laneFormatter
          },
          { field: 'ctrlCode1', title: '调度号1', minWidth: 100, align: 'center' },
          { field: 'ctrlCode2', title: '调度号2', minWidth: 100, align: 'center' },
          { field: 'sourceCode', title: '资源号', minWidth: 100, align: 'center' ,width:122},
          { field: 'allotOrder', title: '分配顺序', minWidth: 100, align: 'right' }
        ],
        colsDts: [
          { field: 'y', title: '位置编号', minWidth: 100, align: 'center' },
          { field: 'rackName', title: '位置名称', minWidth: 100, align: 'center' },
          { field: 'rackFunc', title: '位置功能', minWidth: 100 },
          { field: 'ctrlCode1', title: '调度号1', minWidth: 100 },
          { field: 'ctrlCode2', title: '调度号2', minWidth: 100 }
        ],
        multipleSelection: [],
        final: {
          wareArray: [],
          funcArray: [],
          deepArray: [],
          posArray: [],
          forkDis: [],
          dirStateArray: []
        }
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      /*仓库*/
      this.initWare()
      /*位置功能*/
      this.initFunc()
      /*货叉分配*/
      this.initForkDis()
      /*深度*/
      this.initDeep()
      /*货架方向*/
      this.initDirState()
      /*货架方位*/
      this.initPos()
      /**巷道*/
      this.initLoc({})
      this.getList()
    },
    methods: {
      translateText(type){
          return this.textI18n[type][this.$store.state.app.language];
      },
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
        }
      },
      wareUpdate(id) {
        this.locOption = this.locArray.filter(item => item.wareId === id)
      },
      rackDeepFormatter(row, column, cellValue, index) {
        let data = this.final.deepArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      rackFuncFormatter(row, column, cellValue, index) {
        let data = this.final.funcArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      rackDirFormatter(row, column, cellValue, index) {
        let data = this.final.dirStateArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      rackPosFormatter(row, column, cellValue, index) {
        let data = this.final.posArray.filter(item => item.id === cellValue)
        return data.length > 0 ? data[0].name : cellValue
      },
      laneFormatter(row, column, cellValue, index) {
        let data = this.locArray.filter(item => item.laneId === cellValue)
        return data.length > 0 ? data[0].laneName : cellValue
      },
      initWare() {
        const _data = { url: '/api/LocInfo/GetWareInfos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.wareArray = data
          }).catch(err => {
        })
      },
      initFunc() {
        const _data = { url: '/api/Const/LocFunc', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.funcArray = data
          }).catch(err => {
        })
      },
      initForkDis() {
        const _data = { url: '/api/Const/RackForkDis', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.forkDis = data
          }).catch(err => {
        })
      },
      initDeep() {
        const _data = { url: '/api/Const/RackDeep', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.deepArray = data
          }).catch(err => {
        })
      },
      initPos() {
        const _data = { url: '/api/Const/RackPos', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.posArray = data
          }).catch(err => {
        })
      },
      initDirState() {
        const _data = { url: '/api/Const/DirState', params: {} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.final.dirStateArray = data
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
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            resolve(data)
          }).catch(err => {
          console.error(err)
        })
      },
      getColArray(resolve) {
        let json = { data: this.queryParams.requestData }
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data = data.map(item => {
              let y = item.y
              let x = item.x
              let rackCount = item.rackCount
              for (let p in item) {
                item[p] = ''
              }
              item.rackId = Math.random() * 10000
              item.rackFunc = this.commonI18n(this.getItem(this.cols,'y'))+':' + y + '('+this.translateText('rackCount')+':' + rackCount + ')'
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
      getCheckedNodes() {
        let data = this.$refs.tree.getCheckedNodes().filter(item => item.children == null)
        data = data.map(item => {
          item.areaId = this.queryParamsDts.requestData.areaId
          item.locId = item.rackId
          return item
        })
        this.addDtsParam(data)
      },
      addDtsParam(data) {
        let json = { data: data }
        const _data = { url: '/api/LocInfo/AddAreaItems', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: '增加成功！',
              type: 'success'
            })
            this.getDtsList()
            this.areaDtsAddVisible = false
          }).catch(err => {
          this.$message({
            message: '增加失败！',
            type: 'error'
          })
        })
      },
      addDts() {
        this.areaDtsAddVisible = true
        this.getRackInfo()
      },
      getRackInfo() {

      },
      deleteDts() {

      },
      handleSelectionChange(val, row) {

      },
      updateHandleSelectionChange(val) {
        console.log(val)
        // this.multipleSelection = val
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
        const _data = { url: '/api/LocInfo/GetLaneInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            if (JSON.stringify(json) == '{}') {
              data = data.map(item => {
                item.label = item.laneName
                item.value = item.laneId
                return item
              })
              this.initSelect.laneId = data
              this.locArray = data
            }
            this.locOption = data
          }).catch(err => {
        })
      },
      getList() {
        this.listLoading = true
        let json = { data: this.queryParams.requestData }
        const _data = { url: '/api/LocInfo/GetRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            data = data.map(item => {
              let x = item.x
              let rackCount = item.rackCount
              for (let p in item) {
                item[p] = ''
              }
              item.rackId = Math.random() * 10000
              item.rackFunc =  this.commonI18n(this.getItem(this.cols,'x'))+':' + x + '('+this.translateText('rackCount')+':' + rackCount + ')'
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
      getDtsList() {

      },
      add() {
        this.dialogtitle = this.$t('common.btn.add')
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
      editParamData() {
        let json = { data: this.editParam }
        const _data = { url: '/api/LocInfo/UpdateRackInfos', params: json }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.$message({
              message: this.dialogtitle +this.$t('const.result.success'),
              type: 'success'
            })
            this.queryParams.requestData.x = ''
            this.queryParams.requestData.y = ''
            this.queryParams.requestData.laneId = ''
            this.getList()
            this.dialogFormVisibleEdit = false
          }).catch(err => {
          this.$message({
            message: this.dialogtitle + this.$t('const.result.fail'),
            type: 'error'
          })
        })
      },
      addParamData() {
        if (this.check()) {
          return false
        }
        let json = { data: this.addParam }
        const _data = { url: '/api/LocInfo/AddRackInfos', params: json }
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
        this.dialogtitle =  this.$t('common.btn.edit')
        for (let key in this.editParam) {
          this.editParam[key] = row[key]
        }
        this.dialogFormVisibleEdit = true
      },
      reset() {
        this.queryParams.requestData.x = ''
        this.queryParams.requestData.laneId = ''
      },
      checkParam() {
        if (this.addParam.laneId.length < 1) {
          return this.$t('const.pleaseSelect')+ this.commonI18n(this.getItem(this.cols,'laneId'))
        }
        if (this.addParam.x.length < 1) {
          return this.$t('const.pleaseInput')+ this.commonI18n(this.getItem(this.cols,'x'))
        }
        if (this.addParam.rackFunc.length < 1) {
          return this.$t('const.pleaseSelect')+ this.commonI18n(this.getItem(this.cols,'rackFunc'))
        }
        if (this.addParam.rackPos.length < 1) {
          return this.$t('const.pleaseSelect')+ this.commonI18n(this.getItem(this.cols,'rackPos'))
        }
        if (this.addParam.rackDir.length < 1) {
          return this.$t('const.pleaseSelect')+ this.commonI18n(this.getItem(this.cols,'rackDir'))
        }
        if (this.addParam.deep.length < 1) {
          return this.$t('const.pleaseSelect')+ this.commonI18n(this.getItem(this.cols,'rackDeep'))
        }
        if (this.addParam.yCount.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('yCount')
        }
        if (this.addParam.startY.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('startY')
        }
        if (this.addParam.zCount.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('zCount')
        }
        if (this.addParam.startZ.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('startZ')
        }
        if (this.addParam.xCode.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('ctrlX')
        }
        if (this.addParam.deepCode.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('deepCode')
        }
        if (this.addParam.boxCodeX.length < 1) {
          return this.$t('const.pleaseInput')+this.translateText('boxCodeX')
        }
        if (this.addParam.forkMode.length < 1) {
          return this.$t('const.pleaseSelect')+this.translateText('forkMode')
        }
        if (parseInt(this.addParam.x) > 99 || parseInt(this.addParam.x) < 1) {
          if(this.$store.state.app.language=='en')
            return "X can't be larger than 99 and less than 1"
          return '系统排号不可小于1或大于99,请重新输入！'
        }
        // if (parseInt(this.addParam.z) > 99 || parseInt(this.addParam.z) < 1) {
        //   if(this.$store.state.app.language=='en')
        //     return "Z can't be larger than 99 and less than 1"
        //   return '层数不可小于1或大于99,请重新输入！'
        // }
        return null
      },
      del(index, row) {
        this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
            confirmButtonText: i18n.t('common.btn.ok'),
            cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          if (row.xParam != undefined && row.yParam != undefined) {
            this.getDelId(1, row)
          } else if (row.xParam != undefined) {
            this.getDelId(0, row)
          } else {
            this.getDelId(2, row)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
      },
      delParam() {
        this.listLoading = true
        const _data = { url: '/api/LocInfo/DelRackInfos', params: { data: this.idArray } }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data).then(data => {
          this.$message({
            message:  this.$t('common.btn.deleteSuccess'),
            type: 'success'
          })
          this.queryParams.requestData.x = ''
          this.getList()
          this.listLoading = false
        }).catch(error =>{
          this.listLoading = false
        })
      },
      getDelId(type, row) {
        this.idArray = []
        if (type == 0) {
          this.getRowDelId(row)
        } else if (type == 1) {
          this.getColDelId(row.xParam, row.yParam)
        } else {
          this.idArray.push(row.rackId)
          this.delParam()
        }
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
