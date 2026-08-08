<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
               <el-input  v-if="item.query && item.queryType==='inputSelect'" v-model="queryParams.requestData[item.field]"  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select clearable    v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"  :filterable="true"  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>

          </div>
          <div>
          <el-button type="primary"  style="width: 120px"   class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"   style="width: 120px"  class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
           <!-- v-ele-show="{btnCode:'ADD_TOOL_INFO'}" -->
           <el-button type="warning" v-ele-show="{btnCode:'wcs_pltinfo_add'}" style="width: 120px" class="filter-item" @click="add">
               {{ $t("common.btn.add") }}
           </el-button>
          </div>
        </div>
     <el-table v-loading="listLoading" :data="list" :span-method="objectSpanMethod" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
      <el-table-column width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id"  :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column :sortable="false"  v-for="(item) in cols"   :key="item.id"  :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field,item.queryType)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_pltinfo_edit1'}"    icon="el-icon-edit" @click="edit(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-ele-show="{btnCode:'wcs_pltinfo_del'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog class="plt-info" :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="900px" >
      
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="100px" size="mini">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="((item.addSet&&addDiag)||(item.set&&!addDiag)) && item.queryType==='input'"  :label="commonI18n(item)" :prop="item.field" :show-message="false"
            :rules="[{ required: item.require, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable" $forceUpdate()-->
             <el-input  v-model="defaultForm.params[item.field]"  :disabled="allowDisable && item.editReadonly" style="width:180px;"  />
          </el-form-item>
          <!-- 为了远程搜索 -->
          <el-form-item  v-if="((item.addSet&&addDiag)||(item.set&&!addDiag))&& item.queryType==='inputSelect'"  :label="commonI18n(item)" :prop="item.field" :show-message="false"
            :rules="[{ required: item.require, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
             <el-autocomplete @select="handleSelect" :placeholder="$t('const.pleaseInput')" :fetch-suggestions="querySearchAsync"  v-model="defaultForm.params[item.field]"  :disabled="allowDisable && item.editReadonly" style="width:180px;"  />
          </el-form-item>
           <el-form-item  v-if="((item.addSet&&addDiag)||(item.set&&!addDiag)) && item.queryType==='select'"  :label="commonI18n(item)" 
            :rules="[{ required: item.require, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
           >
              <el-select clearable   :filterable="true" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="changeOption(defaultForm.params[item.field],item)" :placeholder="$t('const.pleaseSelect')" style="width:180px;">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item  v-if="((item.addSet&&addDiag)||(item.set&&!addDiag)) && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <el-form :inline="true" label-width="80px" size="mini"> 
        <!-- --------- -->
        <hr>
        <p><span style="color:#0000FF"><b>{{translateText('pltGroup')}}</b></span></p>
        <el-form-item>
            <el-button @click="addDomain" v-if ="addDiag" style="background-color:Gold">{{translateText('addPlt')}}</el-button>
        </el-form-item>
        <div class="plt-cells">
          <div v-for="(domain, index) in defaultForm.pltGroup" 
            :label="translateText('plt') + index+1+':'"
            :key="domain.key" style="display:inline">
            <el-form-item :label="translateText('pltCode')" prop="pltCode">
              <el-input v-model="defaultForm.pltGroup[index].pltCode"  :disabled="allowDisable && true" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item :label="translateText('loadState')" prop="pltLoadState" >
              <el-select clearable  v-model="defaultForm.pltGroup[index].pltLoadState" 
              @change="changeOptionLoadState(defaultForm.pltGroup[index].pltLoadState,defaultForm.pltGroup[index])" style="width:100px;">
                <el-option v-for="item in initSelect['pltLoadState']" :key="item.value" :value="item.value" :label="item.label" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="translateText('matlCount')" prop="matlCount" label-width="90px">
              <el-input-number v-model="defaultForm.pltGroup[index].matlCount" :min="0" :max="400" ></el-input-number>
            </el-form-item>
            <el-form-item :label="translateText('remark')" prop="pltRemark" label-width="70px">
              <el-input v-model="defaultForm.pltGroup[index].pltRemark" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button  @click.prevent="removeDomain(domain)" v-if = "addDiag">{{$t('table.delete')}}</el-button>
            </el-form-item>
            </div>
          </div>
        <!-- --------- -->
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.pltId==='' || defaultForm.params.pltId===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.pltId!='' && defaultForm.params.pltId!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template> 

<script> 
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import moment from 'moment'
export default {
  name: 'plt',
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
  data() {
    const  _initdata ={ 
      dialogFormVisible: false,
      allowDisable:false,
      queryParams:{
        requestData:{ }
        },
      capacity:0, 
      testData:[],
      initSelect:{
         pltCateId:[],
         matlCateId:[],
         wareId:[],
         laneId:[],
         staId:[],
         locType:[],
         carryState:[],
         matlState:[],
         pltLoadState:[],
         mesState:[],
         codeState:[],
         pltDirState:[],
         count2:[{label:'是',value:0},{label:'否',value:1}]
      }, 
      defaultForm: {
        row:{},
        params:{
         id:'',
         pltId:''
        },
        cells:[],
        pltGroup:[{id:'',pltCode :'',pltLoadState:0, matlCount:0, pltRemark:'', pltId:''}]
      },
      allLoc:[],
      staLoc:[],
      rackLoc:[],
      addDiag:false,
      dialogtitle:'编辑',
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      // groupCols:[
      //   { field: 'pltCode', title: '托盘条码', minWidth: 100, align: "center",queryType:'input',Set:true,require:true,editReadonly:true },
      //   { field: 'pltLoadState', title: '载货状态', align: 'center',queryType:'select',set:true,filter:true,require:true,editReadonly:true},
      //   { field: 'matlCount', title: '物料数量', minWidth: 100, align: "center",Set:true, last:true },
      //   { field: 'pltRemark', title: '备注', minWidth: 100, align: "center",addSet:true,set:true,queryType:'input'  },
      // ],
      textI18n:{
        pltGroup:{zh:'托盘组',en:"pltGroup"},
        addPlt:{zh:'增加托盘',en:"Add plt"},
        plt:{zh:'托盘',en:"plt"},
        pltCode:{zh:'托盘条码',en:"pltCode"},
        loadState:{zh:'装载状态',en:"loadState"},
        matlCount:{zh:'物料数量',en:"matlCount"},
        remark:{zh:'备注',en:"remark"},
        atLeastOne:{zh:'至少需要一个盘',en:"can't less than one"},
        exceedMax:{zh:'超过叠盘上限',en:"Exceed the max count"},
        correctLoc:{zh:'请输入有效的位置编号',en:"Please input correct LocCode"},
        },
      cols: [
                { field: 'containerCtrlCode', title: '托盘组号', minWidth: 100, align: "center",query:true,queryType:'input',set:true,require:true,editReadonly:true },
                { field: 'containerIndex', title: '托盘序号', minWidth: 80, align: "center" },
                { field: 'pltCode', title: '托盘条码', minWidth: 120, align: "center",query:true,queryType:'input',set:true,require:true,editReadonly:true },
                { field: 'pltCtrlCode', title: '托盘编号', minWidth: 100, align: "center",query:true,queryType:'input',set:false,require:true,editReadonly:true   },
                { field: 'pltCateName', title: '托盘类型', minWidth: 120, align: "center" },
                { field: 'pltCateId', title: '托盘类型', minWidth: 130, align: "center",addSet:true,hide:true,query:true,queryType:'select',set:true,require:true,editReadonly:true },
                { field: 'matlCateName', title: '物料类别', align: 'center', minWidth: 100},
                { field: 'matlCateId', title: '物料类别', align: 'center',editReadonly:true,addSet:true,hide:true, width: 80,query:true,queryType:'select',set:true,require:true}, 
                //{ field: 'matlCount', title: '物料数量', minWidth: 100, align: "center",query:false,queryType:'input',set:true,require:true},
                { field: 'lotNo', title: '批次号', minWidth: 100, align: "center",addSet:true,query:true,queryType:'input',set:true,require:true,editReadonly:true},
                { field: 'locType', title: '位置类型', minWidth: 100, align: "center",addSet:true,query:true,queryType:'select',set:true,require:true  },
                { field: 'locCode', title: '位置编码', minWidth: 100, align: "center" ,hide:true, addSet:true,query:true,queryType:'inputSelect',set:true,require:true },
                { field: 'locName', title: '当前位置', minWidth: 100, align: "center" ,query:false,queryType:'input',set:false,require:false },
                { field: 'locId', title: '位置', minWidth: 100, align: "center" ,hide:true,query:false,queryType:'select',set:false,require:false },
                { field: 'carryState', title: '搬运状态',  minWidth: 100,align: 'center',addSet:true,query:true,queryType:'select',set:true,require:true},
                // { field: 'pltErrorState', title: '异常状态', align: 'center', width: 100, query:false,queryType:'select'},
                { field: 'matlState', title: '电池状态', minWidth: 200,align: 'center',addSet:true,query:true,queryType:'select',set:true,require:true},
                { field: 'pltLoadState', title: '载货状态',  minWidth: 100,align: 'center',query:false,queryType:'select',filter:true,require:true},
                { field: 'codeState', title: '扫码状态', minWidth: 100, align: 'center' ,addSet:true,query:true,queryType:'select' ,set:true,require:true},
                { field: 'mesState', title: '接口状态',  minWidth: 100,align: 'center' ,addSet:true,query:false,queryType:'select' ,set:true,require:true},
                { field: 'pltDirState', title: '托盘方向', align: 'center', minWidth: 100,addSet:true,query:false,queryType:'select',set:true,require:true},
                { field: 'taskTime', title: '任务时间', align: 'center' ,minWidth: 150,query:false,queryType:'datetime' ,set:false,require:false},
                { field: 'carryTime', title: '搬运时间', align: 'center' ,minWidth: 150,query:false,queryType:'datetime' ,set:false,require:true},
                { field: 'readyTime', title: '到位时间', align: 'center' ,addSet:true,minWidth: 150,query:false,queryType:'datetime' ,set:true,require:true},
                { field: 'finishTime', title: '完成时间', align: 'center' ,minWidth: 150,addSet:true,query:false,queryType:'datetime' ,set:true,require:false},
                { field: 'inputTime', title: '上线时间', align: 'center' ,addSet:true,minWidth: 150,query:false,queryType:'datetime' ,set:false,require:true},
                // { field: 'count1', title: '化成复测次数', align: 'left' ,addSet:true,minWidth: 100,},
                // { field: 'count2', title: '分容复测次数', align: 'left', addSet:true,width: 100,queryType:'input',set:true,require:false},
                { field: 'wareName', title: '仓库', align: 'center', minWidth: 120,set:true,require:true},
                { field: 'wareId', title: '仓库',hide:true, align: 'left', minWidth: 170,query:false,queryType:'select',set:false,require:false},               
                { field: 'laneName', title: '巷道', align: 'center', minWidth: 120},
                { field: 'laneId', title: '巷道',hide:true, align: 'left', minWidth: 170,query:false,queryType:'select',set:false,require:false},
                // { field: 'staId', title: '站台',hide:true, align: 'left', width: 170,query:true,queryType:'select',set:false,require:false},
                { field: 'qreaName', title: '站台组/货区', align: 'left', minWidth: 120},
                { field: 'lineCode', title: '线体', minWidth: 100, align: "center",addSet:true,set:true,query:true,queryType:'input',editReadonly:true  },
                { field: 'routeCode', title: '路线', minWidth: 100,align: "center",addSet:true,set:true,query:true,queryType:'input'  ,editReadonly:true}, 
                { field: 'levelCode', title: '等级', minWidth: 100,align: "center",addSet:true,set:true,query:true,queryType:'input'  ,editReadonly:true}, 
                { field: 'inputBeginTime', title: '上线开始时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
                { field: 'inputEndTime', title: '上线结束时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
                { field: 'carryBeginTime', title: '搬运开始时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
                { field: 'carryEndTime', title: '搬运结束时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
                { field: 'readyBeginTime', title: '到位开始时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
                { field: 'readyEndTime', title: '到位结束时间',hide:true, align: 'center' ,query:true,queryType:'datetime' },
    ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.selectOptions()  
    // this.getList() 
  },
  methods: {
         translateText(type){
      return this.textI18n[type][this.$store.state.app.language];
      },
         initData(arr){
       let args = {}
          arr.map(c=>{
            if(c.set||c.addSet){
              args[c.field] = null
            }
          })
          return args     
        },
        commonFilter(value,type,queryType) {

           if(this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !=undefined && Array.isArray( this.initSelect[type]))
            {
              return this.getValueConvert(this.initSelect[type],value)     
            } 
           if(this.initSelect.hasOwnProperty(type) && !Array.isArray( this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)){
             return this.initSelect[type][value]
           }
        //    if(typeof queryType!='undefined' && queryType=='datetime'){
        //        return this.dataFormat(value)
        //    }
           return value
      },
      dataFormat(time){
                   if(typeof time==='string')
                   {
                       time = new Date(time)
                   }
              return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()}
                     ${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()} : ${time.getMinutes()>=10?time.getMinutes():'0'+time.getMinutes()} : ${time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()}`;

            
            },
    getList() {
      this.listLoading = true
      Object.assign(this.queryParams,this.listQuery)
       //this.defaultForm.pltGroup.forEach(f=>Object.assign(f,this.groupCols))
      const _data = {url:'/api/PltInfo/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false 
          this.containerCtrlCodeDatas(this.list)
          // this.autoWidth()
       }).catch(err => {
          console.error(err)
       })
    },
    autoWidth(){
      //获取当页所有数据
          this.cols.forEach(col=>{ 
            if(col.hide) return;
          //获取每一列数据的最大长度 
            //输入框 
            if(col.queryType === "input")
              {
                col.innerLen = 0;
                this.list.forEach(item =>{  
                  if(item[col.field] !== null && item[col.field].length > col.innerLen)
                    col.innerLen = item[col.field].length
                 });
              }
              //下拉框 
            else if(col.queryType === "select")
            {
              col.innerLen = 0;
              this.list.forEach(item =>{ 
                var stores = this.initSelect[col.field]; 
                var label = stores.filter(f=>f.value === item[col.field]); 
                if(label[0] != undefined && label[0].label.length > col.innerLen)
                    col.innerLen = label[0].label.length
                });
            } 
            if(col.innerLen < col.title.length)
              col.innerLen = col.title.length + 2 //+2是为了排序的宽度
            //制定字符长度和宽度的比例 基础宽度48 比率 1:10
            //cols的minWidth赋值 
            if(col.innerLen!=undefined&&col.innerLen!=0)
               col.minWidth = 48 + col.innerLen * 10
          });
    },
    cellBarCodeChaneg(value,channel){
         const ch = 'channel'+(channel+1)
         this.$refs[ch][0].focus();
    },
    getValueConvert(arr,value){
          for(let v of arr){
            if(v.value ==value )
              {                
                return v.label
              }
        }
        return value
    },
  destory(hide=false){
    this.dialogFormVisible = hide
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          if(p === 'pltDirState')
            this.defaultForm.params[p]=1
          else if(p === 'codeState')
            this.defaultForm.params[p]=0
          else if(p === 'mesState')
            this.defaultForm.params[p]=0
          else if(p === 'readyTime') 
            this.defaultForm.params[p]= moment(new Date()).format("yyyy-MM-DD HH:mm:ss")
          else if(p === 'inputTime')
            this.defaultForm.params[p]= moment(new Date()).format("yyyy-MM-DD HH:mm:ss")
          else this.defaultForm.params[p]=''
        }
        
        this.defaultForm.pltGroup=[{matlCount:0}]
     }
  },
  removeDomain(item) {
    if(this.defaultForm.pltGroup.length==1){
          this.$message({
                      type: 'error',
                      message: this.translateText('atLeastOne')
                    });
          return;
        }
        var index = this.defaultForm.pltGroup.indexOf(item)
        if (index !== -1) {
          this.defaultForm.pltGroup.splice(index, 1)
        }
      },
  addDomain() {
        if(this.defaultForm.pltGroup.length>=6){
          this.$message({
                      type: 'error',
                      message: this.translateText('exceedMax')
                    });
          return;
        }
        this.defaultForm.pltGroup.push({
          matlCount:0,
          key: Date.now()
        });
      },
  add(){
    this.dialogtitle = this.$t('table.add')
    this.addDiag = true
    this.allowDisable = false
    this.destory(true)
  },
  showDetails(row, column){
  },
  edit(row){
    this.addDiag = false
    this.dialogtitle =this.$t('table.edit')
    this.allowDisable = true
    this.dialogFormVisible = true 
    this.getLocIdByLocType(row['locType'])
    for(let p in this.defaultForm.params){
      if(this.defaultForm.params.hasOwnProperty(p)){
        this.defaultForm.params[p]=row[p]
      }
    } 
    this.defaultForm.params['locId'] = row['locId']
    // 加载托盘组的托盘信息
    let containerCtrlCode = row['containerCtrlCode']
    const _data = {url:'/api/PltInfo/GetPltCodesByContainerCtrlCode',params:{data:containerCtrlCode}}
    this.$store.dispatch('fmsCommon/actionWcsPost',_data)
          .then(data => {
              this.defaultForm.pltGroup = data.map(c=>{
                return {
                  id:c.containerIndex,
                  pltCode:c.pltCode,
                  pltLoadState:c.pltLoadState,
                  matlCount:c.matlCount,
                  pltRemark:c.remark,
                  pltId:c.pltId
                }
              })
          }).catch(err => {
              console.error(err)
          })


  },
  submit(formName){
    if(!this.selectBlur()) return;
       let _data = {url:'/api/pltInfo/edit',params:{data:{plt:this.defaultForm.params,cells:this.defaultForm.pltGroup}}}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: this.$t('common.btn.updateSuccess')
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  // this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: this.$t('const.savedData')+this.$t('const.cannotNull')
                  });
            //  this.destory()
          }
        });
  },
  query(){
     this.listQuery.current =1
     this.getList()
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   containerCtrlCodeDatas(arr)
   {
      this.testData=[];
      let tempList = {};
      for(let i = 0 ; i < arr.length ; i++){
        if(!tempList[arr[i].containerCtrlCode]){
          tempList[arr[i].containerCtrlCode] = 1;
        }else{
          tempList[arr[i].containerCtrlCode]++;
        }
      }
      for(var o in tempList){
        for(let i=0;i<tempList[o];i++)
        {
          if (i===0){
            this.testData.push(tempList[o])
          }else{
            this.testData.push(0)
          }
        }
      }
   },
   objectSpanMethod({ row, column, rowIndex, columnIndex }) { 
      if(columnIndex === 1){
        let _row = this.testData[rowIndex]
        let _col = this.testData[rowIndex] > 0 ?1:0
        return {
          rowspan: _row,
          colspan: _col
        }

      } 
      // if (columnIndex === 27)
      // {
      //   let _row = this.testData[rowIndex]
      //   let _col = this.testData[rowIndex] > 0 ?1:0
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   } 
      // } 

      // if(this.testData[row.containerCtrlCode] > row.containerIndex ){
      //   if (columnIndex === 0) { 
      //     return [1, 2];
      //   }
      //   else if(columnIndex ===1)
      //   {
      //     return [0, 0];
      //   }
      // }
    },
   selectBlur(){
      var locCode = this.defaultForm.params['locCode'];
      var locType = this.defaultForm.params['locType'];
      var item = this.allLoc.filter(f=>f.locType == locType && f.value == locCode);
      if(item.length != 1){
          this.$message({
                      type: 'error',
                      message: this.translateText('correctLoc')
                    });
          return false;                    
      }
      // this.handleSelect(item)
      return true  
   },
   checkGroup(){
     var warnText = "";
     var index = 1;
      this.defaultForm.pltGroup.forEach(f=>{
        if(f.pltCode === undefined||f.pltCode.length===0)
          warnText = this.translateText('pltCode')+this.$t('const.cannotNull')
        if(f.pltLoadState === undefined||f.pltLoadState.length===0)
          warnText += this.translateText('loadState')+this.$t('const.cannotNull')
        if(f.matlCount === undefined||f.matlCount.length===0)
          warnText += this.translateText('matlCount')+this.$t('const.cannotNull')
        f.index = index++;
      });
      if(warnText.length != 0){
          this.$message({
                      type: 'error',
                      message: warnText
                    });
          return false;                    
      }
      return true  
   },
   querySearchAsync(queryString, cb){
      var locType = this.defaultForm.params['locType'];
      if(locType == undefined |locType.length<1)
        locType = 0
      this.getLocIdByLocType(locType)
        var restaurants = this.allLoc;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
   },
   createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.defaultForm.params['locId'] = item.locId
      },
   getLocIdByLocType(locType){
      //获取位置
      const _data = {url:'/api/Job/GetLocInfoApi',params:{data:{'locType':locType}}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.allLoc = data.map(c=>{
                  return {
                    label:c.locName,
                    value:c.locCode,
                    locId:c.locId,
                    locType:c.locType
                  }
                })
            }).catch(err => {
                console.error(err)
            })
   },
   changeOption(value,item){ 
        if(item.field=='pltCateId'){
          const arr =  this.initSelect.pltCateId
          let cap = 0
          const chArr = []
          for(let v of arr){
            if(v.value ==value )
              {                
                cap = v.capacity
              }
          }
          this.capacity = cap
          for(let i = 0;i<this.capacity;i++){
             chArr.push({
               channel:i+1,
               cellBarCode:'',
               level:null
             })
          }
          this.defaultForm.cells = chArr
        }
        if(item.field == 'locType'){
          this.defaultForm.params['locId']  = null;
          this.defaultForm.params['locCode']  = null;
          var val = parseInt(value);
          if(val != NaN){
            this.getLocIdByLocType(val)
          }
        }
        this.$forceUpdate()
   },
   changeOptionLoadState(value ,item)
   {
      var val = parseInt(value);
      if(val === 0){
        item.matlCount = 0
      }
      if(val === 2){
        item.matlCount = 400
      } 
      this.$forceUpdate()
   },
   selectOptions(){
       //初始化线体信息
       let _data = {url:'/api/cache/PltCate',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.pltCateId = data.map(c=>{
             return {
               label:c.pltCateName,
               value:c.pltCateId,
               capacity:c.capacity
             }
           })
       }).catch(err => {
          console.error(err)
       })

       //物料类别

       _data = {url:'/api/cache/MatlCate',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.matlCateId = data.map(c=>{
             return {
               label:c.matlCateName,
               value:c.matlCateId,
             }
           })
           this.initSelect.matlCateId.reverse()
       }).catch(err => {
          console.error(err)
       })

       //所在仓库
          _data = {url:'/api/cache/WareInfo',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.wareId = data.map(c=>{
             return {
               label:c.wareName,
               value:c.wareId
             }
           })
       }).catch(err => {
          console.error(err)
       })

              //所在巷道
       _data = {url:'/api/cache/LaneInfo',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.laneId = data.map(c=>{
             return {
               label:c.laneName,
               value:c.laneId
             }
           })
       }).catch(err => {
          console.error(err)
       })

       //获取站台
       _data = {url:'/api/cache/StaInfo',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.staId = data.map(c=>{
             return {
               label:c.staName,
               value:c.staId
             }
           })
       }).catch(err => {
          console.error(err)
       })

       //位置类型
       _data = {url:'/api/const/LocType',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.locType = data.map(c=>{
             return {
               label:c.name,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })


       //搬运状态
       _data = {url:'/api/const/pltCarryState',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.carryState = data.map(c=>{
             return {
               label:c.name,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })       


       //电芯状态
       _data = {url:'/api/cache/MatlState',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.matlState = data.map(c=>{
             return {
               label:`[${c.stateNum}]${c.stateName}`,
               value:c.stateNum
             }
           })
       }).catch(err => {
          console.error(err)
       })   
       
       //装载状态
       _data = {url:'/api/const/PltLoadState',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.pltLoadState = data.map(c=>{
             return {
               label:c.name,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       }),
       //获取扫码状态
       _data = {url:'/api/Const/CodeState',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.codeState = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
       //获取接口状态
       _data = {url:'/api/Const/MesState',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.mesState = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
      //   //获取位置
      //  _data = {url:'/api/Cache/LocInfo',params:{}}
      // this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      //       .then(data => {

      //           this.allLoc = data.map(c=>{
      //             return {
      //               label:c.locName,
      //               value:c.locId,
      //               locType:c.locType
      //             }
      //           })
      //           this.initSelect.locId = this.allLoc
      //           this.staLoc = this.allLoc.filter(f=>f.locType === 5)
      //           this.rackLoc = this.allLoc.filter(f=>f.locType === 4)
      //       }).catch(err => {
      //           console.error(err)
      //       }),
            //获取托盘方向
       _data = {url:'/api/Const/DirState',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {

                this.initSelect.pltDirState = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
       //初始化工序信息
      }, 
   save(formName){
     if(!this.checkGroup()) return;
     if(!this.selectBlur()) return;
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      console.log(this.defaultForm.params)
      let _data = {url:'/api/pltInfo/add',params:{data:{plt:this.defaultForm.params,cells:this.defaultForm.pltGroup}}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message:this.$t('common.btn.addSuccess')
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                console.log(err)
                  console.error(err)
              }).finally(()=>{
                  // this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message:  this.$t('const.savedData')+this.$t('const.cannotNull')
                  });
            //  this.destory()
          }
        });


   },
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
      const _data =  {url:'/api/pltinfo/DeletePlt',params:{data:row.pltId}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
            //this.list.splice(index, 1)
            this.getList()
            this.$message({
            type: 'success',
            message: this.$t('common.btn.deleteSuccess')
          });
      }).catch(err => {
          console.error(err)
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          });          
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
.el-form--inline .el-form-item{
  margin: 1px;
}
.plt-info{
  height: 900px;
}
.plt-cells{
  height: 220px;
  overflow-y:scroll;
  background-color: #F0F1F2;
  padding: 10px 0;
}
.plt-cells-item{
  margin-left: 10px;
}
.el-input--medium .el-input__inner {
    height: 20px;
    line-height: 20px ;
}
.el-form-item__label{width: 100px;}
</style>
