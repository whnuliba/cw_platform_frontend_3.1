<template>
    <div>
      <div class="ruler" style="z-index: 999;position: absolute; top:0;left: 0;" >
          <canvas id="horizontalRuler" :width="h_width" :height="h_height"></canvas>
      </div> 
      <div  class="ruler" style="z-index: 999;position: absolute; top:0;left: 0;" >
          <canvas id="verticalRuler" :width="v_width" :height="v_height"></canvas>
      </div> 
  </div>
  </template>
  <script>
    export default {
      name: 'CwRuler',
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
         h_width:{
           type: Number,
           default:()=>{return 1920}
         },
         h_height:{
            type: Number,
            default:()=>{return 16}
         },
         v_width:{
            type: Number,
            default:()=>{return 16}
         },
         v_height:{
            type: Number,
            default:()=>{return 1080}
        },        
      },
      watch: {
        v_height: {
          handler: function (newVal, oldVal) {
            if (newVal) {
              this.$nextTick(()=>{
                this.initRuler()
              })
            }
          },
        },
        h_width: {
          handler: function (newVal, oldVal) {
            if (newVal) {
              this.$nextTick(()=>{
                this.initRuler()
              })
            }
          },
        },
      },
      data() {
        const _initdata = {
          drawingWidth:1920,
          drawingHeight:1080,
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
       
      },
      mounted(){
        this.$nextTick(()=>{
          this.initRuler()
        })
        
      },
      methods: {
        initRuler(){
          let lineColor = '#CBCCCC'
          let textColor = '#CBCCCC'
          this.drawingWidth = this.h_width
          this.drawingHeight = this.v_height
          const oCanvas = document.getElementById('horizontalRuler')
          const ctx = oCanvas.getContext('2d')
          //ctx.clearRect(0,0,this.drawingWidth,16) 
          ctx.beginPath();
          for(let i=10.5 ; i<this.drawingWidth;i+=5){
            ctx.moveTo(i, 0.5)
            if(i%50==0.5){{
              ctx.lineTo(i, 15.5)
              ctx.save();
              //ctx.strokeText(i-0.5, i, 15.5)
              ctx.translate(i, 15.5);
              ctx.fillStyle = textColor
              ctx.fillText(i-0.5, 0, 0);
              ctx.restore();
            }
            }else{
              ctx.lineTo(i, 7.5)
            }
          
            ctx.strokeStyle =lineColor
           
            //ctx.lineWidth = 0.5
            ctx.stroke()
          }
          
          const verticalRuler = document.getElementById('verticalRuler')

          const verticalRulerCtx = verticalRuler.getContext('2d')
          //verticalRulerCtx.clearRect(0,0,16,this.drawingWidth) 
          verticalRulerCtx.beginPath();
          for(let i=10.5 ; i<this.drawingHeight;i+=5){
            verticalRulerCtx.moveTo(0.5, i)
            if(i%50==0.5){
              verticalRulerCtx.lineTo(15.5, i)

               verticalRulerCtx.save();
               verticalRulerCtx.translate(15.5, i);
               verticalRulerCtx.rotate(-Math.PI/2);
               verticalRulerCtx.fillStyle = textColor
               verticalRulerCtx.fillText(i-0.5, 0, 0);
               //verticalRulerCtx.strokeText(i-0.5, 12.5, i)

              verticalRulerCtx.restore();
             // verticalRulerCtx.strokeText(i-0.5, 12.5, i)

            }else{
              verticalRulerCtx.lineTo(7.5, i)
            }
          
            verticalRulerCtx.strokeStyle = lineColor
            //verticalRulerCtx.lineWidth = 0.5
            verticalRulerCtx.stroke()
          }
        }
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