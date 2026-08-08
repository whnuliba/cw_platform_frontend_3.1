<template>
  <div id="configMenu" class="app-container" style="width: 100%">
    <div>
      <div class="filter-container" :style="{ width: lastX + 'px' }">
          <div style="margin-right: 5px;">角色:</div>
          <el-select filterable v-model="rolevalue" placeholder="请选择角色" @change="rolevaluechange">
            <el-option v-for="item in roleoptions" :key="item.roleCode" :label="item.roleName" :value="item.roleCode">
            </el-option>
          </el-select>
          <el-button class="search-button" type="warning" @click="propertieSave">
            {{ $t("common.btn.save") }}
          </el-button>
        </div>
      <div class="tree-menu" :style="{ width: lastX + 'px' }">
        
        <el-tree ref="treeRef" :data="treeMenuData" node-key="ID" :highlight-current='true'
          :default-expanded-keys="defaultShowNodes" @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd"
          lazy :load="loadNode" :props="treeprops"
          :expand-on-click-node="false" >
          <template  v-slot="{ node, data }">
            <div class="treetitle"  v-if="node.level == 1">
            <div @click="treeNodeClick(node)">
              <i class="el-icon-coin" />
              <span > {{node.label}}</span>
            </div>
            <div>
              <el-button title="查询" style="margin-right: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-search" @click="searchtable(node)" ></el-button>
              <el-input v-if="searchinputshow == node.data.ID" @input.native="tabletreeChange(searchiptval,node)"  class='searchinput' size="mini" v-model="searchiptval[node.data.ID]" />
            </div>
           

          </div>
          <div class="treetitle" v-else-if="node.level == 2">
            <div @click="treeNodeClick(node)">
              <i class="el-icon-date" />
              <span > {{node.label}}</span>
            </div>
            

          </div>
          <div class="treetitle" v-else>
            <div>
              <i class="el-icon-date" />
              <span > {{node.label}}</span>
            </div>
            

          </div>

            <!-- <span class="treetitle" v-else-if="node.level == 2"> <i class="el-icon-date" /><span> {{node.label}}</span></span> -->
            <!-- <span class="treetitle" v-else="node.level == 3"> <i class="el-icon-document-remove" /><span> {{node.label}}</span></span> -->
          </template>
         
          
        </el-tree>
      </div>
    </div>

    <div class="midline" @mousedown="mouseDown"></div>

    <div class="container-menu" :style="{ width: `calc(100%-${lastX}px)` }">


      <el-table ref="multipleTable" v-loading="listLoading" :data="list" border fit highlight-current-row height="790px"
        style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="showDetails">
        <el-table-column type="selection" v-if="treeselectNode.level !== 1" width="55">
        </el-table-column>

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
        <!-- <el-table-column align="left" label="操作" fixed="right" width="280">

          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="del(scope.$index, scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button>

          </template>
        </el-table-column> -->
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
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="synchronizationColumnsubmit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑" v-if="dialogFormVisible" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
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

    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import i18n from '@/lang';

const calendarTypeOptions = [
  { key: 0, display_name: '否' },
  { key: 1, display_name: '是' }
]

export default {
  name: 'RoleProperties',
  components: { Pagination },
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
      renderTable: true,
      dialogVisible: false,
      searchinputshow: false,
      defaultShowNodes: [],
      treeMenuData: [],
      roleoptions: [],
      options: [],
      routes: [],
      MenusList: [],
      list: null,
      total: 0,
      pagesNum: 1,
      rolevalue: '',
      searchiptval: {},
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
      },
      activeName: '1',
      menulevel: {
        MENU_LEVEL: '1'
      },
      tablename: {},
      willediteData: {},
      treeselectNode: {},
      tableData: [],
      selectiontableData: [],
      menuTmpTableData: [],
      itemOptions: [
        // {
        //   key: 'name',
        //   label: '工厂名称',
        //   title: 'name',
        //   // width:100,
        // },
        // {
        //   key: 'code',
        //   label: '工厂编码',
        //   title: 'code',
        //   // width:100,
        // },
      ],


      isGroupDiasble: false,
      isRoot: false,
      initSelect: {
        // dsType: [{ label: '新建连接', value: 1 }, { label: '连接池', value: 2 }, { label: 'INFLUXDB_V1', value: 3 }],
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }]
      },
      listQuery: {
        page: 1,
        limit: 10,
        MENU_PARENT_ID: undefined,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined
      },
      calendarTypeOptions,
      isAble: false,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      checkStrictly: false,
      listLoading: false,
      test:'12312',
      cols: [
        { field: 'COLUMN_NAME', title: '列名', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_TYPE', title: '数据类型', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_LENGTH', title: '数据长度', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_DEFAULT', title: '默认', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'COLUMN_IS_NULL', title: '非空', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      ],
      // colsTable: [
      //   { field: 'BIZ_CODE', title: 'BIZ_CODE', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'TABLE_NAME', title: 'TABLE_NAME', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'TABLE_MAPPER', title: 'TABLE_MAPPER', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'TABLE_TYPE', title: 'TABLE_TYPE', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'TABLE_IS_VIEW', title: 'TABLE_IS_VIEW', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'JDBC_DRIVER', title: 'JDBC_DRIVER', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'JDBC_PASSWORD', title: 'JDBC_PASSWORD', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      // ],
      // colsColumns: [
      //   { field: 'COLUMN_NAME', title: '列名', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'COLUMN_TYPE', title: '数据类型', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'COLUMN_LENGTH', title: '数据长度', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'COLUMN_DEFAULT', title: '默认', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      //   { field: 'COLUMN_IS_NULL', title: '非空', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
      // ],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      lastX: '450',
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  computed: {
    /* routesData() {
                return this.routes
            } */
  },
  watch: {
    // dialogFormVisible: function (newValue, oldValue) {

    // }
    lastX(newValue){
      if(newValue >= 1000){
        this.lastX = 1000
      }
    }
  },
  created() {
    this.selectOption();
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
    tabletreeChange(val,node){
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

            this.$refs.treeRef.updateKeyChildren(node.data.ID, arr)

          })
    },
    searchtable(node){
      // this.searchiptval = ''
      this.searchinputshow = node.data.ID
    },
    rolevaluechange(val) {
      if (this.treeselectNode.level === 2) {
        const _data = {
          url: '/field-role/query-field-role', params: {
            data: {
              tableId: this.treeselectNode.data.ID,
              roleCode: val
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data1 => {
            this.$nextTick(() => {
              this.list.forEach(val => {
                this.$refs.multipleTable.toggleRowSelection(val, false)
                data1.forEach(item => {
                  if (val.ID === item.ID) {
                    this.$refs.multipleTable.toggleRowSelection(val, true)

                  }
                })
              })
            })


          })
      }

    },
    propertieSave() {
      if (this.treeselectNode.level === 2) {

        let params = {
          roleCode: this.rolevalue,
          tableName: this.treeselectNode.data.label,
          tableId: this.treeselectNode.data.ID
        }
        params['fields'] = this.selectiontableData.map(item => {
          return {
            columnName: item.COLUMN_NAME,
            columnId: item.ID,
            tableRoleId: '',
          }
        })

        const _data = {
          url: '/field-role/save-field', params: { data: params }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: "保存成功"
            });
          })
      } else {
        this.$message({
          type: 'warning',
          message: "请选择对应的表"
        });
      }

    },
    handleSelectionChange(val) {     
      this.selectiontableData = val
    },
    selectOption() {
      const _data = { url: "/role/role_all" }
      this.$store.dispatch('fmsCommon/actionAuthPost', _data)
        .then(data => {
          this.roleoptions = data
        }).catch(err => {
          console.error(err)
        })
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
    add() {
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
    query() {
      this.listQuery.current = 1
      this.getList()
    },
    getList() {
      // this.treeselectNode = node
      // if (this.treeselectNode.level === 1) {
      //   const _data = {
      //     url: '/dyn-table/query', params: {
      //       data: {
      //         sqlWhere: [
      //           {
      //             column: 'DB_ID',
      //             condition: '=',
      //             value: this.treeselectNode.data.ID
      //           }]
      //       }
      //     }
      //   }
      //   this.$store.dispatch('fmsCommon/actionTaskPost', _data)
      //     .then(data => {

      //       this.cols = [...this.colsTable]
      //       this.list = data

      //     })
      // }
      // else 
      if (this.treeselectNode.level === 2) {
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
    opentablenamelog(node) {
      this.synchronizationColumnobj['dsName'] = node.data.label
      this.synchronizationColumnobj['dbName'] = node.data.label
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

        }).catch(err => {
          console.error(err)
        })
    },
    synchronizationColumnsubmit() {
      const _data = { url: '/dyn-table/sync', params: { data: this.synchronizationColumnobj } }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: "success",
            message: "change success!=>" + data,
          });
          this.dialogVisible = false;
          this.synchronizationColumnobj = {
            dsName: '',
            dbName: '',
            tableName: '',
          }
        }).catch(err => {
          console.error(err)
        })
    },
    refreshTreeNode(id) {
      let node = this.$refs.treeRef.getNode(id);
      if (node && node.expanded === false) {
        node.loaded = false;
        node.expand();
      }else{
        node.expanded = !node.expanded
      }
    },
    // renderContent(h, { node, data, store }) {
    //   console.log(this)
    //   let _this = this
    //   if (node.level == 1) {
    //     return (
    //       <div class="treetitle">
    //         <div on-click={() => this.refreshTreeNode(node.data.ID)}>
    //           <i class="el-icon-coin" />
    //           <span > {node.label}</span>
    //         </div>
    //         <div>
    //           <el-button class='treebutton' type="text" size="mini" icon="el-icon-search" on-click={() => this.opentablenamelog(node)} ></el-button>
    //           <el-input size="mini" value={this.searchiptval} />
    //         </div>
    //       </div>
    //     )
    //   } else if (node.level == 2) {
    //     return (<span class="treetitle"> <i class="el-icon-date" /><span> {node.label}</span></span>)

    //   } else {
    //     return (<span class="treetitle"> <i class="el-icon-document-remove" /><span> {node.label}</span></span>)
    //   }
    // },
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
    // loadNode(node, resolve) {
    // if (node.level === 0) {
    // console.log(1)
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
        const _data = { url: "/dyn-column/deleteById", params: { data: row.ID } }
        if (this.treeselectNode.level === 1) {
          _data.url = '/dyn-table/deleteById'
        } else if (this.treeselectNode.level === 2) {
          _data.url = '/dyn-column/deleteById'
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.list.splice(index, 1)
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
      let _this = this
      this.treeselectNode = node
      if (node && node.expanded === false) {
        node.loaded = false;
        node.expand();
      }else{
        node.expanded = !node.expanded
      }
      if (node.level === 1) {
        // const _data = {
        //   url: '/dyn-table/query', params: {
        //     data: {
        //       sqlWhere: [
        //         {
        //           column: 'DB_ID',
        //           condition: '=',
        //           value: this.treeselectNode.data.ID
        //         }]
        //     }
        //   }
        // }
        // this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //   .then(data => {

        //     this.cols = [...this.colsTable]
        //     this.list = data

        //   })

      } else if (node.level === 2) {
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
            // this.cols = [...this.colsColumns]
            this.list = data
            this.listLoading = false

            if (this.rolevalue) {
              const _data = {
                url: '/field-role/query-field-role', params: {
                  data: {
                    tableId: this.treeselectNode.data.ID,
                    roleCode: this.rolevalue
                  }
                }
              }
              this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                .then(data1 => {
                  this.$nextTick(() => {
                    _this.list.forEach(val => {
                      this.$refs.multipleTable.toggleRowSelection(val, false)
                      data1.forEach(item => {
                        if (val.ID === item.ID) {
                          _this.$refs.multipleTable.toggleRowSelection(val, true)

                        }
                      })
                    })
                  })


                })
            }

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
  margin-left: 6px;
}

::v-deep .el-button--mini {
  padding-top: 0px;
  padding-bottom: 0px;
}

#configMenu {
  display: flex;
  height: 100%;
}

.tree-menu {

  height: 738px;
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
  min-width: 35%!important;
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

.filter-container {
  align-items: center;
  display: flex;
  padding-left: 5px;
  padding-top: 5px;
  border: 1px solid rgb(223, 230, 236);
  border-bottom: none;
}

.search-button {
  margin-left: 5px;
  /* margin-top:5px; */
}

</style>

