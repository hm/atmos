import Vue from 'vue';
import App from '@/App';
 
import router from '@/router';
import locale from 'element-ui/lib/locale/lang/en';
import ElementUI from 'element-ui';
import VueLazyload from 'vue-lazyload';
import Meta from 'vue-meta';

import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/global.scss';

Vue.use(VueLazyload);
Vue.use(Meta);
Vue.use(ElementUI, { locale });
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  methods: {},
  components: {
    App,
  },
  template: '<App/>'
})
