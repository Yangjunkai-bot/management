<template>
  <el-dialog title="用户详情"
             :show-close='false'
             :close-on-click-modal='false'
             :visible.sync="editVisible"
             top="8vh"
             width="1000px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="账号信息"
                   name="detail">
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 label-width="100px"
                 label-position="top"
                 class="demo-ruleForm">
          <el-card shadow="always"
                   class="cards">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="账号"
                              prop="username">
                  <el-input disabled
                            v-model="ruleForm.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- <el-form-item label="密码"
                          prop="password">
              <el-input disabled
                        v-model="ruleForm.password"
                        type="password"></el-input>
            </el-form-item> -->
              </el-col>
              <el-col :span="4">
                <el-form-item label="启/停用"
                              prop="enabled">
                  <el-switch disabled
                             v-model="ruleForm.enabled"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="always"
                   class="cards">
            <div slot="header"
                 class="clearfix">
              <span>账号信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="后台昵称"
                              prop="nickName">
                  <el-input disabled
                            v-model="ruleForm.nickName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号"
                              prop="mobile">
                  <el-input disabled
                            v-model="ruleForm.mobile"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邮箱"
                              prop="email">
                  <el-input disabled
                            v-model="ruleForm.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="always"
                   class="cards">
            <div slot="header"
                 class="clearfix">
              <span>权限</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="角色"
                              prop="roleId">
                  {{ruleForm.roleName ? ruleForm.roleName : '-'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权限数"
                              prop="roleId">
                  {{ruleForm.permissionNum ? ruleForm.permissionNum : '-'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注"
                              prop="roleId">
                  {{ruleForm.description ? ruleForm.description : '无'}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="登陆日志"
                   name="login">
        <div class="handle-box">
          <el-date-picker class="handle-selectdata mr10"
                          v-model="selectData"
                          @change='handeSlectData'
                          type="datetimerange"
                          value-format="timestamp"
                          :default-time="['00:00:00', '23:59:59']"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>

          <el-button type="primary"
                     icon="el-icon-search"
                     v-preventClick
                     @click="handleSearch">搜索</el-button>
          <el-button type="danger"
                     v-preventClick
                     @click="remove">重制</el-button>
        </div>

        <el-table :data="tableData"
                  border
                  :height="tableHeight"
                  class="table"
                  ref="multipleTable"
                  header-cell-class-name="table-header">
          <el-table-column label="序列"
                           width="80"
                           type="index"
                           align="center">
          </el-table-column>
          <el-table-column prop="username"
                           show-overflow-tooltip
                           align='center'
                           label="后台账号"></el-table-column>
          <el-table-column show-overflow-tooltip
                           align='center'
                           label="时间">
            <template slot-scope="scope">
              {{scope.row.loginTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="onlineTime"
                           align='center'
                           label="在线时长">
          </el-table-column>
          <el-table-column prop="ip"
                           show-overflow-tooltip
                           align='center'
                           label="ip"></el-table-column>
          <el-table-column prop="os"
                           show-overflow-tooltip
                           align='center'
                           label="设备"></el-table-column>
          <el-table-column prop="browser"
                           show-overflow-tooltip
                           align='center'
                           label="浏览器"></el-table-column>
          <el-table-column show-overflow-tooltip
                           align='center'
                           label="结果">
            <template slot-scope="scope">
              <span style="color:red"
                    v-if="scope.row.result == 0">{{'失败'}}</span>
              <span style="color:rgb(19, 206, 102)"
                    v-if="scope.row.result == 1">{{ '成功'}}</span>
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
      </el-tab-pane>
    </el-tabs>

    <span slot="footer"
          class="dialog-footer">
      <el-button @click="editVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { userDetail, sysloginList } from '@/api/index';
export default {
  data () {
    return {
      ruleForm: {},
      editVisible: false,
      roleList: [],
      activeName: 'detail',
      query: {
        size: 20,
        current: 1,
      },
      selectData: [],
      pageTotal: 0,
      tableHeight: 433,
      tableData: [],
      username: '',
    }
  },
  filters: {
    formatDate: function (value) {
      if (value) {
        const newValue = value * 1000
        return moment(newValue).format('YYYY-MM-DD HH:mm:ss')
      }

    }
  },
  methods: {
    handlModel (val) {
      this.activeName = 'detail',
        this.username = val.username
      this.query.username = val.username
      userDetail(val.id).then((res) => {
        if (res.data.code === 0) {
          this.ruleForm = res.data.body
        }
      })
      this.getData()
      this.editVisible = true
    },
    remove () {
      this.query = {
        current: 1,
        size: 20,
        username: this.username
      },
        this.selectData = []
      this.getData()
    },
    handeSlectData (data) {
      if (data) {
        this.query.beginTime = data[0] / 1000
        this.query.endTime = data[1] / 1000
      } else {
        delete this.query.beginTime
        delete this.query.endTime
      }
    },
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      sysloginList(this.query).then(res => {
        this.tableData = res.data.body.content;
        this.pageTotal = res.data.body.totalElements
      });
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'current', 1);
      this.getData();
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'current', val);
      this.getData();
    }
  }
}
</script>

<style>
</style>