<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 短视频管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="短视频管理"
                     name="management">
          <Management></Management>
        </el-tab-pane>
        <el-tab-pane label="短视频审核"
                     name="praudit">
          <Praudit></Praudit>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import Management from './management.vue'
import Praudit from './praudit.vue'
export default {
  components: { Praudit, Management },
  data () {
    return {
      activeName: ''
    }
  }
}
</script>

<style>
</style>