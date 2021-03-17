<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 电视管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="id"
                         align='center'
                         label="ID"
                         width="50">
        </el-table-column>
        <el-table-column prop="name"
                         show-overflow-tooltip
                         label="频道名称"
                         align='center'></el-table-column>
        <el-table-column label="频道简介"
                         show-overflow-tooltip
                         align='center'
                         prop='intro'>
        </el-table-column>
        <el-table-column label="宣传图"
                         width="110px"
                         align='center'>
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px"
                      :src="scope.row.image"
                      :preview-src-list="[scope.row.image]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         label="频道订阅价格"
                         align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.free === 0 || scope.row.free === 1">
              {{scope.row.free === 0 ? '限时免费' : 'vip限时免费'}}
            </span>
            <span v-else> {{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center'
                         label="单次订阅时间">
          <template slot-scope="scope">
            {{scope.row.subscribe ? scope.row.subscribe +'天' : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="启/停用"
                         align='center'>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       @change='(event)=>{handleSwitch(event,scope.row)}'>
            </el-switch>
          </template>
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
               width="50%">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="频道名称"
                          prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启/停用"
                          prop="status">
              <el-switch v-model="form.status">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="频道定价"
                      prop="free">
          <el-radio-group v-model="form.free">
            <el-radio :label="0">限时免费</el-radio>
            <el-radio :label="1">vip限时免费</el-radio>
            <el-radio :label="2">订阅价格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if='form.free === 2'
                          label="订阅价格"
                          prop="amount">
              <el-input v-model="form.amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if='form.free === 2'
                          label="订阅天数"
                          prop="subscribe">
              <el-input v-model="form.subscribe">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="频道简介"
                      prop="intro">
          <el-input type="textarea"
                    v-model="form.intro"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getTvChannelList, updateTvChannel } from '@/api/index';
export default {
  name: 'television',
  data () {
    return {
      operationTitle: '',
      tableData: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入频道名称', trigger: 'blur' },
          { max: 10, message: '最大输入10个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入频道简介', trigger: 'blur' },
        ],
        free: [
          { required: true, message: '请选择频道定价', trigger: 'change' },
        ],
        amount: [
          { required: true, message: '请输入订阅价格', trigger: 'blur' },
        ],
        subscribe: [
          { required: true, message: '请输入订阅天数', trigger: 'blur' },

        ],
      },
    };
  },
  created () {
    this.getData();
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getData () {
      getTvChannelList().then(res => {
        this.tableData = res.data.body;
      });
    },
    handleSwitch (value, row) {
      const newStatr = value ? 0 : 1
      this.storeStart(newStatr, row)

    },
    storeStart (status, row) {
      const NewRow = JSON.parse(JSON.stringify(row))
      NewRow.status = status
      // NewRow.createTime = NewRow.createTime / 1000;
      let mess = ''
      if (status === 0) {
        mess = '已启动'
      } else if (status === 1) {
        mess = '已禁用'
      }
      updateTvChannel(NewRow).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: mess,
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
    },
    // 编辑操作
    handleEdit (operation, index, row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.formRules.clearValidate();
      })

    },
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          updateTvChannel(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: '编辑成功',
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
