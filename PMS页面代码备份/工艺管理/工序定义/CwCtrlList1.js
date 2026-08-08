
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
        queryUri: '/cw-fms-fms/process/list',
    },
    customToolBar: {
        buttons: [
            {
                text: 'common.btn.add', show: true, icon: 'el-icon-plus', background: '', hideText: false, size: 'mini', callback: function (e, self) {
                    this.vueContext['CwDialogPanel1'].dialogVisible = true
                },
                style: {
                    float: "right",
                    color: "#fff",
                    background: "#FFBA00",
                }
            },
            {
                text: 'Reset', show: true, icon: 'el-icon-refresh-left', background: '', hideText: false, size: 'mini', callback: function (e, self) {
                    self.reset(), self.fieldFormQuery()
                },
                style: {
                    float: "right",
                    color: "#fff",
                    background: "#909399",
                }
            },
            {
                text: 'Search', show: true, icon: 'el-icon-search', background: '', hideText: false, size: 'mini', callback: function (e, self) {
                    self.fieldFormQuery()
                },
                style: {
                    float: "right",
                    color: "#fff",
                    background: "#11a983",
                }
            },

        ],
            show: true,
                left: 5,
                    showFilter: false,
                        showSelectField: false,
                            showExport: false,
                                columnSelectFilter: false,
                                    showUpload: false

    },
    cols: [
        { field: 'processCode', title: '工序编码', minWidth: 200, align: "center", query: true, queryType: 'input', set: true },
        { field: 'processName', title: '工序名称', minWidth: 200, align: "center", query: true, queryType: 'input', set: true },
        { field: 'createTime', title: '创建日期', minWidth: 200, align: "center", query: false, queryType: 'input', set: true },
        { field: 'createUser', title: '创建人', minWidth: 200, align: "center", query: false, queryType: 'input', set: true },
        { field: 'template', title: '模板', minWidth: 200, align: "center", query: false, queryType: 'select', set: true },
        {
            field: 'useState', title: '使用状态', minWidth: 200, align: "center", query: true, queryType: 'select', set: true, jsonSelData: true,
            useState: [
                { label: this.commonI18n("common.role.disabled"), value: '1' },
                { label: this.commonI18n("common.role.enable"), value: '0' },
            ]
        },

    ],
        callback: {
        queryBeforeCallback(data, callback){
            if (callback && typeof callback === 'function') {
                let reqData = data.params.requestData
                let sqlWhere = reqData.sqlWhere
                let url = '/cw-fms-fms/process/list'
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
            field: 'OPER', title: '操作', width: 320, align: "center", queryType: 'input', set: true, require: true, query: false, hide: true, showFilter: false, showField: false,
            buttons: [

            ]
        }],

        formConfig: {
        inline: true,
	},
}