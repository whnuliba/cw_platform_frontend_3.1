{
    lazy: false,
    formStyle: { },
    formModes: [
        {
            size: 'mini',
            loading: false,
            display: 'inline',
            title: '保护参数',
            dialogVisible: 'test',
            dialogShow: true,
            labelWidth: '170px',
            cancelBtnShow: true,
            forms: [
                { field: 'chargeVoltageOverLimit', title: '充电电压上限（mV）', en_title: 'Charge voltage overlimit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'chargeCurrentOverLimit', title: '充电电流上限（mA）', en_title: 'Charge current overlimit', boxWidth: '150px', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'dischargeCapacityOverLimit', title: '放电容量上限（mAh）', en_title: 'Discharge capacity overlimit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'chargeCapacityOverLimit', title: '充电容量上限（mAh）', en_title: 'Charge capacity overlimit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'DeltaI', title: 'DeltaI监测（mA）', en_title: 'DeltaI', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
				{ field: 'dischargeLowVoltageLimit', title: '放电电压下限（mV）', en_title: 'Discharge Low voltage limit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
              	{ field: 'dischargeCurrentOverLimit', title: '放电电流上限（mA）', en_title: 'Discharge current overlimit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
              	{ field: 'tempTimeInterval', title: '温度保存间隔（s）', en_title: 'Temperature saving interval', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
            ],
        }
    ]
}