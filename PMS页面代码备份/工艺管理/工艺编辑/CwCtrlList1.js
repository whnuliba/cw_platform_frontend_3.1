{
  mounted(){ },
  page: {
    searchInline: true,
      searchSize: 'medium',
        showPage: true,
          lazy: false,
            listQuery: {
      current: 1,
        pageSize: 15
    }
  },
  url: {
    deleteUri: '/cw-pms-app/pms_audit_comm_doc/deleteById',
      editUri: '/cw-pms-app/pms_audit_comm_doc/updateById',
        addUri: '/cw-fms-fms/process-flow-tmp/addflow',
          queryUri: '/cw-fms-fms/process-flow-tmp/list',
            batchAddUri: '/cw-pms-app/pms_audit_comm_doc/batchCreateBaseComponent'
  },
  customToolBar: {
    show: true,
      showFilter: true,
        showSelectField: true,
          showExport: true,
            columnSelectFilter: true,
              showUpload: true,
                buttons: [
                  {
                    text: 'Search', show: true, icon: 'el-icon-search', background: '', size: 'mini', hideText: false, callback: function (e, self) {
                      self.fieldFormQuery()
                    },
                    style: {

                    }
                  },
                  {
                    text: 'Reset', show: true, icon: 'el-icon-refresh-left', background: '', hideText: false, size: 'mini', callback: function (e, self) {
                      self.reset()
                    }
                  },
                  {
                    text: '增加', icon: 'el-icon-plus', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                      self.vueContext['CwDialogPanel1'].dialogVisible = true
                      self.vueContext['CwForm3'].formModes[0].forms.forEach(itemcol => {
                        if (itemcol.field == 'flowCode' || itemcol.field == 'cellType')
                          itemcol['disabled'] = false
                      })
                      self.vueContext['CwForm3'].iform.processeditor.params = {}


                      // vueContext['CwForm3'].iform['processeditor'].params = row
                    }
                  },
                  {
                    text: '编辑', icon: 'el-icon-edit', background: '', permCode: 'audit_comm_doc_edit', size: 'mini', hideText: true, callback: function (e, self) {


                      self.edit(self.boxSelectValue[0])
                    }
                  },
                  {
                    text: '删除', icon: 'el-icon-delete', background: '', permCode: 'audit_comm_doc_delete', size: 'mini', hideText: true, callback: function (e, self) {
                      self.handleDelete(self.boxSelectValue[0])
                    }
                  },
                ]
  },

  cols: [
    // { field: 'DOC_S_CODE', title: '文档编码', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true, hide: false,disabled:false, },
    // { field: 'cellBarcode', title: '电芯条码', minWidth: 220  ,  align: 'center',query:true,queryType:'input' },


    { field: 'flowCode', title: '流程编码', width: 120, align: "center", query: true, queryType: 'input', set: true },
    { field: 'flowVersion', title: '版本号', width: 120, align: "center", query: false, queryType: 'input', set: false },
    { field: 'flowName', title: '流程名称', align: 'center', width: 120, query: true, queryType: 'input', set: true },
    { field: 'cellType', title: '电芯型号', align: 'center', width: 100, queryType: 'select', set: true, selUri: '/cw-fms-fms/cell-type/guest/getall', cellType: ['cellTypeName', 'id'], itemParams: {} },
    { field: 'createTime', title: '创建日期', align: 'center', width: 170 },
    { field: 'createUser', title: '创建人', align: 'center', width: 80 },
    {
      field: 'changeType', title: '变更状态', align: 'center', width: 120, queryType: 'select', jsonSelData: true,
      changeType: [
        { label: this.commonI18n('common.ProcessFlowList.normal'), value: 0 },
        { label: this.commonI18n('common.ProcessFlowList.parameterChanging'), value: 1 },
        { label: this.commonI18n('common.ProcessFlowList.processChange'), value: 2 },
        { label: this.commonI18n('common.ProcessFlowList.processDeletion'), value: 3 },
      ],
    },
    //{ field: 'status', title: '状态', align: 'center', width: 80, queryType: 'select', selUri: '/cw-fms-fms/constant/approve-state', status: ['name', 'value'], itemParams: {} },
    {
      field: 'status', title: '状态', width: 150, align: "center", query: false, queryType: 'select', set: true, jsonSelData: true,
      status: [
        { label: this.commonI18n('common.todo.stash'), value: 0 },
        { label: this.commonI18n('common.todo.underApproval'), value: 1 },
        { label: this.commonI18n('common.todo.end'), value: 2 },
        { label: this.commonI18n('common.todo.cancel'), value: 3 },
        { label: this.commonI18n('common.todo.return'), value: 4 },
        { label: this.commonI18n('common.todo.scrap'), value: 5 },
        { label: this.commonI18n('common.todo.agree'), value: 6 },
        { label: this.commonI18n('common.todo.pending'), value: 7 },
        { label: this.commonI18n('common.todo.change'), value: 8 },
        { label: this.commonI18n('common.todo.delete'), value: 9 },
        { label: this.commonI18n('common.todo.archive'), value: 10 },
      ]
    },
    {
      field: 'flowType', title: '流程类型', align: 'center', width: 120, queryType: 'select', set: true, jsonSelData: true,
      flowType: [
        { label: this.commonI18n('common.ProcessFlowList.normalFlowType'), value: 0 },
        { label: this.commonI18n('common.ProcessFlowList.retestFlowType'), value: 1 },
      ]
    },
    {
      field: 'useState', title: '使用状态', align: 'center', width: 120, query: true, set: true, queryType: 'select', jsonSelData: true,
      useState: [
        { label: this.commonI18n('common.ProcessFlowList.disabled'), value: '0' },
        { label: this.commonI18n('common.ProcessFlowList.enable'), value: '1' },
      ]
    },



    // { field: 'bTime', title: '开始时间', hide: true, align: 'center', query: true, queryType: 'date' },
    // { field: 'eTime', title: '结束时间', hide: true, align: 'center', query: true, queryType: 'date' },
  ],
    /* selectOptions(){
         let tdata = { url: '/constant/approve-state', params: {} }
         this.$store.dispatch('fmsCommon/actionFmsPost', tdata).then(data => {
             this.initSelect.status = data.map(c => {
                 let name = this.commonI18n(c.name)
                 return {
                     label: name,
                     value: c.value
                 }
             })
         }).catch(err => {
             console.error(err)
         })
 
     },*/
    toolColumns: [
      {
        field: 'OPER', title: '操作', width: 380, align: "left", queryType: 'input', set: false, require: true, query: false, hide: false, showFilter: false, showField: false,
        buttons: [
          {
            text: 'common.processFlowTmpList.configure', background: '', size: 'mini', show: function (row) {

              return true
            }, callback: function (e, self, row, selected, vueContext) {
              vueContext['CwDrawerPanel1'].drawerVisible = true
              vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'] = row
              vueContext['CwTree1'].dataSource = [];

              let jsonData = {};
              jsonData["id"] = row.id;
              jsonData["label"] = row.flowName;
              jsonData["template"] = row.template;
              jsonData["children"] = [];

              const json = { 'data': row.id }
              const _data = { url: '/process-flow-tmp-dts/guest/get-dts', params: json }
              this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(response => {
                const data = response
                for (let i = 0; i < data.length; i++) {
                  const jsonTemp = {}
                  const st = (data[i].status == 2 || data[i].status == null) ? '' : '_[跳站]'
                  jsonTemp['id'] = data[i].id
                  jsonTemp['label'] = '[工序0' + data[i].flowSort + ']_' + data[i].processCode + '_' + data[i].processName + st
                  jsonTemp['template'] = data[i].template
                  jsonTemp['processId'] = data[i].processId
                  jsonData['children'].push(jsonTemp)
                }
                vueContext['CwTree1'].dataSource.push(jsonData)
              })

            }
          },
          {
            text: 'common.processFlowTmpList.process', background: '', size: 'mini', show: function (row) {

              if (row.status != 1 && row.changeType != 1 && row.changeType != 3) {
                return true
              } else {
                return false
              }
            }, callback: function (e, self, row, selected, vueContext) {
              vueContext['CwDialogPanel2'].dialogVisible = true
              vueContext['CwProcessFlowChart1'].load(row)
              // self.$set(vueContext['CwDialogPanel2'],'drawerVisible',true)

            }
          },
          {
            text: 'common.processFlowTmpList.edit', background: '', size: 'mini', show: function (row) {
              if (row.status == 0 || row.status == 4 || row.status == 8) {
                return true
              } else {
                return false
              }

            }, callback: function (e, self, row, selected, vueContext) {
              vueContext['CwForm1'].formModes[0].forms.forEach(itemcol => {
                vueContext['CwDialogPanel1'].dialogVisible = true
                if (itemcol.field == 'flowCode')
                  // || itemcol.field == 'cellType'
                  itemcol['disabled'] = true
              })

              for (let i in row) {
                vueContext['CwForm1'].iform['processeditor'].params[i] = String(row[i])
              }
              // vueContext['CwForm3'].iform['processeditor'].params = row
            }
          },
          {
            text: 'common.processFlowTmpList.delete', btnType: 'warning', background: '', size: 'mini', show: function (row) {
              if (row.status == 0 || (!row.changeType && row.status == 4)) {
                return true
              } else {
                return false
              }

            }, callback: function (e, self, row, selected, vueContext) {
              let _this = this
              self.$confirm(`确定删除工艺 ${row.flowName} 吗? `, self.$t("common.btn.hint"), {
                confirmButtonText: self.$t("common.btn.ok"),
                cancelButtonText: self.$t("common.btn.cancel"),
                type: "warning",
              }).then(() => {
                let json = { data: row.id };
                const _data = { url: "/process-flow-tmp/del", params: json };
                this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
                  /**********删除script******/
                  let paramChart = {
                    data: {
                      bizType: "COMM_PR_FLOW_TYPE",
                      bizCode: row.flowCode,
                    },
                  };
                  const _data1 = { url: "/page-conf/guest/biz-type-code", params: paramChart };
                  this.$store.dispatch("fmsCommon/actionTaskPost", _data1).then((response) => {
                    if (response.length) {
                      let id = response[0].id;
                      const _data2 = { url: "/page-conf/del", params: { data: id } };
                      this.$store.dispatch("fmsCommon/actionTaskPost", _data2).then((data) => {
                        this.$message({
                          message: this.$t("common.btn.deleteSuccess"),
                          type: "success",
                        });
                      });
                    }
                  });
                  function initList(json) {
                    const loading = _this.$loading({
                      lock: true,
                      text: 'Loading',
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                    });
                    const _data = { url: "/process-flow-tmp/list", params: json };
                    _this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
                      vueContext['CwCtrlList1'].data = response.data;
                      vueContext['CwCtrlList1'].page.total = response.total;
                      loading.close()
                    });
                  }
                  let json = { current: 1, pageSize: 15, requestData: {} };
                  initList(json);
                });
              })

            }
          },
          {
            text: 'common.processFlowTmpList.cancel', background: '', size: 'mini', show: function (row) {
              if (row.status == 8 || (row.changeType && row.status == 4)) {
                return true
              } else {
                return false
              }

            }, callback: function (e, self, row, selected, vueContext) {
              let _this = this
              this.$confirm(
                this.$t("common.processFlowTmpList.cancelUpdateProcess"),
                this.$t("common.btn.hint"),
                {
                  confirmButtonText: this.$t("common.btn.ok"),
                  cancelButtonText: this.$t("common.btn.cancel"),
                  type: "warning",
                }
              )
                .then(() => {
                  let json = { data: { flowId: row.id, status: row.status } };
                  const _data = {
                    url: "/process-flow-tmp/process-flow-tmp-cancel",
                    params: json,
                  };
                  this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
                    this.$message({
                      message: this.$t("common.btn.Cancelled"),
                      type: "success",
                    });
                    function initList(json) {
                      const loading = _this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                      });
                      const _data = { url: "/process-flow-tmp/list", params: json };
                      _this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
                        vueContext['CwCtrlList1'].data = response.data;
                        vueContext['CwCtrlList1'].page.total = response.total;
                        loading.close()
                      });
                    }
                    let json = { current: 1, pageSize: 15, requestData: {} };
                    initList(json);
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: this.$t("common.btn.Cancelled"),
                  });
                });

            }
          },
        ]
      }
    ],
      formConfig: {
    inline: true,
	},
}