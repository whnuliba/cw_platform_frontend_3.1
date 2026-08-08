<template>
    <div class="dashboard-eq" :style="{height: windowHeight}" ref="dashStatic">
        <div class="head-line">设备运维管理台
            <div><i class="el-icon-full-screen" @click="fullScreen"/></div>
        </div>
        <div class="d-top">
            <DashTopLeft />
            <DashTopRight />
        </div>
        <div class="d-bottom">
                <div class="d-bot-left">
                    <DashBottomLeft/>
                </div>
                <div class="d-bot-table">
                    <DashTable/>
                </div>
        </div>
    </div>
  </template>
  
  <script>
  import DashTopLeft from './components/dashTopLeft'
  import DashTopRight from './components/dashTopRight'
  import DashBottomLeft from './components/dashBottomLeft'
  import DashTable from './components/dashTable'
  
  export default {
    name: 'DashboardEq',
    components: { DashTopLeft, DashTopRight, DashBottomLeft,DashTable },
    data() {
      return {
        currentRole: 'adminDashboard',
        windowHeight: '800px',
      }
    },
    computed: {},
    created() {
        this.windowHeight = `${window.innerHeight - 85}px`;
    },
    mounted() {
        let fullscreen = ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'],
                that = this;
            fullscreen.forEach((item) => {
                window.addEventListener(item, () => that.fullScreenChange(),false);
            })
    },
    methods: {
        fullScreen() {
                let diagramSpan = this.$refs.dashStatic;
                // diagramDiv.style.background = `rgba(212, 239, 255, 1)`;
                this.windowHeight = {
                        height: `${window.screen.height}px`,
                        background: `rgba(212, 239, 255, 1)`,
                    }
                this.getFullScreen(diagramSpan);
            },
            getFullScreen(el) {
                el = el || document.documentElement;
                let rfs = 
                    el.requestFullScreen ||
                    el.webkitRequestFullScreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullScreen,
                    wscript;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                    return;
                }
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    // if (wscript) {
                    // wscript.SendKeys("{F11}");
                    // }
                }
            },
            exitFullScreen(el) {
                el = el || document.documentElement;
                let cfs =
                    el.cancelFullScreen ||
                    el.webkitCancelFullScreen ||
                    el.mozCancelFullScreen ||
                    el.exitFullScreen,
                    wscript;
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                    return;
                }
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    // if (wscript != null) {
                    //     wscript.SendKeys("{F11}");
                    // }
                }
            },
            fullScreenChange() { //监听进入或退出全屏
                let diagramSpan = this.$refs.dashStatic;
                if (document.fullscreenElement) {  // 进入全屏
                        this.getFullScreen(diagramSpan);
                } else {   // 退出全屏
                    this.windowHeight = {
                            height: `${window.innerHeight-150}px`,
                            background: `rgba(212, 239, 255, 1)`,
                        }
                    this.exitFullScreen(diagramSpan);
                } 
            },
    }
  }
  </script>

  <style lang="less" scoped>
    @import "./style/dash-eq.less";
  </style>
  