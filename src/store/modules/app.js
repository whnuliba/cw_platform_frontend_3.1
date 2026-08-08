import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import common from "@/utils/common";
import axios from 'axios'
import { getToken } from '@/utils/auth'
const {authRoot, fmsHisRoot, taskRoot, fmsRoot} = common;

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  baseUrl: '/c-mes-auth',
  menuGroup: [],
  userInfo: sessionStorage.getItem("userInfoArray"),
  diagramEntity: null,
  workTaskNum: 0,
  fontColor: "#606266",
  pageDesignComponentData:[],
  CHILDCOMPT_STATE:false,
  lineDatas: [],
  isCanvaview: false,
  deleNode: {}
}

const mutations = {
  DETE_COMPONENT: (state,delItem) => {
    state.deleNode = delItem
  },
  SET_LINES_DATA: (state,linesArr) => {
    state.lineDatas = linesArr
  },
  IS_CANVAS_VIEW: (state,isCanvasOpen) => {
    state.isCanvaview = isCanvasOpen
  },
  WORK_TASK_NUM: (state,workTaskNum) => {
    const _data = {
        "current":1,"pageSize":100,
        "requestData":{"tableName":"","orderBy":"","columns":[],"sqlWhere":[
            {
              column: 'COMPLETE_USER',
              condition: "=",
              value: sessionStorage.getItem("userName"),
            },
            {
              column: "TASK_STATE",
              condition: "=",
              value: "NON_ACTIVE",
            },
        ]},
        "columns":["PROJECT_ID","PROJECT_CODE","TASK_TYPE","DEMAND_CODE","PROJECT_ID","CREATE_TIME","CREATE_USER","PLAN_START_TIME",
        "PLAN_END_TIME","REAL_START_TIME","COMPLETE_TIME","TASK_NO","TASK_STATE","PERMISSION","RAISE_USER","APPROVAL_USER","COMPLETE_USER",
        "COMPLETE_USER_ID","SOURCE_TYPE","SURE_USER","DEMAND_LEVEL","STYLE_COLOR","EXTEND_ATTR","ATTACHMENT1","DEMAND_CODE","ATTACHMENT2",
        "ATTACHMENT3","DESCRIPTION","WORK_CONTENT","REMARK","FILE_NAME"],
      } 
    
    axios.post('/cw-pms-app/pms-work-task/queryPage', _data, {
      // responseType: 'resType',
      headers: {Authorization: 'Bearer ' + getToken() },
      }).then((res) => {
        // console.log('跳转',workTaskNum)
        state.workTaskNum = res.data.data.data.length;
        if (state.workTaskNum) state.fontColor = "#f00";
        else state.fontColor = "#606266"; 
      }).catch(err=> {
        console.log(err)
      });
  },
  GET_DIAGRAM: (state,diagram) => {
      state.diagramEntity = diagram;
  },
  USER_INFO: (state,user_info) => {
    sessionStorage.setItem("userInfoArray",JSON.stringify(user_info))
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  TRIGGERCHILDCOMPT_STATE(state,condition) {
    state['CHILDCOMPT_STATE'] = condition
  },
  SETPAGEDESIGNCOMPONENTDATA(state,condition) {
    state['pageDesignComponentData'] = condition
  },
}

const actions = {
  getDelNode({commit}, diagram){
    commit('DETE_COMPONENT',diagram)
  },
  setLineDatas({commit}, diagram){
    commit('SET_LINES_DATA',diagram)
  },
  setLineDatas({commit}, diagram){
    commit('IS_CANVAS_VIEW',diagram)
  },
  getWorkTaskNum({commit}, diagram){
    commit('WORK_TASK_NUM',diagram)
  },
  getDiagramEntity({commit}, diagram) {
    commit('GET_DIAGRAM', diagram)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  triggerChildComponent({ commit }, condition) {
    commit('TRIGGERCHILDCOMPT_STATE', condition);
  },
  setPageDesignComponentData({ commit }, condition) {
    commit('SETPAGEDESIGNCOMPONENTDATA', condition);
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
