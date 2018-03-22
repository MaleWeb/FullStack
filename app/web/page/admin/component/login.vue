<template>
  <div id="admin-login">
    <div class="admin-login-main">
      <h2 class="admin-login-title">FullStack社区</h2>
      <el-form :model="loginForm" :rules="loginFormRule" ref="loginForm" label-width="100px" label-position="top" class="demo-ruleForm">
        <el-form-item label="" prop="user_name">
          <el-input v-model="loginForm.user_name" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="" prop="user_password">
          <el-input @keyup.enter.native="jumpHome" type="password" v-model="loginForm.user_password" placeholder="请输入登录密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="pass">
          <el-button @click="jumpHome" type="success" style="width:100%;background-color:#31364a;border-color:#31364a;">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- </layout> -->
</template>
<script type="text/babel">
export default {
  name: "adminLogin",
  computed: {},
  data() {
    return {
      loginForm: {
        user_name: "",
        user_password: ""
      },
      loginFormRule: {
        user_name: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        user_password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    getToken() {
      return this.$util.getCookie("csrfToken");
    },
    jumpHome() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginAjax();
        }
      });
    },
    loginAjax() {
      let that = this;
      let token = this.getToken();
      this.$post(`/api/sigin`, {
        user_name: this.loginForm.user_name,
        user_password: this.loginForm.user_password
      }).then(res => {
        console.log("登录成功");
        console.log(res);
        if (res.status) {
          that.$router.push("/home");
          sessionStorage.setItem("curMenu", "/home");
          sessionStorage.setItem('uname',res.data.user_name);
        } else {
          that.$message.warning(res.message || "登录失败，请联系管理员");
        }
      });
    }
  }
};
</script>
<style>
#admin-login {
  height: 100%;
  overflow: hidden;
  background: url("../../../asset/images/bg.jpg") center center;
}
#admin-login .admin-login-main {
  position: absolute;
  width: 350px;
  height: 250px;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -175px;
}
#admin-login .admin-login-main .admin-login-title {
  text-align: center;
  padding-bottom: 20px;
  font-size: 30px;
  color: #fff;
}
#admin-login .admin-login-main .el-form-item__label {
  color: #fff;
  font-size: 16px;
}
</style>

