
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);
import { PermissionMenu } from '@/api/index';
export default new Vuex.Store({
  state: {
    username: "",
    menu: {
      "sys": "user",
      "sys:user": "administrator",
      "finance": "financial",
      "operation:movieClassification": "topvideos",
      "operation:advertising": "start",
      "operation:notice": "management",
      "operation:tag": "communitylabel",
      "operation:channel": "channel",
      "content:movie": "movie",
      "content": "resources",
      "content:short": "shortVideo",
      "content:tvChannel": "television",
      "content:userCommunity": "community",
      "report:video": "vedio",
      "report:operation": "reportoperating",
      "report": "report",
      "activity:sign": "signin",
      "activity": "activity",
      "finance:merch": "merchants",
      "sys:log": "journal",
      "operation": "operating",

    },
    menuList: [],
    menuJson: [],
  },
  mutations: {
    // 保存当前登陆的用户名
    saveUserName (state, username) {
      state.username = username;
    },
    saveMenuList (state, menuList) {
      state.menuList = [...menuList];
    },
    saveMenuJson (state, menuJson) {
      state.menuJson = [...menuJson];
    },
    logout (state) {
      state.menuJson = [];
      state.menuList = [];
    }
  },
  actions: {
    GetMenuList: function (context) {
      const newMenu = []
      // let menuJson = context.state.menuJson;
      // if (menuJson && menuJson.length > 0) { // 判断有没有menus 有就直接返回
      //   return new Promise((resolve, reject) => {
      //     resolve(menuJson);
      //   })
      // } else {// 没有就去加载
      return PermissionMenu().then((res) => {
        const newRes = JSON.parse(JSON.stringify(res.data.body));
        newRes.forEach((element, index) => {
          if (context.state.menu[element.code]) {
            newMenu.push(
              {
                'icon': 'el-icon-document',
                'index': context.state.menu[element.code],
                'title': element.name
              }
            )
          }
          newMenu[index].subs = []
          element.children.forEach((res) => {
            if (context.state.menu[res.code]) {
              newMenu[index].subs.push(
                {
                  'index': context.state.menu[res.code],
                  'title': res.name
                }
              )
            }
          });
        });
        context.commit('saveMenuJson', res.data.body)
        context.commit('saveMenuList', newMenu)
      })
    }
  }
})