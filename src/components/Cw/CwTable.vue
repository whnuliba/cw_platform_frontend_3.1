<template>
  <div ref="commonTable" id="commonTable">
    <div>
    <SqlSearchIndex ref="sqlSearch" v-if="toolBar.showFilterBar===undefined?true:toolBar.showFilterBar" :page="page" :key="keyC" :initSelect="initSelect" :tableColumns="cols" /> 
    <div class="cwtable-tool-bar" v-if="this.toolBar.show" :style="{...toolBar.toolBarStyle}">
      <div class="cwtable-tool-bar-botton" v-if="this.toolBar.show">
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}"  v-ele-show="{btnCode: this.toolBar.fileUploadPerm}"  v-if="this.toolBar.showFileUpload" size='mini' :title="commonI18n(toolBar.documentUpload)" icon="el-icon-upload" @click="fileUploadClick" plain>            
          <span v-if="toolBar.showText">{{(toolBar.documentUpload||false)?commonI18n(toolBar.documentUpload):'文件上传'}}</span>
        </el-button>
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}"  v-ele-show="{btnCode: this.toolBar.excelUploadPerm}"  v-if="this.toolBar.showUpload" size='mini' :title="commonI18n(toolBar.Import)" icon="el-icon-upload2" @click="uploadClick" plain>
          <span v-if="toolBar.showText">{{(toolBar.Import||false)?commonI18n(toolBar.Import):'导入'}}</span>
        </el-button>
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}"  v-ele-show="{btnCode: this.toolBar.excelExportPerm}"  v-if="this.toolBar.showExport" size='mini' :title="commonI18n(toolBar.Export)" icon="el-icon-download" @click="exportClick" plain>
          <span v-if="toolBar.showText">{{(toolBar.Export||false)?commonI18n(toolBar.Export):'导出'}}</span>
        </el-button>
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}"  v-if="this.toolBar.showFilter" size='mini' :title="commonI18n(toolBar.filterText)"  @click="FillterField" plain><svg-icon icon-class="funnel"/>
          <span v-if="toolBar.showText">{{(toolBar.filterText||false)?commonI18n(toolBar.filterText):'筛选'}}</span>
        </el-button>
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}"  v-if="this.toolBar.columnSelectFilter" size='mini' :title="commonI18n(toolBar.customFilterText)" icon="el-icon-s-help"  @click="FilterCustomField" plain>
          <span v-if="toolBar.showText">{{(toolBar.customFilterText||false)?commonI18n(toolBar.customFilterText):'字段筛选'}}</span>
        </el-button>
        <el-button :style="{float: 'right',marginLeft: '5px',...this.toolBar.btnStyles}" v-if="this.toolBar.showSelectField" size='mini' :title="commonI18n(toolBar.fieldSelectionText)" icon="el-icon-document-checked" @click="selectFields" plain>
          <span v-if="toolBar.showText">{{(toolBar.fieldSelectionText||false)?commonI18n(toolBar.fieldSelectionText):'显示字段'}}</span>
        </el-button>
      <el-button  v-for="item in this.toolBar.buttons" :title="(item.hideText||false)?commonI18n(item.text):''" v-if="item.show===undefined?true:item.show"  :style="toolBar.btnStyles?{float: 'right',...toolBar.btnStyles,...item.style}:{float: 'right',...item.style}"  @click="(e)=>{
          if(item.callback && typeof item.callback==='function')
            item.callback.call(self,e,self,boxSelectValue)
        }" 
         :icon="item.icon"
         :size="item.size || 'mini'" 
         v-ele-show="{btnCode: item.permCode}" 
         >
            <span v-if="!item.hideText">{{commonI18n(item.text) }}</span>
      </el-button>
   
      </div>
    </div>
    <div id="table-area" style="position: relative;">
      <div :style="rowInfoDiv" id="testContent" :class='testDiv'>
        <el-card class="box-card">
          <div class="clearfix">
            {{ workInfo }}
          </div>
        </el-card>
      </div>
      <!-- :fit="true" -->
    <el-table v-loading="loadLoading" :data="data" border fit highlight-current-row style="width: 100%"
     @selection-change="handleSelectionChange"
     @select="handleSelect"
     @row-click = "rowClick"
     @select-all = "handleSelectAll"
     @cell-mouse-enter="enterRows"
     @cell-mouse-leave="leaveRows"
     :row-class-name="rowClassNameGet"
     ref="multipleTable"
      @row-dblclick="rowDbClick">
      <el-table-column v-if="toolBar.boxSelectVisible===undefined?true:toolBar.boxSelectVisible"
      type="selection"
      width="40">
      </el-table-column>
      <el-table-column v-if="toolBar.indexVisible===undefined?true:toolBar.indexVisible" width="50px" :label="$t('common.no')" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{ page.listQuery.pageSize*(page.listQuery.current -1) + (scope.$index +1) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="item in cols" :key="item.field" :label="commonI18n(item)" :prop="item.field"
        :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" :show-overflow-tooltip="true">       
          <template slot-scope="{ row }">
            <!-- <ul class="cw-table-ul"  v-if="row[item.field]!=null && row[item.field]!=='' && item.queryType==='list'">
                <li v-for="fn in row[item.field].split(';')" :style="{...item.style}">
                     <a href="javascript:void(0)"  @click="(e)=>{
                          if(item.click && typeof item.click ==='function')
                            {
                              item.click.call(self,e,fn,row)
                            }
                     }"> {{ fn}}</a><i class="el-icon-edit"></i>


                </li>   
            </ul>  -->
            <!--判断是否需要编辑-->
            <div v-if="item.edit && (item.editShow===undefined || (item.editShow && typeof item.editShow==='function' && item.editShow.call(self,row)))">
                <el-input v-if="item.queryType === 'input'" size="mini" :disabled="item.disabled" :readonly="item.readonly" :show-password="item.password" v-model="row[item.field]"  :style="{...item.rowStyle}" />
                <CwUserDropdown  size="mini" v-if="item.queryType === 'user'" :selectRange="item.selectRange|| [300]"  v-model="row[item.field]" :readonly="item.readonly" :disabled="item.disabled" :orgType="item.orgType||300"  :style="{...item.rowStyle}"
                :initValue="row[item.field]!==undefined?row[item.field].split(','):[]"
                :selectColumn="item.selectColumn"
                :radio="()=>{
                  if(item.queryType === 'user' && item.multiple && typeof item.multiple==='function')
                      return item.multiple.call(this,row,item)
                  else if(item.queryType === 'user'  && item.multiple)
                        return false
                    return true
                }"
                @onChange="(result)=>{
                    if(item.queryType === 'user' && item.userChange && typeof item.userChange==='function'){
                        item.userChange.call(self,result,row,item)
                    }
                    
                }"
              ></CwUserDropdown>
              <CwFilterSelectDropdown size="mini"  v-if="item.queryType === 'select-filter'"    v-model="row[item.field]" :disabled="item.disabled"  :readonly="item.readonly" :style="{...item.rowStyle}"
            :initValue="row[item.field]!==undefined?row[item.field].split(','):[]"
            :url="item.url"  
            :lazy="item.lazy"
            :selectColumn="item.modeValue"
            :radio="()=>{
              if(item.queryType === 'select-filter' && item.multiple && typeof item.multiple==='function')
                  return item.multiple.call(this,row,item)
              else if(item.queryType === 'select-filter'  && item.multiple)
                    return false
                return true
            }"

            :loadData="(val,callback)=>{
                if(item.loadData && typeof item.loadData==='function'){
                    item.loadData.call(self,val,item,callback)
                }
            }"

            @onChange="(result)=>{
                if(item.queryType === 'select-filter' && item.onChange && typeof item.onChange==='function'){
                    item.onChange.call(self,result,row,item)
                }   
            }"
          ></CwFilterSelectDropdown>
          <el-select  v-if="item.queryType === 'select'" size="mini" :disabled="item.disabled"  :readonly="item.readonly"  v-model="row[item.field]" :placeholder="$t('common.options')" 
          :style="{...item.rowStyle}">
          <!-- $forceUpdate() -->
            <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
 
          <el-date-picker v-if="item.queryType === 'datetime'" size="mini" :disabled="item.disabled"  :readonly="item.readonly"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
              v-model="row[item.field]" type="datetime" placeholder="Options"  :style="{...item.rowStyle}"
              class="filter-item">
            </el-date-picker>

            <el-date-picker  v-if="item.queryType === 'date'" size="mini"  :disabled="item.disabled"  :readonly="item.readonly"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
              v-model="row[item.field]" type="date" placeholder="Options"  :style="{...item.rowStyle}"
              class="filter-item">
            </el-date-picker>
          </div>
            <div v-else-if="row[item.field]!=null && row[item.field]!=='' && item.queryType==='file'">
              <span v-if="(row[item.field].split(';')).length==1"> 

                <el-link
                  v-if ="row[item.field].split('.')[row[item.field].split('.').length-1] !== 'zip' && (item.viewShow&& typeof item.viewShow==='function' && item.viewShow.call(self,row[item.field],row,item))"
                  v-ele-show="{btnCode: item.permCode }" 
                  type="warning"
                  :title="$t('common.view')"
                  @click="(e)=>{
                            if(item.viewClick && typeof item.viewClick ==='function')
                              {
                                item.viewClick.call(self,e,row[item.field],row,item)
                              }
                      }"
                  ><i class="el-icon-view"></i> 
                </el-link>
           
                <el-link type="primary"
                v-if="item.downloadShow && typeof item.downloadShow==='function' && item.downloadShow.call(self,row[item.field],row,item)"
                @click="(e)=>{
                            if(item.downloadClick && typeof item.downloadClick ==='function')
                              {
                                item.downloadClick.call(self,e,row[item.field],row,item)
                              }
                      }"
                >{{ row[item.field]}}</el-link>
                &nbsp;&nbsp;
                <el-link
                  v-ele-show="{btnCode: item.permCode}" 
                  type="danger"
                  :title="$t('common.btn.delete')"
                  v-if="((item.removeShow &&typeof item.removeShow==='function' && item.removeShow.call(self,row[item.field],row,item)))"
                  @click="(e)=>{
                            if(item.removeClick && typeof item.removeClick ==='function')
                              {

                                item.removeClick.call(self,e,row[item.field],row,item)
                              }
                      }"
                  ><i class="el-icon-view el-icon-circle-close"></i> </el-link>
              </span>
            <el-popover
              v-else
              placement="top-start"
              :title="$t('common.attachment')"
              popper-class="cw-table-popover"
              trigger="click">
              <el-row  v-for="(fn,a) in row[item.field].split(';')" :key="fn+a" >
                <el-col :span="20">
                  <el-link
                  v-if ="row[item.field].split('.')[row[item.field].split('.').length-1] !== 'zip' && (item.viewShow && typeof item.viewShow==='function' && item.viewShow.call(self,fn,row,item))"
                  v-ele-show="{btnCode: item.permCode }" 
                  type="warning"
                  :title="$t('common.view')"
                  @click="(e)=>{
                            if(item.viewClick && typeof item.viewClick ==='function')
                              {
                                item.viewClick.call(self,e,row[item.field],row,item,a)
                              }
                      }"
                  ><i class="el-icon-view"></i> 
                </el-link>

                  <el-link type="primary"
                  v-if="item.downloadShow && typeof item.downloadShow==='function' && item.downloadShow.call(self,fn,row,item)"
                @click="(e)=>{
                            if(item.downloadClick && typeof item.downloadClick ==='function')
                              {
                                item.downloadClick.call(self,e,fn,row,item)
                              }
                      }"
                >{{ fn }}</el-link>
                </el-col>

                <el-col :span="2">
                  <el-link
                  v-if="(item.removeShow &&typeof item.removeShow==='function' && item.removeShow.call(self,fn,row,item))"
                  v-ele-show="{btnCode: item.permCode}" 
                  type="danger"
                  :title="$t('common.btn.delete')"
                  @click="(e)=>{
                            if(item.removeClick && typeof item.removeClick ==='function')
                              {

                                item.removeClick.call(self,e,fn,row,item)
                              }
                      }"
                  ><i class="el-icon-view el-icon-circle-close"></i> </el-link>
                  </el-col>
              </el-row>
              <!-- <el-link type="primary"  v-for="fn in row[item.field].split(';')" 
                @click="(e)=>{
                            if(item.click && typeof item.click ==='function')
                              {
                                item.click.call(self,e,fn,row)
                              }
                      }"
                >{{ fn}}</el-link> -->
                <el-link type="primary" slot="reference">{{$t('common.attachment')}}</el-link>
            </el-popover>
            </div>
            <div v-else-if="row[item.field]!=null && row[item.field]!=='' && item.tabPageContent==='chart'" :title="$t('common.view')">
              <span> 
                <el-link type="primary" 
                @click="(e)=>{
                            if(item.chartClick && typeof item.chartClick ==='function')
                              {
                                item.chartClick.call(self,e,row[item.field],row)
                              }
                      }"
                >{{ row[item.field]}}</el-link>
              </span>
            </div>
            <div  v-else>
                 <span v-if="commonFilter(row[item.field], item.field)!==null && typeof commonFilter(row[item.field], item.field) ==='string' && item.charNum!==null && item.charNum !==undefined && commonFilter(row[item.field], item.field).length>item.charNum">
                  <el-popover
                      placement="bottom"
                      width="600"
                      trigger="click">
                      <div style="max-width:560px;max-height:300px;padding:10px;overflow:auto">{{commonFilter(row[item.field], item.field)}}</div>
                      <el-link slot="reference">{{commonFilter(row[item.field], item.field).substring(0,item.charNum)+"..."}}</el-link>
                    </el-popover>
                 </span>
                 <div class="cw-table-column" v-else  :style="(item.colunmStyle && typeof item.colunmStyle==='function')?item.colunmStyle.call(self,row,item,row[item.field]):(item.colunmStyle===undefined)?{}:item.colunmStyle" v-html="(item.htmlContent && typeof item.htmlContent==='function')? item.htmlContent.call(self,row,item,commonFilter(row[item.field], item.field)) :`<span>  ${commonFilter(row[item.field], item.field)||''} </span> `">
                        
                 </div>
            </div>

          </template>
          <template slot="header" slot-scope="scope">
            {{commonI18n(item)}}
            <i v-if="item.showFilter" style="margin-left: 10px; cursor: pointer" class="el-icon-document-checked" @click="selectFields" :title="$t('common.columnoptions')"/>
            <i v-if="item.showField" style="margin-left: 10px; cursor: pointer" @click="FillterField" :title="$t('common.customFilter')"><svg-icon icon-class="funnel" /></i>
          </template>
      </el-table-column>
      <el-table-column v-for="item in operColumns" :key="item.field" :label="commonI18n(item)" :prop="item.field"
         :fixed="'right'"
        :width="item.width" :min-width="item.minWidth" v-if="!item.hide && operColumns && operColumns.length>0" :align="item.align" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          {{ commonI18n(item) }}  
          <i v-if="item.showFilter" style="margin-left: 10px; cursor: pointer" class="el-icon-document-checked" @click="selectFields"  :title="$t('common.columnoptions')"/>
          <i v-if="item.showField" style="margin-left: 10px; cursor: pointer" @click="FillterField" :title="$t('common.customFilter')"><svg-icon icon-class="funnel" /></i>
        </template>
        <template slot-scope="scope">
              <span  v-for="btn in item.buttons" v-ele-show="{ btnCode: btn.permCode}" >
                <el-button :type="btn.btnType ? btn.btnType : 'primary'" v-if="(btn.show && typeof btn.show === 'function' && btn.show.call(self,scope.row))"  @click="(e)=>{
                 if(btn.callback && typeof btn.callback ==='function')
                  {
                    btn.callback.call(self,e,self,scope.row,boxSelectValue,vueContext)
                  }
                }" :icon="btn.icon" :size="btn.size || 'mini'" style="margin-right: 10px;">
               {{commonI18n(btn.text) }}
          </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
    <pagination v-show="page.total > 0 && showPage" :total="page.total" :page.sync="page.listQuery.current" :limit.sync="page.listQuery.pageSize"  :page-sizes="page.listQuery.pageSizes"
      @pagination="paginationPage"
      :small = "page.listQuery.small"
      :layout = "page.listQuery.layout"
      />
      <CwDialog  :title="commonI18n('Edit')" :dialogVisible.sync="dialogFormVisible"  width="50%" @handleClose="handleEditClose">
           <template slot="body">
            <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" :label-width="formConfig.labelWidth||'150px'">
              <div v-for="item in cols" :key="item.field" style="display: inline">
                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
                  :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'blur',
                    },
                  ]">
                  <el-input :show-password="item.password" v-model="defaultForm.params[item.field]" :style="{width: '220px',...item.style}" />
                </el-form-item>

                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'textarea'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                    <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" />
                  </el-form-item>

                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params))) && item.queryType === 'user'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="item.selectRange|| [300]"  v-model="defaultForm.params[item.field]" :disabled="item.disabled" :orgType="item.orgType||300"  :style="{width: '220px',...item.style}"
                     :initValue="defaultForm.params[item.field]!==undefined?defaultForm.params[item.field].split(','):[]"
                     :selectColumn="item.selectColumn"
                     :radio="()=>{
                       if(item.queryType === 'user' && item.multiple && typeof item.multiple==='function')
                           return item.multiple.call(this,faultForm.params,item)
                       else if(item.queryType === 'user'  && item.multiple)
                            return false
                        return true
                     }"
                     @onChange="(result)=>{
                         if(item.queryType === 'user' && item.userChange && typeof item.userChange==='function'){
                            item.userChange.call(self,result,defaultForm.params,item)
                         }
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>



                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params))) && item.queryType === 'select-filter'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                  <CwFilterSelectDropdown   v-model="defaultForm.params[item.field]" :disabled="item.disabled" 
                  :url="item.url"  
                  :lazy="item.lazy"
                  :selectColumn="item.modeValue"
                  :style="{width: '220px',...item.style}"
                     :initValue="defaultForm.params[item.field]!==undefined?defaultForm.params[item.field].split(','):[]"
                     :radio="()=>{
                       if(item.queryType === 'select-filter' && item.multiple && typeof item.multiple==='function')
                           return item.multiple.call(this,faultForm.params,item)
                       else if(item.queryType === 'select-filter'  && item.multiple)
                            return false
                        return true
                     }"
                     :loadData="(val,callback)=>{
                         if(item.loadData && typeof item.loadData==='function'){
                           item.loadData.call(self,val,item,callback)
                         }
                     }"
                     @onChange="(result)=>{
                         if(item.queryType === 'select-filter' && item.onChange && typeof item.onChange==='function'){
                            item.onChange.call(self,result,defaultForm.params,item)
                         }
                     }"
                  ></CwFilterSelectDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>


                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'select'" :label="item.title" :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'change',
                    },
                  ]">
                  <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" :placeholder="$t('common.oprions')"
                  :style="{width: '220px',...item.style}">
                    <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'inputNumber'" :label="item.title" :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'change',
                    },
                  ]">
                  <el-input-number v-model="defaultForm.params[item.field]" @change="handleChange" :min="0" :label=" $t('common.textDescription')"></el-input-number>
                </el-form-item>

                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'datetime'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
                      v-model="defaultForm.params[item.field]" type="datetime" :placeholder="$t('common.oprions')"  :style="{width: '220px',...item.style}"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>


                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'date'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
                      v-model="defaultForm.params[item.field]" type="date" :placeholder="$t('common.oprions')"  :style="{width: '220px',...item.style}"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>

                   <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'switch'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-switch
                        v-model="defaultForm.params[item.field]"
                        active-color="#13ce66"
                        inactive-color="#ff4949" :disabled="item.disabled" :style="{width: '220px',...item.style}">
                        </el-switch>
                  </el-form-item>
              </div>
            </el-form>
           </template>
           <template slot="foot">
          <el-button @click="destory(false)">
            {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID === '' || defaultForm.params.ID === null"
            @click="save('defaultForm.params')">
            {{ $t("common.btn.save") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.ID != '' && defaultForm.params.ID != null"
            @click="submit('defaultForm.params')">
            {{ $t("common.btn.submit") }}</el-button>
          </template>
      </CwDialog>

         <CwDialog v-for="iformItem in formModes"  :title="iformItem.title" :dialogVisible.sync="formDialogVisibles[iformItem.dialogVisible]"  :width="iformItem.width||'50%'" @handleClose="()=>{

                if(iformItem.handleClose && typeof iformItem.handleClose==='function'){
                  formDialogVisibles[iformItem.dialogVisible] = iformItem.handleClose.call(self)
                }else{
                   formDialogVisibles[iformItem.dialogVisible] = false
                }
          }">
           <template slot="body">
            <el-form :ref="iformItem.dialogVisible" :inline="true" :model="iform[iformItem.dialogVisible].params" :label-width="iformItem.labelWidth||'150px'">
              <div v-for="item in iformItem.forms" :key="item.field" style="display: inline">
                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
                  :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'blur',
                    },
                  ]">
                  <el-input :show-password="item.password" v-model="iform[iformItem.dialogVisible].params[item.field]" :style="{width: '220px',...item.style}" />
                </el-form-item>

                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'textarea'" :prop="item.field" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                    <el-input type="textarea" v-model="iform[iformItem.dialogVisible].params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" />
                  </el-form-item>

                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params))) && item.queryType === 'user'" :prop="item.field"  :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="item.selectRange|| [300]"  v-model="iform[iformItem.dialogVisible].params[item.field]" :disabled="item.disabled" :orgType="item.orgType||300"  :style="{width: '220px',...item.style}"
                     :initValue="iform[iformItem.dialogVisible].params[item.field]!==undefined?iform[iformItem.dialogVisible].params[item.field].split(','):[]"
                     :selectColumn="item.selectColumn"
                     :radio="()=>{
                       if(item.queryType === 'user' && item.multiple && typeof item.multiple==='function')
                           return item.multiple.call(this,iform[iformItem.dialogVisible].params,item)
                       else if(item.queryType === 'user'  && item.multiple)
                            return false
                        return true
                     }"
                     @onChange="(result)=>{
                         if(item.queryType === 'user' && item.userChange && typeof item.userChange==='function'){
                            item.userChange.call(self,result,iform[iformItem.dialogVisible].params,item)
                         }
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>


                  
                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params))) && item.queryType === 'select-filter'" :prop="item.field" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                  <CwFilterSelectDropdown   v-model="iform[iformItem.dialogVisible].params[item.field]" :disabled="item.disabled"   :style="{width: '220px',...item.style}"
                     :initValue="iform[iformItem.dialogVisible].params[item.field]!==undefined?iform[iformItem.dialogVisible].params[item.field].split(','):[]"
                     :url="item.url"  
                     :lazy="item.lazy"
                     :selectColumn="item.modeValue"
                     :radio="()=>{
                       if(item.queryType === 'select-filter' && item.multiple && typeof item.multiple==='function')
                           return item.multiple.call(this,iform[iformItem.dialogVisible].params,item)
                       else if(item.queryType === 'select-filter'  && item.multiple)
                            return false
                        return true
                     }"

                    :loadData="(val,callback)=>{
                         if(item.loadData && typeof item.loadData==='function'){
                             item.loadData.call(self,val,item,callback)
                         }
                     }"

                     @onChange="(result)=>{
                         if(item.queryType === 'select-filter' && item.onChange && typeof item.onChange==='function'){
                            item.onChange.call(self,result,iform[iformItem.dialogVisible].params,item)
                         }   
                     }"
                  ></CwFilterSelectDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>


                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'select'":label="commonI18n(item)" :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'change',
                    },
                  ]">
                  <el-select v-model="iform[iformItem.dialogVisible].params[item.field]" @change="$forceUpdate()" :placeholder="$t('common.options')" 
                  :style="{width: '220px',...item.style}">
                    <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'datetime'" :prop="item.field" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
                      v-model="iform[iformItem.dialogVisible].params[item.field]" type="datetime" :placeholder="$t('common.options')"  :style="{width: '220px',...item.style}"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>


                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'date'" :prop="item.field" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
                      v-model="iform[iformItem.dialogVisible].params[item.field]" type="date" :placeholder="$t('common.options')"   :style="{width: '220px',...item.style}"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>

                   <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'switch'" :prop="item.field" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'change',
                      },
                    ]">
                    <el-switch
                        v-model="iform[iformItem.dialogVisible].params[item.field]"
                        active-color="#13ce66"
                        inactive-color="#ff4949" :disabled="item.disabled" :style="{width: '220px',...item.style}">
                        </el-switch>
                  </el-form-item>

                  <!-- 附件处理-->
                  <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,defaultForm.params)))  && item.queryType === 'attachment'" :label="commonI18n(item)" :prop="item.field"
                  :rules="[
                    {
                      required: item.require,
                      message: item.title + $t('common.cannotEmpty'),
                      trigger: 'blur',
                    },
                  ]">
                    <el-upload
                      class="upload-form-attachment"
                      action="#"
                      :http-request="(file)=>{
                        if(item.httpRequest && typeof item.httpRequest==='function' )
                            {
                              item.httpRequest.call(self,file)
                            }
                      }"
                      :on-remove="
                      (files, fileList)=>{
                        if(item.onRemove && typeof item.onRemove==='function' )
                            {
                              item.onRemove.call(self,files, fileList)
                            }
                      }
                      "
                      :before-upload="(file)=>{
                          if(item.beforeUpload && typeof item.beforeUpload==='function' )
                            {
                              item.beforeUpload.call(self,file)
                            }
                      }"
                      :on-exceed="(files, fileList)=>{
                            if(item.onExceed && typeof item.onExceed==='function' )
                            {
                              item.onExceed.call(self,files, fileList)
                            }
                      }"
                      :limit="item.fileLimit||1"
                      :auto-upload="true"
                      :accept="item.accept||'.doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv,.zip,z.rar'"
                      :file-list="iformFile[iformItem.dialogVisible].fileList[item.field]"
                      >
                      <el-button size="small" type="primary">{{$t('common.clickupload')}}</el-button>
                      <div slot="tip" class="el-upload__tip">{{$t('common.uploadDesc')}}</div>
                    </el-upload>
                </el-form-item>
              </div>
            </el-form>
           </template>
           <template slot="foot" >
            <div :style="iformItem.footStyle">
          <el-button v-if="iformItem.cancelBtnShow"  icon="el-icon-close" @click="()=>{
            if(iformItem.handleCancel && typeof iformItem.handleCancel==='function'){
              
                formDialogVisibles[iformItem.dialogVisible] = iformItem.handleCancel.call(self)

              }else{
                  formDialogVisibles[iformItem.dialogVisible] =false
              }
             }">
            {{ $t("common.btn.cancel") }}</el-button>
            <el-button  v-for="item in iformItem.buttons" :title="(item.hideText||false)? commonI18n(item.text):''"  :style="{float: 'right',...item.style}"  @click="(e)=>{
              if(item.callback && typeof item.callback==='function')
                item.callback.call(self,e,boxSelectValue,iform[iformItem.dialogVisible].params)
            }" 
            :icon="item.icon"
            
            v-ele-show="{btnCode: item.permCode}" 
            >
            <span v-if="!item.hideText">{{commonI18n(item.text) }}</span>
           </el-button>
          </div>
          </template>
      </CwDialog>

    <CwDialog  :title="$t('common.options')" :dialogVisible.sync="dialogSelectFieldVisible" width="700px" @handleClose="handleSelectClose">
      <template slot="body">
        <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">
        <template>
          <el-transfer v-model="selectColumn.fields" :titles="[$t('common.source'), $t('common.target')]" :data="selectColumn.colMap" />
        </template>
      </el-form>
      </template>
      <div slot="foot">
        <el-button  @click="saveSelectField()" plain>{{$t('common.btn.save')}}</el-button>
      </div>
    </CwDialog>


    <FieldSelect :tableData="tableData" :tableColumns="cols" :dialogFillterFieldVisible="dialogFillterFieldVisible" :initSelect="initSelect" ref="tableComponent"
        :proheight="330" @submitItem="fieldSubmit" @handleClose="handleFieldClose" />

    <IndexSel :tableData="tableColumnsData" :tableColumns="cols" :dialogFillterFieldVisible="dialogFillterFieldColumnVisible" 
    :initSelect="initSelect" ref="fieldFilterComponent" :proheight="330" @submitItem="fieldFilterSubmit" @handleClose="handleFieldColumnClose" />
    
    <CwDialog  :title="$t('common.exportOptions')" :dialogVisible.sync="dialogExportVisible" width="700px" @handleClose="handleExportClose"> 
      <template slot="body">
        <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">
        <template>
          <exportExcel :header ="header" :columnName="columnName" :filter="filter" :list="list" @handleDownload="handleDownload">  </exportExcel>  
        </template>
      </el-form>
      </template>
    </CwDialog>

    <CwDialog  title="Import Data" :dialogVisible.sync="dialogUploadVisible" width="80%" @handleClose="handleUploadClose"> 
      <template slot="body">
        <el-form ref="uploadColumn" :inline="true" :model="uploadColumn" label-width="80px">
        <template>
          <uploadExcel  @handleUpload="handleUpload" >  </uploadExcel>  
        </template>
      </el-form>
      </template>
    </CwDialog>

    <CwDialog  title="File Upload" :dialogVisible.sync="dialogFileUploadVisible" width="800px" @handleClose="handleFileUploadClose"> 
      <template slot="body">
        <el-form ref="fileUploadColumn" :inline="true" :model="fileUploadColumn" label-width="150px">
        <template>
          <!-- <el-form-item :label="'文件标识字段'"
          :rules="[
                    {
                      required: true,
                      message: '文件标识字段不能为空',
                      trigger: 'blur',
                    },
                  ]">
                  <el-select v-model="uploadBaseField.ROW_RECORD" @change="$forceUpdate()" :placeholder="$t('common.options')" >
                    <el-option v-for="item in initSelect.ROW_RECORD" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>  -->
                <el-form-item :label="$t('common.filesavecolumn')"                
                :rules="[
                    {
                      required: true,
                      message: $t('common.filesavecolumn')+$t('common.cannotEmpty'),
                      trigger: 'blur',
                    },
                  ]"  >
                  <el-select v-model="uploadBaseField.FIELD" @change="$forceUpdate()" :placeholder="'Options'" 
                  :style="{width: '360px'}"
                  >
                    <el-option v-for="item in initSelect.FIELD" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item> 
                
                <el-form-item :label="$t('common.attachment')">
                  <el-upload
                      class="upload-file"
                      action="#"
                      drag
                      :http-request="dataFileUpload"
                      :on-remove="handleFileRemove"
                      :before-remove="beforeRemove"
                      :before-upload="uploadFileFunc"
                      :on-exceed="handleFileExceed"
                      :limit="fileLimit"
                      :auto-upload="true"
                      accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv,.zip,z.rar"
                      :file-list="fileList"
                      multiple>
                      <i class="el-icon-upload"></i>
                      <!-- <el-button size="small" icon="el-icon-upload" type="primary">点击上传</el-button> -->

                      <div class="el-upload__text">{{$t('common.dragfile')}}<em>{{$t('common.clickupload')}}</em></div>
                      <div class="el-upload__tip" slot="tip">{{$t('common.fileExceed')}}</div>
                    </el-upload>
                </el-form-item> 
  
        </template>
      </el-form>
      </template>
      <div slot="foot">
        <el-button  @click="submitFileUpload" plain>{{$t('common.upload2Server')}}</el-button>
      </div>
    </CwDialog>
    <CwDialog  :title="attachItem.title||$t('common.attachment')"  v-for="(attachItem,b) in attachmentModels" :key="'attachItem'+ b"
     :width="attachItem.width||'700px'"
    :dialogVisible.sync="dialogAttacmentVisible[attachItem.dialogVisible]" 
     @handleClose="()=>{
          if(attachItem.handleClose && typeof attachItem.handleClose==='function'){
            dialogAttacmentVisible[attachItem.dialogVisible] = attachItem.handleClose.call(self)
          }else{
            dialogAttacmentVisible[attachItem.dialogVisible] = false
          }
      }"
    > 
      <template slot="body">
         <div class="cw-table-attachement">
          <div v-for="item in attachItem.attachments">
          <el-card class="box-card" v-if="item.queryType==='file' && currentAttachmentRow[attachItem.dialogVisible]!==undefined && currentAttachmentRow[attachItem.dialogVisible][item.field]!==undefined&& currentAttachmentRow[attachItem.dialogVisible][item.field]!==null&& currentAttachmentRow[attachItem.dialogVisible][item.field]!==''">
            <div slot="header" class="clearfix">
              <span>{{item.title}}</span>
            </div>
            <div v-for="(fn,a) in currentAttachmentRow[attachItem.dialogVisible][item.field].split(';')" :key="fn+a" class="text item">
              <el-row   :key="fn+a" >
                <el-col :span="20">
                  <el-link
                  v-if ="fn.split('.')[fn.split('.')[fn.split('.').length-1]] !== 'zip' && (item.viewShow && typeof item.viewShow==='function' && item.viewShow.call(self,fn,currentAttachmentRow[attachItem.dialogVisible],item))"
                  v-ele-show="{btnCode: item.permCode }" 
                  type="warning"
                  :title="$('common.view')"
                  @click="(e)=>{
                            if(item.viewClick && typeof item.viewClick ==='function')
                              {
                                item.viewClick.call(self,e,currentAttachmentRow[attachItem.dialogVisible][item.field],currentAttachmentRow[attachItem.dialogVisible],item,a)
                              }
                      }"
                  ><i class="el-icon-view"></i> 
                </el-link>

                  <el-link type="primary"
                     @click="(e)=>{
                            if(item.downloadClick && typeof item.downloadClick ==='function' &&
                            item.downloadShow && typeof item.downloadShow==='function' && item.downloadShow.call(self,fn,currentAttachmentRow[attachItem.dialogVisible],item))
                              {
                                item.downloadClick.call(self,e,fn,currentAttachmentRow[attachItem.dialogVisible],item)
                              }else{
                                  self.$message.error($t('common.uploadpermission'))
                              }
                      }"
                >{{ fn }}</el-link>
                </el-col>

                <el-col :span="2">
                  <el-link
                  v-if="(item.removeShow &&typeof item.removeShow==='function' && item.removeShow.call(self,fn,currentAttachmentRow[attachItem.dialogVisible],item))"
                  v-ele-show="{btnCode: item.permCode}" 
                  type="danger"
                  @click="(e)=>{
                            if(item.removeClick && typeof item.removeClick ==='function')
                              {
                                item.removeClick.call(self,e,fn,currentAttachmentRow[attachItem.dialogVisible],item,attachItem)
                              }
                      }"
                  >  <el-button type="danger" size="mini" icon="el-icon-view el-icon-circle-close">{{$t('common.btn.delete')}}</el-button></el-link>
                  </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
         </div>
      </template>
    </CwDialog>
    <CwDialog  :title="$t('common.btn.details')" :dialogVisible.sync="dialogDescVisible" width="700px" @handleClose="handleDescClose"> 
      <template slot="body">
         <div class="cw-table-desc">
             
         </div>
      </template>
    </CwDialog>

  </div>
</template>

<script>
  import CwButton from "@/components/Cw/CwButton"
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from "@/components/Pagination" // Secondary package based on el-pagination
  import i18n from "@/lang";
  import FieldSelect from "@/components/FieldSelect/index"
  import CwDialog from "@/components/Cw/CwDialog"; // waves directive
  import exportExcel from "@/components/Excel/export-excel"; // waves directive
  import uploadExcel from "@/components/Excel/upload-excel"; // waves directive
  import IndexSel from "@/components/FieldSelect/indexSelect";
  import SqlSearchIndex from "@/components/searchCommon/sqlSearchIndex";
  import CwUserDropdown from "@/components/Cw/CwUserDropdown";
  import CwFilterSelectDropdown from "@/components/Cw/CwFilterSelectDropdown";
  export default {
    name: 'tableBaseCommon',
    components: { Pagination, FieldSelect,CwDialog,exportExcel,IndexSel,SqlSearchIndex,CwButton,uploadExcel,CwUserDropdown,CwFilterSelectDropdown },
    directives: { waves, elDragDialog },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '未启用',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    props: {
      columns: {
        type: Array,
        default: function() {
        return []
       }
      },
      customToolBar: {
        type: Object,
        default: function() {
        return {
          bottons: []
        }
       }
      },
      vueContext: {
        type: Object,
        default: function() {
        return {}
       }
      },
      toolColumns: {
        type: Array,
        default: function() {
        return []
       }
      },
      pageScript:{
         type: Object,
         default: function() {
         return undefined
       }
      },
      bizCode: {
         type: String,
         default: ""
      },
      page: {
        type: Object,
        default: function() {
          return {
                searchInline:true,
                searchSize:'mini',
                showPage: true,
                total: 0,
                listQuery: {
                  current: 1,
                  pageSize: 15,
                  pageSizes:[5,10,15,20,100]
             },
             queryParams: {
               requestData: {
                tableName: '',
                orderBy: '',
                columns: [],
                sqlWhere: [],
              }
            }
          }
        }
      },
      data: {
        type: Array,
        default: function() {
        return []
       }
      },
      showColOper: {
        type: Boolean,
        default: false
      },
      loadLoading: {
        type: Boolean,
        default: false
      },
      boxSelect: {
        type: Boolean,
        default: true
      },
      multipleSelect: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: true
      }
    },
    data() {
      const _initdata = {
        attachmentContent: '',
        //附件部分
        attachmentModels:[],
        dialogAttacmentVisible:{},
        currentAttachmentRow:{},
        currentAttachmentColumns:{},
        dialogDescVisible:false,
        initRadioBox: {},
        initCheckBox: {},
        formInline: false,
        dialogExportVisible1: false,
        keyC: false,
        searchInline:true,
        self: this,
        dialogFormVisible: false,
        scriptsVisible: false,
        dialogSelectFieldVisible: false,
        dialogFillterFieldVisible: false,
        dialogFillterFieldColumnVisible: false,
        dialogFileUploadVisible:false,
        dialogExportVisible:false,
        dialogUploadVisible:false,

        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        fileList:[],
        fileLimit:10,
        fileSizeLimit:10,//MB
        fileData:{},
        uploadColumn:{},
        fileUploadColumn:{},
        selectViewCol: [],
        dtsOfswitch: 'script_editer',
        scriptsEditer: '',
        scriptOps: {
          scriptValue: '',
          scriptId: ''
        },
        searchobj: {},
        matchobj: {},
        uploadBaseField:{
           ROW_RECORD:'',
           FIELD:''
         },
        ROW_INDEX_ONLY:'ID',
        ROW_RECORD:undefined, 
        initSelect: {
          ROW_RECORD:[],
          FIELD:[],
          PN: [{ label: '新建连接', value: 1 }, { label: '连接池', value: 2 }, { label: 'INFLUXDB_V1', value: 3 }],
          trayType: [],
          TEST1: [
            { label: "111", value: "111" },
            { label: "222", value: "222" },
          ],
          useState: [
            { label: "启用", value: 0 },
            { label: "禁用", value: 1 },
          ],
          condition: [
            { label: "等于", value: "=" },
            { label: "不等于", value: "<>" },
            { label: "大于", value: ">" },
            { label: "大于等于", value: ">=" },
            { label: "小于", value: "<" },
            { label: "小于等于", value: "<=" },
            { label: "包含", value: "LIKE" },
            { label: "左包含", value: "%like" },
            { label: "右包含", value: "like%" },
          ],
          column: [],
        },
        defaultForm: {
          row: {},
          params: {
            ID: '',
          },
          
        },
        filter:[],
        header:[],
        columnName:[],
        list: null,
        showPage: true,
        conditionArr: [
          { field: '匹配', value: 'LIKE' },
          { field: '左包含', value: 'LEFT JOIN' },
          { field: '右包含', value: 'RIGHT JOIN' },
          { field: '等于', value: '=' },
          { field: '大于等于', value: '>=' },
          { field: '大于', value: '>' },
          { field: '小于', value: '<' },
          { field: '小于等于', value: '<=' },
          { field: '不等于', value: '<>' },
        ],
        tableColumnsData: [],
        tableColumns: [
          { key: "column", title: "字段名", minWidth: 130, align: "left", sort: true, type: "select" },
          { key: "condition", title: "条件", minWidth: 130, align: "left", sort: true, type: "select" },
          { key: "value", title: "值", minWidth: 150, align: "left", type: "input" },
          { key: "ctl", title: "操作", align: "center" },
        ],
        formConfig:{},
        formModes:[],
        iform:{},
        iformFile:{},
        formDialogVisibles:{},
        cols: [],
        operColumns:[],
        tableData: [],
        origin_tableData: [], //存储提交的过滤条件
        tableInfo:{
          roleField:[],
          table:{},
          tableCtrlScript:undefined
        },
        toolBar:{
          toolBarStyle:{},
           buttons:[]
        },
        toolBarMap:{},
        boxSelectValue:[],
        boxSelectVisible:this.boxSelect,
        indexVisible:this.showIndex,
        selData: [],
        testDiv: 'mouse-leave',
        rowInfoDiv: { display: 'none' },
        workInfo: '',
        curScrollTop: 0,
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    watch: {
      curScrollTop: {
        handler: function (newVal, oldVal) {
          },
        deep: true,
        immediate: true
      },
    },
    created() {
      this.$nextTick(() => {
        if(this.$parent.$parent.$el.className != 'shape') {
          this.initCustomVol(data => {
                  if (data && data.length > 0) {
                    const fds = data.map(c => c.item)
                    this.cols.forEach(item => {
                      if (fds.indexOf(item.field) >= 0) {
                        item.hide = false
                      } else {
                        item.hide = true
                      }
                    })
                  }
                })
        }
     
    }) 
      //this.selectOptions()
    },
   mounted(){ 
    this.$nextTick(() => {
      if(this.$parent.$parent.$el.className != 'shape') {

          if(this.pageScript && this.pageScript.cols){
            let table = {TABLE_TYPE:undefined}
            this.parseTableInfo(this.pageScript,table)
          }
          else if(this.columns && this.columns.length>0)
          {
            this.cols = this.columns
            this.operColumns = this.toolColumns
          }
          else{
            this.initRoleField()
          }

        if(this.customToolBar && this.customToolBar.buttons && this.customToolBar.buttons.length)
          {
            this.toolBar = this.customToolBar
          }
      }
       window.addEventListener('scroll', this.getScrollInfo,true)
            
        })

   },
   destroyed() {
      window.removeEventListener('scroll', this.getScrollInfo)
   },
   methods: {
      handleChange() {},
      getScrollInfo(e) {
        if (e.target.scrollTop) {
          this.curScrollTop = e.target.scrollTop;
        }  
      },
      enterRows(row, column, cell, e) {
        // if (this.$route.name !== "work_order_task") {
        //     return;
        // }
        // this.testDiv = 'test-div';
        // this.workInfo = row.WORK_CONTENT;
        // this.$route.name === row.WORK_CONTENT
        // this.rowInfoDiv = {
        //     color: '#f0f',
        //     position: 'absolute',
        //     zIndex:999999,
        //     left: e.clientX -150 + 'px',
        //     top: this.page.listQuery.pageSize !== 15? e.clientY + this.curScrollTop - 145 + 'px' : e.clientY - 145 + 'px',
        //   }
        this.$emit('enterRowsFunc',row, column, cell, e)
      },
      leaveRows(row, column, cell, e) {
        // this.testDiv = 'mouse-leave';
        // this.rowInfoDiv = {
        //   display: 'none'
        // }
         this.$emit('leaveRowsFunc',row, column, cell, e)
      },
      rowClassNameGet({row, rowIndex}) {
        return 'row-hover'
      },
      checkHasFile(key){
        let columns = this.currentAttachmentColumns[key]
        if(columns && this.currentAttachmentRow[key]){
          for(let item of columns){
            if(item.queryType==='file'){
                  if(this.currentAttachmentRow[key][item.field]!==undefined &&this.currentAttachmentRow[key][item.field]!==null && this.currentAttachmentRow[key][item.field]!=='' )
                    return true
              }
          }  
         }else return false
        return false
      },
      handleDescClose(){
        this.dialogDescVisible=false
      },
      handleAttacmentClose(){
        this.dialogAttacmentVisible = false
      },
      post(options){
        let _data = { url: options.url, params: options.params}
        this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
                if(options.success && typeof options.success==='function'){
                  options.success.call(this,data)
                }
              }).catch(err => {     
                if(options.fail && typeof options.fail==='function'){
                  options.fail.call(this,err)
                }
              }).finally(() => {
                if(options.complete && typeof options.complete==='function'){
                  options.complete.call(this)
                }
           })
      },
      chartShow(self,e,item,row){
        this.$emit('chartShow',self,e,item,row);
      },
      showDialog(){
          this.dialogExportVisible1 = true;
      },
      handleFormClose() {
          this.dialogFormVisible = false;
      },
      init(script){
        this.$emit('init',script);
      },
      handleReset(){ 
        this.$refs.sqlSearch.reset();     
        // this.$emit('handleReset')   
      },
      downloadFile(fn,row,column){
        if(column==undefined)
          {
            this.$message.error("没有选择文件存储字段属性")
            return
          }
        let row_record = {...row,ROW_RECORD:this.ROW_RECORD,FIELD:column.field,ROW_INDEX_ONLY:this.ROW_INDEX_ONLY}  
        let data = {fileName:fn,details:row_record}
        this.$emit('handleDownloadFile','download',data,(success)=>{
            },(error)=>{
              console.error(error)
            },(complete)=>{
            });
      },
      viewFile(e,fn,row,column,a) {
        //console.log(e,fn,row,column,a)
        if(column==undefined)
          {
            this.$message.error("没有选择文件存储字段属性")
            return
          }
        let fName = fn;
        let row_record = {...row,ROW_RECORD:this.ROW_RECORD,FIELD:column.field,ROW_INDEX_ONLY:this.ROW_INDEX_ONLY}  
        if (fName && fName.split(';').length > 1) {
          let data = {fileName: fName.split(';')[a],details:row_record}
          this.$emit('viewPdf',fName.split(';')[a],row,data)
        } else {
          let data = {fileName:fn,details:row_record}
          this.$emit('viewPdf',fn,row,data)
        }
        
      },
      removeFile(fn,row,column,attachItem){
         // console.log(fn,row,column,this.currentAttachmentRow,attachItem)
        if(column==undefined)
          {
            this.$message.error("没有选择文件存储字段属性")
            return
          }
        let row_record = {...row,ROW_RECORD:this.ROW_RECORD,FIELD:column.field,ROW_INDEX_ONLY:this.ROW_INDEX_ONLY}  
        let data = {fileName:fn,details:row_record}
        this.$emit('handleRemovedFile','remove',data,(success)=>{
          if(attachItem) {
            let tt = [...this.currentAttachmentRow[attachItem.dialogVisible][column.field].split(';')]
              for(let i=0;i< tt.length;i++) {
                if (tt[i] == fn) tt.splice(i,1)  
              }
              let attachObJ = {};
              let fileTypeName = [column.field]; //fileType[column.title]
              if (fileTypeName) {
                let yy = {};
                yy[fileTypeName] =  Array.isArray(tt) && tt.join(';');
                attachObJ = Object.assign(this.currentAttachmentRow[attachItem.dialogVisible], yy);
              }
              this.currentAttachmentRow[attachItem.dialogVisible] = attachObJ;
          }
              this.query()    
            },(error)=>{
              console.error(error)
            },(complete)=>{
            });
      },
      submitFileUpload(){
        let fa = new FormData();
        const data = this.boxSelectValue
        if(data==null || data[0]==null || data.length==0)
        {
          this.$message({
                      type: 'error',
                      message: '没有选择数据行'
                 })
          return
        }
        let files = this.fileList.map(c=>c.file);
        for(let i=0 ;i<files.length;i++){
          fa.append(`file`,files[i]);
        }

        
        if(this.uploadBaseField.FIELD===undefined || this.uploadBaseField.FIELD===null )
        {
          this.$message({
                      type: 'error',
                      message: '文件存放字段不能为空'
                 })
          return
        }
        if(this.uploadBaseField.ROW_RECORD===undefined || this.uploadBaseField.ROW_RECORD===null )
        {
          this.$message({
                      type: 'error',
                      message: '文件标识字段不能为空'
                 })
          return
        }

        //fa.append('file',this.fileData);
        let rowData ={...data[0],ROW_INDEX_ONLY:this.ROW_INDEX_ONLY,FIELD:this.uploadBaseField.FIELD,ROW_RECORD:this.ROW_RECORD}

        fa.append('data',JSON.stringify(rowData));
        this.$emit('handleFileUpload','upload',fa,(success)=>{
              this.dialogFileUploadVisible = false
              this.query()
            },(error)=>{
              console.error(error)
            },(complete)=>{
              this.destory()
            });
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }?`);
      },
        handleFileRemove(file, fileList) {
            let names = this.fileList.map(c=>c.name);
            if(names.indexOf(file.name)>-1)
            {
              this.fileList.splice(names.indexOf(file.name),1)
            }
        },
        handleFileExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        dataFileUpload(item) {
            item.name=item.file.name
           // this.fileList.push(item)
            let names = this.fileList.map(c=>c.name);
            if(names.indexOf(item.file.name)==-1)
            {
              this.fileList.push(item)
            }
             this.fileData = item.file;
        },
        uploadFileFunc(file) {
          const isLtSize = file.size / 1024 / 1024 < this.fileSizeLimit;
          if (!isLtSize) {
              this.$message.error(`文件不能超过 ${this.fileSizeLimit}MB!`);
              // this.$refs.uploadDel[0].clearFiles()
              return false
          }
        },
      handleDelete(row){
        if(row==undefined || row==null)
         {
         this.$message({
              type: 'error',
              message: '没有选择行信息'
            })
            return
         }
        this.$emit('handleDelete',row)   
      },
      rowDbClick(row, column, event){
        this.$emit('handleRowDbClick',row, column, event)   
      },
      rowClick(row, column, event){
                this.rowInfoDiv = { display: 'none' };
                this.handleSelect(null,row)
                if(this.multipleSelect){
                  this.$refs.multipleTable.toggleRowSelection(row)
                }
                this.$emit('handleRowClick',row, column, event)
              },
      handleSelectAll(selection){
        if(!this.multipleSelect)
          this.$refs.multipleTable.clearSelection()
      },
      handleSelect(selection, row){
        if(this.multipleSelect)
          return
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChange(selection) {
        this.boxSelectValue = selection
      },

      initRoleField(){
          //抓取表信息,并获取到脚本
          const bizCode =this.bizCode

         //获取到模型数据
        //1、判定是否是需要权限鉴定，在页面参数中可以配置，默认不需要
         let _params = {sqlWhere:[
             {column:'BIZ_CODE',condition:'=',value:bizCode}
         ]}

          let _data = { url: '/dyn-table/query', params: {data:_params} }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
               if(!data || data.length===0)
                 return ;
              this.tableInfo.table=data[0]
              //判断是否受控
              if(this.tableInfo.table.TABLE_TYPE==='CONTROL'){
                _data = { url: '/field-role/query-field', params: {data:bizCode} }
                    this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                      .then(roleData => {
                          const roleField = roleData
                          if(roleField && roleField.length){
                            this.tableInfo.roleField=roleField
                            //this.initTableInfo(roleField[0]['TABLE_ID'])
                            this.handlerTableInfo(data[0])
                          }
                      }).catch(err => {
                        console.error(err)
                      })
              }else{
                this.handlerTableInfo(data[0])
              }
            }).catch(err => {
              console.error(err)
         })


      },
      initTableInfo(id){
         _data = { url: '/dyn-table/queryTableById', params: {data:id} }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
               if(!data)
                 return ;
              this.tableInfo.table=data[0]
              this.handlerTableInfo(data[0])
            }).catch(err => {
              console.error(err)
            })
        },
        initFieldInfo(){

        },
        // 搜索栏下拉select数据获取方法
        initSelOptionData(uri,selParamArr,selArrData,item,callback) {
            let pageParams = item.itemParams ? item.itemParams : { current:1,pageSize: 1000,requestData: {} };
            let that = this, newData = [];
            const _data = {url: uri, params: pageParams}
            if(item.selectArgs){
              _data.params = item.selectArgs
            }
            this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              if (Array.isArray(data)) {
                data.forEach(item => {
                  selArrData.push({
                    label: item[selParamArr[0]],
                    value: item[selParamArr[1]],
                  })
                })
              } else {
                data.data.forEach(item => {
                  selArrData.push({
                    label: item[selParamArr[0]],
                    value: item[selParamArr[1]],
                  })
                })
              }
            
              if(callback && typeof callback==='function')
                callback.call(this,selArrData)
            },(error)=>{
               console.error(error)
            })   
        },
        handlerTableInfo(table){
          const tableScript = eval("("+table.CTRL_SCRIPT+")")
          this.parseTableInfo(tableScript,table)
        },
        parseTableInfo(tableScript,table){
          //const tableScript = eval("("+table.CTRL_SCRIPT+")")
          tableScript.cols.forEach(item => {
            if (item.queryType === 'select') {
              if(item.selUri) {
                let selArrData = []
                this.initSelOptionData(item.selUri,item[item.field],selArrData,item,(arr)=>{
                  this.$set(this.initSelect,item.field,arr)
                  //this.initSelect[item.field] = selArrData;
                })
            
              } else if(item.jsonSelData){
                this.$set(this.initSelect,item.field,item[item.field])
                //this.initSelect[item.field] = item[item.field]
              }  
              
            } else if (item.queryType === 'checkbox') {
              this.initCheckBox[item.field] = item[item.field]
            } else if (item.queryType === 'radio') {
              this.initRadioBox[item.field] = item[item.field]
            }
          })
          this.init(tableScript)
          this.tableInfo.tableCtrlScript =tableScript 
          const roleColumn = this.tableInfo.roleField.map(item=>item.COLUMN_NAME)
          if(table.TABLE_TYPE==='CONTROL'){
            this.cols = tableScript.cols.filter(item => {
              return roleColumn.indexOf(item.field)>=0
            })
          }else{
            this.cols = tableScript.cols;
          }
          this.formModes = tableScript.formModes||[]
          if(this.formModes && this.formModes.length){
            this.formModes.forEach(item=>{
              this.$set(this.formDialogVisibles,item.dialogVisible,false)
              this.$set(this.iform,item.dialogVisible,{})
              this.$set(this.iform[item.dialogVisible],"params",{})  
              this.$set(this.iformFile,item.dialogVisible,{})
              //this.$set(this.iformFile[item.dialogVisible],item.field,{})
              //this.$set(this.iformFile[item.dialogVisible],item.field,{})
             // this.$set(this.iformFile[item.dialogVisible],'fileList',[])

              if(item.forms && item.forms.length){
                let fieldFile = {}
                this.$set(this.iformFile[item.dialogVisible],'fileList',{})
                item.forms.forEach(_form=>{

                  if(_form.queryType==='attachment'){
                    this.$set(this.iformFile[item.dialogVisible]['fileList'],_form.field,[])
                   }
                })
              }
        
              if(item.dialogShow){
                this.formDialogVisibles[item.dialogVisible] = item.dialogShow
              }
              if(item.forms && item.forms.length){
                item.forms.forEach(fo =>{
                  this.$set(this.iform[item.dialogVisible].params,fo.field,undefined)
                })
              }
            })
    
          }

          this.attachmentModels = tableScript.attachmentModels||[]
         // attachmentModels:[],
       // dialogAttacmentVisible:{},
        //currentAttachmentRow:undefined,
          if(this.attachmentModels && this.attachmentModels.length){
            this.attachmentModels.forEach(item=>{
              this.$set(this.dialogAttacmentVisible,item.dialogVisible,false)
              this.$set(this.currentAttachmentRow,item.dialogVisible,item.currentAttachmentRow||{})
              this.$set(this.currentAttachmentColumns,item.dialogVisible,item.attachments)
            })

          }

          let columns = []
          let head = []
          let row_record=[]
          this.cols.forEach(c=>{
            if (c.set) {
              this.$set(this.defaultForm.params,c.field,undefined)
             }
             columns.push(c.field)
             head.push(this.commonI18n(c))
             if(c.queryType==='file')
               row_record.push({label:c.title,value:c.field})
           })
          this.initSelect.ROW_RECORD=row_record
          this.initSelect.FIELD=row_record
          let newCol = [...this.cols]
          // this.tableColumnsData = newCol.map(item => ( { column: item.field, title: item.title }))
          this.tableColumnsData = newCol.filter(item => !item.hide).map(item => ({ column: item.field, title: item.title }));
          this.page.queryParams.columns = columns
          this.page.searchInline=tableScript.page.searchInline
          this.page.searchSize=tableScript.page.searchSize
          this.filter = columns
          this.header = head
          this.columnName=columns
          this.operColumn = tableScript.operColumn
          this.operColumns = tableScript.toolColumns
          if(this.customToolBar && this.customToolBar.buttons && this.customToolBar.buttons.length)
            {
              this.toolBar = this.customToolBar
            }
          else if (tableScript.customToolBar){
            this.toolBar = tableScript.customToolBar
          }

          //toolBarMap
          if(this.toolBar && this.toolBar.buttons&& this.toolBar.buttons.length){
            this.toolBar.buttons.forEach(btn=>{
                if(btn.hasOwnProperty("key")){
                   this.toolBarMap[btn.key] = btn
                }
            })
          }
          // form表单配置项
          if (tableScript.formConfig){
              this.formConfig = tableScript.formConfig
              this.formInline = tableScript.formConfig.inline
              this.fileLimit=tableScript.formConfig.fileLimit||this.fileLimit
              this.fileSizeLimit=tableScript.formConfig.fileSizeLimit||this.fileSizeLimit
              this.ROW_RECORD = tableScript.formConfig.file_row_record||this.ROW_RECORD
              this.ROW_INDEX_ONLY =tableScript.formConfig.file_row_index_only||this.ROW_INDEX_ONLY
          }
          //初始化下拉菜单对应的静态选项资源
          if(tableScript.selectOptions && typeof tableScript.selectOptions==='function'){
            tableScript.selectOptions.call(this)
          }
          const page = tableScript.page || this.page
          this.showPage = page.showPage===false?page.showPage:this.showPage
          //this.page.listQuery = page.listQuery||this.listQuery

          //this.page.listQuery.current=page.listQuery.current||this.page.listQuery
          //this.page.listQuery.pageSize=page.listQuery.pageSize||this.page.pageSize
          //this.page.listQuery.pageSizes=page.listQuery.pageSizes||this.page.pageSizes
          this.page.listQuery = {...this.page.listQuery,...page.listQuery}
          //判断是否是懒加载
          let lazy = page.lazy===true?true:false
          if(!lazy)
             this.loadData()
        },
      initCustomVol(callback) {
        const customColumn = { mark: this.bizCode, userName: sessionStorage.getItem('userInfo') }
        const _data = { url: '/custom-item/guest/query', params: customColumn }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            if (callback && typeof callback === 'function') {
              callback(data)
            }
          }).catch(err => {
          console.error(err)
        }).finally(() => {

        })
      },
      selectFields() {
        this.dialogSelectFieldVisible = true
        this.dialogFillterFieldVisible = false;

        this.initCustomVol((data) => {
          this.selectColumn.colMap = []
          this.selectColumn.fields = []
          this.selectColumn.origin = {}
          this.selectColumn.fields = data.map(c => c.item)
          this.cols.forEach(item => {
            this.selectColumn.origin[item.field] = item.title
            this.selectColumn.colMap.push({
              key: item.field,
              label: item.title,
              disabled: false
            })
          })
        })
      },
      saveSelectField() {
      const fields = {}
      // this.currScripts.cols.forEach(item=>{
      //    if(item.export){
      //      fields[item.field] = item.title
      //    }
      // })
      const arr = []
      this.selectViewCol.length = 1
      this.selectColumn.fields.forEach(item => {
        if (this.selectColumn.origin[item]) {
          fields[item] = this.selectColumn.origin[item]
          arr.push({ item: item })
          this.selectViewCol.push(item)
        }
      })

      if (this.selectColumn.fields.length == 0) {
        this.$message({
          type: 'info',
          message: '没有选择字段'
        })
        return
      }

      const customColumn = { mark: this.bizCode, userName: sessionStorage.getItem('userInfo'), items: arr }
      const _data = { url: '/custom-item/guest/save', params: customColumn }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.dialogSelectFieldVisible = false
          this.cols.forEach(item => {
            if (this.selectViewCol.indexOf(item.field) >= 0) {
              item.hide = false
            } else {
              item.hide = true
            }
          })
          // this.query()
        }).catch(err => {
        console.error(err)
      }).finally(() => {

      })
    },
      // 条件过滤dialog
      FillterField() {
        this.initSelect.column = [];
        this.dialogFillterFieldVisible = true;
        this.dialogSelectFieldVisible = false
        this.initCustomVol((data) => {
          this.cols.forEach((item) => {
            this.initSelect.column.push({
              value: item.field,
              label: item.title,
            });
          });
        });
      },
      FilterCustomField() {
        this.dialogFillterFieldColumnVisible = true;
      },
      // 条件过滤dialog提交
      fieldSubmit(arr) {
        this.dialogFillterFieldVisible = false
        this.page.queryParams.requestData.sqlWhere = arr
        this.origin_tableData = JSON.parse(JSON.stringify(arr))
        this.query()
      },

      // 表格内查询按钮的提交回调(json脚本配置时使用)
      fieldFormQuery() {
        this.dialogFillterFieldVisible = false
        this.page.queryParams.requestData.sqlWhere = this.$refs.sqlSearch.query().sqlWhere;
        this.origin_tableData = JSON.parse(JSON.stringify(this.$refs.sqlSearch.query().sqlWhere))
        this.query()
      },
      // 自定义字段搜索过滤dialog提交
      fieldFilterSubmit(arr) {
        this.cols.map(item => {
              item.query = false;
              return item;
        })
        let aa = [...this.cols];
        let newCol = aa.map(item => {
            arr.forEach(a => {
                if (a.column === item.field) {
                    item.query = true;
                }
            })
            return item;
        })
        this.cols = newCol;
        this.keyC = !this.keyC
        this.dialogFillterFieldColumnVisible = false;
      },
      handleSelectClose(){
        this.dialogSelectFieldVisible = false
      },
      handleExportClose(){
        this.dialogExportVisible=false
      },

      handleUploadClose(){
        this.dialogUploadVisible=false
      },
      handleFileUploadClose(){
        this.dialogFileUploadVisible=false
      },
      // 关闭自动过滤dialog
      handleFieldClose() {
        this.dialogFillterFieldVisible = false;
        this.tableData = this.origin_tableData
      },
      // 关闭自定义字段搜索过滤dialog
      handleFieldColumnClose() {
        this.dialogFillterFieldColumnVisible = false;
        // this.tableColumnsData =[]
      },
      handleEditClose(){
        this.dialogFormVisible = false
      },
      handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => { });
      },
      handleUpload(resultData,callback){
        this.$emit('uploadData',resultData,(data)=>{
          this.$message({
                type: 'success',
                message: '上传成功'
 
              })
              this.dialogUploadVisible=false
              if(callback && typeof callback==='function')
                 callback(data)
        },error=>{
          this.$message({
              type: 'error',
              message: '上传失败'+JSON.stringify(error)
            })
        },()=>{
            
        })
      },
      handleDownload(callback,error,complete){

        this.page.queryParams.requestData.sqlWhere = this.$refs.sqlSearch.query().sqlWhere;
        this.origin_tableData = JSON.parse(JSON.stringify(this.$refs.sqlSearch.query().sqlWhere))
        //构造参数
        let param = {
          ...this.page.queryParams,
          current: 1,
          pageSize: 100000
        }
        this.$emit('loadData',param,(data)=>{
            this.list = data.data
            if(callback && typeof callback==='function')
               callback(data)
        },error,complete)
      },
      exportClick(){
        this.dialogExportVisible=true
      },
      uploadClick(){
        this.dialogUploadVisible=true
      },
      fileUploadClick(){
        const data = this.boxSelectValue
        if(data==null || data[0]==null || data.length==0)
        {
          this.$message({
                      type: 'error',
                      message: '没有选择数据行'
                 })
          return
        }
        this.fileData={}
        this.fileList=[]

        this.dialogFileUploadVisible=true
      },
      initData(arr) {
        let args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
      },
      commonFilter(value, type) {
        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      loadData(){
           this.$emit('loadData');
      },
      getValueConvert(arr, value) {
        for (let v of arr) {
          if (v.value == value) {
            return v.label
          }
        }
        return value
      },
      destory(hide = false) {
        this.dialogFormVisible = hide
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }
      },
      claerFormData(form) {
        for (let p in form) {
          if (form.hasOwnProperty(p)) {
              form[p] = ''
          }
        }
      },
      clearFormData(form) {
        for (let p in form) {
          if (form.hasOwnProperty(p)) {
              form[p] = ''
          }
        }
      },
      add() {
        this.destory(true)
        this.$refs.multipleTable.clearSelection()
        this.boxSelectValue = []
        // 若有初始化参数
        if(this.page.queryParams.requestData){
          if(this.page.queryParams.requestData.sqlWhere.length == 1){
            let sqlWheres = this.page.queryParams.requestData.sqlWhere[0]
            this.defaultForm.params[sqlWheres.column] = sqlWheres.value
          }
        }
      },
      showDetails(row, column) {
      },
      edit(row) {
       if(row==undefined || row==null)
         {
         this.$message({
              type: 'error',
              message: '没有选择行信息'
            })
            return
         }
        this.dialogFormVisible = true
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = row[p]
          }
        }

      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('handleAdd','update',this.defaultForm.params,(success)=>{
              this.dialogFormVisible = false
              this.query()
            },(error)=>{
              console.error(error)
              this.dialogFormVisible = true

            },(complete)=>{
            });
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            });
            this.destory(true)
          }
        });
      },
      query() {
        this.page.listQuery.current = 1
        // this.loadData()
        this.loadDataQuery();
      },
      paginationPage(){
        this.page.queryParams.requestData.sqlWhere = this.$refs.sqlSearch.query().sqlWhere;
        this.origin_tableData = JSON.parse(JSON.stringify(this.$refs.sqlSearch.query().sqlWhere))
        this.loadDataQuery();
      },
      loadDataQuery() {
        this.$emit('loadDataQuery')
      },
      reset() {
        this.handleReset()
      },
      selectOptions() {
        //    //初始化线体信息
        //    let _data = {url:'/constant/tool-type',params:{}}
        //    this.$store.dispatch('fmsCommon/actionFmsPost',_data)
        //   .then(data => {
        //        this.initSelect.trayType = data.map(c=>{
        //          return {
        //            label:c.name,
        //            value:c.value
        //          }
        //        })
        //    }).catch(err => {
        //       console.error(err)
        //    })

        //初始化工序信息
      },
      save(formName) {
        this.defaultForm.row = {}
        this.defaultForm.params.ID = ''
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$emit('handleAdd','add',this.defaultForm.params,(success)=>{
              this.dialogFormVisible = false
              this.query()
            },(error)=>{
              this.dialogFormVisible = true
              console.error(error)
            },(complete)=>{
            
            });
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            });
            this.destory(true)
          }
        });


      },
      dele({ $index, row }) {
        this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/data-base/deleteById', params: { data: row.ID } }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              //this.list.splice($index, 1)
              this.getList();
              this.$message({
                type: 'success',
                message: 'delete success!'
              });
            }).catch(err => {
              console.error(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
        })
      },
      // 操作栏通用方法
      operaOne(e,self,row,selected) {
        this.$emit('operaOne',row)
      },
      operaTwo(e,self,row,selected) {
        this.$emit('operaTwo',row)
      },
    }
  }
</script>

<style lang="less" scoped>
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
  .cw-table-ul{
    padding: 0;
    margin: 0;
    }
  ::v-deep .el-input-group__append {
    width: 18px;
    border: 1px solid #0370AA;
    border-left: none;
    background-color: white;
  }
  .cw-table-attachement{
    ::v-deep .el-card{
        margin: 2.5px 0;
        .el-row {
          margin:2px 0;
        }
    }
   
  }
  ::v-deep .el-table table{
    margin: 0 !important;
  }
 ::v-deep .el-table tbody tr{
    &:hover {
      color: lightseagreen;
    }
    .test-div {
        display: block;
      }
    .mouse-leave{
        display: none;
      }

  }
  //.attachStyle{
  //  position: absolute;
  //  text-align: center;
  //  padding: 5px;
  //  align-items: center;
  //  border-radius: 5px;
  //   border-radius: 5px;
	//		animation-name: fileAnimation;/* 定义动画名称 */
	//animation-duration: 5s;/* 定义动画时间 */
	//		animation-iteration-count: 1;/* 定义动画播放次数 */
	//animation-direction: alternate;/* 动画逆向播放 */
 // }
  //@keyframes fileAnimation{
 //   from{ opacity: 1; }
//		to{ opacity: 0; }
 // }
 // .stop {
 //   animation-play-state: paused;
 // }
  // ::v-deep .el-input__inner {
  //   padding: 0 10px 0 5px;
  // }

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

  .cwtable-tool-bar{
    width: 100%;
    min-height: 40px;
    padding: 5px;
   /* background: #0370AA*/
  }
  ::v-deep .el-link.el-link--warning{
    margin-right: 5px;
  }
  ::v-deep .el-table__fixed {
    height: 100% !important;
  }
  .cw-table-column{
    width:100%; 
  }

</style>
<style>
    .cw-table-popover {
      width: 20% !important;
    }
  #commonTable  .current-row {
        color: lightseagreen
      }
</style>