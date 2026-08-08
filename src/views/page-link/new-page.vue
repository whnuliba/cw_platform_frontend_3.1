<template>
  <div>&nbsp;</div>
</template>

<script>
// 百度
export default {
  name: 'new-link',
  // 1. 混入指定操作文件
  data() {
    // 2. 指定当前页面对应的 iframes id
    return {
       

    }
  },
  created() {
    let page = this.$route.meta.origin;
    this.closeSelectedTag(this.$route)
    window.open(page.href)
    // this.selectOptions()
  },
  activated(){
    // let page = this.$route.meta.origin;
    // console.log(111,page)
    // window.open(page.href)
    // this.closeSelectedTag(this.$route)
  },
  methods:{
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    }
  }

}
</script>