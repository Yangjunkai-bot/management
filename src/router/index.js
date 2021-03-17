import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/topvideos',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/operating/topvideos'),
          meta: { title: '视频分类' }
        },
        {
          path: '/television',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/resources/television'),
          meta: { title: '电视管理' }
        },
        {
          path: '/community',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/resources/community/index'),
          meta: { title: '社区管理' }
        },
        {
          path: '/movie',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/resources/movie'),
          meta: { title: '视频管理' }
        },
        {
          path: '/vedio',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/report/vedio'),
          meta: { title: '视频表报' }
        },
        {
          path: '/reportoperating',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/report/operating'),
          meta: { title: '运维报表' }
        },
        {
          path: '/shortVideo',
          component: () => import(/* webpackChunkName: "topvideos" */ '@/components/page/resources/shortVideo/index'),
          meta: { title: '短视频管理' }
        },
        {
          path: '/communitylabel',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/operating/communitylabel'),
          meta: { title: '社区标签管理' }
        },
        {
          path: '/start',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/operating/start'),
          meta: { title: '启动广告' }
        },
        {
          path: '/management',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/operating/management'),
          meta: { title: '公告管理' }
        },
        {
          path: '/channel',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/operating/channel'),
          meta: { title: '渠道管理' }
        },
        {
          path: '/administrator',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/administrator/index.vue'),
          meta: { title: '管理员账号' },
        },
        {
          path: '/journal',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/journal/index.vue'),
          meta: { title: '后台操作日志' },
        },
        {
          path: '/usermanagement',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/user/management.vue'),
          meta: { title: '会员管理' },
        },
        {
          path: '/merchants',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/financial/merchants.vue'),
          meta: { title: '商户管理' },
        },
        {
          path: '/signin',
          component: () => import(/* webpackChunkName: "community" */ '@/components/page/activity/signin.vue'),
          meta: { title: '签到活动' },
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: { title: '403' }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
