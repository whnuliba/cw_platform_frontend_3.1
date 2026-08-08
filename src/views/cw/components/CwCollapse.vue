<template>
    <CwCollapses v-bind="$attrs" v-model="value" @change="cheChange" size="medium" :dataSource="dataSource" />
</template>
<script>
import CwCollapses from "@/components/Cw/CwCollapse.vue"

export default {
  name: 'CwCollapse',
  components: { CwCollapses },
  props: {
    componentModalObj: {
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
      handler: function (newVal, oldVal) { },
      deep: true
    },
  },
  computed: {},
  data() {
    return {
      methods:{},
      vueContext:{},
      value: this.componentModalObj[this.fieldName],
      compVal: [],
      dataSource: [
        { title: '面板1', name: 'mb1', content: '内容1' },
        { title: '面板2', value: 'mb2', content: '内容2' },
        { title: '面板3', value: 'mb3', content: '内容3' },
        { title: '面板4', value: 'mb4', content: '内容4' },
      ],
    };
  },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    getStyleCols() {
        return [
          { field: 'width', title: '宽度', queryType: 'input', defaultValue: '500px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '242px', unit: 'px' },
        ]
    },
    comText() {
      return '折叠面板'
    },
    ificationType() {
      return {
        classification: '布局容器组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
    },
    handleDragEnd() { },
    cheChange(val) { },
  },
  created() {
    this.comText();
  }
}
</script>
<style lang="scss" scoped>
</style>