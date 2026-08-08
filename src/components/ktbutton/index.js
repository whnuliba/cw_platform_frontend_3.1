import store from '@/store/modules/btnrole'

/**
 * 判断是否有权限。根据传入的权限标识，查看是否存在于用户的权限标识集合内。
 */
export function hasPermission(perms) {
  let hasPermission = false
  const btnpermission = store.state.permission
  for (var i = 0; i < btnpermission.length; i++) {
    if (btnpermission[i] === perms) {
      hasPermission = true
      break
    }
  }
  return hasPermission
}
