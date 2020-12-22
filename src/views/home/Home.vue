<template>
    <div id="home" class="wrapper">
        <!-- 顶部栏 -->
        <nav-bar class="home-nav">
            <div slot="center">购物街</div>
        </nav-bar>
        <!-- 切换菜单 -->
        <tab-control :titles='["流行", "新款", "精选"]' 
                    @tabClick="tabClick"
                    ref="tabControl1"
                    class="tab-control" 
                    v-show="isTabFixed"/>
        <!-- 滚动区域 -->
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                 @scroll="contentScroll" 
                :pull-up-load="true"
                @pullingUp="loadMore">
            <!-- 轮播图 -->
            <home-swiper :banners="banners" @swiperImageLoader="swiperImageLoader"/>
            <!-- 推荐视图 -->
            <recommend-view :recommends="recommends" />
            <!-- 本周流行 -->
            <feature-view />
            <!-- 切换菜单 -->
            <tab-control :titles='["流行", "新款", "精选"]' 
                        @tabClick="tabClick"
                        ref="tabControl2"/>
            <!-- 切换菜单下具体的数据 -->
            <goods-list :goods="showGoods" />
        </scroll>
        <!-- <div>呵呵呵呵</div> -->
        <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"/>
    </div>
    
</template>

<script>
    // views
    import HomeSwiper from './childComps/HomeSwiper'    //轮播图
    import RecommendView from './childComps/RecommendView'     //推荐视图
    import FeatureView from './childComps/FeatureView'    //本周流行
    // 公共组件
    import NavBar from 'components/common/navbar/NavBar'    //顶部栏
    import TabControl from 'components/content/tabControl/TabControl'     //切换菜单
    import GoodsList from 'components/content/goods/GoodsList'  //商品数据列表
    import Scroll from 'components/common/scroll/Scroll'    //better-scroll 插件
    // 数据请求
    import {getHomeMultidata, getHomeGoods} from 'network/home'   //获取首页数据
    // import {debounce} from 'common/utils'     //防抖动
    import {itemListenerMixin, backTopMixin} from 'common/mixin'  //混合共用

    export default {
        name: 'Home',
        // 注册组件
        components: {
            HomeSwiper,
            RecommendView,
            FeatureView,
            NavBar,
            TabControl,
            GoodsList,
            Scroll
        },
        mixins: [itemListenerMixin, backTopMixin],
        // 在函数执行完把 res 保存起来
        data() {
            return {
                //轮播图的数据
                banners: [],
                //推荐视图的数据
                recommends: [],
                //切换菜单的数据
                goods: {
                    'pop': {page: 0, list: []},
                    'new': {page: 0, list: []},
                    'sell': {page: 0, list: []},
                },
                currentType: 'pop',
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0
            }
        },
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            }
        },
        destroyed() {
            console.log('destroyed');
        },
        activated() {
            this.$refs.scroll.scrollTo(0, this.saveY, 0);
            this.$refs.scroll.refresh()
        },
        deactivated() {
            // 1.保存Y值 
            this.saveY = this.$refs.scroll.getScrollY();
            // 2.取消全局事件监听
            this.$bus.$off('itemImageLoad', this.itemImgListener )
        },
        // 组件创建完就可以发送请求
        created() { 
            // 1.请求多个数据,create 里面内容如果多了就封装到methods 里面
            this.getHomeMultidata();
            //2.请求商品数据
            this.getHomeGoods('pop');
            this.getHomeGoods('new');
            this.getHomeGoods('sell');
            
        },
        mounted() {
        },
        methods: {
            /**
             * 事件监听相关方法
             */
            
            tabClick(index) {
                switch(index){
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                // 让两个tabControl 的 currentIndex保持一致
                if(this.$refs.tabControl1 !==undefined){
                    this.$refs.tabControl1.currentIndex = index;
                    this.$refs.tabControl2.currentIndex = index;
                }
                
            },
            contentScroll(position) {
                // console.log(position);
                // 1.判断BackTop是否显示
                this.listenShowBackTop(position);
                // 2.决定tabControl是否吸顶（position：fixed）
                this.isTabFixed = (-position.y) > this.tabOffsetTop;
            },
            loadMore() {
                this.getHomeGoods(this.currentType);
            },
            swiperImageLoader() {
                // 2.获取tabControl 的offsetTop
                // 所有的组件都有一个属性$el，用于获取组件中的元素
                // 这里想获取自定义组件tabControl，并获取它的OffsetTop。就需要先获取该组件。组件内设置 属性 ref='一个名称(tabControl)', 然后 this.$refs.tabControl 就拿到了该组件。
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
            },
            /**
             * 网络请求相关方法
             */
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    // this 是指向当前组件对象
                    // 把数据地址指向 result，result 的数据可以在浏览器 vue 调试中看到
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list; 
                    // res 会被回收掉
                })
            },
            getHomeGoods(type){
                const page = this.goods[type].page + 1;
                getHomeGoods(type, page).then(res => {
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1

                    // 完成上拉加载更多
                    this.$refs.scroll.finishPullUp()
                })
            }
        }
    }
</script>

<style scoped>
    #home {
        /*padding-top: 44px;*/
        height: 100vh;
        /* position: relative; */
    }
    .home-nav{
        background-color: var(--color-tint);
        color: #ffffff;

        /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
        /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9; */
    }
    .tab-control {
        position: relative;
        /* top: 44px; */
        z-index: 9;
    }
    .content{
        overflow: hidden;

        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

    /* .content {
        height: calc(100% - 93px);
        overflow: hidden;
        margin-top: 44px;
    } */

    .back-top {
        position: fixed;
        right: 10px;
        bottom: 60px;
    }
</style>