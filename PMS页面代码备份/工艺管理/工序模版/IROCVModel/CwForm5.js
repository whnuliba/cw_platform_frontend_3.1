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
                { field: 'sigmaOcvLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'sigmaOcvUpper', title: 'Sigma_IROCV1(mV)', en_title: 'Sigma_IROCV1(mV)', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'sigmaIrLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'sigmaIrUpper', title: 'Sigma_IR1(mΩ)', en_title: 'Sigma IR1(mΩ)', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'sigmaKLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'sigmaKUpper', title: 'Sigma_K', en_title: 'Sigma K', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

                { field: 'sigmaDcrLower', title: ' ', en_title: '  ', minWidth: 120, boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled: false },
                { field: 'sigmaDcrUpper', title: 'Sigma_DCR(mΩ)', en_title: 'Sigma DCR(mΩ)', minWidth: 100, boxWidth: '150px', align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, disabled: false },

            ],
        }
    ]
}