<template>
    <CwRadios v-bind="$attrs" v-model="value" :itemStyle="itemStyle" @change="raChange" size="medium" :dataSource="dataSource" />
</template>
<script>
import CwRadios from "@/components/Cw/CwRadio.vue"

export default {
  name: 'CwRadio',
  components: { CwRadios },
  props: {
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    itemStyle: {
          type: Object,
          default: () => {
            return {}
          }
        },
    fieldName: {
      type: String,
      default: ''
    },
    myStyle: {
      type: Object,
      default: () => {
        return { width: "100px", height: "100px", backgroundColor: "pink" }
      }
    },
    itemVal: {
      type: String,
      default: ''
    },
    compId: {
      type: String,
      default: ''
    },
    component:{
        type: Object,
        default: () =>{}
      },
    bindData:{
      type: Object,
      default: () =>{}
    },
  },
  watch: {
    itemVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.compVal = newVal
        }

      },
      deep: true
    },
    dataSource: {
      handler: function (newVal, oldVal) {
        // console.log(newVal, oldVal)
      },
      deep: true
    },

  },
  computed: {},
  data() {
    return {
      methods:{},
      vueContext:{},
      value: this.componentModalObj[this.fieldName],
      compVal: '',
      dataSource: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
    };
  },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '宽度', queryType: 'input', defaultValue: '187px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
      ]
    },
    comText() {
      return '单选框'
    },
    ificationType() {
      return {
        classification: '表单组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    raChange(val) {
      console.log(val,'===',this.compVal)
    },
  },
  created() {
    this.comText();
  }
}
</script>
<style lang="scss" scoped>
</style>