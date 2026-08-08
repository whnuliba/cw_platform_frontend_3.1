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
            // forms:[

            // ],
            forms: [
                { field: 'TEXT1', title: '[公式]补偿容量 = 总容量 / a', en_title: '[Formula]Compensation capacity = Total capacity / a', boxWidth: '300px', minWidth: 100, align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'capacityCompensationStepNo', title: '容量补偿工步号', en_title: 'Capacity compensation StepNo', boxWidth: '150px', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'compensationCapacityLowerLimit', title: '补偿容量下限', en_title: 'Compensation capacity lower limit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'capacityCompensationCoefficientA', title: '容量补偿系数A', en_title: 'Capacity compensation coefficient A', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'compensationCapacityUpperLimit', title: '补偿容量上限', en_title: 'Compensation capacity upper limit', boxWidth: '150px', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },

            ],
        }
    ]
}