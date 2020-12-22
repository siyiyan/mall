<template>
    <!-- 轮播图 -->
    <swiper>
        <swiper-item v-for="(item,index) in banners" :key="index">
            <a :href="item.link">
                <img :src="item.image" alt="" @load="imgLoad">
            </a>
        </swiper-item>
    </swiper>
</template>

<script>
    import {Swiper, SwiperItem} from 'components/common/swiper' //导入的方式可以封装，还是要注册

    export default {
        name: "HomeSwiper",
        // 要从home去获取数据
        props: {
            banners: {
                type: Array,
                default(){
                    return []
                }
            }
        },
        data() {
            return {
                isLoad:false
            }
        },
        components: {
            Swiper,
            SwiperItem
        },
        methods: {
            imgLoad() {
                if (!this.isLoad) {
                    this.$emit('swiperImageLoader')
                    this.isLoad = true
                }
            }
        }
    }
</script>