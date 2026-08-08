<template>
    <div :style="{...formStyle}">
        <el-form  v-for="iformItem in formModes" :size="iformItem.size"  v-loading="loading[iformItem.dialogVisible]||false" :ref="iformItem.dialogVisible" :style="{...iformItem.itemFormStyle}" :inline="true" :model="iform[iformItem.dialogVisible].params" :label-width="iformItem.labelWidth||'150px'">
        <div v-for="item in iformItem.forms" :key="item.field" :style="{display: iformItem.display||'inline',...iformItem.bodyStyle}">
        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'input'"  :label="commonI18n(item)" :prop="item.field"
          :rules="[
            {
              required: item.require,
              message: item.title + '不能为空',
              trigger: 'blur',
            },
          ]">
          <el-input  :id="iformItem.dialogVisible+'-'+item.field" 
          @focus="(e)=>{if(item.focus && typeof item.focus==='function'){item.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.focus && typeof iformItem.focus==='function'){iformItem.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @blur="(e)=>{if(item.blur && typeof item.blur==='function'){item.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.blur && typeof iformItem.blur==='function'){iformItem.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}" 
              @select="(e)=>{if(item.select && typeof item.select==='function'){item.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.select && typeof iformItem.select==='function'){iformItem.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @input="(e)=>{if(item.input && typeof item.input==='function'){item.input.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.input && typeof iformItem.input==='function'){iformItem.input.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"

              @keyup.enter.native="()=>{ if(item.enterNative && typeof item.enterNative==='function'){item.enterNative.call(seld,iform[iformItem.dialogVisible].params,iformItem,item)} else {enterNative(iformItem,item)}}"  :size="item.size" :type="item.inuptType ? item.inuptType : 'text'" :disabled="item.disabled" :readonly="item.readonly" :show-password="item.password" v-model="iform[iformItem.dialogVisible].params[item.field]"  :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}" @change="(v1,v2,v3,v4) => handlerEvent('inupt-change',v1,v2,v3,v4)" />
        </el-form-item>

        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'textarea'" :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]">
            <el-input :id="iformItem.dialogVisible+'-'+item.field" 
              @focus="(e)=>{if(item.focus && typeof item.focus==='function'){item.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.focus && typeof iformItem.focus==='function'){iformItem.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @blur="(e)=>{if(item.blur && typeof item.blur==='function'){item.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.blur && typeof iformItem.blur==='function'){iformItem.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}" 
              @select="(e)=>{if(item.select && typeof item.select==='function'){item.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.select && typeof iformItem.select==='function'){iformItem.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @change="(e)=>{if(item.change && typeof item.change==='function'){item.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.change && typeof iformItem.change==='function'){iformItem.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @input="(e)=>{if(item.input && typeof item.input==='function'){item.input.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.input && typeof iformItem.input==='function'){iformItem.input.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"

              @keyup.enter.native="()=>{ if(item.enterNative && typeof item.enterNative==='function'){item.enterNative.call(seld,iform[iformItem.dialogVisible].params,iformItem,item)} else {enterNative(iformItem,item)}}"   :size="item.size" type="textarea" v-model="iform[iformItem.dialogVisible].params[item.field]" :readonly="item.readonly" :disabled="item.disabled"   :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}" />
          
            </el-form-item>

            <!-- 文本 -->
            <el-col :span="24" v-if="item.set && item.queryType === 'text'"  :style="{fontWeight: 'bolder',color:'#0000FF',paddingBottom: '10px',...item.textStyle}">
              {{commonI18n(item)}}
            </el-col>
            
            <span  v-if="item.set && item.queryType === 'textNowrap'"  :style="{width: item.boxWidth?item.boxWidth:'auto', color:'#606266',fontWeight:'700', verticalAlign:'sub',fontSize:'small',display: 'inline-block',...item.style}">
              {{commonI18n(item)}}
            </span>
          

          <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params))) && item.queryType === 'user'" :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]">
          <CwUserDropdown :size="item.size" :selectRange="item.selectRange|| [300]"
          @focus="(e)=>{if(item.focus && typeof item.focus==='function'){item.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.focus && typeof iformItem.focus==='function'){iformItem.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @blur="(e)=>{if(item.blur && typeof item.blur==='function'){item.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.blur && typeof iformItem.blur==='function'){iformItem.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}" 
              @select="(e)=>{if(item.select && typeof item.select==='function'){item.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.select && typeof iformItem.select==='function'){iformItem.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @change="(e)=>{if(item.change && typeof item.change==='function'){item.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.change && typeof iformItem.change==='function'){iformItem.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
          v-model="iform[iformItem.dialogVisible].params[item.field]" :readonly="item.readonly" :disabled="item.disabled" :orgType="item.orgType||300"  :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}"
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

          <!-- <el-input type="textarea" v-model="iform[iformItem.dialogVisible].params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
          </el-form-item>


          
          <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params))) && item.queryType === 'select-filter'" :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]">
          <CwFilterSelectDropdown :size="item.size" 
          @focus="(e)=>{if(item.focus && typeof item.focus==='function'){item.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.focus && typeof iformItem.focus==='function'){iformItem.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @blur="(e)=>{if(item.blur && typeof item.blur==='function'){item.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.blur && typeof iformItem.blur==='function'){iformItem.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}" 
              @select="(e)=>{if(item.select && typeof item.select==='function'){item.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.select && typeof iformItem.select==='function'){iformItem.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @change="(e)=>{if(item.change && typeof item.change==='function'){item.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.change && typeof iformItem.change==='function'){iformItem.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
          v-model="iform[iformItem.dialogVisible].params[item.field]" :disabled="item.disabled"  :readonly="item.readonly" :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}"
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

          <!-- <el-input type="textarea" v-model="iform[iformItem.dialogVisible].params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
          </el-form-item>


        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'select'"   :label="commonI18n(item)" :rules="[
            {
              required: item.require,
              message: item.title + '不能为空',
              trigger: 'change',
            },
          ]">
          <el-select 
           @keyup.enter.native="()=>{ if(item.enterNative && typeof item.enterNative==='function'){item.enterNative.call(seld,iform[iformItem.dialogVisible].params,iformItem,item)} else {enterNative(iformItem,item)}}"  :multiple="item.multiple" :filterable="item.filterable" :remote-method="()=>{if(item.remoteMethod && typeof item.remoteMethod==='fucntion') item.remoteMethod.call(self,iform[iformItem.dialogVisible].params,iformItem,item)}"  :filter-method="()=>{if(item.filterMethod && typeof item.filterMethod==='fucntion') item.filterMethod.call(self,iform[iformItem.dialogVisible].params,iformItem,item)}" 
              :size="item.size"
              @focus="(e)=>{if(item.focus && typeof item.focus==='function'){item.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.focus && typeof iformItem.focus==='function'){iformItem.focus.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @blur="(e)=>{if(item.blur && typeof item.blur==='function'){item.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.blur && typeof iformItem.blur==='function'){iformItem.blur.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}" 
              @select="(e)=>{if(item.select && typeof item.select==='function'){item.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.select && typeof iformItem.select==='function'){iformItem.select.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
              @change="(e)=>{if(item.change && typeof item.change==='function'){item.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)} else if(iformItem.change && typeof iformItem.change==='function'){iformItem.change.call(self,e,seld,iform[iformItem.dialogVisible].params,iformItem,item)}}"
             :disabled="item.disabled"  :readonly="item.readonly"  v-model="iform[iformItem.dialogVisible].params[item.field]"  placeholder="请选择"
          
          :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}">
          <!-- $forceUpdate() -->
            <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'checkbox'"   :label="commonI18n(item)">
            <el-checkbox  v-for="i in initCheckBox[item.field]" :disabled="item.disabled" v-model="iform[iformItem.dialogVisible].params[i.field]" :name="i.field" :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}">{{i.label}}</el-checkbox>
        </el-form-item>

        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'radio'"   :label="commonI18n(item)">
          <el-radio-group v-model="iform[iformItem.dialogVisible].params[item.field]" :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}" :disabled="item.disabled">
            <el-radio v-for="i in initRadioBox[item.field]" :label="i.value" >{{i.label}}</el-radio>
          </el-radio-group>  
        </el-form-item>
        <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'datetime'"  :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'change',
              },
            ]">
            <el-date-picker :size="item.size"  :disabled="item.disabled"  :readonly="item.readonly"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
              v-model="iform[iformItem.dialogVisible].params[item.field]" type="datetime" placeholder="请选择" :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}" 
              class="filter-item">
            </el-date-picker>
          </el-form-item>


          <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'date'" :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'change',
              },
            ]">
            <el-date-picker :size="item.size"  :disabled="item.disabled"  :readonly="item.readonly"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
              v-model="iform[iformItem.dialogVisible].params[item.field]" type="date" placeholder="请选择"  :style="{width: '220px',...item.style}"
              class="filter-item">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'switch'" :prop="item.field" :label="commonI18n(item)" :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'change',
              },
            ]">
            <el-switch  :size="item.size" :disabled="item.disabled"  :readonly="item.readonly" 
                @change="(v1,v2,v3,v4) => handlerEvent('switch-change',v1,v2,v3,v4)"
                v-model="iform[iformItem.dialogVisible].params[item.field]"
                :active-value="item.activeValue ? item.activeValue : 1"
                :inactive-value="item.inactiveValue ? item.inactiveValue : 0"
                active-color="#13ce66"
                inactive-color="#ff4949"  :style="{width: item.boxWidth?item.boxWidth:'220px',...item.style}">
                </el-switch>
          </el-form-item>



          <el-form-item v-if="item.view && iform[iformItem.dialogVisible].params[item.field]!==undefined && iform[iformItem.dialogVisible].params[item.field]!==null && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'filePreview'" :prop="item.field" :label="commonI18n(item)">

           <div v-for="(fn,a) in iform[iformItem.dialogVisible].params[item.field].split(';')" :key="fn+a" class="text item" style="width: 600px;">
              <el-row   :key="fn+a" >
                <el-col :span="20">
                  <!--    -->
                  <el-link
                  v-if ="fn.split('.')[fn.split('.')[fn.split('.').length-1]] !== 'zip' && (item.viewShow && typeof item.viewShow==='function' && item.viewShow.call(self,fn,iform[iformItem.dialogVisible].params,item))"
                  v-ele-show="{btnCode: item.permCode }" 
                  type="warning"
                  title="预览"
                  @click="(e)=>{
                            if(item.viewClick && typeof item.viewClick ==='function')
                              {
                                item.viewClick.call(self,e,iform[iformItem.dialogVisible].params[item.field],iform[iformItem.dialogVisible].params,item,a)
                              }
                      }"
                  ><i class="el-icon-view"></i> 
                </el-link>

                  <el-link type="primary"
                     @click="(e)=>{
                            if(item.downloadClick && typeof item.downloadClick ==='function' &&
                            item.downloadShow && typeof item.downloadShow==='function' && item.downloadShow.call(self,fn,iform[iformItem.dialogVisible].params,item))
                              {
                                item.downloadClick.call(self,e,fn,iform[iformItem.dialogVisible].params,item)
                              }else{
                                  self.$message.error('你可能没有权限下载该文件')
                              }
                      }"
                >{{ fn }}</el-link>
                </el-col>

                <el-col :span="2">
                  <el-link
                  v-if="(item.removeShow &&typeof item.removeShow==='function' && item.removeShow.call(self,fn,iform[iformItem.dialogVisible].params,item))"
                  v-ele-show="{btnCode: item.permCode}" 
                  type="danger"
                  @click="(e)=>{
                            if(item.removeClick && typeof item.removeClick ==='function')
                              {
                                item.removeClick.call(self,e,fn,iform[iformItem.dialogVisible].params,item)
                              }
                      }"
                  >  <el-button type="danger" size="mini" icon="el-icon-view el-icon-circle-close">删除</el-button></el-link>
                  </el-col>
              </el-row>
            </div>

          </el-form-item>


          <!-- 附件处理-->
          <el-form-item v-if="item.set && (item.formItemShow===undefined||(item.formItemShow && typeof item.formItemShow==='function' && item.formItemShow.call(self,iform[iformItem.dialogVisible].params)))  && item.queryType === 'attachment'" :label="commonI18n(item)" :prop="item.field"
          :rules="[
            {
              required: item.require,
              message: item.title + '不能为空',
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
              :on-preview="(file)=>{
                  if(item.onPreview && typeof item.onPreview==='function' )
                    {
                      item.onPreview.call(self,file)
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
              <el-button size="mini" type="primary" >点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
        </el-form-item>
        </div>
        <div :style="{display: iformItem.footerDisplay||'block',...iformItem.footerStyle}">
          <el-button  v-for="item in iformItem.buttons" :title="(item.hideText||false)? commonI18n(item.text):''"  :style="{textAlign: 'center',...item.style}"  @click="(e)=>{
              if(item.callback && typeof item.callback==='function')
                item.callback.call(self,e,iform[iformItem.dialogVisible].params)
            }" 
            :icon="item.icon"
            
            v-ele-show="{btnCode: item.permCode}" 
            >
            <span v-if="!item.hideText">{{commonI18n(item.text) }}</span>
           </el-button>
        </div>
        </el-form>
       <CwFileView  ref="docuView" :viewTitle="viewTitle" :url="url"/>
    </div>
  </template>
<script>
import CwFileView from "./CwFileView"
import CwInputs from "@/components/Cw/CwInput.vue"
import {dispatchEvent} from "../utils/eventUtils"
import CwUserDropdown from "@/components/Cw/CwUserDropdown";
import CwFilterSelectDropdown from "@/components/Cw/CwFilterSelectDropdown";

export default {
  name: 'CwForm',
  components: { CwInputs,CwUserDropdown,CwFilterSelectDropdown, CwFileView },
  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    itemVal: {
      type: String,
      default: ''
    },
    compId: {
      type: String,
      default: ''
    },
    fieldName: {
      type: String,
      default: ''
    },
    component:{
        type: Object,
        default: () =>{}
      },
    bindData:{
      type: Object,
      default: () =>{}
    },
  },
  data() {

    const _initdata = {
      methods:{},
      vueContext:{},
      dataObtainedByEditor:{},
      viewTitle: '',
      url: '',
     cols:[
        //    { field: 'sn', title: '条码/编码', align: 'left', query: false, queryType: 'input', set: true,flowEdit:true, require: false, width:180, editReadonly:true },
        //     { field: 'processNo', title: '工序', align: 'left', query: false, queryType: 'input', set: true,flowEdit:true, require: false, width:180, editReadonly:true },
        //     { field: 'qcSName', title: '标准单', align: 'left',hide:true, query: false, queryType: 'input', set: false,flowEdit:true, require: false, width:180, editReadonly:true },
        //     { field: 'qcSCode', title: '检验单', en_title: 'PN', align: 'left', query: false, queryType: 'input', set: false,flowEdit:true, require: false, width:180 },
        //     { field: 'deviceNo', title: '设备', align: 'left', query: true, queryType: 'input', set: true, require: false,flowEdit:true, editReadonly: false, width:180 },
        //     { field: 'descrip', title: '异常原因', align: 'center', query: false, queryType: 'textarea', set: true,flowEdit:true, require: false , width:180,style:{width: '180px'}},
        //     { field: 'disposal', title: '处置流程', query: true, align: 'left', queryType: 'input', set: true, require: true,flowEdit:true, width:180 },
        //     { field: 'decsisonState', title: '处置结论', en_title: 'PN', align: 'left', query: false, queryType: 'select',flowEdit:true, width:180, cellStyle: 'color:red', editReadonly: true, set: false, require: false },
        //     { field: 'scopeDesc', title: '异常描述', query: false, align: 'left', queryType: 'input', set: true,flowEdit:true, require: false , width:180},
        //     { field: 'udf1', title: '不良数量', query: false, align: 'left', queryType: 'input', set: true,flowEdit:true, require: false , width:180},
        //     { field: 'udf2', title: '影响数量', query: false, align: 'left', queryType: 'input', set: true,flowEdit:true, require: false, width:180 },
        //     { field: 'udf4', title: '影响工序', query: false, align: 'left', queryType: 'input', set: true,flowEdit:true, require: false , width:180},
        //     { field: 'lotNo', title: '批次', query: false, align: 'left', queryType: 'input', set: true,flowEdit:true, require: false, width:180},
        //     { field: 'udf6', title: '用户', query: false, align: 'left', queryType: 'text-userProp',userProp:'realName', set: true,flowEdit:true, require: false, width:180}
     ],  
      initSelect:{
        projectMode: [{iformItem:{}}]
      },
      initCheckBox:{},
      initRadioBox:{},
      formData:{
        projectMode: ''
      },
      formStyle:{},
      defaultForm: {params:undefined},
      self :this,
      formModes:[],
      formModules: [],
      value: this.componentModalObj[this.fieldName],
      compVal: '',
      fileData: {},
      iform:{},
      loading:{},
      iformFile:{},
      fileList: [],
      formItem:{},
    }
    Object.assign(_initdata.formData, this.initData(_initdata.cols))
    return _initdata
  },
  watch: {
    formData: {
      handler: (newVal, oldVal) => {
       // console.log(newVal, oldVal)
      },
      deep: true
    },
    'component.elementCode':{
        handler: function (newVal, oldVal) {
        if (newVal) {
            this.initConf(newVal)
        }
      },
      deep: true
    },
    compVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
        }
      },
      deep: true
    },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {


        }
      },
      deep: true
    },
  },
  computed: {},
  created() {
      this.initConf(this.component.elementCode)
  },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    enterNative(formEnter,item){
      if(formEnter.enterNative && typeof formEnter.enterNative==='function'){
         formEnter.enterNative.call(this,this.iform,formEnter,item)
      }
    },
   async viewFile(e,fn,row,column,a,url,row_record) {
        if(column==undefined)
          {
            this.$message.error("没有选择文件存储字段属性")
            return
          }
        let fName = fn;
        //let row_record = {...row,ROW_RECORD:'ID',FIELD:"FILE_NAME",ROW_INDEX_ONLY:'ID'}  
        if (fName && fName.split(';').length > 1) {
          let data = {fileName: fName.split(';')[a],details:row_record}
          let resData = await this.$fileView('',fName.split(';')[a],row,data,url)
          let fileIndex = fName.split(';')[a].lastIndexOf('.'), fileType = fName.split(';')[a].substr(fileIndex+1);
          await this.$refs.docuView.init(fName.split(';')[a],fileType,resData)
        } else {
         let data = {fileName:fn,details:row_record}
         let resData1 = await this.$fileView('',fName,row,data,url)
         let fileIndex = fName.lastIndexOf('.'), fileType = fName.substr(fileIndex+1);
          await this.$refs.docuView.init(fName,fileType,resData1)
        }
        
      },

    handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        this.$nextTick(()=>{
          const ele = this.$el

        if(ele){
          dispatchEvent(ele,tag,args)
        }
        })
      },
    handleRemove(file, fileList) {
            // console.log(file, fileList,this.$refs.upload);
        },
    handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
    dataUpload(item) {
            this.fileData = item.file;
        },
    uploadFunc(file) {
          const isLtSize = file.size / 1024 / 1024 < 10;
          if (!isLtSize) {
              this.$message.error('上传图片大小不能超过 10MB!');
              // this.$refs.uploadDel[0].clearFiles()
          }
    },
    //<!-- 上传文件弹窗按钮 -->
    save(formName) {
        let fa = new FormData();
        fa.append('file',this.fileData);
        fa.append('fileName',this.formData.fileName);
        fa.append('aliasName',this.formData.aliasName);
        this.defaultForm.row = {}
        this.iform[iformItem.dialogVisible].params.id = '';
        const _dataUpload = { url: this.url.upload, params: fa};
        this.$refs[formName].validate((valid) => {
          if (valid) {
                    // 上传文件
                    this.$store.dispatch('fmsCommon/actionTaskPost', _dataUpload)
                        .then(data => {
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.dialogFormVisible = false
                            this.query()
                        }).catch(err => {
                            console.error(err)
                        }).finally(() => {
                            this.destory()
                        })
                       
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            })
            this.destory()
          }
        })
      },
      clearFormData(form) {
        for (let p in form) {
          if (form.hasOwnProperty(p)) {
              form[p] = ''
          }
        }
      },
    formRender(){
      //延迟渲染页面
       this.formModes = this.formModules
    },  
    // 搜索栏下拉select数据获取方法
    initFormSelOptionData(url,selParamArr,selArrData,item,callback) {
            let pageParams = {}
            if (item.itemParams){
              pageParams = item.itemParams
            } else {
              return
            }  
            //let that = this, newData = [];// { current:1,pageSize: 1000,requestData: {} };
            const _data = {url: url, params: pageParams}
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
    initConf(scr){
       if(scr===undefined || scr===null || scr==='')
       return
        let json =  eval("("+scr+")") //JSON.parse(val.scripts)
            if(json && json.formModes){
                if(!json.lazy){
                  this.formModes = json.formModes
                }
                this.formModules = json.formModes
                this.formStyle = json.formStyle
                json.formModes.forEach(item => {
                 this.$set(this.iform,item.dialogVisible,{})
                 this.$set(this.loading,item.dialogVisible,false)
                 this.$set(this.iform[item.dialogVisible],"params",{})  
                 this.$set(this.iformFile,item.dialogVisible,{})

                  if(item.forms && item.forms.length){
                      let fieldFile = {}
                      this.$set(this.iformFile[item.dialogVisible],'fileList',{})
                      
                      this.$set(this.formItem,item.dialogVisible,{})
                      item.forms.forEach(_form=>{

                        if(_form.queryType==='attachment'){
                          this.$set(this.iformFile[item.dialogVisible]['fileList'],_form.field,[])
                        } else if (_form.queryType === 'select') {
                            if (_form.selUri) {
                              let selArrData = []
                              this.initFormSelOptionData(_form.selUri, _form[_form.field],selArrData,_form,(data) => {
                                this.$set(this.initSelect, _form.field, data)
                              })
                            } else {
                              this.$set(this.initSelect,_form.field,_form[_form.field])
                            }
                            
                        } else if (_form.queryType === 'checkbox') {
                          this.$set(this.initCheckBox,_form.field,_form[_form.field])
                        } else if (_form.queryType === 'radio') {
                          this.$set(this.initRadioBox,_form.field,_form[_form.field])
                        }
                      })
                    }
                    
                    if(item.forms && item.forms.length){
                      item.forms.forEach(fo =>{
                        this.$set(this.iform[item.dialogVisible].params,fo.field,undefined)
                        this.$set(this.formItem[item.dialogVisible],fo.field,fo)
                      })
                    }
                });
                return json.formModes
            }
    },
    getStyleCols() {
      return [
        { field: 'width', title: 'width', queryType: 'input', defaultValue: '100%', unit: 'px' },
        { field: 'height', title: 'height', queryType: 'input', defaultValue: 'auto', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    comText() {
      return '表单'
    },
    ificationType() {
      return {
        classification: '布局容器组件',
        isCanvasview: false,
      }
    },
    initData(arr) {
           const args = {}
              arr.map(c => {
                if (c.set) {
                  args[c.field] = null
                }
              })
              return args
      },
    methodFunc(callback,v1,v2){
        const self = this
        if(callback && typeof callback==='function')
          return callback(self,v1,v2)
     },
     onchange(callback,v1,v2,v3){
        const self = this
        if(callback && typeof callback==='function')
          return callback(self,v1,v2,v3)
     }, 
    display(item,flow){
        if(item.attr && item.attr.display && typeof item.attr.display==='function'){
              return item.attr.display(item,flow)
            }
          else {
            return true
          }   
      },
      required(item){
        if(item.require)
           {
            if(item.attr && item.attr.require && typeof item.attr.require==='function'){
              return item.attr.required(item)
            }
            return item.require
           }
         else if(item.attr && item.attr.require && typeof item.attr.require==='function')  
         return item.attr.required(item)
        else
           return false
      },
      disabled(item,flow){

         if(item.attr && item.attr.disabled && typeof item.attr.disabled==='function')
          {
            return item.attr.disabled(item,flow)
          }
          else {
            return false
          }    
      },
      readonly(item,flow){
         if(item.attr && item.attr.readonly && typeof item.attr.readonly==='function')
          {
            return item.attr.readonly(item,flow)
          }
          else {
            return false
          }        
      },
    handleDragStart(event) {
      // event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    inputchange(val) {
      // console.log(val)
    },
  },

}
</script>
<style lang="scss" scoped>
::deep input[aria-hidden="true"] {
    display: none !important;
}
 
::deep .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
}
</style>