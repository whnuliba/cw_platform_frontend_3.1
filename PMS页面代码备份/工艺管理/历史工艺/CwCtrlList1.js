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
        queryUri: '/cw-fms-fms/process-flow-his/list',
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
                                ]
    },
    cols: [
        { field: 'flowCode', title: '流程编码', width: 200, align: "center", query: true, queryType: 'input', set: true },
        { field: 'flowVersion', title: '版本号', width: 150, align: "center", query: true, queryType: 'input', set: true },
        { field: 'flowName', title: '流程名称', minWidth: 150, align: "center", query: true, queryType: 'input', set: true },
        {
            field: 'cellType', title: '电芯型号', width: 145, align: "center", query: false, queryType: 'select', set: true, selUri: '/cw-fms-fms/cell-type/list',
            cellType: ['cellTypeName', 'cellType'],
        },
        { field: 'lastModifyTime', title: '修改日期', width: 150, align: "center", query: false, queryType: 'input', set: true },
        { field: 'lastModifyUser', title: '修改人', width: 150, align: "center", query: false, queryType: 'input', set: true },
        {
            field: 'changeType', title: '变更状态', width: 150, align: "center", query: false, queryType: 'select', set: true, jsonSelData: true,
            changeType: [
                { label: this.commonI18n("common.ProcessFlowList.normal"), value: 0 },
                { label: this.commonI18n("common.ProcessFlowList.parameterChanging"), value: 1 },
                { label: this.commonI18n("common.ProcessFlowList.processChange"), value: 2 },
                { label: this.commonI18n("common.ProcessFlowList.processDeletion"), value: 3 },
            ],
        },
        // { field: 'status', title: '状态', width: 150, align: "center", query: false, queryType: 'select', set: true, selUri: '/cw-fms-fms/constant/approve-state', status: ['name', 'value'] },
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
                { label: this.commonI18n("common.ProcessFlowList.disabled"), value: '0' },
                { label: this.commonI18n("common.ProcessFlowList.enable"), value: '1' },
            ]
        },

    ],
        selectOptions(){
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

    },
    callback: {
        queryBeforeCallback(data, callback){
            if (callback && typeof callback === 'function') {
                let reqData = data.params.requestData
                let sqlWhere = reqData.sqlWhere
                let url = '/cw-fms-fms/process-flow-his/list'
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
                    text: '参数', icon: '', background: '', size: 'mini', show: function (row) {
                        return true
                    }, callback: function (e, self, row, selected, vueContext) {
                        vueContext['CwDrawerPanel1'].drawerVisible = true
                        vueContext['CwTree1'].dataSource = [];

                        let jsonData = {};
                        jsonData["id"] = row.id;
                        jsonData["label"] = row.flowName;
                        jsonData["template"] = row.template;
                        jsonData["children"] = [];

                        const json = { 'data': row.id }
                        const _data = { url: '/process-flow-dts-his/guest/get-dts', params: json }
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
            ]
        }],

        formConfig: {
        inline: true,
	},
}