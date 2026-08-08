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

                //dcj
                { field: 'TEXT7', title: '放电容量判定名称(dcj)', en_title: 'Discharge Capacity Judgment Name', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'firstDischargeCapacityLow', title: '第一步放电容量下限(mah)', en_title: 'Step 1 Discharge Capacity Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'firstDischargeCapacityUp', title: '第一步放电容量上限(mah)', en_title: 'Step 1 Discharge Capacity Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'secondDischargeCapacityLow', title: '第二步放电容量下限(mah)', en_title: 'Step 2 Discharge Capacity Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'secondDischargeCapacityUp', title: '第二步放电容量上限(mah)', en_title: 'Step 2 Discharge Capacity Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },

            ],
        }
    ]
}