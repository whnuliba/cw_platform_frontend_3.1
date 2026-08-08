<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in search_cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 200px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-input @keydown.enter.native="onScan"  v-if="item.query && item.queryType==='keyinput'" v-model="queryParams.requestData[item.field]" placeholder="请扫描条码" style="width: 200px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 200px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="commonI18n(item)"
            :value="item.value"
          />
        </el-select>
        <el-select v-if="item.query && item.queryType==='filter-select'" :filter-method="(val) => {return dataSelectFilter(val, item)}" :filterable="true" v-model="queryParams.requestData[item.field]" :disabled="allowDisable && item.editReadonly" :placeholder="commonI18n(item)"  class="filter-item">
              <el-option v-for="it in initSelectFilter[item.field]"
                         :key="it.value"
                         :label="it.label"
                         :value="it.value">
              </el-option>
            </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
      </div>
      <!-- <el-button type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button> -->
      <!-- <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'cutting_add'}">
        {{ $t("common.btn.add") }}
      </el-button> -->
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
      <!-- <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="120">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
       
        <template slot-scope="scope">
          <el-button :disabled="commonFilter(scope.row['productState'],'productState') === '生产完成'" type="primary"  size="small"  class="filter-item" @click="completeProduct(scope.row)">{{ '生产完成' }}</el-button>
        </template>
      </el-table-column> -->
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
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'Cutting',
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
      code: '',
      lastCode: '',
      nextCode: '',
      nextTime: 0,
      lastTime: 0,
      barCode: [],
      table_mark: 'pm_cutting_list',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      // value: new Date(),
      url: {
        add: '/bakewindingNums/add',
        del: '/bakewindingNums/del',
        list: '/bakewindingNums/list',
        submit: '/bakewindingNums/completeProduct',
      },
      queryParams: {
        requestData: { }
      },
      initSelectFilter:{
        lineType:[],
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'lotNo', title: '批次号', align: 'left', query: true, queryType: 'input', set: true, require: false,width:100 },
        { field: 'volumeNo', title: '卷号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'electrode', title: '极性', align: 'left', query: false, queryType: 'select', set: true, require: false },
        { field: 'scanTime', title: '扫描时间', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'barcode', title: '条码', align: 'left', query: false, queryType: 'input', set: true, require: false },
      ],
      search_cols: [
        { field: 'lineType', title: '卷绕线别', align: 'left', query: true, queryType: 'filter-select', set: true, require: false,width:100 },
        { field: 'remark', title: '备注', align: 'left', query: true, queryType: 'input', set: true, require: false,width:100 },
        { field: 'lotNo', title: '请扫码条码', align: 'left', query: true, queryType: 'keyinput', set: true, require: false },
      ]
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
  
    dataSelectFilter(val,item){
         let field = item.field
         if(val && field==='lineType'){
          const _data2 = { url: '/equipmentMain/query-eqm-lst',params: {data: val}}
            this.$store.dispatch('fmsCommon/actionTpmPost', _data2)
            .then(data => {
             // this.orderNoData = data
              this.initSelectFilter['lineType'] = data.map(c=>{
                return {
                  label:c.deviceName+'|'+c.deviceNo,
                  value:c.deviceNo
                  
                }
              })
              }).catch(err => {
                console.error(err)
          })
         }
      },
    onScan(e) {
      if (e.defaultPrevented) return;
      if (e.key !== undefined) {
        if (e.key !== "shift" && e.key !== "Enter") {
          this.nextCode = e.key;
          this.nextTime = new Date().getTime();
          // 从单个文本输入时间判断是扫码还是键盘输入 
          if (this.lastCode !== null && this.lastTime !== null && this.nextTime - this.lastTime <= 30) {  // 扫码输入
            this.barCode.push(e.key)
            this.code += this.lastCode;  // 拼接条码值
          } else if (this.lastCode !== null && this.lastTime !== null && this.nextTime - this.lastTime > 100) { // 键盘输入
            this.barCode = [];
          }
          this.lastTime = this.nextTime;
          this.lastCode = this.nextCode;
        }

        if (e.key === "Enter" && this.barCode.length !== 0) {  // 扫码触发回车事件
          // let str = this.barCode.join("")
          // this.barCode = [];
          // let arr = str.split("-");
          /*---------------------------------------------*/
          let barCode = this.queryParams.requestData['lotNo'];
          if (barCode) {  // 光标在请扫码的input框中
            let lotNo = barCode && typeof (barCode) === "string" ? barCode.split("-") : false;
            if (!lotNo) {
              this.$message.warning("此标签条码数据有误")
              return;
            }
            this.onSearchFinish(lotNo[0], lotNo[1], lotNo[2]);
          } else { // 光标不在请扫码的input框中
            let barCodeNot = this.code;
            this.code = "";
            let lotNo = barCodeNot && typeof (barCodeNot) === "string" ? barCodeNot.split("-") : false;
            if (!lotNo) {
              this.$message.warning("此标签条码数据有误")
              return
            }
            this.onSearchFinish(lotNo[0], lotNo[1], lotNo[2]);
          }

        } else if (e.key === "Enter") {  // 按键触发回车事件
          let isSave = true;
          let lotNo = this.queryParams.requestData['lotNo'];
          let newLotNo = (lotNo && lotNo.indexOf("-") > 0) ? lotNo.split("-") : [];
          newLotNo.forEach(item => {  // 判断输入后除了"-"的每一个字符是否为空
            if (!item) {
              isSave = false
            }
          })
          if (lotNo && newLotNo.length <= 4 && (newLotNo[0] === "Z" || newLotNo[0] === "F") && isSave) {
            this.onSearchFinish(newLotNo[0], newLotNo[1], newLotNo[2])
          } else {
            this.$message.warning("标签码输入错误!")
          }

        }

      } else if (e.keyCode !== undefined) {
        if (e.keyCode !== 16) {
          this.barCode.push(String.fromCharCode(e.keyCode))
        }
        if (e.keyCode === 13) {
          let str = this.barCode.join('')
          let arr = str.split(String.fromCharCode(189))
          this.onSearchFinish(arr);
        }
      }
      e.stopPropagation();
    },
    GMTToStrStandard(time) {
      let date = new Date(time);
      let strMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      let strDate = date.getDate() >= 0 && date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();
      let strHours = date.getHours() >= 0 && date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
      let strMinutes = date.getMinutes() >= 0 && date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
      let strSeconds = date.getSeconds() >= 0 && date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();
      let Str = date.getFullYear() + '-' +
        strMonth + '-' +
        strDate + ' ' +
        strHours + ':' +
        strMinutes + ':' +
        strSeconds;
      if (Str === "NaN-NaN-NaN NaN:NaN:NaN")
        Str = "";
      return Str
    },
    onSearchFinish(electrode, lotNo, volumeNo) {
      let formValue = this.queryParams.requestData,
        scanTime = this.GMTToStrStandard(new Date());
      if (formValue.lineType) {
        let params = {
          lineType: formValue.lineType,
          remark: formValue.remark,
          electrode: (electrode && electrode.slice() === "Z") ? 1 : 2,
          lotNo: lotNo,
          volumeNo: volumeNo,
          scanTime: scanTime,
          barCode: formValue.lotNo
        }
        const _data = { url: this.url.add, params: {data:params} }
        this.$store.dispatch('fmsCommon/actionProductPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'add success!=>' + data
            })
            this.query()
          }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.destory()
          })
      } else {
        this.$message.warning("请输入卷绕线别!")
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
      let param = {...this.queryParams}
      param.requestData = {}
      const _data = { url: this.url.list, params: param }
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
