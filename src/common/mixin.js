import {debounce} from './utils'     //防抖动
import BackTop from 'components/content/backTop/BackTop'

import {BACK_POSITION} from 'common/const'    //公共常量

export const itemListenerMixin = {
    data() {
        return{
            itemImgListener: null,
            refresh: null
        }
    },
    mounted() {
        // 1.监听item中图片加载完成
        this.refresh = debounce(this.$refs.scroll.refresh, 100)

        // 对监听对事件进行保存
        this.itemImgListener = () => {
            this.refresh();
        }
        this.$bus.$on('itemImageLoad', this.itemImgListener )
        // console.log('进入混合内容');
    }
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data () {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0, 300)
        },
        listenShowBackTop(position) {
            this.isShowBackTop = (-position.y) > BACK_POSITION
        }
    }
}