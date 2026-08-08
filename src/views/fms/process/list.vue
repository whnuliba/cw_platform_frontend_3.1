<template>

  <div class="app-container">
        <div class="filter-container">
          <el-button type="primary"  v-ele-show="{btnCode:'QUERY_ALL_PROCESS'}" >主要按钮</el-button>
        </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="使用状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.useState | statusFilter">
            {{ row.useState | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="工序编码">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.processCode }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="工序名称" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.processName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="创建人">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.createUser }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <!-- <router-link :to="'/process/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link> -->
          <el-button type="primary" size="small" icon="el-icon-edit" @click="openDialog(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="defaultForm" label-width="80px">
        <el-form-item label="工序编码">
          <el-input v-model="defaultForm.processCode" />
        </el-form-item>
        <el-form-item label="工序名称">
          <el-input v-model="defaultForm.processName" />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="defaultForm.useState" placeholder="使用状态">
            <el-option label="启用" :value="0" />
            <el-option label="未启用" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getProcessInfo } from '@/api/process'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ProcessList',
  components: { Pagination },
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
      dialogFormVisible: false,
      defaultForm: {
        processName: '',
        processCode: '',
        useState: 0

      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
     console.log(this.$router)
      console.log(this.$route)
  },
  methods: {
    getList() {
      this.listLoading = true
      getProcessInfo(this.listQuery).then(response => {
        if (response.code == 200) {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
  openDialog(row) {
      this.defaultForm.processName = row.processName
      this.defaultForm.processCode = row.processCode
      this.defaultForm.useState = row.useState
      this.dialogFormVisible = true
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

</style>
