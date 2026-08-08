<template>
  <el-select size="none" ref="select" v-bind="$attrs" v-on="$listeners" @change="onchange">
    <slot name="prefix" slot="prefix"></slot>
    <slot name="option-content">
      <template v-for="(item, index) in options">
        <el-option-group
          v-if="item[CwProps.options] && item[CwProps.options].length > 0"
          :key="index"
          :label="item[CwProps.label]"
          :disabled="item[CwProps.disabled]"
        >
          <el-option
            v-for="(option, subIndex) in item[CwProps.options]"
            :key="subIndex"
            :label="option[CwProps.label]"
            :value="option[CwProps.value]"
            :disabled="option[CwProps.disabled]"
          ></el-option>
        </el-option-group>
        <el-option
          v-else-if="!item[CwProps.options] && !$scopedSlots.option"
          :key="index + 'si'"
          :label="item[CwProps.label]"
          :value="item[CwProps.value]"
          :disabled="item[CwProps.disabled]"
        ></el-option>
        <el-option
          v-else-if="!item[CwProps.options] && $scopedSlots.option"
          :key="index + 'sl'"
          :label="item[CwProps.label]"
          :value="item[CwProps.value]"
          :disabled="item[CwProps.disabled]"
        >
            <slot name="option" :item="item"></slot>
        </el-option>
        
      </template>
    </slot>
  </el-select>
</template>

<script>
export default {
  name: "selectCommon",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
   
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    keyValue: {
      type: String,
      default: "select-single",
    },
    align: {
      type: String,
      default: "center",
    },
    itemStyle: {
        type: Object,
        default: () => {
          return { }
        }
    },
  },
  data() {
    return {};
  },
  mounted() {
    for (let i in this.itemStyle) {
      this.$refs.select.$children[0].$el.style[i] = this.itemStyle[i]
    }
  },
  computed: {
    CwProps() {
      return {
        label: "label",
        value: "value",
        disabled: "disabled",
        options: "options",
        ...this.props,
      };
    },
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.select.$children[0].$el.style[i] = this.itemStyle[i]
          }
        }
      },
      deep: true
    },
  },
  methods: {

    focus() {
      this.$refs.select.focus();
    },
    blur() {
      this.$refs.select.blur();
    },
    onchange(e) {
      this.$emit("onChange",e);
    },
  
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 100%;
}
::v-deep .el-input__icon {
    line-height: 100%;
}
</style>

