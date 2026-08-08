<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item, index) in cols" :key="index" style="display: inline">
        <el-input
          v-if="item.query && item.queryType === 'input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select
          v-if="item.query && item.queryType === 'select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
        >
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType === 'date'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="datetime"
          :placeholder="item.title"
          style="width: 150"
          class="filter-item"
        >
        </el-date-picker>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        查询
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-dblclick="showDetails"
    >
      <el-table-column width="55" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="item in cols"
        :key="item.id"
        :label="item.title"
        :prop="item.field"
        :width="item.width"
        :min-width="item.minWidth"
        v-if="!item.hide"
        :align="item.align"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ commonFilter(row[item.field], item.field) }}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="authorization(scope)"
          >
          {{ $t('config.role') }}
          </el-button>
          &nbsp;
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="funcMngClick(scope.row)"
          >
          {{ $t('config.user') }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            {{ $t("common.btn.edit") }}
          </el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.row,scope.$index)"
            icon="el-icon-delete"
            type="danger"
            >{{ $t("permission.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog
      :title="$t('config.update')"
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="defaultForm.params"
        :inline="true"
        :model="defaultForm.params"
        label-width="100px"
      >
        <div v-for="item in cols" :key="item.id" style="display: inline">
          <el-form-item
            v-if="item.set && item.queryType === 'input'"
            :label="item.title"
            :prop="item.field"
            :rules="[
              {
                required: item.required,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="defaultForm.params[item.field]"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'select'"
            :prop="item.field"
            :label="item.title"
            :rules="[
              {
                required: item.required,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-select
              v-model="defaultForm.params[item.field]"
              @change="$forceUpdate()"
              placeholder="请选择"
              style="width: 180px"
            >
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">
          {{ $t("common.btn.cancel") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id === '' || defaultForm.params.id === null"
          @click="save('defaultForm.params')"
        >
          {{ $t("common.btn.save") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id != '' && defaultForm.params.id != null"
          @click="submit('defaultForm.params')"
        >
          {{ $t("common.btn.submit") }}</el-button
        >
      </div>
    </el-dialog>
    <!-- 角色页面 -->
    <el-dialog
      :title="authorizationtitle"
      v-el-drag-dialog
      :visible.sync="dialogauthorization"
    >
      <el-checkbox-group v-model="checkedroleData">
        <div v-for="item in roleData" :key="item.id">
          <el-checkbox :label="item.id">{{ item.roleName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogauthorization = false">{{
          $t("common.btn.cancel")
        }}</el-button>
        <el-button type="primary" @click="SubmitAuthorization">{{
          $t("common.btn.ok")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 用户页面 -->
    <el-dialog
      v-el-drag-dialog
      :title="funcName"
      :visible.sync="isTreeDialogShow"
    >
      <div :style="{ height: '400px', overflowY: 'scroll' }">
        <el-tree
          :data="funcMngData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="defaultShowNodes"
          :default-checked-keys="defaultShowKeys"
          :check-strictly="true"
          :check-on-click-node="true"
          @check="checkFunc"
          @check-change="checkChange"
          :load="loadNode"
          lazy
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isTreeDialogShow = false">{{
          $t("button.cancel")
        }}</el-button>
        <el-button type="primary" @click="funcManage()">{{
          $t("button.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import i18n from "@/lang";
import { roleAll } from "@/api/roles";

export default {
  name: "lineside",
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未启用",
        1: "启用",
      };
      return statusMap[status];
    },
  },
  data() {
    const _initdata = {
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      isCheckSelect: false,
      authorizationtitle: "",
      funcName: "",
      groupId: "",
      clickRow: "",
      funcMngData: [], // 功能管理变量
      funcResData: [], // 功能管理按钮点击回调的数据
      defaultShowNodes: [],
      defaultShowKeys: [],
      isTreeDialogShow: false,
      dialogauthorization: false,
      checkedroleData: [],
      roleData: [],
      dialogFormVisible: false,
      queryParams: {
        requestData: {},
      },
      initSelect: {
        protocol: [],
        status: [
          { label: "启用", value: 0 },
          { label: "禁用", value: 1 },
        ],
        scope: [
          { label: "共享", value: "1" },
          { label: "私有", value: "0" },
        ],
      },
      defaultForm: {
        row: {},
        params: {
          id: "",
        },
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15,
      },
      cols: [
        {
          field: "createDate",
          title: "创建日期",
          align: "left",
          editReadonly: true,
          set: false,
        },
        { field: "createUser", title: "创建人", align: "left", set: false },
        {
          field: "groupNo",
          title: "组编码",
          align: "left",
          query: true,
          queryType: "input",
          editReadonly: true,
          set: true,
          required: true,
        },
        {
          field: "groupName",
          title: "组名称",
          align: "left",
          query: true,
          queryType: "input",
          set: true,
          required: true,
        },
        {
          field: "groupDesc",
          title: "组描述",
          align: "left",
          query: true,
          queryType: "input",
          set: true,
          required: true,
        },
        {
          field: "scope",
          title: "范围",
          align: "left",
          query: true,
          queryType: "select",
          set: true,
          required: true,
        },
      ],
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols));
    return _initdata;
  },
  created() {
    this.getList();
    roleAll().then((res) => {
      this.roleData = res.data.data;
    });
    // this.selectOptions()
  },
  methods: {
     //删除
    handleDelete(row, index) {
      // if()
      let userarr = []
      let rolearr = []
      const _data1 = { url: "/userGrp/guest/userGrp-user" ,params: { data: row.id },};
      let a1 =this.$store.dispatch("fmsCommon/actionAuthPost", _data1).then((data) => {
        userarr = data
      });
      const _data = {url: "/role/guest/query-grp-role-userGrp",params: { data: row.id },};
      let a2 = this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        rolearr = data


      })
      Promise.all([a1,a2]).then(res=>{
        if(userarr.length == 0 && rolearr.length == 0){
          this.$confirm('确定要删除这条数据吗?', this.$t('common.btn.hint'), {
            confirmButtonText:this.$t('common.btn.ok'),
            cancelButtonText:this.$t('common.btn.cancel'),
            type: "warning",
          }).then(() => {
            const _datadel = { url: "/userGrp/del" ,params: { data: row.id },};
            this.$store.dispatch("fmsCommon/actionAuthPost", _datadel).then((data) => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "delete success!",
              });
            }).catch((err) => {
              console.error(err);
            });
          });
        }else{
          this.$message({
            type: "error",
            message: "此条数据不能删除",
          });
        }
      })

    },
     funcManage() {
      let newMenuId = this.allMenuId;
      let tt = [...new Set(newMenuId)];  // new Set拿到的是一个对象
      let paramArr = tt.map(item => {
        item = {userId: item, groupId: this.clickRow.id}
        return item
      })
            //若全部取消，则置为#
      if(paramArr.length == 0){
               paramArr.push({userId:'#',groupId:this.clickRow.id})
       }
        let _data = {url: '/userGrp/batch-userGrp-user',params: {data:paramArr}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.isTreeDialogShow = false;
        })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
      }else{
        // resolve(node.data.children);
        let _data = {url: '/user/dept-user',params: {data:node.data.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          let arr = []

          if(data.length > 0){
            arr = data.map(val=>{
              val.label = val.realName;
              val.value = val.id;
              val["leaf"] = true;
              return val
            })
          }


          resolve([...node.data.children,...arr])
        })
      }
    },
    // 复选框点击改变事件
    checkChange(data, isSelect) {
      // 变量获取选中状态
      this.isCheckSelect = isSelect;
    },
    checkFunc(data, treeChoseObj) {
      //check事件 当复选框被点击的时候触发
      this.hanleCheck(data, treeChoseObj, "tree");
      let { checkedKeys } = treeChoseObj;
      // let menuData = this.funcResData;
      // let tt = [...checkedKeys]
      // if (this.isCheckSelect) {
      //    this.dgTreeData(data,menuData,tt); //获取父级节点ID
      // }
      this.allMenuId = this.$refs.tree.getCheckedKeys();
      //this.$refs.tree.setCheckedKeys(this.allMenuId)
    },
    hanleCheck(data, node, treeName) {
      const _this = this;
      // 获取当前节点是否被选中
      const isChecked = this.$refs[treeName].getNode(data).checked;
      // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消选中
      if (isChecked) {
        // 判断是否有上级节点，如果有那么遍历设置上级节点选中
        if (data.pid || data.pid === 0) {
          setParentChecked(data.pid);
        }
        // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
        data.children &&
          data.children.length > 0 &&
          setChildreChecked(data.children, true);
      } else {
        // 如果节点取消选中，则取消该节点下的子节点选中
        data.children &&
          data.children.length > 0 &&
          setChildreChecked(data.children, false);
      }
      function setParentChecked(pid) {
        // 获取该id的父级node
        const parentNode = _this.$refs[treeName].getNode(pid);
        // 如果该id的父级node存在父级id则继续遍历

        parentNode &&
          parentNode.data &&
          parentNode.data.pid &&
          setParentChecked(parentNode.data.pid);
        //  设置该id的节点为选中状态
        _this.$refs[treeName].setChecked(pid, true);
      }
      function setChildreChecked(node, isChecked) {
        node.forEach((item) => {
          data.children &&
            item.children.length > 0 &&
            setChildreChecked(item.children, isChecked);
          _this.$refs[treeName].setChecked(item.id, isChecked);
        });
      }
    },
    // 递归生成菜单树结构数据
    loop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item["leaf"] = false;
        item["disabled"] = true;
        // let _data = {url: '/user/dept-user',params: {data:item.id}}
        // this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
        //   this.tableData = data
        //   if(data.length>0){
        //     item.children =  data
        //     this.loop(item.children, item.id)
        //   }
        //   data.forEach(val=>{

        //   })
        // })
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.id);
        }
        res.push(item);
      });

      return res;
    },
    treeData(data, id) {
      this.loop(data, id);
      return this.loop(data, id);
    },
    funcMngClick(row) {
      this.clickRow = row
      this.isTreeDialogShow = true;

      const _data = { url: "/org/org-tree" };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {

        const newData = this.treeData(data, "0");
        this.funcMngData = newData;

        //  this.options = newData
        //  this.defaultShowNodes = [newData[0].id]
      });
      const _data1 = { url: "/userGrp/guest/userGrp-user" ,params: { data: row.id },};
      this.$store.dispatch("fmsCommon/actionAuthPost", _data1).then((data) => {
        this.defaultShowKeys = data.map(val=>{
          return val.id
        })
      //         this.defaultShowKeys = newCheckKeys;

      });

      // funcMenu().then((res) => {
      //   if (res.data.code === 200) {
      //     const { data } = res.data;
      //     this.funcResData = data;
      //     const newData = this.arrToTreeData(data, [], "0");
      //     if (
      //       Array.isArray(newData) &&
      //       newData[0].children &&
      //       newData[0].children.length !== 0
      //     ) {
      //       let newArr = [newData[0].id];
      //       newData[0].children.forEach((item) => {
      //         newArr.push(item.id);
      //       });
      //       this.defaultShowNodes = newArr;
      //     }
      //     this.funcMngData = newData; // 树形数据
      //     // 回显已勾选的菜单

      //     funcByRoleId({ data: row.id }).then((res) => {
      //       if (res.data.code === 200) {
      //         let { data } = res.data;
      //         let newCheckKeys = data.map((item) => {
      //           item = item.funcId;
      //           return item;
      //         });
      //         this.defaultShowKeys = newCheckKeys;
      //         this.funcName = row.roleName;
      //         this.tableRowId = row.id;
      //       }
      //     });
      //   }
      // });
    },
    authorization(row) {
      this.groupId = row.row.id;
      const _data = {
        url: "/role/guest/query-grp-role-userGrp",
        params: { data: row.row.id },
      };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((data) => {
          // data.forEach((item) => {
          //   this.checkedroleData.push(item.id);
          // });
          this.checkedroleData = data.map(item=>item.id)
          this.dialogauthorization = true;
          this.authorizationtitle = row.row.groupName;

         
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //角色提交
    SubmitAuthorization(row) {
      let data = [];
      this.checkedroleData.forEach((item) => {
        for (let c in this.roleData) {
          if (this.roleData[c].id === item) {
            let obj = {
              roleId: item,
              groupId: this.groupId,
              //  roleType:this.roleData[c].roleType
            };
            data.push(obj);
          }
        }
      });

            //若全部取消，则置为#
     if(data.length == 0){
         data.push({roleId:'#',groupId:this.groupId})
      }
      const _data = {
        url: "/userGrp/batch-job-role",
        params: { data: data },
      };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((res) => {
          this.$message({
            message: "授权成功",
            type: "success",
          });
          this.dialogauthorization = false;
          this.checkedroleData = [];
        })
        .catch((err) => {
          console.error(err);
        });
    },

    initData(arr) {
      let args = {};
      arr.map((c) => {
        if (c.set) {
          args[c.field] = null;
        }
      });
      return args;
    },
    commonFilter(value, type) {
      if (
        this.initSelect.hasOwnProperty(type) &&
        typeof this.initSelect[type] != undefined &&
        Array.isArray(this.initSelect[type])
      ) {
        return this.getValueConvert(this.initSelect[type], value);
      }
      if (
        this.initSelect.hasOwnProperty(type) &&
        !Array.isArray(this.initSelect[type]) &&
        this.initSelect[type].hasOwnProperty(value)
      ) {
        return this.initSelect[type][value];
      }
      return value;
    },
    getList() {
      this.listLoading = true;
      Object.assign(this.queryParams, this.listQuery);
      const _data = { url: "/userGrp/guest/items", params: this.queryParams };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((data) => {
          this.list = data.data;
          this.total = data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          console.error(err);
        });
      //   httpUtils.actionWmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
    },

    getValueConvert(arr, value) {
      for (let v of arr) {
        if (v.value == value) {
          return v.label;
        }
      }
      return value;
    },
    destory(hide = false) {
      this.dialogFormVisible = hide;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = "";
        }
      }
    },
    add() {
      this.cols.map((item) => {
        if (item.field === "orgCode") {
          item.set = true;
        }
        return item;
      });
      this.destory(true);
    },
    showDetails(row, column) {},
    edit(row) {
      this.cols.map((item) => {
        if (item.field === "orgCode") {
          item.set = false;
        }
        return item;
      });
      this.dialogFormVisible = true;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p];
        }
      }
    },
    submit(formName) {
      const _data = {
        url: "/userGrp/add",
        params: {
          data: this.defaultForm.params,
        },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionAuthPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: "change success!=>" + data,
              });
              this.dialogFormVisible = false;
              this.query();
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.destory();
            });
        } else {
          this.$message({
            type: "error",
            message: "输入数据不能为空",
          });
          // this.destory();
        }
      });
    },
    query() {
      this.listQuery.current = 1;
      this.getList();
    },
    reset() {
      for (let p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = "";
        }
      }
    },
    // selectOptions() {
    //   //初始通讯协议
    //   let _data = { url: '/constant/protocol-type', params: {} }
    //   this.$store.dispatch('fmsCommon/actionWmsPost', _data)
    //     .then(data => {
    //       this.initSelect.protocol = data.map(c => {
    //         return {
    //           label: c.name,
    //           value: c.value
    //         }
    //       })
    //     }).catch(err => {
    //       console.error(err)
    //     })

    //   //初始化工序信息
    // },
    save(formName) {
      this.defaultForm.row = {};
      this.defaultForm.params.id = ''
      let _data = {
        url: "/userGrp/add",
        params: { data: { ...this.defaultForm.params, status: 1, grade: 0 } },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionAuthPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: "change success!=>" + data,
              });
              this.dialogFormVisible = false;
              this.query();
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.destory();
            });
        } else {
          this.$message({
            type: "error",
            message: "输入数据不能为空",
          });
          // this.destory();
        }
      });
    },
    del(index, row) {
      this.$confirm(
        i18n.t("common.tip_info.delete_info"),
        i18n.t("common.tip_info.tips"),
        {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          const _data = { url: "/org/del", params: { data: row.id } };
          this.$store
            .dispatch("fmsCommon/actionAuthPost", _data)
            .then((data) => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "delete success!",
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "cancel delete",
          });
        });
    },
  },
};
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

.filter-item {
  margin-left: 3px;
}
</style>
