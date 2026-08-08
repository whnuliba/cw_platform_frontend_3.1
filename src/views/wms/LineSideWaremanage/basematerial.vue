/*
 * @CreatAuthor: ypl
 * @UpdateAuthor: (...)
 * @Description: 线边仓管理- 基础物料
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
      <el-button type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

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
      <el-table-column align="left" label="操作" width="500">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-notebook-1" @click="clickmaterials(scope.row)">
            {{ $t("common.btn.mproperties") }}
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-notebook-1" @click="clicklwi(scope.row)">
            {{ $t("common.btn.lwinformation") }}
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
          &nbsp;
          <el-button type="warning"  size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisibleadd" width="700px">
      <el-tabs v-model="activeName" @tab-click="handleClick">

       <el-tab-pane label="物料信息" name="first">
          <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="100px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="defaultForm.params[item.field]" :disabled='item.disabled' style="width: 200px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='selectforce'" :label="item.title">
            <el-select v-model="defaultForm.params[item.field]"  placeholder="请选择" style="width: 200px"  >
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                          @click.native="forceUpdate(item)"
                         >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title" >
            <el-select v-model="defaultForm.params[item.field]"  placeholder="请选择" style="width: 200px"  >
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
       </el-tab-pane>
      <el-tab-pane label="物料属性" name="second">
          <el-form ref="MaterialProperties" :inline="true" :model="MaterialProperties" label-width="100px">
        <div v-for="(item) in arrMaterialProperties" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input  v-model="MaterialProperties[item.field]" :disabled='item.disabled' style="width: 200px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='selectforce'" :label="item.title">
            <el-select v-model="MaterialProperties[item.field]"  placeholder="请选择" style="width: 200px"  >
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                          @click.native="forceUpdate(item)"
                         >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
            <el-select v-model="MaterialProperties[item.field]"  placeholder="请选择" style="width: 200px"  >
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
        </el-tab-pane>
       </el-tabs>
      
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <!-- 线仓信息 -->
    <el-dialog
      title="线仓信息"
      :visible.sync="dialogVisiblelwi"
      width="30%"
      >
      <div>
        <div class="box">
          <div class="boxleft">线仓编号:</div>
          <div class="boxright">{{linehousemodalData.whNo}}</div>
        </div>
        <div class="box">
          <div class="boxleft">线仓名称:</div>
          <div class="boxright">{{linehousemodalData.whName}}</div>
        </div>
        <div class="box">
          <div class="boxleft">描述:</div>
          <div class="boxright">{{linehousemodalData.whDsc}}</div>
        </div>
        <div class="box">
          <div class="boxleft">线仓位置:</div>
          <div class="boxright">{{linehousemodalData.whAddr}}</div>
        </div>
        <div class="box">
          <div class="boxleft">线仓类型:</div>
          <div class="boxright">{{linehousemodalData.whType}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblelwi = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 物料信息 -->
    <el-dialog
      title="物料信息"
      :visible.sync="dialogVisiblematerials"
      width="30%"
      >
      <div>
        <div class="box">
          <div class="boxleft">重量:</div>
          <div class="boxright">{{MaterialPropertiesmodalData.weight}}</div>
        </div>
        <div class="box">
          <div class="boxleft">宽度:</div>
          <div class="boxright">{{MaterialPropertiesmodalData.width}}</div>
        </div>
        <div class="box">
          <div class="boxleft">长度:</div>
          <div class="boxright">{{MaterialPropertiesmodalData.length}}</div>
        </div>
        <div class="box">
          <div class="boxleft">高度:</div>
          <div class="boxright">{{MaterialPropertiesmodalData.height}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblematerials = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import {getUser} from '@/api/users'

  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  export default {
    name: 'basematerial',
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
        dialogVisiblelwi: false,
        dialogVisiblematerials: false,
        dialogFormVisibleadd: false,
        activeName: 'first',
        MaterialPropertiesmodalData: '',
        queryParams: {
          requestData: {}
        },
        initSelect: {
          protocol: [],
          abcCate: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }]
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
          }
        },
        MaterialProperties:{
          weight:'',  
          width:'', 
          length:'', 
          height:'',
          pn:'',
        },
        arrMaterialProperties:[
          // { field: 'pn', title: '物料编号', minWidth: 100, align: "center", query: true, queryType: 'input', set: true,disabled:true },
          { field: 'weight', title: '重量', minWidth: 100, align: "center", query: true, queryType: 'input', set: true },
          { field: 'width', title: '宽度', minWidth: 100, align: "center", query: true, queryType: 'input', set: true },
          { field: 'length', title: '长度', minWidth: 100, align: "center", query: true, queryType: 'input', set: true },
          { field: 'height', title: '高度', minWidth: 100, align: "center", query: true, queryType: 'input', set: true },

        ],
        linehousemodalData:{},
        list: null,
        total: 0,
        lineData: [],
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          { field: 'lotNo', title: '批次号', minWidth: 100, align: "center", query: true, queryType: 'input', set: true },
          { field: 'pn', title: '品号', minWidth: 100, align: "center",queryType: 'input', set: true, query: true, },
          { field: 'pnName', title: '品号名称', minWidth: 100, align: "center", queryType: 'input', set: true },
          { field: 'pnDsc', title: '品号描述', minWidth: 100, align: "center", queryType: 'input', set: true },
          { field: 'supplierNo', title: '供应商编号', minWidth: 100, align: "center", queryType: 'input', set: true, query: true, },
          { field: 'whName', title: '线仓名称', minWidth: 100, align: "center", queryType: 'selectforce', set: true },
          { field: 'whNo', title: '线仓编号', minWidth: 100, align: "center", queryType: 'input', set: true ,disabled:true, query: true, },
          { field: 'abcCate', title: 'ABC分类', minWidth: 100, align: "center", queryType: 'select', set: true ,},
          { field: 'minPack', title: '最小包装', minWidth: 100, align: "center", queryType: 'input', set: true },
          { field: 'packSpec', title: '包装规格', minWidth: 100, align: "center", queryType: 'input', set: true },
         

        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.getList();
      this.getlineData()
    },
    watch: {
    },
    methods: {
    
      clickmaterials(v){
        this.dialogVisiblematerials = true;
        const _data = { url: '/material-attr/guest/get-material-attr', params: {data:v.pn} }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            if(data.length > 0){
              this.MaterialPropertiesmodalData = data[0]
            }
          }).catch(err => {
            console.error(err)
          })
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      clicklwi(v){
        this.dialogVisiblelwi = true;
        const _data = { url: '/warehouse/guest/get-warehouse', params: {data:v.whNo} }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            if(data.length > 0){
              this.linehousemodalData = data[0]
            }
          }).catch(err => {
            console.error(err)
          })
      },
      forceUpdate(v){
        this.defaultForm.params['whName'] = v.label
        this.defaultForm.params['whNo'] = v.value
      },
      getlineData(){
        const _data = { url: '/warehouse/list', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.initSelect['whName'] = data.data.map(item =>{
              let obj = {
                label:item.whName,
                value:item.whNo,
              }
              return obj
            })
            
          }).catch(err => {
            console.error(err)
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
      commonFilter(value, type) {

        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/material/list', params: this.queryParams }
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
        this.dialogFormVisibleadd = hide
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }
      },
      add() {
         this.dialogFormVisibleadd = true;
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }
        for (let p in this.MaterialProperties) {
          if (this.MaterialProperties.hasOwnProperty(p)) {
            this.MaterialProperties[p] = ''
          }
        }
      },
      showDetails(row, column) {
      },
      edit(row) {
        this.dialogFormVisibleadd = true
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = row[p]
          }
        }
        const _data = { url: '/material-attr/guest/get-material-attr', params: {data:row.pn} }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            if(data.length > 0){
              this.MaterialProperties = data[0]
            }
          }).catch(err => {
            console.error(err)
          })
      },
      submit(formName) {
        const _data = {
          url: '/material/edit', params: {
            data: this.defaultForm.params
          }
        }
        const _data1 = {
          url: '/material-attr/guest/modify-material-attr', params: {
            data: this.MaterialProperties
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let a1 = this.$store.dispatch('fmsCommon/actionWmsPost', _data)
              .then(data => {
                
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
            let a2 = this.$store.dispatch('fmsCommon/actionWmsPost', _data1)
              .then(data => {
                
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
            Promise.all([a1,a2]).then(res=>{
                 this.$message({
                  type: 'success',
                  message: 'change success!'
                });
                this.dialogFormVisibleadd = false;

                this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                  for (let p in this.defaultForm.params) {
                    if (this.defaultForm.params.hasOwnProperty(p)) {
                      this.defaultForm.params[p] = ''
                    }
                  }
                  for (let p in this.MaterialProperties) {
                    if (this.MaterialProperties.hasOwnProperty(p)) {
                      this.MaterialProperties[p] = ''
                    }
                  }
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
     
      save(formName) {
        this.defaultForm.row = {}
        this.defaultForm.params.id = ''
        let _data = { url: '/material/add', params: { data: {...this.defaultForm.params,createUser:sessionStorage.getItem('userInfo')} } }
        let _data1 = { url: '/material-attr/add', params: {data:{...this.MaterialProperties,pn:this.defaultForm.params.pn}} }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let a1 = this.$store.dispatch('fmsCommon/actionWmsPost', _data)
              .then(data => {
                // this.$message({
                //   type: 'success',
                //   message: 'change success!=>' + data
                // });
                // this.dialogFormVisible = false
                // this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
            let a2 = this.$store.dispatch('fmsCommon/actionWmsPost', _data1)
              .then(data => {
                // this.$message({
                //   type: 'success',
                //   message: 'change success!=>' + data
                // });
                // this.dialogFormVisible = false
                // this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                this.destory()
              })
              Promise.all([a1,a2]).then(res=>{
                 this.$message({
                  type: 'success',
                  message: 'change success!'
                });
                this.dialogFormVisibleadd = false;

                this.query()
              }).catch(err => {
                console.error(err)
              }).finally(() => {
                  for (let p in this.defaultForm.params) {
                    if (this.defaultForm.params.hasOwnProperty(p)) {
                      this.defaultForm.params[p] = ''
                    }
                  }
                  for (let p in this.MaterialProperties) {
                    if (this.MaterialProperties.hasOwnProperty(p)) {
                      this.MaterialProperties[p] = ''
                    }
                  }
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
          const _data = { url: '/material/del', params: { data: row.id } }
          this.$store.dispatch('fmsCommon/actionWmsPost', _data)
            .then(data => {
              this.list.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'delete success!'
              });
            }).catch(err => {
              console.error(err)
            })
          const _data1 = { url: '/material-attr/guest/del-material-attr', params: { data: row.pn } }
          this.$store.dispatch('fmsCommon/actionWmsPost', _data1)
            .then(data => {
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
  .box {
    padding: 0px 10px 0px 0px;
    border: 1px solid lightgray;
    display: flex;
  }
  .boxleft{
    border-right: 1px solid lightgray;
    background-color: rgb(250,250,250);
    padding: 10px;
    width: 100px;
    color:rgb(147,147,153)
  }
  .boxright{
    padding: 10px;
  }
::v-deep .el-dialog__body {
    padding-top: 0px!important;
}
</style>
