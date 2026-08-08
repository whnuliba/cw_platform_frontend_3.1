<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :class="fromClass">
        <el-form-item>
          <el-input v-model="data.processCode" placeholder="请输入工序编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="data.processName" placeholder="请输入工序名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="data.useState" placeholder="是否启用">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"> {{ $t("common.btn.query") }}</el-button>
          <el-button type="info" @click="reset">{{ $t("common.btn.reset") }}</el-button>
          <el-button type="warning" @click="add">{{ $t("common.btn.add") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border fit highlight-current-row
        v-loading="listLoading"
        size="mini"
        style="width: 100%">
        <el-table-column
          label='序号'
          type="index"
          align="center"
          width="50">
          <template slot-scope="scope">
            <span>{{ (currentPage-1) * pageSize + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item) in cols" :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                         :width="item.width"
                         :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                         :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
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
    </div>

    <el-dialog
      title="添加工艺编辑"
      :visible.sync="processListAdd"
      width="700px"
    >
      <el-form :inline="true" label-position="right" label-width="100px" :model="addParam">
        <el-col :span="24">
          <el-form-item label="工序编码">
            <el-input v-model="addParam.processCode" placeholder="工序编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工序名称">
            <el-input v-model="addParam.processName" placeholder="工序名称"></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="参考模板">
              <el-select v-model="addParam.template" placeholder="工序名称">
                <el-option
                  v-for="item in initSelect.template"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用状态">
              <el-select v-model="addParam.useState" placeholder="使用状态">
                <el-option
                  v-for="item in initSelect.useState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="processListAdd = false">取 消</el-button>
    <el-button type="primary" @click="checkParams">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>


<script>
  import { getProcessInfo } from '@/api/process'

  export default {
    name: 'processList',
    data() {
      return {
        data: {
          processCode: '',
          processName: '',
          useState: ''
        },
        cols: [
          { field: 'processCode', title: '工序编码', minWidth: 100, align: "center" },
          { field: 'processName', title: '工序名称', align: 'center' },
          { field: 'createTime', title: '创建日期', align: 'center' },
          { field: 'createUser', title: '创建人', align: 'center' },
          { field: 'template', title: '模板', align: 'center',template:this.templateFormatter},
          { field: 'useState', title: '使用状态', align: 'center',template:this.useStateFormatter },
        ],
        addParam: {
          processName: '',
          processCode: '',
          template: '',
          useState: 0
        },
        initSelect: {
          template: [{ label: '无', value: '' }, { label: '化成模板', value: 'chargeModel' },
            { label: '分容|补电|SOC', value: 'pointsForModel' },
            { label: '高温静置', value: 'standTimeModel' }, { label: '筛选', value: 'SelectModel' },
            { label: 'OCV1', value: 'OCV1Model' }, { label: 'OCV2', value: 'OCV2Model' },
            { label: 'OCV3', value: 'OCV3Model' }, { label: 'DCIR', value: 'DCIRModel' }, 
            { label: 'IROCV', value: 'IROCVModel' },{ label: 'TATA化成', value: 'tataChargeModel' },
            { label: 'DCR', value: 'tataDCRModel' },{ label: 'TATA分容', value: 'tataPointsForModel' },
          ],
          useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }]
        },
        processListAdd: false,
        listLoading: true,
        tableData: [],
        pageClass: 'pageClass',
        pageSize: 15,
        pageSizeS: [15, 30, 45, 200],
        total: 1000,
        currentPage: 1,
        fromClass: 'fromClass'
      }
    },
    created() {
      let json = { 'current': 1, 'pageSize': 15 }
      this.initList(json)
    },
    methods: {
      initList(json) {
        this.listLoading = true;
        getProcessInfo(json).then((response => {
          this.tableData = response.data
          this.total = response.total
          this.listLoading = false;
        }))
      },
      useStateFormatter(row, column, cellValue, index) {
        return cellValue == '0' ? '启用' : '禁用'
      },
      templateFormatter(row, column, cellValue, index) {
        if (cellValue === 'chargeModel') return '化成模板'
        if (cellValue === 'pointsForModel') return '分容|补电|SOC'
        return cellValue
      },
      currentChange(curr) {
        let json = { 'current': curr, 'pageSize': this.pageSize,
          requestData: {
            processCode: this.data.processCode,
            processName: this.data.processName,
            useState: this.data.useState
          } }
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
            processCode: this.data.processCode,
            processName: this.data.processName,
            useState: this.data.useState
          }
        }
        this.initList(json)
      },
      reset() {
        this.data.processCode = ''
        this.data.processName = ''
        this.data.useState = ''
      },
      add() {
        for (let item in this.addParam){
          this.addParam[item] = '';
        }
        this.processListAdd = true
      },
      checkParams() {
        if (this.addParam.processCode == '') {
            this.$message({
                message: this.$t("common.processList.processCodeNotNull"),
                type: 'error'
            })
            return false
        }
        if (this.addParam.processName == '' ) {
            this.$message({
                message: this.$t("common.processList.processNameNotNull"),
                type: 'error'
            })
            return false
        }
        let json = { current: 1, pageSize: this.total, requestData: {} };
        const _data = { url: "/process/list", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
            if (response) {
                let dataTotal = response.data.map(item => item.processCode);
                if (dataTotal.includes(this.addParam.processCode)) {
                    this.$message({
                        message: this.$t("common.processList.processCodeNotSame"),
                        type: 'error'
                    })
                } else {
                  this.$message({
                    message: this.$t("common.btn.addSuccess"),
                    type: 'success'
                  })
                    this.addAjax()
                }
            } else {
                this.$message({
                    message: this.$t("common.btn.addError"),
                    type: 'error'
                })

            }
        });
      },
      addAjax() {
        const _data = { url: '/process/add', params: { data: this.addParam } }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          if (data) {
            this.$message({
              message: this.$t("common.btn.addSuccess"),
              type: 'success'
            })
            let json = { 'current': 1, 'pageSize': 15, requestData: {} }
            this.initList(json)
            this.processListAdd = false
          } else {
            this.$message({
              message: this.$t("common.btn.addError"),
              type: 'error'
            })
          }
        })
      },
      initParam() {
        for (let item in this.addParam) {
          this.addParam[item] = '';
        }
        this.addParam.useState = 0;
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
