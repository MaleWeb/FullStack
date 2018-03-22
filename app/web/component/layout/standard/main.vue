<template>
  <div>
    <!-- <LayoutHeader></LayoutHeader> -->
    <LayoutContent>
      <div slot="content">
        <slot name="main"></slot>
      </div>
    </LayoutContent>
  </div>
</template>
<style lang="css">
  body {
    margin: 0 0px;
  }

  a {
    text-decoration: none;
  }

  @import "../../../asset/css/global.css";
</style>
<script type="text/babel">
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import axios from 'axios'
  import Util from '../../../asset/js/util.js'
  import Sigin from './dialog/sigin';

  Vue.use(ElementUI);
  Vue.prototype.$http = axios;
  Vue.prototype.$util = Util;
  Vue.component('Sigin',Sigin);

  import LayoutHeader from './header/header';
  import LayoutContent from './content/content';
  export default{
    components: {
      LayoutHeader,
      LayoutContent,
    },
    methods:{
      
    }
  }
</script>
