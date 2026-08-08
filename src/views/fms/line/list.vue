<template>

  <div class="app-container">
        <div class="filter-container">
        <!-- 单行文本 -->
          <el-input
            v-model="queryParams.requestData.lineName"
            placeholder="请输入线别名称"
            style="width: 120px"
            class="filter-item"
          />

           <el-input
            v-model="queryParams.requestData.lineNo"
            placeholder="请输入线别编码"
            style="width: 120px"
            class="filter-item"
          />
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
           <el-button type="warning"   v-ele-show="{btnCode:'ADD_LINE_INFO'}"   class="filter-item" @click="add" >
               {{ $t("common.btn.add") }}
           </el-button>
        </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="50px" label="序号" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="创建人">
        <template slot-scope="{row}">
           <span>{{ row.createUser }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="290px" label="线别编码">
        <template slot-scope="{row}">
            <span>{{ row.lineNo }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="线别名称">
        <template slot-scope="scope">
          <span>{{ scope.row.lineName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small"  v-ele-show="{btnCode:'ADD_LINE_INFO'}"  icon="el-icon-edit" @click="openDialog(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           <el-button type="warning"  v-ele-show="{btnCode:'DEL_LINE_INFO'}"  size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="title" v-el-drag-dialog :visible.sync="dialogFormVisible">
      <el-form :inline="true" ref="form" :model="defaultForm" label-width="80px">
        <el-form-item label="线体编码">
          <el-input v-model="defaultForm.params.lineNo" />
        </el-form-item>
        <el-form-item label="线体名称">
          <el-input v-model="defaultForm.params.lineName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer footer-style" >
        <el-button @click="dialogFormVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="edit()">  {{ $t("common.btn.save") }}</el-button>
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
  name: 'LineList',
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
    return {
      title:'',
      dialogFormVisible: false,
      queryParams:{requestData:{lineNo:null,lineName:null}},
      defaultForm: {
        row:{},
        params:{
         id:'',
        lineNo: '',
        lineName: ''
        }
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(param={}) {
      this.listLoading = true
      Object.assign(param,this.listQuery)
      const _data = {url:'/lineInfo/list',params:param}  // /line/list
      this.$store.dispatch('fmsCommon/actionFmsPost',_data)
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
  openDialog(row) {
      this.title='编辑'
      this.defaultForm.row = row
      this.defaultForm.params.lineNo = row.lineNo
      this.defaultForm.params.id=row.id
      this.defaultForm.params.lineName = row.lineName
      this.dialogFormVisible = true
  },
  edit(){
       const _data = {url:'/lineInfo/add',params:{
          data:this.defaultForm.params
       }}
       this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      .then(data => {
          this.dialogFormVisible = false
          if(this.defaultForm.params.id!=null && this.defaultForm.params.id!=''){
            this.defaultForm.row.lineNo=this.defaultForm.params.lineNo
            this.defaultForm.row.lineName=this.defaultForm.params.lineName
          }
          if(this.defaultForm.params.id.length < 1){
            this.$message.success('add success！')
          }else {
            this.$message.success('update success！')
          }

          this.getList();
       }).catch(err => {
          console.error(err)
       })
  },
  query(){
     this.getList(this.queryParams)
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }

   },
   add(){
      this.title='新增'
      this.defaultForm.row = {}
      this.defaultForm.params.lineNo = ''
      this.defaultForm.params.id=''
      this.defaultForm.params.lineName = ''
      this.dialogFormVisible = true
   },
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                const _data = {url:'/lineInfo/del',params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionFmsPost',_data)
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
        });
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
.filter-item{
  margin-left: 3px;
}
.footer-style {
  text-align: center;
}
</style>
