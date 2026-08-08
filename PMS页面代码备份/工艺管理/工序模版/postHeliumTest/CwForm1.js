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
                { field: 'leakageLower', title: '泄漏率下限', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'leakageUpper', title: '泄漏率上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
            ],

        }
    ]
}