<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>后台操作日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-tabs v-model="activeName"
             type="border-card">
      <el-tab-pane v-if="isOperation"
                   label="后台操作日志"
                   name="operation">
        <Operation></Operation>
      </el-tab-pane>
      <el-tab-pane v-if="isLand"
                   label="后台登陆日志"
                   name="land">
        <Land></Land>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import allwo from '@/utils/allow.js'
import Operation from './operation.vue'
import Land from './land.vue'
export default {
  components: { Operation, Land },
  data () {
    return {
      activeName: 'operation',
      isOperation: true,
      isLand: true,
    }
  },
  created () {
    allwo.Permissions('sys:log:operate').then((res) => {
      this.isOperation = res
    })
    allwo.Permissions('sys:log:login').then((res) => {
      this.isLand = res
    })
  }
}
</script>

<style>
</style>