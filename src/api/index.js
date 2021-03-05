import http from '@/utils/http'
// 
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let resquest = "/api"
console.log(http.get)
// 登陆
export function Login (params) {
  return http.post(`${resquest}/sys/user/login`, params)
}
// 公告管理列表
export function noticePage (params) {
  return http.post(`${resquest}/sys/noticeManage/getNoticePage`, params)
}
// 新增公告
export function addNotice (params) {
  return http.post(`${resquest}/sys/noticeManage/addNotice`, params)
}
// 修改公告
export function updateNotice (params) {
  return http.post(`${resquest}/sys/noticeManage/updateNotice`, params)
}
// 图片上传
export function uploadPic (params) {
  return http.post(`${resquest}/sys/upload/uploadPic`, params)
}
// 广告管理列表
export function getAdPage (params) {
  return http.post(`${resquest}/sys/advertisingManage/getAdPage`, params)
}
// 新增广告
export function addAd (params) {
  return http.post(`${resquest}/sys/advertisingManage/addAd`, params)
}
// 编辑广告
export function updateAd (params) {
  return http.post(`${resquest}/sys/advertisingManage/updateAd`, params)
}
// 权限列表
export function permissionList (params) {
  return http.get(`${resquest}/sys/permission/list/${params}`)
}
// 角色列表
export function roleList (params) {
  return http.post(`${resquest}/sys/role/list`, params)
}
// 角色新增
export function roleAdd (params) {
  return http.post(`${resquest}/sys/role/save`, params)
}
// 角色编辑
export function roleUpdate (params) {
  return http.put(`${resquest}/sys/role/update`, params)
}