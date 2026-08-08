<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">


      
      <!-- 刷新页签 -->
     
      <!-- <div>
      <keep-alive>
        <router-view v-if="!$route.meta.noCache" :key="key" />
      </keep-alive>
      <router-view v-if="$route.meta.noCache" :key="key" /> 
     </div> -->
      <keep-alive :include="cachedViews">
        <router-view   :key="key" />
      </keep-alive>

      <!-- 刷新页签 -->
      <!-- <keep-alive :include="['multiLevelMenu',...cachedViews]"> -->
      <!-- <keep-alive :max="20">
        <router-view :key="$route.fullPath" />
      </keep-alive> -->
      <!-- <keep-alive>
        <router-view :key="key" />
      </keep-alive> -->
    </transition>


     <Iframes v-if="iframesEnable" />
  </section>
</template>

<script>
import { IFRAMES_ENABLE } from '@/utils/iframes/iframes-config'
export default {
  name: 'AppMain',
    components: {
    Iframes: () => import('./Iframes')
  },
    data() {
    return {
      iframesEnable: IFRAMES_ENABLE
    }
  },
  // created(){
  //   console.log(222,this,this.$route)
  // },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
