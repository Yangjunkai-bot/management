<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param"
               :rules="rules"
               ref="login"
               label-width="0px"
               class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username"
                    placeholder="username">
            <el-button slot="prepend"
                       icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="password"
                    v-model="param.password"
                    @keyup.enter.native="submitForm()">
            <el-button slot="prepend"
                       icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="info"
                     @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      param: {
        username: 'admin',
        password: '123123',
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm () {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.$message.success('登录成功');
          localStorage.setItem('ms_username', this.param.username);
          this.$router.push('/');
        } else {
          this.$message.error('请输入账号和密码');
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 1000px;
    zoom: 1;
    background-color: #fff;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    background-image: url(../../assets/img/backgroundurl.png);
}
.ms-title {
    width: 430px;
    float: right;
    margin: 109px 0 0 0;
    line-height: 50px;
    text-align: left;
    font-size: 20px;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 800px;
    height: 500px;
    margin: -250px 0 0 -400px;
    border-radius: 5px;
    background-image: url(../../assets/img/fromurl.png);
    overflow: hidden;
}
.ms-content {
    width: 400px;
    float: right;
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>