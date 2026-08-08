<template>
  <div style="height: 100%;">
    <div class="tool-bar">
      <div class="tool-bar-item">
        <!-- <el-button title="预览" type="primary" icon="el-icon-monitor" @click="preview()"></el-button> -->
        <!-- <el-select value-key="id"  size="mini" style="width:85%;margin-left:5px" :value="selectvalue" placeholder="页面列表"
          @change="selectchange">
          <el-option v-for="item in scriptData" :key="item.id" :label="item.pageName" :value="item">
          </el-option>
        </el-select> -->
        {{ viewName }}
      </div>
      <div class="tool-bar-middle">
        <div class="approve-sel">
          <el-select
            v-model="userId"
            :placeholder="commonI18n('common.todo.approver')"
          >
            <el-option
              v-for="item in approval"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" style="margin-left: 12px" title="提交审批" @click="approveSubmit" size="medium" >{{ "提交审批" }} </el-button>
        <el-button type="primary" style="margin-left: 12px" title="保存" @click="saveprint" size="medium" >{{ "保存" }}</el-button>
        <!-- <el-button style="margin-left: 5px;" title="撤销" icon="fa fa-reply" @click="undo" size="mini"></el-button>
        <el-button style="margin-left: 5px;" title="恢复" icon="fa fa-share" @click="forward" size="mini"></el-button> icon="el-icon-folder-add"-->
        <!-- <el-button style="margin-left: 5px;" title="预览" icon="el-icon-monitor" @click="preview" size="mini"></el-button>
        <el-button style="margin-left: 5px;" title="脚本" icon="el-icon-edit-outline" @click="editCode" size="mini"></el-button>
        <el-button style="margin-left: 5px;" title="刷新" icon="el-icon-refresh-right" @click="refresh" size="mini"></el-button>
        <el-button style="margin-left: 5px;" title="页面目录" icon="el-icon-document-copy" @click="openPadeContent" size="mini"></el-button>
        <el-button style="margin-left: 5px;" title="全屏" icon="el-icon-full-screen" @click="fullScreen" size="mini"></el-button> -->

      </div>
      <!-- <div class="tool-bar-title"></div> -->
    </div>
    <el-dialog :title="dialogTitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input :show-password="item.password" v-model="defaultForm.params[item.field]" style="width:220px;" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType === 'select'" :label="item.title"
            :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
            <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"
              style="width:220px;">
              <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id === '' || defaultForm.params.id === null"
          @click="save('defaultForm.params')"> {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id != '' && defaultForm.params.id != null"
          @click="submit('defaultForm.params')"> {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-drawer
        :title="'脚本编写'"
        :visible.sync="scriptsVisible"
        :direction="'ltr'"
        :size="'80%'"
        :withHeader="false"
        :before-close="handleClose"
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
            <div style="margin-left:42%">
             <el-button @click="scriptsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
             <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
            </div>
      </el-drawer>

      <el-drawer
        title="页面目录"
        :visible.sync="pageContentVisable"
        :direction="direction"
        :with-header="false">
        
        <el-tree ref="treeRef" :data="treeMenuData" node-key="id" :highlight-current='true'
        @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandIds" >
        <template v-slot="{ node, data }">
          <div class="treetitle" v-if="node.level == 1">
            <div @click="treeNodeClick(node)">
              <div> {{ node.label }}</div>
            </div>
            <div>
              <el-button title="新增" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-plus"
              @click.stop="add(node)"></el-button>
                <el-button title="查询" style="margin-right: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-search"
                  @click.stop="searchtable(node)"></el-button>
              <el-input v-if="searchinputshow == node.data.id" @input="tabletreeChange(searchiptval,node)"  class='searchinput' size="mini" v-model="searchiptval[node.data.id]" />
            </div>
          </div>
          <div class="treetitle" v-else>
            <div @click="treeNodeClick(node)">
              <div> {{ node.label }}</div>
            </div>
            <div>
              <el-button title="新增" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-plus"
              @click.stop="add(node)"></el-button><el-button title="查看视图" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-data-line"
              @click.stop="openTreePic(node)" ></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-drawer>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
import EditScript from '@/components/EditScript'
import { mapActions } from 'vuex';
import i18n from "@/lang";
export default {
  name: 'NodeToolBar',
  components: {EditScript},
  directives: { elDragDialog },
  filters: {},
  props: {
    // width: {
    //   type: Number,
    //   default: () => { return 920 }
    // },
    // height: {
    //   type: Number,
    //   default: () => { return 650 }
    // },
    panelStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  watch: {
    CHILDCOMPT_STATE(newVal, oldVal) {
      if(newVal === true){
        this.newsaveprint();
        this.$store.dispatch('app/triggerChildComponent',false);
      }
    }
  },
  data() {
    const _initdata = {
      pageContentVisable:false,
      direction:'ltr',
      selectvalue: '',
      searchinputshow: '',
      dialogTitle:'新增',
      viewName:'',
      selectobj: {},
      selectItemtreeId: '',
      treeMenuData: [],
      allTreeMenuData: [],
      searchiptval:{},
      defaultExpandIds: [],
      treeselectNode: {},
      scriptData: [],
      componentData: [],
      dialogFormVisible: false,
      scriptsVisible:false,
      dtsOfswitch:EditScript,
      scriptsEditer:'',
      scriptOps:{
          scriptValue:'',
          scriptId:''
      },
      defaultForm: {
        row: {},
        params: {
          pageCode: '',
          pageName: '',
          bizType: '',
          bizName: '',
          id: '',
        }
      },
      // cols: [],
      // savecols: [
      //   { field: 'pageCode', title: '页面编码', align: 'center', queryType: 'input', set: true, require: true },
      //   { field: 'pageName', title: '页面名称', align: 'center', queryType: 'input', set: true, require: true },
      // ],
      cols:[
        { field: 'BIZ_NAME', title: '业务名称', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_CODE', title: '业务编码', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'BIZ_COMMENT', title: '业务描述', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'PERMISSION', title: '权限标识', minWidth: 80, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'REF_MODEL', title: '引用模型', minWidth: 150, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'PARENT_COLUM', title: '父级字段', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'SON_COLUMN', title: '当前字段', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF1', title: 'UDF1', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF2', title: 'UDF2', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF3', title: 'UDF3', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF4', title: 'UDF4', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF5', title: 'UDF5', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF6', title: 'UDF6', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
        { field: 'UDF7', title: 'UDF7', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: true, hide: false },
      ],
      isFull: false,
      FlowRowData: {},
      processAddList: [],
      isSelectNodeName: false,
      isdisConnectLine: false,
      approval: [],
      approvalJson: {
        data: {
          userId: "",
          bizCode: "BS0001",
          model: "processapprovalmodel",
          currentState: "",
          bizId: "",
        },
      },
      userId: "",
    };
    //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata;
  },
  created() {
    this.getMenuTreeData();
  },
  mounted() {
    window.onresize = () => {
      if (this.getFullscreenElement() == null) {
        this.isFull = false;
      }
    };
    this.getscript();
    this.$bus.$on("componentDataProcess", (componentData) => {
      this.componentData = componentData;
      // console.log(componentData)
    });
    this.initApproval();
  },
  computed: {
    CHILDCOMPT_STATE() {
      return this.$store.state.app.CHILDCOMPT_STATE;
    }
  },
  methods: {
    tableFlowDataInit(){
      this.$emit("tableDataRefresh")
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.pid == '#') return true
      return data.label.indexOf(value) !== -1;
      },
    tabletreeChange(val,node){
      this.$refs.treeRef.filter(val[node.data.id])
    },
    searchtable(node){
      // this.searchiptval = ''
      this.searchinputshow = node.data.id
    },
    loop(data, id) {
      const res = []
      data.forEach((item => {
        item.label = item.data.BIZ_NAME
        item.value = item.id
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.id)
        }
        res.push(item)
      }))

      return res
    },
    treeData(data, id) {
      this.loop(data, id)
      return this.loop(data, id)
    },
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.defaultExpandIds.some((item, i) => {
        if (item === data.id) {
          this.defaultExpandIds.splice(i, 1)
        }
      })
      this.removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
    },
    removeChildrenIds(data) {
      const ts = this
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.defaultExpandIds.indexOf(item.id)
          if (index > 0) {
            ts.defaultExpandIds.splice(index, 1)
          }
          ts.removeChildrenIds(item)
        })
      }
    },
    handleNodeExpand(data) {
      this.treeselectNode = data
      // 保存当前展开的节点
      let flag = false
      this.defaultExpandIds.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
          flag = true
          return true
        }
      })
      if (!flag) { // 不存在则存到数组里
        this.defaultExpandIds.push(data.id)
      }
    },
    add(node){
      this.treeNodeClick(node)
      // this.dialogTitle = '新增'
      this.dialogFormVisible = true
      // this.cols = this.addcols
    },

    initProcessAddTable(rowInfo) {
      if (rowInfo == null) {
        rowInfo = this.FlowRowData;
      }
      const _data = {
        url: "/process-flow-tmp-dts/guest/get-dts",
        params: { data: rowInfo.id }, //this.processAddParam.flowId
      };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        this.processAddList = data;
        this.$bus.$emit("tableRowInfo", rowInfo, data); // 打开对应行的流程编辑模态时把行数据和所有节点数据传到cwPanel文件
        document.body.ondrop = function (event) {
          event.preventDefault();
          event.stopPropagation();
        };
      });
    },
    loadChart(node){
      // console.log('点击流程按钮===========>', node)
      this.initProcessAddTable(node)
      this.FlowRowData = node   // 表格行数据，包括流程图脚本
      this.pageContentVisable = false
      let val = node
      this.selectItemtreeId = val.id
      let data =eval("("+val.graph+")")

      if(data?.panelStyle.width){
        // this.panelStyle = data.panelStyle
        for (const key in data.panelStyle) {
          this.$set(this.panelStyle, key, data.panelStyle[key]);
        }
      }else{
        this.$set(this.panelStyle, 'width', 870);
        this.$set(this.panelStyle, 'height', 700);
        this.$set(this.panelStyle, 'backgroundColor', '');
      }
      // if(!data?.panelStyle.isUseCanvas){
      //   this.$set(this.panelStyle, 'isUseCanvas', false);
      //   this.$set(this.panelStyle, 'isConnectLine', false);
      // }
      if(data?.element){
        this.$bus.$emit('selevtcomponentDataProcess', data.element)
      }else{
        this.$bus.$emit('selevtcomponentDataProcess', [])
      }

      if(data?.lineDatas){
        this.$bus.$emit('selevtLineDataProcess', data.lineDatas)
      }else{
        this.$bus.$emit('selevtLineDataProcess', [])
      }
      // 撤销功能：保存首次打开画布组件状态
      let queueManager = JSON.parse(sessionStorage.getItem('queueManager'))
      queueManager.queue.push(data.element)
      queueManager.curIndex += 1
      sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
      
    },
    renderContent(h, { node, data, store }) {
      if (node.level == 1) {
        return (<span class="treetitle"> <span> {node.label}</span> <el-button title="新增" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-plus"
               on-click={() => this.add(node)}  ></el-button></span>)
      } 
      // else if (node.level == 2) {
      //   return (<span class="treetitle"> <span> {node.label}</span> <el-button title="查看视图" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-data-line"
      //          on-click={() => this.openTreePic(node)}  ></el-button></span>)

      // } 
      else {
        return (<span class="treetitle"> <span> {node.label}</span><el-button title="新增" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-plus"
               on-click={() => this.add(node)}  ></el-button><el-button title="查看视图" style="margin-left: 10px;" class='treebutton' type="text" size="mini" icon="el-icon-data-line"
               on-click={() => this.openTreePic(node)}  ></el-button></span>)
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
      } else if (node.level === 1) {

        const _data = {
          url: '/dyn-table/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'DB_ID',
                  condition: '=',
                  value: node.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            let arr = []

            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val.TABLE_NAME;
                val.value = val.ID;
                return val
              })
            }


            resolve([...node.data.children, ...arr])
          })
      } else if (node.level === 2) {
        const _data = {
          url: '/dyn-column/query', params: {
            data: {
              sqlWhere: [
                {
                  column: 'TABLE_ID',
                  condition: '=',
                  value: node.data.ID
                }]
            }
          }
        }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            let arr = []

            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val.COLUMN_NAME;
                val.value = val.ID;
                val["isLeaf"] = true;
                return val
              })
            }


            resolve([...arr])
          })
      }
    },
    treeNodeClick(node) {
      this.treeselectNode = node.data
      if (node && node.expanded === false) {
        // node.loaded = false;
        node.expanded = !node.expanded
      }else{
        node.expanded = !node.expanded
      }
    },
    getMenuTreeData() {
      const _data = { url: '/biz-define-relax/bizTree', }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.treeData(data.data, '0')
          this.treeMenuData = data.data
          this.allTreeMenuData = data.data
          // this.defaultShowNodes = [newData[0].id]
        }).catch(err => {
          console.error(err)
        })

    },
    refreshTreeNode(id) {
      const _data = { url: '/biz-define-relax/bizTree', }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          const newData = this.treeData(data.data, '0')
          this.treeMenuData = data.data
          let node = this.$refs.treeRef.getNode(id);

          if (node) {
            // node.loaded = false;
            node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
          }
        }).catch(err => {
          console.error(err)
        })

    },
    openPadeContent(){
        this.pageContentVisable = true
    },
    getFullscreenElement() {
        return (
            document['fullscreenElement'] ||
            document['mozFullScreenElement'] ||
            document['msFullScreenElement'] ||
            document['webkitFullscreenElement'] || null
            ); 
      },
    // 获取全屏状态
    fullScreen(){
        let mainContainer= document.getElementById('myScrollbarContentPanel');
        if(!mainContainer)
            return
        if(!this.isFull){
            if(mainContainer.RequestFullScreen){
                mainContainers.RequestFullScreen();
            }
            //兼容火狐
            if(mainContainer.mozRequestFullScreen){
                mainContainer.mozRequestFullScreen();
            }
            //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
            if(mainContainer.webkitRequestFullScreen){
                mainContainer.webkitRequestFullScreen();
            }
            //兼容IE,只能写msRequestFullscreen
            if(mainContainer.msRequestFullscreen){
                mainContainer.msRequestFullscreen();
          }
        }else{
            if(document.exitFullScreen){
                document.exitFullscreen()
            }
            //兼容火狐
            if(document.mozCancelFullScreen){
                document.mozCancelFullScreen()
            }
            //兼容谷歌等
            if(document.webkitExitFullscreen){
                document.webkitExitFullscreen()
            }
            //兼容IE
            if(document.msExitFullscreen){
                document.msExitFullscreen()
            }
        }
        this.isFull = !this.isFull; 
    },
    refresh() {
      this.$confirm(
        '此操作将清空面板,是否继续?',
        i18n.t("common.tip_info.tips"),
        {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          // this.selectvalue = ''
          this.viewName = ''
          this.selectItemtreeId = ''
          this.defaultForm.params.pageCode = ''
          this.$bus.$emit('selevtComponentData', [])
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "cancel",
          });
        });

    },
    editCode(){
      const pageCode = this.defaultForm.params.pageCode
      if(pageCode===undefined || pageCode===null || pageCode==='' )
      {
        this.$message({
                type: 'error',
                message: '当前还没有创建页面信息，无法编写代码'
              });
        return
      }
      this.scriptsVisible = true
      this.$nextTick(function(){
         this.$refs.scriptsEditer.initScript(this.scriptsEditer)
    })
    },
    setScript(data){
        this.scriptOps.scriptValue=data
        this.scriptsEditer = this.scriptOps.scriptValue
    },
    saveScript(){
      this.saveprint()
    },
    handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    // selectchange(val) {
    //   //let data =  eval("("+val.scripts+")") //JSON.parse(val.scripts)
    //   let data=JSON.parse(val.scripts)
    //   this.defaultForm.params.pageName=val.pageName
    //   this.defaultForm.params.pageCode=val.pageCode
    //   this.selectvalue = val.pageName
    //   this.selectobj = val
    //   this.scriptsEditer = data.handler
    //   this.$bus.$emit('selevtComponentData', data.element)
    //   this.selectItemtreeId = ''
    // },
    destory(hide = false) {
      this.dialogFormVisible = hide
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = ''
        }
      }
    },
    getscript() {
      const _data = { url: '/page-conf/query-pages-type', params: { data: 'LowCode' } }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.scriptData = data
        }).catch(err => {
          console.error(err)

        })
    },
    save(formName) {
      // if(this.dialogTitle == '新增'){
        this.defaultForm.row = {}
        this.defaultForm.params.ID = ''
        const _data = {
          url: "/biz-define-relax/createBaseComponent", params: {
            data: {
              dbName: "",
              dsName: "",
              tableName: "",
              data: {
                ...this.defaultForm.params,
                RELATION_ID: this.treeselectNode.data.ID
              }
            }
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
                this.dialogFormVisible = false
                // this.getMenuTreeData()
                this.refreshTreeNode(this.treeselectNode.data.ID)
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
        return
      // }


    },
    newsaveprint() {
        if(this.selectItemtreeId){
          const script = {
           element: this.componentData,
           handler:  this.scriptsEditer,
           panelStyle:{}
          }
          const _data = { url: '/biz-define-relax/updateById', params: { data: { SCRIPT: JSON.stringify(script), ID: this.selectItemtreeId } } }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.getMenuTreeData();
          }).catch(err => {
            console.error(err)
          })
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择相应的列'
        });
        return
      }
    },
    saveprint() {
      let  flowDataParams = [];
      let linkArr = [...this.$store.getters.lineDatas];
      // 构建一个节点映射表，以 fieldName 为 key
      const nodeMap = {};
      this.componentData.forEach(node => {
        nodeMap[node.fieldName] = node;
      });
      let newArr = [];
      linkArr.forEach(item => { 
          for(let key in item.data) {
            newArr.push(item.data[key]);
          }
        });

      this.componentData.forEach((node) => {
        let preNodes = 0;
        let nextNodes = 0;
        if(newArr.indexOf(node.fieldName) === -1) {
            this.isdisConnectLine = true
        } else {
            this.isdisConnectLine = false
        }
        // 查找当前节点的所有入线和出线
        linkArr.forEach((line) => {
          if (line.data.to === node.fieldName) {
            // 当前节点是 line 的终点，即该线的起点是前置节点
            const prevNode = nodeMap[line.data.from];
            if (prevNode) {
              preNodes=prevNode.attribute.nodeLabel;
              // prevNode.attribute.text.split(" ")[1]
            }
          }

          if (line.data.from === node.fieldName) {
            // 当前节点是 line 的起点，即该线的终点是后置节点
            const nextNode = nodeMap[line.data.to];
            if (nextNode) {
              nextNodes=nextNode.attribute.nodeLabel;
              // nextNode.attribute.text.split(" ")[1]
            }
          }
        });

        if (node.attribute.nodeLabel == '无') {
            this.isSelectNodeName = true
        } else {
            this.isSelectNodeName = false
        }
        flowDataParams.push({
          flowId: this.FlowRowData.id,
          templateCode: "",
          processCode: node.attribute.nodeLabel, //node.attribute.text && node.attribute.text.split(" ")[1].replace(/\[|\]/g, ''),  // 正则表达式去掉 '[]'
          preProcessNode: preNodes ? preNodes : "##", // 可以用逗号拼接多个前置节点  preNodes.join(',').replace(/\[|\]/g, '')
          nextProcessNode: nextNodes ? nextNodes : null,  // nextNodes.join(',').replace(/\[|\]/g, '')
        });
      })
      if (this.isSelectNodeName) {
        this.$message({
                      type: 'warning',
                      message: '存在节点未设置具体工艺!'
                    });
        return;
      }
      if (this.isdisConnectLine) {
        this.$message({
                      type: 'warning',
                      message: '如需修改节点间请连线且节点至少两个!'
                    });
        return;
      }
      // 新增和修改保存流程图数据 (保存流程图节点信息(节点位置,参数,是否跳站))
      if (this.componentData.length) {
          const dataParam = {
            url: "/process-flow-tmp-dts/createOrUpdate",
            params: { data: flowDataParams },
          };
          this.$store.dispatch("fmsCommon/actionFmsPost", dataParam).then((res) => {
            this.$message({
              type: "success",
              message: this.$t("common.btn.updateSuccess"),
            });
            // 保存流程图json
            this.chartJsonSave(this.FlowRowData, 0);
          });
        } else {
          //写在这做删除操作时, 当节点都没有时图的json数据可保存;
          this.chartJsonSave(this.FlowRowData, 0);
        }

    },

    //<!-- 流程图json保存 -->
    chartJsonSave(node, isModifyBtn) {
      let _this = this
      let script = {
           element: _this.componentData,
          //  handler:  _this.scriptsEditer,
           panelStyle: _this.panelStyle,
           lineDatas: _this.$store.getters.lineDatas
      }
      let json = {
        data: {
          flowCode: node.flowCode,
          flowName: node.flowName,
          id: node.id,
          useState: node.useState,
          flowType: node.flowType,
          cellId: node.cellId,
          graph: JSON.stringify(script)
        },
      };
      const _data = { url: "/process-flow-tmp/addflow", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        this.$emit("initProcessAddTable", 0);
        if (_this.componentData.length) {
          this.$message({
            message: this.$t("common.btn.submitSuccess"),
            type: "success",
          });
          // if (isModifyBtn) {
          //   this.$emit("modelClose");
          // }
        }

        this.flowVisible = false;
        this.tableFlowDataInit(); // 刷新表格
        // this.$emit("initList", { current: 1, pageSize: 15, requestData: {} });
      });
    },
    /* 初始化审批人 */
    initApproval() {
      let json = { data: "BS0001" };
      const _data = { url: "/approval/guest/approval-getuser", params: json };
      this.$store
        .dispatch("fmsCommon/actionFmsPost", _data)
        .then((response) => {
          let jsonUser = { data: [] };
          for (let i = 0; i < response.length; i++) {
            jsonUser.data.push(response[i].userId);
          }
          const _data = { url: "/user/get-all-ids", params: jsonUser };
          this.$store
            .dispatch("fmsCommon/actionAuthPost", _data)
            .then((response) => {
              this.approval = response;
              if (response.length > 0) {
                this.approvalJson.data.userId = response[0].id;
              }
            });
        });
    },
    /* 提交审批 */
    approveSubmit() {
      this.initProcessAddTable();
      let currentNodeStationInfo = this.componentData;
      let currentNodeInfo = [...this.processAddList],
        isExist = false,
        dbExistNode = [];
      currentNodeStationInfo.forEach((item, i) => {
        currentNodeInfo.forEach((savedNode, n) => {
          if (item.nodeCode && item.nodeCode.value === savedNode.processCode) {
            dbExistNode.push(savedNode.processName);
            if (item.status && item.status.value !== savedNode.status) {
              isExist = true;
              this.$confirm(
                `已做[跳站/过站]操作，请先点击修改，再提交审批!`,
                this.$t("common.btn.hint"),
                {
                  confirmButtonText: this.$t("common.btn.ok"),
                  showCancelButton: false, //是否显示取消按钮
                  type: "error",
                }
              ).then(() => {});
            }
          }
        });
      });
      currentNodeStationInfo.forEach((item) => {
        if (
          item.nodeCode &&
          dbExistNode.indexOf(item.nodeCode.text) < 0 &&
          item.status &&
          item.status.value === 1
        ) {
          isExist = true;
          this.$confirm(
            `已做[跳站/过站]操作，请先点击修改，再提交申请!`,
            this.$t("common.btn.hint"),
            {
              confirmButtonText: this.$t("common.btn.ok"),
              showCancelButton: false, //是否显示取消按钮
              type: "error",
            }
          ).then(() => {});
        }
      });
      if (isExist) {
        return;
      }

      if (!this.userId) {
        this.$message({
          type: "warning",
          message: "请先选择审批人！",
        });
        return;
      }

      this.$confirm(
        this.$t("common.processFlowTmpList.submitProcess"),
        this.$t("common.btn.hint"),
        {
          confirmButtonText: this.$t("common.btn.ok"),
          cancelButtonText: this.$t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.approvalJson.data.bizId = this.FlowRowData.id;
          this.approvalJson.data.currentState = this.FlowRowData.status;
          let param = {
            data: { ...this.approvalJson.data, userId: this.userId },
          };

          this.$emit("approveSubmit", param);
          //this.handlerEvent('approval-submit',param);
          //this.handlerEvent('chart-save');
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    // preview() {
    //  const script = {
    //     element: this.componentData,
    //     handler: this.scriptsEditer,
    //     panelStyle: this.panelStyle
    //   }
    //   this.$router.push({
    //     name: `preview`,
    //     params: { pageCode: script }
    //   })
    // },
    // undo() {
    //   let queueManager = JSON.parse(sessionStorage.getItem('queueManager'))
    //   if (queueManager.curIndex == 0) {
    //     this.$message({
    //       type: 'info',
    //       message: '无可撤销项'
    //     })
    //     return
    //   }else if (queueManager.curIndex == 1) {
    //     this.componentData.splice(0);
    //     queueManager.curIndex -=1
    //     sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
    //   }else{ 
    //     this.componentData.splice(0, this.componentData.length, ...queueManager.queue[queueManager.curIndex-2]);
    //     queueManager.curIndex-=1
    //     sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
    //   }
    // },
    // forward() {
    //    let queueManager = JSON.parse(sessionStorage.getItem('queueManager'))
    //    if (queueManager.curIndex == queueManager.queue.length) {
    //     this.$message({
    //       type: 'info',
    //       message: '无可恢复项'
    //     })
    //     return
    //   }else{
    //     this.componentData.splice(0, this.componentData.length, ...queueManager.queue[queueManager.curIndex]);
    //     queueManager.curIndex +=1
    //     sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
    //   }

    // }

  }
}
</script>
   
<style lang="less" scoped>
.tool-bar {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content: space-between;
  height: 100%;
  padding-left: 10px;
}

.tool-bar-item {
  width: 14%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 10px;

}

.tool-bar-middle {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-bar-title {
  width: 19%;
  height: 100%;
  display: flex;
  align-items: center;
}

::v-deep .treetitle {
  height: 26px;
  line-height: 26px;
  display: flex;
  font-size: 14px;
  .el-input__inner{
    border: 1px solid #9ea0a3;
    height: 18px;
  }
}
::v-deep .el-drawer__body  {
  overflow: auto;
}

</style>
