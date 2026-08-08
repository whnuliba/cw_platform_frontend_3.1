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

                { field: 'TEXT6', title: '电压判定名称(cj)', en_title: 'Voltage Judgment Name', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'startVoltLow', title: '初始电压下限(mV)', en_title: 'Initial Voltage Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'startVoltUp', title: '初始电压上限(mV)', en_title: 'Initial Voltage Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'isEnable', title: '是否开启初始电压', en_title: 'Is Enable Initial Voltage', boxWidth: '150px', align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'endVoltLow', title: '结束电压下限(mV)', en_title: 'End Voltage Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'endVoltUp', title: '结束电压上限(mV)', en_title: 'End Voltage Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'isEndEnable', title: '是否开启结束电压', en_title: 'Is Enable End Voltage', boxWidth: '150px', align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },
            ],
        }
    ]
}