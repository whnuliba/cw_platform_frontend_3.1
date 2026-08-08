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
            forms: [
                { field: 'irEnable', title: '内阻', minWidth: 400, align: 'center', queryType: 'switch', set: true, require: false, query: false, hide: true },
                { field: 'voltageEnable', title: '电压', minWidth: 50, align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'thickEnable', title: '厚度', minWidth: 50, align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'kEnable', title: 'K值', minWidth: 50, align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'capacityEnable', title: '容量', minWidth: 50, align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'dcirEnable', title: 'DCIR', minWidth: 50, align: "center", queryType: 'switch', set: true, require: false, query: false, hide: false },
                { field: 'defaultGradeMark', title: '默认等级', minWidth: 100, align: "center", queryType: 'select', set: true, require: false, query: false, hide: false },

            ],

        }
    ]
}