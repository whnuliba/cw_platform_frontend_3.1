{
  mounted(){

  },
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
        addUri: '/approval/add',
          queryUri: '/cw-fms-fms/approval/list',
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
                      self.vueContext['CwDialogPanel1'].modelTitle = '新建审批类型'
                      let row = self.vueContext['CwForm1'].iform.processeditor.params
                      for (let i in row) {
                        row[i] = ''
                      }
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
    { field: 'bizCode', title: '业务编码', align: "center", query: true, queryType: 'input', set: true },
    { field: 'bizName', title: '业务名称', align: "center", query: true, queryType: 'input', set: false },
    { field: 'createTime', title: '创建日期', align: "center", query: false, queryType: 'input', set: false },
    { field: 'createUser', title: '创建人', align: "center", query: false, queryType: 'input', set: false },
    { field: 'uri', title: '地址模板', align: "center", query: false, queryType: 'input', set: false },

    // { field: 'flowName', title: '流程名称', align: 'center', width: 120, query: true, queryType: 'input', set: true },
    // { field: 'cellType', title: '电芯型号', align: 'center', width: 100, queryType: 'select', set: true, selUri: '/cw-fms-fms/cell-type/guest/getall', cellType: ['cellTypeName', 'id'], itemParams: {} },
    // { field: 'createTime', title: '创建日期', align: 'center', width: 170 },
    // { field: 'createUser', title: '创建人', align: 'center', width: 80 },
    // { field: 'changeType', title: '变更状态', align: 'center', width: 120, queryType: 'select', jsonSelData: true, changeType: [{ label: '正常', value: 0 }, { label: '参数变更中', value: 1 }, { label: '流程变更中', value: 2 }, { label: '流程删除', value: 3 }] },
    // { field: 'status', title: '状态', align: 'center', width: 80, queryType: 'select', selUri: '/cw-fms-fms/constant/approve-state', status: ['name', 'value'], itemParams: {} },
    // { field: 'flowType', title: '流程类型', align: 'center', width: 120, queryType: 'select', set: true, selUri: '/cw-fms-auth/sys-params/sys-p-code', itemParams: { data: "PROCESS.FLOW" }, flowType: ['paramKey', 'paramValue'] },
    // { field: 'useState', title: '使用状态', align: 'center', width: 120, query: true, set: true, queryType: 'select', jsonSelData: true, useState: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] },



  ],
    toolColumns: [
      {
        field: 'OPER', title: '操作', width: 300, align: "left", queryType: 'input', set: false, require: true, query: false, hide: false, showFilter: false, showField: false,
        buttons: [


          {
            text: '编辑', background: '', size: 'mini', show: function (row) {
              return true
            }, callback: function (e, self, row, selected, vueContext) {
              vueContext['CwDialogPanel1'].modelTitle = '编辑审批类型'
              vueContext['CwDialogPanel1'].dialogVisible = true
              console.log(row)
              this.$nextTick(() => {
                vueContext['CwForm1'].iform.processeditor.params['bizName'] = String(row['bizName'])
                vueContext['CwForm1'].iform.processeditor.params['id'] = String(row['id'])
                vueContext['CwForm1'].iform.processeditor.params['uri'] = String(row['uri'])
                console.log(vueContext['CwForm1'].iform.processeditor)
              })


              // vueContext['CwForm3'].iform['processeditor'].params = row
            }
          },
          {
            text: '审批人', background: '', size: 'mini', show: function (row) {
              return true
            }, callback: function (e, self, row, selected, vueContext) {
              let _this = this
              _this.vueContext['CwDesignTable1'].dataLoading = true;
              function filterUser(us, id) {
                for (let i in us) {
                  if (us[i].id == id) {
                    return us[i]
                  }
                }
              }
              function initApprovalUser() {
                const _data0 = { url: '/user/get-all', params: {} }
                _this.$store.dispatch('fmsCommon/actionAuthPost', _data0).then(userdata => {
                  vueContext['CwSelect1'].dataObtainedByEditor['userdata'] = userdata
                  vueContext['CwSelect1'].options = userdata.map(item => {
                    return {
                      label: item.realName,
                      value: item.id
                    }
                  })

                  const _data = {
                    url: '/approval/guest/approval-getuser', params: {
                      current: 1,
                      pageSize: 15,
                      data: row.bizCode
                    }
                  }

                  _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                    data.forEach(function (d, i) {
                      let u = filterUser(userdata, d.userId);
                      if (u != undefined) {
                        d["realName"] = u.realName;
                        d["userName"] = u.userName;
                      } else {
                        d["realName"] = '';
                        d["userName"] = '';
                      }
                    });
                    vueContext.CwDesignTable1.data = data
                    _this.vueContext['CwDesignTable1'].dataLoading = false;
                  })
                })
              }
              let column = [
                { field: 'id', title: 'id', align: "center", query: true, queryType: 'input', set: true, hide: true, },
                { field: 'userId', title: '用户ID', align: "center", query: true, queryType: 'input', set: true, hide: true, },
                { field: 'userName', title: '登录名', align: "center", query: true, queryType: 'input', set: false },
                { field: 'realName', title: '姓名', align: "center", query: false, queryType: 'input', set: false },
                { field: 'createUser', title: '创建人', align: "center", query: false, queryType: 'input', set: false },
                { field: 'createTime', title: '创建时间', align: "center", query: false, queryType: 'input', set: false },
              ]
              let operColumns = [
                {
                  field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [

                    {
                      text: '删除', background: '', size: 'mini', hideText: true, show: function (row) {

                        return true
                      }, callback: function (e, self, row) {
                        this.$confirm('确定删除此审批用户吗？？', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          _this.vueContext['CwDesignTable1'].dataLoading = true;

                          let json = { data: row.id }
                          const _data = { url: '/approval/deluser', params: { data: row.id } }
                          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                            if (data) {
                              this.$message({
                                message: '删除成功！',
                                type: 'success'
                              })
                            }
                            initApprovalUser()

                          })
                        }).catch(() => {
                          this.$message({
                            type: 'info',
                            message: '已取消'
                          })
                        })
                      },
                      style: {
                        float: 'left'
                      }
                    },

                  ]
                },
              ]

              // this.$set(vueContext['CwCtrlList1'].dataObtainedByEditor,'rowTableData',row)
              vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'] = row
              vueContext['CwDialogPanel2'].dialogVisible = true
              vueContext.CwDesignTable1.cols = column
              vueContext.CwDesignTable1.operColumns = [...operColumns]

              vueContext.CwInput1.value = row.bizCode
              vueContext.CwInput2.value = row.bizName
              initApprovalUser()



            }
          },

        ]
      }
    ],
      formConfig: {
    inline: true,
	},
}