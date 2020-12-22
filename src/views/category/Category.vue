<template>
  <div>
    <h2>分类</h2>
    <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"></back-top>
  </div>
</template>

<script>
    import {backTopMixin} from 'common/mixin'  //混合共用

  export default {
    name: "Category",
    data() {
      return {
        scroll: null
      }
    },
    mixins: [backTopMixin],
    // 组件创建完后调用
    mounted() {
     
    },
    methods: {
      
    }
    
  }
</script>

<style scoped>

</style>
