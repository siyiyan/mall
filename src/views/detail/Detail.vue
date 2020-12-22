<template>
    <div id="detail">
        <!-- 顶部栏 -->
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll">
            
            <!-- 属性：topImages，传入值：top-images -->
            <!-- 轮播图 -->
            <detail-swiper :top-images="topImages"/>
            <!-- 标题、价格 -->
            <detail-base-info :goods="goods"/>
            <!-- 店铺、销量、描述 -->
            <detail-shop-info :shop="shop"/>
            <!-- 图片详情 -->
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <!-- 商品参数信息 -->
            <detail-param-info :param-info="paramInfo" ref="params"/>
            <!-- 评论信息 -->
            <detail-comment-info :comment-info="commentInfo" ref="comment"/>
            <!-- 推荐 -->
            <goods-list :goods="recommends" ref="recommend"/>

        </scroll>
        <!-- 底部的工具栏 -->
        <detail-bottom-bar @addToCart="addToCart"/>
        <!-- 回到顶部 -->
        <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"></back-top>
        <!-- 消息提示框 -->
        <!-- <toast :message="message" :show="show" /> -->
    </div>
</template>

<script>
    // views
    import DetailNavBar from './childComps/DetailNavBar'    //顶部栏
    import DetailSwiper from './childComps/DetailSwiper'    //轮播图
    import DetailBaseInfo from './childComps/DetailBaseInfo'    //标题、价格
    import DetailShopInfo from './childComps/DetailShopInfo'    //店铺、销量、描述
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'  //图片详情
    import DetailParamInfo from './childComps/DetailParamInfo'  //商品参数信息
    import DetailCommentInfo from './childComps/DetailCommentInfo'  //评论信息
    import DetailBottomBar from './childComps/DetailBottomBar'  //底部的工具栏
    // 公共组件
    import Scroll from 'components/common/scroll/Scroll.vue'    //Better-Scroll封装
    import GoodsList from 'components/content/goods/GoodsList.vue'   //推荐
    // import Toast from 'components/common/toast/Toast'   //消息提示框
    // 数据请求
    import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
    import {itemListenerMixin, backTopMixin} from 'common/mixin'  //混合共用
    import {debounce} from 'common/utils'     //防抖动
    import { mapActions } from 'vuex'
    
    export default {
        name: 'Detail',
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList,
            // Toast
        },
        mixins: [itemListenerMixin, backTopMixin],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
                message: '',
                show: false
            }
        },
        created() {
            // 1.保存传入的iid
            this.iid = this.$route.params.iid;
            // 2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                // 0.获取结果
                const data = res.result;
                // 1.获取顶部的轮播图片数据
                // console.log(res);
                this.topImages = data.itemInfo.topImages;

                // 2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

                // 3.创建店铺信息的对象
                this.shop = new Shop(data.shopInfo);

                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo;

                // 5.获取参数都信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

                // 6.取出评论的信息
                if(data.rate.cRate !== 0){
                    this.commentInfo = data.rate.list[0]
                }
                // $nextTick 当数据加载完，DOM更新完成，并且挂载完成，才会执行
                // this.$nextTick(() => {
                //     // 值不对，图片没有计算在内
                //     // 根据最新的数据，对应的DOM是已经被渲染出来
                //     // 单数图片依然没有加载完，目前获取到的offsetTopbug包含图片
                //     // offsetTop 的值不对的时候，都是因为图片的问题
                //     this.themeTopYs = [];

                //     this.themeTopYs.push(0);
                //     this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                //     console.log(this.themeTopYs);
                // })
            })
            // 3.请求推荐数据
            getRecommend().then(res => {
                this.recommends = res.data.list;
            })
            // 4.给getThemeTopY赋值,(对this.getThemeTopY赋值的操作进行防抖)
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = [];
    
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                this.themeTopYs.push(Number.MIN_VALUE);
                
                console.log(this.themeTopYs);
            }, 100)

        },
        mounted() {},
        destroyed(){
            this.$bus.$off('itemImageLoad', this.itemImgListener)
        },
        methods: {
            ...mapActions(['addCart']),
            imageLoad(){
                this.refresh();

                this.getThemeTopY();
            },
            titleClick(index) {
                // console.log(index)
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
            },
            contentScroll(position) {
                // console.log(position)
                // 1.获取y值
                const positionY = -position.y;
                
                // 2.positionY和主题中值进行对比
                // [0, 7938, 9120, 9452, Number.MIN_VALUE]
                // positionY 在 0 和 7938 之间，index = 0
                // positionY 在 7938 和 9120 之间，index = 1
                // positionY 在 9120 和 9452 之间，index = 2
                // positionY 在 9452 和 非常大的值之间，index = 3
                // positionY 大于等于 9452 值，index = 3
                let length = this.themeTopYs.length;
                for(let i = 0; i < length; i++){
                    // if(this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
                    // || i === length - 1 && positionY > this.themeTopYs[i]){
                    //     console.log(i);
                    //     this.currentIndex = i;
                    //     this.$refs.nav.currentIndex = this.currentIndex;
                    // }

                    if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex = this.currentIndex;
                    }
                }

                // 3.是否显示回到顶部
                this.listenShowBackTop(position);

            },
            addToCart() {
                // 1.获取购物车需要展示的信息
                const product = {}
                product.image = this.topImages[0];
                product.title = this.goods.title;
                product.desc = this.goods.desc;
                product.price = this.goods.realPrice;
                product.iid = this.iid;

                // 2.将商品添加到购物车里(1.Promise, 2.mapActions)
                // this.$store.cartList.push(product);
                // this.$store.commit('addCart', product);
                // dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)
                // commit：同步操作，写法：this.$store.commit('mutations方法名',值)
                
                this.addCart(product).then(res => {
                    // this.show = true;
                    // this.message = res;
                    
                    // setTimeout(() => {
                    //     this.show = false;
                    //     this.message = '';
                    // },1500)
                    this.$toast.show(res, 2000);
                    // this.$toast.show()
                });

                // this.$store.dispatch('addCart', product).then(res => {
                //     console.log(res);
                // });

            }
        }
    }
</script>

<style scoped>
    #detail{
        position: relative;
        z-index: 9;
        background-color: #ffffff;
        height: 100vh;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content{
        background-color: #fff;
        height: calc(100% - 44px);
        /* position: absolute;
        top: 44px;
        bottom: 60px; */
    }
    .back-top {
        position: fixed;
        right: 10px;
        bottom: 60px;
    }
</style>
