<template>
    <div class="dyn-btn" v-bind="$attrs">
      <CwDesignTabs v-model="compVal" :dataSource="dataSource" @tab-remove="handleTabRemove"	 @tab-click="handleClick"/>
    </div>
  </template>
  <script>
  import CwDesignTabs from "@/components/Cw/CwDesignTab.vue"
  import {dispatchEvent} from "../utils/eventUtils"

  export default {
    name: 'CwDesignTab',
    components: { CwDesignTabs },
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
          return { color:'black' }
        }
      },
      itemStyle: {
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
      itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            //console.log(newVal)

          }
        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        methods:{},
        vueContext:{},
        compVal: '',
        event:{
         
        },
        dataSource: [
            {label: '1号',name: '1'},
            {label: '2号',name: '2'},
        ],
      };
    },
    mounted() {
      //  console.log(this.dataSource)

    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '宽度', queryType: 'input', defaultValue: '500px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '242px', unit: 'px' },
        ]
      },
      customEvent(e,arr){
        const ele = this.$el
        ele.addEventListener("tab-click", e => {
            console.log('tab-click',e)
        })
      },
      dispatchEvent(event,val){
        const ele = this.$el
        ele.dispatchEvent(event)
      },
      comText() {
            return '标签页'
        },
      ificationType() {
        return {
          classification: '布局容器组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      handleTabRemove(value){
        const args = [value]
        const ele = this.$el
         dispatchEvent(ele,'tab-remove',args)
      },
      handleClick(val) {
        const args = [val]
        const ele = this.$el
         dispatchEvent(ele,'tab-click',args)
      },
    },
    created() {
      this.comText()
    }
  }
  </script>
  <style lang="scss" scoped>
 
  </style>