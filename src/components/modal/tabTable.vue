/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: tab-table模态框组件
*/ 
<template>
  <div class="form-modal-class">
            <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="tableModalName" customClass="formStyle">
            <!-------------- 只有表格 --------------->
                <div v-show="onlyTable">
                    <el-table :cell-style="cellStyleFunc"
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
                        :sortable="isSort"
                        :width="ta.key === 'address' ? 250 : 180">
                        <template slot-scope="scope" >
                            <span v-if="scope.$index === clickRowIndex && ta.type === 'input'">
                              <el-input v-model="scope.row[ta.key]"  :value="scope.row[ta.key]" placeholder="请输入内容">
                              </el-input>   
                            </span>
                            <span v-else>{{scope.row[ta.key]}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column   label="操作">
                            <template slot-scope="scope">
                                <el-button v-for="(cont,c) in btnData" :key="`${c}btn`" @click="controlBtn(scope,cont.key)" type="primary" plain>{{cont.btnName}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>   
                </div>
            <!------------------------ Tab标签页码 + 表格 --------------------->
                <div v-show="tabTable">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane 
                            v-for="(pane,i) in tabPaneData" :key="'pane'+i"
                            :label="pane.label"
                            :name="pane.name"
                          >
                            <el-table :cell-style="cellStyleFunc"
                            :header-cell-style="headerCellStyle"
                            :row-style="rowStyle"
                            :data="tableAllData[pane.tableData]"
                            border
                            @selection-change="selectionChange"
                            @row-click="rowClick"
                            @row-contextmenu="rowContextmenu"
                            @row-dblclick="rowDbclick"
                            :default-sort="{prop: tabTable ? tableHeaderData[pane.tableheader][sortNum].key:'', order:'descending'}"
                            style="width: 100%">
                                <el-table-column
                                  type="selection"
                                  width="55">
                                </el-table-column>
                                <el-table-column v-for="(ta,i) in tableHeaderData[pane.tableheader]"
                                :key="'slot'+i"
                                :prop="ta.key"
                                :label="ta.title"
                                :sortable="isSort"
                                :width="ta.key === 'address' ? 250 : 180">
                                <template slot-scope="scope" >
                                    <span v-if="scope.row.id === clickTabRowId && ta.type === pane['type']">
                                        <el-input v-model="scope.row[ta.key]"  :value="scope.row[ta.key]" placeholder="请输入内容">
                                        </el-input>   
                                    </span>
                                    <span v-else>{{scope.row[ta.key]}}</span>
                                </template>
                                </el-table-column>
                                <el-table-column   label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-for="(ctrl,c) in btnData" :key="`${c}btn`" @click="tabControlBtn(scope,ctrl.key)" type="primary" plain>{{ctrl.btnName}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table> 
                             <!-- 表格页码 -->
                            <pagination
                                v-show="total > 0"
                                :total="total"
                                :page.sync="currentChil"
                                :page-sizes="[5, 10, 15, 20]"
                                :limit.sync="pageSizeChil"
                                layout="total, sizes, prev, pager, next"
                                @pagination="(page)=>handleFilter(page, pane.name)"
                            /> 
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-dialog>
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
            tableModalName: String,
            modalTitle:String,
            btnData: Array,
            tabPaneData: Array,
            tableAllData: Object,
            tableHeaderData: Object,
            tableColumns: Array,
            tableData: Array,
            onlyTable: {type:Boolean,default:false},
            tabTable: Boolean,
            total: Number,
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
      clickTabRowId:undefined,
      clickRowIndex: undefined,
      activeName:'first',
      modalVisible: false,
      currentChil: this.current,
      pageSizeChil: this.pageSize,
      innerActiveName:'one',
      tt:{
    // 示例数据变量
    //    tabPaneData:[
    //                 {label:'表1',name:'first',tableData:'tableOne',tableheader:'headerOne',type:'input'},
    //                 {label:'表2',name:'second',tableData:'tableTwo',tableheader:'headerTwo',type:'input1'},
    //             ],
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
        console.log(row, column, event)
        this.$emit('rowDbclick',row, column, event);
      },
      // 鼠标右键行点击事件
      rowContextmenu(row, column, event) {
        console.log(row, column, event)
        this.$emit('rowContextmenu',row, column, event);
      },
      // 行点击事件
      rowClick(row, column, event) {
          console.log(row, column, event)
          this.$emit('rowClick',row, column, event);
      },
      // 复选框选择事件
      selectionChange(val){
        this.$emit('selectionChange',val);
      },
      // 页码
      handleFilter(page,type) { 
          switch(type) {
              case this.tabPaneData[0].name:
                this.$emit('handleFilter',page)
              break;
              case this.tabPaneData[1].name:
                this.$emit('handleFilter1',page)
              break;
              default :
              break;
          }
          
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
      // tab表格按钮点击
      tabControlBtn(scope,key){
          switch (key) {
              case 'save':
                  if (this.clickTabRowId === scope.row.id) {
                     this.clickTabRowId =  null;
                    }
                  break;
              case 'edit':
                  this.clickTabRowId = scope.row.id;
                  break;
              default:
                  break;
          }
      },
      modalCancel() {
        this.modalVisible = false;
      },
      modalOpen() {
        this.modalVisible = true;
      },
      handleClick(tabNum) {
         switch(tabNum.name) {
              case this.tabPaneData[0].name:
                this.$emit('tabOne',tabNum)
              break;
              case this.tabPaneData[1].name:
                this.$emit('tabTwo',tabNum)
              break;
              default :
              break;
          }
      },
  }
}
</script>
<style lang="less" scoped>

     
</style>
