<template>
  <div>
    <el-button type="primary"
               v-allow="{name: 'sys:user:update'}"
               class="handle-del mr10"
               @click="updAllSelection">批量变更角色</el-button>
    <el-select v-model="selectDefault"
               placeholder="查询条件"
               class="handle-select mr10">
      <el-option key="1"
                 label="后台账号"
                 value="username"></el-option>
      <el-option key="2"
                 label="后台昵称"
                 value="nickName"></el-option>
      <el-option key="3"
                 label="角色名称"
                 value="roleName"></el-option>
    </el-select>

    <el-input v-model="selectContent"
              placeholder="搜索内容"
              @keyup.enter.native="handleSearch('sear')"
              class="handle-input mr10"></el-input>
    <el-button type="primary"
               v-allow="{name: 'sys:user:list'}"
               icon="el-icon-search"
               @click="handleSearch('sear')">搜索</el-button>
    <el-button type="danger"
               v-allow="{name: 'sys:user:list'}"
               @click="handleSearch('remove')">重制</el-button>
    <el-button type="primary"
               @click="handleSearch"
               style="float:right">导出报表</el-button>
    <el-button type="primary"
               @click="handleAddButton"
               v-allow="{name: 'sys:user:save'}"
               icon="el-icon-plus"
               style="float:right">新增</el-button>
    <!-- 用户新增弹窗 -->
    <el-dialog title="新增用户"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="700px">
      <el-form :model="ruleForm"
               :rules="rules"
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
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码"
                            prop="password">
                <el-input v-model="ruleForm.password"
                          type="password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="启/停用"
                            prop="enabled">
                <el-switch v-model="ruleForm.enabled"></el-switch>
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
                <el-input v-model="ruleForm.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号"
                            prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮箱"
                            prop="email">
                <el-input v-model="ruleForm.email"></el-input>
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
                <el-select v-model="ruleForm.roleId"
                           @change="(event)=>{handleRoleSelect(event)}"
                           placeholder="请选择权限">
                  <el-option v-for="(data,index) in roleList"
                             :key="index"
                             :label="data.name"
                             :value="data.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限数"
                            prop="email">
                {{selectedRole.permissionNum ? selectedRole.permissionNum : 0}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限数"
                            prop="email">
                {{selectedRole.description ? selectedRole.description : '无'}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量变更角色弹窗 -->
    <el-dialog title="批量更改角色"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="dialogVisible"
               width="400px">
      <el-form ref="updataAllFroms"
               :rules="updataRules"
               :model="updataAllFrom"
               label-width="100px">

        <el-form-item label="批量数量">
          {{updataAllFrom.num}}
        </el-form-item>
        <el-form-item label="变更角色"
                      prop="roleId">
          <el-select v-model="updataAllFrom.roleId"
                     style="width:200px">
            <el-option v-for="(data,index) in roleList"
                       :key="index"
                       :label="data.name"
                       :value="data.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeUpdataRoleModel()">取 消</el-button>
        <el-button type="primary"
                   @click="updataAllSave('updataAllFroms')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { roleList, roleAllUpdate, userAdd } from '@/api/index';
export default {
  props: {
    query: {
      type: Object,
      default: {},

    },
    multipleSelection: {
      type: Array,
      default: []
    }
  },
  data () {
    let validUsername = (rule, value, callback) => {
      const regName = /^(?![^A-Za-z]+$)(?![^0-9]+$)[0-9A-Za-z_]{5,20}$/
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!regName.test(value)) {
        callback(
          new Error(
            "用户名要求数字、字母、下划线的组合 数字和字母必须存在 长度为4-15个字符"
          )
        );
      } else {
        callback()
      }
    }
    let checkEmail = (rule, value, callback) => {//验证邮箱
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (this.ruleForm.email != '' && !regEmail.test(this.ruleForm.email)) {
        callback(new Error('请输入有效的邮箱'));
      } else {
        callback()
      }
    }
    return {
      selectDefault: 'username',
      selectContent: '',
      editVisible: false,
      dialogVisible: false,
      roleList: [],
      ruleForm: {
        enabled: false
      },
      selectedRole: {},
      updataAllFrom: {
        userIdList: []
      },
      updataRules: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
      },
      rules: {
        username: [
          { required: true, validator: validUsername, trigger: "blur" }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度限制6-20', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 10, message: '最大长度10个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 10, message: '最大长度10个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: "blur" }
        ],
        roleId: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ],
      }
    }
  },
  created () {
    this.rolesList()
  },
  methods: {
    handleRoleSelect (data) {
      this.roleList.forEach((ele) => {
        if (ele.id === data) {
          this.selectedRole = ele
        }
      })
    },
    closeUpdataRoleModel () {
      this.dialogVisible = false
      this.$emit('closeSelect')
    },
    updataAllSave (formName) {
      this.$emit('closeSelect')
      this.dialogVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          roleAllUpdate(this.updataAllFrom).then((res) => {
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
    rolesList () {
      roleList({ 'size': '1000', 'current': '1' }).then((res) => {
        if (res.data.code === 0) {
          this.roleList = res.data.body.records
        }
      })
    },
    handleAddButton () {
      this.ruleForm = {
        enabled: false
      }
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate();
      })
    },
    saveEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = false
          this.ruleForm.roleId = parseInt(this.ruleForm.roleId)
          userAdd(this.ruleForm).then((res) => {
            if (res.data.code === 0) {
              this.$emit('getData')
              this.$message({
                message: '新增成功',
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
    updAllSelection () {
      this.updataAllFrom = {
        userIdList: []
      }
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach(ele => {
          this.updataAllFrom.userIdList.push(ele.id)
          this.updataAllFrom.num = (this.updataAllFrom.userIdList).length
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs['updataAllFroms'].clearValidate();
          })

        })
      } else {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        });
      }
    },
    // 触发搜索按钮
    handleSearch (val) {
      if (val === 'sear') {
        this.$emit('selectContent', this.selectDefault, this.selectContent)
      } else {
        this.$emit('selectContent', this.selectDefault, '', val)
        this.selectContent = ''
      }


    },
  }
}
</script>

<style>
.cards {
    margin: 10px 0;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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