import http from '@/utils/http'
// 
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let resquest = "/api"
console.log(http.get)

export function Login (params) {
  return http.post(`${resquest}/sys/user/login`, params)
}
export function noticePage (params) {
  return http.post(`${resquest}/sys/noticeManage/getNoticePage`, params)
}
export function addNotice (params) {
  return http.post(`${resquest}/sys/noticeManage/addNotice`, params)
}
export function updateNotice (params) {
  return http.post(`${resquest}/sys/noticeManage/updateNotice`, params)
}
export function uploadPic (params) {
  return http.post(`${resquest}/sys/upload/uploadPic`, params)
}