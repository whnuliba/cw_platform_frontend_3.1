<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="工厂日历" name="first">
          <div>
            <component :is="workCalendarComponents" ref="workCalendarId" :workCalendarId="workCalendarId"  @workCalendarRowClick = "myChangeCalendarItem"> </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="container-body-bottom">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        <el-tab-pane label="班次" name="first">
          <div>
            <component :is="workShiftComponents" ref="workShiftId" :workShiftId="workShiftId" :workShiftCaNo="calendarNo" > </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增" name="work_shift_add">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import WorkCalendar from './components/workCalendar'
import WorkShift from './components/workShift'

import i18n from '@/lang';
export default {
  name: 'WorkCalendarList',
  components: { Pagination, WorkCalendar, WorkShift },
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
      workCalendarComponents: 'WorkCalendar',
      workShiftComponents: 'WorkShift',
      workCalendarId: '',
      workShiftId: '',
      calendarNo: '',
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeCalendarItem(row) {
      this.workShiftId = row.id || ''
      this.calendarNo = row.calendarNo || ''
    },
    eqCommpBeforeLeave(activeName, oldActiveName) {
      if (activeName == 'work_shift_add') {
        if (this.workShiftId == null || this.workShiftId == ''){
          this.$message({
            message: '请先选择日历！',
            type: 'warning'
          })
          return false
        }
        this.$refs.workShiftId.add()
      }
      return false
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
.container-body-top{
  max-height: 50%;
  overflow-y:auto;
}

.container-body-bottom{
  width: 100%;
  margin-top:10px ;
  max-height: 50%;
  overflow-y:auto;
}

</style>
