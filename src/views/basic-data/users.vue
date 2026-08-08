<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="float: left">
        <!-- 单行文本 -->
        <el-input
          v-model="logininput"
          placeholder="请输入登录名"
          style="width: 120px"
          class="filter-item"
        />
        <!-- 下拉菜单 -->
        <el-input
          v-model="nameinput"
          placeholder="请输入姓名"
          style="width: 150px"
          class="filter-item"
        />
      </div>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button

        class="filter-item"
        type="warning"
        icon="el-icon-remove"
        @click="handleClear"
      >
        {{ $t("table.reset") }}
      </el-button>
      <el-button

        class="filter-item"
        type="warning"
        @click="openAdduserDiolag"
      >
        添加用户
      </el-button>
      <el-button

        class="filter-item"
        type="warning"
        @click="toggleSelection()"
      >
        批量删除
      </el-button>

    </div>
    <el-table
      :key="tableKey"
      :data="tableData"
      style="width: 100%; overflow: auto"
      border
      @row-click="getAtcolumdata"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">
          {{ (listQuery.page-1)*listQuery.limit+(scope.$index + 1) }}
        </template>
      </el-table-column>

      <el-table-column
        v-for="item in colums"
        :key="item"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="dialogedituser=true"
          >编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="authorization(scope)"
          >授权</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope)"
          >{{ $t("permission.delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getSysTableList"
      />
    </div>
    <!-- 添加用户 -->
    <el-dialog v-el-drag-dialog title="添加用户" :visible.sync="dialogCraeteFormVisible">
      <el-form ref="form" :model="form" :rules="rules1">
        <el-form-item label="登录名" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码确认" :label-width="formLabelWidth" prop="password1">
          <el-input v-model="form.password1" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="form.sex" label="0">男</el-radio>
          <el-radio v-model="form.sex" label="1">女</el-radio>
          <el-radio v-model="form.sex" label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-select v-model="form.useState">
            <el-option label="正常使用" value="0" />
            <el-option label="限制用户" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCraeteFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="useradd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户编辑 -->
    <el-dialog v-el-drag-dialog title="修改用户" :visible.sync="dialogedituser">
      <el-form :model="useredit_form">
        <el-form-item label="登录名" :label-width="formLabelWidth">
          <el-input v-model="useredit_form.userName" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="useredit_form.realName" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
          prop="email"
          label="邮箱"
          :label-width="formLabelWidth"
        >
          <el-input v-model="useredit_form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="useredit_form.sex" label="0">男</el-radio>
          <el-radio v-model="useredit_form.sex" label="1">女</el-radio>
          <el-radio v-model="useredit_form.sex" label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-select v-model="useredit_form.useState">
            <el-option label="正常使用" value="0" />
            <el-option label="限制用户" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogedituser = false">取 消</el-button>
        <el-button type="primary" @click="userEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权页面 -->
    <el-dialog v-el-drag-dialog :title="authorizationtitle" :visible.sync="dialogauthorization">
      <el-checkbox-group
        v-model="checkedroleData"
      >
        <div v-for="item in roleData" :key="item.id">
          <el-checkbox :label="item.id">{{ item.roleName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogauthorization = false">取 消</el-button>
        <el-button type="primary" @click="SubmitAuthorization">确 定</el-button>
      </div>
    </el-dialog>

    <el-divider direction="horizontal" content-position="center" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { newgetRole, addUser, editUser, roleAll, saveUserRole, delUserRole } from '@/api/roles'

export default {
  name: 'Usersrole',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.form.password !== '') {
            this.$refs.form.validateField('password1')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    return {
      tableKey: 0,
      total: 0,
      dialogCraeteFormVisible: false,
      dialogauthorization: false,
      dialogedituser: false,
      tableData: [],
      calendarTypeOptions: [],
      logininput: '',
      authorizationtitle: '',
      nameinput: '',
      editID: '',
      multiSelectDelete: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      sex: '0',
      rules1: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password1: [
            { validator: validatePass2, trigger: 'blur' }
          ]
      },
      colums: [
        {
          prop: 'userName',
          label: '用户名',
          width: 100
        },
        {
          prop: 'realName',
          label: '姓名',
          width: 100
        },
        {
          prop: 'email',
          label: '用户邮箱',
          width: 170
        },
        {
          prop: 'sexto',
          label: '性别',
          width: 100
        },
        {
          prop: 'useStateto',
          label: '用户状态',
          width: 100
        },
        {
          prop: 'roleName',
          label: '角色',
          width: 100
        }
      ],
      form: {
        userName: '',
        realName: '',
        password: '',
        password1: '',
        email: '',
        useState: '',
        sex: ''
      },
      useredit_form: {
        userName: '',
        realName: '',
        sex: '',
        email: '',
        useState: ''
      },
      formLabelWidth: '70px',
      checkedroleData: [],
      roleData: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      }
    }
  },
  created() {
    newgetRole({
      current: 1,
      pageSize: 10,
      requestData: {
        realName: '',
        userName: ''
      }
    }).then(res => {
      const { data } = res.data.data
      this.tableData = data
      this.tableData.forEach(item => {
        const arr = item.roles.map(v => {
          return v.roleName
        })
        item['roleName'] = arr.toString()
        item['sexto'] = item.sex === 0 ? '男' : item.sex === 0 ? '女' : '保密'
        item['useStateto'] = item.useState === 0 ? '正常使用' : '限制用户'
      })
      this.total = res.data.data.total
    })
  },
  mounted() {},
  methods: {
    // 多选
    handleSelectionChange(val) {
      this.multiSelectDelete = val.map(item => {
        return item.id
      })
    },
    // 批量删除
     toggleSelection() {
       this.$confirm('确认执行操作?', this.$t('common.btn.hint'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       this.multiSelectDelete.forEach(item => {
        delUserRole({
         data: item
        }).then(res => {
          if (res.data.status === 'SUCCESS') {
           this.$message({
           message: '删除成功',
           type: 'success'
           })
           // this.initData()
           const params = {
             current: this.listQuery.page,
             pageSize: this.listQuery.limit,
             requestData: {
               realName: '',
               userName: ''
             }
           }
           this.initData(params)
           this.listQuery = {
            page: 1,
            limit: 10
           }
         } else {
           this.$message.error(res.data.data)
         }
        })
        })
      })
    },
    // 分页
    getSysTableList(val) {
      const params = {
        current: val.page,
        pageSize: val.limit,
        requestData: {
        realName: '',
        userName: ''
        }
      }
      this.initData(params)
      this.listQuery = val
    },
    openAdduserDiolag() {
      this.dialogCraeteFormVisible = true
      this.form = {
        userName: '',
        realName: '',
        password: '',
        password1: '',
        email: '',
        useState: '',
        sex: '0'
      }
    },

    // 获取此行数据
    getAtcolumdata(row, column, event) {
      for (const key in this.useredit_form) {
        this.useredit_form[key] = row[key]?.toString()
      }
      this.editID = row.id
    },
    // 授权
    authorization(row) {
      this.authorizationtitle = row.row.realName
      row.row.roles.forEach(item => {
      this.checkedroleData.push(item.id)
      })
      this.dialogauthorization = true
      roleAll().then(res => {
        this.roleData = res.data.data
      })
    },
    // 提交授权
    SubmitAuthorization() {
      const data = []
      this.checkedroleData.forEach(item => {
        const obj = {
          roleId: item,
          userId: this.editID
        }
        data.push(obj)
      })
      saveUserRole({ data }).then(res => {
        if (res.data.status === 'SUCCESS') {
          this.$message({
          message: '授权成功',
          type: 'success'
          })
          this.dialogauthorization = false
          this.checkedroleData = []
          const params = {
            current: this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData: {
            realName: '',
            userName: ''
            }
          }
          this.initData(params)
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    // 编辑
    userEdit() {
      editUser({
        data: {
          id: this.editID,
          ...this.useredit_form
        }
      }).then(res => {
        if (res.data.status === 'SUCCESS') {
          this.$message({
          message: '修改成功',
          type: 'success'
          })
          this.dialogedituser = false
          const params = {
            current: this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData: {
            realName: '',
            userName: ''
            }
          }
          this.initData(params)
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    // 添加用户
    useradd() {
      addUser({
        data: this.form
      }).then(res => {
        if (res.data.status === 'SUCCESS') {
          this.$message({
          message: '添加成功',
          type: 'success'
          })
          this.dialogCraeteFormVisible = false
          const params = {
            current: this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData: {
            realName: '',
            userName: ''
            }
          }
          this.initData(params)
        } else {
          this.$message.error(res.data.data)
        }
      })
    },

    // 搜索
    handleFilter() {
      const params = {
        current: this.listQuery.page,
        pageSize: this.listQuery.limit,
        requestData: {
          realName: this.nameinput,
          userName: this.logininput
        }
      }
      this.initData(params)
    },
    // 重置
    handleClear() {
      this.logininput = ''
      this.nameinput = ''
    },

    initData(params) {
      newgetRole({
          ...params
      }).then(res => {
          const { data } = res.data.data
          this.tableData = data
          this.tableData.forEach(item => {
            const arr = item.roles.map(v => {
              return v.roleName
            })
            item['roleName'] = arr.toString()
            item['sexto'] = item.sex === 0 ? '男' : item.sex === 0 ? '女' : '保密'
            item['useStateto'] = item.useState === 0 ? '正常使用' : '限制用户'
          })
          this.total = res.data.data.total
        })
    },
   // 删除
    handleDelete(row, index) {
      this.$confirm('确认执行操作?', this.$t('common.btn.hint'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       delUserRole({
         data: row.row.id
       }).then(res => {
         if (res.data.status === 'SUCCESS') {
          this.$message({
          message: '删除成功',
          type: 'success'
          })
          // this.initData()
          const params = {
            current: row.$index === 0 ? this.listQuery.page - 1 : this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData: {
            realName: '',
            userName: ''
            }
          }
          this.initData(params)
        } else {
          this.$message.error(res.data.data)
        }
       })
      })
    }

  }
}
</script>

<style>
.el-dialog.customStyle {
  width: 80%;
  /* height: 100%; */
}
</style>
