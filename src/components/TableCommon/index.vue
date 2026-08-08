/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: Table公共组件
*/ 
<template>
  <div class="form-modal-class">
            <el-table   :cell-style="cellStyleFunc"
                        :row-style="rowStyle"
                        :header-cell-style="headerCellStyle"
                        :data="tableData"
                        :default-sort="{prop: onlyTable ? tableColumns[sortNum].key : '', order:'descending'}"
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
                        :prop="ta.key"
                        :label="ta.title"
                        :fixed="ta.fixed"
                        :sortable="ta.key==='ctl' ? false : isSort"
                        :width="ta.key === 'address' ? 250 : (ta.key === 'ctl'? 300 : '')">
                        <template slot-scope="scope" >
                            <span v-if="scope.$index === clickRowIndex && ta.type === 'input'">
                              <el-input v-model="scope.row[ta.key]"  :value="scope.row[ta.key]" placeholder="请输入内容">
                              </el-input>   
                            </span>
                            <!-- 操作栏按钮 -->
                            <span v-else-if="ta.key==='ctl' && btnData.length <= 3">
                                <el-button v-for="(cont,c) in btnData" :key="`${c}btn`" @click="controlBtn(scope,cont.key)" type="primary" plain>{{cont.btnName}}</el-button>
                              </span>
                              <span v-else-if="ta.key==='ctl' && btnData.length > 3">
                                <el-dropdown @command="(e)=>controlBtn(scope,e)">
                                    <span class="el-dropdown-link" v-text="'...'"></span>
                                    <el-dropdown-menu  slot="dropdown">
                                        <el-dropdown-item v-for="(dr,a) in btnData" :key="`dropdown${a}`" :command="dr.key" v-text="dr.btnName"/>
                                    </el-dropdown-menu>
                                </el-dropdown>
                              </span>
                              <!-- button End -->
                              <span v-else>{{scope.row[ta.key]}}</span>
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
            isSort:{type:Boolean,default:true}
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
      tt:{
    // 示例数据变量
    //           tableAllData:{    
    //             tableOne: [{
    //                 id:1,
    //                 date: '2016-05-02',
    //                 name: '王小虎1',
    //                 address: '上海市普陀区金沙江路 1518 弄'
    //                 }, {
    //                     id:2,
    //                 date: '2016-05-04',
    //                 name: '王小虎2',
    //                 address: '上海市普陀区金沙江路 1517 弄'
    //                 },],
    //             tableTwo: [{
    //                 id:5,
    //                 date: '2016-05-021',
    //                 name: '王小虎11',
    //                 address: '上海市普陀区金沙江路 111 弄'
    //                 }, {
    //                     id:6,
    //                 date: '2016-05-041',
    //                 name: '王小虎21',
    //                 address: '上海市普陀区金沙江路 1522217 弄'
    //                 },],
    //         },
    //         tableHeaderData:{
    //             headerOne: [
    //             {
    //                 key:'date',
    //                 title:'日期',
    //                 width:100,
    //                 type:'input'
    //             },
    //             {
    //                 key:'address',
    //                 title:'地址',
    //                 width:100
    //             }],
    //             headerTwo: [
    //                 {
    //                     key:'date',
    //                     title:'日期1',
    //                     width:100,
    //                     type:'input1'
    //                 },
    //                 {
    //                     key:'address',
    //                     title:'地址1',
    //                     width:100
    //                 },
    //             ],
    //             },
      }
    }
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
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
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
      }
      .el-icon-arrow-down {
        font-size: 12px;
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
