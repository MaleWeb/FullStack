<template>
  <div class="dialog">
     <el-dialog :title="title" :visible.sync="signinFlag" width="500px" :modal-append-to-body="false">
      <el-form :model="loginForm" status-icon :rules="loginRule" ref="loginForm" label-width="100px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="loginForm.user_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input type="password" v-model="loginForm.user_password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="signinFlag = false">取 消</el-button>
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
</style>
<script type="text/babel">
  export default{
    name:'sigin',
    props:{
      title:{
        type: String,
        default: '登录'
      }
    },
    data(){
      return {
        signinFlag:false,
        loginForm:{
          user_name:'',
          user_password:''
        },
        loginRule:{
          user_name: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
          ],
          user_password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      }
    },
    components: {},
    mounted() {

    },
    methods:{
        show(){
            this.signinFlag = true;
        },
        getToken(){
          return this.$util.getCookie('csrfToken')
        },
        hide(){
            this.signinFlag = false;
        },
        login(){
          this.$refs.loginForm.validate((valid)=>{
            if(valid){
              if(this.title == '登录'){
                this.loginAjax();
              }else{
                this.signUpAjax();
              }
            }
          });
        },
        loginAjax(){
          let token = this.getToken();
          this.$http.post(`${location.origin}/common/sigin`,{
            user_name: this.loginForm.user_name,
            user_password: this.loginForm.user_password
          },{
            headers:{'x-csrf-token' : token}
          }).then(res => {
            console.log("登录社区成功楼");
            console.log(res);
            //登录成功
            this.hide();
          });
        },
        signUpAjax(){
          let token = this.getToken();
          this.$http.post(`${location.origin}/common/signUp`,{
            user_name: this.loginForm.user_name,
            user_password: this.loginForm.user_password
          },{
            headers:{'x-csrf-token' : token}
          }).then(res => {
            console.log("注册");
            console.log(res);
            //注册成功
            this.hide();
          });
        }
    }
  }
</script>