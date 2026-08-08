/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 顶部search栏公共组件
*/ 
<template>
  <div class="select-modal-class">
    <div
      class="selDiv"
      v-for="(item,i) in selectData"
      :key="`sele${i}`"
    >
      <div v-if="item.type==='select'">
        <el-select
          v-model="searchModelData[item.key]"
          filterable
          :placeholder="$t('common.options')+`${item.label}`"
        >
          <el-option
            v-for="(sel,s) in selOptions[item.selType]"
            :key="`op${s}`"
            :label="sel[item.selLabel]"
            :value="sel[item.selVal]"
          >
          </el-option>
        </el-select>
      </div>
      <div v-else-if="item.type==='input' || item.type==='textarea'">
        <el-input
          :placeholder="$t('common.options')+`${item.label}`"
          :type="item.type"
          v-model="searchModelData[item.key]"
        />
      </div>
      <div v-else-if="item.type==='date'">
        <el-date-picker
          v-model="searchModelData[item.key]"
          type="datetimerange"
          range-separator="-"
          :start-placeholder="commonI18n('Start')+commonI18n(item)"
          :end-placeholder="commonI18n('End')+commonI18n(item)"
        />
      </div>
    </div>
    <div class="btnDiv">
      <el-button
        v-for="(btn,i) in searchbtnData"
        :key="`btn${i}`"
        :type="btn.type"
        v-text="btn.label"
        @click="btnClick(btn.key)"
      ></el-button>
    </div>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
export default {
  directives: { elDragDialog },
  components: {},
  // mixins: [],
  props: {
    searchbtnData: Array,
    selectData: Array,
    selOptions: Object,
    searchModelData: Object,
  },
  watch: {},
  computed: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    btnClick(type) {
      switch (type) {
        case "reset":
          this.$emit("searchReset");
          break;
        case "search":
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.select-modal-class {
  display: flex;
  flex-wrap: wrap;
  margin: 5px 0;
  // border:1px solid #cdcdcd;
  // padding: 3px 3px;
  .selDiv > div {
    margin: 0 5px;
  }
}
</style>
