<template>
  <div id="admin">
    <el-container>
      <el-header>
        <span>FullStack社区</span>
         <el-menu class="topmenu"  background-color="#31364a" text-color="#fff" active-text-color="#ff8b03" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
              <template slot="title">设置</template>
              <el-menu-item index="11">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        <span style="float:right;font-size:13px;">欢迎您<span>，{{user_name}}</span></span>
      </el-header>
      <el-container>
        <el-aside width="150px">
          <el-menu :default-active="defaultMenu" :router = "true"  background-color="#f5f7fa" @select="selectMenu">
            <template v-for="item,index in menuList">
              <el-menu-item v-if="!item.submenu" :index="item.index">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </el-menu-item>
              <el-submenu v-if="item.submenu && item.submenu.length > 0" :index="item.index">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item v-for="value,key in item.submenu" :index="value.index" :key="key">
                  {{value.title}}
                </el-menu-item>
            </el-submenu>
            </template>          
          </el-menu>
        </el-aside>
        <el-main>
          <transition name="fade" mode="out-in">      
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>    
  </div>
  <!-- </layout> -->
</template>
<script type="text/babel">
import Vue from "vue";
// import { sync } from "vuex-router-sync";
// import store from "store/app";
// import router from "./router";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Util from 'asset/js/util.js';
Vue.prototype.$util = Util;

Vue.use(ElementUI);
// sync(store, router);
export default {
  name:'adminIndex',
  // router,
  // store,
  computed: {},
  data(){
    return {
      defaultMenu:'/home',
      menuList:[
        {
          index:'/home',
          title:'首页',
          icon:'el-icon-menu',
        },
        {
          index:'/user',
          title:'用户',
          icon:'el-icon-share'
        },
        {
          index:'/article',
          title:'文章',
          icon:'el-icon-edit'
        },
        {
          index:'/comment',
          title:'评论',
          icon:'el-icon-star-off'
        },
        {
          index:'allLog',
          title:'日志',
          icon:'el-icon-document',
          submenu:[
            {
              title:'登录日志',
              index:'/loginLogs'
            },
            {
              title:'操作日志',
              index:'/opeLogs'
            }
          ]
        }
      ],
      activeIndex:'1',
      user_name:'Admin'
    }
  },
  created(){
    this.defaultMenu = sessionStorage.getItem('curMenu');
    this.user_name = sessionStorage.getItem('uname');
  },
  mounted() {
    
  },
  methods:{
    handleSelect(key, keyPath) {
      if(key == '11'){
        this.$post(`/api/user/exit`).then(res=>{
          console.log('退出登录');
          this.$router.push('/')
        })
      }
    },
    selectMenu(index){
       sessionStorage.setItem('curMenu',index);
    }
  }
};
</script>
<style>
  @import '../assets/css/index.css'
</style>

