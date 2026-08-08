<template>
    <div  class="dv-border-box-1">
        <svg class="border" :width="itemStyle.width" :height="itemStyle.height">
            <polygon
                :fill="'transparent'"
                :points="`10, 27 10, ${parseInt(itemStyle.height) - 27} 13, ${parseInt(itemStyle.height) - 24} 13, ${parseInt(itemStyle.height) - 21} 24, 
                    ${parseInt(itemStyle.height) - 11} 38, ${ parseInt(itemStyle.height) - 11} 41, ${parseInt(itemStyle.height) - 8} 73, 
                    ${parseInt(itemStyle.height) - 8} 75, ${parseInt(itemStyle.height) - 10} 81, ${parseInt(itemStyle.height) - 10} 85, 
                    ${parseInt(itemStyle.height) - 6} ${ parseInt(itemStyle.width) - 85}, ${parseInt(itemStyle.height) - 6} ${parseInt(itemStyle.width) - 81}, 
                    ${parseInt(itemStyle.height) - 10} ${parseInt(itemStyle.width) - 75}, ${parseInt(itemStyle.height) - 10} ${parseInt(itemStyle.width) - 73}, 
                    ${parseInt(itemStyle.height) - 8} ${parseInt(itemStyle.width) - 41}, ${parseInt(itemStyle.height) - 8} ${parseInt(itemStyle.width) - 38}, 
                    ${parseInt(itemStyle.height) - 11}  ${parseInt(itemStyle.width) - 24}, ${parseInt(itemStyle.height) - 11} ${parseInt(itemStyle.width) - 13}, 
                    ${parseInt(itemStyle.height) - 21} ${parseInt(itemStyle.width) - 13}, ${parseInt(itemStyle.height) - 24} ${parseInt(itemStyle.width) - 10}, 
                    ${parseInt(itemStyle.height) - 27} ${parseInt(itemStyle.width) - 10}, 27 ${parseInt(itemStyle.width) - 13}, 25 ${parseInt(itemStyle.width) - 13}, 
                    21 ${parseInt(itemStyle.width) - 24}, 11 ${parseInt(itemStyle.width) - 38}, 11 ${parseInt(itemStyle.width) - 41}, 8 ${parseInt(itemStyle.width) - 73}, 
                    8 ${parseInt(itemStyle.width) - 75}, 10 ${parseInt(itemStyle.width) - 81}, 10 ${parseInt(itemStyle.width) - 85}, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24`"
            />
        </svg>

        <svg v-for="item in border" :key="item" :width="itemStyle.width" :height="itemStyle.height" :class="`${item} border`">
            <polygon
                :fill="svgFill"
                points="6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
            >
                <animate
                attributeName="fill"
                :values="svgFill"
                dur="0.5s"
                begin="0s"
                repeatCount="indefinite"
                />
            </polygon>
            <polygon
                :fill="svgFill"
                points="27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
            >
                <animate
                attributeName="fill"
                :values="svgFill"
                dur="0.5s"
                begin="0s"
                repeatCount="indefinite"
                />
            </polygon>
            <polygon
                :fill="svgFill"
                points="9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
            >
                <animate
                attributeName="fill"
                :values="svgFill"
                dur="1s"
                begin="0s"
                repeatCount="indefinite"
                />
            </polygon>
        </svg>
    </div>
</template>

<script>
  export default {
    name: 'CwBgSvg1',
    components: {  },
    props: {
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      svgFill: {
        type: String,
        default: () => {
          return ""
        }
      },
    },
    watch: {
      itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
           
          }
        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        border:  ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
      };
    },
    created() {

    },
    mounted() {
    },
    beforeDestroy() { },
  
    methods: {

    },
  }
  </script>
<style lang="less" scoped>
.dv-border-box-1 {
  width: 100%;
  height: 100%;
  pointer-events: none;

  .border {
    position: absolute;
    display: block;
    /* width: 100%;
    height: 100%; */
    border: 0;
  }

  .right-top {
    /* right: 0; */
    transform: rotateY(180deg);
  }

  .left-bottom {
    /* bottom: 0; */
    transform: rotateX(180deg);
  }

  .right-bottom {
    /* right: 0;
    bottom: 0; */
    transform: rotateX(180deg) rotateY(180deg);
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>