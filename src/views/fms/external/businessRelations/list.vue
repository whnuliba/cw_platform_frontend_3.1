<template>
  <div id="configMenu" class="app-container" style="width: 100%">
    <div class="tree-menu" :style="{ width: lastX + 'px' }">
      <el-tree ref="treeRef" :data="treeMenuData" node-key="id" :highlight-current='true'
        @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-click="treeNodeClick"
         @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
         :filter-node-method="filterNode"
         :default-expanded-keys="defaultExpandIds" >
        <template v-slot="{ node, data }">
          <div class="treetitle" v-if="node.level == 1">
            <div @click="treeNodeClick(node)">
              <span> {{ node.label }}</span>
            </div>
            <div>
                <el-button title="查询" style="margin-right: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-search"
                  @click.stop="searchtable(node)"></el-button>
              <el-input v-if="searchinputshow == node.data.id" @input.native="tabletreeChange(searchiptval,node)"  class='searchinput' size="mini" v-model="searchiptval[node.data.id]" />
            </div>
          </div>
          <div class="treetitle" v-else>
            <div @click="treeNodeClick(node)">
              <span> {{ node.label }}</span>
            </div>
          </div>
        </template>

      </el-tree>
    </div>
    <div class="midline" @mousedown="mouseDown"></div>

    <div class="container-menu" :style="{ width: `calc(100%-${lastX}px)` }">
      <div class="filter-container">
        <el-button type="warning" class="filter-item" @click="add">
          {{ $t("common.btn.add") }}
        </el-button>
      </div>

      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" height="733px"
        @row-dblclick="showDetails">

        <el-table-column min-width="50px" label="序号" align="center">
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
        <el-table-column align="center" label="操作" fixed="right" width="100">

          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="del(scope.$index, scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button> -->
            <i title="脚本" class="el-icon-tickets"
              @click="myscript('mapper', scope.row)"></i>
            &nbsp;
            <i :title="$t('common.btn.edit')" class="el-icon-edit" @click="edit(scope.row)"></i>
            &nbsp;
            <i :title="$t('common.btn.delete')" class="el-icon-delete" @click="del(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码标签组件 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getMenus" />
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
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
      <el-dialog title="编辑" v-if="dialogFormVisible" v-el-drag-dialog :visible.sync="dialogFormVisible" width="1000px">
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
      <el-drawer :title="'脚本编写'" :visible.sync="scriptsVisible" :direction="'ltr'" :size="'80%'" :withHeader="false"
        :before-close="handleClose">
        <component :is="dtsOfswitch" ref="scriptsEditer" @changeScript="setScript">
        </component>
        <div style="margin-left:42%">
          <el-button @click="scriptsVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: '启动',
        0: '停止'
      }
      return statusMap[status]
    }
  },
  data() {
    const _initdata = {
      scriptObjstr: '',
      scriptOps: {
        scriptValue: '',
        scriptId: ''
      },
      searchinputshow: '',
      searchiptval:{},
      scriptOpsobj: {},
      dialogVisible: false,
      scriptsVisible: false,
      dtsOfswitch: 'script_editer',
      defaultShowNodes: [],
      defaultExpandIds: [],
      treeMenuData: [],
      options: [],
      list: null,
      total: 0,
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
        // dsType: [{ label: '新建连接', value: 1 }, { label: '连接池', value: 2 }, { label: 'INFLUXDB_V1', value: 3 }],
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }]
      },
      listQuery: {
        page: 1,
        limit: 10,
      },
      dialogFormVisible: false,
      listLoading: false,
      cols: [
        { field: 'BIZ_NAME', title: '业务名称', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_CODE', title: '业务编码', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_COMMENT', title: '业务描述', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'PERMISSION', title: '权限标识', minWidth: 80, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'REF_MODEL', title: '引用模型', minWidth: 150, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'PARENT_COLUM', title: '父级字段', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'SON_COLUMN', title: '当前字段', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF1', title: 'UDF1', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF2', title: 'UDF2', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF3', title: 'UDF3', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF4', title: 'UDF4', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF5', title: 'UDF5', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF6', title: 'UDF6', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF7', title: 'UDF7', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
      ],

      lastX: '400',
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  computed: {

  },
  watch: {
    // dialogFormVisible: function (newValue, oldValue) {

    // }
  },
  created() {
    this.getMenuTreeData();
    document.addEventListener("mouseup", this.mouseUp);
  },
  mounted() {
    this.getMenus()
  },
  destroyed() {
    document.removeEventListener("mouseup", this.mouseUp);
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      if (data.pid == '#') return true
      return data.label.indexOf(value) !== -1;
    },
    searchtable(node){
      // this.searchiptval = ''
      this.searchinputshow = node.data.id
    },
    tabletreeChange(val,node){
      this.$refs.treeRef.filter(val[node.data.id])
    },
    handleClose(done) {
      this.$confirm(this.$t('common.btn.sureClose'))
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    saveScript() {
      const _this = this
      let _scripts
      try {
        _scripts = eval("(" + _this.scriptOps.scriptValue + ")")
      } catch (e) {
        this.$message({
          type: 'info',
          message: '脚本解析一次'
        });
        return
      }
        const _data = { url: '/biz-define-relax/updateById', params: { data: { SCRIPT: _this.scriptOps.scriptValue, ID: _this.scriptOps.scriptId } } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.query()
            // let node1 = this.$refs.treeRef.getNode(_this.scriptOpsobj.DB_ID);
            // node1.expand();
            this.scriptsVisible = false
          }).catch(err => {
            console.error(err)
          })
   

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
      
    },
    removeChildrenIds(data) {
      const ts = this
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.defaultExpandIds.indexOf(item.id)
          if (index > 0) {
            ts.defaultExpandIds.splice(index, 1)
          }
          ts.removeChildrenIds(item)
        })
      }
    },
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.defaultExpandIds.some((item, i) => {
        if (item === data.id) {
          this.defaultExpandIds.splice(i, 1)
        }
      })
      this.removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
    },
    handleNodeExpand(data) {
      // 保存当前展开的节点
      let flag = false
      this.defaultExpandIds.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
          flag = true
          return true
        }
      })
      if (!flag) { // 不存在则存到数组里
        this.defaultExpandIds.push(data.id)
      }
    },

    refreshTreeNode(id) {
      const _data = { url: '/biz-define-relax/bizTree', }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          const newData = this.treeData(data.data, '0')
          this.treeMenuData = data.data
          let node = this.$refs.treeRef.getNode(id);

          if (node) {
            // node.loaded = false;
            node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
          }
        }).catch(err => {
          console.error(err)
        })

    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.ID = ''
      let _data = {
        url: "/biz-define-relax/createBaseComponent", params: {
          data: {
            dbName: "",
            dsName: "",
            tableName: "",
            data: {
              ...this.defaultForm.params,
              RELATION_ID: this.treeselectNode.data.id
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
              // this.getMenuTreeData()
              this.query()
              this.refreshTreeNode(this.treeselectNode.data.id)
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
    add() {
      this.defaultForm.params = { ID: '' }
      this.$set(this.defaultForm.params,)
      this.cols.map(c => {
        if (c.set) {
          this.$set(this.defaultForm.params, c.field, null)
        }
      })
      if (Object.keys(this.treeselectNode).length > 0 && this.treeselectNode.level >= 1) {
        this.destory(true)
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

    getList() {
      const _data = {
        url: '/biz-define-relax/query', params: {
          data: {
            sqlWhere: [
              {
                column: 'RELATION_ID',
                condition: '=',
                value: this.treeselectNode.data.id
              }]
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.list = data
          this.listLoading = false

        })
    },
    submit(formName) {
      let _data = {
        url: '/biz-define-relax/updateById', params: {
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
              this.dialogFormVisible = false
              this.query()
              this.refreshTreeNode(this.treeselectNode.data.id)
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
    edit(row) {
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
          this.refreshTreeNode(node.data.id)

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
        return (<span class="treetitle"><span> {node.label}</span></span>)
      } else if (node.level == 2) {
        return (<span class="treetitle"> <span> {node.label}</span></span>)

      } else {
        return (<span class="treetitle"> <span> {node.label}</span></span>)
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
      } else if (node.level === 1) {

        const _data = {
          url: '/dyn-table/query', params: {
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


            resolve([...node.data.children, ...arr])
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
    // loadNode(node, resolve) {
    // if (node.level === 0) {
    //   return resolve([{ name: 'region' }]);
    // }
    // if (node.level >= 1) {
    //   const _data = { url: '/dyn-table/query', params: { data:{"requestData": { "tableName": "", "orderBy": "", "columns": [], "sqlWhere": [] }, "current": 1, "pageSize": 100 } }}
    //   this.$store.dispatch('fmsCommon/actionTaskPost', _data)
    // .then(data => {
    //   console.log(data)
    //   const newData = this.treeData(data.data, '0')
    // }).catch(err => {
    //   console.error(err)
    // })
    // }

    // },
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
    //Cascader change事件
    handleChange(row) {
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
        const _data = { url: "/biz-define-relax/deleteById", params: { data: row.ID } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.list.splice(index, 1)
            this.refreshTreeNode(this.treeselectNode.data.ID)
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
    treeNodeClick(data, node) {
      this.treeselectNode = node
      const _data = {
        url: '/biz-define-relax/query', params: {
          data: {
            sqlWhere: [
              {
                column: 'RELATION_ID',
                condition: '=',
                value: this.treeselectNode?.data.id
              }]
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.list = data
          this.listLoading = false

        })
    },

    // 递归生成菜单树结构数据
    loop(data, id) {
      const res = []
      data.forEach((item => {
        item.label = item.data.BIZ_NAME
        item.value = item.id
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.id)
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
      const _data = { url: '/biz-define-relax/bizTree', }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          const newData = this.treeData(data.data, '0')
          this.treeMenuData = data.data
          this.options = newData
          // this.defaultShowNodes = [newData[0].id]
        }).catch(err => {
          console.error(err)
        })

    },




    async getMenus() {
      this.listLoading = false
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getMenus()
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








  }
}
</script>

<style lang="scss" scoped>
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
::v-deep .treetitle {
  font-size: 14px;
}

::v-deep .treebutton {
  margin-left: 10px;


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
