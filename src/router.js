import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { name: 'home',    component: Home,    path: '/' },
    { name: 'content', component: () => import('@/components/content/Content'), path: '/anime/:content_id',
      children: [
        { name: 'episode', component: () => import('@/components/content/Episode'), path: 'episode/:episode' },
      ]
    },
    { name: 'search',  component: () => import('@/components/Search'),  path: '/search/:search_query'},
  ]
})
