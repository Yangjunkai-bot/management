<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>后台操作日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="后台操作日志"
                     name="operation">
          <Operation></Operation>
        </el-tab-pane>
        <el-tab-pane label="后台登陆日志"
                     name="land">
          <Land></Land>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import Operation from './operation.vue'
import Land from './land.vue'
export default {
  components: { Operation, Land },
  data () {
    return {
      activeName: 'operation'
    }
  }
}
</script>

<style>
</style>