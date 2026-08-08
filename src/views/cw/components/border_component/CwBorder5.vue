<template>
    <div class="dv-border-box-5">
        <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
        <path
            :fill="itemStyle.background"
            :stroke="itemStyle.borderColor1"
            :d="`
            M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
            L ${parseInt(itemStyle.width) - 20} 10 L ${parseInt(itemStyle.width) - 5} 25
            L ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 5} L 20 ${parseInt(itemStyle.height) - 5}
            L 5 ${parseInt(itemStyle.height) - 20} L 5 20
            `"
        />

        <path
            fill="transparent"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="10 5"
            :stroke="itemStyle.borderColor1"
            :d="`M 16 9 L 61 9`"
        />

        <path
            fill="transparent"
            :stroke="itemStyle.borderColor2"
            :d="`M 5 20 L 5 10 L 12 3  L 60 3 L 68 10`"
        />

        <path
            fill="transparent"
            :stroke="itemStyle.borderColor2"
            :d="`M ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 30} L ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 5} L ${parseInt(itemStyle.width) - 30} ${
            parseInt(itemStyle.height) - 5
            }`"
        />
        </svg>

        <div class="border-box-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'CwBorder5',
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
.dv-border-box-5 {
  /* // position: relative; */
  width: 100%;
  height: 100%;
  pointer-events: none;

  .dv-border-svg-container {
    position: absolute;
    /* width: 100%;
    height: 100%;
    top: 0;
    left: 0; */
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>