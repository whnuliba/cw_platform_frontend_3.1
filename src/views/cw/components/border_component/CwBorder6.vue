<template>
  <div class="dv-border-box-6">
    <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <defs>
        <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
          <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />
          <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
          <feFlood :flood-color="itemStyle.borderColor2" result="glowColor">
            <animate
              attributeName="flood-color"
              :values="`${itemStyle.borderColor2}`"
              dur="3s"
              begin="0s"
              repeatCount="indefinite"
            />
          </feFlood>
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored" />

          <feMerge>
            <feMergeNode in="softGlowColored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        v-if="parseInt(itemStyle.width) && parseInt(itemStyle.height)"
        :fill="itemStyle.background"
        stroke-width="2"
        :stroke="itemStyle.borderColor1"
        :d="`
          M15 5 L ${parseInt(itemStyle.width) - 15} 5 Q ${parseInt(itemStyle.width) - 5} 5, ${parseInt(itemStyle.width) - 5} 15
          L ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 15} Q ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 5}, ${parseInt(itemStyle.width) - 15} ${parseInt(itemStyle.height) - 5}
          L 15, ${parseInt(itemStyle.height) - 5} Q 5 ${parseInt(itemStyle.height) - 5} 5 ${parseInt(itemStyle.height) - 15} L 5 15
          Q 5 5 15 5
        `"
      />

      <path
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        :filter="`url(#${filterId})`"
        :stroke="itemStyle.borderColor2"
        :d="`M 20 5 L 15 5 Q 5 5 5 15 L 5 20`"
      />

      <path
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        :filter="`url(#${filterId})`"
        :stroke="itemStyle.borderColor2"
        :d="`M ${parseInt(itemStyle.width) - 20} 5 L ${parseInt(itemStyle.width) - 15} 5 Q ${parseInt(itemStyle.width) - 5} 5 ${parseInt(itemStyle.width) - 5} 15 L ${parseInt(itemStyle.width) - 5} 20`"
      />

      <path
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        :filter="`url(#${filterId})`"
        :stroke="itemStyle.borderColor2"
        :d="`
          M ${parseInt(itemStyle.width) - 20} ${parseInt(itemStyle.height) - 5} L ${parseInt(itemStyle.width) - 15} ${parseInt(itemStyle.height) - 5}
          Q ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 5} ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 15}
          L ${parseInt(itemStyle.width) - 5} ${parseInt(itemStyle.height) - 20}
        `"
      />

      <path
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        :filter="`url(#${filterId})`"
        :stroke="itemStyle.borderColor2"
        :d="`
          M 20 ${parseInt(itemStyle.height) - 5} L 15 ${parseInt(itemStyle.height) - 5}
          Q 5 ${parseInt(itemStyle.height) - 5} 5 ${parseInt(itemStyle.height) - 15}
          L 5 ${parseInt(itemStyle.height) - 20}
        `"
      />

    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CwBorder6',
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
        filterId : this.uuid()
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
.dv-border-box-6 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-border-svg-container {
    position: absolute;
    /* width: 100%;
    height: 100%;
    top: 0;
    left: 0; */

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