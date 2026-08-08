<template>
  <i v-if="iconClass.includes('el')" v-bind="$attrs" ></i>
  <svg-icon v-else :icon-class="iconClass" v-bind="$attrs" />
</template>
<script>
export default {
  name: 'iconCommon',
  components: {},
  props: {
    iconClass: {
         type: String,
         default: ""
      },
  },
  computed: {},
  data() {
    return {
    };
  },
  mounted() {
  },
  beforeDestroy() { },

  methods: {
  },
  created() {
  }
}
</script>
<style lang="scss" scoped></style>