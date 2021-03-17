<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 渠道管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary"
                   @click="handleEdit('add')"
                   class="mr10">新增渠道</el-button>
      </div>
      <el-table :data="tableData"
                v-loading="loading"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index"
                         align='center'
                         label="排序"
                         width="50">
        </el-table-column>
        <el-table-column prop="name"
                         align='center'
                         show-overflow-tooltip
                         label="渠道名称"></el-table-column>
        <el-table-column label="渠道标示"
                         align='center'
                         show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.code ? scope.row.code : '-'}}</template>
        </el-table-column>

        <el-table-column label="添加时间"
                         align='center'
                         show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime |formatDate}}</template>
        </el-table-column>
        】
        <el-table-column label="最后编辑人"
                         align='center'
                         show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.updateBy ? scope.row.updateBy : '-'}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="handleEdit('edit',scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="operationTitle"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="40%">
      <el-form ref="form"
               :rules="rules"
               :model="form"
               label-width="90px">
        <el-form-item label="渠道名称"
                      prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="渠道说明"
                      prop="code">
          <el-input type="textarea"
                    v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getChannelList, addOperationChannel, updateOperationChannel } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      operationTitle: '',
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      loading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '渠道名称', trigger: 'blur' },
          { max: 10, message: '最大输入10个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '渠道标示', trigger: 'blur' },
          { max: 10, message: '最大输入10个字符', trigger: 'blur' }
        ],
      }
    };
  },
  created () {
    this.getData();
  },
  filters: {
    formatDate: function (value) {
      const newValue = value * 1000
      return moment(newValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData () {
      this.loading = true
      getChannelList().then(res => {
        this.loading = false
        this.tableData = res.data.body
      });
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功');
          this.tableData.splice(index, 1);
        })
        .catch(() => { });
    },
    // 编辑操作
    handleEdit (operation, index, row) {
      if (operation === 'add') {
        this.operationTitle = '新增渠道'
        this.form = {}
        this.editVisible = true;
      } else {
        this.operationTitle = '编辑渠道'
        this.form = JSON.parse(JSON.stringify(row));
        this.editVisible = true;
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    // 保存编辑
    saveEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = false;
          (this.operationTitle === '新增渠道' ? addOperationChannel : updateOperationChannel)(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: this.operationTitle === '新增渠道' ? '新增成功' : '编辑成功',
                type: 'success'
              });
              this.getData()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          })
        } else {
          return false;
        }
      });
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
