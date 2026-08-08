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
          queryUri: '/cw-fms-fms/approval-todo/list',
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
                    }
                  },
                  /*{
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
                  },*/
                ]
  },
  callback: {
    queryBeforeCallback(data, callback){
      if (callback && typeof callback === 'function') {
        let reqData = data.params.requestData
        let sqlWhere = reqData.sqlWhere
        let userId = sessionStorage.getItem('userInfoArray') && JSON.parse(sessionStorage.getItem('userInfoArray')).userInfo.id
        let url = '/cw-fms-fms/approval-todo/list'
        if (sqlWhere === null || sqlWhere === undefined || sqlWhere.length == 0) {
          this.vueContext['CwCtrlList1'].$children[0].$refs.sqlSearch.searchobj = { status: 7 }  // 给status一个初始值
          let json = { 'current': 1, 'pageSize': 15, requestData: { 'status': 7, 'userId': userId } }
          const _data = { url: url, params: json }
          callback.call(this, _data)
          return { success: true }
        }
        let bizName = undefined
        let status = undefined
        for (let i in sqlWhere) {
          let sqlValue = sqlWhere[i].value
          if (typeof (sqlValue) == 'object')
            sqlValue = sqlValue.join(",")
          if (sqlWhere[i].column === 'bizName' && sqlWhere[i].value !== undefined && sqlWhere[i].value !== null)
            bizName = sqlWhere[i].value;
          if (sqlWhere[i].column === 'status' && sqlWhere[i].value !== undefined && sqlWhere[i].value !== null)// && sqlValue.trim() !== ''
            status = sqlWhere[i].value;
        }
        let json = { 'current': 1, 'pageSize': 15, requestData: { 'status': status, 'bizName': bizName, 'userId': userId } }
        const _data = { url: url, params: json }
        callback.call(this, _data)

      }
      return { success: true }
    }
  },
  cols: [
    { field: 'bizCode', title: '业务编码', align: "center", query: true, queryType: 'input', set: true },
    { field: 'bizName', title: '业务名称', align: "center", query: true, queryType: 'input', set: false },
    { field: 'createTime', title: '创建日期', align: "center", query: false, queryType: 'input', set: false },
    { field: 'createUser', title: '创建人', align: "center", query: false, queryType: 'input', set: false },
    { field: 'status', title: '状态', align: "center", query: true, queryType: 'select', set: false, jsonSelData: true, status: [{ label: '完结', value: 2 }, { label: '已驳回', value: 4 }, { label: '同意', value: 6 }, { label: '待审批', value: 7 }] },
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


          // {
          //   text: '编辑', background: '', size: 'mini', show: function (row) {
          //     return true
          //   }, callback: function (e, self, row, selected, vueContext) {
          //     vueContext['CwDialogPanel1'].modelTitle = '编辑审批类型'
          //     vueContext['CwDialogPanel1'].dialogVisible = true
          //     console.log(row)
          //     this.$nextTick(() => {
          //       vueContext['CwForm1'].iform.processeditor.params['bizName'] = String(row['bizName'])
          //       vueContext['CwForm1'].iform.processeditor.params['id'] = String(row['id'])
          //       vueContext['CwForm1'].iform.processeditor.params['uri'] = String(row['uri'])
          //       console.log(vueContext['CwForm1'].iform.processeditor)
          //     })


          //     // vueContext['CwForm3'].iform['processeditor'].params = row
          //   }
          // },
          {
            text: '审批', background: '', size: 'mini', show: function (row) {
              return row.status == 7 ? true : false
            }, callback: function (e, self, row, selected, vueContext) {
              let _this = this
              vueContext['CwDialogPanel1'].modelTitle = '编辑流程'
              vueContext['CwDialogPanel1'].dialogVisible = true
              vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'] = row
              vueContext['CwTree1'].dataSource = [];
              const jsonTop = { 'data': row.sourceId }
              const _dataTop = { url: '/process-flow-tmp/guest/process-flow-by-id', params: jsonTop }
              this.$store.dispatch('fmsCommon/actionFmsPost', _dataTop).then(data => {
                const jsonData = {}
                jsonData['id'] = data.id
                jsonData['label'] = data.flowName
                jsonData['template'] = data.template
                jsonData['children'] = []
                const json = { 'data': row.sourceId }
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


              })


            }
          },

        ]
      }
    ],
      formConfig: {
    inline: true,
	},
}