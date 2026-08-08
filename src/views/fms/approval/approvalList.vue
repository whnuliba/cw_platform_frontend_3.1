/*
 * @CreatAuthor: 徐高鹏
 * @UpdateAuthor: 宋丹峰
 * @Description: 工艺管理 - 审批类型
*/ 
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :class="fromClass">
        <el-form-item>
          <el-input v-model="data.bizCode" placeholder="请输入业务编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="data.bizName" placeholder="请输入业务名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <el-button type="warning" @click="newData">新建</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">

        <el-table-column min-width="50px" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ (currentPage-1) * pageSize + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field"
                         :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align"
                         show-overflow-tooltip></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250"
          align="center">
          <template slot-scope="scope" id="buttonDiv">
            <el-button v-ele-show="{btnCode:'EDIT_QPPROVAL'}" @click="editRow(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button @click="approval(scope.row)" type="primary" size="small">审批人</el-button>
            <!-- <el-button @click="deleteRow(scope.row)" v-ele-show="{btnCode:'DEL_APPROVAL'}" type="warning" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :class="pageClass"
        layout="prev, pager, next, total, sizes, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizeS"
        @current-change="currentChange"
        @size-change="sizeChange"
        :total="total">
      </el-pagination>

      <el-dialog
        :title="dialogType"
        :visible.sync="flowVisible"
        width="50%"
        v-el-drag-dialog
      >
        <div style="width: 100%; height: 300px;overflow:auto">
          <el-form :model="addData" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="业务名称" prop="pass">
              <el-input type="text" v-model="addData.bizName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="业务地址" prop="checkPass">
              <el-input type="text" v-model="addData.uri" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitAdd">提交</el-button>
              <el-button @click="">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog
        title="管理审批用户"
        :visible.sync="approvalUserDiaLog"
        width="80%"
        v-el-drag-dialog
      >
        <div style="width: 100%; height: 500px;overflow:auto">

          <el-form :inline="true" class="demo-form-inline" :class="fromClass">
            <el-form-item label="业务编码">
              <el-input readonly v-model="addApprovalUser.bizCode" placeholder="请输入业务编码"></el-input>
            </el-form-item>
            <el-form-item label="业务名称">
              <el-input readonly v-model="addApprovalUser.bizName" placeholder="请输入业务名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="addApprovalUser.userId" placeholder="请选择" filterable>
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addUser">新增</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="listLoading" :data="tableDataUser" border fit highlight-current-row style="width: 100%">

            <el-table-column min-width="50px" label="序号" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
            <el-table-column v-for="(item) in colsUser" :key="item.id" :label="item.title" :prop="item.field"
                             :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align"
                             show-overflow-tooltip></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="250"
              align="center">
              <template slot-scope="scope">
                <el-button @click="deleteUserRow(scope.row)" type="primary" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import elDragDialog from "@/directive/el-drag-dialog";
export default {
    name: 'approvalList',
    directives: { elDragDialog },
    data() {
      return {
        dialogType: '新建审批类型',
        addData: {
          bizName: '',
          uri: '',
          id: ''
        },
        addApprovalUser: {
          userId: '',
          bizId: '',
          bizCode: '',
          bizName: ''
        },
        userOptions: [],
        data: {
          bizName: '',
          bizCode: ''
        },
        defaultData: {
          current: 1,
          pageSize: 15
        },
        defaultUserData: {
          current: 1,
          pageSize: 15,
          data: ''
        },
        flowVisible: false,
        approvalUserDiaLog: false,
        listLoading: true,
        tableData: [],
        tableDataUser: [],
        pageClass: 'pageClass',
        pageSize: 15,
        pageSizeS: [15, 30, 45, 200],
        total: 1000,
        currentPage: 1,
        fromClass: 'fromClass',
        cols: [
          { field: 'id', title: 'id', hide: true, minWidth: 100, align: 'center' },
          { field: 'bizCode', title: '业务编码', minWidth: 100, align: 'center' },
          { field: 'bizName', title: '业务名称', align: 'center' },
          { field: 'createTime', title: '创建日期', align: 'center' },
          { field: 'createUser', title: '创建人', align: 'center' },
          { field: 'uri', title: '地址模板', align: 'center' }
        ],
        colsUser: [
          { field: 'id', title: 'id', hide: true, minWidth: 100, width: 100, align: 'center' },
          { field: 'userId', title: '用户ID', hide: true, width: 60, align: 'center' },
          { field: 'userName', title: '登录名', width: 200, unresize: true, align: 'center' },
          { field: 'realName', title: '姓名', width: 150, align: 'center' },
          { field: 'createUser', title: '创建人', width: 100, align: 'center' },
          { field: 'createTime', title: '创建时间', align: 'center' },
        ]
      }
    },
    created() {
      this.initList(this.defaultData)
      this.initUser()
    },
    methods: {
      deleteUserRow(row) {
        this.$confirm('确定删除此审批用户吗？？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let json = { data: row.id }
          const _data = { url: '/approval/deluser', params: {data:row.id} }
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            if (data) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
            }
            this.initApprovalUser()
            this.listLoading = false;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      addUser(){
        this.listLoading = true;
        const _data = { url: '/approval/adduser', params: {data:this.addApprovalUser}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          if (data) {
            this.$message({
              message: '新增审批人成功！',
              type: 'success'
            })
            this.initApprovalUser()
          }
          this.listLoading = false;
        })
      },
      initUser() {
        const _data = { url: '/user/get-all', params: {} }
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          this.userOptions = data
        })
      },
      initApprovalUser() {
        const _data = { url: '/approval/guest/approval-getuser', params: this.defaultUserData }
        let thisPara = this;
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          data.forEach(function(d,i){
            let u = thisPara.filterUser(thisPara.userOptions,d.userId);
            if(u != undefined){
              d["realName"]=u.realName;
              d["userName"]=u.userName;
            }else {
              d["realName"]='';
              d["userName"]='';
            }
          });
          this.tableDataUser = data
        })
      },

      filterUser(us, id) {
        for (let i in us) {
          if (us[i].id == id) {
            return us[i]
          }
        }
      },
      editRow(row) {
        this.dialogType = '编辑审批类型'
        this.addData.bizName = row.bizName
        this.addData.id = row.id
        this.addData.uri = row.uri
        this.flowVisible = true
      },
      approval(row) {
        this.defaultUserData.data = row.bizCode
        this.initApprovalUser()
        this.addApprovalUser.bizId = row.id
        this.addApprovalUser.bizCode = row.bizCode
        this.addApprovalUser.bizName = row.bizName
        this.addApprovalUser.userId = this.userOptions.length > 0 ? this.userOptions[0].id : ''
        this.approvalUserDiaLog = true
      },

      deleteRow(row) {
        this.$confirm('你确定删除此审批流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let json = { data: row.id }
          const _data = { url: '/approval/del', params: json }
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            if (data) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
              this.flowVisible = false
              this.initList(this.defaultData)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      initList(json) {
        this.listLoading = true
        const _data = { url: '/approval/list', params: json }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
          this.tableData = response.data
          this.total = response.total
          this.listLoading = false
        }))
      },
      currentChange(curr) {
        let json = { 'current': curr, 'pageSize': this.pageSize }
        this.currentPage = curr
        this.initList(json)
      },
      sizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.currentChange(this.currentPage)
      },
      onSubmit() {
        this.currentPage = 1
        let json = {
          'current': this.currentPage,
          'pageSize': this.pageSize,
          requestData: {
            bizCode: this.data.bizCode,
            bizName: this.data.bizName
          }
        }
        this.initList(json)
      },
      reset() {
        this.data.bizCode = ''
        this.data.bizName = ''
      },
      newData() {
        this.addData = {
          bizName: '',
          uri: '',
          id: ''
        };
        this.dialogType = '新建审批类型'
        this.flowVisible = true
      },
      onSubmitAdd() {
        if(this.checkParam() != null){
          this.$message({
            message: this.checkParam(),
            type: 'error'
          })
          return false;
        }
        let json = { data: this.addData }
        const _data = { url: '/approval/add', params: json }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
          if (response > 0) {
            this.$message({
              message: '增加成功！',
              type: 'success'
            })
            this.flowVisible = false
            this.initList(this.defaultData)
          }
        }))
      },
      checkParam(){
        if(this.addData.bizName.length < 1){
           return '业务名称为空,请输入！';
        }if(this.addData.uri.length < 1){
           return '地址模板为空,请输入！';
        }
        return null;
      }
    }
  }
</script>

<style scoped>
  .pageClass {
    margin-top: 10px;
  }

  .fromClass {
    margin-top: 20px;
  }
</style>
