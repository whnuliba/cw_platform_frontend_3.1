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
            // forms:[

            // ],
            forms: [
                { field: 'capLower', title: ' CAP(mAh) <', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, },
                { field: 'capUpper', title: ' CAP(mAh) >', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, },
                { field: 'irLower', title: 'IR1(mΩ)<', minWidth: 120, align: 'center', queryType: 'input', set: false, require: false, query: false, },
                { field: 'irUpper', title: 'IR1(mΩ)>  ', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, },
                { field: 'kLower', title: 'k<', minWidth: 120, align: 'center', queryType: 'input', set: false, require: false, query: false, },
                { field: 'kUpper', title: 'k>  ', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, },
            ],
        }
    ]
}