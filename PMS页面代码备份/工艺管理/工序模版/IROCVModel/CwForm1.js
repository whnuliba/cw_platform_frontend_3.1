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
            // forms:[

            // ],
            forms: [
                { field: 'VoltageLowerLmt', title: '电压下限(mV)', en_title: 'Voltage Lower', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'VoltageUpperLmt', title: '电压上限(mV)', en_title: 'Voltage Upper', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'IRLowerLmt', title: '内阻下限(mΩ)', en_title: 'IR Lower', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'IRUpperLmt', title: '内阻上限(mΩ)', en_title: 'IR Upper', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGRetestNum', title: 'NG复测数量(ea)', en_title: 'NG Retest Quantity', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGRetestCount', title: 'NG复测次数(ea)', en_title: 'NG Retest Count', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGOutboundLimit', title: 'NG出库限制(ea)', en_title: 'NG Outbound Limit', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'kLow', title: 'K值下限', en_title: 'K Lower', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'kUp', title: 'K值上限', en_title: 'K Upper', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                {
                    field: 'TestOption', title: 'OCV/IR测试选项', en_title: 'OCV/IR Test Options', minWidth: 100, boxWidth: "120px", align: 'center', queryType: 'checkbox', set: true, require: false, query: false, hide: false,
                    TestOption: [
                        { field: 'ocvTest', label: 'OCV' },
                        { field: 'irTest', label: 'IR' },
                    ]
                },

            ],
        }
    ]
}