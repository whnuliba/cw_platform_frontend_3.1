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
                { field: 'TEXT7', title: '曲线采样时间设置', en_title: 'Curve Sampling Time Setting', boxWidth: '400px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'collectTime', title: '曲线采样时间(s)', en_title: 'Curve Sampling Time', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },

            ],
        }
    ]
}