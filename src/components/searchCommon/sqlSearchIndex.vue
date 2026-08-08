/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: mySqlSearch栏公共组件
*/ 
<template>
  <div class="form-modal-class">
            <div class="search-div" :style="divHeight ? {height:'0'} : {height:'100%'}">
              <el-form ref="searchObj" :inline="page.searchInline" :model="searchobj" label-width="auto" :size="page.searchSize">
                <div v-for="(item, index) in tableColumns" :key="'search'+index" :style="{display: 'inline',...item.queryWrapStyles}">
                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'select'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-select v-model="searchobj[item.field]" :placeholder="commonI18n(item)"
                      :style="{width:'150px',...item.queryStyles}" class="filter-item">
                      <el-option v-for="(aa,i) in initSelect[item.field]" :key="'aa'+i" :label="aa.label" :value="aa.value">
                      </el-option>
                    </el-select>
                    <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini">
                        <span class="dropdown-icon el-dropdown-link" :title="$t('common.customFilter')">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length">{{ matchobj[item.field] }}</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i">
                                <el-radio v-model="matchobj[item.field]" :label="v.value">{{v.field}}</el-radio>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'datetime'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="searchobj[item.field]" type="datetime" :placeholder="commonI18n(item)" :style="{width:'150px',...item.queryStyles}"
                      class="filter-item" />
                      <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini">
                        <span class="dropdown-icon el-dropdown-link"  :title="$t('common.customFilter')">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length">{{ matchobj[item.field] }}</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                            :label="v.value">{{
                            v.field
                            }}</el-radio></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'date'" :label="commonI18n(item)"
                    :prop="item.field">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="searchobj[item.field]" type="date" :placeholder="commonI18n(item)"  :style="{width:'150px',...item.queryStyles}"
                      class="filter-item">
                    </el-date-picker>
                    <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini">
                        <span class="dropdown-icon el-dropdown-link"  :title="$t('common.customFilter')">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length">{{ matchobj[item.field] }}</span>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'datewithtwopicker'" :label="commonI18n(item)"
                    :prop="item.field">
                    
                    <el-date-picker
                      range-separator="-"
                      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="searchobj['value_start']"
                      type="datetime"
                      :placeholder="commonI18n(item)">
                    </el-date-picker>
                    <span style="text-align: center;width: 100%;display:block">—</span>
                      <el-date-picker
                      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="searchobj['value_end']"
                      type="datetime"
                      :placeholder="commonI18n(item)"> 
                    </el-date-picker>
                   
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'daterange'" :label="commonI18n(item)"
                    :prop="item.field">
                    <div style="margin-right:55px;">
                      <el-date-picker
                      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="searchobj[item.field+':value_start']"
                      type="datetimerange"
                      range-separator="-"
                      :start-placeholder="commonI18n('Start') +' '+commonI18n(item)"
                      :end-placeholder="commonI18n('End')+' '+commonI18n(item)"
                      >
                    </el-date-picker>
                    <!-- <el-dropdown trigger="click" v-if="!item.hide && item.query" size="mini" :disabled="true">
                      <span class="dropdown-icon el-dropdown-link"  title="搜索条件选择">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length">{{ matchobj[item.field] }}</span>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i" :disabled="true"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu> -->
                  <!-- </el-dropdown> -->
                    </div>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'input'" :label="commonI18n(item)"
                    :prop="item.field">
                    <template slot="label">
                       <span>{{commonI18n(item)}}</span>
                    </template>
                    <el-input v-model="searchobj[item.field]" :placeholder="commonI18n(item)" :style="{width:'180px',...item.queryStyles}"
                      class="input-with-select">
                      <i
                      class="el-input__icon"
                      slot="suffix"
                     >
                     <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini">
                        <span class="dropdown-icon el-dropdown-link" :title="$t('common.customFilter')">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length" class="condition-style">{{ matchobj[item.field] }}</span>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                      </i>
                    </el-input>
                   
                    <!-- <el-dropdown trigger="click" v-if="!item.hide && item.query" size="mini">
                        <span class="dropdown-icon el-dropdown-link"  title="搜索条件选择">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length" class="condition-style">{{ matchobj[item.field] }}</span>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                  </el-form-item>


                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'user'" :style="{width:'180px',...item.queryStyles}"
                    :prop="item.field">
                    <template slot="label">
                       <span>{{commonI18n(item)}}</span>
                    </template>
                    <el-input v-model="searchobj[item.field]" :placeholder="commonI18n(item)" :style="{width:'180px',...item.queryStyles}"
                      class="input-with-select">
                      <i
                      class="el-input__icon"
                      slot="suffix"
                     >
                     <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini">
                        <span class="dropdown-icon el-dropdown-link" :title="$t('common.customFilter')">
                            <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                            <span v-else="matchobj[item.field].length" class="condition-style">{{ matchobj[item.field] }}</span>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                          :label="v.value">{{
                          v.field
                          }}</el-radio></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                      </i>
                    </el-input>
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'textarea'" :label="commonI18n(item)"
                    :prop="item.field">
                      <template slot="label">
                        <span>{{commonI18n(item)}}</span>
                      </template>
                      <div>
                         <el-input type="textarea" v-model="searchobj[item.field]" :placeholder="commonI18n(item)" :style="{width:'180px',...item.queryStyles}"
                        class="input-with-select"/>
                          <el-dropdown trigger="click" v-if="!item.hide && item.query && item.showIf" size="mini" :style="{alignContent:'center',height:'48px'}">
                              <span class="dropdown-icon el-dropdown-link"  :title="$t('common.customFilter')">
                                  <svg-icon icon-class="funnel" v-if="!matchobj[item.field]"/>
                                  <span v-else="matchobj[item.field].length" class="condition-style">{{ matchobj[item.field] }}</span>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(v, i) in conditionArr" :key="'drop'+i"><el-radio v-model="matchobj[item.field]"
                                    :label="v.value">{{
                                    v.field
                                    }}</el-radio></el-dropdown-item>
                              </el-dropdown-menu>
                          </el-dropdown>
                      </div>
                     
                  </el-form-item>

                  <el-form-item v-if="!item.hide && item.query && item.queryType === 'switch'" :label="commonI18n(item)"
                    :prop="item.field">
                      <template slot="label">
                        <span>{{commonI18n(item)}}</span>
                      </template>
                      <div>
                         <el-switch v-model="searchobj[item.field]" :placeholder="commonI18n(item)" active-color="#13ce66"  inactive-color="#ff4949"/>
                      </div>
                  </el-form-item>
                  
                </div>
                <div class="sear-btn-area"  v-if="btnShow||btnAddShow">
                  <el-button type="primary" @click="query" size="mini" v-if="btnShow">
                  {{ $t("common.btn.query") }}
                  </el-button>
                  <el-button type="info" @click="reset" size="mini" v-if="btnShow">
                    {{ $t("common.btn.reset") }}
                  </el-button>
                  <el-button type="warning" @click="add" size="mini" v-if="btnAddShow" :style="btnAddShow ? {marginBottom: '10px'} : {marginBottom: '0'}">
                    {{ $t("common.btn.add") }}
                  </el-button>
                </div>
              </el-form>
            </div>
            
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';

export default {
  directives: {elDragDialog},
  components: {  },
// mixins: [],
  props:  { 
    tableColumns: Array,
    btnShow: {
        type: Boolean,
        default: false
    },
    page:{
      type: Object,
        default: {searchInline:true,searchSize:'mini'}
    },
    btnAddShow: {
        type: Boolean,
        default: false
    },
    initSelect: {
      type: Object,
      default: {}
    },
    // formV: {type:Object, default: ()=>{
    //   return {}
    // }},
    // conditionObj: {type:Object, default: ()=>{
    //   return {}
    // }},
  },
  data() {
    return { 
        SqlCondition: 'none',
        clickTop:'0px',
        clickLeft:'0px',
        divHeight:true,
        queryParams: 
                {
                    requestData: {
                    tableName: '',
                    orderBy: '',
                    columns: [],
                    sqlWhere: [],
                    }
                },
        searchobj: {},
        matchobj: {},
        conditionArr: [
            { field: '包含', value: 'LIKE' },
            { field: '左包含', value: '%LIKE' },
            { field: '右包含', value: 'LIKE%' },
            { field: '等于', value: '=' },
            { field: '大于等于', value: '>=' },
            { field: '大于', value: '>' },
            { field: '小于', value: '<' },
            { field: '小于等于', value: '<=' },
            { field: '不等于', value: '<>' },
            { field: 'IN', value: 'IN' },
          ],
     }
  },
  computed: {
    formVData: function() {
      return this.tableColumns;
    },
  },
  watch: {
    formVData:{
      handler:function(val) {
        let isQuery = val.every(item => !item.query)
        if (isQuery) {
          this.divHeight = true
        } else {
          this.divHeight = false
        }
      },
      deep:true,
      immediate:true,
  }
    
  },
  created() {
  },
  mounted() { 
  },
  beforeDestroy() {},
  methods: {
      query() {
        let tt = [];
        let arrSql = Object.keys(this.searchobj).map(item => {
          if(item.endsWith("value_start")){
                 let field = item.split(":")[0]
                 tt.push({column:field,condition:'>=',value: this.searchobj[item][0]})
                 tt.push({column:field,condition:'<',value: this.searchobj[item][1]})
                 return
          } else {
             if(!this.searchobj[item] || (typeof this.searchobj[item]==='string' && this.searchobj[item].trim()===''))
             {
              return;
             }
                  return {
                    column: item,
                    condition: this.matchobj[item] ? this.matchobj[item] : '',
                    value: this.searchobj[item] ? this.searchobj[item] : ''
                  }
          }
        })
        
        let newSql = [...arrSql,...tt];
        for(let i=0;i<newSql.length;i++) {
          let item = newSql[i];
          if (!item){
            newSql.splice(i,1)
          }
        }
        //let aa = newSql.every(item => item.column !=="CREATE_TIME" && item.value.length === 0)
        // this.queryParams.requestData.sqlWhere = aa ? [] : newSql;
        this.queryParams.requestData.sqlWhere  =newSql
        if (this.$parent.queryOnsearch) {
          this.$emit('queryOnsearch','a',this.queryParams);
        }
        return this.queryParams.requestData;
        // this.$emit('queryOnsearch',this.queryParams.requestData.sqlWhere); 
      },
      reset() {
        this.searchobj= {};
        this.matchobj= {};
        // this.$emit('reset');
      },
      add() {
        this.$emit('add',this.searchobj,this.matchobj);
      }
  }
}
</script>
<style lang="less" scoped>
    .search-div {
      display: flex;
      /* // position: relative; */
    }
    .sear-btn-area {
      margin: 0 0 0 10px;
      display: inline;
    }
    /* // .el-dropdown-link {
    //     cursor: pointer;
    //     color: #409EFF;
    //   } */
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

/* //   ::v-deep .el-input__inner {
//     padding: 0 10px 0 5px;
//   }
    // .condition-style {
    //    font-size: 10px; 
    //    display:flex;
    //    justify-content: center;
    //    align-items: center;
    // } */
  .input-with-select {}

  .dropdown-icon {
    // display: inline-block;
    height: 28px;
    width: 45px;
    text-align: center;
    /* // border: 1px solid #DCDFE6;
    // border-color: #DCDFE6; */
    color: #606266;
    border-left: none;
    border-radius: 0 3px 3px 0;
    line-height: 27px;
    padding: 3px;
    /* // margin-right: 10px;
    // // font-size: 10px; */
    span{
      margin-right:5px;
    }
    &:hover {
        cursor: pointer;
    }
  }

  ::v-deep .el-form--inline .el-form-item {
    margin-left: 20px !important;
    margin-right: 0;
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__label-wrap {
    margin-left: 0px !important;
  }

  ::v-deep .el-input__inner:hover {
    border: 1px solid #0370AA;
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
