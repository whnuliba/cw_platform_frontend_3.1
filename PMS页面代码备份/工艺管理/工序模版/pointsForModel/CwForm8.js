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

                //pp
                { field: 'TEXT15', title: '步次设置 | 分容筛选条件', en_title: 'Step Setting | Grading and Screening Criteria', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'setStep', title: '步次', en_title: 'Step', boxWidth: '640px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },

                { field: 'capacityDivision1Low', title: '分容容量1下限', en_title: 'Grading Capacity 1 Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'capacityDivision1Up', title: '分容容量1上限', en_title: 'Grading Capacity 1 Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'isCapacityDivision1Enable', title: '是否开启分容容量1', en_title: 'Enable Grading Capacity 1', boxWidth: '150px', align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'capacityDivision2Low', title: '分容容量2下限', en_title: 'Grading Capacity 2 Lower', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'capacityDivision2Up', title: '分容容量2上限', en_title: 'Grading Capacity 1 Upper', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'isCapacityDivision2Enable', title: '是否开启分容容量2', en_title: 'Enable Grading Capacity 2', boxWidth: '150px', align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: false },
            ],
        }
    ]
}