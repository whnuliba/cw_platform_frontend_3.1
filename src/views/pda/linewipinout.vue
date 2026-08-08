<template>
  <div class="app-container pdalayout">
  <div class="filter-container">
    <el-form ref="form" :model="barcode" label-width="80px">
      <el-form-item label="在制品仓:">
        <el-select v-model="barcode.wid" placeholder="请选择" style="width: 150px"   class="filter-item" >
        <el-option
        v-for="item in windingFeedTypeData"
        :key="item.id"
        :label="item.wloc"
        :value="item.id">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="条码:">
        <el-input v-model="barcode.barcode" placeholder="条码" style="width: 150px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" class="filter-item" @click="linewipin">
          {{ '入库' }}
        </el-button>
        <el-button type="primary" class="filter-item" @click="lineWipOut">
          {{ '出库' }}
        </el-button>
       
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import i18n from "@/lang";
export default {
  name: "planInfo",
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未启用",
        1: "启用",
      };
      return statusMap[status];
    },
  },
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    machingPlanId: String,
  },
  data() {
    const _initdata = {
      barcode: {
        wid:'',
        barcode: "",
      },
      windingFeedTypeData:[]
    };

    return _initdata;
  },
  created() {
    this.selectOptions()
  },
  mounted() {
  },
  methods: {
    selectOptions() {
      const _data = {url:'/lineWipWarehouse/getLineWipWarehouseAll'}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
      .then(data => {
        this.windingFeedTypeData = data;
      }).catch(err => {
        console.error(err)
      })
    },
    lineWipOut() {
      const _data = {
        url: "/lineWipWarehouseBarcode/lineWipOut",
        params: this.barcode,
      };
      this.$store
        .dispatch("fmsCommon/actionProductPost", _data)
        .then((data) => {
          this.$message({
            type: "success",
            message: "出库成功",
          });
          this.dialogFormVisible = false;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {});
    },
    linewipin() {
      const _data = {
        url: "/lineWipWarehouseBarcode/lineWipIn",
        params: this.barcode,
      };
      this.$store
        .dispatch("fmsCommon/actionProductPost", _data)
        .then((data) => {
          this.$message({
            type: "success",
            message: "入库成功",
          });
          this.dialogFormVisible = false;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {});
    },
  },
};
</script>

<style scoped>
.pdalayout{
  display: flex;
  justify-content: center;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item {
  margin-left: 3px;
}
.model-factory {
  position: relative;
  width: 500px;
  height: calc(100vh - 120px);
  float: left;
  background: #d4d7d7;
}
.model-workshop {
  width: calc(100% - 505px);
  height: calc(100vh - 120px);
  float: left;
  margin-left: 5px;
  background: #d4d7d7;
}
.el-dialog__body {
  padding: 5px 20px !important;
}
.el-form-item {
  margin-bottom: 8px !important;
}
</style>
