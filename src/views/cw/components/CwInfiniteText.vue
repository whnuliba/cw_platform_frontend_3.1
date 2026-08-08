<template>
      <div ref="myRect" class="rect-style" v-bind="$attrs" :itemStyle="itemStyle">
        <div>
          <ul > 
            <li v-for="(val, key , i) in bindData" :key="'itertor'+ i">
              {{Object.keys(bindData ? bindData : {}).length && bindData[key][0] ? bindData[key][0]:''}} : {{Object.keys(bindData ? bindData : {}).length && bindData[key][1]
              ? bindData[key][1]:''}}
            </li>
          </ul>
        </div>
      </div>
</template>
<script>
// import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  name: 'CwInfiniteText',
  components: {   },   //vueSeamlessScroll
  props: {
    myStyle: {
        type: Object,
        default: () => {
          return { }
        }
      },
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
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
    fieldName: {
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
  data() {
    return {
      methods:{},
      vueContext:{},
      value: this.componentModalObj[this.fieldName],
      compVal: '',
      tbData: [
        {name:1,gender:2,age: 3},
      ],
      cols: [
        {
          field: 'name',width: '50px'
        },
        {
          field: 'gender',width: '50px'
        },
        {
          field: 'age',width: '50px'
        },
      ]
    };
  },
  watch: {
    compVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
        }
      },
      deep: true
    },
    itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            for (let i in newVal) {
              this.$refs.myRect.style[i] = newVal[i]
            }
          }
        },
        deep: true
      },
  },
  computed: {
  },
  created() {
    this.comText();
  },
  mounted() {
    console.log(this.bindData)
  },
  beforeDestroy() { },
  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '宽度', queryType: 'input', defaultValue: '187px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'color', title: '字体颜色', queryType: 'colorpicker', defaultValue: '#000' },
        // { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    getAttributeCols() {
      return [
        { field: 'placeholder', title: 'placeholder', queryType: 'input', require: false, query: true, hide: false },
      ]
    },
    comText() {
      return '迭代器文本块'
    },
    ificationType() {
      return {
        classification: '基础组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      // event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    inputchange(val) {
      // console.log(val)

    },
  },

}
</script>
<style lang="scss" scoped>  
  // table {
  //   border: 1px solid #000;
  // }
  .rect-style {
    display: flex;
    justify-content: center;
    align-items: center;
    // margin: 0 auto;
  }
  ul {
    text-align: center;
    padding:0;
    li {
      list-style: none;
      text-decoration: none;
    }
  }
</style>