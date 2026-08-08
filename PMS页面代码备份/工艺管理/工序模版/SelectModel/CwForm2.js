{
    lazy: false,
        formStyle: { },
    formModes: [
        {
            size: 'mini',
            loading: false,
            display: 'inline',
            title: '流程参数',
            dialogVisible: 'test0',
            dialogShow: true,
            labelWidth: '170px',
            cancelBtnShow: true,
            itemFormStyle: {
                paddingTop: '20px',
                borderTop: '1px solid black'
            },
            forms: [
                { field: 'gradeMark', title: '等级标识', minWidth: 100, align: "center", queryType: 'select', set: true, require: false, query: false, hide: false },
                { field: 'name', title: '等级名称', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'irLow', title: '内阻下限(mΩ)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'irEnable', inuptType: 'number' },
                { field: 'irUp', title: '内阻上限(mΩ)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'irEnable', inuptType: 'number' },
                { field: 'voltageLow', title: '电压下限(mV)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'voltageEnable', inuptType: 'number' },
                { field: 'voltageUp', title: '电压上限(mV)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'voltageEnable', inuptType: 'number' },
                { field: 'thickLow', title: '厚度下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'thickEnable', inuptType: 'number' },
                { field: 'thickUp', title: '厚度上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'thickEnable', inuptType: 'number' },
                { field: 'kLow', title: 'K值下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'kEnable', inuptType: 'number' },
                { field: 'kUp', title: 'K值上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'kEnable', inuptType: 'number' },
                { field: 'capacityLow', title: '容量下限(mAH)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'capacityEnable', inuptType: 'number' },
                { field: 'capacityUp', title: '容量上限(mAH)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'capacityEnable', inuptType: 'number' },
                { field: 'dcirLow', title: 'DCIR下限(mΩ)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'dcirEnable', inuptType: 'number' },
                { field: 'dcirUp', title: 'DCIR上限(mΩ)', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false, fieldDisabled: 'dcirEnable', inuptType: 'number' },
            ],

        }
    ]
}