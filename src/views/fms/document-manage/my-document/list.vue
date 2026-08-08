/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: /.../
 * @Description: 文档管理--我的文档
 */
<template>
    <div class="app-container">
      <div class="filter-container">
        <div v-for="(item,index) in cols" :key="index" style="display:inline">
          <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
            <!-- {{queryParams.requestData[item.field]=''}} -->
          </el-input>
          <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
            <el-option
              v-for="item in initSelect[item.field]"
              :key="item.value"
              :label="commonI18n(item)"
              :value="item.value"
            />
          </el-select>
          <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
          <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
        </div>
        <el-button type="primary" class="filter-item" @click="query">
          {{ $t("common.btn.query") }}
        </el-button>
        <el-button type="info" class="filter-item" @click="reset">
          {{ $t("common.btn.reset") }}
        </el-button>
        <el-button type="primary" class="filter-item" @click="fileUpload">
          <i class="el-icon-upload2" />{{ '文件上传' }}
        </el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
  
        <el-table-column min-width="50px" :label="$t('common.no')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item) in cols" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="350">
          <template slot-scope="scope">
            <span v-for="item in tableBtns" :key="item.key">
                <el-button :type="item.type" :icon="item.icon" :style="{margin: '0 3px'}"  size="small" class="filter-item" @click="contralBtn(scope.row, item.key)">{{item.name}}</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog v-el-drag-dialog :title="modalText" :visible.sync="dialogFormVisible" width="700px" @close="modalClose">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
          <div v-for="(item) in formCols" :key="item.id" style="display:inline">
            <el-form-item
              v-if="item.set && item.queryType==='input'"
              :label="commonI18n(item)"
              :prop="item.field"
              label-width="120px"
              :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
            </el-form-item>
            <el-form-item
              v-if="item.set && item.queryType==='select'"
              :label="commonI18n(item)"
              label-width="120px"
              :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
            >
              <el-select v-model="defaultForm.params[item.field]" placeholder="..." @change="$forceUpdate()" style="width:180px;">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
            </el-form-item>
            <el-form-item  v-if="item.set && item.queryType==='date'"  :label="commonI18n(item)" :prop="item.field" >
              <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
            </el-form-item>
            <el-form-item  v-if="item.set && item.queryType==='button'"  :label="commonI18n(item)" :prop="item.field" :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
                <el-upload
                  class="upload-demo"
                  action="#"
                  ref="uploadDel"
                  :http-request="dataUpload"
                  :on-remove="handleRemove"
                  :before-upload="uploadFunc"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">文件不超过10M</div>
                </el-upload>
            </el-form-item>
          </div>
  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
          <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
          <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>
      <!-- 预览页面 -->
      <DocuView ref="docuView" :viewTitle="viewTitle" />
    </div>
  
  </template>
  
  <script>
  import waves from '@/directive/waves'; 
  import elDragDialog from '@/directive/el-drag-dialog';
  import Pagination from '@/components/Pagination' ;
  import i18n from '@/lang';
  import DocuView from '@/components/FileView/index';
  import axios from 'axios';
  import { getToken } from '@/utils/auth';
  import {downloadXlsx, docDownload, pdfDownload, imgDownload, videoDownload} from '@/utils/docu-download';
  export default {
    name: 'Pressure',
    components: { Pagination, DocuView },
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
    props: {},
    data() {
      const _initdata = {
        viewTitle:'',
        frameUrl: '',
        type: '',
        modalText: "",
        fileData:{},
        fileList: [],
        tableBtns: [
            {key:'edit', name:'编辑', type:'primary', icon: 'el-icon-edit'},
            {key:'view', name:'预览', type:'primary', icon: 'el-icon-view'},
            {key:'download', name:'下载', type:'primary', icon: 'el-icon-download'},
            {key:'dele', name:'删除', type:'warning', icon: 'el-icon-delete'},
        ],
        table_mark: 'pm_pressure_list',
        dialogFormVisible: false,
        allowDisable: false,
        dialogSelectFieldVisible: false,
        value: new Date(),
        url: {
          add: '/file/add',
          edit: '/file/edit',
          del: '/file/del',
          list: '/file/list',
          upload: '/file/upload'
        },
        queryParams: {
          requestData: { }
        },
        initSelect: {},
        defaultForm: {
          row: {},
          params: {
            id: ''
          }
        },
        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        selectViewCol: [],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          { field: 'aliasName', title: '文件别名', align: 'left', query: false, queryType: 'input', set: true, require: false },
          { field: 'fileName', title: '文件名', align: 'left', query: true, queryType: 'input', set: true, require: false },
          { field: 'fileOrg', title: '文件所属组织', align: 'left', query: false, queryType: 'input', set: true, require: false },
          { field: 'filePath', title: '文件路径', align: 'left', query: false, queryType: 'input', set: true, require: false },
        ],
        formCols: [
          { field: 'aliasName', title: '文件别名', align: 'left', query: false, queryType: 'input', set: true, editReadonly:true,require: true },
          { field: 'fileName', title: '文件名', align: 'left', query: true, queryType: 'input', set: true, editReadonly:true, require: true },
          { field: 'fileOrg', title: '文件所属组织', align: 'left', query: true, queryType: 'input', set: true, editReadonly:true, require: false },
          { field: 'filePath', title: '文件路径', align: 'left', query: true, queryType: 'input', set: true, editReadonly:true, require: false },
          { field: 'upload', title: '打开文件', align: 'left',  queryType: 'button', set: true, require: false },
        ],
        rowId:"",
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
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
      this.getList()
      this.selectOptions()
    },
    methods: {
        modalClose() {
          this.$refs.uploadDel[0].clearFiles()
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
      //  文件上传
      fileUpload() {
        this.modalText = this.$t('common.btn.add')
        this.allowDisable = false
        this.destory(true)
      },

      contralBtn(row, key) {
        switch (key) {
            case 'edit':
              this.modalText = this.$t('common.btn.edit')
              this.dialogFormVisible = true;
              this.allowDisable = true;
              this.rowId = row.id;
              for (const p in this.defaultForm.params) {
                  if (this.defaultForm.params.hasOwnProperty(p)) {
                      this.defaultForm.params[p] = row[p]
                  }
              }
                break;
            case 'view':  
                let type = row.fileType;
                this.viewTitle = row.fileName;
                if (type == ".docx" || type == ".doc" || type == ".xls" || type === '.xlsx' || type == ".pdf" || 
                    type == ".jpg" || type == ".jpeg" || type == ".png") {
                      this.$refs.docuView.init(row.fileType, row);
                } else if (type == '.mp4') {
                      this.$refs.docuView.init(row.fileType, row);
                } else {
                      this.$message.warning('该文件格式无法预览!')
                }
                
                break;
            case 'dele':
                this.$confirm(`确定删除${row.fileName}吗?`, '提示信息', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    const _data = {url:'/file/delete',params:{data: row.id}}
                        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                        .then(res => {
                            this.$message({
                                    type: 'success',
                                    message: '删除成功'
                            })
                            this.query();
                        }).catch(err => {
                            console.error(err)
                        })
                })
                break;
            case 'download':
                let fileType = row.fileType;
                var resType = 'arraybuffer';
                if (fileType === '.xls' ||  fileType === '.pdf') {
                    resType = 'arraybuffer'
                } else if (fileType === '.docx' || fileType === '.jpg' || fileType === '.png' || fileType === '.mp4'){
                    resType = 'blob'
                }
  
                axios.request({
                        method: "post", 
                        url: '/bak-mes-task/file/download', 
                        data: {data: row.id},
                        responseType: resType, //"arraybuffer", //告诉服务器想到的响应格式
                        headers: {
                            'my-accept-lang': i18n.locale,
                            'Authorization': 'Bearer ' + getToken(),
                            'X-Token': getToken()
                        },
                    }).then(res => {
                        switch (fileType) {
                          case '.docx':
                            docDownload(res.data, `${row.aliasName}.docx`);
                            break;
                          case '.xls':
                          case '.xlsx':
                            downloadXlsx(res.data, `${row.aliasName}.xls`);
                            break;
                          case '.pdf':
                            pdfDownload(res.data, `${row.aliasName}.pdf`);
                            break;
                          case '.jpg':
                          case '.png':
                          case '.jpeg':
                            imgDownload(res.data, `${row.aliasName}.jpg`);
                            break;
                          case '.mp4':
                          case '.rm':
                          case '.rmvb':
                          case '.wmv':
                            videoDownload(res.data, `${row.aliasName}.mp4`);
                            break;
                          default:
                            this.$message.warning('该文件格式无法下载!')
                            break;
                        }
                        
                    }).catch(err => {
                        console.error(err)
                    }) 
                break;
            default:
                break;
        }
      },
      initCustomVol(callback) {
        const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo') }
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

      initData(arr) {
        const args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
      },
      commonFilter(value, type) {
        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: this.url.list, params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })

      },
    //   表格文本转义函数
      getValueConvert(arr, value) {
        for (const v of arr) {
          if (v.value == value) {
            return v.label
          }
        }
        return value
      },

      destory(hide = false) {
        this.dialogFormVisible = hide
        for (const p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }
      },
  
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (const p in this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      selectOptions() {
      },
      save(formName) {
        let fa = new FormData();
        fa.append('file',this.fileData);
        fa.append('fileName',this.defaultForm.params.fileName);
        fa.append('aliasName',this.defaultForm.params.aliasName);
        this.defaultForm.row = {}
        this.defaultForm.params.id = '';
        const _dataUpload = { url: this.url.upload, params: fa};
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$store.dispatch('fmsCommon/actionTaskPost', _addParams)
            //     .then(data => {
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
                        
                // }).catch(err => {
                //     console.log(err)
                // })
            
          } else {
            this.$message({
              type: 'error',
              message: '输入数据不能为空'
            })
            this.destory()
          }
        })
      },
      submit(formName) {
        let fa = new FormData();
        fa.append('file',this.fileData);
        fa.append('fileName',this.defaultForm.params.fileName);
        fa.append('aliasName',this.defaultForm.params.aliasName);
        this.defaultForm.row = {}
        const _dataUpload = { url: this.url.upload, params: fa};
        const _editParams = { url: this.url.edit, params: {data: this.defaultForm.params} };

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionTaskPost', _editParams)
                .then(data => {
                    // 上传文件
                    this.$store.dispatch('fmsCommon/actionTaskPost', _dataUpload)
                        .then(data => {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            })
                            this.dialogFormVisible = false
                            this.query()
                        }).catch(err => {
                            console.error(err)
                        }).finally(() => {
                            this.destory()
                        })
                        
                }).catch(err => {
                    console.log(err)
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
      del(index, row) {
        this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
          confirmButtonText: i18n.t('common.btn.ok'),
          cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          const _data = { url: this.url.del, params: { data: row.id }}
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.list.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'delete success!'
              })
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          })
        })
      }
  
    }
  }
  </script>
  
  <style scoped>
  .edit-input {
  
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .filter-item{
    margin-left: 3px;
  }
  .model-factory{
    position: relative;
    width: 500px;
    height: calc(100vh - 120px);
    float: left;
    background: #D4D7D7;
  }
  .model-workshop{
    width: calc(100% - 505px);
    height: calc(100vh - 120px);
    float: left;
    margin-left:5px ;
    background: #D4D7D7;
  }
  </style>
  