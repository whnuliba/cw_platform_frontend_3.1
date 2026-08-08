/*
*  create: 宋丹峰
*  生产信息 - 组盘信息
*  update: (...)
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline" class="trayno-style">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                 :placeholder="item.title" :style="{width: item.field === 'trayNo'? '180px': '120px'}" class="filter-item"
                  >
                  <!-- @dblclick.native="item.field === 'trayNo'? inputClick() : ''" -->
                  <i slot="suffix"
                   :class="item.field === 'trayNo'? 'el-input__icon el-icon-search': 'xxx'"
                   @click="item.field === 'trayNo'? inputClick() : ''"  title='点击弹出批量搜索弹窗'/>
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
               filterable   :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>

      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
     <el-button type="warning" class="filter-item" @click="add">
        组盘
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
              @row-dblclick="showDetails">

      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
    {{ $t("common.btn.edit") }}
  </el-button>
  &nbsp;
  <el-button type="warning" v-ele-show="{btnCode:'DEL_TOOL_INFO'}" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
    {{ $t("common.btn.delete") }}
  </el-button>-->
          <el-button type="primary" size="small" v-if="scope.row.trayNo!='' && scope.row.trayNo!=null"
                     v-ele-show="{btnCode:'BREAK_UP'}" icon="el-icon-edit" @click="unbind(scope.row)">
            {{ $t("common.btn.unbind") }}
          </el-button>
          <el-button type="warning" v-ele-show="{btnCode:'UPDATE_PROCESS_TARY'}" size="small" icon="el-icon-edit"
                     @click="openChangeProcDialog(scope.row)">
            {{ $t("common.btn.changCellProc") }}
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="details(scope.row)">
            {{ $t("common.btn.details") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <!-- 托盘编码textArea批量输入弹窗 -->
    <FormIndex
      ref='inputDialog'
      :modalTitle="'托盘编码批量查询'"
      :formColumns='formColumns'
      :textareaWidth="'350px'"
      :placeholderText="'输入内容请用逗号分隔开'"
      :modalTemp="modalTemp"
      @testOnFinish="testOnFinish"
    />

    <el-dialog title="组盘" v-el-drag-dialog :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="托盘编码">
              <el-input v-model="handBindCell.trayNo" @input="getPlatInfo()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工序">
              <el-select v-model="handBindCell.processId" filterable @change="$forceUpdate()" placeholder="请选择">
                <el-option v-for="item in initSelect.processId"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电池状态">
              <el-select v-model="handBindCell.cellState" filterable @change="$forceUpdate()" placeholder="请选择">
                <el-option v-for="item in initSelect.cellState"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="cellListChannel"
          border
          id="table-form"
          max-height="400"
          style="width: 100%;">
          <el-table-column
            prop="channel"
            label="通道"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            label="电芯条码">
            <template slot-scope="scope" :style="{width: '100%',height: '100%'}">
              <el-input v-model="scope.row.cellBarCode"
                        @keyup.native.enter="nextFocus($event,scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataDecompose" type="info"> 数据分解</el-button>
        <el-button @click="dialogFormVisible=false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="handBindCellClick()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogChangeProcessFormVisible" width="700px">
      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-select v-model="changeProcess.processId" filterable @change="$forceUpdate()" placeholder="请选择">
          <el-option v-for="item in initSelect.processId"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeProcessFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="changCellProc()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>



    <el-dialog title="电芯条码" v-el-drag-dialog :visible.sync="dataDecomposeFormVisible" width="700px">
      <el-form ref="form" :model="dataDecomposeData" label-width="80px">
         <el-input type="textarea" v-model="dataDecomposeData.cells"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataDecomposeFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="dataChange()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>

    <!--显示明细-->
    <el-dialog :title="'['+trayNo+']明细'" v-el-drag-dialog :visible.sync="pltinfoDetailsVisible">
      <component :key="componentYesOrNo" :is="dtsOfswitch" ref="pltinfoDetailsList"
                 :pltinfoDetailsList="pltinfoDetailsList"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pltinfoDetailsVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import pltinfoDetailsList from './components/pltinfo-details'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  import FormIndex from '@/components/modal/formIndex'

  export default {
    name: 'CellList',
    components: {Pagination, pltinfoDetailsList,FormIndex},
    directives: {waves, elDragDialog},
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '未启用',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    data() {
      const _initdata = {
        formColumns: [
          {
            title: '托盘编码',
            key:'trayNo',
            type: 'textarea'
          }
        ],
        modalTemp: {
          trayNo: ''
        },
        cellListChannel: [],
        handBindCell: {
          trayNo: '',
          processId: '',
          cellState: '',
          cells: '',
        },
        dataDecomposeData:{
          cells:'',
        },
        dialogFormVisible: false,
        dialogChangeProcessFormVisible: false,
        dataDecomposeFormVisible: false,
        pltinfoDetailsList: '',
        trayNo: '',
        pltinfoDetailsVisible: false,
        dtsOfswitch: 'pltinfoDetailsList',
        componentYesOrNo: true,
        queryParams: {
          requestData: {}
        },
        changeProcess: {
          currentProcess: '',
          trayNo: '',
          processId: ''
        },
        initSelect: {
          trayType: [],
          status: [{label: '正常组盘', value: 0}, {label: '申请拆盘', value: 1}],
          processId: []
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
          }
        },
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          {field: 'id', title: 'id', hide: true, minWidth: 100, align: "center"},
          {
            field: 'trayNo',
            title: '托盘编码',
            minWidth: 100,
            align: "center",
            query: true,
            queryType: 'input',
            set: true,
            require: true
          },
          {
            field: 'trayType',
            title: '托盘类型',
            minWidth: 100,
            align: "center",
            query: true,
            queryType: 'select',
            set: true,
            require: true
          },{
            field: 'orderId',
            title: '托盘工艺',
            minWidth: 100,
            align: "center",
            query: true,
            queryType: 'select',
            set: true,
            require: true
          },
          {
            field: 'status',
            title: '使用状态',
            align: 'center',
            queryType: 'select',
            set: true,
            filter: true,
            require: true
          },
          {field: 'createUser', title: '创建人', align: 'center', queryType: 'date'},
          {field: 'createTime', title: '创建日期', align: 'center', queryType: 'date'},

        ],
        inputDoms: [],
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.getList()
      this.selectOptions()
    },
    updated() {
      this.initInputDOM();
    },
    methods: {
      inputClick() {
          this.$refs.inputDialog.modalOpen();
      },
      // 电芯条码onfinish
      testOnFinish(val) {
         let msg = val.trayNo;
          //加g是替换字符串里出现的所有\n，不加g是替换字符串里出现的第一个\n
          if (val.trayNo && val.trayNo.indexOf('\n') > 0) {
             msg = val.trayNo.replace(/\n/g, ',')
          }
          let param = {
            requestData: {trayNo: msg}
          }
          if (msg && typeof(msg) === 'string' && msg.split(',').length > 30) {
            this.$message({
                message: "单次批量查询托盘超过30PCS,请减少查询数量！",
                type: 'warning',
            })
            return
          }
          this.queryParams = {
            requestData: {trayNo: msg}
          }

          this.listLoading = true
          Object.assign(param, this.listQuery)
          const _data = {url: '/plt/list', params: param}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data, 600 * 1000)
            .then(data => {
              this.list = data.data
              this.total = data.total
              this.listLoading = false
            }).catch(err => {
            console.error(err)
          })
      },
      dataChange(){
        if(this.dataDecomposeData.cells.length < 1){
          this.$message({
            type: 'error',
            message: '电芯条码不能为空，请检查!'
          });
          return false;
        }
        let cellArray = JSON.stringify(this.dataDecomposeData.cells).replaceAll('"',"").split("\\n");
        let listOld = [];
        for (let i = 0; i < cellArray.length; i++) {
           if(i<36){
             listOld.push({channel: i + 1, cellState: 0, cellBarCode: cellArray[i]})
           }
        }
        if(cellArray.length < 36){
          for (let i = cellArray.length ; i < 36 ; i++) {
            listOld.push({channel: i + 1, cellState: 0, cellBarCode: cellArray[i]})
          }
        }
        this.cellListChannel = listOld;
        this.dataDecomposeFormVisible = false;
      },
      dataDecompose(){
        this.dataDecomposeFormVisible = true;
      },
      initInputDOM() {
        //获取id为table-form下的所有input 框
        const inputDoms = document.querySelectorAll(
          ".el-table__body .el-input__inner"
        );
        //遍历这个input框给他们一个标识
        inputDoms.forEach((item, index) => {
          item.setAttribute("data-index", index);
        });
        this.inputDoms = inputDoms;
      },
      nextFocus(event, row) {
        const index = event.target.getAttribute("data-index");
        const nextIndex = parseInt(index) + 1;
        const length = this.inputDoms.length;
        if (nextIndex < length) {
          this.inputDoms[nextIndex].focus();
        } else {
          this.inputDoms[0].focus();
        }
      },
      handBindCellClick() {
        this.handBindCell.cells = this.cellListChannel;
        console.log(this.handBindCell)
        if(!this.checkDataBind()){
          return false;
        }
        // /plt/hand-bind-cell
        let _data = {url: '/plt/hand-bind-cell', params: {data: this.handBindCell}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.dialogFormVisible = false;
            this.getList()
          }).catch(err => {
        })
      },

      checkDataBind(){
        if(this.handBindCell.trayNo.length < 1){
          this.$message({
            type: 'error',
            message: '托盘编号不能为空，请检查!'
          });
          return false;
        }
        if(this.handBindCell.cells.length < 1){
          this.$message({
            type: 'error',
            message: '电芯条码不能为空，请检查!'
          });
          return false;
        }
        if(this.handBindCell.cellState.length < 1){
          this.$message({
            type: 'error',
            message: '电芯状态不能为空，请检查!'
          });
          return false;
        }
        if(this.handBindCell.processId.length < 1){
          this.$message({
            type: 'error',
            message: '工序不能为空，请检查!'
          });
          return false;
        }
        return true;
      },
      getPlatInfo() {
        this.cellListChannel = []
        let trayNo = this.handBindCell.trayNo;
        if (trayNo.length == 19) {
          let num = 0;
          // /plt/guest/get-plt_tray_no
          let _data = {url: '/plt/guest/get-plt_tray_no', params: {data: trayNo}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              if (data == null || data.length == 0) {
                this.$message({
                  type: 'error',
                  message: '当前托盘' + trayNo + '未定义，请检查!'
                });
                return;
              }
              if (data.actId != null && data.actId != "") {
                this.$message({
                  type: 'error',
                  message: '当前托盘' + trayNo + '已经存在组盘记录，请检查!'
                });
                return;
              }
              let width = data.cellNumber;
              for (let i = 1; i <= width; i++) {
                this.cellListChannel.push({channel: i, cellState: 0, cellBarCode: ""});
              }
            }).catch(err => {
          })
        }else{
          this.$message.error("当前托盘号["+trayNo+"]不正确,请确认后输入!")
        }
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
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = {url: '/plt/list', params: this.queryParams}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
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
      details(row) {
        this.trayNo = row.trayNo
        this.pltinfoDetailsList = row.trayNo
        this.componentYesOrNo = !this.componentYesOrNo;
        this.pltinfoDetailsVisible = true
      },
      openChangeProcDialog(row) {
        this.changeProcess.trayNo = row.trayNo
        this.changeProcess.processId = row.processId
        this.dialogChangeProcessFormVisible = true
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
      changCellProc() {
        this.$confirm(i18n.t("common.tip_info.change_process_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/cell/update-process-by-tray', params: {data: this.changeProcess}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.dialogChangeProcessFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
        });
      },
      add() {
        this.destory(true)
      },
      showDetails(row, column) {
      },
      edit(row) {
        this.dialogFormVisible = true
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = row[p]
          }
        }
      },
      submit(formName) {
        const _data = {
          url: '/tool/add', params: {
            data: this.defaultForm.params
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionFmsPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
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
            });
            this.destory()
          }
        });
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (let p in  this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      selectOptions() {
        //初始化电池状态
        let _data = {url: '/CwCellStateCodeController/state/all', params: {}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.cellState = data.map(c => {
              return {
                label: c.stateName,
                value: c.stateValue
              }
            }).sort((a, b) => {
              let namea = a.value
              let nameb = b.value
              if (namea < nameb) {
                return -1
              }
              if (namea > nameb) {
                return 1
              }
              return 0;
            });
          }).catch(err => {
          console.error(err)
        }),

          //初始化线体信息
          _data = {url: '/constant/tool-type', params: {}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.trayType = data.map(c => {
              return {
                label: c.name,
                value: c.value
              }
            })
          }).catch(err => {
          console.error(err)
        }),
          //初始化工序信息
          _data = {url: '/process/getall', params: {}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.processId = data.map(c => {
              return {
                label: c.processName,
                value: c.id
              }
            }).sort((a, b) => {
              let namea = a.label
              let nameb = b.label
              if (namea < nameb) {
                return -1
              }
              if (namea > nameb) {
                return 1
              }
              return 0;
            });
          }).catch(err => {
          console.error(err)
        })

        /**获取动态工艺名称*/
        const json = {data: 'PROCESS.FLOW'}
        _data = {url: '/sys/get-param-by-code', params: json}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data)
          .then(data => {
            console.log(data)
            this.initSelect.orderId = data.map(c => {
              return {
                label: c.paramKey,
                value: c.paramValue
              }
            })
          }).catch(err => {
          console.error(err)
        })


      },
      save(formName) {
        this.defaultForm.row = {}
        this.defaultForm.params.id = ''
        let _data = {url: '/tool/add', params: {data: this.defaultForm.params}}
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionFmsPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
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
            });
            this.destory()
          }
        });


      },
      del(index, row) {
        this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/tool/del', params: {data: row.id}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.list.splice(index, 1)
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
      unbind(row) {
        this.$confirm(i18n.t("common.tip_info.unbind_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/plt/break-up', params: {data: row.id}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'unbind success!'
              });
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel unbind'
          });
        });
      }
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

  .trayno-style {
        .el-input__icon {
            font-size: 20px;
            &:hover {
              cursor:pointer
              }
        }
    }
  /* .div-tray-details{
    height: 400px;
    overflow-y:scroll;
  } */
</style>
