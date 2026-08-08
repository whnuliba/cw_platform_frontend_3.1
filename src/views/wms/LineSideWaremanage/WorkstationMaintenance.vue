/*
 * @CreatAuthor: ypl
 * @UpdateAuthor: (...)
 * @Description: 线边仓管理-工位库维护
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
        <el-select v-if="item.query && item.queryType==='selectforce'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
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
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column  width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip :formatter="formatterr" >
        <!-- <template slot-scope="{row}">
          {{commonFilter(row[item.field],item)}}
        </template> -->
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
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
            <el-input v-model="defaultForm.params[item.field]" :disabled='item.disabled' style="width: 200px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='cascader'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-cascader
              :show-all-levels="false"
              :options="initSelect[item.field]"
              :props="{ value: 'code',label: 'name',children: 'children', checkStrictly: true}"
              v-model="defaultForm.params[item.field]"
              @change="handleChange($event)"
            >
            </el-cascader>
          </el-form-item>
           <el-form-item v-if="item.set && item.queryType==='selectforce'" :label="item.title" 
              :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]"
           >
            <el-select v-model="defaultForm.params[item.field]"  placeholder="请选择" style="width: 200px" >
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
            <el-select v-model="defaultForm.params[item.field]" placeholder="请选择" style="width: 200px">
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
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  export default {
    name: 'WorkshopStock',
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
        queryParams: {
          requestData: {}
        },
        initSelect: {
          protocol: [],
          useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
          }
        },
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          { field: 'stationNo', title: '工位', minWidth: 100, align: "center",queryType: 'cascader', set: true, query: true, },
          { field: 'whId', title: '仓库', minWidth: 100, align: "center", queryType: 'select', set: true, query: true,},
          { field: 'stationStockNo', title: '工位库编码', minWidth: 100, align: "center", queryType: 'input', set: true, query: true,},
          { field: 'stationStockName', title: '工位库名称', minWidth: 100, align: "center", queryType: 'input', set: true, query: true,},
          { field: 'stockType', title: '工位库类型', minWidth: 100, align: "center", queryType: 'select', set: true, query: true,},
        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
        this.getfactorydir()
        this.getAllWare()
        this.getstocktypeData()
    },
    methods: {
       handleChange(row){
        this.defaultForm.params.stationNo = row[row.length-1]
      },
      getstocktypeData(){
        let _data = {url:'/constant/stock-types',params:{}}
         this.$store.dispatch('fmsCommon/actionWmsPost',_data)
        .then(data => {
          this.initSelect['stockType'] = this.loop(data)
           this.initSelect['stockType'] = data.map(c=>{
            return {
              label:c.name,
              value:c.value,
            }
          })
        }).catch(err => {
           console.error(err)
        })
      },
      getfactorydir(){
        let _data = {url:'/factory/guest/factory-dir',params:{}}
         this.$store.dispatch('fmsCommon/actionMdmPost',_data)
        .then(data => {
          this.initSelect['stationNo'] =data
          this.initSelect['stationNo'] = this.loop(data)
          // this.listLoading = false
          this.getList()
        }).catch(err => {
           console.error(err)
        })
      },
      loop(data) {
        const res = []
        data.forEach((item=>{
         
          if(item.children&&item.children.length>0){
            item.children = this.loop(item.children, item.id)
            if(item.model != 105){
              item['disabled'] = true
            }else{
              item['disabled'] = false
            }
          }else{
            delete item.children
             if(item.model != 105){
              item['disabled'] = true
            }else{
              item['disabled'] = false
            }
          }
          res.push(item)
        }))
       
        return res
      },
      getAllWare(){
         let _data = {url:'/warehouse/guest/all',params:{}}
         this.$store.dispatch('fmsCommon/actionWmsPost',_data)
        .then(data => {
          this.initSelect['whId'] = data.map(c=>{
            return {
              label:c.whName,
              value:c.id,
            }
          })
        }).catch(err => {
           console.error(err)
        })
      },
      forceUpdate(v){
        this.defaultForm.params['wsId'] = v.wsId
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
      formatterr(row, column, cellValue, index){
        if(column.property === 'stationNo'){
          return this.recursion(this.initSelect[column.property], cellValue)
        }else if(column.property === 'whId' || column.property === 'stockType'){
          return this.getValueConvert(this.initSelect[column.property], cellValue)
        }else{
          return cellValue
        }
      },
      
      recursion(arr,value){
        let _this = this
        let a =null;
        getid(arr,value)
        function getid(arr1,value1){
          arr1.forEach(item=>{ 

          if(item.children&&item.children.length>0){
            if(item.code == value1){
              a = item
            }
            return getid(item.children, value1)
          }else{
             if(item.code == value1){
              a= item
            }
          }
          })
        }
        return a.name+'|' + a.code
        
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/work-station-warehouse/list', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWmsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
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
        this.cols = this.cols.map(item=>{
          if(item.field == 'stationStockNo'){
            item['disabled'] = false
          }
          return item
        })
        this.destory(true)
      },
      showDetails(row, column) {
      },
      edit(row) {
        this.cols =this.cols.map(item=>{
          if(item.field == 'stationStockNo'){
            item['disabled'] = true
          }
          return item
        })
        this.dialogFormVisible = true
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = row[p]
          }
        }
      },
      submit(formName) {
        const _data = {
          url: '/work-station-warehouse/add', params: {
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
      save(formName) {
        this.defaultForm.row = {}
        // this.defaultForm.params.id = ''
        let _data = { url: '/work-station-warehouse/add', params: { data: this.defaultForm.params } }
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
          const _data = { url: '/work-station-warehouse/del', params: { data: row.id } }
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
</style>
