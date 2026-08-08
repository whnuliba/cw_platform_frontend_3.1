{
    lazy: false,
        formStyle: { },
    formModes: [
        {
            size: 'mini',
            loading: false,
            display: 'inline',
            title: '流程参数',
            dialogVisible: 'processeditor',
            dialogShow: true,
            labelWidth: '170px',
            cancelBtnShow: true,
            forms: [
                { field: 'processCode', title: '流程编码', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'processName', title: '流程名称', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                {
                    field: 'template', title: '参考模板', align: 'center', width: 120, queryType: 'select', set: true, jsonSelData: true,
                    template: [
                        { label: '无', value: '' }, { label: '化成模板', value: 'chargeModel' },
                        { label: '分容|补电|SOC', value: 'pointsForModel' },
                        { label: '高温静置', value: 'standTimeModel' }, { label: '筛选', value: 'SelectModel' },
                        { label: 'OCV1', value: 'OCV1Model' }, { label: 'OCV2', value: 'OCV2Model' },
                        { label: 'OCV3', value: 'OCV3Model' }, { label: 'DCIR', value: 'DCIRModel' },
                        { label: 'IROCV', value: 'IROCVModel' }, { label: 'TATA化成', value: 'tataChargeModel' },
                        { label: 'DCR', value: 'tataDCRModel' }, { label: 'TATA分容', value: 'tataPointsForModel' },
                    ]
                },
                {
                    field: 'useState', title: '使用状态', align: 'center', width: 120, query: true, set: true, queryType: 'select', jsonSelData: true, useState: [
                        { label: this.commonI18n('common.ProcessFlowList.disabled'), value: '1' },
                        { label: this.commonI18n('common.ProcessFlowList.enable'), value: '0' },
                    ]
                },

            ]
        }
    ]
}