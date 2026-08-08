<template>
  <div>
    <div class="setting_heaf">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabsClick" :stretch="true">
        <el-tab-pane name="panel">
          <span slot="label"><i class="el-icon-magic-stick"></i> 面板属性</span>
          <CwPanelStyle :panelStyle="panelStyle"  />
        </el-tab-pane>
        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-magic-stick"></i> 样式</span>
          <CwStyle :compId="compId"  />
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"><i class="el-icon-finished"></i> 属性</span>
          <CwAttribute :compId="compId"  />

        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label"><i class="el-icon-tickets"></i> 数据</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import i18n from "@/lang";
import CwStyle from "./CwStyle.vue";
import CwAttribute from "./CwAttribute.vue";
import CwPanelStyle from "./CwPanelStyle.vue";
import modules from "./components/loadModule.js";

export default {
  name: 'CwRightArea',
  components: {CwStyle,CwAttribute,CwPanelStyle},
  directives: {},
  filters: {

  },
  props: {
    panelStyle: {
      type: Object,
      default: () => {}
    },
    width: {
      type: Number,
      default: () => { return 1920 }
    },
    height: {
      type: Number,
      default: () => { return 1080 }
    }
  },
  watch: {
    allStyleData: {
      handler: function (newVal, oldVal) {
        if (newVal) {

          
        }
      
      },
      deep: true,
    }
  },
  data() {
    const _initdata = {
      activeName: 'first',
      compId : '',
      shapeId : '',
      allStyleData:{},
      allAttributeData:{},
      itemStyleData:{},
      itemAttributeData:{},
    }
    // Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      // this.$bus.$on('moveData', (val) => {
      //       let obj = JSON.parse(JSON.stringify(val))
      //       this.allAttributeData[obj.shapeId] = obj
      //       this.itemAttributeData = obj
      // })
      this.$bus.$on('compFocusId', (compFocusId) => {
          this.compId = compFocusId
        })
      
        // this.$bus.$on('compshapeId', (shapeId,compFocusRef,compId) => {
        //   this.compId = compId
        //   if(this.allAttributeData[compId]){
        //     this.itemAttributeData = this.allAttributeData[compId]

        //   }else{
        //     let obj = {
        //       comPname:compId.split('-')[0],
        //       id:compId.split('-')[1],
        //       left:compFocusRef.offsetLeft,
        //       top:compFocusRef.offsetTop,
        //     }
        //     this.allAttributeData[compId] = obj
        //     this.itemAttributeData = obj
        //   }
        // })
        
    })
    
  },
  methods: {
    handleTabsClick(tab, event) {
    },
    initData(arr) {
      let args = {}
      arr.map(c => {
        if (c.set) {
          args[c.field] = null
        }
      })
      return args
    },
  }
}
</script>
   
<style lang="less" scoped>
.itemform{
  padding-right: 10%;
}
</style>