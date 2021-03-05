<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 管理员账号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="tabIndex"
               @tab-click='handliTable'>
        <el-tab-pane v-for="(data,index) in tablist"
                     :key='index'
                     :label="data.title"
                     :name='data.router'>
          <router-view></router-view>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data () {
    return {
      tablist: [
        { title: '子账号管理', router: '/child' },
        { title: '角色管理', router: '/role' }
      ],
      tabIndex: '/child'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.tabIndex = to.path;
    })
  },
  watch: {
    $route (to) {
      if (to.path === '/child')
        this.tabIndex = to.path
      if (to.path === '/role')
        this.tabIndex = to.path
    }
  },
  methods: {
    handliTable (tab, event) {
      console.log(tab, event)
      this.$router.push(tab.name);
    }
  },
}

</script>

<style>
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
</style>

