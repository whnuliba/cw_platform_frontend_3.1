/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 字段checkbox选择条件过滤公共组件
*/
<template>
  <div class="container">
  <CwDialog @handleClose="handleFieldClose" :dialogVisible="dialogVisible" :title="'自定义字段搜索过滤器'">
    <template slot="body">
      <div class="table_header" :style="{marginBottom: '5px'}">
        <el-tooltip effect="dark" content="重置" placement="top">
          <el-button @click="handleReset" size="mini"  icon="el-icon-refresh-left" plain />
        </el-tooltip>
        <el-tooltip effect="dark" content="提交" placement="top">
          <el-button @click="handleSubmit" size="mini" icon="el-icon-check" plain />
        </el-tooltip>
      </div>
        <!-- 字段表 -->
        <div class="cw-field-fiter">
        <el-table ref="mulSelTable" :data="tableData" border :height="proheight ? proheight : 330" style="width: 100%" row-key="getRowKeys"
        :row-class-name="tableRowClassName" @row-click = "rowColumnClick" 
        @selection-change="handleSelectionChange" @select="checkBoxChoose">
          <el-table-column type="selection" :reserve-selection="true" width="50" align="center"/>
          <el-table-column key="'slot' + column" prop="column" label="字段名" align="left">
            <template slot-scope="scope">
              {{tableTextTrans(scope.row['column'])}}
            </template>
          </el-table-column>
        </el-table>
        </div>
    </template>
  </CwDialog>
  </div>
</template>

<script>
  import CwDialog from "@/components/Cw/CwDialog";
  export default {
    directives: {},
    components: {CwDialog},
    props: {
      dialogFillterFieldVisible:{
        type: Boolean,
        default:false
      },
      initSelect: {  // select转义
        type: Object,
        default: function() {
          return {}
        }   
      },
      tableColumns: { // 字段list：title,field,queryType
        type: Array, 
        default: () => []
      }, 
      tableData: {  // 表格data
        type: Array, 
        default: () => []
      }, 
      proheight: Number, // 表格高度
    },
    computed: {},
    data() {
      return {
          selectChooseData: [],
          dialogVisible: false,
          backShowCheckbox: []
      };
    },
    created() {},
    mounted() {},
    beforeDestroy() { },
    watch: {
      tableData: {
        handler: function (val, oldVal) { 
              // console.log(val,oldVal)
        },
        immediate: true,
        deep: true,
      },
      dialogFillterFieldVisible(val){
          let tt = [],_this=this;
          this.tableColumns.forEach((item,i) => {
            if (item.query) {
                tt.push({
                  column: item.field,
                  title: item.title
                })
            }
          })

          this.dialogVisible = val
          this.$nextTick(() => {
            if (val) {
              for (let i = 0; i< this.tableData.length; i++) {
                tt.forEach(item => {
                  if (item.column == this.tableData[i].column) {
                    this.$refs.mulSelTable.toggleRowSelection(this.tableData[i],true);
                  }
                })
              }
             }
              })
      },
    },
    methods: {
      getRowKeys(row) {
        // console.log(row)
      },
      rowColumnClick(selection, row) {
        // this.$refs.mulSelTable.clearSelection();
        this.$refs.mulSelTable.toggleRowSelection(selection)
      },
      tableRowClassName({row, rowIndex}) {
          return 'row-class-name'
      },
      tableTextTrans(tbText) {
          let txt = ''
          this.tableColumns.forEach(item => {
             if (item.field === tbText) {
                txt = item.title
             }
          })
          return txt;
      },
      handleFieldClose() {
          this.$emit('handleClose',false)
      },
      // checkbox框点击事件
      handleSelectionChange(val) {
            this.selectChooseData = val
      },
      checkBoxChoose(selection, row) {
        // console.log('表格select事件',selection, row)
      },
      // 重置
      handleReset() {
        this.$refs.mulSelTable.clearSelection();
        this.handleSubmit(true);
      },
      // 提交
      handleSubmit() {
        this.$emit("submitItem", this.selectChooseData);  //this.tableData
      },
    },
  };
</script>
<style lang="less" scoped>
  .container {
    .table_header {
      text-align: right;
      margin-bottom: 5px;
    }
   /deep/ .el-table-column--selection .cell {
      padding: 0;
   }
    /deep/.el-date-editor.el-input {
      width: 100%;
    }

    /deep/.el-input__inner {
      height: 100%;
      border-color: transparent;
    }
   /deep/ .row-class-name {
      color: #1d418a;
      cursor: pointer;
      background-color: rgba(143, 142, 142,0.4);
    }
   ::v-deep .el-input.is-disabled .el-input__inner {
          background-color: #F5F7FA;
          border-color: #dfe4ed;
          color: #1d418a;
          cursor: not-allowed;
      }
    /deep/ .cw-field-fiter td{
      padding: 0 !important;
    }
    /deep/.el-select {
      width: 100%;
      height: 23px;

      .el-select__caret {
        line-height: 23px;
      }

      .el-input--medium {
        height: 100%;
        line-height: 23px;
      }
    }
  }
</style>