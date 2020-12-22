<template>
    <!-- 详情页轮播图 -->
    <swiper class="detail-swiper">
        <swiper-item  v-for="(item,index) in topImages" :key="index">
            <img :src="item" alt="">
        </swiper-item>    
    </swiper>  
</template>

<script>
    import {Swiper, SwiperItem} from 'components/common/swiper' //导入的方式可以封装，还是要注册

    export default {
        name: 'DetailSwiper',
        components: {
            Swiper,
            SwiperItem
        },
        props: {
            topImages: {
                type: Array,
                default() {
                    return []
                }
            }
        }
    }
</script>

<style scoped>
    .detail-swiper{
        height: 300px;
        overflow: hidden;
        /* text-align: center; */
    }
</style>