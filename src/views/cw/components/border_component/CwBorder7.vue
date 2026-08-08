<template>
  <div class="dv-border-box-7">
    <svg :class="`dv-border-svg-container  ${reverse && 'dv-reverse'}`" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <polygon :fill="itemStyle.background" :points="`
        10, 22 ${parseInt(itemStyle.width) - 22}, 22 ${parseInt(itemStyle.width) - 22}, ${parseInt(itemStyle.height) - 86} ${parseInt(itemStyle.width) - 84}, ${parseInt(itemStyle.height) - 24} 10, ${parseInt(itemStyle.height) - 24}
      `" />

      <polyline
        class="dv-bb5-line-1"
        :stroke="itemStyle.borderColor1"
        :points="`8, 5 ${parseInt(itemStyle.width) - 5}, 5 ${parseInt(itemStyle.width) - 5}, ${parseInt(itemStyle.height) - 100}
          ${parseInt(itemStyle.width) - 100}, ${parseInt(itemStyle.height) - 5} 8, ${parseInt(itemStyle.height) - 5} 8, 5`"
      />
      <polyline
        class="dv-bb5-line-2"
        :stroke="itemStyle.borderColor2"
        :points="`3, 5 ${parseInt(itemStyle.width) - 20}, 5 ${parseInt(itemStyle.width) - 20}, ${parseInt(itemStyle.height) - 60}
          ${parseInt(itemStyle.width) - 74}, ${parseInt(itemStyle.height) - 5} 3, ${parseInt(itemStyle.height) - 5} 3, 5`"
      />
      <polyline class="dv-bb5-line-3" :stroke="itemStyle.borderColor2" :points="`50, 13 ${parseInt(itemStyle.width) - 35}, 13`" />
      <polyline class="dv-bb5-line-4" :stroke="itemStyle.borderColor2" :points="`15, 20 ${parseInt(itemStyle.width) - 35}, 20`" />
      <polyline class="dv-bb5-line-5" :stroke="itemStyle.borderColor2" :points="`15, ${parseInt(itemStyle.height) - 20} ${parseInt(itemStyle.width) - 110}, ${parseInt(itemStyle.height) - 20}`" />
      <polyline class="dv-bb5-line-6" :stroke="itemStyle.borderColor2" :points="`15, ${parseInt(itemStyle.height) - 13} ${parseInt(itemStyle.width) - 110}, ${parseInt(itemStyle.height) - 13}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder7',
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
            if(newVal.reverse == 0){
              this.reverse = false
            }else{
              this.reverse = true
            }
          }
        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        reverse:true
      };
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        if(this.itemStyle.reverse == 0){
          this.reverse = false
        }
        else{
          this.reverse = true
        }
      })
    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return[          
          { field: 'reverse', title: '反转', queryType: 'switch', defaultValue: 1},
        ]
      },
    },
  }
</script>
<style lang="less" scoped>
.dv-border-box-7 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-reverse {
    transform: rotate(180deg);
  }

  .dv-border-svg-container {
    position: absolute;
    width: 100%;
    /* height: 100%; */
    top: 0;
    left: 0;

    & > polyline {
      fill: none;
      stroke-width: 1;
    }
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>