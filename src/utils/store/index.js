
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: "",

  },
  mutations: {
    // 保存当前登陆的用户名
    saveUserName (state, username) {
      state.username = username;
    },
    // 保存当前点击的数据源
    saveCurrDbSource (state, currDbSource) {
      state.currDbSource = currDbSource;
    },
    // 保存当前点击的元数据
    saveCurrJobData (state, currJobData) {
      state.currJobData = currJobData;
    },
    // 保存所有数据源
    saveDbSource (state, DbSource) {
      state.DbSource = DbSource;
    }
  }
})