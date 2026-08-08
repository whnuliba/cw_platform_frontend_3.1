<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <div v-for="(item, index) in cols" :key="'search'+index" style="display:inline">
        <el-input v-if="item.query && item.queryType === 'input'" v-model="queryParams.requestData.sqlWhere[0][item.field]"
          :placeholder="item.title" style="width: 120px" class="filter-item">
        </el-input>
        <el-select v-if="!item.hide&&item.query && item.queryType === 'select'"
          v-model="queryParams.requestData.sqlWhere[0][item.field]" :placeholder="item.title" style="width: 120px"
          class="filter-item">
          <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.title" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="!item.hide&&item.query && item.queryType === 'datetime'" format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
          :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
        <el-date-picker v-if="!item.hide&&item.query && item.queryType === 'date'" format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
          :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
        <el-input v-if="!item.hide&&item.query && item.queryType === 'input'" v-model="searchobj[item.field]"
          :placeholder="item.title" style="width: 180px" class="input-with-select ">
        </el-input>
        <el-dropdown trigger="click" v-if="!item.hide&&item.query" >
          <span class="dropdownicon el-dropdown-link"><i class="el-icon-arrow-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v, i) in conditionarr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]" :label="v.value">{{ v.field }}</el-radio></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button type="primary"  @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info"  @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="warning"  @click="add" >
        {{ $t("common.btn.add") }}
      </el-button>
    </div> -->
    <SqlSearchIndex :key="keyC" :tableColumns="cols" 
    :btnShow="btnShow" 
    :btnAddShow="btnAddShow" 
    @queryOnsearch="queryOnsearch" @add="add"/>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
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
      <el-table-column align="center" label="操作" fixed="right" width="280">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} 
          <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
          
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{ btnCode: 'fms_task_external_add' }" icon="el-icon-edit"
            @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
          <el-button type="primary" size="small" v-ele-show="{ btnCode: 'fms_task_external_add' }" icon="el-icon-edit"
            @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
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
              <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label" :value="item.value">
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
      <component :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript">
      </component>
      <div style="margin-left:42%">
        <el-button @click="scriptsVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="saveScript()"> {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-drawer>
    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer
            v-model="selectColumn.fields"
            :titles="['源字段', '目标字段']"
            :data="selectColumn.colMap"
          />
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import SqlSearchIndex from "@/components/searchCommon/sqlSearchIndex"
import script_editer from '../components/script-editer'

export default {
  name: 'BusinessDefinition',
  components: { Pagination, script_editer,SqlSearchIndex },
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
      btnShow: false,
      btnAddShow: true,
      keyC: false,
      dialogFormVisible: false,
      scriptsVisible: false,
      dialogSelectFieldVisible: false,
      selectColumn: {
        origin: {},
        fields: [],
        colMap: []
      },
      selectViewCol: [],
      dtsOfswitch: 'script_editer',

      scriptsEditer: '',
      scriptOps: {
        scriptValue: '',
        scriptId: ''
      },
      searchobj: {

      },
      matchobj: {

      },
      queryParams: {
        requestData: {
          tableName: '',
          orderBy: '',
          columns: [],
          sqlWhere: [],
        }
      },
      initSelect: {
        // dsType: [{ label: '新建连接', value: 1 }, { label: '连接池', value: 2 }, { label: 'INFLUXDB_V1', value: 3 }],
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }]
      },
      defaultForm: {
        row: {},
        params: {
          ID: '',
        }
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      conditionarr:[
        {field: '匹配',value:'like'},
        {field: '等于',value:'='},
      ],
      cols: [
        { field: 'BIZ_NAME', title: '业务名称', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true,hide:false },
        { field: 'BIZ_CODE', title: '业务编码', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true,hide:false },
        { field: 'BIZ_COMMENT', title: '业务描述', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true,hide:false },
        { field: 'PERMISSION', title: '权限标识', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true,hide:false },
        // { field: 'STATUS', title: 'STATUS', align: 'center', queryType: 'input', set: true, require: false, query: true,hide:false },
      ],

    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.initCustomVol(data => {
      if (data && data.length > 0) {
        const fds = data.map(c => c.item)
        this.cols.forEach(item => {
          if (fds.indexOf(item.field) >= 0) {
            item.hide = false
          } else {
            item.hide = true
          }
        })
      }
    })
    this.cols.forEach(item => {
      if (item.query) {
          this.btnShow = true;
      }
    })
    this.getList()
    this.selectOptions()
  },

  methods: {
    saveSelectField() {
      const fields = {}
      // this.currScripts.cols.forEach(item=>{
      //    if(item.export){
      //      fields[item.field] = item.title
      //    }
      // })
      const arr = []
      this.selectViewCol.length = 1
      this.selectColumn.fields.forEach(item => {
        if (this.selectColumn.origin[item]) {
          fields[item] = this.selectColumn.origin[item]
          arr.push({ item: item })
          this.selectViewCol.push(item)
        }
      })

      if (this.selectColumn.fields.length == 0) {
        this.$message({
          type: 'info',
          message: '没有选择字段'
        })
        return
      }
      this.dialogSelectFieldVisible = false
          this.cols.forEach(item => {
            if (this.selectViewCol.indexOf(item.field) >= 0) {
              item.hide = false
            } else {
              item.hide = true
            }
          })
    
    },
    initCustomVol(callback) {
      let data = []
            callback(data)
    },
    selectFields() {
      this.dialogSelectFieldVisible = true
      this.initCustomVol((data) => {
        this.selectColumn.colMap = []
        this.selectColumn.fields = []
        this.selectColumn.origin = {}
        this.selectColumn.fields = data.map(c => c.item)
        this.cols.forEach(item => {
          this.selectColumn.origin[item.field] = item.title
          this.selectColumn.colMap.push({
            key: item.field,
            label: item.title,
            disabled: false
          })
        })
      })
    },
    handleClose(done) {
      this.$confirm(this.$t('common.btn.sureClose'))
        .then(_ => {
          done();
        })
        .catch(_ => { });
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

    getList(za, pa) {
       //if (Object.values(this.searchobj).length > 0) {
        // let arrsql = Object.keys(this.searchobj).map(item => {
        //   return {
        //     column: item,
        //     condition: this.matchobj[item] ? this.matchobj[item] : '',
        //     value: this.searchobj[item] ? this.searchobj[item] : ''
        //   }
        // })

        // let aa = arrsql.every(item => item.value.length === 0)
        // this.queryParams.requestData.sqlWhere = aa ? [] : arrsql;
        //}
        this.listLoading = true
        let params = pa ? pa : {
          requestData: {
            tableName: '',
            orderBy: '',
            columns: [],
            sqlWhere: [],
          }
        };
        Object.assign(params, this.listQuery)
      const _data = { url: '/biz-define/queryPage', params: params }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
        }).catch(err => {
          console.error(err)
        })
      //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
    },
    setScript(data) {
      this.scriptOps.scriptValue = data
    },
    myscript(row) {
      this.scriptOps.scriptValue = ''
      this.scriptsEditer = row.id
      this.scriptsVisible = true
      this.scriptOps.scriptId = row.id
      this.$nextTick(function () {
        this.$refs.scriptsEditer.initScript(row.id)
      })

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
      if (!_scripts.sql || !_scripts.totalSql) {
        this.$message({
          type: 'info',
          message: '没有配置数据源脚本'
        });
        return
      }
      const dsText = JSON.stringify({ sql: _scripts.sql, totalSql: _scripts.totalSql })
      const _data = { url: '/external/save-script', params: { data: { scripts: _this.scriptOps.scriptValue, id: _this.scriptOps.scriptId, dsText: dsText } } }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          });
          this.scriptsVisible = false
        }).catch(err => {
          console.error(err)
        })
    },
    getValueConvert(arr, value) {
      for (let v of arr) {
        if (v.value == value) {
          return v.label
        }
      }
      return value
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
      this.destory(true)
    },
    showDetails(row, column) {
    },
    edit(row) {
      this.dialogFormVisible = true
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    submit(formName) {
      const _data = {
        url: '/biz-define/updateById', params: {
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
              this.queryOnsearch()
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
    queryOnsearch(za, pa) {
      this.listQuery.current = 1
      this.getList(za, pa)
    },
    reset() {
      // for (let p in this.searchobj) {
      //   if (this.searchobj.hasOwnProperty(p)) {
      //     this.searchobj[p] = ''
      //   }
      // }
      // for (let p in this.matchobj) {
      //   if (this.matchobj.hasOwnProperty(p)) {
      //     this.matchobj[p] = ''
      //   }
      // }
      this.matchobj = {}
      this.searchobj = {}
     // this.queryParams.requestData.sqlWhere = []
    },
    selectOptions() {
      //    //初始化线体信息
      //    let _data = {url:'/constant/tool-type',params:{}}
      //    this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      //   .then(data => {
      //        this.initSelect.trayType = data.map(c=>{
      //          return {
      //            label:c.name,
      //            value:c.value
      //          }
      //        })
      //    }).catch(err => {
      //       console.error(err)
      //    })

      //初始化工序信息
    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.ID = ''
      let _data = { url: '/biz-define/createBaseComponent', params: {
          data: {
            dbName: "",
            dsName: "",
            tableName: "",
            data: {
              ...this.defaultForm.params,
            }
          }
        }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              this.dialogFormVisible = false
              this.queryOnsearch()
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
    del(index, row) {
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
        confirmButtonText: i18n.t("common.btn.ok"),
        cancelButtonText: i18n.t("common.btn.cancel"),
        type: 'warning'
      }).then(() => {
        const _data = { url: '/biz-define/deleteById', params: { data: row.ID } }
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
    }
  }
}
</script>

<style lang="less" scoped>
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

::v-deep .el-input-group__append {
  width: 18px;
  border: 1px solid #0370AA;
  border-left: none;
  background-color: white;
}




.dropdownicon{
  display: inline-block;
  height:36px;
  border: 1px solid #0370AA;
  border-left: none;
  border-radius: 0 3px 3px 0;
  line-height: 34px;
  margin-right:10px;
  padding:0 10px;

}
::v-deep .el-input__inner:hover {
  border: 1px solid #0370AA;
}
.dropdownicon:hover{
  /* border: 1px solid #DCDFE6; */
  /* border-left: none; */
  cursor:pointer;
}
</style>
