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
                { field: 'TEXT8', title: '容量补偿设置', en_title: 'Capacity Compensation Setting', boxWidth: '150px', align: "center", queryType: 'text', set: true, require: false, query: false, hide: false },
                { field: 'capacityCompensation', title: '补偿值', en_title: 'Capacity Compensation Value', boxWidth: '640px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'K1', title: 'K1', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'K2', title: 'K2', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'K3', title: 'K3', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'K4', title: 'K4', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'B', title: 'B', en_title: '', boxWidth: '150px', align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },

            ],
        }
    ]
}