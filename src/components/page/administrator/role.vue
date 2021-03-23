<template>
  <div>
    <RoleModel :modelTitle='modelTitle'
               :defaultVal='defaultVal'
               ref="rolemodel" />
    <div class="handle-box">
      <el-button type="primary"
                 @click="handleEdit('add')"
                 v-allow="{name: 'sys:role:save'}"
                 class="mr10">新增角色</el-button>
    </div>
    <el-table :data="tableData"
              v-loading="loading"
              :height="tableHeight"
              stripe
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header">
      <el-table-column type="index"
                       label="排序"
                       align='center'
                       show-overflow-tooltip
                       width="50">

      </el-table-column>
      <el-table-column prop="name"
                       show-overflow-tooltip
                       align='center'
                       label="角色名称"></el-table-column>
      <el-table-column label="权限数"
                       align='center'>
        <template slot-scope="scope">{{scope.row.permissionNum}}</template>
      </el-table-column>
      <el-table-column label="子账号数"
                       align='center'
                       show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.userNum}}</template>
      </el-table-column>
      <el-table-column align='center'
                       show-overflow-tooltip
                       label="备注">
        <template slot-scope="scope">{{scope.row.address ? scope.row.address:'-'}}</template>
      </el-table-column>
      <el-table-column label="操作"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     v-allow="{name: 'sys:role:update'}"
                     @click="handleEdit('edit', scope.row)">编辑</el-button>
          <el-button type="text"
                     class="red"
                     v-allow="{name: 'sys:role:delete'}"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background
                     :page-sizes="[20, 50, 100, 200]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :current-page="query.current"
                     :page-size="query.size"
                     :total="pageTotal"
                     @size-change="handleSizeChange"
                     @current-change="handlePageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import RoleModel from './componets/rolemodel'
import { roleList } from '@/api/index';
import allwo from '@/utils/allow.js'
export default {
  name: 'basetable',
  data () {
    return {
      operationTitle: '',
      tableData: [],
      pageTotal: 0,
      form: {},
      defaultVal: null,
      modelTitle: "",
      tableHeight: window.innerHeight - 370,
      loading: false,
      query: {
        "current": 1,
        "size": 20
      },
      pageTotal: 0,
      editVisible: false,
    };
  },
  components: {
    RoleModel
  },
  created () {
    allwo.Permissions('sys:log:login').then((res) => {
      if (res === true) {
        allwo.Permissions('sys:role:list').then((res) => {
          if (res === true) {
            this.getData();
          }
        })
      }
    })
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData () {
      this.loading = true
      roleList(this.query).then(res => {
        this.tableData = res.data.body.records;
        this.pageTotal = res.data.body.total || 0
        this.loading = false
      })
        .catch(error => {
          this.loading = false
        })

    },
    handlePageChange (page) {
      this.query.current = page
      this.getData()
    },
    handleEdit (title, value) {
      this.$refs.rolemodel.openDia();
      if (title === 'add') {
        this.modelTitle = '新增角色'
      } else {
        this.modelTitle = '编辑角色'
        this.defaultVal = value

      }
    },
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 删除操作
    handleDelete (index, row) {
      if (row.userNum === 0) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.$message.success('删除成功');
            this.tableData.splice(index, 1);
          })
          .catch(() => { });
      } else {
        this.$message.warning('子账号为0时才能删除');
      }

    },
  }
};
</script>

<style scoped>
.modelIpntWidth {
    width: 100%;
}
.handle-box {
    text-align: right;
    margin-bottom: 10px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
