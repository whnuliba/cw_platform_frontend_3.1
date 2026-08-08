<template>
  <div :id="shapeId" :ref="shapeId" class="shape" @mousedown="onMousedown" @dragstart="handleDragStart"
  @keydown.stop="movePanel" @dragend="handleDragEnd" @click="onClick" @contextmenu.prevent="openMenu" tabindex='-1'>
    <i v-show="isShown" class="el-icon-refresh-right rotate" @mousedown="onRotatetMousedown"></i>
    <slot />

    <div v-show="isShown" v-for="item in dotList" :key="item.side" class="dot" :data-side="item.side"
      :style="getDotStyle(item)" @mousedown="onDotMousedown(item, $event)" >
    </div>
    <!-- @mouseup="onDotMouseUp" -->
  </div>
</template>
<script>
  // import Clickoutside from 'element-ui/src/utils/clickoutside'
import { deepClone } from '@/utils'
// import modules from "./components/loadModule.js";

  export default {
    name: "NodeShape",
    components: {},
    directives: {},
    computed: {
      itemStyles() {
        return JSON.parse(JSON.stringify(this.itemStyle))
      }
    },
    props: {
      attribute: {
        type: Object,
        default: () => { }
      },
      itemStyle: {
        type: Object,
        default: () => { }
      },
      shapeId: {
        type: String,
        default: ''
      },
      component: {
        type: Object,
        default: () => { }
      },
      compId: {
        type: String,
        default: ''
      },
      rectStyle: {
        type: Object,
        default: () => { }
      },
      componentData: {
        type: Array,
        default: () => []
      },
      selectedElements: {
        type: Array,
        default: () => []
      },
      isSelected: {
        type: Boolean,
        default: () => false
      },
      
    },
    data() {
      return {
        // 显示
        isShown: false,
        isShowmenu: false,
        // 圆点位置
        dotList: [
          { side: 'top', cursor: 'n-resize' },
          { side: 'bottom', cursor: 'n-resize' },
          { side: 'left', cursor: 'e-resize' },
          { side: 'right', cursor: 'e-resize' },
          { side: 'top-left', cursor: 'se-resize' },
          { side: 'top-right', cursor: 'sw-resize' },
          { side: 'bottom-left', cursor: 'sw-resize' },
          { side: 'bottom-right', cursor: 'se-resize' }
        ],
        // 选中
        compFocus: '',
        // 数据
        compData: {

        },
        //右键菜单出现位置
        menuLeft: 0,
        menuTop: 0,
        copyData: {},
        // 判断是否在移动/放缩/旋转过程中
        inprocess: false
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.$bus.$on('layerValue', (val) => {
          if (this.compId.split('-')[1] === val) {
            document.getElementById("shape"+val).click()
          }
        })

        this.$refs[this.shapeId].addEventListener("keyup", (e)=>{this.movePanel(e)});
       })
    },
    beforeDestroy() {
      this.$refs[this.shapeId].removeEventListener('keyup', this.movePanel)
    },
    created() { },
    watch: {
      isSelected: {
        handler: function (newVal, oldVal) {
          this.isShown = newVal;
          this.compFocus = this.compId
        },
        deep: true,
        // immediate: true,
      },
      // selectedElements: {
      //   handler: function (newVal, oldVal) {
      //     console.log(newVal)
      //   },
      //   deep: true,
      //   immediate: true,
      // },
    },
    methods: {
      movePanel(e){
        if (this.compFocus != this.compId) {
            return;
        }
        if(e.ctrlKey && e.keyCode === 67){
          let comt = JSON.parse(JSON.stringify({...this.component}))
          this.copyData = {
            data: deepClone(comt),
          };
          this.$emit("tocopyData", this.copyData)
        }
       
        if (e.keyCode == 37 || e.keyCode === 39 || e.keyCode == 38 || e.keyCode === 40) {
          let moveleft = null
          let movetop = null
          let num = e.ctrlKey ? 1 : 5
          e.preventDefault();
          if (e.keyCode == 37 || e.keyCode === 39) {//Left Arrow
            moveleft = parseInt(this.$el.style.left, 10) + (e.keyCode == 37 ? -num : num) + 'px'
          }
          if (e.keyCode == 38 || e.keyCode === 40) {//Up Arrow
            movetop = parseInt(this.$el.style.top, 10) + (e.keyCode == 38 ? -num : num) + 'px'
          }
          let obj = {
            compId: this.compId,
            data: {
              ...this.itemStyle,
              left: moveleft ? moveleft : this.itemStyle.left,
              top: movetop ? movetop : this.itemStyle.top,
            }
          }
          this.$bus.$emit('styleData', obj)
        }
        if (e.keyCode == 46) {
          this.$emit("deleteData", this.compId)
      }
       
      },
      // 圆点style
      getDotStyle(item) {
        const [side, position] = item.side.split('-')
        const style = { [side]: '0%', cursor: item.cursor }
        if (!position) {
          const side2 = ['top', 'bottom'].includes(side) ? 'left' : 'top'
          style[side2] = '50%'
        } else {
          style[position] = '0%'
        }
        return style
      },
      onClick(e) {
        if (e) {
          e.stopPropagation()
          e.preventDefault()
        }
        this.isShown = true;
        this.$refs[this.shapeId].classList.add("active");      
        this.compFocus = this.compId
        this.$bus.$emit('compFocusId', this.compId)
        let attributeObj = {
          compId: this.compId,
          component: this.component,
          data: {
            comPname: this.compId.split('-')[0],
            id: this.compId.split('-')[1],
            ...this.attribute,
          },
        }

        this.$bus.$emit('attributeDataProcess', attributeObj)
        let obj = {
          compId: this.compId,
          data: { 
            ...this.itemStyle,
            left: this.$el.style.left,
            top: this.$el.style.top,
          }
        }
        // for (let i in obj.data) {
        //   if (obj.data[i].includes('px')) {
        //     obj.data[i] = obj.data[i].replace('px', '')
        //   }
        // }
        this.$bus.$emit('styleData', obj)
        document.addEventListener('keyup', this.keyUp);
        document.addEventListener("mouseup", this.handleBlur);
        // this.$bus.$emit('compshapeId', this.shapeId, this.$refs[this.shapeId], this.compId)
      },
      // 失焦
      handleBlur(e) {
        const left_inner = document.querySelector(".main_designer_left");
        const main_inner = document.querySelector(".main_designer_main1");
        if(left_inner && main_inner && this.$refs[this.shapeId]){
          // 左键选中左侧或中部，右键选中
          if ((e.button === 0 && (left_inner.contains(e.target) || main_inner.contains(e.target))) || e.button === 2) {
            this.isShown = false;
            this.$refs[this.shapeId].classList.remove("active");
            this.compFocus = ''
            this.$bus.$emit('compFocusId')
            document.removeEventListener("mouseup", this.handleBlur);
          }
        }
      },
      allhandleBlur(e) {
        const left_inner = document.querySelector(".main_designer_left");
        const main_inner = document.querySelector(".main_designer_main1");
        if(left_inner && main_inner && this.$refs[this.shapeId]){
          // 左键选中左侧或中部，右键选中
          // if ((e.button === 0 && (left_inner.contains(e.target) || main_inner.contains(e.target))) || e.button === 2) {
            this.isShown = false;
            this.$refs[this.shapeId].classList.remove("active");
            this.compFocus = ''
            this.$bus.$emit('compFocusId')
            document.removeEventListener("mouseup", this.handleBlur);
          // }
        }
      },
      convertPx(data,parentData){
        let result = ''
        if(data)
          switch (data.replace(/[\d\.]+/g,'')) {
            case 'px' : result = parseInt(data);break;
            case '%':   result = parseInt(data) / 100 * parseInt(parentData) + 10;break;
            case 'vw': result = parseInt(data) / 100 * window.innerWidth;break;
            case 'vh': result = parseInt(data) / 100 * window.innerHeight;break;
            default: result = parseInt(data);
          }
        return result
      },
      convertOldunit(oldData,data,parentData){
        let result = ''
        if(oldData)
          switch (oldData.replace(/[\d\.]+/g,'')) {
            case 'px' : result = data.toFixed(0) + 'px';break;
            case '%':   result = ((data / parseInt(parentData))*100).toFixed(1)+ '%';break;
            case 'vw': result = ((data / window.innerWidth)*100).toFixed(1) + 'vw';break;
            case 'vh': result = ((data / window.innerHeight)*100).toFixed(1) + 'vh';break;
            default: result = data.toFixed(1)  + 'px';
          }
        return result
      },
      // 移动
      onMousedown(event) {
        if (this.compFocus != this.compId || this.isShowmenu) return //未选中或右键面板存在时不能移动
        if (event.button != 0 ) return //非鼠标左键点击时不能移动
        this.inprocess = true
        
        // event.stopPropagation()
        // event.preventDefault()
        const sourceRect = this.$parent.$el
        // 鼠标在盒子里的位置
        const mouseX = event.clientX - this.convertPx(this.itemStyle.left,this.rectStyle.width);
        const mouseY = event.clientY - this.convertPx(this.itemStyle.top,this.rectStyle.height);
        let _this = this

      
        function onMousemove(e) {
          e.stopPropagation()
          e.preventDefault()
          

          let moveX =  Math.ceil((e.clientX - mouseX) / 5) * 5
          let moveY = Math.ceil((e.clientY - mouseY) / 5) * 5
          // 出界
          // console.log( e.clientX,mouseX)
          //若不允许出界  放出该条件 edit by  wanghao 2024-05-08
          //moveX = moveX > 0 ? moveX : 0
          //moveY = moveY > 0 ? moveY : 0


          // moveX = moveX < _this.panelStyle.width - sourceRect.width ? moveX : _this.panelStyle.width - sourceRect.width
          // moveY = moveY < _this.panelStyle.height - sourceRect.height ? moveY : _this.panelStyle.height - sourceRect.height
          // let moveobj = {
          //   comPname: _this.compId.split('-')[0],
          //   id: _this.compId.split('-')[1],
          //   shapeId: _this.shapeId,
          //   left: moveX,
          //   top: moveY
          // }
          // _this.$bus.$emit('moveData', moveobj)
            // let attributeObj = {
          //   compId: _this.compId,
          //   component: _this.component,
          //   data: {
          //     ..._this.attribute,
          //     top: moveY,
          //     left: moveX,
          //   },
          // }
          // _this.$bus.$emit('attributeDataProcess', attributeObj)

       
          moveX = _this.convertOldunit(_this.itemStyle.left, moveX, _this.rectStyle.width)
          moveY = _this.convertOldunit(_this.itemStyle.top, moveY, _this.rectStyle.height)
          // console.log(moveX,moveY)
          // console.log(_this.selectedElements,_this.selectedElements.length)
       
    if (_this.selectedElements.length > 1) {
      _this.selectedElements.forEach(item => {
        let tearr = [..._this.$store.state.app.pageDesignComponentData]
        tearr.forEach((item2) => {
          if (item == 'shape' + item2.id) {
            let newLeft =  parseInt(moveX, 10)-(parseInt(_this.itemStyle.left, 10)-parseInt(item2.styles.left, 10));
            let newTop =  parseInt(moveY, 10)-(parseInt(_this.itemStyle.top, 10)-parseInt(item2.styles.top, 10));
            // newTop = Math.max(0, newTop);

            // item2.styles = {
            //   ...item2.styles,
            //   top: newTop + 'px',
            //   left: newLeft + 'px'
            // };
            let obj = {
              compId: item2.component + '-' + item2.id,
              data: {
                ...item2.styles,
                top: newTop + 'px',
                left: newLeft + 'px'
              }
            };

            _this.$bus.$emit('styleData', obj);
          }
        });
      });
    } else {
            let obj = {
              compId: _this.compId,
              data: {
                ..._this.itemStyle,
                top: moveY,
                left: moveX
              }
            }

            _this.$bus.$emit('styleData', obj)
            let tearr = _this.$store.state.app.pageDesignComponentData
            tearr.forEach((other) => {
              if (_this.component.id !== other.id && (parseInt(_this.component.styles.left, 10) - parseInt(other.styles.left, 10)) <= 300 && (parseInt(_this.component.styles.top, 10) - parseInt(other.styles.top, 10)) <= 300) {
                checkSnap(_this.component, other);
              }
            });
          }
        

        };
        function checkSnap(item, other, threshold = 20) {
          if (item.attribute.adsorptionDirection == 'left-right' && other.attribute.adsorptionDirection == 'left-right') { // 右左吸附
            let distanceX = Math.abs((parseInt(item.styles.left, 10) + parseInt(item.styles.width, 10)) - parseInt(other.styles.left, 10))
            let distanceX_right = Math.abs(parseInt(item.styles.left, 10) - parseInt(other.styles.left, 10) - parseInt(other.styles.width, 10))
            let distanceY = Math.abs((parseInt(item.styles.top, 10)) - parseInt(other.styles.top, 10))
            if (distanceX <= 15 && distanceY <= 15) {
              let obj = {
                compId: _this.compId,
                data: {
                  ..._this.itemStyle,
                  top: other.styles.top,
                  left: parseInt(other.styles.left, 10) - parseInt(item.styles.width, 10) + 'px',
                }
              }
              _this.$bus.$emit('styleData', obj)
            }else if(distanceX_right <= 15 && distanceY <= 15){
              let obj = {
                compId: _this.compId,
                data: {
                  ..._this.itemStyle,
                  top: other.styles.top,
                  left: parseInt(other.styles.left, 10) + parseInt(other.styles.width, 10) + 'px',
                }
              }
              _this.$bus.$emit('styleData', obj)
            }
          }
          // if (item.attribute.adsorptionDirection == 'left' && other.attribute.adsorptionDirection == 'right') { // 左右吸附
          //   let distanceX = Math.abs((parseInt(item.styles.left, 10)) - (parseInt(other.styles.left, 10) + parseInt(item.styles.width, 10)))
          //   let distanceY = Math.abs((parseInt(item.styles.top, 10)) - parseInt(other.styles.top, 10))
          //   if (distanceX <= 15 && distanceY <= 15) {
          //     let obj = {
          //       compId: _this.compId,
          //       data: {
          //         ..._this.itemStyle,
          //         top: other.styles.top,
          //         left: parseInt(other.styles.left, 10) + parseInt(other.styles.width, 10) + 'px',
          //       }
          //     }
          //     _this.$bus.$emit('styleData', obj)
          //   }
          // }

          if (item.attribute.adsorptionDirection == 'top-bottom' && other.attribute.adsorptionDirection == 'top-bottom') { // 上下吸附
            let distanceX = Math.abs((parseInt(item.styles.left, 10)) - parseInt(other.styles.left, 10))
            let distanceY = Math.abs((parseInt(item.styles.top, 10)) - parseInt(other.styles.top, 10) - parseInt(other.styles.height, 10))
            let distanceY_top = Math.abs((parseInt(item.styles.top, 10)) + parseInt(item.styles.height, 10) - parseInt(other.styles.top, 10))
            if (distanceX <= 15 && distanceY <= 15) {
              let obj = {
                compId: _this.compId,
                data: {
                  ..._this.itemStyle,
                  top: parseInt(other.styles.top, 10) + parseInt(other.styles.height, 10) + 'px',
                  left: other.styles.left,
                }
              }
              _this.$bus.$emit('styleData', obj)
            }else if(distanceX <= 15 && distanceY_top <= 15){
              let obj = {
                compId: _this.compId,
                data: {
                  ..._this.itemStyle,
                  top: parseInt(other.styles.top, 10) - parseInt(item.styles.height, 10) + 'px',
                  left: other.styles.left,
                }
              }
              _this.$bus.$emit('styleData', obj)
            }
          }
          // if (item.attribute.adsorptionDirection == 'bottom' && other.attribute.adsorptionDirection == 'top') { // 下上吸附
          //   let distanceX = Math.abs((parseInt(item.styles.left, 10)) - parseInt(other.styles.left, 10))
          //   let distanceY = Math.abs((parseInt(item.styles.top, 10)) + parseInt(item.styles.height, 10) - parseInt(other.styles.top, 10))
          //   if (distanceX <= 15 && distanceY <= 15) {
          //     let obj = {
          //       compId: _this.compId,
          //       data: {
          //         ..._this.itemStyle,
          //         top: parseInt(other.styles.top, 10) - parseInt(item.styles.height, 10) + 'px',
          //         left: other.styles.left,
          //       }
          //     }
          //     _this.$bus.$emit('styleData', obj)
          //   }
          // }
        }
        function onMouseup(e) {
          //console.log("e mouseup", e);
          _this.inprocess = false
          _this.$emit("nodeSavaQueueManager")
          document.removeEventListener('mousemove', onMousemove)
          document.removeEventListener('mouseup', onMouseup)
        };
        document.addEventListener('mousemove', onMousemove)
        document.addEventListener('mouseup', onMouseup)
      },
      // 解决鼠标松开的时候,元素仍然可以拖动问题
      handleDragEnd(event) {
        event.preventDefault();
        //console.log('handleDragEnd',event)
      },
      handleDragStart(event) {
        event.preventDefault();
        //console.log("handleDragStart",event)
      },
      // 放缩
      onDotMousedown(dotInfo, e) {
        if (this.compFocus != this.compId) return //未选中不能放缩
        this.inprocess = true
        this.isShowmenu = false;
        e.stopPropagation()
        e.preventDefault()
        const innerRect = this.$parent.$el.getBoundingClientRect()
        const sourceRect = this.$parent.$refs[this.compId][0].$el.getBoundingClientRect()
        const downX = e.clientX //- source.offsetLeft;
        const downY = e.clientY //- source.offsetTop;
        const relativeTop = sourceRect.top - innerRect.top - this.convertPx(this.itemStyle.top,this.rectStyle.height)
        const innerRectId = this.$parent.$el.getAttribute('id') 
        let _this = this
        function onMousemove(e) {
          // 移动的距离
          let disX = e.clientX - downX
          let disY = e.clientY - downY
          let [side, position] = dotInfo.side.split('-')
          // 是否是top缩放  是否是left缩放
          let hasTop = side === 'top'
          let hasLeft = [side, position].includes('left')

          // top缩放 修改top位置，left缩放 修改left位置
          // 放缩后的值 (..)px
          let width = sourceRect.width + (hasLeft ? -disX : disX)
          let height = sourceRect.height + (hasTop ? -disY : disY)
          let left = sourceRect.left - innerRect.left + (hasLeft ? disX : 0) - (_this.itemStyle.position == "relative" ? 5 : innerRectId=="myScrollbarContentPanel" ? 5 : 0)
          let top = sourceRect.top - innerRect.top + (hasTop ? disY : 0) - (_this.itemStyle.position == "relative" ? relativeTop : innerRectId=="myScrollbarContentPanel" ? 5 : 0)
          // 逆向
          if (width < 0) {
            width = -width
            left -= width
          }
          if (height < 0) {
            height = -height
            top -= height
          }
          // 出界
          left = left > 0 ? left : 0
          top = top > 0 ? top : 0
          // left = left < _this.panelStyle.width - sourceRect.width ? left : _this.panelStyle.width - sourceRect.width
          // top = top < _this.panelStyle.height - sourceRect.height ? top : _this.panelStyle.height - sourceRect.height

          // 四个正方位 上下不改变宽度 左右不改变高度
          if (!position) {
            if (['top', 'bottom'].includes(side)) {
              width = sourceRect.width
            } else {
              height = sourceRect.height
            }
          }

          //三种类型：(..)px (..)% (..)vh
          // width = _this.convertOldunit(_this.itemStyle.width, width, _this.rectStyle.width)
          // height = _this.convertOldunit(_this.itemStyle.height, height, _this.rectStyle.height)
          left = _this.convertOldunit(_this.itemStyle.left, left, _this.rectStyle.width)
          top = _this.convertOldunit(_this.itemStyle.top, top, _this.rectStyle.height)
          switch (_this.itemStyle.width.match(/[\D]+/g)[0]) {
            case 'px' : width = Math.floor(width) + 'px';break;
            case '%': width = Math.floor((width / _this.rectStyle.width)*100) + '%';break;
            case 'vw': width = Math.floor((width / window.innerWidth)*100) + 'vw';break;
            case 'vh': width = Math.floor((width / window.innerHeight)*100) + 'vh';break;
            default: width = Math.floor(width) + 'px';
          }
          switch (_this.itemStyle.height.match(/[\D]+/g)[0]) {
            case 'px': height = Math.floor(height) + 'px';break;
            case '%': height = Math.floor((height / _this.rectStyle.height)*100) + '%';break;
            case 'vw': height = Math.floor((height / window.innerWidth)*100) + 'vw';break;
            case 'vh': height = Math.floor((height / window.innerHeight)*100) + 'vh';break;
            default: height = Math.floor(height) + 'px';
          }
          let styleObj = {
            compId: _this.compId,
            data: {
              ..._this.itemStyle,
              width: width,
              height: height,
              top: top,//Math.floor(top) -5 + 'px',
              left: left//Math.floor(left) -5 + 'px',
            }
          }
          _this.$bus.$emit('styleData', styleObj)
         
          // let attributeObj = {
          //   compId: _this.compId,
          //   component: _this.component,
          //   data: {
          //     ..._this.attribute,
          //     top: top,
          //     left: left,
          //   },
          // }
          // _this.$bus.$emit('attributeDataProcess', attributeObj)
        };
        function onMouseup(e) {
          _this.inprocess = false 
          _this.$emit("nodeSavaQueueManager")
          document.removeEventListener('mousemove', onMousemove)
          document.removeEventListener('mouseup', onMouseup)
        };
        document.addEventListener('mousemove', onMousemove)
        document.addEventListener('mouseup', onMouseup)
      },
      // onDotMouseUp(){
      //   this.$el.childNodes.forEach(item => {
      //     if (item.childNodes.length && item.childNodes[0].firstChild.nodeName === 'CANVAS'){
      //         if (this.$parent.hasOwnProperty('fresh'))
      //           this.$parent.fresh();
      //         }else if (this.$parent.$parent.hasOwnProperty('fresh'))
      //           this.$parent.$parent.fresh();
      //         }
      //   })
      // },
      // 旋转
      onRotatetMousedown(e) {
        let _this = this
        if (this.compFocus != this.compId) return //未选中不能旋转
        this.inprocess = true
        this.isShowmenu = false;
        e.stopPropagation()
        e.preventDefault()
        const source = this.$refs[this.shapeId];
        const sourceRect = source.getBoundingClientRect()
        // 旋转中心位置
        const centerX = sourceRect.left + sourceRect.width / 2
        const centerY = sourceRect.top + sourceRect.height / 2
        function onMousemove(e) {
          const diffX = centerX - e.clientX
          const diffY = centerY - e.clientY
          const radians = Math.atan2(diffY, diffX)
          // 计算角度
          let angle = radians * 180 / Math.PI - 90 // 角度
          // source.style.transform = 'rotate(' + angle + 'deg)'
          // source.querySelector(".rkey_menu").style.transform = 'rotate(' + (-angle) + 'deg)'
          // let moveobj = {
          //   comPname: _this.compId.split('-')[0],
          //   id: _this.compId.split('-')[1],
          //   shapeId: _this.shapeId,
          //   left: source.offsetLeft,
          //   top: source.offsetTop,
          //   rotationAngle: Math.floor(angle)
          // }
          // _this.$bus.$emit('moveData', moveobj)
       // let attributeObj = {
          //   compId: _this.compId,
          //   component: _this.component,
          //   data: {
          //     ..._this.attribute,
          //     // top: source.offsetTop,
          //     // left: source.offsetLeft,
          //     rotationAngle: Math.floor(angle)
          //   },
          // }
          // for (let i in attributeObj.data) {
          //   if (attributeObj.data[i].includes && attributeObj.data[i].includes('px')) {
          //     attributeObj.data[i] = attributeObj.data[i].replace('px', '')
          //   }
          // }
          // _this.$bus.$emit('attributeDataProcess', attributeObj)
          let styleObj = {
            compId: _this.compId,
            data: {
              ..._this.itemStyle,
              rotationAngle: Math.floor(angle)
            }
          }
          _this.$bus.$emit('styleData', styleObj)

        }
        const onMouseup = (e) => {
          _this.inprocess = false
          _this.$emit("nodeSavaQueueManager")
          document.removeEventListener('mousemove', onMousemove)
          document.removeEventListener('mouseup', onMouseup)
        }
        document.addEventListener('mousemove', onMousemove)
        document.addEventListener('mouseup', onMouseup)
      },

      // 右键面板 删除
      openMenu(event) {
        event.stopPropagation()
        this.onClick(event)
        let compId = this.compId
        let component = this.component
        let selectedElements = this.selectedElements
        let rightclickInfo = {
          menuId: "menu" + "-" + this.compId,
          position: {
            x: event.clientX,//offsetX + this.$refs[this.shapeId].offsetLeft,
            y: event.clientY //+ this.$refs[this.shapeId].offsetTop,
          },
          menulists: [
            {
              fnName: "rmenuCopy",
              params: { compId, component, event, selectedElements},
              btnName: "复制",
              // shortcutKey:"ctrl+c",
              children: [],
            },
            {
              fnName: "rmenuPaste",
              params: { compId, component, event },
              btnName: "粘贴",
              // shortcutKey:"ctrl+c",
              children: [],
            },
            {
              fnName: "rmenuDelete",
              params: { compId, event },
              btnName: "删除",
              shortcutKey: "delete",
              children: [],
            },
            {
              fnName: "",
              params: { compId, event },
              btnName: "置于顶层",
              children: [
                {
                  fnName: "rmenuTop",
                  params: { compId, event },
                  btnName: "置于顶层",
                  children: [],
                },
                {
                  fnName: "rmenuUp",
                  params: { compId, event },
                  btnName: "上移一层",
                  children: [],
                },
              ],
            },
            {
              fnName: "",
              params: { compId, event },
              icoName: "",
              btnName: "置于底层",
              children: [
                {
                  fnName: "rmenuBottom",
                  params: { compId, event },
                  btnName: "置于底层",
                  children: [],
                },
                {
                  fnName: "rmenuDown",
                  params: { compId, event },
                  btnName: "下移一层",
                  children: [],
                },
              ],
            },
          ],
        };
        this.$emit("openMenu", rightclickInfo);
      },
      // // 选中时键盘事件
      // keyUp(e) {
      //   e.stopPropagation()
      //   this.$emit("keyUp", e, this.compFocus, this.component);
      //   document.removeEventListener('keyup', this.keyUp)
      // },
      // 操作后保存componentData、curIndex+1；
      nodeSavaQueueManager (){
        this.$emit("nodeSavaQueueManager")
      }
    },

  };
</script>
<style lang="scss" scoped>
  .shape {
    -WEBkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    transform: none;
    padding: 5px;
    background-color: transparent;
  }

  .active {
    border: 1px Dashed #adadad!important;
    padding: 4px;
    cursor: move;
  }

  .rotate {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #adadad;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .dot {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #adadad;
    transform: translate(-50%, -50%);
    cursor: se-resize;

    &[data-side*="right"] {
      transform: translate(50%, -50%);
    }

    &[data-side*="bottom"] {
      transform: translate(-50%, 50%);
    }

    &[data-side="bottom-right"] {
      transform: translate(50%, 50%);
    }
  }
</style>