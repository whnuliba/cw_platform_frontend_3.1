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
                { field: 'ocvLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'ocvUpper', title: '<= IROCV1(mV) <=', en_title: '<= IROCV1(mV) <=', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'irLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'irUpper', title: '<= IR1(mΩ) <=', en_title: '<= IR1(mΩ) <=', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'capLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'capUpper', title: '<= CAP(mAh) <', en_title: '<= CAP(mAh) <', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'kLower', title: ' ', en_title: '   ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'kUpper', title: '<= K <=', en_title: '<= K <=', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'dcrLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'dcrUpper', title: '<= DCR(mΩ) <=', en_title: '<= DCR(mΩ) <=', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },
            ],
        }
    ]
}