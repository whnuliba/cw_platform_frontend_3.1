<template>
 <div class="dv-border-box-4">
    <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <defs>
        <path :id="path" :d = phD fill="transparent" />
        <radialGradient :id="gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>

        <mask :id="mask">
          <circle cx="0" cy="0" r="150" :fill="svgFill">
            <animateMotion :dur= "`${itemStyle.duration}s`" :path= phD 
            rotate="auto" repeatCount="indefinite" />
          </circle>
        </mask>
      </defs>

      <polygon
        :fill="svgFill"
        :points="`5, 5 ${parseInt(itemStyle.width) - 5}, 5 ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 5} 5, ${parseInt(itemStyle.height) - 5}`"
      />

      <use :stroke="svgFill" stroke-width="1" :xlink:href="`#${path}`" />

      <use
        :stroke="svgFill"
         stroke-linecap="round"
        stroke-width="3"
        :xlink:href="`#${path}`"
        :mask="`url(#${mask})`"
      >
        <animate
          attributeName="stroke-dasharray"
          :from="`0, ${(parseInt(itemStyle.width)+parseInt(itemStyle.height)+5)*2}`"
          :to="`${(parseInt(itemStyle.width)+parseInt(itemStyle.height)+5)*2}, 0`"
          :dur= "`${itemStyle.duration}s`"
          repeatCount="indefinite"
        />
      </use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder4',
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
            if(newVal.reverse == 0){
              this.phD = `M 2.5, 2.5 L 2.5, ${newVal.height - 2.5} L ${newVal.width - 2.5}, ${newVal.height - 2.5} L ${newVal.width - 2.5}, 2.5 L 2.5, 2.5`
            }else{
              this.phD = `M2.5, 2.5 L${newVal.width - 2.5}, 2.5 L${newVal.width - 2.5}, ${newVal.height - 2.5} L2.5, ${newVal.height - 2.5} L2.5, 0`
            }
          }
        },
        deep: true
      },
    },
    computed: {
        
    },
    data() {
      return {
        path : 'border-box-4-path-' + this.uuid(),
        mask: 'border-box-4-mask-' + this.uuid(),
        gradient: 'border-box-4-path-gradient' + this.uuid(),
        phD : ''
      };
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        if(this.itemStyle.reverse == 0){
              this.phD = `M 2.5, 2.5 L 2.5, ${this.itemStyle.height - 2.5} L ${this.itemStyle.width - 2.5}, ${this.itemStyle.height - 2.5} L ${this.itemStyle.width - 2.5}, 2.5 L 2.5, 2.5`
            }else{
              this.phD = `M2.5, 2.5 L${this.itemStyle.width - 2.5}, 2.5 L${this.itemStyle.width - 2.5}, ${this.itemStyle.height - 2.5} L2.5, ${this.itemStyle.height } L2.5, 2.5`
            }
      })
    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return[          
          { field: 'reverse', title: '反转', queryType: 'switch', defaultValue: 1},
          { field: 'duration', title: '时间', queryType: 'input', defaultValue: 3},
        ]
      },

      // selectOptions() {
      //   let obj = {}
      //   obj['reverse'] = [
      //       { label: '正向', value: '1' },
      //       { label: '反向', value: '0' },
      //   ]
      //   return obj
      // },
    },
  }
</script>
<style lang="less" scoped>
.dv-border-box-4 {
  width: 100%;
  height: 100%;
  pointer-events: none;

  .dv-border-svg-container {
    position: absolute;
    display: block;
    /* width: 100%;
    height: 100%;
    left: 0;
    top: 0; */
  }
}
</style>