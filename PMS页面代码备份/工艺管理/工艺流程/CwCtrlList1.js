{
    page: {
        searchInline: true,
            searchSize: 'medium',
                showPage: true,
                    listQuery: {
            current: 1,
                pageSize: 15
        }
    },
    url: {
        queryUri: '/cw-fms-fms/process-flow/list',
    },
    customToolBar: {
        style: { float: "left" },
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
                                            color: "#fff",
                                            background: "#11a983",
                                            border: "#11a983"
                                        }
                                    },
                                    {
                                        text: 'Reset', show: true, icon: 'el-icon-refresh-left', background: '', hideText: false, size: 'mini', callback: function (e, self) {
                                            self.reset()
                                            self.fieldFormQuery()
                                        }, style: {
                                            color: "#fff",
                                            background: "#11a983",
                                            border: "#11a983"
                                        }
                                    },
                                ]
    },
    cols: [
        { field: 'flowCode', title: '流程编码', width: 200, align: "center", query: true, queryType: 'input', set: true },
        { field: 'flowVersion', title: '版本号', width: 150, align: "center", query: false, queryType: 'input', set: true },
        { field: 'flowName', title: '流程名称', minWidth: 150, align: "center", query: true, queryType: 'input', set: true },
        {
            field: 'cellType', title: '电芯型号', width: 145, align: "center", query: true, queryType: 'select', set: true, selUri: '/cw-fms-fms/cell-type/list',
            cellType: ['cellTypeName', 'cellType'],
        },
        { field: 'createTime', title: '创建日期', width: 150, align: "center", query: false, queryType: 'input', set: true },
        { field: 'createUser', title: '创建人', width: 150, align: "center", query: false, queryType: 'input', set: true },
        {
            field: 'changeType', title: '变更状态', width: 150, align: "center", query: false, queryType: 'select', set: true, jsonSelData: true,
            changeType: [
                { label: this.commonI18n('common.ProcessFlowList.normal'), value: 0 },
                { label: this.commonI18n('common.ProcessFlowList.parameterChanging'), value: 1 },
                { label: this.commonI18n('common.ProcessFlowList.processChange'), value: 2 },
                { label: this.commonI18n('common.ProcessFlowList.processDeletion'), value: 3 },
            ],
        },
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
            field: 'useState', title: '使用状态', width: 150, align: "center", query: true, queryType: 'select', set: true, jsonSelData: true,
            useState: [
                { label: this.commonI18n('common.ProcessFlowList.disabled'), value: '0' },
                { label: this.commonI18n('common.ProcessFlowList.enable'), value: '1' },
            ]
        },

    ],
        /*  selectOptions(){
              let tdata = { url: '/constant/approve-state', params: {} }
              this.$store.dispatch('fmsCommon/actionFmsPost', tdata).then(data => {
                  this.initSelect.status = data.map(c => {
                    console.log("a",c.name,this.commonI18n(c.name))
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
        callback: {
        queryBeforeCallback(data, callback){
            if (callback && typeof callback === 'function') {
                let reqData = data.params.requestData
                let sqlWhere = reqData.sqlWhere
                let url = '/cw-fms-fms/process-flow/list'
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
            field: 'OPER', title: '操作', width: 320, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false, showFilter: false, showField: false,
            buttons: [
                {
                    text: 'common.ProcessFlowList.parameter', icon: '', background: '', size: 'mini', show: function (row) {
                        return row.changeType == 0 ? true : false
                    }, callback: function (e, self, row, selected, vueContext) {
                        vueContext['CwDrawerPanel1'].drawerVisible = true
                        vueContext['CwProcessFlowDiagram1'].load(row)
                    }
                },
                {
                    text: 'common.ProcessFlowList.change', icon: '', background: '', size: 'mini', show: function (row) {
                        return row.changeType == 0 ? true : false
                    }, callback: function (e, self, row, selected) {
                        this.$confirm(this.$t('common.tip_info.change_process_info'), this.$t('common.btn.hint'), {//`你确定要变更流程 ${row.flowName} 吗?`
                            confirmButtonText: this.$t('common.btn.ok'),
                            cancelButtonText: this.$t('common.btn.cancel'),
                            type: 'warning'
                        }).then(() => {
                            let json = { data: { bizId: row.id, changeType: 2 } };
                            const _data = { url: '/process-flow/process-flow-change-apply', params: json }
                            this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                                if (data) {
                                    this.$message({
                                        message: this.$t('common.btn.submitSuccess'),
                                        type: 'success'
                                    });
                                    self.fieldFormQuery()
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: this.$t('common.btn.Cancelled'),
                            });
                        });
                    }
                },
                {
                    text: 'common.ProcessFlowList.copy', icon: '', background: '', size: 'mini', show: function (row) { return true }, callback: function (e, self, row, selected) {
                        this.$confirm(this.$t('common.tip_info.copy_process_info'), this.$t('common.btn.hint'), {//`你确定要复制流程 ${row.flowName} 吗?`
                            confirmButtonText: this.$t('common.btn.ok'),
                            cancelButtonText: this.$t('common.btn.cancel'),
                            type: 'warning'
                        }).then(() => {
                            let json = { data: row.id };
                            const loading = this.$loading({
                                lock: true,
                                text: 'Loading',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            const _data = { url: '/process-flow/process-flow-copy', params: json }
                            this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {

                                this.$message({
                                    message: this.$t('common.btn.submitSuccess'),
                                    type: 'success'
                                });
                            }).finally(() => {
                                loading.close();
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: this.$t('common.btn.Cancelled'),
                            });
                        });
                    }
                },
                {
                    text: 'common.ProcessFlowList.delete', icon: '', background: '', size: 'mini', show: function (row) {
                        return row.changeType == 0 ? true : false
                    }, callback: function (e, self, row, selected) {
                        this.$confirm(this.$t('common.tip_info.delete_process_info'), this.$t('common.btn.hint'), {//`你确定删除流程 ${row.flowName} 吗?`
                            confirmButtonText: this.$t('common.btn.ok'),
                            cancelButtonText: this.$t('common.btn.cancel'),
                            type: 'warning'
                        }).then(() => {
                            let json = { data: { bizId: row.id, changeType: 3 } }
                            const _data = { url: '/process-flow/process-flow-change-apply', params: json }
                            this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                                this.$message({
                                    message: this.$t('common.btn.deleteSuccess'),
                                    type: 'success'
                                })
                                self.fieldFormQuery()
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: this.$t('common.btn.Cancelled'),
                            })
                        })

                    }
                }
            ]
        }],

        formConfig: {
        inline: true,
	},
}