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
            labelWidth: '230px',
            cancelBtnShow: true,
            forms: [
                { field: 'pdOverVoltage', title: '充电电压上限(mV)', en_title: 'Charge Voltage Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'pdChargeOverCurrent', title: '充电电流上限(mV)', en_title: 'Charge Current Upper', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdChargeCapacity', title: '充电容量上限(mAh)', en_title: 'Charge Capacity Upper', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdDeltaI', title: 'DeltaI 监测(mA)', en_title: 'DeltaI', boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdLackVoltage', title: '放电电压下限(mV)', en_title: 'Discharge Voltage Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdDischargeOverCurrent', title: '放电电流上限(mA)', en_title: 'Discharge Current Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdDischargeCapacity', title: '放电容量上限(mAh)', en_title: 'Discharge Capacity Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'pdDelay', title: '延时保护(S)', en_title: 'Delay Protection', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'DcirLowLimit', title: 'DCIR下限(mΩ)', en_title: 'DCIR Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'DcirHighLimit', title: 'DCIR上限(mΩ)', en_title: 'DCIR Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'StepNo_First', title: 'V1工步号', en_title: 'V1 Step', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'FirstPointTime', title: 'T1时间', en_title: 'T1 Time', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'StepNo_Second', title: 'V2工步号', en_title: 'V2 Step', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'SecondPointTime', title: 'V2时间', en_title: 'V2 Time', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
            ],

        }
    ]
}