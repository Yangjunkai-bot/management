import http from '@/utils/http'
// 
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let resquest = "/api"
// 登陆
export function Login (params) {
  return http.post(`${resquest}/sys/user/login`, params)
}
// 当前权限列表
export function PermissionMenu (params) {
  return http.get(`${resquest}/sys/permission/menu`, params)
}
// 公告管理列表
export function noticePage (params) {
  return http.post(`${resquest}/sys/noticeManage/getNoticePage`, params)
}
// 新增公告
export function addNotice (params) {
  return http.put(`${resquest}/sys/noticeManage/addNotice`, params)
}
// 修改公告
export function updateNotice (params) {
  return http.put(`${resquest}/sys/noticeManage/updateNotice`, params)
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
  return http.put(`${resquest}/sys/advertisingManage/addAd`, params)
}
// 编辑广告
export function updateAd (params) {
  return http.put(`${resquest}/sys/advertisingManage/updateAd`, params)
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
// 用户列表
export function userList (params) {
  return http.post(`${resquest}/sys/user/list`, params)
}
// 批量更新用户角色
export function roleAllUpdate (params) {
  return http.post(`${resquest}/sys/user/update/roles`, params)
}
// 新增用户
export function userAdd (params) {
  return http.post(`${resquest}/sys/user/save`, params)
}
// 用户启动/停用
export function userEnabled (params) {
  return http.put(`${resquest}/sys/user/update/enabled`, params)
}
// 踢用户下线
export function userOffline (params) {
  return http.post(`${resquest}/sys/user/offline/${params}`,)
}
// goolge验证
export function goolgeVerify (params) {
  return http.put(`${resquest}/sys/user/update/verify`, params)
}
// 用户详情
export function userDetail (params) {
  return http.get(`${resquest}/sys/user/detail/${params}`,)
}
// 修改用户密码
export function userUpdatePassword (params) {
  return http.put(`${resquest}/sys/user/update/password`, params)
}
// 删除用户
export function userDelete (params) {
  return http.delete(`${resquest}/sys/user/delete/${params}`,)
}
// 视频分类列表
export function MovieClassificationList (params) {
  return http.get(`${resquest}/sys/movieClassification/getMovieClassificationList`, params)
}
// 新增视频分类
export function addMovieClassification (params) {
  return http.put(`${resquest}/sys/movieClassification/addMovieClassification`, params)
}
// 编辑视频分类
export function updateMovieClassification (params) {
  return http.put(`${resquest}/sys/movieClassification/updateMovieClassification`, params)
}
// 社区标签列表
export function getTagList (params) {
  return http.get(`${resquest}/sys/tag/getTagList`, params)
}
// 新增社区标签
export function addTag (params) {
  return http.put(`${resquest}/sys/tag/addTag`, params)
}
// 编辑社区标签
export function updateTag (params) {
  return http.put(`${resquest}/sys/tag/updateTag`, params)
}
// 电视管理列表
export function getTvChannelList (params) {
  return http.get(`${resquest}/sys/tvChannel/getTvChannelList`, params)
}
// 电视管理编辑
export function updateTvChannel (params) {
  return http.put(`${resquest}/sys/tvChannel/updateTvChannel`, params)
}
// 视频管理列表
export function getMoviePage (params) {
  return http.post(`${resquest}/sys/movie/getMoviePage`, params)
}
// 运营渠道管理列表
export function getChannelList (params) {
  return http.get(`${resquest}/sys/operationChannel/getChannelList`, params)
}
// 新增运营渠道
export function addOperationChannel (params) {
  return http.put(`${resquest}/sys/operationChannel/addOperationChannel`, params)
}
// 编辑运营渠道
export function updateOperationChannel (params) {
  return http.put(`${resquest}/sys/operationChannel/updateOperationChannel`, params)
}
// 运营报表列表
export function getOperationReportPage (params) {
  return http.post(`${resquest}/sys/operationReport/getOperationReportPage`, params)
}
// 运营报表导出
export function downloadOperationReport (params) {
  return http.post(`${resquest}/sys/operationReport/downloadOperationReport`, params)
}
// 编辑视频管理
export function updateMovie (params) {
  return http.put(`${resquest}/sys/movie/updateMovie`, params)
}
// 视频报表列表
export function getVideoReportPage (params) {
  return http.post(`${resquest}/sys/videoReport/getVideoReportPage`, params)
}
// 视频报表导出
export function downloadVideoReport (params) {
  return http.post(`${resquest}/sys/videoReport/downloadVideoReport`, params)
}
// 系统操作日志列表
export function operateList (params) {
  return http.post(`${resquest}/sys/operate/log/list`, params)
}
// 系统登陆日志列表
export function sysloginList (params) {
  return http.post(`${resquest}/sys/user/login/log/list`, params)
}
// 社区管理列表
export function getUserCommunityPage (params) {
  return http.post(`${resquest}/sys/userCommunity/getUserCommunityPage`, params)
}
// 社区管理编辑
export function updateUserCommunity (params) {
  return http.put(`${resquest}/sys/userCommunity/updateUserCommunity`, params)
}
// 社区管理图片删除
export function delUserCommunityImage (params) {
  return http.delete(`${resquest}/sys/userCommunity/delUserCommunityImage`, params)
}
// 社区管理置顶/取消置顶
export function updateTopStatus (params) {
  return http.put(`${resquest}/sys/userCommunity/updateTopStatus`, params)
}
// 会员管理列表
export function accountList (params) {
  return http.post(`${resquest}/sys/account/list`, params)
}
// 会员管理详情
export function accountDetail (params) {
  return http.get(`${resquest}/sys/account/detail/${params}`,)
}
// 会员管理编辑
export function accountUpdate (params) {
  return http.put(`${resquest}/sys/account/update`, params)
}
// 商户管理列表
export function settingList (params) {
  return http.post(`${resquest}/sys/finance/merch/setting/list`, params)
}
// 商户管理新增
export function settingSave (params) {
  return http.post(`${resquest}/sys/finance/merch/setting/save`, params)
}
// 商户管理编辑
export function settingUpdate (params) {
  return http.put(`${resquest}/sys/finance/merch/setting/update`, params)
}
// 商户状态更新
export function settingUpdateStatus (params) {
  return http.put(`${resquest}/sys/finance/merch/setting/update/status`, params)
}
// 商户管理删除
export function settingDelete (params) {
  return http.delete(`${resquest}/sys/finance/merch/setting/delete/${params}`,)
}
// 签到活动列表
export function getActivitySign (params) {
  return http.post(`${resquest}/sys/activity/getActivitySign`, params)
}
// 启停用签到活动
export function updateActivityStatus (params) {
  return http.put(`${resquest}/sys/activity/updateActivityStatus`, params)
}
// 签到活动编辑
export function updateActivityConfig (params) {
  return http.put(`${resquest}/sys/activity/updateActivityConfig`, params)
}
// 首页运营数据统计
export function getUserOperationData (params) {
  return http.post(`${resquest}/sys/operationOverview/getUserOperationData`, params)
}

