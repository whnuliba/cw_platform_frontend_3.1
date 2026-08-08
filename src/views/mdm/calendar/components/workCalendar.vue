<template>
  <div>
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="commonI18n(item)"
            :value="item.value"
          />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
      </div>
      <el-button type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'work_calendar_add'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="workCalendarRowClick" @row-dblclick="showDetails">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <i v-ele-show="{btnCode:'work_calendar_edit'}" class="el-icon-edit" @click="edit(scope.row)" />
          &nbsp;
          <i v-ele-show="{btnCode:'work_calendar_del'}" class="el-icon-delete" @click="del(scope.$index,scope.row)" />
          &nbsp;
          <i class="el-icon-date" @click="setCalendar(scope)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." @change="$forceUpdate()" style="width:180px;">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='date'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer
            v-model="selectColumn.fields"
            :titles="['源字段', '目标字段']"
            :data="selectColumn.colMap"
          />
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="日历" :visible.sync="dialogCalendarVisible" width="700px">
      <el-calendar 
        class="lar-el-calendar"
        v-model="rangeData[0]"
      >
      <template slot="dateCell" slot-scope="{ date, data }">
        
        <div 
          @contextmenu.prevent="rightClick(data.day)"
          @mouseleave="rightmodalleave()" 
          :style="
            calendarData.includes(data.day) == true 
              ? 'background-color: #ffebec; width:100%; height:100%; padding:8px; position:relative;'
              : 'width:100%; height:100%; padding:8px;position:relative;'
          "
        >
          <div @mouseleave="rightmodalleave()"   v-show="rightmodalvisiable == data.day"  class="rightmodal">
            <div @click="chooseitemclick(data.day,100)" class="chooseitem">上班</div>
            <div @click="chooseitemclick(data.day,101)" class="chooseitem">休息</div>
          </div>
            <span
              class="character"
             
              :style="allcalendarData.includes(data.day) == true ? calendarData.includes(data.day) == true ? 'color: #f73131' : '' : '' "
              >{{allcalendarData.includes(data.day) == true ? calendarData.includes(data.day) == true ? '休' : '班' : ''}}</span
            >
           
            <div 
              class="calendaritem"
              :style="
                allcalendarData.includes(data.day) == true 
                  ? calendarData.includes(data.day) == true 
                  ?
                    'color:#F73131;text-align:center'
                  :
                   'color:#606266;text-align:center'
                  : 'color: #C0C4CC;text-align:center'
              "
            >
              {{ data.day.split("-")[2]}}
            </div>
          </div>
      </template>
      </el-calendar>
    </el-dialog>

  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'WorkCalendar',
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
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    workCalendarId: String
  },
  data() {
    const _initdata = {
      table_mark: 'mdm_wkc_lst',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      dialogCalendarVisible: false,
      rightmodalvisiable: undefined,
      getcalendarid: undefined,
      calendarData:[],
      allcalendarData:[],
      rangeData:[],
      value1: new Date(),
      url: {
        add: '/workCalendar/saveCalendarAndDays',
        del: '/workCalendar/del',
        list: '/workCalendar/list'
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        wsNo: []
      },
      defaultForm: {
        row: {},
        params: {
          id: ''
        }
      },
      selectColumn: {
        origin: {},
        fields: [],
        colMap: []
      },
      selectViewCol: [],
      possessioncalendarData: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'calendarNo', title: '日历编号', align: 'left', query: true, queryType: 'input', editReadonly: true, set: true, require: true },
        { field: 'calendarName', title: '日历名称', align: 'left', query: true, queryType: 'input', set: true, require: true },
        { field: 'wsNo', title: '所属车间', align: 'left', query: true, queryType: 'select', set: true, require: true },
        { field: 'calendarStartTime', title: '开始时间', align: 'left', query: false, queryType: 'date', set: true, require: true },
        { field: 'calendarEndTime', title: '结束时间', align: 'left', query: false, queryType: 'date', set: true, require: true },
        { field: 'status', title: '状态', align: 'left', width: '80px', queryType: 'input', set: false, require: false },
        { field: 'createTime', title: '创建时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.initCustomVol(data => {
      if (data && data.length > 0) {
        const fds = data.map(c => c.item)
        this.cols.forEach(item => {
          if (fds.indexOf(item.field) >= 0) {
            item.hide = false
          } else {
            item.hide = true
          }
        })
      }
    })
    this.getList()
    this.selectOptions()
  },
  methods: {
    chooseitemclick(date,stateSet){
      this.possessioncalendarData.forEach(item=>{
        if(item.date == date){
          console.log(item.id);
           const _data = { url: '/workCalendarItem/edit', params: {data:{id:item.id,stateSet}}}
          this.$store.dispatch('fmsCommon/actionMdmPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>'+data
            });
          this.getcalendar(this.getcalendarid)

          }).catch(err => {
          console.error(err)
          })
        }
      })
    },
    rightmodalleave(){
      this.rightmodalvisiable = null;
    },
    rightClick(date){
      this.rightmodalvisiable = null;
      if(this.allcalendarData.includes(date)){
        this.rightmodalvisiable = date
      }
    },
    getcalendar(id){
      this.calendarData = []
      this.allcalendarData = []
      const _data = { url: '/workCalendarItem/guest/selectByCalendarId', params: {data:id}}
        this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.possessioncalendarData = data      
          data.forEach(item=>{
            this.allcalendarData.push(item.date)
            if(item.stateSet == '101'){
              this.calendarData.push(item.date)
            }
          })
        }).catch(err => {
          console.error(err)
        })
    },
    setCalendar(scope) {
      this.rangeData=[scope.row.calendarStartTime,scope.row.calendarEndTime]
      this.dialogCalendarVisible = true
      this.getcalendarid = scope.row.id
      this.getcalendar(scope.row.id)
    },
    workCalendarRowClick(row, column, event) {
      this.$emit('workCalendarRowClick', row)
    },
    initCustomVol(callback) {
      const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo') }
      const _data = { url: '/custom-item/guest/query', params: customColumn }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          if (callback && typeof callback === 'function') {
            callback(data)
          }
        }).catch(err => {
        console.error(err)
      }).finally(() => {

      })
    },
    selectFields() {
      this.dialogSelectFieldVisible = true
      this.initCustomVol((data) => {
        this.selectColumn.colMap = []
        this.selectColumn.fields = []
        this.selectColumn.origin = {}
        this.selectColumn.fields = data.map(c => c.item)
        this.cols.forEach(item => {
          this.selectColumn.origin[item.field] = item.title
          this.selectColumn.colMap.push({
            key: item.field,
            label: item.title,
            disabled: false
          })
        })
      })
    },
    saveSelectField() {
      const fields = {}
      // this.currScripts.cols.forEach(item=>{
      //    if(item.export){
      //      fields[item.field] = item.title
      //    }
      // })
      const arr = []
      this.selectViewCol.length = 1
      this.selectColumn.fields.forEach(item => {
        if (this.selectColumn.origin[item]) {
          fields[item] = this.selectColumn.origin[item]
          arr.push({ item: item })
          this.selectViewCol.push(item)
        }
      })

      if (this.selectColumn.fields.length == 0) {
        this.$message({
          type: 'info',
          message: '没有选择字段'
        })
        return
      }

      const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo'), items: arr }
      const _data = { url: '/custom-item/guest/save', params: customColumn }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.dialogSelectFieldVisible = false
          this.cols.forEach(item => {
            if (this.selectViewCol.indexOf(item.field) >= 0) {
              item.hide = false
            } else {
              item.hide = true
            }
          })
          // this.query()
        }).catch(err => {
        console.error(err)
      }).finally(() => {

      })
    },
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
      const _data = { url: this.url.list, params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionMdmPost', _data)
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

    getValueConvert(arr, value) {
      for (const v of arr) {
        if (v.value == value) {
          return v.label
        }
      }
      return value
    },
    destory(hide = false) {
      this.dialogFormVisible = hide
      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = ''
        }
      }
    },
    add() {
      this.allowDisable = false
      this.destory(true)
    },
    showDetails(row, column) {
    },
    edit(row) {
      this.dialogFormVisible = true
      this.allowDisable = true

      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    submit(formName) {
      const _data = { url: this.url.add, params: {
          data: this.defaultForm.params
        }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionMdmPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              })
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
          })
          this.destory()
        }
      })
    },
    query() {
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
    selectOptions() {
      // 初始化线体信息
      const _data = { url: '/workshop/guest/getall', params: {}}
      this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.initSelect.wsNo = data.map(c => {
            return {
              label: c.wsName,
              value: c.id
            }
          })
        }).catch(err => {
        console.error(err)
      })
      // 初始化工序信息
    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: this.url.add, params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionMdmPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              })
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
          })
          this.destory()
        }
      })
    },
    del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      }).then(() => {
        const _data = { url: this.url.del, params: { data: row.id }}
        this.$store.dispatch('fmsCommon/actionMdmPost', _data)
          .then(data => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: 'delete success!'
            })
          }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
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
.filter-item{
  margin-left: 3px;
}
.model-factory{
  position: relative;
  width: 500px;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100% - 505px);
  height: calc(100vh - 120px);
  float: left;
  margin-left:5px ;
  background: #D4D7D7;
}
/deep/.lar-el-calendar .el-calendar-table .el-calendar-day{
  padding: 0 !important;
}
.calendaritem{
  margin-top: 10px;
  height: 30px;
  font-size:24px;
  font-weight:bold;
}
.character{
  display: block;
  height: 17px;
}
.rightmodal{
  border: 1px solid #999;
  box-shadow: 3px 3px 3px #ccc;
  position: absolute;
  z-index: 10000;
  /* display: flex; */
  background: #f3f3f3;
  /* flex-direction: column;
  justify-content: space-around; */
  width: 50px;
  height: 80px;
  cursor: pointer;
  left: 50px;
  top: 60px;
}
.rightmodal div{
  text-align: center;
  width: 100%;
  height: 50%;
  padding-top: 24%;
}
.rightmodal div:first-child{
  border-bottom: 1px solid #999;
}
.rightmodal div:hover{
  background-color: #F2F8FE;
}
</style>
