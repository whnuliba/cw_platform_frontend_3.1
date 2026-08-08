/*
* @CreatAuthor: xwt
* @UpdateAuthor: (...)
* @Description: 条件过滤公共组件
*/
<template>
  <div class="container" >
      <CwDialog @handleClose="handleFieldClose" :dialogVisible="dialogVisible" :title="'条件过滤器'">
        <template slot="body">
          <div class="table_header" :style="{marginBottom: '5px'}">
            <el-tooltip effect="dark" content="新增" placement="top">
              <el-button @click="handleAdd()" size="mini" icon="el-icon-plus" plain />
            </el-tooltip>
            <el-tooltip effect="dark" content="重置" placement="top">
              <el-button @click="handleReset()" size="mini"  icon="el-icon-refresh-left" plain />
            </el-tooltip>
            <el-tooltip effect="dark" content="提交" placement="top">
              <el-button @click="handleSubmit()" size="mini" icon="el-icon-check" plain />
            </el-tooltip>
          </div>
    <!-- 数组 -->
    <div class="cw-field-fiter">
    <el-table :data="tableData" border :height="proheight ? proheight : 300" style="width: 100%">
      <el-table-column key="column" prop="column" label="字段名"  min-width="120" align="left">
        <template slot-scope="scope">
          <el-select v-model="scope.row['column']" filterable placeholder="请选择">
            <el-option v-for="item in tableColumns" :key="item.index" :label="item.title" :value="item.field" :disabled="item.disabled"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column key="condition" prop="condition" label="条件" min-width="100" text-align="left">
        <template slot-scope="scope">
          <span v-for="item in tableColumns" :key="item.index">
            <el-select v-if="scope.row['column'] === item.field && item.queryType !== 'daterange'" v-model="scope.row['condition']" filterable placeholder="请选择">
             <el-option v-for="item in initSelect['condition']" :key="item.index" :label="item.label"
              :value="item.value" />
          </el-select>
          </span>
          
        </template>
      </el-table-column>

      <el-table-column key="value" prop="value" label="值" min-width="200" align="left">
        <template slot-scope="scope">
          <span v-for="item in tableColumns" :key="item.index">
            <span v-if="scope.row['column'] === item.field && item.queryType == 'input'">
              <el-input v-model="scope.row['value']" placeholder="请输入">
              </el-input>
            </span>
            <span v-else-if="scope.row['column'] === item.field && item.queryType === 'select'" style="display: flex">
              <el-select v-model="scope.row['value']" filterable placeholder="请选择">
                <el-option v-for="i in initSelect[item.field]" :key="i.index" :label="i.label" :value="i.value" />
              </el-select>
            </span>
            <span v-else-if="scope.row['column'] === item.field && item.queryType === 'datetime'">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model:value="scope.row['value']" type="datetime" placeholder="开始时间" />
            </span>
            <span v-else-if="scope.row['column'] === item.field && item.queryType === 'date'">
              <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model:value="scope.row['value']"
                type="date" placeholder="开始时间" />
            </span>
            <span v-else-if="scope.row['column'] === item.field && item.queryType === 'daterange'">
              <el-date-picker
                range-separator="至"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model="scope.row['value_start']"
                type="datetime"
                :placeholder="commonI18n(item)">
               </el-date-picker>
               <span style="text-align: center;width: 100%;display:block">—</span>
                <el-date-picker
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model="scope.row['value_end']"
                type="datetime"
                :placeholder="commonI18n(item)"> 
              </el-date-picker>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column key="ctl" prop="ctl" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button @click="handleDel(scope)" size="mini" type="text" icon="el-icon-delete"
              style="color: #0370aa;" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
        </template>
   
    </CwDialog>

  </div>
</template>

<script>
  import CwDialog from "@/components/Cw/CwDialog"; // waves directive

  export default {
    directives: {},
    components: {CwDialog},
    props: {
      dialogFillterFieldVisible:{
        type: Boolean,
        default:false
      },
      initSelect: Object,   // select转义:lable,value
      tableColumns: Array,  // 字段list：title,field,queryType
      tableData: Array,     // 表格data:column,condition,value
      proheight: Number,    // 表格高度
    },
    computed: {},
    data() {
      return {
        dialogVisible:false
      };
    },
    created() { },
    mounted() {
    },
    beforeDestroy() { },
    watch: {
      dialogFillterFieldVisible(val){
            this.dialogVisible = val
      },
      tableData: {
        handler: function (val, oldVal) {
          // 选择column不重复
          this.tableColumns.forEach(column => {
            column.disabled = false
            val.forEach(i => {
              if (i.column == column.field)
                column.disabled = true
            })
          })
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      handleFieldClose() {
        this.$emit('handleClose',false)
      },
      // 增加一行
      handleAdd() {
        var newValue = {};
        this.tableData.push(newValue);
      },
      // 移除一行
      handleDel(row) {
        this.tableData.splice(row.$index, 1);
      },
      // 重置
      handleReset() {
        this.tableData.length = 0;
        this.handleSubmit();
      },
      // 提交
      handleSubmit() {
        let whereArr = []
        this.tableData.forEach(item =>{
            if(item.column){
              if(item.value){    
                  whereArr.push({column:item.column,condition:item.condition||'=',value:item.value})
              }
             if(item.value_start){
                  whereArr.push({column:item.column,condition:'>=',value:item.value_start})
              }
             if(item.value_end){
                  whereArr.push({column:item.column,condition:'<',value:item.value_end})
              }
            }
        })
        this.$emit("submitItem", whereArr);
      },
    },
  };
</script>
<style lang="less" scoped>
  .container {
    .table_header {
        text-align: right;
        margin-bottom: 10px;
        margin-top: -20px; 
      }
    

    /deep/.cell{
      line-height: 30px;
    }

    /deep/.el-date-editor.el-input {
      width: 100%;
    }

    /deep/.el-input__inner {
      height: 100%;
      border-color: transparent;
    }

    /deep/.el-select {
      width: 100%;
      height: 30px;

      .el-select__caret {
        line-height: 30px;
      }

      .el-input--medium {
        height: 100%;
        line-height: 30px;
      }
    }

    /deep/ .el-input__icon {
      height: 100%;
      line-height: 30px;
    }

    /deep/ .cw-field-fiter td{
      padding: 0 !important;
    }
    /deep/.el-date-picker {
      width: 100%;
      height: 30px;

      .el-input__icon {
        line-height: 30px;
      }

      .el-input--medium {
        height: 100%;
        line-height: 30px;
      }
    }
  }
</style>