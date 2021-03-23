<template>
  <div>
    <div class="handle-box">

      <child-header @selectContent='selectContent'
                    @getData='getData'
                    @closeSelect='closeSelect'
                    :multipleSelection='multipleSelection'
                    :query='query'></child-header>
    </div>
    <el-table :data="tableData"
              stripe
              :height="tableHeight"
              v-loading="loading"
              class="table"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              header-cell-class-name="table-header">
      <el-table-column type="selection"
                       width="55"
                       align="center"></el-table-column>
      <el-table-column type="index"
                       label="排序"
                       align='center'
                       width="50">
      </el-table-column>
      <el-table-column prop="username"
                       label="后台账号"></el-table-column>
      <el-table-column prop="nickName"
                       label="后台昵称"></el-table-column>
      <el-table-column prop="roleName"
                       label="角色"></el-table-column>
      <el-table-column prop="permissionNum"
                       label="权限数"></el-table-column>
      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.online ? '在线': '离线'}}
        </template>
      </el-table-column>
      <el-table-column label="在线时长"
                       align="center">
        <template slot-scope="scope">
          {{'2021-03-05' | onlineTime}}
        </template>
      </el-table-column>
      <el-table-column label="最后登出时间"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.lastLogoutTime}}
        </template>
      </el-table-column>
      <el-table-column v-if="allowsVal"
                       label="谷歌验证"
                       align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.verify"
                     @change='(event)=>{googleVerify(event,scope.row.id)}'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column v-if="allowsVal"
                       label="启/停用"
                       align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled"
                     @change='(event)=>{userEnadles(event,scope.row.id)}'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="250"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     v-allow="{name: 'sys:user:detail'}"
                     @click="handleDetails(scope.row)">详情</el-button>
          <el-button type="text"
                     v-if="scope.row.username !== nowusername"
                     class="red"
                     v-allow="{name: 'sys:user:delete'}"
                     @click="handleDelete(scope.$index, scope.row.id)">删除账号</el-button>
          <el-button type="text"
                     v-allow="{name: 'sys:user:update'}"
                     @click="handleEdit( scope.row.id)">修改密码</el-button>
          <el-button type="text"
                     v-if='scope.row.online === 1'
                     @click="handleOffline( scope.row.id)">踢线</el-button>
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

    <Details ref="details"></Details>
    <el-dialog title="修改密码"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="dialogVisible"
               width="30%">
      <el-form ref="userPassFroms"
               :rules="userPassRules"
               :model="userPassFroms"
               label-width="100px">

        <el-form-item label="新密码"
                      prop="password">
          <el-input v-model="userPassFroms.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="newPassword">
          <el-input v-model="userPassFroms.newPassword"
                    type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="()=>{this.dialogVisible = false}">取 消</el-button>
        <el-button type="primary"
                   @click="updataAllSave('userPassFroms')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import allwo from '@/utils/allow.js'
import { userList, userEnabled, userOffline, goolgeVerify, userUpdatePassword, userDelete } from '@/api/index';
import ChildHeader from './componets/childHeader.vue';
import Details from './componets/details.vue';
export default {
  name: 'basetable',
  data () {
    let userPassWord = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userPassFroms.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      query: {
        roleName: '',
        nickName: '',
        username: '',
        current: 1,
        size: 20
      },
      nowusername: '',
      userPassFroms: {},
      loading: '',
      tableData: [],
      tableHeight: window.innerHeight - 380,
      pageTotal: 0,
      form: {},
      allowsVal: false,
      multipleSelection: [],
      userPassRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度限制6-20', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: userPassWord, trigger: "blur" }
        ],
      },
      dialogVisible: false
    };
  },
  created () {
    allwo.Permissions('sys:user:update').then((res) => {
      this.allowsVal = res
    })
    allwo.Permissions('sys:user:list').then((res) => {
      if (res === true) {
        this.getData();
      }
    })
    this.nowusername = localStorage.getItem('username')
  },
  components: {
    ChildHeader,
    Details,
  },
  filters: {
    onlineTime: function (value) {
      const now = moment().format("YYYY-MM-DD HH:mm:ss")
      return moment(now).diff(moment(value), 'days')
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    handleDetails (row) {
      this.$refs.details.handlModel(row)
    },
    updataAllSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userUpdatePassword(this.userPassFroms).then((res) => {
            this.dialogVisible = false
            if (res.data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
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
    // 搜素事件
    selectContent (title, val, action) {
      if (action) {
        this.query = {
          roleName: '',
          nickName: '',
          username: '',
          current: 1,
          size: 10
        }
      }

      this.query[title] = val
      this.current = 1
      this.getData()

    },
    handleOffline (id) {
      userOffline(id).then((res) => {
        if (res.data.code === 0) {
          this.getData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    googleVerify (val, id) {
      goolgeVerify({ 'id': id, 'verify': val }).then((res) => {
        if (res.data.code === 0) {
          this.getData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    userEnadles (val, id) {

      userEnabled({ 'id': id, 'enabled': val }).then((res) => {
        if (res.data.code === 0) {
          this.getData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    closeSelect () {
      this.$refs.multipleTable.clearSelection();
    },
    // 获取列表
    getData () {
      this.loading = true
      userList(this.query).then(res => {
        this.tableData = res.data.body.records;
        this.pageTotal = res.data.body.total || 0
        this.loading = false
        this.query = {
          current: res.data.body.current,
          size: res.data.body.size
        }
      })
        .catch(error => {
          this.loading = false
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          userDelete(row).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: '删除成功',
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
        })
        .catch(() => { });
    },

    // 编辑操作
    handleEdit (id) {
      this.userPassFroms = {
        'id': id
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['userPassFroms'].clearValidate();
      })
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageIndex', val);
      this.getData();
    }
  }
};
</script>

<style scoped>
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
