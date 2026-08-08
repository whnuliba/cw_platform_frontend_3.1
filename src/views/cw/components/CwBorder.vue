<template>
  <component :is="component.styles.types?component.styles.types:'CwBorder1'" v-model="compVal" @click="onClick" v-on="$listeners" :itemStyle="getBorderStyle()" :component="component"></component>
</template>

<script>
  import CwBorder1 from "./border_component/CwBorder1.vue"
  import CwBorder2 from "./border_component/CwBorder2.vue"
  import CwBorder3 from "./border_component/CwBorder3.vue"
  import CwBorder4 from "./border_component/CwBorder4.vue"
  import CwBorder5 from "./border_component/CwBorder5.vue"
  import CwBorder6 from "./border_component/CwBorder6.vue"
  import CwBorder7 from "./border_component/CwBorder7.vue"
  import CwBorder8 from "./border_component/CwBorder8.vue"
  import CwBorder9 from "./border_component/CwBorder9.vue"
  import CwBorder10 from "./border_component/CwBorder10.vue"

  export default {
    name: 'CwBorder',
    components: { CwBorder1 ,CwBorder2, CwBorder3, CwBorder4, CwBorder5, CwBorder6, CwBorder7, CwBorder8, CwBorder9, CwBorder10},
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
        vueContext:{},
        compVal: '',
        parentClass: '',
          methods:{}
      };
    },
    created() {
      this.comText();
    },
    mounted() {
      this.$nextTick(() => {
        this.parentClass = this.$parent.$parent.$el
        // this.getBorderStyle()
      })
    },
    beforeDestroy() { },
  
    methods: {
      convertPx(data,parentData){
        let result = data
        if(typeof(data)=='string' && data.match(/[\D]+/g))
          switch (data.match(/[\D]+/g)[0]) {
            case 'px' : result = parseInt(data); break;
            case '%':   result = parseInt(data) / 100 * parseInt(parentData); break;
            case 'vw': result = parseInt(data) / 100 * window.innerWidth; break;
            case 'vh': result = parseInt(data) / 100 * window.innerHeight; break;
            default: result = parseInt(data);
          }
        return result
      },
      getBorderStyle(){
        let result = {...this.itemStyle,width:0,height:0}
        if(this.parentClass){
            if(this.parentClass._prevClass =='_prevClass'||this.parentClass._prevClass == 'my-scrollbar-content'){
              result['width'] = parseInt(this.convertPx(this.itemStyle.width,this.$parent.$parent.width) )
              result['height'] = parseInt(this.convertPx(this.itemStyle.height,this.$parent.$parent.height) )
            } else{
              result['width'] = parseInt(this.convertPx(this.itemStyle.width,this.$parent.$parent.$el.clientWidth)) 
              result['height'] = parseInt(this.convertPx(this.itemStyle.height,this.$parent.$parent.$el.clientHeight) )
            } 
        }
        return result
      },
      getStyleCols() {
        return [
          { field: 'types', title: '类型', queryType: 'select', defaultValue:"CwBorder1"},
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '500px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '200px', unit: 'px' },
          { field: 'borderColor1', title: '边框颜色1', queryType: 'colorpicker', defaultValue: '#4fd2dd', },
          { field: 'borderColor2', title: '边框颜色2', queryType: 'colorpicker', defaultValue: '#235fa7', },
          { field: 'background', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'rgba(255, 255, 255, 0)', },
        ]
      },
      getAttributeCols() {
        return []
      },
      selectOptions() {
        let obj = {}
        obj['types'] = [
            { label: '类型一', value: 'CwBorder1' },
            { label: '类型二', value: 'CwBorder2' },
            { label: '类型三', value: 'CwBorder3' },
            { label: '类型四', value: 'CwBorder4' },
            { label: '类型五', value: 'CwBorder5' },
            { label: '类型六', value: 'CwBorder6' },
            { label: '类型七', value: 'CwBorder7' },
            { label: '带标题边框', value: 'CwBorder8' },
            { label: '对角边框', value: 'CwBorder9' },
            { label: '类型十', value: 'CwBorder10' },
        ]
        return obj
      },
      onClick(e){
         
      },
      comText() {
        return '边框'
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
<style lang="less" scoped>


</style>