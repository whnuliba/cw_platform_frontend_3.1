<template>
    <div class="scrollContainer" :id="id" @mouseenter="monseenter" @mouseleave="mouseleave">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ScrollList',
    props: {
        id: String
    },
    data() {
        return {
            timer: null
        };
    },
    methods: {
        init() {
            this.setTimer();
            // this.$once代表只执行一次。如果组件是在keep-alive中包裹，则需要更换函数
            // 被keep-alive包裹住的组件有两个生命周期函数：activated和deactivated
            this.$once('hook:beforeDestroy', () => {
                this.removeTimer();
            });
        },
        removeTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        setTimer() {
            this.removeTimer();
            this.timer = setInterval(() => {
                // pixel height：include el and padding    read only
                const scrollHeight = document.getElementById(this.id).scrollHeight;
                // visible area height：include el and padding  read only
                const clientHeight = document.getElementById(this.id).clientHeight;

                const heightDifference = scrollHeight - clientHeight;
                // scroll height：readable and writable
                document.getElementById(this.id).scrollTop++;

                // when el scroll to top
                if (document.getElementById(this.id).scrollTop >= heightDifference - 1) {
                    this.removeTimer();
                    // make it go back to original location after one second
                    setTimeout(() => {
                        document.getElementById(this.id).scrollTop = 0;
                        this.setTimer();
                    }, 1000);
                }
            }, 1000);
        },
        monseenter() {
            this.removeTimer();
        },
        mouseleave() {
            this.setTimer();
        }
    },
    mounted() {
        this.init();
    }
};
</script>

<style lang="scss" scoped>
.scrollContainer::-webkit-scrollbar {
    display: none;
}
.scrollContainer::scrollbar {
    display: none;
}
.scrollContainer {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
}
</style>
