<template>
    <div class="dyn-iterator" @click="onclick">
        <CwSubPanelPreview  v-for="(li,index) in list" :class="'dyn-iterator-item_'+index" :key="'dyn-iterator-item_'+index"
                :style="component.styles"
                :component="component"
                :random="random"
                :bindData="li"
                :componentData="componentData"  
                :itemStyle="{width:'600px'}"
              /> 
              <!-- minHeight: 400px; -->
  </div>
  </template>
  <script>
import CwSubPanelPreview from "./CwSubPanelPreview.vue"

export default {
    name: 'CwIteratorView',
    components: { CwSubPanelPreview },
    props: {
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
          default: () =>{

          }
        },
        componentData: {
        type: Array,
        default: () => {
          return []
        }
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
        random:this.uuid(),
        style :{},
        list:[{},{},{},{}],
        value: this.componentModalObj[this.fieldName],
        compVal: '',
  
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
  
  
          }
        },
        deep: true
      },
    },
    computed: {},
    created() {
      this.comText();

      
    },
    mounted() {
      // !important
        // let style = {float:'left',marginLeft:'5px','margin-top':'5px'}
        // Object.assign(this.component.styles,style)
        this.style={width:'100%',display:'inline','background-color':''}
        Object.assign(this.$el.style,this.style)     
    },
    beforeDestroy() { },
    methods: {
      comText() {
        return '迭代器'
      },
      onclick(){
        let style = {float:'left',marginLeft:'5px','margin-top':'5px'}
        Object.assign(this.component.styles,style)
        this.style={width:'100%',display:'inline','background-color':''}
        Object.assign(this.$el.style,this.style)
      },
      handleDragStart(event) {
       //  event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
  
      },
      handleDragEnd() { },
      inputchange(val) {
        // console.log(val)
  
      },
    },
  
  }
  </script>
  <style lang="scss" scoped>
  
</style>