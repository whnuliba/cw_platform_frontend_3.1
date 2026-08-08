/*
 * @CreatAuthor: ypl
 * @UpdateAuthor: (...)
 * @Description: 线边仓管理- 线边仓
 */
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="warning" class="filter-item" @click="add" >
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table 
      v-loading="listLoading" 
      :data="list" 
      border 
      fit 
      highlight-current-row style="width: 100%" 
      @row-dblclick="showDetails" 
      row-key="id"
      :expand-row-keys='expandkeys'
      @expand-change="expandchange"
      >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table 
          :data="expandData" 
          border 
          highlight-current-row style="width: 100%" 
          >
            <el-table-column v-for="(item) in expandcolums" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{commonFilter(row[item.field],item.field)}}
              </template>
            </el-table-column>
            <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          &nbsp;
          <el-button type="warning" size="small" icon="el-icon-edit" @click="childrendel(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="openmodalposition(scope.row)">
            添加仓位
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
          &nbsp;
          <el-button type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="100px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="defaultForm.params[item.field]" style="width: 200px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
            <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择" style="width: 200px">
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleposition"
      width="30%"
      >
      <el-form ref="defaultForm.params" :inline="true" :model="expandobj" label-width="100px">
        <div v-for="(item) in expandcolums" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="expandobj[item.field]" style="width: 200px" />
          </el-form-item>
          
         
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleposition = false">取 消</el-button>
        <el-button type="primary" @click="addposition()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  export default {
    name: 'lineside',
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
        dialogFormVisible: false,
        dialogVisibleposition: false,
        queryParams: {
          requestData: {}
        },
        initSelect: {
          protocol: [],
          useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }]
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
          }
        },
        expandData:null,
        expandkeys:null,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        expandcolums:[
          {field: 'locNo', title: '库位编号', minWidth: 100, align: "center",queryType: 'input', set: true},
          {field: 'locName', title: '库位名称', minWidth: 100, align: "center",queryType: 'input', set: true},
          {field: 'locDsc', title: '库位描述', minWidth: 100, align: "center",queryType: 'input', set: true},
        ],
        expandobj:{
          locNo:'',
          locName:'',
          locDsc:'',
          // id:'',
          whId:'',
        },
        cols: [
          { field: 'whId', title: '中心仓ID', minWidth: 100, align: "center", query: true, queryType: 'select', set: true },
          { field: 'stockAreaId', title: '存货区域ID', minWidth: 100, align: "center",queryType: 'input', set: true , query: true},
          { field: 'qty', title: '数量', minWidth: 100, align: "center", queryType: 'input', set: true },
          { field: 'pn', title: '品号', minWidth: 100, align: "center", queryType: 'input', set: true , query: true},

        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.getList()
      this.getlineData()
      // this.selectOptions()
    },
    watch:{
      dialogVisibleposition:function (newValue,oldValue){
        if(newValue == false) {
          this.expandobj = {
            locNo:'',
            locName:'',
            locDsc:'',
            // id:'',
            whId:'',
          }
        }
         
      },
    },
    methods: {
      expandchange(r,expandedRows){
        if (expandedRows.length) {
          this.expandkeys = [];
        if (r) {
          this.expandkeys.push(r.id);
        }
      } else {
        this.expandkeys = [];
      }
        const _data = { url: '/warehouse-location/guest/get-warehouse-location', params: {data:r.id}}
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.expandData = data
          }).catch(err => {
            console.error(err)
          })
      },
      addposition(){
        const _data = { url: '/warehouse-location/add', params: {data:this.expandobj} }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
            });
            this.dialogVisibleposition = false
            if(this.expandkeys.length){
               const _data = { url: '/warehouse-location/guest/get-warehouse-location', params: {data:this.expandkeys[0]}}
              this.$store.dispatch('fmsCommon/actionWmsPost', _data)
              .then(data => {
                this.expandData = data
              }).catch(err => {
                console.error(err)
              })
            }
           
          }).catch(err => {
            console.error(err)
          }).finally(() => {
          })
            
         
      },
      openmodalposition(val){
        this.dialogVisibleposition = true;
        // this.expandobj.id = val.id;
        this.expandobj.whId = val.id;
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

        // if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
        //   return this.getValueConvert(this.initSelect[type], value)
        // }
        // if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
        //   return this.initSelect[type][value]
        // }
        return value
      },
       getlineData(){
        const _data = { url: '/warehouse/list', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.initSelect['whId'] = data.data.map(item =>{
              let obj = {
                label:item.whName,
                value:item.id,
              }
              return obj
            })
            
          }).catch(err => {
            console.error(err)
          })
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/line-warehouse/list', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
            console.error(err)
          })
        //   httpUtils.actionWmsPost('/line/list',this.listQuery).then(data => {
        //       console.log(data)
        //   })
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
          url: '/line-warehouse/edit', params: {
            data: this.defaultForm.params
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionWmsPost', _data)
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
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (let p in this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      // selectOptions() {
      //   //初始通讯协议
      //   let _data = { url: '/constant/protocol-type', params: {} }
      //   this.$store.dispatch('fmsCommon/actionWmsPost', _data)
      //     .then(data => {
      //       this.initSelect.protocol = data.map(c => {
      //         return {
      //           label: c.name,
      //           value: c.value
      //         }
      //       })
      //     }).catch(err => {
      //       console.error(err)
      //     })

      //   //初始化工序信息
      // },
      save(formName) {
        this.defaultForm.row = {}
        // this.defaultForm.params.id = ''
        let _data = { url: '/line-warehouse/add', params: { data: this.defaultForm.params } }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionWmsPost', _data)
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
      del(index, row) {
        this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/line-warehouse/del', params: { data: row.id } }
          let a1 = this.$store.dispatch('fmsCommon/actionWmsPost', _data)
            .then(data => {
             
            }).catch(err => {
              console.error(err)
            })
          const _data1 = { url: '/warehouse-location/guest/del-warehouse-location-by-whid', params: { data: row.id } }
          let a2 = this.$store.dispatch('fmsCommon/actionWmsPost', _data1)
            .then(data => {
              
            }).catch(err => {
              console.error(err)
            })
             Promise.all([a1,a2]).then(res=>{
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
      childrendel(index, row){
         this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/warehouse-location/del', params: { data: row.id } }
          this.$store.dispatch('fmsCommon/actionWmsPost', _data)
            .then(data => {
              this.expandData.splice(index, 1)
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
