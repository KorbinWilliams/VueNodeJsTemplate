import Vue from 'vue'
import Router from 'vue-router'
// @ts-ignore
import Login from '../views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: "*",
      redirect: '/'
    }
    // {
    //   path: '/component(s)/:componentId',
    //   name: 'component',
    //   props: true, idk wt this is lol
    //   component: Component (duh)
    // },
  ]
})