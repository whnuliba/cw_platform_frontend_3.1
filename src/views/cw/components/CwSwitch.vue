<template>
  <div class="dyn-switch" v-bind="$attrs">
    <CwSwitchs v-model="value" :itemStyle="itemStyle" />
  </div>
</template>
<script>
import CwSwitchs from "@/components/Cw/CwSwitch.vue"
export default {
  name: 'CwSwitch',
  components: { CwSwitchs },
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
    itemStyle: {
      type: Object,
      default: () => {
        return { }
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
  computed: {},
  data() {
    return {
      methods:{},
      vueContext:{},
      value: this.componentModalObj[this.fieldName],
      compVal: '',
    };
  },
  watch: {
    itemVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.compVal = newVal
        }
      },
      deep: true
    }
  },
  created() {
    this.comText();
  },
  mounted() {
  },
  beforeDestroy() { },

  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '40px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '20px', unit: 'px' },
      ]
    },
    comText() {
      return '开关'
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
    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped>
/* .dyn-dyn-switch {
      width: 100px;
      height: 100px;
       position: absolute; 
      background-color: aqua;
    } */
</style>