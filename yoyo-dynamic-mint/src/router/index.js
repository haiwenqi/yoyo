import Vue from 'vue'
import Router from 'vue-router'
import mainBox from '@/components/mainBox'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  {
      path: '/',
      name: 'mainBox',
      component: mainBox
   },
    {
      path: '/dyList/:tabName',
      name: 'mainBox',
      component: mainBox
    }
  ]
})
