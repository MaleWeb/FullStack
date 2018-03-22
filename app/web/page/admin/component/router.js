import Vue from 'vue';

import VueRouter from 'vue-router';
import Main from './main';
import Home from './home';
import User from './user';
import Login from './login';
import LoginLog from './loginLogs';
import opeLog from './opeLogs';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/admin',
  routes: [
    {
      path: '/',
      component: Login,
    }, {
      path: '/home',
      component: Main,
      children: [
        {
          path: '/',
          component: Home,
        }, {
          path: '/user',
          component: User
        }, {
          path: '/loginLogs',
          component: LoginLog
        }, {
          path: '/opeLogs',
          component: opeLog
        }
      ]
    }
  ]
});

export default router;
