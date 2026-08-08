/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: Table公共组件
*/ 
<template>
  <div class="form-modal-class my_inner_table_class">
            <el-table   
                        :cell-style="cellStyleFunc"
                        :row-style="rowStyle"
                        :header-cell-style="headerCellStyle"
                        :data="tableData"
                        :stripe = "false"
                        :default-sort="{prop: onlyTable ? tableColumns[sortNum].key : '', order:'descending'}"
                        @selection-change="selectionChange"
                        @row-click="rowClick"
                        @row-contextmenu="rowContextmenu"
                        @row-dblclick="rowDbclick"
                        border
                        :height="proheight ?  proheight : 330"
                        style="width: 100%"
                      >
                        <el-table-column
                          type="selection"
                          width="55"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column v-for="(ta,i) in tableColumns"
                            :key="'slot'+i"
                            :prop="ta.key"
                            :label="ta.title"
                            :fixed="ta.fixed"
                            :sortable="ta.key==='ctl' ? false : isSort"
                            :width="ta.key === 'address' ? 250 : (ta.key === 'ctl'? 200 : ta.width)">
                            <template slot-scope="scope" >
                                <!-- <el-form-item :prop="ta.key" v-if="ta.type === 'input'" :rules="rules[ta.key]">
                                  <el-input  v-model="scope.row[ta.key]"  :placeholder="`请输入${ta.title}`"></el-input>
                                </el-form-item> -->
                                <!-- form表格 -->
                                <span v-if="ta.type === 'input'">
                                  <el-input @focus="focuschange(ta,scope)" v-if="ta.key === 'elString'" v-model="scope.row[ta.key]" :disabled=" (ta.key === 'elString' && scope.row['hasEl']===2) ? true :
                                  ((standardUseState === '启用' || standardUseState === '禁用') ? true : false)">
                                  </el-input>   
                                  <el-input  v-else-if="ta.key === 'checkValue'" v-model="scope.row[ta.key]" :disabled=" (ta.key === 'checkValue' && scope.row['hasEl']===1) ? true : false">
                                  </el-input>   
                                  <el-input v-else
                                   @focus="ta.focus ? focuschange : ''"
                                   v-model="scope.row[ta.key]"
                                   :disabled=" ((standardUseState === '启用' || standardUseState === '禁用') ? true : false)"
                                    ref="inputRef"
                                    :id="'inputRef'+scope.$index+'2'"
                                   @keyup.native="()=>keyupNative($event, scope.$index, 2)" 
                                  >
                                  </el-input>  
                                </span>
                                <span v-else-if="ta.type === 'text'">
                                    {{scope.row[ta.key]}}
                                 </span>
                                <span v-else-if="ta.type === 'finput'">
                                   
                                  <el-input   @focus="focuschange(ta,scope)" v-model="scope.row[ta.key]" :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false||(scope.row.valType=='textarea' || scope.row.valType=='date')">
                                  </el-input>  
                                </span>
                            
                                <span v-else-if="ta.type === 'switch'">
                                    <el-switch
                                        @change="switchChange"
                                        :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false"
                                        v-model="scope.row[ta.key]"
                                        active-text="是"
                                        inactive-text="否"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        :active-value="1"
                                        :inactive-value="2">
                                    </el-switch>
                                </span>
                                <span v-else-if="ta.type === 'engswitch'">
                                    <el-switch
                                        @change="switchChange"
                                        :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false"
                                        v-model="scope.row[ta.key]"
                                        active-text="是"
                                        inactive-text="否"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="Y"
                                        inactive-value="N">
                                    </el-switch>
                                </span>
                                <span v-else-if="ta.type === 'select'" style="display :flex">
                                  <el-select v-model="scope.row[ta.key]"  :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false" 
                                  @change="(a)=>{changeSele(a,scope,ta.key)}" placeholder="请选择">
                                    <el-option v-for="it in initSelect[ta.key]"
                                              :key="it.value"
                                              :label="it.name"
                                              :value="it.value">
                                    </el-option>
                                  </el-select>
                                </span>
                                <span v-else-if="ta.key === 'checkValue' && (scope.row.valType == 'textarea' || !scope.row.valType)" style="position: relative;">
                                  <div v-if="scope.row.isRequire == 'Y'" class="redrequired1"></div>
                                  <el-input @keyup.native="()=>keyupNative($event, scope.$index, 1)" :id="'inputRef'+scope.$index+'1'" style="padding: 0;" v-model="scope.row[ta.key]" :width="ta.width" :disabled=" (ta.key === 'checkValue' && scope.row['hasEl']===1) ? true : false"></el-input>  
                                  <div v-if="scope.row[ta.key]&&scope.row.limitDown&&scope.row.limitUp&&(Number(scope.row.checkValue)<Number(scope.row.limitDown)||Number(scope.row.checkValue)>Number(scope.row.limitUp))" class="warncontent" >不在范围内</div>
                                </span>
                                <span v-else-if="ta.key === 'checkValue' && scope.row.valType == 'select'" style="position: relative;">
                                  <div v-if="scope.row.isRequire == 'Y'" class="redrequired"></div>
                                  <el-select @keyup.native="()=>keyupNative($event, scope.$index, 1)" :id="'inputRef'+scope.$index+'1'" v-model="scope.row[ta.key]"  :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false" 
                                  @change="(a)=>{checkValuechangeSele(a,scope)}" placeholder="请选择">
                                    <el-option v-for="it in scope.row.valSet"
                                              :key="it.value"
                                              :label="it.name"
                                              :value="it.value">
                                    </el-option>
                                  </el-select>
                                  <div v-if="scope.row[ta.key]&&scope.row.presetValue&&(scope.row.presetValue!=scope.row[ta.key])" class="warncontent" >不匹配</div>

                                </span>
                                <span v-else-if="ta.key === 'checkValue' && scope.row.valType == 'date'" style="position: relative;">
                                  <div v-if="scope.row.isRequire == 'Y'" class="redrequired"></div>
                                  <el-date-picker @keyup.native="()=>keyupNative($event, scope.$index, 1)" :id="'inputRef'+scope.$index+'1'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="(standardUseState === '启用' || standardUseState === '禁用') ? true : false"  v-model="scope.row[ta.key]"  type="datetime" > </el-date-picker>

                                </span>

                                <span v-else-if="ta.type === 'sinput'" >
                                  <el-input v-model="scope.row[ta.key]" :disabled="spcdisabled">
                                  </el-input>  
                                </span>
                               
                                <!-- 操作栏按钮 -->
                                  <span v-else-if="ta.key==='ctl' && btnData.length <= 3 && standardUseState !== '启用' && standardUseState !== '禁用'" :style="{textAlign: 'center'}">
                                    <el-button v-for="(cont,c) in btnData" :key="`${c}btn`" @click="controlBtn(scope,cont.key)" :disabled="cont.btndisabled "
                                     :type="cont.key==='dele'? 'danger': 'primary'" 
                                     >
                                     {{cont.btnName}}
                                    </el-button>
                                  </span>
                                  <span v-else-if="ta.key==='ctl' && btnData.length > 3">
                                    <el-dropdown @command="(e)=>controlBtn(scope,e)">
                                        <span class="el-dropdown-link" v-text="'...'"></span>
                                        <el-dropdown-menu  slot="dropdown">
                                            <el-dropdown-item v-for="(dr,a) in btnData" :key="`dropdown${a}`" :command="dr.key" v-text="dr.btnName"/>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                  </span>
                                  <span v-else-if="standardUseState === '启用' || standardUseState === '禁用'">{{standardUseState}}</span>
                                  <!-- 纯文本 -->
                                  <span v-else>{{scope.row[ta.key]}}</span>
                            </template>
                        </el-table-column> 
            </el-table>
            <!-- <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="currentChil"
                  :page-sizes="[2, 5, 10, 15]"
                  :limit.sync="pageSizeChil"
                  layout="total, sizes, prev, pager, next"
                  @pagination="(page)=>handleFilter(page)"
              />    -->
        </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import pagination from '@/components/Pagination';
import Sortable from 'sortablejs';
export default {
  directives: {elDragDialog},
  components: { pagination },
// mixins: [],
  props:  {
            initSelect: Object,
            standardUseState: String,
            modalObj: Object,
            btnData: Array,
            tableAllData: Object,
            tableHeaderData: Object,
            tableColumns: Array,
            tableData: Array,
            proheight: Number,
            onlyTable: {type:Boolean,default:false},
            total: {typr: Number, default: 0},
            current: Number,
            pageSize: Number,
            isRowDrop:{type:Boolean,default:false},
            sortNum: {
              type: Number,
              default: 0
            },
            isSort:{type:Boolean,default:true},
            rules: Object,
            rowHeight: String,
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
      spcdisabled:false,
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(()=>{
        setTimeout(()=>{
          this.rowDrop();
        },100)
      })
  },
  beforeDestroy() {

  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
      // calcFunc() {
      //   this.$refs['modalObj'].validate((valid) => {
      //         if (valid) {
      //             console.log('done')
      //         }else {
      //           this.$message({
      //             type: 'error',
      //             message: 'ref编码为空不能计算!'
      //           });
      //         }
      //       });
      // },
      switchChange(val) {
            this.$emit('swChange',val)
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
      keyupNative($event, scope, val){
        this.$emit('keyupNative',$event, scope, val);
      },
      // 页码
      handleFilter(page) { 
          this.$emit('handleFilter',page) 
      },  
      // 行样式
      rowStyle({row,rowIndex}) {
        // if (rowIndex % 2 === 0) {
        //   let tt = {
        //     background:'#DCDCDC',
        //     height: this.rowHeight
        //   }
        //   return tt;
        // }
      }, 
      // 单元格样式
      cellStyleFunc({row,column,rowIndex,columnIndex}) {
          let styleObj = { textAlign:'center',height: '15px !important' }
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
                  this.$emit('saveItem',scope,key)
                  break;
              case 'edit':
                  this.clickRowIndex = scope.$index;
                  break;
              case 'dele':
                  this.$emit('deleItem',scope,key)
                  break;
              default:
                  break;
          }
      },
      checkValuechangeSele(val,scope) {
        this.$bus.$emit('changeSeleemit',val,scope)
        if(val!=scope.row.presetValue){
          document.getElementById('inputRef'+scope.$index+'1').style.borderColor = 'red'
        }else{
          document.getElementById('inputRef'+scope.$index+'1').style.borderColor = '#DCDFE6'
        }
      },
      changeSele(val,scope) {
        this.$bus.$emit('changeSeleemit',val,scope)
        // if(key === 'valType' && val==='select'){
        // console.log(val)
        //   this.spcdisabled = true
        // }
      },
      focuschange(val,scope) {
        this.$bus.$emit('focuschangemit',val,scope)
      },
     //拖拽生产索引
     rowDrop() {
      if(!this.isRowDrop)
         return;
      const tbody = document.querySelector('.my_inner_table_class .el-table__body-wrapper tbody')
      const _this = this
       let drop = Sortable.create(tbody, {
        onStart:()=>{
       
        },
        onEnd: ({ newIndex, oldIndex }) => {

          //判断是后拖还是前拖
          const currRow = this.tableData.splice(oldIndex, 1)[0]
          //console.log(newIndex,oldIndex,currRow)
          this.tableData.splice(newIndex, 0, currRow)
          let arr = []
          let _data = [];
          this.tableData.forEach((item,index)=>{
            item.itemIndex = index+1
            arr.push({itemIndex:item.itemIndex,id:item.id,name:item.itemName})
           // _data.push(item)
          })
          //console.log(arr)
          //this.tableData = _data
          this.$emit('tableSort',arr)
        }
      })
   
      // Sortable.create(tbody, {
      //   onEnd({ newIndex, oldIndex }) {
      //     const currRow = _this.menuTmpTableData.splice(oldIndex, 1)[0]        
      //     _this.menuTmpTableData.splice(newIndex, 0, currRow)
      //     _this.renderTable!=_this.renderTable
      //     //_this.getMenuTableData(_this.currPraentNodeId)
      //     _this.tableData = _this.menuTmpTableData
      //      _this.renderTable!=_this.renderTable
      //     console.log(_this.currPraentNodeId)
          
      //   }
      // })
    },
  }
}
</script>
<style lang="less" scoped>
.form-modal-class {
  /deep/.el-date-editor.el-input{
    width: 100%;
    
  }
  /deep/.el-select{
    width: 100%;
    height: 23px;
    .el-select__caret{
      line-height: 23px;
    }
    .el-input--medium{
      height: 100%;
      line-height: 23px;
      .el-input__inner{
        height: 100%;
      }
    }
  }
  .el-input--medium /deep/.el-input__inner {
    height: 23px;
    line-height: 23px;
  }
    .el-button--primary.is-plain {
      color: #1890ff;
      background: #e8f4ff;
      border-color: #a3d3ff;
      height: 23px;
      line-height: 2px;
      &:hover {
        background:#1890ff;
        color: #fff;
      }
  }

  .el-button--danger.is-plain {
      color: #ff4949;
      background: #ffeded;
      border-color: #ffb6b6;
      height: 23px;
      line-height: 2px;
      &:hover {
        background:#ff4949;
        color: #fff;
      }
  }
}
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
      .redrequired{
        width: 5px;
        height: 5px;
        position: absolute;
        top:15%;
        left: -5px;
        border-radius: 50%;
        background-color: red;
      }
      .redrequired1{
        width: 5px;
        height: 5px;
        position: absolute;
        top:11%;
        left:-5px;
        border-radius: 50%;
        background-color: red;
      }
      .warncontent{
        text-align: left;
        top:11%;
        left: -3%;
        border-radius: 50%;
        font-size:10px;
        color: red;
      }
      .el-date-editor{
        /deep/.el-input__prefix{
          top:-6px
        }
        /deep/.el-input__suffix{
          top:-6px
        }
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
