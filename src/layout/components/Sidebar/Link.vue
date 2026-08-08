<template>
  <component :is="type" v-bind="linkProps(to)" v-on:click="handerClick(route_data.route_data,to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { useRouter } from 'vue-router'
export default {
  props: {
    route_data: {
      type: Object,
      required: false
    },
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      } 
      else if(this.route_data && this.route_data.route_data && "_blank"=== this.route_data.route_data.href){
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    handerClick(route,to){ 
      if(route && "_blank"=== route.href){
        const  {href}= this.$router.resolve(to)
        window.open(href, "_blank");
      }
    },
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
