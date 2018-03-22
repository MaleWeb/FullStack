<template>
  <!-- <layout> -->
  <div id="community">
    <Header></Header>
    <transition name="fade" mode="out-in">      
      <router-view></router-view>
    </transition>
  </div>
  <!-- </layout> -->
</template>
<script type="text/babel">
import Vue from "vue";
import { sync } from "vuex-router-sync";
import store from "store/app";
import router from "./component/router";
// import Layout from "component/layout/app";
import Header from "component/layout/standard/header/header";
sync(store, router);
export default {
  name:'community',
  router,
  store,
  computed: {},
  mounted() {},
  components: {
    Header
  },
};
</script>
