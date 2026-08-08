<template>
 <div style="position: absolute; top:0;left: 0;"  >
       <svg class="grid" :width="width+'px'" :height="height+'px'" xmlns="http://www.w3.org/2000/svg" 
       >
        <defs>
          <pattern
            id="smallGrid"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              :stroke="panelStyle.netCableColor ? panelStyle.netCableColor :'rgba(207, 207, 207, 0.3)'"
              stroke-width="1"
            />
          </pattern>
          <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
            <rect width="35" height="35" :fill=" panelStyle.backgroundColor ? panelStyle.backgroundColor : 'url(#smallGrid)'" />
            <path
              d="M 35 0 L 0 0 0 35"
              fill="none"
              :stroke="panelStyle.gridColor ? panelStyle.gridColor :'rgba(186, 186, 186, 0.5)'"
              stroke-width="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      </div>
  </template>
  <script>
    import i18n from "@/lang";
    //import CreateDefineRalex from "@/components/Cw/CreateDefineRalex"
    export default {
      name: 'CwGrid',
      components: {},
      directives: {},
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '未启用',
            1: '启用'
          }
          return statusMap[status]
        }
      },
      props: {
        panelStyle: {
          type: Object,
          default: () => {
            return {};
          },
        },
        width:{
            type:Number,
            default:()=>{return 1920}
        },
        height:{
            type:Number,
            default:()=>{return 1080}
        }
      },
      data() {
        const _initdata = {

        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
       
      },
      mounted(){
        this.$nextTick(()=>{
        })
        
      },
      methods: {

      }
    }
  </script>
  
  <style lang="less" scoped>
   .my-scrollbar-content {
    cursor: grab;
    transform-origin: left top;
    // transform: scale(v-bind(scaleValue));
    transition: all 0.3s;
  }
  </style>