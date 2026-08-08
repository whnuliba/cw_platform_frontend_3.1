<template>
  <div class="app-container">
    <div class="filter-container">
        <div v-for="(item,index) in cols" :key="index" style="display:inline">
            <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            </el-input>
            <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
            <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]"
                        type="datetime"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
            <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
        </div>
        <el-button type="primary" class="filter-item" @click="query()">
            {{ $t("common.btn.query") }}
        </el-button>
        <el-button type="info" class="filter-item" @click="reset">
            {{ $t("common.btn.reset") }}
        </el-button>
        <el-link type="primary" style="margin-left: 300px;" @click="OpenSysLog" >查看系统日志 <i class="el-icon-view el-icon--right"/></el-link>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" >
        <el-table-column min-width="30px" :label="$t('common.no')" align="center">
            <template slot-scope="scope">
                <span>{{ scope.$index+1 }}</span>
            </template>
        </el-table-column>
        <el-table-column v-for="(item) in cols"  :sortable="true" v-if="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
            <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- <el-drawer
      title="托盘电芯详细"
      :visible.sync="drawer"
      direction="rtl"
    >
      <hr>
      <el-col :span="24" style="padding: 20px;">
            <el-table
            :data="tableData"
            border
            style="width: 100%;"
            >
                <el-table-column
                    type="index"
                    align="center"
                    label="通道"
                />
                <el-table-column
                    prop="matlCode"
                    align="center"
                    label="电芯条码"
                />
            </el-table>
      </el-col>
    </el-drawer> -->

  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'pltLog',
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
        requestData: {
        }
        },
      initSelect: {
         pltCate: [],
         locType: [],
         locId: [],
         matlCate: [],
         matlState: [],
         codeState: [],
         mesState: []
      },
      defaultForm: {
         row: {},
         params: {
         id: ''
        }
      },
      tableData: [],
      list: null,
      total: 0,
      drawer: false,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'pltCode', title: '托盘条码', minWidth: 90, hide: false, align: 'center', query: true, queryType: 'input'},
                { field: 'ctrlCode', title: '托盘编号', minWidth: 90, align: 'center' },  
                { field: 'containerCtrlCode', title: '容器号', minWidth: 75, align: 'center' },  
                { field: 'containerIndex', title: '叠盘序号', minWidth: 85, align: 'center' },  
                { field: 'pltCateName', title: '托盘类型', minWidth: 90, align: 'center' }, 
                { field: 'matlCount', title: '物料数量', minWidth: 85, align: 'center' },              
                { field: 'locName', title: '位置', minWidth: 100, align: 'center' },
                { field: 'locType', title: '位置类型', minWidth: 85, align: 'center' },
                { field: 'matlCate', title: '物料类别', minWidth: 90, align: 'center' },
                { field: 'matlState', title: '物料状态', minWidth: 100, align: 'center' },
                { field: 'levelCode', title: '等级', minWidth: 70, align: 'center' },
                { field: 'lineCode', title: '线体', minWidth: 70, align: 'center' },
                { field: 'codeState', title: '扫码状态', align: 'center' },
                { field: 'mesState', title: '接口状态', align: 'center' },
                { field: 'inputTime', title: '上线时间', align: 'center' },
                { field: 'readyTime', title: '到位时间', align: 'center' },
                { field: 'logTime', title: '记录时间', align: 'center' },
                { field: 'beginLogTime', title: '开始记录时间',hide:true, query: true, queryType: 'datetime', align: 'center' },
                { field: 'endLogTime', title: '结束记录时间', hide:true, query: true, queryType: 'datetime', align: 'center' }

       ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },

  created() {
    this.selectOptions()
  },

  methods: {
        initData(arr) {
         const args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
          return args
        },

        commonFilter(value, type) {
           if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
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
      const _data = { url: '/api/Common/GetPltLog', params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
       }).catch(err => {
          console.error(err)
       })
     },
     OpenSysLog(row){
        window.open("http://192.168.100.10:5009/")
     },
     getValueConvert(arr, value) {
          for (const v of arr) {
            if (v.value === value) {
                return v.label
              }
        }
        return value
     },
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
        }
      },
     query() {
      if(!(this.queryParams.requestData.pltCode)) 
      {
        this.$message.warning(this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'pltCode')))
        return
      }
      this.listQuery.current = 1
      this.getList()
     },

     reset() {
     for (const p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = ''
        }
      }
     },

      // 获取电芯条码
    //  rowClick(row) {
    //     this.drawer = true
    //     const _data = { url: '/api/PltInfo/GetPltDetails', params: { data: row.pltId }}
    //     this.$store.dispatch('fmsCommon/actionWcsPost', _data)
    //       .then(data => {
    //         this.tableData = data
    //       }).catch(err => {
    //       console.error(err)
    //     })
    //   },

    selectOptions() {
         // 获取托盘类型
      let _data = { url: '/api/Cache/PltCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.pltCate = data.map(c => {
                 return {
                   label: c.pltCateName,
                   value: c.pltCateId,
                   capacity: c.capacity
                  }
                })
           }).catch(err => {
               console.error(err)
           })
           // 获取位置类型
      _data = { url: '/api/Cache/locTypes', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.locType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
           // 获取位置
      // _data = { url: '/api/cache/LocInfo', params: {}}
      // this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      //       .then(data => {
      //           this.initSelect.locId = data.map(c => {
      //             return {
      //               label: c.locName,
      //               value: c.locId
      //             }
      //           })
      //       }).catch(err => {
      //           console.error(err)
      //       })
             // 物料类别
       _data = { url: '/api/cache/MatlCate', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.matlCate = data.map(c => {
             return {
               label: c.matlCateName,
               value: c.matlCateId

             }
           })
       }).catch(err => {
          console.error(err)
       })
                      // 获取电池状态
       _data = { url: '/api/Cache/MatlState', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.matlState = data.map(c => {
                  return {
                    label: c.stateName,
                    value: c.stateNum
                  }
                })
             }).catch(err => {
                console.error(err)
            })
                          // 获取扫码状态
       _data = { url: '/api/Const/CodeState', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.codeState = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
                      // 获取接口状态
       _data = { url: '/api/Const/MesState', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.mesState = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
     }
  }
}
</script>

<style>
.el-drawer.rtl {
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
  }
.filter-item{
  margin-left: 3px;
}
</style>
