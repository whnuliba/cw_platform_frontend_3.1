<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        {{ $t('excel.export') }}
      </el-button>
    </div>
<!-- 
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row>
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  props:{
     header: {
       type: Array,
       default: function(){
         return []
        }
       },
       columnName: {
       type: Array,
       default: function(){
         return []
        }
       },
       filter: {
       type: Array,
       default: function(){
         return []
         }
       },
       list: {
       type: Array,
       default: function(){
         return []
       },
       
     }
  },
  data() {
    return {
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    //this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleDownload() {
      let that = this
      this.downloadLoading = true
      this.$emit('handleDownload',
       data=>{
        import('@/vendor/Export2Excel').then(excel => {
        let tHeader = that.header
        const filterVal = that.filter
        const list = that.list
        //data.splice(1,-1,that.columnName)
        let data = []
        let type = that.bookType
        if(that.bookType=='model')
        {
          type = 'xlsx'
          data =[that.header]
          tHeader = that.columnName

        }else{
           data = that.formatJson(filterVal, list)
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: that.filename,
          autoWidth: that.autoWidth,
          bookType: type//that.bookType
        })
        that.downloadLoading = false
        })
       },
       error=>{
         console.error(error)
         that.downloadLoading = false
       },
       ()=>{
        that.downloadLoading = false
       }
      )
     

    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
