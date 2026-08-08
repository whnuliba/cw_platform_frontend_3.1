import Vue from 'vue'

// const state = PAGE_LIST()

// for (const key in state) {
//   // eslint-disable-next-line
//   if (state.hasOwnProperty(key)) {
//     state[key].id = key
//     state[key].params = ''
//     state[key].enable = false
//     state[key].show = false
//   }
// }

//state['IFRAME_BOX_STATE'] = false


const state = {
  IFRAME_BOX_STATE:false
}
const getters = {
  iframeArr: state => {
    const arr = []
    for (const key in state) {
      // eslint-disable-next-line
      if (state.hasOwnProperty(key)) {
        if (state[key].enable) {
          arr.push(state[key])
        }
      }
    }
    return arr
  },
  iframeBoxState: state => {
    return state['IFRAME_BOX_STATE']
  }
}

const mutations = {
  ADD_IFRAME(state, id) {
    Vue.set(state[id], 'enable', true)
  },
  SET_PAGE_LIST(state,page){
    Object.assign()
  },
  DELETE_IFRAME(state, id) {
    Vue.set(state[id], 'enable', false)
  },
  SHOW_IFRAME(state, id) {
    Vue.set(state[id], 'show', true)
  },
  HIDE_IFRAME(state, id) {
    Vue.set(state[id], 'show', false)
  },
  SHOW_IFRAME_BOX(state) {
    state['IFRAME_BOX_STATE'] = true
  },
  HIDE_IFRAME_BOX(state) {
    state['IFRAME_BOX_STATE'] = false
  },
  CHANGE_PARAMS(state, obj) {
    Vue.set(state[obj.id], 'params', obj.params)
  }
}

const actions = {
  createdPage({ commit }, obj) {
    if (obj.params) {
      commit('CHANGE_PARAMS', obj)
    }
    commit('ADD_IFRAME', obj.id)
    commit('SHOW_IFRAME', obj.id)
    commit('SHOW_IFRAME_BOX')
  },
  beforeDestroyPage({ commit }, id) {
    commit('HIDE_IFRAME_BOX')
    commit('DELETE_IFRAME', id)
  },
  activatedPage({ state, commit }, id) {
    if (state[id].show) return
    commit('SHOW_IFRAME', id)
    commit('SHOW_IFRAME_BOX')
  },
  deactivatedPage({ state, commit }, id) {
    if (!state[id].show) return
    commit('HIDE_IFRAME_BOX')
    commit('HIDE_IFRAME', id)
  },
  changeParams({ commit }, obj) {
    commit('CHANGE_PARAMS', obj)
  },
   setIframesPage({ commit },_page){
    const pageList =state//JSON.parse(sessionStorage.getItem("PAGE_LIST"))||{}
    if(!pageList.hasOwnProperty(_page.id)){
      const p =  {
        id:_page.id,
        params : '',
        enable : true,
        show :true,
        src :_page.href,
        name:_page.name
      }
      pageList[_page.id] =p 
    }else{
       const obj  =  pageList[_page.id];
       obj.id=_page.id,
       obj.params = '',
       obj.enable= true,
       obj.show =true,
       obj.src =_page.href,
       obj.name=_page.name
    }
   
    //sessionStorage.setItem('PAGE_LIST',JSON.stringify(pageList))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
