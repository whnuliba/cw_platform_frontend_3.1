{
    lazy: false,
        formStyle: { },
    formModes: [
        {
            size: 'mini',
            loading: false,
            display: 'inline',
            title: '流程参数',
            dialogVisible: 'test',
            dialogShow: true,
            labelWidth: '170px',
            cancelBtnShow: true,
            forms: [
                { field: 'defocusRateLower', title: '离焦率下限', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'defocusRateUpper', title: '离焦率上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weldingSpeedLower', title: '焊接速度下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weldingSpeedUpper', title: '焊接速度上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weldingPeakPowerPLower', title: '焊接峰值功率下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weldingPeakPowerPUpper', title: '焊接峰值功率上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'protectiveGasFlowRateLower', title: '保护气体流量下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'protectiveGasFlowRateUpper', title: '保护气体流量上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'effectivePenetrationDepthLower', title: '有效熔深下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'effectivePenetrationDepthUpper', title: '有效熔深上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'meltWidthLower', title: '熔宽下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'meltWidthUpper', title: '熔宽上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
            ],

        }
    ]
}