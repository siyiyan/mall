import Vue from 'vue'
import App from './App.vue'
import router from './router' //挂载router
import store from './store' // 安装toast自定义插件

import FastClick from 'fastclick' //解决移动端300s延迟
import VueLazyLoad from 'vue-lazyload'  //图片懒加载

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 添加事件总线对象
Vue.prototype.$bus = new Vue();
// 安装toast自定义插件
Vue.use(toast);

// 解决移动端300s延迟
FastClick.attach(document.body)

// 使用懒加载的插件
Vue.use(VueLazyLoad,{
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App),
  
})
// .$mount('#app')
