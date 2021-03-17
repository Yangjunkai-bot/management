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
        <el-tab-pane key='1'
                     label="子账号管理"
                     name='1'>
          <Child></Child>
        </el-tab-pane>
        <el-tab-pane key='2'
                     label="角色管理"
                     name='2'>
          <Role></Role>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Child from './child.vue';
import Role from './role.vue';
export default {
  components: { Child, Role },
  name: 'tabs',
  data () {
    return {
      tablist: [
        { title: '子账号管理' },
        { title: '角色管理' }
      ],
      tabIndex: '1'
    }
  },
  methods: {
    handliTable (tab) {
      this.tabIndex = tab.name
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

