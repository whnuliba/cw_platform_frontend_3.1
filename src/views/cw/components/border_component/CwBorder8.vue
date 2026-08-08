<template>
  <div class="dv-border-box-8">
    <svg class="dv-border-svg-container" :width="parseInt(itemStyle.width)" :height="parseInt(itemStyle.height)">
      <defs>
        <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
          <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
          <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
          <feFlood :flood-color="itemStyle.borderColor2" result="glowColor" />
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored" />
          <feMerge>
            <feMergeNode in="softGlowColored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <polygon
        :fill="itemStyle.background"
        :points="`
        20, 32 ${parseInt(itemStyle.width) * 0.5 - titleWidth / 2}, 32 ${parseInt(itemStyle.width) * 0.5 - titleWidth / 2 + 20}, 53
      ${parseInt(itemStyle.width) * 0.5 + titleWidth / 2 - 20}, 53 ${parseInt(itemStyle.width) * 0.5 + titleWidth / 2}, 32
      ${parseInt(itemStyle.width) - 20}, 32 ${parseInt(itemStyle.width) - 8}, 48 ${parseInt(itemStyle.width) - 8}, ${parseInt(itemStyle.height) - 25} ${parseInt(itemStyle.width) - 20}, ${parseInt(itemStyle.height) - 8}
      20, ${parseInt(itemStyle.height) - 8} 8, ${parseInt(itemStyle.height) - 25} 8, 50
      `"
      />

      <polyline
        :stroke="itemStyle.borderColor1"
        :filter="`url(#${filterId})`"
        :points="`
        ${(parseInt(itemStyle.width) - titleWidth) / 2}, 30
        20, 30 7, 50 7, ${50 + (parseInt(itemStyle.height) - 167) / 2}
        13, ${55 + (parseInt(itemStyle.height) - 167) / 2} 13, ${135 + (parseInt(itemStyle.height) - 167) / 2}
        7, ${140 + (parseInt(itemStyle.height) - 167) / 2} 7, ${parseInt(itemStyle.height) - 27}
        20, ${parseInt(itemStyle.height) - 7} ${parseInt(itemStyle.width) - 20}, ${parseInt(itemStyle.height) - 7} ${parseInt(itemStyle.width) - 7}, ${parseInt(itemStyle.height) - 27}
        ${parseInt(itemStyle.width) - 7}, ${140 + (parseInt(itemStyle.height) - 167) / 2} ${parseInt(itemStyle.width) - 13}, ${135 + (parseInt(itemStyle.height) - 167) / 2}
        ${parseInt(itemStyle.width) - 13}, ${55 + (parseInt(itemStyle.height) - 167) / 2} ${parseInt(itemStyle.width) - 7}, ${50 + (parseInt(itemStyle.height) - 167) / 2}
        ${parseInt(itemStyle.width) - 7}, 50 ${parseInt(itemStyle.width) - 20}, 30 ${(parseInt(itemStyle.width) + titleWidth) / 2}, 30
        ${(parseInt(itemStyle.width) + titleWidth) / 2 - 20}, 7 ${(parseInt(itemStyle.width) - titleWidth) / 2 + 20}, 7
        ${(parseInt(itemStyle.width) - titleWidth) / 2}, 30 ${(parseInt(itemStyle.width) - titleWidth) / 2 + 20}, 52
        ${(parseInt(itemStyle.width) + titleWidth) / 2 - 20}, 52 ${(parseInt(itemStyle.width) + titleWidth) / 2}, 30
        `"
      />

      <polygon
        :stroke="itemStyle.borderColor1"
        fill="transparent"
        :points="`
        ${(parseInt(itemStyle.width) + titleWidth) / 2 - 5}, 30 ${(parseInt(itemStyle.width) + titleWidth) / 2 - 21}, 11
        ${(parseInt(itemStyle.width) + titleWidth) / 2 - 27}, 11 ${(parseInt(itemStyle.width) + titleWidth) / 2 - 8}, 34
      `"
      />

      <polygon
        :stroke="itemStyle.borderColor1"
        fill="transparent"
        :points="`
        ${(parseInt(itemStyle.width) - titleWidth) / 2 + 5}, 30 ${(parseInt(itemStyle.width) - titleWidth) / 2 + 22}, 49
        ${(parseInt(itemStyle.width) - titleWidth) / 2 + 28}, 49 ${(parseInt(itemStyle.width) - titleWidth) / 2 + 8}, 26
      `"
      />

      <polygon
        :stroke="itemStyle.borderColor1"
        :fill="fade(itemStyle.borderColor2, 30)"
        :filter="`url(#${filterId})`"
        :points="`
        ${(parseInt(itemStyle.width) + titleWidth) / 2 - 11}, 37 ${(parseInt(itemStyle.width) + titleWidth) / 2 - 32}, 11
        ${(parseInt(itemStyle.width) - titleWidth) / 2 + 23}, 11 ${(parseInt(itemStyle.width) - titleWidth) / 2 + 11}, 23
        ${(parseInt(itemStyle.width) - titleWidth) / 2 + 33}, 49 ${(parseInt(itemStyle.width) + titleWidth) / 2 - 22}, 49
      `"
      />

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="1"
        :points="`
        ${(parseInt(itemStyle.width) - titleWidth) / 2 - 10}, 37 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 31}, 37
        ${(parseInt(itemStyle.width) - titleWidth) / 2 - 25}, 46 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 4}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="0.7"
        :points="`
        ${(parseInt(itemStyle.width) - titleWidth) / 2 - 40}, 37 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 61}, 37
      ${(parseInt(itemStyle.width) - titleWidth) / 2 - 55}, 46 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 34}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.4;0.7"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="0.5"
        :points="`
        ${(parseInt(itemStyle.width) - titleWidth) / 2 - 70}, 37 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 91}, 37
      ${(parseInt(itemStyle.width) - titleWidth) / 2 - 85}, 46 ${(parseInt(itemStyle.width) - titleWidth) / 2 - 64}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="1"
        :points="`
        ${(parseInt(itemStyle.width) + titleWidth) / 2 + 30}, 37 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 9}, 37
      ${(parseInt(itemStyle.width) + titleWidth) / 2 + 3}, 46 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 24}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="0.7"
        :points="`
        ${(parseInt(itemStyle.width) + titleWidth) / 2 + 60}, 37 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 39}, 37
      ${(parseInt(itemStyle.width) + titleWidth) / 2 + 33}, 46 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 54}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.4;0.7"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <polygon
        :filter="`url(#${filterId})`"
        :fill="itemStyle.borderColor1"
        opacity="0.5"
        :points="`
        ${(parseInt(itemStyle.width) + titleWidth) / 2 + 90}, 37 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 69}, 37
      ${(parseInt(itemStyle.width) + titleWidth) / 2 + 63}, 46 ${(parseInt(itemStyle.width) + titleWidth) / 2 + 84}, 46
      `"
      >
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>

      <text
        ref="textRef"
        class="dv-border-box-8-title"
        :x="`${parseInt(itemStyle.width) / 2}`"
        y="32"
        fill="#ffffff"
        font-size="18"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ itemStyle.title }}
      </text>

      <polygon
        :fill="itemStyle.borderColor1"
        :filter="`url(#${filterId})`"
        :points="`
        7, ${53 + (parseInt(itemStyle.height) - 167) / 2} 11, ${57 + (parseInt(itemStyle.height) - 167) / 2}
      11, ${133 + (parseInt(itemStyle.height) - 167) / 2} 7, ${137 + (parseInt(itemStyle.height) - 167) / 2}
      `"
      />

      <polygon
        :fill="itemStyle.borderColor1"
        :filter="`url(#${filterId})`"
        :points="`
        ${parseInt(itemStyle.width) - 7}, ${53 + (parseInt(itemStyle.height) - 167) / 2} ${parseInt(itemStyle.width) - 11}, ${57 + (parseInt(itemStyle.height) - 167) / 2}
      ${parseInt(itemStyle.width) - 11}, ${133 + (parseInt(itemStyle.height) - 167) / 2} ${parseInt(itemStyle.width) - 7}, ${137 + (parseInt(itemStyle.height) - 167) / 2}
      `"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import TinyColor2 from 'tinycolor2'
  export default {
    name: 'CwBorder8',
    components: {  },
    props: {
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      component: {
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
            this.titleWidth = newVal.titleWidth?parseInt(newVal.titleWidth):180
 
          }
        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        titleWidth: 180,
        filterId: this.component.id,
      };
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.titleWidth = this.itemStyle.titleWidth?parseInt(this.itemStyle.titleWidth):180
      })
    },
    beforeDestroy() { },
  
    methods: {
      fade(color, percent) {
        const rgbType = TinyColor2(color)
        rgbType.setAlpha(percent / 100)
        return rgbType.toRgbString()
      },
      getStyleCols() {
        return[          
          { field: 'titleWidth', title: '标题宽度', queryType: 'input', defaultValue: 180},
          { field: 'title', title: '标题', queryType: 'input', defaultValue: ''},
        ]
      },
    },
  }
</script>
<style lang="less" scoped>
.dv-border-box-8 {
  position: relative;
  width: 100%;
  height: 100%;

  .dv-border-svg-container {
    position: absolute;
    display: block;
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