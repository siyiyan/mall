<template>
  <div class="bottom-menu">
    <CheckButton class="select-all" :is-checked="isSelectAll" @click.native="checkClick"></CheckButton>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product" @click="clacClick">去计算({{checkLength}})</span>
  </div>
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'   //选择按钮
    import {mapGetters} from 'vuex'

    export default {
        name: 'CartBottomBar',
        components: {
            CheckButton
        },
        computed: {
            ...mapGetters(['cartList']),
            totalPrice() {
                return this.cartList.filter(item => {
                    return item.checked
                }).reduce((preValue, item) => { //.reduce()方法的回调需要两个参数：累加器和当前值。累加器将是第一个参数，是“向下传递”值。
                    return preValue + item.price * item.count
                }, 0).toFixed(2)
            },
            checkLength() {
                return this.cartList.filter(item => item.checked).length;
            },
            isSelectAll() {
                if(this.cartList.length === 0) return false
                // this.cartList.find(item => item.checked === false) === undefined;
                // 1.使用filter
                // return  !(this.cartList.filter(item => !item.checked).length);
                // 2.使用find
                // return !this.cartList.find(item => item.checked)
                // 3.普通遍历
                for(let item of this.cartList){
                  if(!item.checked){
                    return false
                  }
                }
                return true
            }
        },
        methods: {
          checkClick() {  
            if(this.isSelectAll){ //全部选中
              this.cartList.forEach(item => item.checked = false)
            }else{  //部分或全部不选中
              this.cartList.forEach(item => item.checked = true)
            }
          },
          clacClick() {
            if(!this.isSelectAll) {
              this.$toast.show('请选择购买的商品', 2000)
            }
          }
        }
    }
</script>

<style scoped>
  .bottom-menu {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 50px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-menu .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-menu .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-menu .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>