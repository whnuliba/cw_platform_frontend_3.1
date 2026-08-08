/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 取放货、模态框
*/ 
<template>
  <div class="modal-class">
    <el-dialog
      v-el-drag-dialog
      :visible.sync="modalVisible"
      :title="modalTitle"
      customClass="layPickStyle"
    >
      <!-- 只有Form -->
      <div class="modal-content">
        <el-form
          ref="layPickForm"
          :model="modalTemp"
          :rules="rules"
          label-position="left"
          label-width="100px"
          :close-on-click-modal="false"
        >
          <div class='pick-layout'>
            <div>
              <el-form-item
                v-for="(item,i) in lpColumns"
                :label="commonI18n(item)+ ': '"
                :prop="item.key"
                :key='i'
              >
                <el-input
                  v-if="!item.type"
                  v-model="modalTemp[item.key]"
                  :placeholder="$t('const.pleaseInput')"
                  :type="item.type"
                  :disabled="item.disabled"
                />
                <el-select
                  v-else-if="item.type==='select'"
                  :filterable="true"
                  v-model="modalTemp[item.key]"
                  @change="(val)=>selChanged(val,item.selType)"
                  :placeholder="$t('const.pleaseSelect')"
                  :disabled="item.disabled"
                >
                  <el-option
                    v-for='(sel,i) in locSel[item.selType]'
                    :key="'sel'+i"
                    :label="sel[item.selLabel]"
                    :value="sel[item.selVal]"
                  />
                </el-select>
                <el-date-picker
                  v-else-if="item.type === 'datePicker'"
                  v-model="dateProps"
                  type="datetime"
                />
                <el-radio-group
                  v-model="modalTemp[item.key]"
                  v-else-if="item.type === 'radio'"
                >
                  <el-radio
                    v-for='(rad,i) in forkSelData'
                    :key='i'
                    :label="rad.id"
                  >{{rad.name}}</el-radio>
                </el-radio-group>
                <div
                  v-else-if="item.type === 'none'"
                  :label="item.label"
                ></div>
                <el-input-number
                  v-else-if="item.type === 'numInput'"
                  v-model="modalTemp[item.key]"
                  controls-position="right"
                  @change="handleChange(item.key)"
                  :min="1"
                  :max="50"
                />
              </el-form-item>
            </div>

          </div>
          <!-- 按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="onFinish"
            >{{$t('common.btn.ok')}}</el-button>
            <el-button @click="modalCancel()">{{$t('common.btn.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
export default {
  directives: { elDragDialog },
  props: {
    layModalShow: Boolean,
    stockerlayOrPick: String,
    carryType: Number,
    modalTitle: {
      type: String,
    },
    columns: {
      type: Array,
    },
    dateProps: { type: String },
  },
  watch: {
    stockerlayOrPick: {
      handler(newBtn, oldBtn) {
        //   console.log(newBtn)
        if (newBtn === "run" && this.layModalShow) {
          this.rules = {
            ctrlCode2: [
              { required: true, message: "请选择站台", trigger: "blur" },
            ],
          };
          console.log(newBtn);
          this.lpColumns = [
            {
              key: "locType",
              label: "位置类型",
              type: "select",
              disabled: true,
              selVal: "id",
              selLabel: "name",
              selType: "selOne",
            },
            {
              key: "ctrlCode2",
              label: "选择站台",
              type: "select",
              selVal: "ctrlCode2",
              selLabel: "staName",
              selType: "selTwo",
            },
          ];
        }
        if (newBtn !== "run" && this.layModalShow) {
          console.log(newBtn);
          this.rules = {
            forkNum: [
              { required: true, message: "请选择货叉", trigger: "blur" },
            ],
            ctrlCode2: [
              { required: true, message: "请选择站台", trigger: "blur" },
            ],
          };
          this.lpColumns = [
            { key: "forkNum", label: "使用货叉", type: "radio" },
            {
              key: "locType",
              label: "位置类型",
              type: "select",
              selVal: "id",
              selLabel: "name",
              selType: "selOne",
            },
            {
              key: "ctrlCode2",
              label: "选择站台",
              type: "select",
              selVal: "ctrlCode2",
              selLabel: "staName",
              selType: "selTwo",
            },
          ];
        }
      },
      immediate: true,
      deep: true,
    },
    carryType: {
      handler(newT, oldT) {
        if (newT) {
          // 站台数据
          let _data = { url: "/api/Cache/LaneInfo", params: {} };
          this.$store
            .dispatch("fmsCommon/actionWcsPost", _data)
            .then((data) => {
              let laneInfo = data.filter((item) => item.carryType === newT);
              let filterLane =
                laneInfo.length !== 0 && laneInfo[0].hasOwnProperty("laneId")
                  ? laneInfo[0].laneId
                  : false;
              if (filterLane) {
                let dataSta = { url: "/api/Cache/StaInfo", params: {} };
                this.$store
                  .dispatch("fmsCommon/actionWcsPost", dataSta)
                  .then((datas) => {
                    let curSta = datas.filter(
                      (item) => item.laneId === filterLane
                    );
                    console.log(curSta);
                    this.locSel.selTwo = curSta;
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  data() {
    return {
      modalTemp: {
        forkNum: 1,
        locType: 5,
        ctrlCode2: undefined,
        row: undefined,
        list: undefined,
        layer: undefined,
      },
      rules: {
        forkNum: [{ required: true, message: "请选择货叉", trigger: "blur" }],
        ctrlCode2: [{ required: true, message: "请选择站台", trigger: "blur" }],
      },
      activeName: "first",
      modalVisible: false,
      ctrlCodeData: [{ title: "排" }, { title: "列" }, { title: "层" }],
      lpColumns: [
        { key: "forkNum", label: "使用货叉", type: "radio" },
        {
          key: "locType",
          label: "位置类型",
          type: "select",
          selVal: "id",
          selLabel: "name",
          selType: "selOne",
        },
        {
          key: "ctrlCode2",
          label: "选择站台",
          type: "select",
          selVal: "ctrlCode2",
          selLabel: "staName",
          selType: "selTwo",
        },
      ],
      locSel: { selOne: [], selTwo: [] }, // 位置类型下拉数据
      forkSelData: [],
      staSelect: [],
    };
  },
  created() {
    this.selData();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    selData() {
      let _data = {};
      //   货叉数据
      _data = { url: "/api/Const/StockerTaskUseFork", params: {} };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
        .then((data) => {
          this.forkSelData = data;
        })
        .catch((err) => {
          console.error(err);
        });
      // 位置类型数据
      _data = { url: "/api/Cache/locTypes", params: {} };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
        .then((data) => {
          let newData = data.filter((item) => item.id === 4 || item.id === 5);
          this.locSel.selOne = newData;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 计数器input
    handleChange(val) {
      console.log(val);
    },
    // 下拉框改变事件
    selChanged(val, sel) {
      if (this.stockerlayOrPick === "run") {
        return;
      }
      switch (sel) {
        case "selOne":
          if (val === 5) {
            this.rules = {
              forkNum: [
                { required: true, message: "请选择货叉", trigger: "blur" },
              ],
              ctrlCode2: [
                { required: true, message: "请选择站台", trigger: "blur" },
              ],
            };
            this.lpColumns = [
              { key: "forkNum", label: "使用货叉", type: "radio" },
              {
                key: "locType",
                label: "位置类型",
                type: "select",
                selVal: "id",
                selLabel: "name",
                selType: "selOne",
              },
              {
                key: "ctrlCode2",
                label: "选择站台",
                type: "select",
                selVal: "ctrlCode2",
                selLabel: "staName",
                selType: "selTwo",
              },
            ];
          } else {
            this.rules = {
              forkNum: [
                { required: true, message: "请选择货叉", trigger: "blur" },
              ],
              row: [{ required: true, message: "请输入排", trigger: "blur" }],
              list: [{ required: true, message: "请输入列", trigger: "blur" }],
              layer: [{ required: true, message: "请输入层", trigger: "blur" }],
            };
            this.lpColumns = [
              { key: "forkNum", label: "使用货叉", type: "radio" },
              {
                key: "locType",
                label: "位置类型",
                type: "select",
                selVal: "id",
                selLabel: "name",
                selType: "selOne",
              },
              { key: "ctrlCode2", label: "选择货位", type: "none" },
              { key: "row", label: "排", type: "numInput" },
              { key: "list", label: "列", type: "numInput" },
              { key: "layer", label: "层", type: "numInput" },
            ];
          }

          break;
        default:
          break;
      }
    },
    modalCancel() {
      this.modalVisible = false;
      this.$nextTick(() => {
        this.$refs["layPickForm"].clearValidate();
      });
      this.$emit("layModalFunc");
    },
    modalOpen() {
      this.modalTemp = {
        forkNum: 1,
        locType: 5,
        ctrlCode2: undefined,
        row: undefined,
        list: undefined,
        layer: undefined,
      };
      this.modalVisible = true;
      this.$nextTick(() => {
        this.$refs["layPickForm"].clearValidate();
      });
    },
    onFinish() {
      this.$refs["layPickForm"].validate((valid) => {
        if (valid) {
          let params = {};
          if (this.stockerlayOrPick === "run") {
            // 行走
            params = {
              ...this.modalTemp,
              carryType: this.carryType,
              forkNum: 1,
            };
          } else {
            // 取放货
            if (this.lpColumns.length === 3) {
              params = {
                ...this.modalTemp,
                carryType: this.carryType,
              };
            } else {
              let { row, list, layer } = this.modalTemp;
              let newRow = row < 10 ? "0" + row : row;
              let newolumn = list < 10 ? "00" + list : "0" + list;
              let newLayer = layer < 10 ? "0" + layer : layer;
              params = {
                ...this.modalTemp,
                ctrlCode2: `${newRow}${newolumn}${newLayer}`,
                carryType: this.carryType,
              };
            }
          }
          delete params.row;
          delete params.list;
          delete params.layer;
          delete params.locType;
        //   console.log(params);
          let _data = {};
          switch (this.stockerlayOrPick) {
            case "pick": // 取货
              _data = {
                url: "/api/Stocker/PickStocker",
                params: { data: params },
              };
              this.$store
                .dispatch("fmsCommon/actionWcsPost", _data)
                .then((data) => {
                  console.log(data);
                })
                .catch((err) => {
                  console.error(err);
                });
              break;
            case "lay": // 放货
              _data = {
                url: "/api/Stocker/LayStocker",
                params: { data: params },
              };
              this.$store
                .dispatch("fmsCommon/actionWcsPost", _data)
                .then((data) => {
                  console.log(data);
                })
                .catch((err) => {
                  console.error(err);
                });
              break;
            case "run": // 行走
              _data = {
                url: "/api/Stocker/RunStocker",
                params: { data: params },
              };
              this.$store
                .dispatch("fmsCommon/actionWcsPost", _data)
                .then((data) => {
                  console.log(data);
                })
                .catch((err) => {
                  console.error(err);
                });
              break;
            default:
              break;
          }
          this.modalVisible = false;
        } else {
          return false;
        }
      });
    },
    handleClick() {},
  },
};
</script>
<style lang="less" scoped>
// ::deep.el-radio__inner{
//   width: 14px !important;;
// } 
.layPickStyle {
  height: 30% !important;
}
</style>
