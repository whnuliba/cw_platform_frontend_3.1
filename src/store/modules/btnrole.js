const state = {
  /* permission: [] */
  permission: JSON.parse(sessionStorage.getItem(`btnpermission`))
}

const mutations = {
  SET_PERMISSION(state, permission) {
    // permission 为传入的权限标识集合
    // 传入的权限集合 赋值给状态中的 permission
    state.permission = permission
    // 将按钮信息保存到sessionStorage
    sessionStorage.setItem('btnpermission', JSON.stringify(permission))
  }
}

const actions = {
  // 官方不推荐直接修改mutation， 可使用actions来提交 mutation
  SET_PERMISSION(context, permission) {
    // 提交到 mutation 中的 SET_PERMISSION 函数
    context.commit('SET_PERMISSION', permission)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
