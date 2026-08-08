<template>
  <div>&nbsp;</div>
</template>

<script>
import iframeMixin from '@/utils/iframes/iframes-mixin'
// 百度
export default {
  name: 'extend-link',
  // 1. 混入指定操作文件
  mixins: [iframeMixin],
  data() {
    // 2. 指定当前页面对应的 iframes id
    return { PAGE_ID: this.$route.meta.origin.id }
  }
}
</script>