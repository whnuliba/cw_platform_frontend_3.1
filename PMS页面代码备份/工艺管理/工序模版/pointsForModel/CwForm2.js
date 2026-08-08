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
            labelWidth: '240px',
            cancelBtnShow: true,
            forms: [

                { field: 'endVoltStep', title: '结束电压选择步次', en_title: 'End Voltage Selection Step', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'endCapaStep', title: '结束容量选择步次', en_title: 'End Capacity Selection Step', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'startVoltStep', title: '开始电压选择步次', en_title: 'Start Voltage Selection Step', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'endCCCVCapacityStep', title: '结束充电容量选择步次', en_title: 'End Charge Capacity Selection Step', boxWidth: '150px', align: "center", queryType: 'daterange', set: true, require: false, query: false, hide: false },
                { field: 'endCapacityStep', title: '结束放电容量选择步次', en_title: 'End Discharge Capacity Selection Step', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'NGRetestCount', title: 'NG复测次数(ea)', en_title: 'NG Retest Times', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'nGNumUp', title: 'NG个数上限', en_title: 'NG Quantity Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'ocvNgCount', title: 'OCVNG数量(ea)', en_title: 'OCV NG Quantity', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'contactNgCount', title: '接触测试NG数量(ea)', en_title: 'Contact Test NG Quantity', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'chargeNgCount', title: '充放电NG数量(ea)', en_title: 'Charge-Discharge NG Quantity', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'globalNGLimit', title: '全部NG上限(ea)', en_title: 'Total NG Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'outTrayNglimit', title: '出库NG上限', en_title: 'Outbound NG Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },



            ],
        }
    ]
}