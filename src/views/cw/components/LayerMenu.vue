<template>
  <div>
      <div v-for="(item, index) in menuData" :key="index">
          <el-submenu :index="item.id" v-if="item.subComponent && item.subComponent.length > 0">
            <template slot="title">
                {{ item.componentText ? item.componentText : item.fieldName }}
            </template>
            <LayerMenu :menuData="item.subComponent"></LayerMenu>
          </el-submenu>
          <el-menu-item :index="item.id" v-else-if="item.subComponent && item.subComponent.length == 0" class="elsemenu">
            <template slot="title">
              {{ item.componentText ? item.componentText : item.fieldName }}
            </template>
            <LayerMenu :menuData="item.subComponent"></LayerMenu>
          </el-menu-item>
          <el-menu-item :index="item.id" v-else>
            <template slot="title">
              {{ item.componentText ? item.componentText : item.fieldName }}
            </template>
          </el-menu-item>
      </div>
  </div>
</template>

<script>
export default {
  name: "LayerMenu",
  props: {
      menuData: {
          type: Array,
          default: () => {
              return [];
          }
      }
  },
  components: {},
  data() {
      return {
        methods:{},
        vueContext:{},
      };
  },
  created() {},
  mounted() {
  },
  methods: {}
};
</script>
<style lang='less' scoped>
/deep/.elsemenu{
  // padding: 0!important;
  .el-submenu__icon-arrow {
  display: none!important;
}
}
/deep/.el-submenu__icon-arrow {
  display: inline!important;
}
/deep/.el-menu-item-group__title {
  padding: 0px;
}
</style>

