<template>
  <div class="cart-list">
      <scroll class="content" ref="scroll">
            <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info="item"></cart-list-item>
      </scroll>
  </div>
</template>

<script>
    import CartListItem from './CartListItem'
    // 公共组件
    import Scroll from 'components/common/scroll/Scroll.vue'    //Better-Scroll封装

    import {mapGetters} from 'vuex'

    export default {
        name: 'CartList',
        components: {
            Scroll,
            CartListItem
        },
        props: {
            cartListInfo: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        computed: {
            ...mapGetters(['cartList'])
        },
        activated() {
            this.$refs.scroll.refresh()
        }
    }
</script>

<style scoped>
    .cart-list{
        height: calc(100% - 44px - 49px);
    }
    .content{
        /* height: calc(100% - 49px); */
        overflow: hidden;
    }
</style>