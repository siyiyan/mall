<template>
  <div id="cart">
    <!-- 顶部栏 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar/>

  </div>
</template>

<script>
  // 公共组件
  import NavBar from 'components/common/navbar/NavBar'    //顶部栏
  // views
  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar,

    },
    computed: {
      // mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
      // 两种语法
      // ...mapGetters(['cartLength', 'cartList'])
      ...mapGetters({
        length: 'cartLength'
      })
    },
    methods: {
      
    }
  }
</script>

<style scoped>
  #cart{
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #ffffff;
  }
</style>
