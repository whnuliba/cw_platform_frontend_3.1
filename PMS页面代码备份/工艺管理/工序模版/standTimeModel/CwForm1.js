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
                { field: 'stl', title: '静置时间下限(H)', en_title: 'Standing Time Lower', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'stu', title: '静置时间上限(H)', en_title: 'Standing Time Upper', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
            ],

        }
    ]
}