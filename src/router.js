import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { name: 'home',    component: () => import('@/components/Home'),    path: '/' },
    { name: 'content', component: () => import('@/components/content/Content'), path: '/anime/:content_id',
      children: [
        { name: 'episode', component: () => import('@/components/content/Episode'), path: ':episode' },
      ]
    },
    { name: 'search',  component: () => import('@/components/Search'),  path: '/search/:search_query'},
  ]
})
