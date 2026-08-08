<template>
  <div id="configMenu" class="app-container" style="width: 100%">
    <div class="tree-menu" :style="{ width: lastX + 'px' }">
      <el-tree ref="treeRef" :data="treeMenuData" node-key="ID" :highlight-current='true'
        :default-expanded-keys="defaultShowNodes" @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-collapse="handleNodeCollapse"
         lazy :load="loadNode" :props="treeprops" :expand-on-click-node="false">
        <template v-slot="{ node, data }">
          <div class="treetitle" v-if="node.level == 1">
            <div @click="treeNodeClick(node)">
              <i class="el-icon-coin" />
              <span> {{ node.label }}</span>
            </div>
            <div>
                <el-button title="同步" class='treebutton' type="text" size="mini" icon="el-icon-plus"
                  @click="opentablenamelog(node)"></el-button>
                <el-button title="查询" style="margin-right: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-search"
                  @click="searchtable(node)"></el-button>
              <el-input v-if="searchinputshow == node.data.ID" @input.native="tabletreeChange(searchiptval,node)"  class='searchinput' size="mini" v-model="searchiptval[node.data.ID]" />
            </div>
          </div>
          <div class="treetitle" v-else-if="node.level == 2">
            <div @click="treeNodeClick(node)">
              <i class="el-icon-date" />
              <span> {{ node.label }}</span>
            </div>
            <div>
              <!-- <el-tooltip popper-class="icontooltip" content="刷新" effect="light" transition="none" :open-delay="600"> -->
                <el-button title="刷新" class='treebutton' type="text" size="mini" icon="el-icon-refresh-right"
                  @click="tablenamefresh(node)"></el-button>

              <!-- </el-tooltip> -->
              <!-- <el-tooltip popper-class="icontooltip" content="脚本" effect="light" transition="none" :open-delay="600"> -->
                <el-button title="脚本" class='treebuttonedit' type="text" size="mini" icon="el-icon-edit"
                  @click="myscript('CTRL_SCRIPT', node.data)"></el-button>
                <!-- <el-button title="映射新增" class='treebuttonedit' type="text" size="mini" icon="el-icon-plus"
                  @click="mapperadd(node)"></el-button> -->

              <!-- </el-tooltip> -->
            </div>

          </div>
          <span style="font-size: 14px;" v-else> <i class="el-icon-document-remove" /><span> {{ node.label }}</span></span>

        </template>

      </el-tree>
    </div>
    <div class="midline" @mousedown="mouseDown"></div>

    <div class="container-menu" :style="{ width: `calc(100%-${lastX}px)` }">
      <el-tabs v-model="activeName1" type="border-card" >
        <el-tab-pane :label="tablelabel" name="first">
          
       
      <!-- <div class="filter-container"> -->
        <el-button type="primary" class="filter-item" @click="add">
          {{ $t("common.btn.add") }}
        </el-button>
      <!-- </div> -->

      <el-table ref="tableref" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin-top: 10px;"
        height="673px" @row-dblclick="showDetails">

        <el-table-column width="50px" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column v-for="(item) in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field"
          :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">{{ commonFilter(row[item.field], item.field) }}</template>
          <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">

          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="del(scope.$index, scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button> -->
              <i title="样式" v-if="treeselectNode.level !== 1" class="el-icon-tickets"
                @click="myscript('COLUMN_STYLE', scope.row)"></i>
            &nbsp;
              <i title="事件" v-if="treeselectNode.level !== 1" class="el-icon-tickets"
                @click="myscript('COLUMN_EVENT', scope.row)"></i>
            &nbsp;
              <i :title="$t('common.btn.edit')" class="el-icon-edit" @click="edit(scope.row)"></i>
            &nbsp;
              <i :title="$t('common.btn.edit')" class="el-icon-delete" @click="del(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
      <el-tab-pane v-if="this.treeselectNode.level >= 2" label="模型映射" name="second">
        <el-button type='primary'   class="filter-item" @click="mapperadd">
          {{ $t("common.btn.add") }}
        </el-button>
      <div v-if="this.treeselectNode.level >= 2" style="margin-top:10px">
        <el-table ref="tablerefbottom" v-loading="listLoadingbottom" :data="listbottom" border fit highlight-current-row style="width: 100%"
        height="673px" @row-dblclick="showDetails">

        <el-table-column width="50px" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column v-for="(item) in colsbottom" :key="item.id" :label="commonI18n(item)" :prop="item.field"
          :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">{{ commonFilter(row[item.field], item.field) }}</template>
          <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">

          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="del(scope.$index, scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button> -->
              <i title="脚本" v-if="treeselectNode.level !== 1" class="el-icon-tickets"
                @click="myscript('mapper', scope.row)"></i>
            &nbsp;
              <i :title="$t('common.btn.edit')" class="el-icon-edit" @click="mapperedit(scope.row)"></i>
            &nbsp;
              <i :title="$t('common.btn.delete')" class="el-icon-delete" @click="mapperdel(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>

      <!-- 页码标签组件 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getMenus" />
      <el-dialog title="同步" :visible.sync="dialogVisible" width="30%">
        <div class="dialogbox">
          <div style="line-height:36px;margin-right:10px">表名称:</div>
          <div>
            <el-input v-model="synchronizationColumnobj.tableName" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" @click="synchronizationColumnsubmit">{{ $t("common.btn.submit") }}</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="dialogtitle" v-if="dialogFormVisible" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="180px">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item v-if="item.set && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
              :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
              <!--:disabled="item.isEdit && item.disable"-->
              <el-input :show-password="item.password" v-model="defaultForm.params[item.field]" style="width:220px;" />
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType === 'select'" :label="item.title"
              :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"
                style="width:220px;">
                <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="destory(false)"> {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID === '' || defaultForm.params.ID === null"
            @click="save('defaultForm.params')"> {{ $t("common.btn.save") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID != '' && defaultForm.params.ID != null"
            @click="submit('defaultForm.params')"> {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="dialogtitle" v-if="dialogMapperFormVisible" v-el-drag-dialog :visible.sync="dialogMapperFormVisible" width="700px">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="180px">
          <div v-for="(item) in colsbottom" :key="item.id" style="display:inline">
            <el-form-item v-if="item.set && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
              :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
              <!--:disabled="item.isEdit && item.disable"-->
              <el-input :show-password="item.password" v-model="defaultForm.params[item.field]" style="width:220px;" />
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType === 'select'" :label="item.title"
              :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"
                style="width:220px;">
                <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="mapperdestory(false)"> {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID === '' || defaultForm.params.ID === null"
            @click="mappersave('defaultForm.params')"> {{ $t("common.btn.save") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID != '' && defaultForm.params.ID != null"
            @click="mappersubmit('defaultForm.params')"> {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>

      <el-drawer :title="'脚本编写'" :visible.sync="scriptsVisible" :direction="'ltr'" :size="'80%'" :withHeader="false"
        :before-close="handleClose">
        <component :is="dtsOfswitch" ref="scriptsEditer" @changeScript="setScript">
        </component>
        <div style="margin-left:42%">
          <el-button @click="scriptsVisibletofalse()"> {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" @click="saveScript()"> {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-drawer>

    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import i18n from '@/lang';
import script_editer from '../components/script-editer'

export default {
  name: 'dataManagement',
  components: { Pagination, script_editer },
  directives: { waves, elDragDialog },
  filters: {},
  data() {
    const _initdata = {
      activeName1: 'first',
      scriptsVisible: false,
      dtsOfswitch: 'script_editer',
      scriptsEditer: '',
      searchinputshow: '',
      tablelabel: '表数据',
      dialogtitle: '编辑',
      searchiptval:{},
      scriptObjstr: '',
      scriptOps: {
        scriptValue: '',
        scriptId: ''
      },
      scriptOpsobj: {},
      dialogVisible: false,
      // scriptTimer: null,
      defaultShowNodes: [],
      treeMenuData: [],
      options: [],
      list: null,
      listbottom: null,
      total: 0,
      pagesNum: 1,
      treeprops: {
        isLeaf: 'isLeaf'
      },
      defaultForm: {
        row: {},
        params: {
          ID: '',
        }
      },
      synchronizationColumnobj: {
        dsName: '',
        dbName: '',
        tableName: '',
        ID: '',
      },
      treeselectNode: {},
      initSelect: {
        TABLE_TYPE:[{ label: '受控', value: 'CONTROL' }, { label: '非受控', value: 'NON_CONTROL' }],
        useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }]
      },
      listQuery: {
        page: 1,
        limit: 10,
      },
      dialogFormVisible: false,
      listLoading: false,
      listLoadingbottom: false,
      tablebottomshow:false,
      dialogMapperFormVisible:false,
      cols: [
        { field: 'BIZ_CODE', title: '模型编码', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_NAME', title: '模型名', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_MAPPER', title: '模型映射', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_COMMENTS', title: '注释', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },

        { field: 'TABLE_TYPE', title: '模型受控类型', minWidth: 100, align: "left", queryType: 'select', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_IS_VIEW', title: '是否视图', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'JDBC_DRIVER', title: 'JDBC_DRIVER', minWidth: 100, align: "left", queryType: 'input', set: false, require: false, query: true, hide: true },
        { field: 'JDBC_PASSWORD', title: 'JDBC_PASSWORD', minWidth: 100, align: "left", queryType: 'input', set: false, require: false, query: true, hide: true },
      ],
      colsTable: [
        { field: 'BIZ_CODE', title: '模型编码', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_NAME', title: '模型名', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_MAPPER', title: '模型映射', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_COMMENTS', title: '注释', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },

        { field: 'TABLE_TYPE', title: '模型受控类型', minWidth: 100, align: "left", queryType: 'select', set: true, require: false, query: true, hide: false },
        { field: 'TABLE_IS_VIEW', title: '是否视图', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'JDBC_DRIVER', title: 'JDBC_DRIVER', minWidth: 100, align: "left", queryType: 'input', set: false, require: false, query: true, hide: true },
        { field: 'JDBC_PASSWORD', title: 'JDBC_PASSWORD', minWidth: 100, align: "left", queryType: 'input', set: false, require: false, query: true, hide: true },
      ],
      colsColumns: [
        { field: 'COLUMN_NAME', title: '列名称', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_TYPE', title: '列类型', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_LENGTH', title: '列长度', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_COMMENTS', title: '列描述', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_DEFAULT', title: '默认', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_IS_NULL', title: '非空', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      ],
      colsbottom:[
        { field: 'BIZ_CODE', title: '业务编码', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_NAME', title: '业务名称', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_COMMENT', title: '业务描述', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },

      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      lastX: '500',
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  computed: {},
  watch: {
    list: {
      handler() {
        this.$nextTick(() => {
          this.$refs.tableref.doLayout();
        })
      },
      deep: true
    },
    // scriptsVisible: {
    //   handler: function (newVal, oldVal) {
    //     if(newVal == false){
    //       this.scriptTimer && clearInterval(this.scriptTimer);
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    
    lastX(newValue){
      if(newValue >= 1000){
        this.lastX = 1000
      }
    }
  },
  created() {
    this.getMenuTreeData();
    document.addEventListener("mouseup", this.mouseUp);
  },
  mounted() {
    document.addEventListener("keydown", this.saveContent);
    this.getMenus()
  },
  destroyed() {
    document.removeEventListener("keydown", this.saveContent);
    document.removeEventListener("mouseup", this.mouseUp);
  },
  methods: {
    saveContent(e) {
      var key = window.event.keyCode ? window.event.keyCode : window.event.which;
      if (key === 83 && e.ctrlKey && this.scriptsVisible == true) {
          let _this = this
          const _data = { url: '/dyn-table/updateById', params: { data: { CTRL_SCRIPT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
          }).catch(err => {
            console.error(err)
          })

        e.preventDefault(); //阻止浏览器默认事件
      }
    },
    handleNodeCollapse(data, node){
      node.loaded = false
      node.childNodes.splice(0, node.childNodes.length)
    },
    tabletreeChange(val,node){
      this.$refs.treeRef.updateKeyChildren(node.data.ID, [])
      const _data = {
          url: '/dyn-table/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'DB_ID',
                  condition: '=',
                  value: node.data.ID
                },
                {
                  column: 'TABLE_NAME',
                  condition: 'like',
                  value: val[node.data.ID] ? val[node.data.ID] : ''
                },
              ]
            }
          }
        }
      

        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            let arr = []
            if (data.length > 0) {
              arr = data.map(val1 => {
                val1.label = val1.TABLE_NAME;
                val1.value = val1.ID;
                return val1
              })
            }
            this.list = data
            this.$refs.treeRef.updateKeyChildren(node.data.ID, arr)

          })
    },
    searchtable(node){
      // this.searchiptval = ''
      this.searchinputshow = node.data.ID
    },

    handleClose(done) {
      this.$confirm(this.$t('common.btn.sureClose'))
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    scriptsVisibletofalse(){
      this.scriptsVisible = false
      if (this.scriptObjstr == 'CTRL_SCRIPT') {
        this.refreshTreeNode(this.scriptOpsobj.DB_ID)

      }else if(this.scriptObjstr == 'mapper'){
        this.getMapperList()
      }else{
        this.query()
      }
    },
    saveScript() {
      const _this = this
      let _scripts
      // try {
      //   _scripts = eval("(" + _this.scriptOps.scriptValue + ")")
      // } catch (e) {
      //   this.$message({
      //     type: 'info',
      //     message: '脚本解析一次'
      //   });
      //   return
      // }
      // if (!_scripts.sql || !_scripts.totalSql) {
      //   this.$message({
      //     type: 'info',
      //     message: '没有配置数据源脚本'
      //   });
      //   return
      // }
      if (this.scriptObjstr == 'CTRL_SCRIPT') {
        const _data = { url: '/dyn-table/updateById', params: { data: { CTRL_SCRIPT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.refreshTreeNode(_this.scriptOpsobj.DB_ID)
            // let node1 = this.$refs.treeRef.getNode(_this.scriptOpsobj.DB_ID);
            // node1.expand();
            this.scriptsVisible = false
          }).catch(err => {
            console.error(err)
          })
      } else if(this.scriptObjstr == 'mapper'){
        const _data = { url: '/dyn-mapper/updateById', params: { data: { SCRIPT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.getMapperList()
            // let node1 = this.$refs.treeRef.getNode(_this.scriptOpsobj.DB_ID);
            // node1.expand();
            this.scriptsVisible = false
          }).catch(err => {
            console.error(err)
          })
      }
      else {
        let _data1 = { url: '/dyn-table/updateById', params: { data: { COLUMN_STYLE: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }

        if (this.scriptObjstr == 'COLUMN_STYLE') {
          _data1 = { url: '/dyn-column/updateById', params: { data: { COLUMN_STYLE: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        } else {
          _data1 = { url: '/dyn-column/updateById', params: { data: { COLUMN_EVENT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data1)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.query()

            this.scriptsVisible = false
          }).catch(err => {
            console.error(err)
          })
      }

    },
    setScript(data) {
      this.scriptOps.scriptValue = data
    },
    myscript(str, row) {
      this.scriptOps.scriptValue = ''
      this.scriptObjstr = str
      this.scriptsEditer = row.ID
      this.scriptsVisible = true
      this.scriptOpsobj = row
      this.scriptOps.scriptId = row.ID
      if(str == 'mapper'){
        this.scriptOps.scriptValue = row.SCRIPT
        this.$nextTick(function () {
          this.$refs.scriptsEditer.tablenameinitScript(row.SCRIPT)
        })
      }else{
        this.scriptOps.scriptValue = row[str]
        this.$nextTick(function () {
          this.$refs.scriptsEditer.tablenameinitScript(row[str])
        })
      }
      // if(str == 'CTRL_SCRIPT' && this.scriptsVisible == true){
        // let _this = this
        // this.scriptTimer = setInterval(() => {
        //   const _data = { url: '/dyn-table/updateById', params: { data: { CTRL_SCRIPT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        //   this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //   .then(data => {
        //   }).catch(err => {
        //     console.error(err)
        //   })
        // }, 5000);
      // }
    },
    refreshTreeNode(id) {
      let node = this.$refs.treeRef.getNode(id);
      if (node && node.expanded === false) {
        node.loaded = false;
        node.expand();
      }else{
        node.loaded = false;
        node.expanded = !node.expanded
      }
    },
    freshTreeNode(id) {
      let node = this.$refs.treeRef.getNode(id);
      if (node) {
        node.loaded = false;
        node.expand();
      }
    },
    mappersave(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.ID = ''
      let _data = {
        url: "/dyn-mapper/createBaseComponent", params: {
          data: {
            dbName: "",
            dsName: "",
            tableName: "",
            data: {
              ...this.defaultForm.params,
              TABLE_ID: this.treeselectNode.data.ID
            }
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              this.dialogMapperFormVisible = false
              this.getMapperList()
            }).catch(err => {
              console.error(err)
            }).finally(() => {
              this.destory()
            })
        } else {
          this.$message({
            type: 'error',
            message: '输入数据不能为空'
          });
          this.destory()
        }
      });

    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.ID = ''
      let _data = {
        url: "/dyn-column/createBaseComponent", params: {
          data: {
            dbName: "",
            dsName: "",
            tableName: "",
            data: {
              ...this.defaultForm.params,
              TABLE_ID: this.treeselectNode.data.ID
            }
          }
        }
      }
      if (this.treeselectNode.level === 1) {
        _data = {
          url: "/dyn-table/createBaseComponent", params: {
            data: {
              dbName: "",
              dsName: "",
              tableName: "",
              data: {
                ...this.defaultForm.params,
                DB_ID: this.treeselectNode.data.ID
              }
            }
          }
        }
      } else if (this.treeselectNode.level === 2) {
        _data = {
          url: "/dyn-column/createBaseComponent", params: {
            data: {
              dbName: "",
              dsName: "",
              tableName: "",
              data: {
                ...this.defaultForm.params,
                TABLE_ID: this.treeselectNode.data.ID
              }
            }
          }
        }
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              this.dialogFormVisible = false
              this.freshTreeNode(this.treeselectNode.data.ID)
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
          });
          this.destory()
        }
      });


    },
    destory(hide = false) {
      this.dialogFormVisible = hide
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = ''
        }
      }
    },
    mapperdestory(hide = false) {
      this.dialogMapperFormVisible = hide
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = ''
        }
      }
    },
    add() {
      if(this.treeselectNode.level === 1){
        this.dialogtitle = '表新增'
      }else{
        this.dialogtitle = '列新增'
      }
      this.defaultForm.params = { ID: '' }
      this.$set(this.defaultForm.params,)
      this.cols.map(c => {
        if (c.set) {
          this.$set(this.defaultForm.params, c.field, null)
        }
      })
      if (Object.keys(this.treeselectNode).length > 0 && (this.treeselectNode.level === 2 || this.treeselectNode.level === 1)) {
        this.destory(true)

      } else {
        this.$message({
          type: 'warning',
          message: '请先选择相应的列'
        });
      }
    },
    mapperadd() {
      if (Object.keys(this.treeselectNode).length > 0 && this.treeselectNode.level === 2) {
        this.dialogtitle = '模型新增'
        this.defaultForm.params = { ID: '' }
        this.$set(this.defaultForm.params,)
        this.colsbottom.map(c => {
          if (c.set) {
            this.$set(this.defaultForm.params, c.field, null)
          }
        })
        this.dialogMapperFormVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择相应的列'
        });
      }
    },
    query() {
      this.listQuery.current = 1
      this.getList()
    },
    getMapperList(){
      const _data = {
          url: '/dyn-mapper/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.listbottom = data
            this.listLoadingbottom = false

          })
    },
    getList() {
      // this.treeselectNode = node
      if (this.treeselectNode.level === 1) {
        const _data = {
          url: '/dyn-table/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'DB_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        if(this.searchiptval[this.treeselectNode.data.ID]){
          _data.params.data.sqlWhere.push(
            {
              column: 'TABLE_NAME',
              condition: 'like',
              value: this.searchiptval[this.treeselectNode.data.ID] ? this.searchiptval[this.treeselectNode.data.ID] : ''
            }
          )
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.cols = []
            this.cols = [...this.colsTable]
            this.list = data

          })
      }
      else if (this.treeselectNode.level === 2) {
        const _data = {
          url: '/dyn-column/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.list = data
            this.listLoading = false

          })
      }
    },
    mappersubmit(formName){
      let _data = {
        url: '/dyn-mapper/updateById', params: {
          data: this.defaultForm.params
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              this.dialogMapperFormVisible = false
              this.getMapperList()

            }).catch(err => {
              console.error(err)
            }).finally(() => {
              this.destory()
            })
        } else {
          this.$message({
            type: 'error',
            message: '输入数据不能为空'
          });
          this.destory()
        }
      });
    },
    submit(formName) {
      let _data = {
        url: '/dyn-table/updateById', params: {
          data: this.defaultForm.params
        }
      }
      if (this.treeselectNode.level === 1) {
        _data.url = '/dyn-table/updateById'
      } else if (this.treeselectNode.level === 2) {
        _data.url = '/dyn-column/updateById'
      }


      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              this.dialogFormVisible = false
              this.query()
              this.freshTreeNode(this.treeselectNode.data.ID)
            }).catch(err => {
              console.error(err)
            }).finally(() => {
              this.destory()
            })
        } else {
          this.$message({
            type: 'error',
            message: '输入数据不能为空'
          });
          this.destory()
        }
      });
    },
    mapperedit(row) {
      this.dialogtitle = '模型修改'
      this.defaultForm.params = { ID: '' }
      // this.$set(this.defaultForm.params,)
      this.colsbottom.map(c => {
        if (c.set) {
          this.$set(this.defaultForm.params, c.field, null)
        }
      })
      this.dialogMapperFormVisible = true
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    edit(row) {
      if(this.treeselectNode.level === 1){
        this.dialogtitle = '表修改'
      }else{
        this.dialogtitle = '列修改'
      }
      this.defaultForm.params = { ID: '' }
      this.$set(this.defaultForm.params,)
      this.cols.map(c => {
        if (c.set) {
          this.$set(this.defaultForm.params, c.field, null)
        }
      })
      this.dialogFormVisible = true
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    showDetails(row, column) {
    },
    opentablenamelog(node) {
      this.synchronizationColumnobj['dsName'] = node.data.label
      this.synchronizationColumnobj['dbName'] = node.data.label
      this.synchronizationColumnobj['ID'] = node.data.ID
      this.dialogVisible = true;
    },
    tablenamefresh(node) {
      const _data = {
        url: '/dyn-table/sync', params: {
          data: {
            dsName: node.parent.data.label,
            dbName: node.parent.data.label,
            tableName: node.data.label,
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: "success",
            message: "刷新成功",
          });
          let node1 = this.$refs.treeRef.getNode(node.data.ID);
          node1.expand();
        }).catch(err => {
          console.error(err)
        })
    },
   
    synchronizationColumnsubmit() {
      const _data = {
        url: '/dyn-table/sync', params: {
          data: {
            dsName: this.synchronizationColumnobj.dsName,
            dbName: this.synchronizationColumnobj.dbName,
            tableName: this.synchronizationColumnobj.tableName,
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: "success",
            message: "change success!=>" + data,
          });
          this.refreshTreeNode(this.synchronizationColumnobj.ID)
          this.dialogVisible = false;
          this.synchronizationColumnobj = {
            dsName: '',
            dbName: '',
            tableName: '',
            ID: '',
          }
        }).catch(err => {
          console.error(err)
        })
    },
    renderContent(h, { node, data, store }) {
      if (node.level == 1) {
        return (
          <div class="treetitle">
            <div on-click={() => this.refreshTreeNode(node.data.ID)}>
              <i class="el-icon-coin" />
              <span > {node.label}</span>
            </div>
            <div>
              <el-tooltip offset={0} popper-class="icontooltip" content="同步" effect="light" transition="none" open-delay={600} >
                <el-button class='treebutton' type="text" size="mini" icon="el-icon-plus" on-click={() => this.opentablenamelog(node)} ></el-button>

              </el-tooltip>
            </div>
          </div>
        )
      } else if (node.level == 2) {
        // return (
        // <span class="treetitle">
        //   <i class="el-icon-date" /><span on-click={() => this.refreshTreeNode(node.data.ID)}> {node.label}</span>
        //   <el-tooltip offset={0} popper-class="icontooltip" content="刷新" effect="light" transition="none" open-delay={600} >
        //     <el-button class='treebutton' type="text" size="mini" icon="el-icon-refresh-right" on-click={() => this.tablenamefresh(node)} ></el-button>

        //   </el-tooltip>
        //   <el-tooltip offset={0} popper-class="icontooltip" content="脚本" effect="light" transition="none" open-delay={600} >
        //     <el-button class='treebuttonedit' type="text" size="mini" icon="el-icon-edit" on-click={() => this.myscript('CTRL_SCRIPT', node.data)} ></el-button>

        //   </el-tooltip>

        // </span>)
        return (
          <div class="treetitle">
            <div on-click={() => this.refreshTreeNode(node.data.ID)}>
              <i class="el-icon-date" />
              <span > {node.label}</span>
            </div>
            <div>
              <el-tooltip offset={0} popper-class="icontooltip" content="刷新" effect="light" transition="none" open-delay={600} >
                <el-button class='treebutton' type="text" size="mini" icon="el-icon-refresh-right" on-click={() => this.tablenamefresh(node)} ></el-button>

              </el-tooltip>
              <el-tooltip offset={0} popper-class="icontooltip" content="脚本" effect="light" transition="none" open-delay={600} >
                <el-button class='treebuttonedit' type="text" size="mini" icon="el-icon-edit" on-click={() => this.myscript('CTRL_SCRIPT', node.data)} ></el-button>

              </el-tooltip>
            </div>

          </div>

        )

      } else {
        return (<span class="treetitle"> <i class="el-icon-document-remove" /><span> {node.label}</span></span>)
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
      } else if (node.level === 1) {

        const _data = {
          url: '/dyn-table/query', 
          params: {
            data: {
              sqlWhere: [
                {
                  column: 'DB_ID',
                  condition: '=',
                  value: node.data.ID
                }]
            }
          }
        }

        if(this.searchiptval[node.data.ID]){
          _data.params.data.sqlWhere.push(
            {
              column: 'TABLE_NAME',
              condition: 'like',
              value: this.searchiptval[node.data.ID] ? this.searchiptval[node.data.ID] : ''
            }
          )
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            let arr = []

            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val.TABLE_NAME;
                val.value = val.ID;
                return val
              })
            }


            resolve([...arr])
          })
      } else if (node.level === 2) {
        const _data = {
          url: '/dyn-column/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: node.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            let arr = []

            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val.COLUMN_NAME;
                val.value = val.ID;
                val["isLeaf"] = true;
                return val
              })
            }


            resolve([...arr])
          })
      }
    },
    mouseDown(event) {
      document.addEventListener("mousemove", this.mouseMove);
      this.lastX = event.clientX - 231;
    },
    mouseMove(event) {
      this.lastX = event.clientX - 231;
    },
    mouseUp() {
      this.lastX = "";
      document.removeEventListener("mousemove", this.mouseMove);
    },

    // 拖拽树组件回调
    handleDragStart(node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {

      // console.log('tree drag enter: ', dropNode)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode)
    },
    handleDragOver(draggingNode, dropNode, ev) {
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
    },

    del(index, row) {
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
        confirmButtonText: i18n.t("common.btn.ok"),
        cancelButtonText: i18n.t("common.btn.cancel"),
        type: 'warning'
      }).then(() => {
        const _data = { url: "/dyn-column/deleteById", params: { data: row.ID } }
        if (this.treeselectNode.level === 1) {
          _data.url = '/dyn-table/deleteById'
        } else if (this.treeselectNode.level === 2) {
          _data.url = '/dyn-column/deleteById'
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.list.splice(index, 1)
            this.freshTreeNode(this.treeselectNode.data.ID)
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
    },
    mapperdel(index, row) {
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
        confirmButtonText: i18n.t("common.btn.ok"),
        cancelButtonText: i18n.t("common.btn.cancel"),
        type: 'warning'
      }).then(() => {
        const _data = { url: "/dyn-mapper/deleteById", params: { data: row.ID } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.listbottom.splice(index, 1)
            this.getMapperList()
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
    },



    // 点击树节点回调
    treeNodeClick(node) {
      this.treeselectNode = node
      this.activeName1 = 'first'
      if (node && node.expanded === false) {
        node.loaded = false;
        node.expand();
      }else{
        node.expanded = !node.expanded
      }
      if (node.level === 1) {
        this.tablelabel = '表数据'
        const _data = {
          url: '/dyn-table/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'DB_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        if(this.searchiptval[this.treeselectNode.data.ID]){
          _data.params.data.sqlWhere.push(
            {
              column: 'TABLE_NAME',
              condition: 'like',
              value: this.searchiptval[this.treeselectNode.data.ID] ? this.searchiptval[this.treeselectNode.data.ID] : ''
            }
          )
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            // this.cols = []
            this.cols = this.colsTable
            this.list = data

          })

      } else if (node.level === 2) {
        this.tablelabel = '列数据'

        const _data = {
          url: '/dyn-column/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.cols = []
            this.cols = this.colsColumns
            this.list = data
            this.listLoading = false

          })
        const _data1 = {
          url: '/dyn-mapper/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: this.treeselectNode.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data1)
          .then(data => {
            this.listbottom = data
            this.listLoadingbottom = false
            this.tablebottomshow = true
          })
      }

    },

    // 递归生成菜单树结构数据
    loop(data, id) {
      const res = []
      data.forEach((item => {
        item['children'] = []
        item["leaf"] = false;
        item.label = item.DATABASE_NAME
        item.value = item.ID
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.ID)
        }
        res.push(item)
      }))

      return res
    },
    treeData(data, id) {
      this.loop(data, id)
      return this.loop(data, id)
    },

    // 获取菜单树结构数据
    getMenuTreeData() {
      //  const _data = {url: '/factory/guest/factory-dir'}
      //   this.$store.dispatch('fmsCommon/actionMdmPost', _data).then(data => {
      //     console.log(data)
      //     const newData = this.treeData(data, '0')
      //      this.treeMenuData = newData
      //      this.options = newData
      //      this.defaultShowNodes = [newData[0].id]
      //   })
      const _data = { url: '/dyn-database/query', params: { data: { sqlWhere: [] } } }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          const newData = this.treeData(data, '0')
          this.treeMenuData = newData
          this.options = newData
          // this.defaultShowNodes = [newData[0].id]
        }).catch(err => {
          console.error(err)
        })

    },




    async getMenus() {
      this.listLoading = false
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
    getValueConvert(arr,value){
          for(let v of arr){
            if(v.value ==value )
              {
                return v.label
              }
        }
        return value
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








  }
}
</script>
<style lang="scss">
.icontooltip {
  padding: 4px !important;
}
</style>

<style lang="scss" scoped>
.focusing {
  display: none;
}

::v-deep .treetitle {
  height: 26px;
  line-height: 26px;
  display: flex;
  font-size: 14px;
  .el-input__inner{
    border: 1px solid #9ea0a3;
    height: 18px;
  }
}

::v-deep .treebutton {
  margin-left: 10px;
}

::v-deep .treebuttonedit {
  margin-left: 10px;
}

::v-deep .el-button--mini {
  padding-top: 0px;
  padding-bottom: 0px;
}
::v-deep .el-tabs--border-card {
  box-shadow:none
}

#configMenu {
  display: flex;
  height: 100%;
}

.tree-menu {
  height: 790px;
  overflow-y: scroll;
  /* width: 30%; */
  /* flex: 1; */
  /* margin-right: 10px; */
  border: 1px solid #dfe6ec;
  /* cursor: w-resize; */
}

.midline {
  height: 790px;
  width: 2px;
  /* background-color: black; */
  cursor: w-resize;
}

.container-menu {
  min-width: 35%;
  flex: 1;
  height: 80%;
}

.el-dialog.customStyle {
  width: 80%;
}

.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.el-form-item {
  margin-bottom: 12px;
}

.dialogbox {
  display: flex;
}
</style>
