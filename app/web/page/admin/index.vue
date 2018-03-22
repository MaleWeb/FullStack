<template>
  <div id="admin">
    <router-view></router-view>
  </div>
  <!-- </layout> -->
</template>
<script type="text/babel">
import Vue from "vue";
import { sync } from "vuex-router-sync";
import store from "store/app";
import router from "./component/router";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Util from "asset/js/util.js";
import http from "./index"

Vue.use(ElementUI);
Vue.use(http);
Vue.prototype.$util = Util;

sync(store, router);

export default {
  router,
  store,
  computed: {},
  name: "admin",
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style>
@import "./assets/css/index.css";
</style>

