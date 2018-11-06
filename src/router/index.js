import Vue from 'vue'
import Router from 'vue-router'
import route from './routes'

Vue.use(Router)

export default new Router({
  routes: [
    { name: 'home',    component: route.Home,    path: '/' },
    { name: 'content', component: route.Content, path: '/anime/:content_id',
      children: [
        { name: 'episode', component: route.Episode, path: ':episode' },
      ]
    },
    { name: 'search',  component: route.Search,  path: '/search'},
  ]
})
