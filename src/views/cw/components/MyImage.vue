<template>
  <div ref="myref" class="dyn-myImage" v-bind="$attrs" @dragstart="handleDragStart" @dragend="handleDragEnd" :style="itemStyle">
  </div>
</template>
<script>
export default {
  name: 'MyImage',
  components: {},
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
        return { backgroundColor: "aqua" }
      }
    },
    component: {
      type: Object,
      default: () => { }
    },
    bindData: {
      type: Object,
      default: () => { }
    },
  },
  computed: {},
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal.backgroundImage) {
        }
      },
      deep: true
    },
  },
  data() {
    return {
      methods:{},
      vueContext:{},
    };
  },
  created() {
    this.comText();
  },
  mounted() {},
  beforeDestroy() { },

  methods: {
    comText() {
      return '图片'
    },
    ificationType() {
      return {
        classification: '基础组件',
        isCanvasview: false,
      }
    },
    getStyleCols() {
      return [
        { field: 'position', title: 'position', queryType: 'select', defaultValue: 'absolute', require: false, query: true, hide: false },
        { field: 'width', title: 'width', queryType: 'input', defaultValue: '100px', require: false, query: true, hide: false },
        { field: 'height', title: 'height', queryType: 'input', defaultValue: '100px', require: false, query: true, hide: false },
        { field: 'backgroundColor', title: 'backgroundColor', queryType: 'colorpicker',defaultValue:'rgba(44, 37, 37, 0.34)', require: false, query: true, hide: false },
        { field: 'backgroundImage', title: 'backgroundImage', queryType: 'colorbutton', require: false, query: true, hide: false },
        { field: 'backgroundRepeat', title: 'backgroundRepeat', queryType: 'select', require: false, query: true, hide: false },
        { field: 'backgroundAttachment', title: 'backgroundAttachment', queryType: 'select', require: false, query: true, hide: false },
        { field: 'backgroundPosition', title: 'backgroundPosition', queryType: 'select', require: false, query: true, hide: false },
        { field: 'backgroundSize', title: 'backgroundSize', queryType: 'select', require: false, query: true, hide: false },
      ]
    },
    getAttributeCols() {
        return [  ]
      },
    selectOptions() {
      let overflow = [
        { label: 'backgroundColor', value: 'backgroundColor' },
        { label: 'backgroundImage', value: 'backgroundImage' },
        { label: 'backgroundGradient', value: 'backgroundGradient' },
      ]
      let obj = {}
      obj['background'] = overflow
      obj['backgroundRepeat'] = [
        { label: 'repeat-x', value: 'repeat-x' },
        { label: 'repeat-y', value: 'repeat-y' },
        { label: 'repeat', value: 'repeat' },
        { label: 'no-repeat', value: 'no-repeat' },
        { label: 'round', value: 'round' },
        { label: 'space', value: 'space' },
      ]
      obj['backgroundAttachment'] = [
        { label: 'fixed', value: 'fixed' },
        { label: 'scroll', value: 'scroll' },
        { label: 'local', value: 'local' },
      ];
      obj['backgroundPosition'] = [
        { label: 'center', value: 'center' },
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
        { label: 'top', value: 'top' },
        { label: 'bottom', value: 'bottom' },
      ];
      obj['backgroundSize'] = [
        { label: 'auto', value: 'auto' },
        { label: 'cover', value: 'cover' },
        { label: 'contain', value: 'contain' },
        { label: '100% 100%', value: '100% 100%' },
      ];
      return obj
    },
    

    handleDragStart(event) {
      event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY }));
    },
    handleDragEnd() { }
  },
}
</script>
<style lang="scss" scoped>
// .dyn-myImage {
//   // width: 100px;
//   // height: 100px;
//   /* position: absolute; */
//   // background-color: aqua;
//   // background-image: url('~@/assets/resource/6.png');
// }
</style>