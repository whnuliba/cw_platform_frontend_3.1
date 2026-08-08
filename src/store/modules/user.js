/* import { login, logout, getInfo } from '@/api/user' */
import { getToken, setToken, removeToken, removeSToken,setRoles,getRoles } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getRole } from '@/api/roles'
import Cookies from 'js-cookie'


const state = {
  /* token: getToken(), */
  // token数据持久化，防止页面刷新丢失
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  realName: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_REALNAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    setRoles(roles)
    state.roles = roles
  }
}

const actions = {
  setCookie(key,value){
       Cookies.set(key, value)
  },
  getCookie(key){
    Cookies.get(key)
  },
  removeCookie(key){
    Cookies.remove(key)
  },
  setToken({ commit }, tk){
    commit('SET_TOKEN', tk)
  },
  // user login
  login({ commit }, resp) {
     const data = resp.data

    // const { username } = userInfo
    /* const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response */
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userInfo.username)
        commit('SET_REALNAME', data.userInfo.realName)
        setToken(data.token)
        //获取当前用户的角色
        if(data){
          sessionStorage.setItem('tmp_cache_roles',JSON.stringify(data.userInfo.authorities))
        }
       
       /*  resolve()
      }).catch(error => {
        reject(error)
      })
    }) */
  },

  // get user info
  // getInfo({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     const roleid = sessionStorage.getItem('roleid')
  //     getRole({ roleid: parseInt(roleid) }).then(response => {
  //       const data = {}
  //       Object.assign(data, response.data)
  //       const roles = []
  //       roles.push(data.ROLE_CODE)
  //       commit('SET_ROLES', roles)
  //       commit('SET_AVATAR', data.ROLE_AVATAR)
  //       commit('SET_INTRODUCTION', data.ROLE_REMARK)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  getInfo({ commit }) {
    let role =  JSON.parse(sessionStorage.getItem('tmp_cache_roles'))
    if(!role || role==null){
      role =getRoles()
    }
    commit('SET_ROLES', role)
    return role
  },

  // user logout
  logout({ commit, state, dispatch }) {
    /* return new Promise((resolve, reject) => {
      logout(state.token).then(() => { */
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeSToken()
        resetRouter()
        sessionStorage.removeItem('tmp_cache_roles')
        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })

        /* resolve()
      }).catch(error => {
        reject(error)
      })
    }) */
  },

  // reset token
  resetToken({ commit }) {
    /* return new Promise(resolve => { */
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      sessionStorage.removeItem('tmp_cache_roles')
      removeToken()
      removeSToken()
      sessionStorage.removeItem('userInfo')
      /* resolve()
    }) */
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
     // setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
