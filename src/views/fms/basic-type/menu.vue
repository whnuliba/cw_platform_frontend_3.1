/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-菜单管理
 */
<template>
  <div id="configMenu" class="app-container">
    <div class="tree-menu">
      <el-tree
        :data="treeMenuData"
        node-key="id"
        :default-expanded-keys="defaultShowNodes"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        @node-click="treeNodeClick"
      />
    </div>
    <div class="container-menu">
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleAddMenu"
        >
        {{ $t("common.btn.add") }}
        </el-button>
      </div>

      <el-table :data="tableData" style="width: 100%; margin-top: 30px" border :key="renderTable" row-key="id">
        <el-table-column :label="$t('common.no')" width="50px" align="center" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in itemOptions"
          :key="item.key"
          :label="commonI18n(item)"
          :prop="item.title"
          :width="item.width"
          :formatter="item.Formatter"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" :label="$t('common.oper')" min-width='150' fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope)">
              {{ $t("common.btn.edit") }}
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope)">
              {{ $t("common.btn.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码标签组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getMenus"
      />

      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="customStyle"
        width="1024px"
        :title="textMap[dialogStatus]"
      >
      <div class="my_menu_panel">
        <el-form
          ref="dataForm"
          :model="Menu"
          :rules="rules"
          :inline="true"
          label-width="120px"
          label-position="right"
        >
          <div v-for="(item, i) in modalOptions" :key="i" style="display:inline;width:350px">
            <!-- 单行文本 -->
            <el-form-item
              v-if="item.columns_type == 'input'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.COLUMN_RULES_MSG, trigger: 'change' } "
            >
              <el-input
                style="width:350px"
                v-model="Menu[item.key]"
                :type="item.columns_input_type"
                :placeholder="item.label"
                :disabled="item.disabled"
              />
            </el-form-item>
            <!-- 图标 -->
            <el-form-item
              v-if="item.columns_type == 'icon'"
              :label="commonI18n(item) + ': '"
            >
              <icon-picker v-model="Menu[item.key]"   style="width:350px" />
            </el-form-item>
            <!-- 下拉菜单 -->
            <el-form-item
              v-if="item.columns_type == 'select'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
              style="width:350px"
                v-if="item.columns_type == 'select'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="item.disabled"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>    
            <el-form-item
              v-if="item.columns_type == 'select-group'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
              style="width:350px"
                v-if="item.columns_type == 'select-group'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="!isGroupDiasble && !isRoot"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>    
                        <el-form-item
              v-if="item.columns_type == 'select-type'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
              style="width:350px"
                v-if="item.columns_type == 'select-type'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="isGroupDiasble && isRoot"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>   
        
          </div>
          <div style="display:inline">
          <el-form-item
          :label='$t("平台")'
          >
            <el-select v-model="platformOption" multiple :placeholder='$t("请选择")'   style="width:350px">
                <el-option
                  v-for="item in platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>  
         </div> 

         <div style="display:inline">
          <el-form-item
          :label='$t("是否缓存")'
          >
          <el-select v-model="udf1Option" :placeholder='$t("请选择")'   style="width:350px">
            <el-option
                  v-for="item in udf1Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>  
         </div>          
        </el-form>
      </div>
        <div style="text-align: center; display:block"  >
          <el-button @click="dialogFormVisible = false"> {{$t("common.btn.cancel")}} </el-button>
          <el-button
            type="primary"
            @click="
              dialogStatus === 'create' || dialogStatus === 'createsub'
                ? createData()
                : updateData()
            "
          >
            {{$t("common.btn.save")}}
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Sortable from 'sortablejs';
import common from '@/utils/common';
import i18n from '@/lang';
import {
  // getMenuList,
  getMenuListByLevel,
  addMenu,
  updateMenu,
  deleteMenu
} from '@/api/menu'
import { getMenuTree, getMenuTable } from '@/api/sys_table'

const calendarTypeOptions = [
  { key: 0, display_name: '否' },
  { key: 1, display_name: '是' }
]

export default {
  name: 'Menu',
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: '启动',
        0: '停止'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      renderTable:true,
      defaultShowNodes: [],
      treeMenuData: [],
      routes: [],
      MenusList: [],
      total: 0,
      pagesNum: 1,
      currPraentNodeId:'',
      activeName: '1',
      menulevel: {
        MENU_LEVEL: '1'
      },
      tablename: {},
      tableData: [],
      menuTmpTableData:[],
      itemOptions: [
        {
          key: 'menuName',
          label: '菜单名称',
          title: 'menuName',
          width: '120'
        },
        {
          key: 'menuNameEn',
          label: '英文名称',
          title: 'menuNameEn',
          width: '120'
        },
        {
          key: 'menuCode',
          label: '菜单编码',
          title: 'menuCode',
          width: '120'
        },
        {
          key: 'menuRoute',
          label: '路由',
          title: 'menuRoute',
          width: '100'
        },
    
        {
          key: 'href',
          label: '窗口类型',
          title: 'href',
          width: '100'
        },
        {
          key: 'component',
          label: '组件',
          title: 'component',
          width: '100'
        },
        {
          key: 'sort',
          label: '排序号',
          title: 'sort',
          width: '100'
        },
        {
          key: 'menuGroup',
          label: '所属组',
          title: 'menuGroup',
          width: '100'
        },
        
        {
          key: 'status',
          label: '使用状态',
          title: 'status',
          Formatter: (row, column, cellValue, index)=> cellValue === 0 ? this.$t('config.disable'): this.$t('config.enable'),
          width: '100'
        },   
        {
          key: 'scope',
          label: '范围',
          title: 'scope',
          Formatter: (row, column, cellValue, index)=> cellValue === '0' ? this.$t('config.private') : this.$t('config.global') ,
          width: '100'
        },
        {
          key: 'menuType',
          label: '菜单类型',
          title: 'menuType',
           Formatter: (row, column, cellValue, index)=> cellValue === 0 ? this.$t('config.contents') : 
           cellValue === 1 ? this.$t('config.function')  : this.$t('config.group'),
          width: '100'
        },
        {
          key: 'platform',
          label: '平台',
          title: 'platform',
          width: 120
        },
        {
          key: 'udf1',
          label: '缓存',
          title: 'udf1',
          width: 120
        },
        {
          key: 'udf2',
          label: '创建导航',
          title: 'udf2',
          width: 120
        },
        {
          key: 'udf3',
          label: 'UDF3',
          title: 'udf3',
          width: 120
        },
        {
          key: 'udf4',
          label: 'UDF4',
          title: 'udf4',
          width: 120
        },
        {
          key: 'udf5',
          label: 'UDF5',
          title: 'udf5',
          width: 120
        },
        {
          key: 'udf6',
          label: 'WINFORM',
          title: 'udf6',
          width: 120
        },
      ],
      modalOptions: [
        {
          key: 'parentMenuName',
          label: '父菜单名称',
          title: 'parentMenuName',
          width: 120,
          columns_type: 'input',
          disabled: true
        },
        {
          key: 'menuName',
          label: '菜单名称',
          title: 'menuName',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'menuNameEn',
          label: '英文名称',
          title: 'menuNameEn',
          width: '120',
          columns_type: 'input'
        },
        {
          key: 'menuCode',
          label: '菜单编码',
          title: 'menuCode',
          width: 120,
          columns_type: 'input'
        },
        {
          key: 'menuRoute',
          label: '路由',
          title: 'menuRoute',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'href',
          label: '窗口类型',
          title: 'href',
          width: 100,
          columns_type: 'select',
          select_text: 4,
        },

        {
          key: 'component',
          label: '组件',
          title: 'component',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'textIcon',
          label: '图标',
          title: 'textIcon',
          width: 100,
          columns_type: 'icon'
        },
        {
          key: 'sort',
          label: '排序号',
          title: 'sort',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'menuGroup',
          label: '所属组',
          title: 'menuGroup',
          width: 100,
          columns_type: 'select-group',
          select_text: 2,
          // disabled: true
        },
        {
          key: 'status',
          label: '使用状态',
          title: 'status',
          width: 100,
          columns_type: 'select',
          select_text: 0
        },
        {
          key: 'menuType',
          label: '菜单类型',
          title: 'menuType',
          width: 100,
          columns_type: 'select-type',
          select_text: 1
        },
        {
          key: 'scope',
          label: '范围',
          title: 'scope',
          width: 100,
          select_text: 3,
          columns_type: 'select'
        },
        {
          key: 'udf2',
          label: '创建导航',
          title: 'udf2',
          width: 100,
          columns_type: 'select',
          select_text: 5,
        },

        {
          key: 'udf3',
          label: 'UDF3',
          title: 'udf3',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'udf4',
          label: 'UDF4',
          title: 'udf4',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'udf5',
          label: 'UDF5',
          title: 'udf5',
          width: 100,
          columns_type: 'input'
        },
        {
          key: 'udf6',
          label: 'WINFORM',
          title: 'udf6',
          width: 100,
          columns_type: 'input'
        },

      ],
      isGroupDiasble:false,
      isRoot:false,
      isParent1:'',
      platformOption:[],
      Menu: {
        udf1:undefined,
        parentMenuName: undefined,
        menuCode: undefined,
        menuRoute: undefined,
        href: undefined,
        component: undefined,
        sort: undefined,
        menuGroup: undefined,
        menuNameEn:undefined,
        status: undefined,
        menuType: undefined,
        orgId:undefined,
        scope:undefined,
        platform:undefined,
        udf2:undefined,
        udf3:undefined,
        udf4:undefined,
        udf5:undefined,
        udf6:undefined,
      },
      platformOptions:[
        {label:'ALL',value:'ALL'},
        {label:'MOBILE',value:'MOBILE'},
        {label:'PDA',value:'PDA'},
        {label:'PAD',value:'PAD'},
        {label:'OTHER',value:'OTHER'},
        {label:'WINFORM',value:'WINFORM'},
      ],
      udf1Option:undefined,
      udf1Options:[
        {label:this.$t('config.notCache'),value:'true'},
        {label:this.$t('config.cache'),value:'false'},
      ],
      menulevelOptions: [
        [{ title: this.$t('config.enable'), value: 1 }, { title:this.$t('config.disable'), value: 0 }],
        [{ title: this.$t('config.contents'), value: 0 }, { title:  this.$t('config.function'), value: 1 }, { title:  this.$t('config.group'), value: 2 }],
        [
          // { title: '柔性制造', value: 'FMS' }, { title: '调度管理', value: 'WCS' },
          // { title: '仓储管理', value: 'WMS' }, { title: '生产信息', value: 'PM' },
          // { title: '报表中心', value: 'BI' }, { title: '生产维护', value: 'TPM' },
          // { title: '系统配置', value: 'SYS' },{ title: '手持终端', value: 'PDA' }
        ],
        [{title: this.$t('config.global'),value:'1'},{title: this.$t('config.private'),value:'0'}],

        [{ title: this.$t('config.tab'), value: '_self' },{ title: this.$t('config.window'), value: '_blank'}],
        [{ title:  this.$t('config.yes'), value: 'Y'}, { title:  this.$t('config.no'), value: 'N' }],

      ],
      listQuery: {
        page: 1,
        limit: 10,
        MENU_PARENT_ID: undefined,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined
      },
      calendarTypeOptions,
      isAble: false,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      checkStrictly: false,
      textMap: {
        update: this.$t('config.updateMenu'),//'编辑菜单',
        create: this.$t('config.createMenu'),
        createsub: this.$t('config.createSubMenu'),//'创建子菜单'
      },
      rules: {
        MENU_NAME: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
        MENU_PATH: [{ required: true, message: '请输入菜单路径', trigger: 'change' }],
        MENU_COMPONENT: [{ required: true, message: '请输入组件', trigger: 'change' }],
        URL: [{ required: true, message: '', trigger: 'change' }],
        TITLE: [{ required: true, mes请输入路由sage: '请输入标题', trigger: 'change' }],
        STATUS: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      isClickMenu: false, // 是否点击目录变量
      nodeData: '',
      treeParentId: '',
      selfId: '',
      menuTreeAllData:'',
      menuArrData:[]
    }
  },
  computed: {
    /* routesData() {
                return this.routes
            } */
  },
  created() {
    this.currPraentNodeId = '#'
    this.getMenuTableData('#')
    this.getMenuTreeData()
    this.getMengGroup()
  },
  mounted() {
    this.getMenus()
    //    document.body.ondrop = function (event) {
    //      event.preventDefault();
    //       event.stopPropagation();
    //  }
    //   this.rowDrop()
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.rowDrop();
        },100)
      })
  },
  methods: {
    getMengGroup(){
      const _data = {url:'/menuGrp/query-all-grp',params:{}}
      this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(data => {

        let codes = {}//common['sysCode']() 
        let meCode ={} 
        data.forEach(c=>{
          meCode[c.groupCode]=c.groupName
        })
        Object.assign(codes,meCode)
        const arr = []
        for(let c in codes ){
           arr.push( {title: codes[c]+"["+c+"]", value: c})
        }
        this.menulevelOptions[2]=arr
       }).catch(err => {
          console.error(err)
       })
    },
    changeMenuGroup(val){
       // Promise.all([asyncQueryRequest(store.dispatch('permission/getMenuGroup'))]).then(res => console.log(res)); 
       this.$store.dispatch('permission/getMenuGroup').then(res =>{
            if(res.indexOf(val)>=0)
             {
               this.$message({
                    title:  this.$t('config.information'),
                    message:  this.$t('config.existGroup'),
                    type: 'success'
               })
             }
               
       })
    },
    // 拖拽树组件回调
    handleDragStart(node, ev) {
        // console.log('drag start', node)
      },
    handleDragEnter(draggingNode, dropNode, ev) {
    
        // console.log('tree drag enter: ', dropNode)
      },
    handleDragLeave(draggingNode, dropNode, ev) {
        // console.log('tree drag leave: ', dropNode)
      },
    handleDragOver(draggingNode, dropNode, ev) {
      },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      },
    // 拖拽成功完成时触发的事件
    handleDrop(draggingNode, dropNode, dropType) {
        this.treeParentId = dropType === 'inner' ? dropNode.data.id : dropNode.parent.data.id;
        this.isParent1 =  dropType === 'inner' ? dropNode.data.pid : dropNode.parent.data.pid;
        this.selfId = draggingNode.data.id;
        // 获取菜单组
        let newArr = this.menuArrData;
        // 获取拖拽进去所在的菜单组
        newArr.forEach((item) => {
            if (item.id === this.treeParentId) {
                this.menuTreeAllData = item.menuGroup;
            }
        })
        let param = {
            data:{
              id: [this.selfId],
              menuGroup: this.menuTreeAllData,
              pid: this.treeParentId
            }
        };
        let _pid = draggingNode.data.pid
       // console.log(dropType,this.isParent1,draggingNode.data,dropNode.data)
        if(this.isParent1=="0" || _pid =='0')
        {
           this.$message({
                      title: '信息',
                             message: '不能移动到组目录下',
                              type: 'warn'
                 })
              return   false

        }
        // 提醒栏弹窗
        this.$confirm('确定要调整当前目录吗?', this.i18n("common.tip_info.tips"), {
            confirmButtonText: this.i18n("common.btn.ok"),
            cancelButtonText: this.i18n("common.btn.cancel"),
            type: 'warning'
          }).then(() => {        
                const _data = {url:'/menu/reload-dir',params: param}
                this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
                    if (data.code === 200) {
                      this.$message({
                                      title: '信息',
                                      message: '目录调整成功',
                                      type: 'success'
                                  })
                      }
                  }).catch(err => {
                      console.error(err)
                  })   
          }).catch(() => {
            this.$message({
              type: '信息',
              message: '取消目录调整'
            });          
          })
      },
    allowDrop(draggingNode, dropNode, type) {
      let nd= type === 'inner' ? dropNode.data.pid : dropNode.parent.data.pid;
      if(nd=="0")
         {
            return false
         }
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner'
        } else {
          return true
        }
      },
    // 判断当前节点能否拖拽 
    allowDrag(draggingNode) {
      if (draggingNode.parent.data.pid !== "0" && draggingNode.data.pid!='0' ) {
          return true
      } else {
         this.$confirm('不能移动组目录', this.i18n("common.tip_info.tips"), {
            confirmButtonText: this.i18n("common.btn.ok"),
            cancelButtonText: this.i18n("common.btn.cancel"),
            type: 'warning'
          }).then(() => { }).catch(() => { })
        } 
      },
    // 点击树节点回调
    treeNodeClick(data) {
      if(data.pid==0){
         this.isRoot=true
      }else{
        this.isRoot=false
      }
      this.isClickMenu = true
      this.nodeData = data
      this.currPraentNodeId=data.id
      this.getMenuTableData(data.id)
    },
     rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this

       let drop = Sortable.create(tbody, {
        onStart:()=>{
       
        },
        onEnd: ({ newIndex, oldIndex }) => {
          if(this.isRoot)
            return
          const currRow = this.tableData.splice(oldIndex, 1)[0]
          this.tableData.splice(newIndex, 0, currRow)
          let arr = []
          this.tableData.forEach((item,index)=>{
            item.sort = index+1
            arr.push({sort:item.sort,id:item.id})
          })

           let _data = {url:'/menu/menu-sort',params:{data:arr}}
            this.$store.dispatch('fmsCommon/actionAuthPost',_data)
            .then(data => {

            }).catch(err => {
                console.error(err)
            })
        }
      })
   
      // Sortable.create(tbody, {
      //   onEnd({ newIndex, oldIndex }) {
      //     const currRow = _this.menuTmpTableData.splice(oldIndex, 1)[0]        
      //     _this.menuTmpTableData.splice(newIndex, 0, currRow)
      //     _this.renderTable!=_this.renderTable
      //     //_this.getMenuTableData(_this.currPraentNodeId)
      //     _this.tableData = _this.menuTmpTableData
      //      _this.renderTable!=_this.renderTable
      //     console.log(_this.currPraentNodeId)
          
      //   }
      // })
    },
    // 递归生成菜单树结构数据
    loop(data, id) {
        const res = []
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (item.pid !== id) {
              continue
            }
            let mlable = {title:item.menuName,field:"route."+item.menuCode,en_title:item.menuNameEn}
            item.label =this.commonI18n(mlable)
            item.children = this.loop(data, item.id)
            res.push(item)
        }
        return res
      },
    treeData(data, id) {
      return this.loop(data, id)
    },
    // 获取菜单树结构数据
    getMenuTreeData() {
        getMenuTree().then(res => {
            const { data } = res.data
            this.menuArrData = data;
            if (res.data.code === 200) {
                const newData = this.treeData(data, '0')
                this.treeMenuData = newData
                this.defaultShowNodes = [newData[0].id]
            }
        })
    },
    // 获取菜单对应表格数据
    getMenuTableData(menuId) {
      const params = {
        data: menuId,
        limit: this.listQuery.limit,
        page: this.listQuery.page
      }
      const _this = this
      getMenuTable(params).then(res => {
        if (res.data.code === 200) {
            const { data } = res.data
            _this.tableData = data
            _this.menuTmpTableData = [];
            Object.assign(_this.menuTmpTableData,data);
        }
      })
    },

    getMenuLevelOption() {
      var _this = this
      getMenuListByLevel(this.menulevel).then((response) => {
        for (const i in response.data) {
          _this.menulevelOptions.push(response.data[i])
        }
      })
    },
    menuparentflag: function(row, column) {
      let menuparent
      var _this = this
      _this.menulevelOptions.map((item, index) => {
        if (row.MENU_PARENT_ID == item.MENU_ID) {
          return (menuparent = item.TITLE)
        }
      })
      return menuparent
    },
    async getMenus() {
      this.listLoading = true
    },
    handletabClick: function(tab, event) {
      this.activeName = String(tab.name)
      this.listLoading = true
      const menulist = []
      getMenuList(this.listQuery).then((response) => {
        // 循环遍历将对象转成数组
        for (const i in response.data) {
          menulist.push(response.data[i])
        }

        const {
          MENU_LEVEL,
          MENU_NAME,
          TITLE,
          URL,
          STATUS,
          page = 1,
          limit = 10
        } = this.listQuery

        const mockList = menulist.filter((item) => {
          if (String(this.activeName) && item.MENU_LEVEL !== String(this.activeName)) return false
          if (STATUS && item.STATUS !== STATUS) return false
          if (MENU_NAME && item.MENU_NAME.indexOf(MENU_NAME) < 0) return false
          if (TITLE && item.TITLE.indexOf(TITLE) < 0) return false
          if (URL && item.URL.indexOf(URL) < 0) return false
          return true
        })

        // 总行数
        this.total = mockList.length

        // 分页处理
        const pageList = mockList.filter(
          (item, index) => index < limit * page && index >= limit * (page - 1)
        )

         pageList.forEach((item, index, array) => {
          pageList[index].STATUS = `${item.STATUS}`
        })

        // 加载数据
        this.MenusList = pageList

        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getMenus()
    },
    resetTemp() {
      this.isAble = false
    },
    //  添加菜单按钮点击事件(模态)
    handleAddMenu(scope) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.isGroupDiasble = true
      if (this.isClickMenu) {
        if(this.isRoot){
        //this.Menu['menuType']=2 //不可新增
        this.$message({
                    title: '信息',
                    message: '该节点下不可新增菜单信息,前转到菜单组新增',
                    type: 'success'
               })
               return
      }
        this.dialogFormVisible = true
      } else {
          this.$message({
              title: '信息',
              message: '请先选择一个目录',
              type: 'error'
            })
      }
      this.isAble = false
      this.Menu = {
        parentMenuName: this.nodeData.menuName,
        menuRoute: '#',
        href: '_self',
        component: '#',
        sort: 0,
        pid: this.nodeData.id,
        id: '',
        menuType:'',
        udf1:'false',
        scope:'1',
        status:1,
        platform:['ALL'],
        udf2:'Y',
        udf3:'',
        udf4:'',
        udf5:'',
        udf6:'',
        orgId:this.nodeData.orgId,
        menuGroup: this.nodeData.menuGroup
      }
      this.udf1Option = this.Menu.udf1
      this.platformOption = this.Menu.platform
      if(this.isRoot){
        //this.Menu['menuType']=2 //不可新增
        this.$message({
                    title: '信息',
                    message: '该节点下不可新增菜单信息,前转到菜单组新增',
                    type: 'success'
               })
               return
      }
      this.isAble = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加菜单接口回调
    createData() {
    let val = this.Menu["menuGroup"]
     this.$store.dispatch('permission/getMenuGroup').then(res =>{
            if(res.indexOf(val)>=0)
             {
           
              throw new Error("")
             }
               
       }).catch(error=>{
              this.$message({
                    title: '信息',
                    message: '已经存在系统组',
                    type: 'success'
               })
             return  
       })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let pl = this.platformOption
          if(pl)
            this.Menu.platform = JSON.stringify(pl)
          this.Menu.udf1=this.udf1Option  
          const params = { data: this.Menu }
          addMenu(params).then((response) => {
            if (response.data.code === 200) {
              // this.MenusList.push(this.Menu)
              this.dialogFormVisible = false
              this.currPraentNodeId=this.nodeData.id
              this.getMenuTableData(this.nodeData.id) // 刷新表格数据
              this.getMenuTreeData()
              this.$message({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑弹窗事件
    handleEdit(scope) {
      this.dialogStatus = 'update'
      this.isGroupDiasble=false
      this.dialogFormVisible = true
      this.checkStrictly = true
      /* this.isAble = false */
      this.Menu = Object.assign({}, scope.row)
      if(scope.row.platform){
        this.platformOption = JSON.parse(scope.row.platform)
      }
      this.udf1Option = scope.row.udf1
      this.Menu.parentMenuName = scope.row.menuName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑菜单接口回调
    updateData() {
    let val = this.Menu["menuGroup"]
    //  this.$store.dispatch('permission/getMenuGroup').then(res =>{
    //         if(res.indexOf(val)>=0)
    //          {           
    //           throw new Error("")
    //          }
               
    //    }).catch(error=>{
    //           this.$message({
    //                 title: '信息',
    //                 message: '已经存在系统组',
    //                 type: 'success'
    //            })
    //          return  
      //  })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let pl = this.platformOption
          if(pl)
            this.Menu.platform = JSON.stringify(pl)
            this.Menu.udf1=this.udf1Option  
          const tempData = Object.assign({}, this.Menu)
          const params = {
            data: tempData
          }
          addMenu(params).then((response) => {
            if (response.data.code === 200) {
              this.dialogFormVisible = false
              this.currPraentNodeId=tempData.pid
              this.getMenuTableData(tempData.pid)
              this.getMenuTreeData()
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message({
                title: '失败',
                message: response.data.data,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 删除菜单接口回调
    handleDelete({ $index, row }) {
      this.$confirm(`确定删除菜单${row.menuName}及子菜单?`, '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({ data: row.id }).then((response) => {
          if (response.data.code === 200) {
            this.currPraentNodeId=row.pid
            this.getMenuTableData(row.pid)
            this.getMenuTreeData()
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: response.data.data,
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    },
    handleClear() {
      this.listQuery = {
        page: 1,
        limit: 10,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['菜单名称', '路径', '组件', '跳转', '路由', '标题', '图标']
        const filterVal = [
          'MENU_NAME',
          'MENU_PATH',
          'MENU_COMPONENT',
          'REDIRECT',
          'URL',
          'TITLE',
          'META_ICON'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.userData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

<style scoped>
#configMenu {
  display: flex;
  height: 100%;
}
.tree-menu {
  height: 800px;
  overflow-y: scroll;
  width: 15%;
  margin-right: 10px;
  border: 1px solid #dfe6ec;
}
.container-menu {
  width: 85%;
  height: 80%;
}
::v-deep .el-dialog.customStyle {
  width: 80% !important;
}
.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.el-form-item {
  margin-bottom: 12px;
}
.my_menu_panel{
  height: 500px;
  overflow-y:auto;
}
</style>
