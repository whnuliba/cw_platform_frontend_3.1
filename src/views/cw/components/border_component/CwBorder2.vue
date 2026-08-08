<template>
  <div class="dv-border-box-2">
    <svg class="dv-border-svg-container" :width="itemStyle.width" :height="itemStyle.height">
      <polygon
        :fill="itemStyle.background"
        :points="`
          7, 7 ${parseInt(itemStyle.width) - 7}, 7 ${parseInt(itemStyle.width) - 7}, ${parseInt(itemStyle.height) - 7} 7, ${parseInt(itemStyle.height) - 7}
        `"
      />
      <polyline
        :stroke="itemStyle.borderColor1"
        :points="`2, 2 ${parseInt(itemStyle.width) - 2} ,2 ${parseInt(itemStyle.width) - 2}, ${parseInt(itemStyle.height) - 2} 2, ${parseInt(itemStyle.height) - 2} 2, 2`"
      />
      <polyline
        :stroke="itemStyle.borderColor2"
        :points="`6, 6 ${parseInt(itemStyle.width) - 6}, 6 ${parseInt(itemStyle.width) - 6}, ${parseInt(itemStyle.height) - 6} 6, ${parseInt(itemStyle.height) - 6} 6, 6`"
      />
      <circle :fill="itemStyle.borderColor1" cx="11" cy="11" r="1" />
      <circle :fill="itemStyle.borderColor1" :cx="parseInt(itemStyle.width) - 11" cy="11" r="1" />
      <circle :fill="itemStyle.borderColor1" :cx="parseInt(itemStyle.width) - 11" :cy="parseInt(itemStyle.height) - 11" r="1" />
      <circle :fill="itemStyle.borderColor1" cx="11" :cy="parseInt(itemStyle.height) - 11" r="1" />
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder2',
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
.dv-border-box-2 {
  width: 100%;
  height: 100%;
  pointer-events: none;

  .dv-border-svg-container {
    position: absolute;
    /* width: 100%;
    height: 100%; */

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