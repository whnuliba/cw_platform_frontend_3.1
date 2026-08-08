/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: Table + search栏公共组件
*/ 
<template>
  <div class="form-modal-class">
            <div class="search-div">
              <el-form ref="defaultForm.requestData" :inline="true" :model="queryParams.requestData" label-width="75px"
                size="mini">
                <div v-for="(item, index) in tableColumns" :key="'search'+index" style="display: inline">
                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'select'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-select v-model="queryParams.requestData.sqlWhere[0][item.field]" :placeholder="item.title"
                      style="width: 120px" class="filter-item">
                      <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.title" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'datetime'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="queryParams.requestData[item.field]" type="datetime" :placeholder="item.title" style="width: 150"
                      class="filter-item" />
                  </el-form-item>
                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'date'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="queryParams.requestData[item.field]" type="date" :placeholder="item.title" style="width: 150"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'input'" :label="commonI18n(item)"
                    :prop="item.field">
                    <!-- searchobj[item.field] -->
                    <el-input v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 180px"
                      class="input-with-select">
                    </el-input>
                  </el-form-item>
                  <el-dropdown trigger="click" v-if="!item.hide && item.query && item.filter" size="mini">
                    <span class="dropdownicon el-dropdown-link">
                      <svg-icon icon-class="funnel" />
                      <!-- <i class="el-icon-arrow-down"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
               
              </el-form>
              <div class="sear-btn-area">
                  <el-button type="primary" @click="query" size="mini">
                  {{ $t("common.btn.query") }}
                  </el-button>
                  <el-button type="info" @click="reset" size="mini">
                    {{ $t("common.btn.reset") }}
                  </el-button>
                  <el-button type="warning" @click="add" size="mini">
                    {{ $t("common.btn.add") }}
                  </el-button>
              </div>
            </div>
            <el-table   :cell-style="cellStyleFunc"
                        :row-style="rowStyle"
                        :header-cell-style="headerCellStyle"
                        :data="tableData"
                        :default-sort="{prop: onlyTable ? tableColumns[sortNum].field : '', order:'descending'}"
                        @selection-change="selectionChange"
                        @row-click="rowClick"
                        @row-contextmenu="rowContextmenu"
                        @row-dblclick="rowDbclick"
                        border
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column v-for="(ta,i) in tableColumns"
                        :key="'slot'+i"
                        :prop="ta.field"
                        :label="ta.title"
                        :fixed="ta.fixed"
                        :sortable="ta.field==='ctl' ? false : isSort"
                        :width="ta.field === 'address' ? 250 : (ta.field === 'ctl'? 300 : '')">
                        <template slot-scope="scope" >
                            <span v-if="scope.$index === clickRowIndex && ta.type === 'input'">
                              <el-input v-model="scope.row[ta.field]"  :value="scope.row[ta.field]" placeholder="请输入内容">
                              </el-input>   
                            </span>
                            <!-- 操作栏按钮 -->
                            <span v-else-if="ta.field==='ctl' && btnData.length <= 3">
                                <el-button v-for="(cont,c) in btnData" :key="`${c}btn`" @click="controlBtn(scope,cont.key)" type="primary" plain>{{cont.btnName}}</el-button>
                              </span>
                              <span v-else-if="ta.field==='ctl' && btnData.length > 3">
                                <el-dropdown @command="(e)=>controlBtn(scope,e)">
                                    <span class="el-dropdown-link" v-text="'...'"></span>
                                    <el-dropdown-menu  slot="dropdown">
                                        <el-dropdown-item v-for="(dr,a) in btnData" :key="`dropdown${a}`" :command="dr.key" v-text="dr.btnName"/>
                                    </el-dropdown-menu>
                                </el-dropdown>
                              </span>
                              <!-- button End -->
                              <span v-else>{{scope.row[ta.field]}}</span>
                        </template>
                        </el-table-column> 
            </el-table>
            <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="currentChil"
                  :page-sizes="[2, 5, 10, 15]"
                  :limit.sync="pageSizeChil"
                  layout="total, sizes, prev, pager, next"
                  @pagination="(page)=>handleFilter(page)"
              />   
        </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import pagination from '@/components/Pagination';
export default {
  directives: {elDragDialog},
  components: { pagination },
// mixins: [],
  props:  {
            btnData: Array,
            tableAllData: Object,
            tableHeaderData: Object,
            tableColumns: Array,
            tableData: Array,
            onlyTable: {type:Boolean,default:false},
            total: {typr: Number, default: 0},
            current: Number,
            pageSize: Number,
            sortNum: {
              type: Number,
              default: 0
            },
            isSort:{type:Boolean,default:true},

            queryParams: { 
              type:Object,
              default:{
                requestData: {
                  tableName: '',
                  orderBy: '',
                  columns: [],
                  sqlWhere: [],
                }
              }
            },
            searchobj: Object,
            matchobj: Object,
            conditionArr:Array
          },
  watch: {

  },
  computed: {
     
  },
  data() {
    return {
      clickRowIndex: undefined,
      currentChil: this.current,
      pageSizeChil: this.pageSize,
    }
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
      query() {
        this.$emit('query',this.queryParams);  //this.searchobj,this.matchobj
      },
      reset() {
        this.$emit('reset')
      },
      add() {
        //this.$emit('add',this.searchobj,this.matchobj)
      },
      // 行双击事件
      rowDbclick(row, column, event) {
        this.$emit('rowDbclick',row, column, event);
      },
      // 鼠标右键行点击事件
      rowContextmenu(row, column, event) {
        this.$emit('rowContextmenu',row, column, event);
      },
      // 行点击事件
      rowClick(row, column, event) {
          this.$emit('rowClick',row, column, event);
      },
      // 复选框选择事件
      selectionChange(val){
        this.$emit('selectionChange',val);
      },
      // 页码
      handleFilter(page) { 
          console.log(page)
          this.$emit('handleFilter',page) 
      },  
      // 行样式
      rowStyle({row,rowIndex}) {
        if (rowIndex % 2 === 0) {
          let tt = {
            background:'#DCDCDC'
          }
          return tt;
        }
      }, 
      // 单元格样式
      cellStyleFunc({row,column,rowIndex,columnIndex}) {
          let styleObj = { textAlign:'center' }
          return styleObj;
        },
      // 行单元格样式
      headerCellStyle({row, column, rowIndex, columnIndex}){
            let headerStyle = { textAlign:'center' };
            return headerStyle;
        },
      // 操作栏按钮点击事件
      controlBtn(scope,key) {
        console.log(scope,key)
          switch (key) {
              case 'save':
                  if (this.clickRowIndex === scope.$index) {
                     this.clickRowIndex =  null;
                    }
                  break;
              case 'edit':
                  this.clickRowIndex = scope.$index;
                  break;
              default:
                  break;
          }
      },
  }
}
</script>
<style lang="less" scoped>
    .search-div {
      display: flex;
    }
    .sear-btn-area {
      margin: 0 0 0 10px;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
      }
    .el-icon-arrow-down {
        font-size: 12px;
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

  ::v-deep .el-input-group__append {
    width: 18px;
    border: 1px solid #0370AA;
    border-left: none;
    background-color: white;
  }

  //::v-deep .el-input__inner {
  //  padding: 0 10px 0 5px;
  //}

  .input-with-select {}

  .dropdownicon {
    display: inline-block;
    height: 28px;
    border: 1px solid #0370AA;
    border-left: none;
    border-radius: 0 3px 3px 0;
    line-height: 28px;
    margin-right: 10px;
    padding: 0 10px;
  }

  ::v-deep .el-form--inline .el-form-item {
    margin-right: 0;
  }

  ::v-deep .el-input__inner:hover {
    border: 1px solid #0370AA;
  }

  .dropdownicon:hover {
    /* border: 1px solid #DCDFE6; */
    /* border-left: none; */
    cursor: pointer;
  }
</style>
<!-- 如果表格多出一个空白列
移动
th.gutter {
  background-color: #f1f1f1;
  position: absolute;
  height: 100%;
  right: 0;
}
vue 使用 scoped 需要 /deep/ 深度作用
div /deep/ th.gutter {
  display: initial;
} -->
