<template>
  <div class="dv-border-box-9" >
    <svg :class="`dv-border-svg-container ${reverse && 'dv-reverse'}`" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <polygon :fill="itemStyle.background" :points="`
        ${parseInt(itemStyle.width) - 15}, 22 170, 22 150, 7 40, 7 28, 21 32, 24
        16, 42 16, ${parseInt(itemStyle.height) - 32} 41, ${parseInt(itemStyle.height) - 7} ${parseInt(itemStyle.width) - 15}, ${parseInt(itemStyle.height) - 7}
      `" />

      <polyline class="dv-bb4-line-1"
        :stroke="itemStyle.borderColor1"
        :points="`145, ${parseInt(itemStyle.height) - 5} 40, ${parseInt(itemStyle.height) - 5} 10, ${parseInt(itemStyle.height) - 35}
          10, 40 40, 5 150, 5 170, 20 ${parseInt(itemStyle.width) - 15}, 20`"
      />
      <polyline
        :stroke="itemStyle.borderColor2"
        class="dv-bb4-line-2" :points="`245, ${parseInt(itemStyle.height) - 1} 36, ${parseInt(itemStyle.height) - 1} 14, ${parseInt(itemStyle.height) - 23}
          14, ${parseInt(itemStyle.height) - 100}`"
      />

      <polyline class="dv-bb4-line-3" :stroke="itemStyle.borderColor1" :points="`7, ${parseInt(itemStyle.height) - 40} 7, ${parseInt(itemStyle.height) - 75}`" />
      <polyline class="dv-bb4-line-4" :stroke="itemStyle.borderColor1" :points="`28, 24 13, 41 13, 64`" />
      <polyline class="dv-bb4-line-5" :stroke="itemStyle.borderColor1" :points="`5, 45 5, 140`" />
      <polyline class="dv-bb4-line-6" :stroke="itemStyle.borderColor2" :points="`14, 75 14, 180`" />
      <polyline class="dv-bb4-line-7" :stroke="itemStyle.borderColor2" :points="`55, 11 147, 11 167, 26 250, 26`" />
      <polyline class="dv-bb4-line-8" :stroke="itemStyle.borderColor2" :points="`158, 5 173, 16`" />
      <polyline class="dv-bb4-line-9" :stroke="itemStyle.borderColor1" :points="`200, 17 ${parseInt(itemStyle.width) - 10}, 17`" />
      <polyline class="dv-bb4-line-10" :stroke="itemStyle.borderColor2" :points="`385, 17 ${parseInt(itemStyle.width) - 10}, 17`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder9',
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
.dv-border-box-9 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-reverse {
    transform: rotate(180deg);
  }

  .dv-border-svg-container {
    position: absolute;
    top: 0px;
    left: 0px;

    & > polyline {
      fill: none;
    }
  }

  .sw1 {
    stroke-width: 1;
  }

  .sw3 {
    stroke-width: 3px;
    stroke-linecap: round;
  }

  .dv-bb4-line-1 {
    .sw1;
  }

  .dv-bb4-line-2 {
    .sw1;
  }

  .dv-bb4-line-3 {
    .sw3;
  }

  .dv-bb4-line-4 {
    .sw3;
  }

  .dv-bb4-line-5 {
    .sw1;
  }

  .dv-bb4-line-6 {
    .sw1;
  }

  .dv-bb4-line-7 {
    .sw1;
  }

  .dv-bb4-line-8 {
    .sw3;
  }

  .dv-bb4-line-9 {
    .sw3;
    stroke-dasharray: 100 250;
  }

  .dv-bb4-line-10 {
    .sw1;
    stroke-dasharray: 80 270;
  }

  .border-box-content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>