/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-电芯修改
 */
 <template>
  <div class="app-container">
      <div style="width:95%">
         <el-form
          ref="defaultForm.params"
          :model="defaultForm.params"
          label-width="120px"
          label-position="left"
        >
          <div v-for="(item, i) in cols" :key="i">
            <!-- 单行文本 -->
            <el-form-item
              v-if="item.columns_type === 'textarea'"
              :prop="item.field"
              :label="commonI18n(item) + ': '"
              :rules="[{ required: true, message: commonI18n(item) + $t('common.todo.not_null'), trigger: 'blur' }]"
            >
              <el-input
                v-model="defaultForm.params[item.field]"
                width=100
                :type="item.columns_type"
                :placeholder="$t('common.todo.cellBarCode_multi')"
                :disabled="item.disabled"
              />
            </el-form-item>
            <el-form-item
              v-if="item.columns_type === 'input'"
              :prop="item.field"
              :label="item.title + ': '"
              :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <el-input
                v-model="defaultForm.params[item.field]"
                :placeholder="`请输入${item.title}`"
                :disabled="item.disabled"
              />
            </el-form-item>
            <!-- 图标 -->
            <el-form-item
              v-if="item.columns_type === 'icon'"
              :label="item.title + ': '"
            >
              <icon-picker v-model="defaultForm.params[item.field]" />
            </el-form-item>
            <!-- 下拉菜单 -->
            <el-form-item
              v-if="item.columns_type === 'select'"
              :prop="item.field"
              :label="commonI18n(item) + ': '"
              :rules="[{ required: true, message: commonI18n(item) + $t('common.todo.not_null'), trigger: 'change' }]"
            >
              <el-select
                v-if="item.columns_type === 'select'"
                v-model="defaultForm.params[item.field]"
                :placeholder="commonI18n(item)"
                clearable
                :disabled="item.disabled"
              >
                <span v-for="(item1, index) in menulevelOptions[item.field]" :key="item1 + index">
                  <el-option
                    :key="item1 + index"
                    :label="item1[item.selectLabel]"
                    :value="item1.id"
                  />
                </span>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item>
                <el-button type="primary" @click="updateCell">{{ $t("common.btn.ok") }}</el-button>
                <el-button @click="reset">{{ $t("common.btn.reset") }}</el-button>
          </el-form-item>
        </el-form>
      </div>

  </div>

</template>

<script>
import waves from "@/directive/waves";
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination'
import i18n from '@/lang';
export default {
  name: 'CellList',
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
    const  _initdata ={
      dialogFormVisible: false,
      queryParams:{
        requestData:{ }
        },
      menulevelOptions:{
         lineId: [],
         cellTypeId: [],
         orderId: []
      },
      defaultForm: {
        params:{ }
      },
      list: null,
      listLoading: true,
      cellQuery: {
        col: 'cellType',
        current: 1,
        pageSize: 99999
      },
      lineQuery: {
        col: 'lineNo',
        current: 1,
        pageSize: 99999
      },
      orderQuery: {
        col: 'orderNo',
        current: 1,
        pageSize: 99999
      },
      cols: [
                { field: 'cellBarCode', title: '电芯条码', align: 'center',width: 125, query: true, align: "center", columns_type:'textarea'},
                { field: 'cellTypeId', title: '电芯型号', align: 'center',width: 125, align: "center", columns_type:'select', selectLabel:'productName'},
                { field: 'lineId', title: '线别', align: 'center',width: 150, align: "center", columns_type:'select', selectLabel:'lineNo'},
                { field: 'orderId', title: '工单', align: 'center',width: 150, align: "center", columns_type:'select', selectLabel:'orderNo'},
        ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.getList()
    console.log(this.$store.getters.userInfo)
  },
  methods: {
    initData(arr){
       let args = {}
          arr.map(c=>{
            if(c.set){
              args[c.field] = null
            }
          })
          return args
        },
        commonFilter(value,type) {
           if(this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !=undefined && Array.isArray( this.initSelect[type]))
            {
              return this.getValueConvert(this.initSelect[type],value)
            }
           if(this.initSelect.hasOwnProperty(type) && !Array.isArray( this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)){
             return this.initSelect[type][value]
           }
           return value
      },
   //初始化表格信息
    getList() {
    // 电芯型号下拉数据
      Object.assign(this.queryParams,this.cellQuery)
      const _data = {url:'/cell-type/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      .then(data => {
          this.menulevelOptions.cellTypeId = data.data
       }).catch(err => {
          console.error(err)
       })
    // 线别下拉数据
      Object.assign(this.queryParams,this.lineQuery)
      const lineData = {url:'/lineInfo/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionFmsPost',lineData)
      .then(data => {
          this.menulevelOptions.lineId = data.data
       }).catch(err => {
          console.error(err)
       })
    // 工单下拉数据
      Object.assign(this.queryParams,this.orderQuery)
      let newParams = Object.assign({},this.queryParams)
      newParams.requestData = {state:0, status: 0}
      const orderData = {url:'/orderInfo/list',params:newParams}
      this.$store.dispatch('fmsCommon/actionFmsPost',orderData)
      .then(data => {
          this.menulevelOptions.orderId = data.data
       }).catch(err => {
          console.error(err)
       })
    },

    updateCell(){
        this.$refs['defaultForm.params'].validate((valid) => {
          if (valid) {
                this.$confirm(i18n.t("common.tip_info.cell_update_info"), i18n.t("common.tip_info.tips"), {
                confirmButtonText: i18n.t("common.btn.ok"),
                cancelButtonText: i18n.t("common.btn.cancel"),
                type: 'warning'
                }).then(() => {
                        const _data = {url:'/cell/cell-updateLineOrderType',params:{data:this.defaultForm.params}}
                        this.$store.dispatch('fmsCommon/actionFmsPost',_data)
                        .then(data => {
                            this.$message({
                            type: 'success',
                            message: i18n.t('common.tip_info.success_update_info')
                            });
                        }).catch(err => {
                            console.error(err)
                        })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: i18n.t('common.tip_info.cancel_update_info')
                });
            })
          }
        })
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

  query(){
     this.getList();
   },
   reset(){
     for(let p in  this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p] = ''
        }
     }
   }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.el-form-item__content .el-select {
    width:100%;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}

</style>
