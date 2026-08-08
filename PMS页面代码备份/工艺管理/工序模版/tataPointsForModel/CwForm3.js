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
            labelWidth: '200px',
            cancelBtnShow: true,
            // forms:[],
            forms: [
                //{ field: 'TEXT1', title: '[公式]补偿容量 = 总容量 / a', minWidth: 100, align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },      
                { field: 'energyStepNo', title: '能量工步号', en_title: 'Energy StepNo', boxWidth: '150px', minWidth: 120, align: 'left', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'energyLowerLimit', title: '能量下限', en_title: 'Energy lower limit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'energyUpperLimit', title: '能量上限', en_title: 'Energy upper limit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },

            ],
        }
    ]
}