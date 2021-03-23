import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI, { Form } from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import store from './utils/store/index'
import echarts from 'echarts'
import preventClick from './utils/clickStatefrom'
import allow from './utils/allow'

Vue.use(allow)
Vue.use(preventClick)
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'small'
});
const i18n = new VueI18n({
  locale: 'zh',
  messages
});
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const grantedResouse = treeToArray(store.state.menuList)
  const hasAuth = grantedResouse.some((item) => {
    return to.path.substr(1) === item.index;
  });
  console.log(from)
  console.log(to)
  const role = localStorage.getItem('token');
  if (!role && to.path !== '/login') {
    next('/login');
  }
  //  else if (!hasAuth && to.path !== '/dashboard' && to.path !== '/login') {
  //   next('/dashboard')
  // }
  else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    // if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //   Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //     confirmButtonText: '确定'
    //   });
    // } else {
    next();
    // }
  }
});

Vue.prototype.$echarts = echarts
new Vue({ // vue 初始化 
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');


function treeToArray (tree) {
  let arr = [];
  const expanded = datas => {
    if (datas && datas.length > 0) {
      datas.forEach(e => {
        arr.push(e);
        expanded(e.subs);
      })
    }
  };
  expanded(tree);
  return arr;
}