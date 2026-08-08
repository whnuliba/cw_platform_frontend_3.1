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
            labelWidth: '210px',
            cancelBtnShow: true,
            forms: [
                { field: 'VoltageLowerLmt', title: '电压下限(mV)', en_title: 'Voltage Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'VoltageUpperLmt', title: '电压上限(mV)', en_title: 'Voltage Upper', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'IRLowerLmt', title: '内阻下限(mΩ)', en_title: 'IR Lower', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'IRUpperLmt', title: '内阻上限(mΩ)', en_title: 'IR Upper', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGRetestNum', title: 'NG复测数量(ea)', en_title: 'NG Retest Quantity', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGRetestCount', title: 'NG复测次数(ea)', en_title: 'NG Retest Count', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGOutboundLimit', title: 'NG出库限制(ea)', en_title: 'NG Outbound Limit', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'kLow', title: 'K值下限', en_title: 'K Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'kUp', title: 'K值上限', en_title: 'K Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                //{ field: 'STATUS', title: '状态', en_title: '', boxWidth: '150px', align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },           
                { field: 'TEXT', title: 'K值计算', en_title: 'K-value Calculation', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'isKeyCalculate', title: '是否开启K值计算', en_title: 'Enable K-value Calculation', boxWidth: '700px',align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },

                //{ field: 'TEXT1', title: '单盘K值计算', en_title: '', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },      
                //{ field: 'isKeyTrayCalculate', title: '是否开启单盘K值计算',minWidth: 120,  align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },
                //{ field: 'sigma', title: 'sigma倍数',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                //{ field: 'trayKLow', title: '单盘K值下限',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                //{ field: 'trayKUp', title: '单盘K值上限',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'TEXT2', title: 'OCV/IR测试选项', en_title: 'OCV/IR Test Options', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'ocvChoose', title: 'OCV选择', en_title: 'Ocv Choose', boxWidth: '150px', align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false },
                {
                    field: 'TestOption', title: '测试选项', en_title: 'Test Options', boxWidth: "120px", align: 'center', queryType: 'checkbox', set: true, require: false, query: false, hide: false,
                    TestOption: [
                        { field: 'ocvTest', label: 'OCV' },
                        { field: 'irTest', label: 'IR' },
                    ]
                },

            ],

        }
    ]
}
