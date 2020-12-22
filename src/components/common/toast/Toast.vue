<template>
    <div class="toast" v-show="isShow">
        <div>{{message}}</div>
    </div>
</template>

<script>
    export default {
        name: 'Toast',
        props: {
            // message: {
            //     type: String,
            //     default: ''
            // },
            // show: {
            //     type: Boolean,
            //     default: false
            // }
        },
        data() {
            return {
                message: '',
                isShow: false
            }
        },
        methods: {
            show(message="默认文字", duration=2000) {
                // duration = duration || 2000
                this.isShow = true;
                this.message = message;
                
                setTimeout(() => {
                    this.isShow = false;
                    this.message = '';
                }, duration)
            }
        }
    }
</script>

<style scoped>
    .toast{
        position: fixed;
        padding: 8px 10px;
        /* 是以左上角为原点，故不处于中心位置 */
        top: 50%;
        left: 50%;
        /* 往上（x轴）,左（y轴）移动自身长宽的 50%，以使其居于中心位置。还可以根据屏幕的大小来调节自身的宽度，做弹框时不用设置宽高 */
        transform: translate(-50%, -50%);
        /* margin-left必须知道自身的宽高，而translate可以在不知道宽高的情况下进行居中 */

        background-color: rgba(0, 0, 0, 0.75);  
        color: #ffffff;
    }
</style>