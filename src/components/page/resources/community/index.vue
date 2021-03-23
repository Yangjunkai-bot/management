<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社区管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs type="border-card"
             v-model="activeName">
      <el-tab-pane label="社区管理"
                   name="management">
        <Management></Management>
      </el-tab-pane>
      <el-tab-pane label="社区审核"
                   v-if="isPraudit"
                   name="praudit">
        <Praudit></Praudit>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import allwo from '@/utils/allow.js'
import Management from './management.vue'
import Praudit from './praudit.vue'
export default {
  components: { Praudit, Management },
  data () {
    return {
      activeName: 'management',
      isPraudit: true,
    }
  },
  created () {
    allwo.Permissions('content:userCommunity:verify').then((res) => {
      this.isPraudit = res
    })
  }
}
</script>

<style>
</style>