<template>
    <div class="app-container">
      <el-row :gutter="50">
        <el-col :span="12">
          <div class="filter-container">
            <!-- <el-input v-if v-model="listQuery.MENU_NAME" placeholder="菜单编码" style="width: 120px;" class="filter-item"
              @keyup.enter.native="handleFilter" /> -->
              <el-select v-model="listQuery.MENU_PARENT_ID" placeholder="上级菜单" clearable style="width: 150px" class="filter-item">
                <el-option v-for="item in menulevelOptions" :key="item.MENU_ID" :label="item.TITLE" :value="item.MENU_ID" />
              </el-select>
              <el-input v-if v-model="listQuery.TITLE" placeholder="菜单名称" style="width: 120px;" class="filter-item"
              @keyup.enter.native="handleFilter" />
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              {{ $t('table.search') }}
            </el-button>
            <el-button  class="filter-item" type="warning" icon="el-icon-remove" @click="handleClear">
              {{ $t('table.reset') }}
          </el-button>
          </div>
          <el-table :key="tableKey" v-loading="listLoading" :data="MenusList" border fit highlight-current-row
            style="width: 100%;" @row-click="selectrow">
            <el-table-column label="序号" width="50px" align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column v-if="show" label="菜单ID" width="70" prop="MENU_ID" align="center">
              <template slot-scope="{row}">
                <span>{{ row.TABLE_ID }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上级菜单" prop="MENU_PARENT_ID" width="100px" align="center" :formatter="menuparentflag">
            </el-table-column>
            <el-table-column label="菜单编码" width="150" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{ row.MENU_NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="菜单名称" width="150" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{ row.TITLE }}</span>
              </template>
            </el-table-column>
            <el-table-column label="菜单层级" width="100" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <span>{{ row.MENU_LEVEL }}</span>
                </template>
              </el-table-column>
            <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handlecolumnCreate(row)">
                  {{ $t('table.add') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getMenus" />
        </el-col>

        <el-col :span="12">
          <div class="filter-container">
            <el-button  :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download"
          @click="handleDownload">
          {{ $t('table.export') }}
        </el-button>
          </div>
          <el-table :key="1" v-loading="listcolumnLoading" :data="sysmenubuttonData" border fit highlight-current-row
            style="width: 100%;max-height: 540px;overflow: auto;">
            <el-table-column label="序号" width="50" align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column v-if="show" label="按钮ID" width="70" prop="MENU_BUTTON_ID" align="center">
              <template slot-scope="{row}">
                <span>{{ row.MENU_BUTTON_ID }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="show" label="菜单ID" width="70" prop="MENU_ID" align="center">
              <template slot-scope="{row}">
                <span>{{ row.MENU_ID }}</span>
              </template>
            </el-table-column>
            <el-table-column label="按钮编码" width="150" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{ row.MENU_BUTTON_CODE }}</span>
              </template>
            </el-table-column>
            <el-table-column label="按钮名称" width="150" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{ row.MENU_BUTTON_NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" width="50" align="center" >
              <template slot-scope="{row}">
                <span>{{ row.MENU_BUTTON_ORDER }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="50" align="center" >
                <template slot-scope="{row}">
                  <span>{{ row.MENU_BUTTON_STATUS }}</span>
                </template>
              </el-table-column>
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handlecolumnUpdate(row)">
                  {{ $t('table.edit') }}
                </el-button>
                <el-button size="mini" type="danger" @click="handlecolumnDelete(row,$index)">
                  {{ $t('table.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-dialog v-el-drag-dialog :visible.sync="dialogColumnVisible" title="行数据" customClass="customStyle"
        :close-on-click-modal="false">
        <el-form ref="datacolumnForm" :rules="columnrules" :model="tempcolumn" label-position="left" label-width="100px">
          <el-form-item label="按钮ID" prop="MENU_BUTTON_ID">
            <el-input v-model="tempcolumn.TABLE_COLUMN_ID" disabled />
          </el-form-item>
          <el-form-item label="菜单ID" prop="MENU_ID">
            <el-input v-model="tempcolumn.MENU_ID" disabled />
          </el-form-item>
          <el-form-item label="按钮编码" prop="MENU_BUTTON_CODE">
            <el-input v-model="tempcolumn.MENU_BUTTON_CODE" />
          </el-form-item>
          <el-form-item label="按钮名称" prop="MENU_BUTTON_NAME">
            <el-input v-model="tempcolumn.MENU_BUTTON_NAME" />
          </el-form-item>
          <el-form-item label="排序" prop="MENU_BUTTON_ORDER">
            <el-input v-model.number="tempcolumn.MENU_BUTTON_ORDER" />
          </el-form-item>
          <el-form-item label="状态" prop="MENU_BUTTON_STATUS">
            <el-input v-model="tempcolumn.MENU_BUTTON_STATUS" />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button @click="dialogColumnVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createcolumnData():updatecolumnData()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </el-dialog>

    </div>
  </template>

  <script>
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
    import { getMenuList, getMenuListByLevel } from '@/api/menu'
    import { getMenuButtonListByMenuID,createMenuButton,updateMenuButton,deleteMenuButton } from '@/api/menu_button'

    const calendarTypeOptions = [
      { key: '0', display_name: '否' },
      { key: '1', display_name: '是' }
    ]

    const columntypeOptions =[
      {key:'input',display_name: '单行文本'},
      {key:'icon',display_name: '图标'},
      {key:'tag',display_name: '标签'},
      {key:'select',display_name: '下拉菜单'},
      {key:'switch',display_name: '开关'},
      {key:'radio',display_name: '单选框'}
    ]

    const columninputtypeOptions =[
      {key:'text',display_name: '文本'},
      {key:'number',display_name: '数字'}
    ]

    export default {
      name: 'Buttondescription',
      components: { Pagination },
      inject: ['reload'],
      directives: { waves, elDragDialog },
      filters: {
        typeFilter(type) {
          return calendarTypeKeyValue[type],
            goodsclassTypeKeyValue[type]
        }
      },
      data() {
        return {
          MenusList: [],
          sysmenubuttonData:[],
          tableKey: 0,
          total: 0,
          pagesNum: 1,
          activeName: '2',
          menulevel: {
                    MENU_LEVEL: '1'
                },
          menulevelOptions: [],
          show: false,
          query:{},
          listQuery: {
            page: 1,
            limit: 10,
            MENU_PARENT_ID:undefined,
            MENU_LEVEL:undefined,
            MENU_CODE: undefined,
            MENU_NAME: undefined
          },
          calendarTypeOptions,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '新建'
          },
          dialogPvVisible: false,
          pvData: [],
          tempcolumn:{
            MENU_BUTTON_ID: undefined,
            MENU_ID: undefined,
            MENU_BUTTON_CODE: undefined,
            MENU_BUTTON_NAME: undefined,
            MENU_BUTTON_ORDER: undefined,
            MENU_BUTTON_STATUS: undefined
          },
          columnrules:{
            MENU_BUTTON_CODE: [{ required: true, message: '请输入按钮编码', trigger: 'change' }],
            MENU_BUTTON_NAME: [{ required: true, message: '请输入按钮名称', trigger: 'change' }],
            MENU_BUTTON_ORDER: [{ required: true, message: '请输入排序值', trigger: 'change' }],
          },
          E_COMM_RETURN: {
            TYPE: undefined,
            MESSAGE: undefined
          },
          listLoading: true,
          listcolumnLoading:false,
          dialogColumnVisible:false,
          downloadLoading: false
        }
      },
      created() {
        this.getMenuLevelOption()
      },
      mounted() {
        this.getMenus()
      },
      methods: {
        flag: function (row, column) {
          return row.TABLE_FLAG == "0"
            ? "否"
            : row.TABLE_FLAG == "1"
              ? "是"
              : "----";
        },
        getMenuLevelOption() {
                var _this = this
                getMenuListByLevel(this.menulevel).then(response => {
                    for (let i in response.data) {
                        _this.menulevelOptions.push(response.data[i])
                    }
                })
            },
        menuparentflag: function (row, column) {
                let menuparent = undefined
                var _this = this
                _this.menulevelOptions.find((item, index) => {
                    if (row.MENU_PARENT_ID == item.MENU_ID) {
                        return menuparent = item.TITLE;
                    }
                })
                return menuparent
            },
        async getMenus() {
                this.listLoading = true
                let menulist = []
                getMenuList(this.listQuery).then(response => {
                    //循环遍历将对象转成数组
                    for (let i in response.data) {
                        menulist.push(response.data[i])
                    }

                    const {MENU_LEVEL, MENU_PARENT_ID, MENU_NAME, TITLE, page = 1, limit = 10 } = this.listQuery

                    let mockList = menulist.filter(item => {
                        if (this.activeName && item.MENU_LEVEL !== this.activeName) return false
                        if (MENU_PARENT_ID && item.MENU_PARENT_ID !== MENU_PARENT_ID) return false
                        if (MENU_NAME && item.MENU_NAME.indexOf(MENU_NAME) < 0) return false
                        if (TITLE && item.TITLE.indexOf(TITLE) < 0) return false
                        return true
                    })

                    //总行数
                    this.total = mockList.length

                    //分页处理
                    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

                    //加载数据
                    this.MenusList = pageList

                    setTimeout(() => {
                        this.listLoading = false
                    }, 0 * 1000)
                })
            },
        selectrow(row) {
          this.listcolumnLoading = true
          let systablecolumnlist = []
          this.$set(this.query,'MENU_ID',row.MENU_ID)
          getMenuButtonListByMenuID(this.query).then(response => {
            //循环遍历将对象转成数组
            for (let i in response.data) {
              systablecolumnlist.push(response.data[i])
            }

            //加载数据
            this.sysmenubuttonData = systablecolumnlist

            setTimeout(() => {
              this.listcolumnLoading = false
            }, 0 * 1000)
          })
        },
        handleFilter() {
          this.listQuery.page = 1
          this.getMenus()
        },
        resetColumnTemp() {
          this.tempcolumn = {
            MENU_BUTTON_ID: undefined,
            MENU_ID: undefined,
            MENU_BUTTON_CODE: undefined,
            MENU_BUTTON_NAME: undefined,
            MENU_BUTTON_ORDER: undefined,
            MENU_BUTTON_STATUS: undefined
          }
        },
        handlecolumnCreate(row) {
          this.resetColumnTemp()
          this.dialogStatus = 'create'
          this.dialogColumnVisible = true
          this.tempcolumn.MENU_ID=row.MENU_ID
          this.tempcolumn.MENU_BUTTON_STATUS='0'
          this.$nextTick(() => {
            this.$refs['datacolumnForm'].clearValidate()
          })
        },
        createcolumnData() {
          this.$refs['datacolumnForm'].validate((valid) => {
            if (valid) {
                createMenuButton(this.tempcolumn).then(response => {
                if (response.data.E_COMM_RETURN.TYPE === 'S') {
                  this.sysmenubuttonData.push(this.tempcolumn)
                  this.dialogColumnVisible = false
                  this.$notify({
                    title: '成功',
                    message: response.data.E_COMM_RETUR.MESSAGE,
                    type: 'success',
                    duration: 2000
                  })
                  this.resetColumnTemp()
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.data.E_COMM_RETURN.MESSAGE,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
            }
          })
        },
        handlecolumnUpdate(row) {
          this.tempcolumn = Object.assign({}, row) // copy obj
          this.tempcolumn.MENU_ID=row.MENU_ID
          this.dialogStatus = 'update'
          this.dialogColumnVisible = true
          this.$nextTick(() => {
            this.$refs['datacolumnForm'].clearValidate()
          })
        },
        updatecolumnData() {
          this.$refs['datacolumnForm'].validate((valid) => {
            if (valid) {
              const tempData = Object.assign({}, this.tempcolumn)
              updateMenuButton(tempData).then((response) => {
                if (response.data.E_COMM_RETURN.TYPE === 'S') {
                  const index = this.sysmenubuttonData.findIndex(v => v.MENU_BUTTON_ID === this.tempcolumn.MENU_BUTTON_ID)
                  this.sysmenubuttonData.splice(index, 1, this.tempcolumn)
                  this.dialogColumnVisible = false
                  this.$notify({
                    title: '成功',
                    message: response.data.E_COMM_RETURN.MESSAGE,
                    type: 'success',
                    duration: 2000
                  })
                  this.resetColumnTemp()
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.data.E_COMM_RETURN.MESSAGE,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
            }
          })
        },
        handlecolumnDelete(row, index) {
          this.$confirm('确认执行操作?', this.$t('common.btn.hint'), {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tempcolumn = Object.assign({}, row)
            deleteMenuButton(this.tempcolumn).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.sysmenubuttonData.splice(index, 1)
            })
          })
        },
        handleDownload() {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['表行ID', '父级ID', '表头标题', '表头KEY', '组件类型', '组件宽度', '显示', '排序']
            const filterVal = ['TABLE_COLUMN_ID', 'TABLE_ID', 'COLUMN_TITLE', 'COLUMN_KEY', 'COLUMN_TYPE', 'COLUMN_WIDTH', 'COLUMN_SHOW', 'COLUMN_ORDER']
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '动态表单'
            })
            this.downloadLoading = false
          })
        },
        formatJson(filterVal) {
          return this.systablecolumnData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
        handleClear() {
                this.listQuery = {
                    page: 1,
                    limit: 10,
                    MENU_PARENT_ID:undefined,
            MENU_LEVEL:undefined,
            MENU_CODE: undefined,
            MENU_NAME: undefined
                }
            }
      }
      }
  </script>

<style>
  .el-dialog.customStyle {
      width: 80%;
      height: 100%;
  }
  .el-dialog__body {
        border-top: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }
</style>
