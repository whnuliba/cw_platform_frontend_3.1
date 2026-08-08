<template class="cuttingsmallvolume">
  <div>
    <el-button :disabled="tabdisabled" style="margin-bottom:10px;margin-right:10px;"  type="primary"  size="small"  class="filter-item" @click="addTableData">{{ '新增' }}</el-button>
    <el-button :disabled="tabdisabled" style="margin-bottom:10px;margin-right:10px;"  type="primary"  size="small"  class="filter-item" @click="batchSave">{{ '批量保存' }}</el-button>
    <el-button :disabled="tabdisabled" style="margin-bottom:10px;"  type="primary"  size="small"  class="filter-item" @click="marking">{{ '打标' }}</el-button>
    <el-button type="primary" size="small"  class="filter-item" @click="marking1">{{ '自定打标' }}</el-button>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails" show-summary :summary-method="getSummaries">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols" v-if="!item.hide && item.tableinput" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align">
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
      </el-table-column>
      <el-table-column v-for="(item) in cols" v-if="!item.hide  && !item.tableinput" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align">
        <template slot-scope="scope">
          <el-input @input="(val)=>{changeIpt(val,item,scope)}" v-model="scope.row[item.field]" style="height:38px" :disabled="item.writedisabled" />
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="200">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <el-button  type="primary"  size="small"  class="filter-item" @click="saveRowData(scope)">{{ '保存' }}</el-button>
          <el-button  type="warning"  size="small"  class="filter-item" @click="del(scope.$index,scope.row)">{{ '删除' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->

    <el-dialog v-el-drag-dialog title="生产完成" :visible.sync="dialogFormVisible" width="700px">
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
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." style="width:180px;" @change="$forceUpdate()">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='datetime'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" style="width: 180px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='date'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly" type="date" :placeholder="commonI18n(item)" style="width: 180px" />
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
     <el-dialog v-el-drag-dialog title="打标" :visible.sync="dialogMarkingVisible" width="400px">
        <div style="margin-bottom: 5px;">
          <el-button type="primary" size="small"  class="filter-item"  v-print="printObj">{{ '打印' }}</el-button>

        </div>
        <div id="myPrint">
          <!-- <div class="barcodebox" v-for="(item,ind) in barcodeValue">
            <barcode  :value="item"  height=40 >
              条形码显示失败
            </barcode>
          </div> -->
          <table border="1"  class="cabel_table"  v-for="(item,ind) in barcodeValue" style="margin-bottom: 23px;"> 
            <tr class="tablehead">
              <td colSpan='4'>
                {{item.electrode == 1 ? '正极分切标识卡' : item.electrode == 2 ? '负极分切标识卡' : '分切标识卡'}}
              </td>
            </tr>
            <tr>
              <td class="leftlable">:型号</td>
              <td colSpan='2' class="rightdata">{{item.model}}</td>
              <td colSpan='1' width="18%" rowspan="4" style="padding: 3px;">
                <qrcode id="QrCode" :text="item.qrCode" />

              </td>
            </tr>
            <tr>
              <td class="leftlable">:批次</td>
              <td colSpan='2'  class="rightdata">{{item.lotNo}}</td>
            </tr>
            <tr>
              <td class="leftlable">:卷号</td>
              <td colSpan='2' class="rightdata">{{item.volumeNo+'-'+item.smallVolumeNo}}</td>
            </tr>
            <tr>
              <td class="leftlable">:良品/不良标</td>
              <td colSpan='2' class="rightdata">{{item.outNums+'/'+item.defectMark}}</td>
            </tr>
            <tr>
              <td class="leftlable">:操作员</td>
              <td width="18%" class="rightdata">{{item.opUser}}</td>
              <td style="text-align: right; padding-right: 3px; font-size: 12px;">检验员:</td>
              <td width="28%" class="rightdata">{{item.fqcUser}}</td>
            </tr>
           
            <!-- <tr>
              <td class="leftlable">:日期</td>
              <td colSpan='2' class="rightdata">{{item.endtime}}</td>
            </tr> -->
            <tr>
              <td width="35%" class="leftlable">:碾压完成时间</td>
              <td colSpan='3' class="rightdata">{{item.pressureEndtime}}</td>
            </tr>
            <tr>
              <td class="leftlable">:分切完成时间</td>
              <td colSpan='3' class="rightdata">{{item.endtime}}</td>
            </tr>
            <tr>
              <td colSpan="4" class="barcode" >
                <div>
                  <barcode :value="item.barCode" :margin="0" :displayValue="false"  :height="14" :fontSize="14" :width="1">
                  条形码显示失败
                  </barcode>
                </div>
               
              </td>
            </tr>
            <!-- <tr>
              <td colSpan="2" class="barcode" >
                <div>
                  <barcode :value="'F-YXD23B20TA-47-1'" :margin="0" :displayValue="true"  height=25 :fontSize="14" :width="1">
                  条形码显示失败
                  </barcode>
                </div>
               
              </td>
              
              
            </tr> -->
          </table>

        </div>
    </el-dialog>
    <print-preview ref="preView"/>

  </div>

</template>

<script>
import printPreview from './preview'
import qrcode from './qrcode'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'Homogenate',
  components: { Pagination, qrcode, printPreview},
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
    orderNo: String,
    activeName1:String,
  },
  data() {
    const _initdata = {
      table_mark: 'pm_homogenate_list',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      dialogMarkingVisible: false,
      tabdisabled: false,
      sn: '',
      barcodeValue: [],
      url: {
        add: '/cuttingSmallVolume/add',
        edit: '/cuttingSmallVolume/edit',
        del: '/cuttingSmallVolume/del',
        list: '/cuttingSmallVolume/list',
        selectByCuttingId: '/cuttingSmallVolume/guest/selectByCuttingId',
        submit: '/homogenate/completeProduct',
        printBarCode:'/cutting/printBarCode'
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
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
      list: [],
      ordarData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'orderNo', title: '工单', align: 'left', query: true, queryType: 'input', set: false, require: false, tableinput: true,width:130 },
        { field: 'mwindNo', title: '大卷号', align: 'left', query: false, queryType: 'input', set: true, require: false, tableinput: true, },
        { field: 'swindNo', title: '小卷号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'defectMark', title: '不良标识', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'inQty', title: '投入数', align: 'left', query: false, queryType: 'input', set: true, require: false,writedisabled:true },
        { field: 'inQty', title: '投入数', align: 'left', query: false, queryType: 'input', set: true, require: false},
        { field: 'subLotNo', title: '子批次', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'nums', title: '良品数', align: 'left', query: false, queryType: 'input', set: true, require: false,writedisabled:true },
        { field: 'upNums', title: '本段裁片数', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'qcPeople1', title: '质检人', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'downNums', title: '后段裁片数', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'remark', title: '备注', align: 'left', query: false, queryType: 'input', set: true, require: false },
      ],
      printObj: {
        id: "myPrint", // 这里是要打印元素的ID
        popTitle: "&nbsp", // 打印的标题
        extraCss: "", // 打印可引入外部的一个 css 文件
        extraHead: "", // 打印头部文字
      },
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  watch: {
    orderNo: function(val) {
      this.queryParams.requestData.orderNo = val
      this.getList()
      this.selectOptions()
    },
    activeName1(val){
      if(val == 'an1Tab1'){
        this.list = []
        this.total = 0
        // this.tabdisabled = true

      }else{
        // this.total = false
      }
    },
  },
  created() {
    /* this.initCustomVol(data => {
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
    }) */

    this.listLoading = false
    //this.getList()
    this.selectOptions()
  },
  methods: {
    marking1(row){
      let printdata = ''
      const _data1 = {url:'/page-conf/guest/biz-type-code',params:{data:{bizCode:'print_cutting',bizType:'打印条码'}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data1)
      .then(data => {
        printdata = data[0].scripts
      }).catch(err => {
          console.error(err)
      })
       const _data = { url: this.url.printBarCode, params: {id:this.queryParams.cuttingId}}
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.barcodeValue = data
          this.$refs.preView.show1(printdata,data)

          // this.dialogMarkingVisible = true
        }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.destory()
      })
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 1 || index === 2 || index === 3 || index === 6 || index === 9 || index === 10) {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            // sums[index] = 'N/A';
          }
        });

        return sums;
    },
    changeIpt(val,colums,scope){
      // console.log(colums.field)
      if(colums.field=='inQty'||colums.field=='defectMark'||colums.field=='upNums'){
        scope.row.nums=Number(scope.row.inQty)-Number(scope.row.defectMark)*Number(scope.row.rate)-Number(scope.row.upNums)
      }
      if(colums.field=='qcPeople1'){
        this.list.forEach(item=>{
          this.$set(item, "qcPeople1", val);

        })
      }
    },
    marking(){
      if(this.queryParams.cuttingId){
        const _data = { url: this.url.printBarCode, params: {id:this.queryParams.cuttingId}}
        this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          console.log(data);
          this.barcodeValue = data
          this.dialogMarkingVisible = true
        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.destory()
        })
      }else{
        this.$message({
          type: 'error',
          message: '请先选中分切工单'
        })
      }
      
    },
    batchSave(){
      let savebollen = this.list.some(item =>{
         if (!item.swindNo) {return true}
      })
      let saverate = this.list.some(item =>{
         if (!item.rate) {return true}
      })
      if(savebollen || saverate){
        if(savebollen){
          this.$message({
            type: 'error',
            message: '小卷号必填'
          })
        }else{
          this.$message({
            type: 'error',
            message: '系数不存在'
          })
        }
       
      }else{
        // console.log(this.list);
        this.list.forEach(params=>{
          params.defectMark = params.defectMark ? Number(params.defectMark) : 0
          params.inQty = params.inQty ? Number(params.inQty) : 0
          params.nums = params.nums ? Number(params.nums) : 0
          params.upNums = params.upNums ? Number(params.upNums) : 0
        })
        const _data = {url:'/cuttingSmallVolume/saveByList',params:this.list}
        this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
           this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.getList()
        }).catch(err => {
          console.error(err)
        })
      }
     
    },
    saveRowData(scope){
      let params = {...scope.row}
      console.log(params)
      params.defectMark = params.defectMark ? Number(params.defectMark) : 0
      params.inQty = params.inQty ? Number(params.inQty) : 0
      params.nums = params.nums ? Number(params.nums) : 0
      params.upNums = params.upNums ? Number(params.upNums) : 0
      params['cuttingId'] = this.queryParams.cuttingId
      if(params.swindNo && params.rate){
        
        if(scope.row.id){
          const _data = {url:this.url.edit,params: {data:params}}
          this.$store.dispatch('fmsCommon/actionProductPost',_data)
          .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.getList()
          }).catch(err => {
            console.error(err)
          })
        }else{
          const _data = {url:this.url.add,params: {data:params}}
          this.$store.dispatch('fmsCommon/actionProductPost',_data)
          .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.getList()
          }).catch(err => {
            console.error(err)
          })
        }
      }else{
        if(!params.swindNo){
          this.$message({
            type: 'error',
            message: '小卷号必填'
          })
        }else{
          this.$message({
            type: 'error',
            message: '系数不存在'
          })
        }
         
      }
     
     
    },
    addTableData(){
      if(this.queryParams.cuttingId){
        // this.total = this.total + 1
        let obj = this.initData(this.cols)
        obj['orderNo'] = this.ordarData.orderNo
        obj['mwindNo'] = this.ordarData.mwindNo
        obj['cuttingId'] = this.ordarData.id
        obj['rate'] = this.list[0].rate
        this.list.unshift(obj);
      }else{
        this.$message({
          type: 'error',
          message: '请先选中分切工单'
        })
      }
    },
    reloadData(val) {
      // this.queryParams.requestData.cuttingId = val
      this.ordarData = val
      this.queryParams['cuttingId'] = val.id
      this.getList()
      this.selectOptions()
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
      const _data = { url: this.url.selectByCuttingId, params: {cuttingId : this.queryParams.cuttingId} }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.list = data.map(item=>{
            item.nums=Number(item.inQty)-Number(item.defectMark)*Number(item.rate)-Number(item.upNums)
            return item
          })
          // this.list = data
          // this.total = data.total
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
    showDetails(row, column) {
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
      const _data = { url: this.url.submit, params: this.defaultForm.params}
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

<style lang="less" scoped>
.cuttingsmallvolume{
  /deep/ .el-table {
  display: flex;
  flex-direction: column;
}

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
/deep/ .el-table__body-wrapper {
  order: 1;
}
/deep/ .el-table__fixed-body-wrapper {
  top: 68px !important;
}

/deep/ .el-table__fixed-footer-wrapper {
  z-index: 0;
}
/deep/ .el-table__footer-wrapper>table{
  margin: 0!important;
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
#myPrint{
  width: 100%;
  display:flex;
  flex-wrap: wrap;
}
.barcodebox{
  width: 50%;
}
.cabel_table{
  border-collapse:collapse;
  border:1px solid #000;

  width:300px;
}
.cabel_table:nth-child(1){
  margin-top: 3px;
}
.cabel_table:last-child{
  margin-bottom: 0!important;
}
.cabel_table tr{
    border:1px solid #000;
    /* font-weight: bold; */
    color: black;
}

.leftlable{
  direction: rtl ;
  padding-right: 3px;
  font-size: 12px;
  width: 33%;
  border-right:1px solid #000;
}
.rightdata{
  padding-left: 3px;
  font-size: 12px;
  
}
.tablehead>td{
  border: none !important;

}
.tablehead>td{
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  border: none !important;

}

.cabel_table>tr>td {
  color: black;
}
.barcode div{
  width: 100%;
  display: flex;
  justify-content: center;
  /* padding-left: 30%; */
}
}

</style>
<style media="print">
@page {
  size: auto;
  margin: 3mm;
}

html {
  background-color: #ffffff;
  height: auto;
  margin: 0px;
}



</style>
