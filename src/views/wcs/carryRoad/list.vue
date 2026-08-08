<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
        <el-select  clearable  :filterable="true" v-if="!item.queryBind&&item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option 
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select clearable :filterable="true" v-if="item.queryBind&&item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option 
            v-for="item in queryLocSource[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select clearable :filterable="true" v-if="item.query && item.queryType==='groupSelect'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option-group v-for="group in groupCarryType" :key="group.label" :label="group.label" >
          <el-option
            v-for="item in group.opthions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          </el-option-group>
           </el-select>
        <el-cascader v-if="item.field === 'fromLocId' ||item.field === 'toLocId'" :placeholder="commonI18n(item)" v-model="queryLocSource[item.field]" :options="queryAllLoc" @change="queryLocChange" class="filter-item" filterable></el-cascader>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />

      </div>
      <div>
        <el-button type="primary" class="filter-item" @click="query()">
          {{ $t("common.btn.query") }}
        </el-button>
        <el-button type="info" class="filter-item" @click="reset">
          {{ $t("common.btn.reset") }}
        </el-button>
        <el-button v-ele-show="{btnCode:'wcs_carryRoadAdd'}" type="warning" class="filter-item" @click="add">
          {{ $t("common.btn.add") }}
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails" :row-class-name="tableRowClassName">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :sortable="true"  v-if="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" :label=" $t('common.oper')" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_carryRoadAdd'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
            &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_carryRoadDel'}" type="warning" size="small" icon="el-icon-delete" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
            &nbsp;
          <el-button type="primary" size="small" icon="el-icon-files" @click="copy(scope.row)">
            {{ $t("common.btn.copy") }}
          </el-button> 
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="900px" >

      <el-form :label-position="labelPosition" label-width="150px" :model="addParam" ref="defaultForm.params" style="display:inline">

        <p>{{translateText('basicInfo')}}</p>
        <hr> 
        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'roadCode'))" prop="roadCode" :rules="[{ required:true, message: commonI18n(getItem(cols,'roadCode'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.roadCode" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'roadName'))" prop="roadName" :rules="[{ required:true, message: commonI18n(getItem(cols,'roadName'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.roadName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'roadGroup'))" prop="roadGroup" :rules="[{ required:true, message: commonI18n(getItem(cols,'roadGroup'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.roadGroup" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'carryType'))" prop="carryType" :rules="[{ required:true, message: commonI18n(getItem(cols,'carryType'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.carryType" :filterable="true" style="width: 100%">
                <el-option v-for="item in initSelect.carryType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'pltCateId'))" prop="pltCateId" :rules="[{ required:true, message:commonI18n(getItem(cols,'pltCateId'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.pltCateId" style="width: 100%">
                <el-option v-for="item in initSelect.pltCateId" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'pltFunc'))" prop="pltFunc" :rules="[{ required:true, message: commonI18n(getItem(cols,'pltFunc'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.pltFunc" style="width: 100%">
                <el-option v-for="item in initSelect.pltFunc" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'matlCateId'))" prop="matlCateId" :rules="[{ required:true, message: commonI18n(getItem(cols,'matlCateId'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.matlCateId" style="width: 100%">
                <el-option v-for="item in initSelect.matlCateId" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'cacheCount'))" prop="cacheCount" :rules="[{ required:true, message: commonI18n(getItem(cols,'cacheCount'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.cacheCount" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'carryPriority'))" prop="carryPriority" :rules="[{ required:true, message: commonI18n(getItem(cols,'carryPriority'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.carryPriority" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'maxLayer'))" prop="maxLayer"  :rules="[{ required:true, message:  commonI18n(getItem(cols,'maxLayer'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.maxLayer" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'sortNum'))" prop="sortNum"  :rules="[{ required:true, message:  commonI18n(getItem(cols,'sortNum'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.sortNum" style="width: 100%" />
            </el-form-item>
          </el-col> 
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'useState'))" prop="useState" :rules="[{ required:true, message: commonI18n(getItem(cols,'useState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-switch v-model="addParam.useState" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" style="width: 100%"> </el-switch>
              
              <!-- <el-select v-model="addParam.useState" style="width: 100%">
                <el-option v-for="item in initSelect.useState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select> -->
            </el-form-item>
          </el-col> 
        </el-row>

        <p>{{translateText('timeWaitPair')}}</p>
        <hr>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="translateText('beforeCreate')" prop="beforeMinutes"  :rules="[{ required:true, message:  translateText('beforeCreate')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.beforeMinutes" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="translateText('afterCreate')" prop="afterMinutes"  :rules="[{ required:true, message:  translateText('afterCreate')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.afterMinutes" />
            </el-form-item>
          </el-col>
        </el-row>

        <p>{{translateText('trigger')}}</p>
        <hr>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'createTaskBefore'))" prop="createTaskBefore" :rules="[{ required:true, message: commonI18n(getItem(cols,'createTaskBefore'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.createTaskBefore" style="width: 100%">
                <el-option v-for="item in initSelect.createTaskBefore" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'createTaskAfter'))" prop="createTaskAfter" :rules="[{ required:true, message: commonI18n(getItem(cols,'createTaskAfter'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.createTaskAfter" style="width: 100%">
                <el-option v-for="item in initSelect.createTaskAfter" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'postTaskBefore'))" prop="postTaskBefore" :rules="[{ required:true, message: commonI18n(getItem(cols,'postTaskBefore'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.postTaskBefore" style="width: 100%">
                <el-option v-for="item in initSelect.postTaskBefore" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'postTaskAfter'))" prop="postTaskAfter" :rules="[{ required:true, message: commonI18n(getItem(cols,'postTaskAfter'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.postTaskAfter" style="width: 100%">
                <el-option v-for="item in initSelect.postTaskAfter" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'finishTaskBefore'))" prop="finishTaskBefore" :rules="[{ required:true, message: commonI18n(getItem(cols,'finishTaskBefore'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.finishTaskBefore" style="width: 100%">
                <el-option v-for="item in initSelect.finishTaskBefore" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'finishTaskAfter'))" prop="finishTaskAfter" :rules="[{ required:true, message: commonI18n(getItem(cols,'finishTaskAfter'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable v-model="addParam.finishTaskAfter" style="width: 100%">
                <el-option v-for="item in initSelect.finishTaskAfter" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <p>{{translateText('roadInfo')}}</p>
        <hr>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromLocType'))" prop="fromLocType" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromLocType'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromLocType" style="width: 100%">
                <el-option v-for="item in initSelect.fromLocType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toLocType'))" prop="toLocType" :rules="[{ required:true, message: commonI18n(getItem(cols,'toLocType'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.toLocType" style="width: 100%">
                <el-option v-for="item in initSelect.toLocType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromLocId'))" prop="fromLocId" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromLocId'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  :filterable="true" v-model="addParam.fromLocId" style="width: 100%">
                <el-option v-for="item in initSelect.fromLocId" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toLocId'))" prop="toLocId" :rules="[{ required:true, message: commonI18n(getItem(cols,'toLocId'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  :filterable="true" v-model="addParam.toLocId" style="width: 100%">
                <el-option v-for="item in initSelect.toLocId" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromLocFinder'))" prop="fromLocFinder" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromLocFinder'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromLocFinder" style="width: 100%">
                <el-option v-for="item in initSelect.fromLocFinder" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toLocFinder'))" prop="toLocFinder" :rules="[{ required:true, message: commonI18n(getItem(cols,'toLocFinder'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.toLocFinder" style="width: 100%">
                <el-option v-for="item in initSelect.toLocFinder" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromMatlState'))" prop="fromMatlState" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromMatlState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromMatlState" :filterable="true" style="width: 100%">
                <el-option v-for="item in initSelect.fromMatlState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toMatlState'))" prop="toMatlState" :rules="[{ required:true, message: commonI18n(getItem(cols,'toMatlState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.toMatlState" :filterable="true" style="width: 100%">
                <el-option v-for="item in initSelect.toMatlState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromCodeState'))" prop="fromCodeState" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromCodeState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromCodeState" style="width: 100%">
                <el-option v-for="item in initSelect.fromCodeState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toCodeState'))" prop="toCodeState" :rules="[{ required:true, message: commonI18n(getItem(cols,'toCodeState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.toCodeState" style="width: 100%">
                <el-option v-for="item in initSelect.toCodeState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'fromMesState'))" prop="fromMesState" :rules="[{ required:true, message: commonI18n(getItem(cols,'fromMesState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromMesState" style="width: 100%">
                <el-option v-for="item in initSelect.fromMesState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="commonI18n(getItem(cols,'toMesState'))" prop="toMesState" :rules="[{ required:true, message: commonI18n(getItem(cols,'toMesState'))+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.toMesState" style="width: 100%">
                <el-option v-for="item in initSelect.toMesState" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDia">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="submit('defaultForm.params')">{{$t('common.btn.ok')}}</el-button>
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
  name: 'carryRoad',
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
    const _initdata = {
      dialogFormVisible: false,
      dialogtitle: '编辑',
      queryParams: {
        requestData: { }
        },
        textI18n:{
          basicInfo:{zh:'基本信息',en:"Basic info"},
          timeWaitPair:{zh:'等待配对时间（分钟）',en:"Time of waiting for pairing(minutes)"},
          trigger:{zh:'路径触发',en:"Trigger"},
          roadInfo:{zh:'路径信息',en:"Road info"},
          beforeCreate:{zh:'创建任务前配对时间',en:"BeforeCreation"},
          afterCreate:{zh:'创建任务后配对时间',en:"AfterCreation"},
        },
      initSelect: {
         carryType: [],
         pltFunc: [],
         pltCateId: [],
         matlCateId: [],
         fromLocType: [],
         fromLocId: [],
         fromLocFinder: [],
         fromMatlState: [],
         fromCodeState: [],
         fromMesState: [],
         toLocType: [],
         toLocId: [],
         toLocFinder: [],
         toMatlState: [],
         toCodeState: [],
         toMesState: [],
         createTaskBefore: [],
         createTaskAfter: [],
         postTaskBefore: [],
         postTaskAfter: [],
         finishTaskBefore: [],
         finishTaskAfter: [],
         useState: [{ label: this.$t('common.ProcessFlowList.enable'), value: 1 }, { label: this.$t('common.ProcessFlowList.disabled'), value: 0 }]
      },
      defaultForm: {
        row: {},
        params: {
         id: '',
         roadId: ''
        }
      },
      groupCarryType:[],
      allLoc: [],
      queryAllLoc:[],
      queryLocSource:{
          fromLocId:'',
          toLocId:'',
          roadGroup:[],
          fromMatlState:[],
          fromMesState:[],
          toMatlState:[],
          toMesState:[]
        },
      locType: 5,
      list: null,
      carryJobItem: null,
      labelPosition: 'right',
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      addParam: {
        roadId: '',
        roadGroup: '',
        carryType: '',
        roadCode: '',
        roadName: '',
        pltFunc: '',
        pltCateId: '',
        matlCateId: '',
        carryPriority: '',
        sortNum:'',
        maxLayer:'',
        cacheCount: '',
        useState: '',
        beforeMinutes: '',
        afterMinutes: '',
        createTaskBefore: '',
        createTaskAfter: '',
        postTaskBefore: '',
        postTaskAfter: '',
        finishTaskBefore: '',
        finishTaskAfter: '',
        fromLocType: '',
        fromLocId: '',
        fromLocFinder: '',
        fromMatlState: '',
        fromCodeState: '',
        fromMesState: '',
        toLocType: '',
        toLocId: '',
        toLocFinder: '',
        toMatlState: '',
        toCodeState: '',
        toMesState: ''
      },
      cols: [
                { field: 'roadId', title: '路径Id', minWidth: 100, hide: true, align: 'center' },
                { field: 'roadGroup', title: '路径分组', minWidth: 150, align: 'center',queryBind:true, query: true, queryType: 'select', set: true, required: true },
                { field: 'carryType', title: '搬运类型',minWidth: 100, align: 'center', query: true, queryType: 'groupSelect', set: true, required: true },
                { field: 'roadCode', title: '路径编号', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'roadName', title: '路径名称', minWidth: 300, align: 'center', query: true, queryType: 'input', set: true, required: true },
                { field: 'pltFunc', title: '托盘功能', minWidth: 100, align: 'center', hide: true, query: false, queryType: 'select', set: true, required: true },
                { field: 'pltCateId', title: '托盘类型', minWidth: 100, align: 'center', query: true, queryType: 'select', set: true, required: true },
                { field: 'matlCateId', title: '电芯类型', minWidth: 100, align: 'center', query: true, queryType: 'select', set: true, required: true },
                { field: 'carryPriority', title: '搬运优先级',minWidth: 110, align: 'center', query: false, queryType: 'input', set: true, filter: true, required: true },
                { field: 'maxLayer', title: '最大叠盘数',minWidth: 110, align: 'center', query: false, queryType: 'input', set: true, filter: true, required: true },
                { field: 'cacheCount', title: '缓存数量',minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'sortNum', title: '路径序号',hide: true,minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'useState', title: '使用状态',minWidth: 100, align: 'center', query: true, queryType: 'select', set: true, filter: true, required: true },
                { field: 'beforeMinutes', title: '创建任务之前配对时间',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'input', set: true, filter: true, required: true },
                { field: 'afterMinutes', title: '创建任务之后配对时间',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'input', set: true, filter: true, required: true },
                { field: 'createTaskBefore', title: '创建任务之前事件', minWidth: 200, hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'createTaskAfter', title: '创建任务之后事件',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'postTaskBefore', title: '下达任务之前事件',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'postTaskAfter', title: '下达任务之后事件',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'finishTaskBefore', title: '完成任务之前事件', hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'finishTaskAfter', title: '完成任务之后事件',minWidth: 100, hide: true, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'fromLocType', title: '起始位置类型',minWidth: 150, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'fromLocId', title: '起始位置', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'fromLocFinder', title: '起始位置组件',minWidth: 200, align: 'center', queryType: 'select', set: true, required: true },
                { field: 'fromMatlState', title: '起始电池状态',minWidth: 150, align: 'center', queryBind:true,query: true, queryType: 'select', set: true, required: true },
                { field: 'fromCodeState', title: '起始扫码状态',minWidth: 150, align: 'center', queryType: 'select', set: true, required: true },
                { field: 'fromMesState', title: '起始接口状态',minWidth: 150, align: 'center',queryBind:true, query: true, queryType: 'select', set: true, required: true },
                { field: 'toLocType', title: '到达位置类型',minWidth: 150, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'toLocId', title: '到达位置', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'toLocFinder', title: '到达位置组件', minWidth: 200, align: 'center', queryType: 'select', set: true, required: true },
                { field: 'toMatlState', title: '到达电池状态',minWidth: 150, align: 'center', queryBind:true,query: true, queryType: 'select', set: true, required: true },
                { field: 'toCodeState', title: '到达扫码状态',minWidth: 150, align: 'center', queryType: 'select', set: true, required: true },
                { field: 'toMesState', title: '到达接口状态',minWidth: 150, align: 'center',queryBind:true, query: true, queryType: 'select', set: true, required: true }
       ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  watch: {
     'addParam.fromLocType'(val) {
      this.initSelect.fromLocId = this.allLoc.filter(f => f.locType === val)
      this.initSelect.fromLocFinder = this.fromAllLocFinder.filter(f => f.canFindLocTypes.includes(val))
      // this.addParam.fromLocFinder = '#'
      // this.addParam.fromLocId = null
    },
    'addParam.toLocType'(val) {
      this.initSelect.toLocId = this.allLoc.filter(f => f.locType === val)
      this.initSelect.toLocFinder = this.toAllLocFinder.filter(f => f.canFindLocTypes.includes(val))
      // this.addParam.toLocFinder = '#'
      // this.addParam.toLocId = null
    },
    'addParam.carryType'(val) {
      // this.addParam.fromLocFinder = '#'
      // this.addParam.toLocFinder = '#'
      // this.addParam.fromLocId = null
      // this.addParam.toLocId = null
      // this.addParam.fromLocType = null
      // this.addParam.toLocType = null
      this.initSelect.fromLocFinder = this.fromAllLocFinder.filter(f => f.canFindCarryTypes.includes(val))
      this.initSelect.toLocFinder = this.toAllLocFinder.filter(f => f.canFindCarryTypes.includes(val))
      var locTypeValue = parseInt(this.addParam['fromLocType'])
      if (locTypeValue != NaN) {
        this.initSelect.fromLocFinder = this.fromAllLocFinder.filter(f => f.canFindLocTypes.includes(locTypeValue))
      }
      locTypeValue = parseInt(this.addParam['toLocType'])
      if (locTypeValue != NaN) {
        this.initSelect.toLocFinder = this.toAllLocFinder.filter(f => f.canFindLocTypes.includes(locTypeValue))
      }
    }
  },
  created() {
    this.selectOptions()
  },
  mounted()
  {
    this.getList()
  },
  methods: {
    translateText(type){
      return this.textI18n[type][this.$store.state.app.language];
      },
       getItem(arr,field){
      for(let item of arr){
        if(item.field==field)
          return item;
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
      this.listLoading = false
      Object.assign(this.queryParams, this.listQuery)
      const _data = { url: '/api/Job/GetCarryRoad', params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
        
          this.list = data.data
          this.total = data.total
          this.listLoading = false
          //自适应宽度
          this.autoWidth();
          //获取简约下拉框
          this.getQueryBindSource()
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
                  if(item[col.field].length > col.innerLen)
                    col.innerLen = item[col.field].length
                 });
              }
              //下拉框
            else if(col.queryType === "select")
              {
                col.innerLen = 0;
                this.list.forEach(item =>{
                  var stores = this.initSelect[col.field];
                  if(col.field === "fromLocFinder")
                    stores = this.fromAllLocFinder
                  else if(col.field === "toLocFinder")
                    stores = this.toAllLocFinder
                  else if(col.field === "roadGroup")
                    stores = this.queryLocSource.roadGroup
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
    getValueConvert(arr, value) {
          for (const v of arr) {
            if (v.value == value) {
                return v.label
              }
        }
        return value
    },

    tableRowClassName({row, rowIndex}) {  
      if (row.carryJobItem.length !=0 && row.carryJobItem.length > 0 && row.useState === 1 && row.carryJobItem[0].useState ===1){
        return 'enable-row';
      }else if (row.carryJobItem.length == 0 && row.useState == 1 ){
        return '';
      }else if (row.carryJobItem.length !=0 && row.useState == 0 && row.carryJobItem[0].useState === 0) {
        return 'disable-row2';
      }else if (row.carryJobItem.length !=0 &&( row.useState == 0 || row.carryJobItem[0].useState === 0)) {
        return 'disable-row1';
      }   
      return '';
    },

  destory(hide = false) {
    this.dialogFormVisible = hide
    this.$refs['defaultForm.params'].resetFields();
       for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          if (p == 'roadGroup') this.defaultForm.params[p] = '#'
          else if (p == 'cacheCount') this.defaultForm.params[p] = 0
          else if (p == 'matlCateId') this.defaultForm.params[p] = '#'
          else if (p == 'carryPriority') this.defaultForm.params[p] = 0
          else if (p == 'useState') this.defaultForm.params[p] = 1
          else if (p == 'beforeMinutes') this.defaultForm.params[p] = 0
          else if (p == 'afterMinutes') this.defaultForm.params[p] = 0
          else if (p == 'createTaskBefore') this.defaultForm.params[p] = '#'
          else if (p == 'createTaskAfter') this.defaultForm.params[p] = '#'
          else if (p == 'postTaskBefore') this.defaultForm.params[p] = '#'
          else if (p == 'postTaskAfter') this.defaultForm.params[p] = '#'
          else if (p == 'finishTaskBefore') this.defaultForm.params[p] = '#'
          else if (p == 'finishTaskAfter') this.defaultForm.params[p] = '#'
          else if (p == 'fromMatlState') this.defaultForm.params[p] = -1
          else if (p == 'fromCodeState') this.defaultForm.params[p] = -1
          else if (p == 'fromMesState') this.defaultForm.params[p] = -1
          else if (p == 'toMatlState') this.defaultForm.params[p] = -1
          else if (p == 'toCodeState') this.defaultForm.params[p] = -1
          else if (p == 'toMesState') this.defaultForm.params[p] = -1
          else this.defaultForm.params[p] = ''
        }
     }
  },
  add() {
    this.resetLoc(false);
     for (const p in this.addParam) {
      if (p == 'roadGroup') this.addParam[p] = '#'
          else if (p == 'cacheCount') this.addParam[p] = 0
          else if (p == 'matlCateId') this.addParam[p] = '#'
          else if (p == 'carryPriority') this.addParam[p] = 0
          else if (p == 'sortNum') this.addParam[p] = 0
          else if (p == 'useState') this.addParam[p] = 1
          else if (p == 'beforeMinutes') this.addParam[p] = 0
          else if (p == 'afterMinutes') this.addParam[p] = 0
          else if (p == 'createTaskBefore') this.addParam[p] = '#'
          else if (p == 'createTaskAfter') this.addParam[p] = '#'
          else if (p == 'postTaskBefore') this.addParam[p] = '#'
          else if (p == 'postTaskAfter') this.addParam[p] = '#'
          else if (p == 'finishTaskBefore') this.addParam[p] = '#'
          else if (p == 'finishTaskAfter') this.addParam[p] = '#'
          else if (p == 'fromLocFinder') this.addParam[p] = '#'
          else if (p == 'fromMatlState') this.addParam[p] = -1
          else if (p == 'fromCodeState') this.addParam[p] = -1
          else if (p == 'fromMesState') this.addParam[p] = -1
          else if (p == 'toLocFinder') this.addParam[p] = '#'
          else if (p == 'toMatlState') this.addParam[p] = -1
          else if (p == 'toCodeState') this.addParam[p] = -1
          else if (p == 'toMesState') this.addParam[p] = -1
          else this.addParam[p] = ''
        }
        this.dialogFormVisible = true
        this.dialogtitle = this.$t('common.btn.add')
  },
  showDetails(row, column) {
  },
  edit(row) { 
    for (const key in this.addParam) { 
          this.addParam[key] = row[key]
        }
    this.dialogFormVisible = true
    this.dialogtitle = this.$t('common.btn.edit')
  },
  copy(row) {
    for (const key in this.addParam) { 
          this.addParam[key] = row[key]
        }
    this.addParam.roadId =''
    this.dialogFormVisible = true
    this.dialogtitle = this.$t('common.btn.add')
  },
  submit(formName) {
       const _data = { url: '/api/Job/AddCarryRoad', params: {
          data: this.addParam
       }}
       this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
            this.$message({
                  type: 'success',
                  message: this.dialogtitle+this.$t('const.result.success')
                })
                this.dialogFormVisible = false
                this.selectOptions()
                this.getList()
            }).catch(err => {
                this.$message({
                message: this.dialogtitle+this.$t('const.result.fail'),
                type: 'error'
                })
            })
          } else {
            this.$message({
                    type: 'error',
                    message: this.$t('const.savedData')+this.$t('const.cannotNull')
                  });
          }
        });        
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
     this.queryLocSource.fromLocId = '';
     this.queryLocSource.toLocId = '';
   },
   cancelDia(){
        this.dialogFormVisible = false;
        this.$refs['defaultForm.params'].resetFields();
        this.resetLoc(true);
    },
   resetLoc(val){
     var ret = this.allLoc;
      if(!val)
      ret = [];
      this.initSelect.toLocId = ret
      this.initSelect.fromLocId = ret;
    
   },
   queryLocChange(value){
     if(this.queryLocChange.fromLocId != '' && this.queryLocSource.fromLocId.length ==2)
      this.queryParams.requestData['fromLocId'] = this.queryLocSource.fromLocId[1]
     if(this.queryLocChange.toLocId != ''&& this.queryLocSource.toLocId.length ==2)
      this.queryParams.requestData['toLocId'] = this.queryLocSource.toLocId[1]     
      
   },
   getQueryBindSource(){
      //获取搜索简约版下拉
      let _data = {url:'/api/Common/GetDevColumns',params:{data:{'fields':["roadGroup","fromMatlState","fromMesState","toMatlState","toMesState"],table:"CarryRoad"}}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.queryLocSource.roadGroup = data.result["roadGroup"].sort().map(f=>{return{label:f,value:f}})
                this.queryLocSource.fromMatlState = this.initSelect.fromMatlState.filter(f=>data.result["fromMatlState"].includes(f.value.toString())).sort() 
                this.queryLocSource.fromMesState = this.initSelect.fromMesState.filter(f=>data.result["fromMesState"].includes(f.value.toString())).sort() 
                this.queryLocSource.toMatlState = this.initSelect.toMatlState.filter(f=>data.result["toMatlState"].includes(f.value.toString())).sort() 
                this.queryLocSource.toMesState = this.initSelect.toMesState.filter(f=>data.result["toMesState"].includes(f.value.toString())).sort() 
            }).catch(err => {
                console.error(err)
            })
   },
   selectOptions() { 
       // 获取搬运类型
       let _data = { url: '/api/LocInfo/GetCarryTypes', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.carryType = data.map(c => {
             return {
               label: '['+c.id+']'+c.name,
               value: c.id
             }
           })
           //输送线
           var conveyor = {label:"输送线",opthions:[]};
           conveyor.opthions = this.initSelect.carryType.filter(f=>f.value<200 && f.value>100);
           this.groupCarryType.length = 0;
           this.groupCarryType.push(conveyor);
           //堆垛机
           var stacker = {label:"堆垛机",opthions:[]};
           stacker.opthions = this.initSelect.carryType.filter(f=>f.value<300 && f.value>200);
           this.groupCarryType.push(stacker);
       }).catch(err => {
          console.error(err)
       }), 
       // 获取托盘功能
       _data = { url: '/api/Const/pltFunc', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.pltFunc = data.map(c => {
                  return {
                    label: '['+c.id+']'+c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
       // 获取电芯类型
       _data = { url: '/api/Cache/MatlCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.matlCateId = data.map(c => {
                  return {
                    label: c.matlCateName,
                    value: c.matlCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取托盘类型
       _data = { url: '/api/Cache/PltCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.pltCateId = data.map(c => {
                  return {
                    label: c.pltCateName,
                    value: c.pltCateId
                  }
                })
                this.initSelect.pltCateId.push({ label: '#', value: '#' })
            }).catch(err => {
                console.error(err)
            }),
            // 获取位置类型
       _data = { url: '/api/Cache/locTypes', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromLocType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                }),
                this.initSelect.toLocType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),

            // 获取位置
       _data = { url: '/api/Cache/LocInfo', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.allLoc = data.map(c => {
                  return {
                    label: c.locName,
                    value: c.locId,
                    locType: c.locType
                  }
                })
                this.allLoc = this.allLoc.filter(f=>f.locType != 4)
                this.initSelect.toLocId = this.allLoc;
                this.initSelect.fromLocId = this.allLoc;
                this.queryAllLoc.push({value:1,label:"立库",disabled:true})
                this.queryAllLoc.push({value:2,label:"巷道",children:this.allLoc.filter(f=>f.locType === 2)})
                this.queryAllLoc.push({value:3,label:"货区",disabled:true})
                // this.queryAllLoc.push({value:4,label:"货架",disabled:true})
                this.queryAllLoc.push({value:5,label:"站台",children:this.allLoc.filter(f=>f.locType === 5)})
                this.queryAllLoc.push({value:6,label:"站台组",children:this.allLoc.filter(f=>f.locType === 6)})
            }).catch(err => {
                console.error(err)
            }),
      
            // 获取起始位置查找
       _data = { url: '/api/Const/GetFromLocFinders', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.fromAllLocFinder = data.map(c => {
                  return {
                    label: c.locFinderName,
                    value: c.locFinderName,
                    canFindLocTypes: c.canFindLocTypes,
                    canFindCarryTypes: c.canFindCarryTypes
                  }
                })
            }).catch(err => {
                console.error(err)
            }),

                      // 获取到达位置查找
       _data = { url: '/api/Const/GetToLocFinders', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.toAllLocFinder = data.map(c => {
                  return {
                    label: c.locFinderName,
                    value: c.locFinderName,
                    canFindLocTypes: c.canFindLocTypes,
                    canFindCarryTypes: c.canFindCarryTypes
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
                      // 获取电池状态
       _data = { url: '/api/Cache/MatlState', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromMatlState = data.map(c => {
                  return {
                    label:`[${c.stateNum}]${c.stateName}`,
                    value:c.stateNum
                  }
                }),
                this.initSelect.toMatlState = data.map(c => {
                  return {
                    label:`[${c.stateNum}]${c.stateName}`,
                    value:c.stateNum
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
                          // 获取扫码状态
       _data = { url: '/api/Const/CodeState', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromCodeState = data.map(c => {
                  return {
                    label: `[${c.id}]${c.name}`,
                    value: c.id
                  }
                }),
                this.initSelect.toCodeState = data.map(c => {
                  return {
                    label:`[${c.id}]${c.name}`,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
                      // 获取接口状态
       _data = { url: '/api/Const/MesState', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromMesState = data.map(c => {
                  return {
                    label: `[${c.id}]${c.name}`,
                    value: c.id
                  }
                }),
                this.initSelect.toMesState = data.map(c => {
                  return {
                    label: `[${c.id}]${c.name}`,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
        // 获取创建任务之前
       _data = { url: '/api/Const/GetBeforeCreateTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.createTaskBefore = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取创建任务之后
       _data = { url: '/api/Const/GetAfterCreateTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.createTaskAfter = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取下达任务之前
       _data = { url: '/api/Const/GetBeforePostTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.postTaskBefore = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取下达任务之后
       _data = { url: '/api/Const/GetAfterPostTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.postTaskAfter = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取创建任务之前
       _data = { url: '/api/Const/GetBeforeFinishTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.finishTaskBefore = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取创建任务之后
       _data = { url: '/api/Const/GetAfterFinishTaskTrigger', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.finishTaskAfter = data.map(c => {
                  return {
                    label: c,
                    value: c
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      },
       // 保存新增
  //  save(formName) {
  //     this.defaultForm.row = {}
  //     this.defaultForm.params.id = ''
  //     const _data = { url: '/api/Job/AddCarryRoad', params: { data: this.defaultForm.params }}
  //        this.$refs[formName].validate((valid) => {
  //         if (valid) {
  //             this.$store.dispatch('fmsCommon/actionWcsPost', _data)
  //             .then(data => {
  //             this.$message({
  //                   type: 'success',
  //                   message: 'change success!=>' + data
  //                 })
  //                 this.dialogFormVisible = false
  //                 this.query()
  //             }).catch(err => {
  //                 console.error(err)
  //             }).finally(() => {
  //                 this.destory()
  //               })
  //         } else {
  //           this.$message({
  //                   type: 'error',
  //                   message: '输入数据不能为空'
  //                 })
  //         }
  //       })
  //  },
   del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
          confirmButtonText: i18n.t('common.btn.ok'),
          cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
                const _data = { url: '/api/Job/DelCarryRoad', params: { data: row.roadId }}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message: this.$t('common.btn.deleteSuccess')
                    })
                    this.getList()
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
   }
  }
}
</script>

<style>
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

.el-col-10 {
    width: 42%;
    height: 48px;
}
 .el-row::after {
    display: table;
    padding-bottom: 0px;
    height: 0px;
}
 
/* .el-table .current-row {
    background: rgb(208, 1, 1);
  } */
.el-table .enable-row {
  color: rgb(11, 155, 23);
}
.el-table .disable-row1 {
  color: rgb(226, 36, 36); 
} 
.el-table .disable-row2 {
  color: rgb(121, 21, 21); 
} 
.el-table .notiming-row {
  color: rgb(248, 216, 158);
}

</style>
