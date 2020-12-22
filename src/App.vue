<template>
  <div id="app" class="wrapper">
    <!-- 视图 -->
    <!-- 将不缓存name为Detail的组件 -->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
    <!-- 3.底部切换按钮放入页面 -->
    <main-tab-bar/> 
  </div>
</template>

<script>
//1.引入地址
  import MainTabBar from 'components/content/mainTabbar/MainTabBar.vue'

  export default {
    name: 'App',
    components: {
      //2.注册
      MainTabBar
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
