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
            labelWidth: '100px',
            cancelBtnShow: true,
            // forms:[

            // ],
            forms: [
                {
                    field: 'Enable', title: '  ', en_title: '  ', minWidth: 100, boxWidth: "150px", align: 'center', queryType: 'checkbox', set: true, require: false, query: false, hide: false,
                    Enable: [
                        { field: 'dcrEnable', label: this.commonI18n("common.ProcessTemplate.dcrEnable") },
                        { field: 'sigmaDcrEnable', label: this.commonI18n("common.ProcessTemplate.sigmaDcrEnable") },
                        { field: 'sigmaEnable', label: this.commonI18n("common.ProcessTemplate.sigmaEnable") },
                    ]
                },
                {
                    field: 'state', title: '取值范围', en_title: 'Value Range', minWidth: 220, boxWidth: "300px", align: 'center', queryType: 'radio', set: true, require: false, query: false, hide: false,
                    state: [
                        { label: this.commonI18n("common.ProcessTemplate.vRange"), value: '0' },
                        { label: this.commonI18n("common.ProcessTemplate.aRange"), value: '1' }
                    ]
                },



            ],
        }
    ]
}