import common from '@/utils/common'
import httpUtils from '@/api/fms-common'

let finalData = {
  TaskState : [],
  CarryType : [],
  TaskType : [],
  LocType : [],
  MatlState : [],
  CodeState : [],
  MesState : [],
  DirState : [],
  TaskPostState : [],
  WareInfos : [],
  PltCate : [],
  RackLoadState : [],
  TaskExecState : [],
  ForkState : [],
  LocInfo : [],
  CleanState : [],
};
let constParam = {
  finalPara: {
    TaskState() {
      const _data = { url: '/api/Const/TaskState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.TaskState = data
      })
    },
    CarryType() {
      const _data = { url: '/api/Const/CarryType', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.CarryType = data
      })
    },
    TaskType() {
      const _data = { url: '/api/Const/TaskType', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.TaskType = data
      })
    },
    LocType() {
      const _data = { url: '/api/Const/LocType', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.LocType = data
      })
    },
    MatlState() {
      const _data = { url: '/api/Cache/MatlState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.MatlState = data
      })
    },
    CodeState() {
      const _data = { url: '/api/Const/CodeState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.CodeState = data
      })
    },
    MesState() {
      const _data = { url: '/api/Const/MesState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.MesState = data
      })
    },
    DirState() {
      const _data = { url: '/api/Const/DirState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.DirState = data
      })
    },
    TaskPostState() {
      const _data = { url: '/api/Const/TaskPostState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.TaskPostState = data
      })
    },
    TaskExecState() {
      const _data = { url: '/api/Const/TaskExecState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.TaskExecState = data
      })
    },
    WareInfos() {
      const _data = { url: '/api/LocInfo/GetWareInfos', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.WareInfos = data
      })
    },
    PltCate() {
      const _data = { url: '/api/Cache/PltCate', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.PltCate = data
      })
    },
    RackLoadState() {
      const _data = { url: '/api/Const/RackLoadState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.RackLoadState = data
      })
    },
    ForkState() {
      const _data = { url: '/api/Const/ForkState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.ForkState = data
      })
    },
    LocInfo() {
      const _data = { url: '/api/Cache/LocInfo', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.LocInfo = data
      })
    },
    CleanState() {
      const _data = { url: '/api/Const/CleanState', params: {} }
      httpUtils.actionWcsPost(_data.url, _data.params).then(data => {
        finalData.CleanState = data
      })
    },
  },
  getData(val){
    return finalData[val]
  },
  formatter: {
    TaskState(row, column, cellValue, index) {
      let data = finalData.TaskState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    CarryType(row, column, cellValue, index) {
      let data = finalData.CarryType.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    TaskType(row, column, cellValue, index) {
      let data = finalData.TaskType.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    LocType(row, column, cellValue, index) {
      let data = finalData.LocType.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    MatlState(row, column, cellValue, index) {
      let data = finalData.MatlState.filter(item => item.stateNum === cellValue)
      return data.length > 0 ? data[0].stateName : cellValue
    },
    CodeState(row, column, cellValue, index) {
      let data = finalData.CodeState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    MesState(row, column, cellValue, index) {
      let data = finalData.MesState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    DirState(row, column, cellValue, index) {
      let data = finalData.DirState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    TaskPostState(row, column, cellValue, index) {
      let data = finalData.TaskPostState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    TaskExecState(row, column, cellValue, index) {
      let data = finalData.TaskExecState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    ForkState(row, column, cellValue, index) {
      let data = finalData.ForkState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
    LocInfo(row, column, cellValue, index) {
      let data = finalData.LocInfo.filter(item => item.locId === cellValue)
      return data.length > 0 ? data[0].locName : cellValue
    },
    CleanState(row, column, cellValue, index) {
      let data = finalData.CleanState.filter(item => item.id === cellValue)
      return data.length > 0 ? data[0].name : cellValue
    },
  },
}
export default {
  name: 'constParam',
  ...constParam,
}
