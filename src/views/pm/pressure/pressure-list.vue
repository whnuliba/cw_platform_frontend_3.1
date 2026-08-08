/** 
* 生产执行 - 碾压
**/ 
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
      <!-- <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'pressure_add'}">
        {{ $t("common.btn.add") }}
      </el-button> -->
    </div>
    <el-table :cell-style="setRowStyle" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="rowClick">

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
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="230">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <!-- <el-button  type="warning"  size="small"  class="filter-item" @click="del(scope.$index,scope.row)">{{ '删除' }}</el-button> -->
          <el-button type="primary" size="small"  class="filter-item" @click="marking1(scope.row)">{{ '自定打标' }}</el-button>
          <el-button type="primary" size="small"  class="filter-item" @click="marking(scope.row)">{{ '打标' }}</el-button>
          <el-button type="primary" size="small" class="filter-item" @click="edit(scope.row)">{{ '编辑' }}</el-button>
        
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px" top="1%">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in editcols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="130px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input  @input="(val)=>{changeIpt(val,item)}" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            label-width="130px"
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
        <!-- <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button> -->
        <!-- v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" -->
        <el-button  type="primary" v-debounce @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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

    <el-dialog v-el-drag-dialog title="打标" :visible.sync="dialogMarkingVisible" width="500px">
        <div>
          <el-button type="primary" size="small"  class="filter-item" v-print="printObj">{{ '打印' }}</el-button>

        </div>
        <div id="myPrint">
          <table  class="cabel_table" border="1">
            <tr class="tablehead" style=" border-left: 1px solid #000;">
              <td colSpan='2'>
                碾压标识卡
              </td>  
              <td  rowspan='3' width="33%" style="font-size: 38px;">
               {{barcodeValue.volumeNo}}
              </td>           
            </tr>
            <tr>
              <td class="leftlable">:型号</td>
              <td class="rightdata">{{barcodeValue.model}}</td>
              
            </tr>
            <tr>
              <td class="leftlable">:批次</td>
              <td class="rightdata">{{barcodeValue.lotNo}}</td>
            </tr>
            <tr>
              <td class="leftlable">:大卷号</td>
              <td colSpan='2' class="rightdata">{{barcodeValue.volumeNo}}</td>
            </tr>
            <tr>
              <td class="leftlable">:数量</td>
              <td colSpan='2' class="rightdata">{{barcodeValue.outNums}}</td>
            </tr>
            <tr>
              <td class="leftlable">:时间</td>
              <td colSpan='2' class="rightdata">{{barcodeValue.endtime}}</td>
            </tr>
            <tr>
              <td colSpan="3" class="barcode" >
                <div>
                  <barcode :value="barcodeValue.barCode" :margin="0"  height=35 :fontSize="16" :width="1">
                  条形码显示失败
                  </barcode>
                </div>
               
              </td>
              
              
            </tr>
          </table>
         
        </div>
    </el-dialog>
    <print-preview ref="preView"/>


  </div>

</template>

<script>
import printPreview from './preview'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import debounce from '@/directive/button/btnDebounce'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'pressure-list',
  components: { Pagination, printPreview},
  directives: { waves, elDragDialog,debounce },
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
      dialogMarkingVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      barcodeValue: {},
      value: new Date(),
      url: {
        add: '/pressure/add',
        del: '/pressure/del',
        list: '/pressure/list',
        submit: '/pressure/completeProduct',
        printBarCode:'/pressure/printBarCode',
      },
      printObj: {
        id: "myPrint", // 这里是要打印元素的ID
        popTitle: "&nbsp", // 打印的标题
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }],
        transitionStatus: [{ label: '待分切', value: 0 }, { label: '已下转', value: 1 }, { label: '静置超时', value: 2 }],
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
      ngnumArr: [],
      selectViewCol: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'deviceNo', title: '设备编码', align: 'left', query: true, queryType: 'input', set: true, require: false },
        { field: 'deviceName', title: '设备名称', align: 'left', query: true, queryType: 'input', set: false, require: false },
        { field: 'orderNo', title: '工单', align: 'left', query: true, queryType: 'input', set: true, require: false },
        { field: 'barCode', title: '条码', align: 'left', query: true, queryType: 'input', set: true, require: false },
        { field: 'mwindNo', title: '大卷号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'electrode', title: '极性', align: 'center', query: true, queryType: 'select', set: true, require: false, width:50 },
        { field: 'inStation', title: '上料时间', width: '150', align: 'center', query: false, queryType: 'input', set: true, require: false },
        { field: 'outStation', title: '出料时间', width: '150', align: 'center', query: false, queryType: 'input', set: true, require: false },
        // { field: 'fqc', title: 'FQC状态', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'pn', title: '产品编码', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'person', title: '工号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'realName', title: '人员', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'workShfit', title: '班次', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'productState', title: '生产状态', align: 'left', query: false, queryType: 'input', set: false, require: false },
        { field: 'transitionStatus', title: '转序状态', align: 'left', query: false, queryType: 'input', set: false, require: false },
        { field: 'pressureNo', title: '碾压工单号', width: '150', align: 'left', query: false, queryType: 'input', set: false, require: false },
        { field: 'coatId', title: '涂布ID', align: 'left', hide: true, query: false, queryType: 'input', set: true, require: false },
      ],
      editcols:[
        { field: 'chenck', title: '检测', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'ulVolume', title: '上下卷', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'slurryLoss', title: '浆料损耗', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'leakFoil', title: '漏箔', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'oneSide', title: '单面', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'scratchDark', title: '划痕', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'dark', title: '暗痕', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'bubble', title: '气泡', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'fold', title: '褶皱', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'damage', title: '破损', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'techSamp', title: '技术取样', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'poorClearance', title: '间隙不良', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'tapeBroken', title: '接带', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'broken', title: '断带', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'volcanicCrater', title: '火山坑', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'particle', title: '颗粒', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'dropMaterial', title: '掉料', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'burr', title: '毛刺', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'poorWidth', title: '片宽不良', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'downshift', title: '降档', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'surfaceMac', title: '面密调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'sizeMac', title: '尺寸调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'thicknessMac', title: '厚度调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'bubbleMac', title: '气泡漏箔调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'badMac', title: '间隙不良调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'bodFoilMac', title: '箔材不良调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'foilCrimpMac', title: '箔材打皱调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'leakFoilMac', title: '漏箔调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'foilMac', title: '掉料调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'burrMac', title: '毛刺调机', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'emptyFoil', title: '空箔', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'upturnedEdge', title: '翘边', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'spiral', title: '螺旋', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'ccdMisjudgment', title: 'CCD误判', align: 'left', query: false, queryType: 'input', set: true, require: false,ngnum:true },
        { field: 'inputQty', title: '投入数量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'ngQty', title: '总NG数量', align: 'left', query: false, queryType: 'input', set: true, require: false,editReadonly:true },
        { field: 'okQty', title: '总OK数量', align: 'left', query: false, queryType: 'input', set: true, require: false,editReadonly:true },
        { field: 'qcPeople1', title: '质检人1', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'qcPeople2', title: '质检人2', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'subLotNo', title: '子批次', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other1', title: '少转数', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other2', title: 'OTHER2', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other3', title: 'OTHER3', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other4', title: 'OTHER4', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other5', title: 'OTHER5', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other6', title: 'OTHER6', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'other7', title: 'OTHER7', align: 'left', query: false, queryType: 'input', set: true, require: false },
      ],
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.editcols))
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
    marking1(row){
      let printdata = ''
      const _data1 = {url:'/page-conf/guest/biz-type-code',params:{data:{bizCode:'print_pressure',bizType:'打印条码'}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data1)
      .then(data => {
        printdata = data[0].scripts
      }).catch(err => {
          console.error(err)
      })
       const _data = { url: this.url.printBarCode, params: {data:{id:row.id}}}
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
     setRowStyle(row, column, rowIndex, columnIndex) {
      if(row.column.label=== "极性"){
        if(row.row.electrode == 1){
          return 'background: #1dbf97;color:#fff'
        }else{
          return 'background: #fab428;color:#fff' 
        }
      }
    },
     marking(row){
       const _data = { url: this.url.printBarCode, params: {data:{id:row.id}}}
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.barcodeValue = data
          this.dialogMarkingVisible = true
        }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.destory()
      })
    },
    changeIpt(val,item){
      let Sumnumarr = []

      if(this.ngnumArr.includes(item.field)){
        this.ngnumArr.forEach(item1=>{
          Sumnumarr.push(Number(this.defaultForm.params[item1]))
        })
        this.defaultForm.params['ngQty'] = eval(Sumnumarr.join("+"))
        this.defaultForm.params['okQty'] = Number(this.defaultForm.params.inputQty)-Number(this.defaultForm.params.ngQty)
        // this.defaultForm.params['ngQty'] = Number(this.defaultForm.params['ngQty'])+Number(val)
      }
      if(item.field == 'inputQty'){
        this.defaultForm.params['okQty'] = Number(this.defaultForm.params.inputQty)-Number(this.defaultForm.params.ngQty)
      }
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
      const _data = { url: this.url.list, params: this.queryParams }
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
      let Sumnumarr = []
      this.ngnumArr = []
      this.editcols.forEach(item=>{
        if(item.ngnum == true){
          this.ngnumArr.push(item.field)
          Sumnumarr.push(Number(row[item.field]))
        }
      })
      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
      this.defaultForm.params['ngQty'] = eval(Sumnumarr.join("+"))
      this.defaultForm.params['okQty'] = Number(row.inputQty)-Number(row.ngQty)

      // console.log(row);
      // console.log(this.defaultForm.params);
    },
    submit(formName) {
      this.ngnumArr.forEach(item=>{
        if(!this.defaultForm.params[item]){
          this.defaultForm.params[item] = 0
        }
      })
      if(!this.defaultForm.params['inputQty']){
        this.defaultForm.params['inputQty'] = 0
      }
      if(!this.defaultForm.params['ngQty']){
        this.defaultForm.params['ngQty'] = 0
      }
      if(!this.defaultForm.params['okQty']){
        this.defaultForm.params['okQty'] = 0
      }
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

      const _data = {url:'/homogenate/productStates',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
      .then(data => {
        this.initSelect['productState'] = data.map(c=>{
               return {
                 label:c.name,
                 value:c.value
               }
        })
      }).catch(err => {
        console.error(err)
      })
    },
    // save(formName) {
    //   this.defaultForm.row = {}
    //   this.defaultForm.params.id = ''
    //   const _data = { url: this.url.add, params: { data: this.defaultForm.params }}
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$store.dispatch('fmsCommon/actionProductPost', _data)
    //         .then(data => {
    //           this.$message({
    //             type: 'success',
    //             message: 'change success!=>' + data
    //           })
    //           this.dialogFormVisible = false
    //           this.query()
    //         }).catch(err => {
    //         console.error(err)
    //       }).finally(() => {
    //         this.destory()
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '输入数据不能为空'
    //       })
    //       this.destory()
    //     }
    //   })
    // },
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
.el-form-item {
  margin-bottom: 2px;
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
.cabel_table{
  border-collapse:collapse;
  border:1px solid #000;

  width:300px;
}
.cabel_table tr{
    border:1px solid #000;
    font-weight: bold;
    color: black;
}

.leftlable{
  direction: rtl ;
  padding-right: 3px;
  font-size: 18px;
  width: 24%;
  border-right:1px solid #000;
}
.rightdata{
  padding-left: 3px;
}
.tablehead>td{
  font-size: 18px;
  text-align: center;
}

.cabel_table>tr>td {
  font-weight: bold;
  color: black;
}
.barcode div{
  width: 100%;
  display: flex;
  justify-content: center;
  /* padding-left: 30%; */
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

