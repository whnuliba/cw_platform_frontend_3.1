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
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="primary"   class="filter-item" @click="upload" v-ele-show="{btnCode:'mes_barcode_import'}">
        导入
      </el-button>
      <el-button type="primary"   class="filter-item" @click="classification" v-ele-show="{btnCode:'arch_barcodes'}" >
        归档
      </el-button>
      <el-button type="primary"   class="filter-item" @click="lockBarcodes" v-ele-show="{btnCode:'lineMaterial_lock_barcodes'}" >
        冻结/解冻
      </el-button>
      
      <!-- <el-upload
        class="upload-demo"
        multiple
        :limit="3"
      >
        <el-button  type="primary">导入</el-button>
      </el-upload> -->

    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="rowClick">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
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
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer
            v-model="selectColumn.fields"
            :titles="['源字段', '目标字段']"
            :data="selectColumn.colMap"
          />
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="导入" :visible.sync="dialoguploadVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" label-width="80px">
        <el-form-item
            label="导入文件:"
            prop="导入文件"
            label-width="120px"
          >
          <el-upload
                  class="upload-demo"
                  action="#"
                  ref="uploadDel"
                  :http-request="dataUpload"
                  :on-remove="handleRemove"
                  :before-upload="uploadFunc"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv,.csv"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">当前限制选择 1 个文件,文件不超过10M</div>
                </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toupload">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="归档" :visible.sync="dialogclassificationVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" label-width="80px">
        <el-form-item
            label="归档文件:"
            prop="归档文件"
            label-width="120px"
          >
          <el-upload
                  class="upload-demo"
                  action="#"
                  ref="uploadDel"
                  :http-request="dataUpload"
                  :on-remove="handleRemove"
                  :before-upload="uploadFunc"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv,.csv"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">当前限制选择 1 个文件,文件不超过10M</div>
                </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toclassification">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="冻结/解冻" :visible.sync="dialoglockBarcodesVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" label-width="80px">
        <el-form-item
            label="归档文件:"
            prop="归档文件"
            label-width="120px"
          >
          <el-upload
                  class="upload-demo"
                  action="#"
                  ref="uploadDel"
                  :http-request="dataUpload"
                  :on-remove="handleRemove"
                  :before-upload="uploadFunc"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv,.csv"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">当前限制选择 1 个文件,文件不超过10M</div>
                </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tolockBarcode">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'index',
  components: { Pagination },
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
    // 外部传入的内容，用于实现双向绑定
    // value: String,
  },
  data() {
    const _initdata = {
      table_mark: 'pm_pressure_list',
      dialogFormVisible: false,
      dialoguploadVisible: false,
      dialogclassificationVisible: false,
      dialoglockBarcodesVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      value: new Date(),
      url: {
        add: '/pressure/add',
        del: '/pressure/del',
        list: '/pressure/list',
        submit: '/pressure/completeProduct',
        items:'/line-barcode/items',
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }]
      },
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
      fileData: null,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        // { field: 'orderNo', title: '工单', align: 'left', query: true, queryType: 'input', set: true, require: false, width:130 },
        { field: 'wno', title: '仓库编码', align: 'left', query: true, queryType: 'input', set: true, require: false,width:100 },
        { field: 'wloc', title: '位置信息', align: 'left', query: false, queryType: 'input', set: true, require: false,width:100 },
        { field: 'wtype', title: '仓库类型', align: 'left', query: false, queryType: 'select', set: true, require: false },
        // { field: 'administory', title: '管理员', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'materialNo', title: '物料编号', align: 'left', query: true, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'materialName', title: '物料名称', align: 'left', query: true, queryType: 'input', set: true, require: false, width:200 },
        { field: 'barcode', title: '物料条码', align: 'left', query: true, queryType: 'input', set: true, require: false, width:150 },
        { field: 'procurement', title: '采购单号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'vendorNo', title: '供应商编码', align: 'left', query: true, queryType: 'input', set: true, require: false, width:100 },
        { field: 'vendorName', title: '供应商名称',hide:false, align: 'left', query: false, queryType: 'select', set: true, require: false, width:100 },
        { field: 'productTime', title: '生产时间', align: 'center', query: false, queryType: 'input', set: true, require: false, width:150 },
        { field: 'inTime', title: '入库时间', align: 'center', query: false, queryType: 'input', set: true, require: false, width:150 },
        { field: 'useState', title: '领用状态', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'receiptNo', title: '入库单号', align: 'left',hide:false, query: false, queryType: 'input', set: true, require: false },
        { field: 'qty', title: '基本数量', align: 'right', query: false, queryType: 'input', set: true, require: false },
        { field: 'unit', title: '基本单位', align: 'center', query: false, queryType: 'input', set: true, require: false },
        { field: 'materialId', title: '物料ID', align: 'left', hide: true, query: false, queryType: 'input', set: true, require: false },
        { field: 'isPack', title: '最小包装', align: 'left', query: false, queryType: 'select', set: true, require: false },
        { field: 'securityQty', title: '安全库存', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'wid', title: '仓库ID', hide: true, align: 'left', query: false, queryType: 'input', set: false, require: false },
        
        { field: 'prueflos', title: '检验批', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znAtwrt5', title: '工序', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znQualityStatus', title: '品质状态', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znSubBatch', title: '子批次', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znSingleGroup', title: '单独配组', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdSystem', title: '体系(代码)', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znCap', title: '分容日期', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znClassa', title: 'A品分类(级别)', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdMod', title: '生产型号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znClass', title: '等级', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdBatch', title: 'BAK生产批次', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'matterInfo', title: '物料描述', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'matterCode', title: '物料编码', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'boxunit', title: '标签单位', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'boxunitqty', title: '标签数量', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'produceDate', title: '生产日期', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'produceBatch', title: '生产批号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'partnerName', title: '供应商名称',hide:false, align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'partnerbp', title: '供应商账号',hide:false, align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'packType', title: '包装类型', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'projectId', title: '采购订单信息', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'orderId', title: '采购订单号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'refItemNo', title: '交货单行项目', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'refDocNo', title: '交货单号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'charg', title: 'SAP流水批', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    // this.initCustomVol(data => {
    //   if (data && data.length > 0) {
    //     const fds = data.map(c => c.item)
    //     this.cols.forEach(item => {
    //       if (fds.indexOf(item.field) >= 0) {
    //         item.hide = false
    //       } else {
    //         item.hide = true
    //       }
    //     })
    //   }
    // })
    // this.getList()
    this.selectOptions()
  },
  methods: {
      tolockBarcode(){
        this.$confirm("确认执行操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let fa = new FormData();
            fa.append('file',this.fileData);
            this.dialoguploadVisible = false
            const _data = { url: '/lineMaterial/lock-barcodes', params: fa}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                })
                // this.fileData = null
              }).catch(err => {
              console.error(err)
            }).finally(() => {
              this.destory()
            })
          });
     
     },
      toclassification(){
        this.$confirm("确认执行操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let fa = new FormData();
            fa.append('file',this.fileData);
            this.dialoguploadVisible = false
            const _data = { url: '/lineMaterial/arch-barcodes', params: fa}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                })
                // this.fileData = null
              }).catch(err => {
              console.error(err)
            }).finally(() => {
              this.destory()
            })
          });
     
     },
     toupload(){
      let fa = new FormData();
      fa.append('file',this.fileData);
      this.dialoguploadVisible = false
      const _data = { url: '/lineProcessBarcodePack/material-upload-file', params: fa}
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          // this.fileData = null
        }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.destory()
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
      upload(){
        this.dialoguploadVisible = true
      },
      classification(){
        this.dialogclassificationVisible = true
      },
      lockBarcodes(){
        this.dialoglockBarcodesVisible = true
      },
     completeProduct(row){
      const _data = { url: this.url.submit, params: {id:row.id}}
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.dialogFormVisible = false
          this.query()
        }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.destory()
      })

    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row)
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
    selectFields() {
      this.dialogSelectFieldVisible = true
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

      const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo'), items: arr }
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
      const _data = { url: this.url.items, params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
        }).catch(err => {
        console.error(err)
      })
      //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
    },

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
    add() {
      this.allowDisable = false
      this.destory(true)
    },
    edit(row) {
      this.dialogFormVisible = true
      this.allowDisable = true

      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    submit(formName) {
      const _data = { url: this.url.add, params: {
          data: this.defaultForm.params
        }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
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
      // 初始化线体信息

      // 初始化工序信息

    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: this.url.add, params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
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
.upload-demo{
  display: inline-block;
  margin: 0px 0px 10px 3px;
}

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
  margin-bottom: 0px;
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
