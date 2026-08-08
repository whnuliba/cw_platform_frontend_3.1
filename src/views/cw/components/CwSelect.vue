<template>
    <CwSelects v-bind="$attrs" @visible-change="visibleChange" @onChange="onChange" ref="myRef" v-model="value" :options="options" :itemStyle="itemStyle"/>
</template>
<script>
  import CwSelects from "@/components/Cw/CwSelect.vue"
  import {dispatchEvent} from "../utils/eventUtils"

  export default {
    name: 'CwSelect',
    components: { CwSelects },
    props: {
      componentModalObj: {
        type: Object,
        default: () => {
          return { }
        }
      },
      fieldName: {
        type: String,
        default: ''
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
            for (let i in newVal) {
              this.$refs.myRef.$el.style[i] = newVal[i]
            }
          }
        },
        deep: true
      },
      'component.attribute.url': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.dataView()
            }
        },
        deep: true,
      },
      'component.attribute.params': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.dataView()
            }
        },
        deep: true,
      },
    },
    computed: {},
    data() {
      return {
        dataObtainedByEditor:{},
        methods:{},
        vueContext:{},
        value: this.componentModalObj[this.fieldName]||'',
        compVal: '',
        options: [
          {
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }
        ]
      };
    },
    created() {
      this.comText();
    },
    mounted() {
      this.dataView()
    },
    beforeDestroy() { },
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '187px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
          { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
          { field: 'params', title: 'params', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
      comText() {
        return '选择器'
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
      visibleChange() {
        if (this.$parent.hasOwnProperty('onClick')) {
          this.$parent.onClick();
        }
      },
      dataView() {
        if (this.component.attribute.params && this.component.attribute.url) {
          let url = this.component.attribute.url, params = JSON.parse(this.component.attribute.params);
          let urlParams = { url: url, params: params };
          if (url && params) {
            this.$store.dispatch('fmsCommon/actionPost', urlParams)
              .then(data => {
                this.options = eval(`(${this.component.elementCode})`).selDataGet(data);
              }).catch(err => {
                this.options = [];
                this.$message.error('输入url,params错误');
              })
          }
        }
      },
      onChange() {
        this.handlerEvent('onChange')
      },
      handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
            const ele = this.$el//$refs.myrefTree.$el
            if(ele){
              dispatchEvent(ele,tag,args)
            }
        })
      },
      
    },
    
  }
</script>
<style lang="scss" scoped>
</style>