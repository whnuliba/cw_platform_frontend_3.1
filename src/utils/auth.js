import Cookies from 'js-cookie'

const TokenKey = 'X-Token'
const RefreshTokenKey = '-RefreshToken'
const AccessTokenKey = 'AccessToken'

const RoleKey = 'X-RoleKey'

export function getRoles() {
  let roleStr = Cookies.get(RoleKey)
  if(roleStr && roleStr!=null && roleStr!='')
    return JSON.parse(roleStr)
  return Cookies.get(RoleKey)
}

export function setRoles(roles) {
   if(!roles || roles==null)
     return
  return Cookies.set(RoleKey, JSON.stringify(roles))
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSToken() {
  return sessionStorage.getItem(sessionStorage.getItem('userInfo') + RefreshTokenKey)
}

export function setSToken(username, token) {
  return sessionStorage.setItem(username + RefreshTokenKey, token)
}

export function removeSToken() {
  return sessionStorage.removeItem(sessionStorage.getItem('userInfo') + RefreshTokenKey)
}

export function getLToken() {
  return Cookies.get(AccessTokenKey)
}

export function setLToken(token) {
  var millisecond = new Date().getTime()
  var expires = sessionStorage.getItem('expires')// 分钟
  var expiresTime = new Date(millisecond + 60 * 1000 * parseInt(expires))
  return Cookies.set('AccessToken', token, { expires: expiresTime })
}

export function removeLToken() {
  return Cookies.remove(AccessTokenKey)
}
