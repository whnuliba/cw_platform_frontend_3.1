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

                //pp
                { field: 'TEXT9', title: 'DCR参数设定', en_title: 'DCR Parameter Setting', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                {
                    field: 'TEXT10', title: '参数设定： V0=0E,V1=0,I=0', en_title: 'Parameter Setting： V0=0E,V1=0,I=0', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false,
                    style: { color: 'black' }
                },
                { field: 'V0', title: 'V0 = 第', en_title: 'V0 = No.', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'TEXT11', title: '步', en_title: 'Step', boxWidth: '120px', align: 'center', queryType: 'textNowrap', set: true, require: false, query: false, hide: false },
                {
                    field: 'VoltageType', title: '', en_title: 'Voltage Type', boxWidth: '150px', align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false,
                    VoltageType: [
                        { label: this.commonI18n('const.processTemplate.endVoltage'), value: 0 }, { label: this.commonI18n('const.processTemplate.initialVoltage'), value: 1 }
                    ]
                },
                { field: 'V1', title: 'V1 = 第', en_title: 'V1 = No.', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'TEXT12', title: '步  结束电压', en_title: 'Step End Voltage', boxWidth: '120px', align: 'center', queryType: 'textNowrap', set: true, require: false, query: false, hide: false },

                { field: 'I', title: 'I = 第', en_title: 'I = No.', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'TEXT13', title: '步  平均电流', en_title: 'Step Average Current', boxWidth: '120px', align: 'center', queryType: 'textNowrap', set: true, require: false, query: false, hide: false },


                { field: 'TEXT14', title: 'DCR补偿设置', en_title: 'DCR Compensation Setting', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'DCRCapacityCompensation', title: '补偿值', en_title: 'DCR Compensation', boxWidth: '640px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'H1', title: 'H1', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'H2', title: 'H2', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'H3', title: 'H3', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'H4', title: 'H4', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'C', title: 'C', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
            ],
        }
    ]
}