<template>
  <header class="header">
    <div class="container"><h1>
      <a href="/" class="router-link-active">FullStack社区基础框架</a></h1>
      <ul class="nav">
        <!-- <li class="nav-item"><a href="/" :class="{'active' : selectedMenu === '/'}">Server-Render</a></li> -->
      </ul>
      <div class="login-container">
        <span @click="sigin(1)">登录</span><span @click="sigin(2)">注册</span>
      </div>
      <Sigin ref="sigin" :title="btnText"></Sigin>
    </div>
  </header>
</template>
<style>
  @import "./header.css";
</style>
<script type="text/babel"> 
  export default{
    data(){
      return {
        selectedMenu : '/',
        btnText:'登录'
      }
    },
    computed:{
    },
    mounted(){
      this.selectedMenu = window.location.pathname.toLowerCase();
    },
    methods:{
     sigin(value){
       if(value === 1){
         this.btnText = '登录';
       }else{
         this.btnText = '注册';
       }
       this.$refs.sigin.show();
     }
    }
  }
</script>
