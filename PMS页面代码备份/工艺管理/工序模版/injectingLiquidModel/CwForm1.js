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
                { field: 'weightBeforeLiquidInjectionLower', title: '注液前重量下限', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
                { field: 'weightBeforeLiquidInjectionUpper', title: '注液前重量上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weightAfterLiquidInjectionLower', title: '注液后重量下限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'weightAfterLiquidInjectionUpper', title: '注液后重量上限', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'LiquidInjectionLower', title: '注液量下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'LiquidInjectionUpper', title: '注液量上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVd1Lower', title: '绝缘测试vd1下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVd1Upper', title: '绝缘测试vd1上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVd2Lower', title: '绝缘测试vd2下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVd2Upper', title: '绝缘测试vd2上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVoltageLower', title: '绝缘测试电压下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'insulationTestVoltageUpper', title: '绝缘测试电压上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'inventoryLower', title: '保有量下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'inventoryUpper', title: '保有量上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'vacuumBeforeHeliumReturnLower', title: '回氦前真空下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'vacuumBeforeHeliumReturnUpper', title: '回氦前真空上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'VacuumAfterHeliumReturnLower', title: '回氦后真空下限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
                { field: 'VacuumAfterHeliumReturnUpper', title: '回氦后真空上限', minWidth: 100, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false },
            ],

        }
    ]
}