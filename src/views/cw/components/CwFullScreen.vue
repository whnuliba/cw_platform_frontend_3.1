<template>
    <el-button text ref="myref" v-bind="$attrs" v-model="compVal"  @click="onClick" v-on="$listeners" :itemStyle="itemStyle" :panelStyle="panelStyle">
        <svg-icon :icon-class="buttonIcon"/>    
    </el-button>

  </template>
  <script>
   import {dispatchEvent} from "../utils/eventUtils"
  export default {
    name: 'CwFullScreen',
    components: {  },
    props: {
      panelStyle: {
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
        isFull: false,
        buttonIcon: 'fullscreen',
        myAttribute:{
          onClckEventName:'Event_Button_Full',
        }, 
        compVal: ''
      };
    },
    created() {
      this.comText();
    },
    mounted() {
        window.onresize = () => {
            if (this.getFullscreenElement() == null) {
                this.isFull = false;
                this.buttonIcon = this.isFull ? 'exit-fullscreen':'fullscreen'
            }
        }
    },
    beforeDestroy() { },
  
    methods: {
      handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        this.$nextTick(()=>{
          const ele = this.$el //$refs.myrefTree.$el
          if(ele){
            dispatchEvent(ele,tag,args)
          }
        })
      },
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '70px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '36px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: 'rgba(255, 255, 255, 0)', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'rgba(255, 255, 255, 0)', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'buttonName', title: '按钮名称', queryType: 'input', require: false, query: true, hide: false },
          { field: 'test', title: '测试', queryType: 'input', require: false, query: true, hide: false },

        ]
      },
      // 获取全屏状态
      getFullscreenElement() {
        return (
            document['fullscreenElement'] ||
            document['mozFullScreenElement'] ||
            document['msFullScreenElement'] ||
            document['webkitFullscreenElement'] || null
            ); 
      },
      onClick(e){
        let mainContainer= document.getElementsByClassName('preview')[0]
        if(!mainContainer)
            return
        if(!this.isFull){
            if(mainContainer.RequestFullScreen){
                mainContainers.RequestFullScreen();
            }
            //兼容火狐
            if(mainContainer.mozRequestFullScreen){
                mainContainer.mozRequestFullScreen();
            }
            //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
            if(mainContainer.webkitRequestFullScreen){
                mainContainer.webkitRequestFullScreen();
            }
            //兼容IE,只能写msRequestFullscreen
            if(mainContainer.msRequestFullscreen){
                mainContainer.msRequestFullscreen();
          }
        }else{
            if(document.exitFullScreen){
                document.exitFullscreen()
            }
            //兼容火狐
            if(document.mozCancelFullScreen){
                document.mozCancelFullScreen()
            }
            //兼容谷歌等
            if(document.webkitExitFullscreen){
                document.webkitExitFullscreen()
            }
            //兼容IE
            if(document.msExitFullscreen){
                document.msExitFullscreen()
            }
        }
        this.isFull = ! this.isFull;
        this.buttonIcon = this.isFull ? 'exit-fullscreen':'fullscreen'
         
      },
      comText() {
        return '全屏按钮'
      },
      ificationType() {
        return {
          classification: '基础组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      addBtn() {
        
      },
    },
  }
  </script>
  <style lang="scss" scoped>

  </style>