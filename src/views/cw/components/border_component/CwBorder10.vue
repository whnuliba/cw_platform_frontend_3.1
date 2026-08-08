<template>
  <div
    class="dv-border-box-10"
    :style="`box-shadow: inset 0 0 40px ${itemStyle.borderColor1}; border: 1px solid ${itemStyle.borderColor1}; background-color: ${itemStyle.background}`"
  >
    <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <polyline class="dv-bb7-line-width-2" :stroke="itemStyle.borderColor1" :points="`0, 25 0, 0 25, 0`" />
      <polyline class="dv-bb7-line-width-2" :stroke="itemStyle.borderColor1" :points="`${parseInt(itemStyle.width) - 25}, 0 ${parseInt(itemStyle.width)}, 0 ${parseInt(itemStyle.width)}, 25`" />
      <polyline class="dv-bb7-line-width-2" :stroke="itemStyle.borderColor1" :points="`${parseInt(itemStyle.width) - 25}, ${parseInt(itemStyle.height)} ${parseInt(itemStyle.width)}, ${parseInt(itemStyle.height)} ${parseInt(itemStyle.width)}, ${parseInt(itemStyle.height) - 25}`" />
      <polyline class="dv-bb7-line-width-2" :stroke="itemStyle.borderColor1" :points="`0, ${parseInt(itemStyle.height) - 25} 0, ${parseInt(itemStyle.height)} 25, ${parseInt(itemStyle.height)}`" />

      <polyline class="dv-bb7-line-width-5" :stroke="itemStyle.borderColor2" :points="`0, 10 0, 0 10, 0`" />
      <polyline class="dv-bb7-line-width-5" :stroke="itemStyle.borderColor2" :points="`${parseInt(itemStyle.width) - 10}, 0 ${parseInt(itemStyle.width)}, 0 ${parseInt(itemStyle.width)}, 10`" />
      <polyline class="dv-bb7-line-width-5" :stroke="itemStyle.borderColor2" :points="`${parseInt(itemStyle.width) - 10}, ${parseInt(itemStyle.height)} ${parseInt(itemStyle.width)}, ${parseInt(itemStyle.height)} ${parseInt(itemStyle.width)}, ${parseInt(itemStyle.height) - 10}`" />
      <polyline class="dv-bb7-line-width-5" :stroke="itemStyle.borderColor2" :points="`0, ${parseInt(itemStyle.height) - 10} 0, ${parseInt(itemStyle.height)} 10, ${parseInt(itemStyle.height)}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder10',
    components: {  },
    props: {
      itemStyle: {
        type: Object,
        default: () => {
          return {}
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
.dv-border-box-10 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-border-svg-container {
    /* position: absolute;
    top: 0px;
    left: 0px;
    /* width: 100%;
    height: 100%; */

    & > polyline {
      fill: none;
      stroke-linecap: round;
    }
  }

  .dv-bb7-line-width-2 {
    stroke-width: 2;
  }

  .dv-bb7-line-width-5 {
    stroke-width: 5;
  }

  .border-box-content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>