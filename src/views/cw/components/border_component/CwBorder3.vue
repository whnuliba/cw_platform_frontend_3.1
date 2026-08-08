<template>
     <div class="dv-border-box-3">
        <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
        <polygon
            :fill="itemStyle.background"
            :points="`
            9, 7 ${parseInt(itemStyle.width) - 9}, 7 ${parseInt(itemStyle.width) - 9}, ${parseInt(itemStyle.height) - 7} 9, ${parseInt(itemStyle.height) - 7}
            `"
        />

        <circle :fill="itemStyle.borderColor2" cx="5" cy="5" r="2" />
        <circle :fill="itemStyle.borderColor2" :cx="parseInt(itemStyle.width) - 5" cy="5" r="2" />
        <circle :fill="itemStyle.borderColor2" :cx="parseInt(itemStyle.width) - 5" :cy="parseInt(itemStyle.height) - 5" r="2" />
        <circle :fill="itemStyle.borderColor2" cx="5" :cy="parseInt(itemStyle.height) - 5" r="2" />
        <polyline :stroke="itemStyle.borderColor1" :points="`10, 4 ${parseInt(itemStyle.width) - 10}, 4`" />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`10, ${parseInt(itemStyle.height) - 4} ${parseInt(itemStyle.width) - 10}, ${parseInt(itemStyle.height) - 4}`"
        />
        <polyline :stroke="itemStyle.borderColor1" :points="`5, 70 5, ${parseInt(itemStyle.height) - 70}`" />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`${parseInt(itemStyle.width) - 5}, 70 ${parseInt(itemStyle.width) - 5}, ${parseInt(itemStyle.height) - 70}`"
        />
        <polyline :stroke="itemStyle.borderColor1" :points="`3, 10, 3, 50`" />
        <polyline :stroke="itemStyle.borderColor1" :points="`7, 30 7, 80`" />
        <polyline :stroke="itemStyle.borderColor1" :points="`${parseInt(itemStyle.width) - 3}, 10 ${parseInt(itemStyle.width) - 3}, 50`" />
        <polyline :stroke="itemStyle.borderColor1" :points="`${parseInt(itemStyle.width) - 7}, 30 ${parseInt(itemStyle.width) - 7}, 80`" />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`3, ${parseInt(itemStyle.height) - 10} 3, ${parseInt(itemStyle.height) - 50}`"
        />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`7, ${parseInt(itemStyle.height) - 30} 7, ${parseInt(itemStyle.height) - 80}`"
        />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`${parseInt(itemStyle.width) - 3}, ${parseInt(itemStyle.height) - 10} ${parseInt(itemStyle.width) - 3}, ${parseInt(itemStyle.height) - 50}`"
        />
        <polyline
            :stroke="itemStyle.borderColor1"
            :points="`${parseInt(itemStyle.width) - 7}, ${parseInt(itemStyle.height) - 30} ${parseInt(itemStyle.width) - 7}, ${parseInt(itemStyle.height) - 80}`"
        />
        </svg>
    </div>
</template>

<script>
  export default {
    name: 'CwBorder3',
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
.dv-border-box-3 {
  width: 100%;
  height: 100%;

  .dv-border-svg-container {
    position: absolute;
    /* top: 0;
    left: 0;
    width: 100%;
    height: 100%; */

    & > polyline {
      fill: none;
      stroke-width: 1;
    }
  }
}
</style>