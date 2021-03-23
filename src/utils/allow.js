//clickStatefrom.js文件
import store from './store'

let menuJson = [];
let xhr;
async function provied () { // 自己做缓存，不依赖store.state
  if (menuJson.length == 0) {
    if (!xhr) {
      xhr = store.dispatch('GetMenuList');
      xhr.then((...args) => {
        const grantedResouse = treeToArray(store.state.menuJson);
        menuJson = grantedResouse;
      });
    }
    await xhr;
  }
  return menuJson;
}

export default {
  install (Vue) {
    // 判断页面功能
    Vue.directive('allow', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: async function (el, binding, vnode) {
        let grantedResouse = await provied();
        const hasAuth = grantedResouse.some((item) => {
          return binding.value.name === item.code;
        });
        if (!hasAuth) {

          // el.disabled = true
          if (vnode) {
            if (vnode.componentInstance.$el.className.indexOf('el-button--text') != -1) {
              el.style.color = '#C0C4CC !important'
              vnode.componentInstance.$el.className = 'el-button el-button--text el-button--small is-disabled'
              vnode.componentInstance.$el.disabled = true
            } else if (vnode.componentInstance.$el.className.indexOf('el-button--primary') != -1) {
              vnode.componentInstance.$el.className = vnode.componentInstance.$el.className + ' is-disabled'
              vnode.componentInstance.$el.disabled = true

            } else {

              vnode.componentInstance.disabled = true
            }


            // vnode.componentInstance._isMounted = false
            // vnode.componentInstance.disabled = true
          }

          // el.parentNode && el.parentNode.removeChild(el)
        }
      }
    });
  },
  Permissions
}
async function Permissions (val) {
  let grantedResouse = await provied();
  const hasAuth = grantedResouse.some((item) => {
    return val === item.code;
  });
  return hasAuth
}
function treeToArray (tree) {
  let arr = [];
  const expanded = datas => {
    if (datas && datas.length > 0) {
      datas.forEach(e => {
        arr.push(e);
        expanded(e.children);
      })
    }
  };
  expanded(tree);
  return arr;
}