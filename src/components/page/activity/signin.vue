<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 活动签到
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-if="allowsVal"
           class="handle-box">
        活动开关:
        <el-switch v-model="status"
                   @change='updateVerify'>
        </el-switch>
      </div>
      <el-table :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="signSequence"
                         show-overflow-tooltip
                         align='center'
                         label="签到天数"></el-table-column>
        <el-table-column show-overflow-tooltip
                         align='center'
                         label="奖励类型">
          <template slot-scope="scope">
            {{scope.row.reward === 1 ? '金币' : '会员'}}
          </template>
        </el-table-column>
        <el-table-column prop="amount"
                         show-overflow-tooltip
                         align='center'
                         label="奖励数量"></el-table-column>
        <el-table-column prop="updateTime"
                         show-overflow-tooltip
                         align='center'
                         label="最后编辑时间">
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column prop="updateBy"
                         show-overflow-tooltip
                         align='center'
                         label="最后操作人"></el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-allow="{name: 'activity:sign:update'}"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="500px">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">

        <el-form-item label="签到天数">
          {{form.signSequence}}天
        </el-form-item>
        <el-form-item label="奖励类型"
                      prop="amount">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="form.reward">
                <el-option key="1"
                           label="金币"
                           :value="1"></el-option>
                <el-option key="2"
                           label="会员"
                           :value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input placeholder="请输入"
                        style="width:200px"
                        v-model="form.amount">
                <template slot="append">{{form.reward === 1 ? '个' : '天'}}</template>
              </el-input>

            </el-col>
          </el-row>
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
import allwo from '@/utils/allow.js'
import moment from 'moment'
import { getActivitySign, updateActivityStatus, updateActivityConfig } from '@/api/index';
export default {
  name: 'signin',
  data () {
    return {
      query: {
        "activityCode": 'sign'
      },
      status: false,
      tableData: [],
      editVisible: false,
      form: {},
      allowsVal: false,
      rules: {
        amount: [
          { required: true, message: '请输入奖励数量', trigger: 'blur' },
        ]
      },
    };
  },
  created () {
    allwo.Permissions('activity:sign:open').then((res) => {
      this.allowsVal = res
    })
    allwo.Permissions('activity:sign:list').then((res) => {
      if (res === true) {
        this.getData();
      }
    })
  },
  filters: {
    formatDate: function (value) {
      const newVal = value * 1000
      return moment(newVal).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    remove () {
      this.query = {
        current: 1,
        size: 10
      },
        this.getData()
    },
    getData () {
      getActivitySign(this.query).then(res => {
        this.tableData = res.data.body.configList;
        this.state = res.data.body.status
        this.pageTotal = res.data.body.totalCount;
      });
    },
    updateVerify (val) {
      const query = {
        "activityCode": "sign",
        "status": val ? 0 : 1
      }
      updateActivityStatus(query).then((res) => {
        if (res.data.code === 0) {
          // this.$message({
          //   message: '成功',
          //   type: 'success'
          // });
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
        this.getData()
      })
    },
    // 编辑操作
    handleEdit (index, row) {
      if (this.state === 1) {
        this.form = JSON.parse(JSON.stringify(row));
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
        })
      } else {
        this.$message({
          message: '请先停用活动',
          type: 'warning'
        });
      }

    },
    // 保存编辑
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          const newform = {
            signSequence: this.form.signSequence,
            reward: this.form.reward,
            amount: this.form.amount,
          }
          updateActivityConfig(newform).then((res) => {
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
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 200px;
}

.handle-input {
    width: 300px;
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
