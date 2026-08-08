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
          showFilter: false,
              showSelectField: false,
                  showExport: false,
                      columnSelectFilter: false,
                          showUpload: false,
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
                                          self.fieldFormQuery()
                                      }
                                  },
                                  {
                                      text: '增加', icon: 'el-icon-plus', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                                          self.vueContext['CwDialogPanel1'].dialogVisible = true
                                          self.vueContext['CwDialogPanel1'].modelTitle = this.$t('common.todo.new_approval_type')//'新建审批类型'
                                          let row = self.vueContext['CwForm1'].iform.processeditor.params
                                          for (let i in row) {
                                              row[i] = ''
                                          }
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
  ],
      callback: {
      queryBeforeCallback(data, callback){
          if (callback && typeof callback === 'function') {
              let reqData = data.params.requestData
              let sqlWhere = reqData.sqlWhere
              let url = '/cw-fms-fms/approval/list'
              let json = {}
              if (sqlWhere != null || sqlWhere != undefined || sqlWhere.length != 0) {
                  for (let i in sqlWhere) {
                      if (sqlWhere[i].value !== undefined && sqlWhere[i].value !== null)
                          json[sqlWhere[i].column] = sqlWhere[i].value;
                  }
                  data.params.requestData = json
              }
              const _data = { url: url, params: data.params }
              callback.call(this, _data)

          }
          return { success: true }
      }
  },
  toolColumns: [
      {
          field: 'OPER', title: '操作', width: 300, align: "left", queryType: 'input', set: false, require: true, query: false, hide: false, showFilter: false, showField: false,
          buttons: [


              {
                  text: 'common.btn.edit', background: '', size: 'mini', show: function (row) {
                      return true
                  }, callback: function (e, self, row, selected, vueContext) {
                      vueContext['CwDialogPanel1'].modelTitle = this.$t('common.todo.edit_approval_type')
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
                  text: 'common.todo.approver', background: '', size: 'mini', show: function (row) {
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
                          { field: 'id', title: 'id', align: "left", eidt: true, queryType: 'text', set: true, hide: true, },
                          { field: 'userId', title: '用户ID', align: "left", eidt: true, queryType: 'text', set: true, hide: true, },
                          { field: 'userName', title: '登录名', align: "left", eidt: true, queryType: 'text', set: false },
                          { field: 'realName', title: '姓名', align: "left", eidt: true, queryType: 'text', set: false },
                          { field: 'createUser', title: '创建人', align: "left", eidt: true, queryType: 'text', set: false },
                          { field: 'createTime', title: '创建时间', align: "left", eidt: true, queryType: 'text', set: false },
                      ]
                      let operColumns = [
                          {
                              field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [

                                  {
                                      text: '删除', background: '', size: 'mini', hideText: true, show: function (row) {

                                          return true
                                      }, callback: function (e, self, row) {
                                          this.$confirm(this.$t('common.todo.delete_approval_users'), this.$t('common.tip_info.tips'), {
                                              confirmButtonText: this.$t('common.btn.ok'),
                                              cancelButtonText: this.$t('common.btn.cancel'),
                                              type: 'warning'
                                          }).then(() => {
                                              _this.vueContext['CwDesignTable1'].dataLoading = true;

                                              let json = { data: row.id }
                                              const _data = { url: '/approval/deluser', params: { data: row.id } }
                                              this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                                                  if (data) {
                                                      this.$message({
                                                          message: this.$t('common.btn.deleteSuccess') ,//'删除成功！',
                                                          type: 'success'
                                                      })
                                                  }
                                                  initApprovalUser()

                                              })
                                          }).catch(() => {
                                              this.$message({
                                                  type: 'info',
                                                  message: this.$t('common.btn.Cancelled')//'已取消'
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