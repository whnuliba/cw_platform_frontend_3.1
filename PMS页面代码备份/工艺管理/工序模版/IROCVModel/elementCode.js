{

    created(){
        // console.log("tt1", this.vueContext)
    },
    mounted(){
        this.$nextTick(() => {
            // this.addEventListener('CwSelect1', 'onChange', this.deSelect)
            // this.addEventListener('CwSelect2', 'onChange', this.accSelect)
            // this.addEventListener('CwForm4', 'change', this.accCheck)
        })

    },
    watch: {

    },
    init(panel, context){
        let _this = this
        
        // 初始化
        _this.$nextTick(() => {
            // select
            context['CwSelect1'].options = [
                { label: this.commonI18n('GRADE_G'), value: 'G' },
                { label: this.commonI18n('GRADE_H'), value: 'H' },
                { label: this.commonI18n('GRADE_I'), value: 'I' },
            ]
            context['CwSelect2'].options = [
                { label: this.commonI18n('GRADE_A'), value: 'A' },
                { label: this.commonI18n('GRADE_B'), value: 'B' },
                { label: this.commonI18n('GRADE_C'), value: 'C' },
                { label: this.commonI18n('GRADE_D'), value: 'D' },
                { label: this.commonI18n('GRADE_E'), value: 'E' },
                { label: this.commonI18n('GRADE_F'), value: 'F' },
            ]
            context['CwSelect1'].value = 'G'
            context['CwSelect2'].value = 'A'
            // form
            //console.log("context['CwForm2'].dataObtainedByEditor", context['CwForm2'].dataObtainedByEditor, "recipe" in context['CwForm2'].dataObtainedByEditor)
            if ('recipe' in context['CwForm2'].dataObtainedByEditor) {
                context['CwForm1'].iform.test.params.irTest = context['CwForm1'].iform.test.params.irTest ? true : false;
                context['CwForm1'].iform.test.params.ocvTest = context['CwForm1'].iform.test.params.ocvTest ? true : false;
                context['CwForm2'].iform.test.params = context['CwForm2'].dataObtainedByEditor.recipe['G'.charCodeAt(0) - 65] ? context['CwForm2'].dataObtainedByEditor.recipe['G'.charCodeAt(0) - 65] : {}
                context['CwForm3'].iform.test.params = context['CwForm3'].dataObtainedByEditor.recipe['A'.charCodeAt(0) - 65] ? context['CwForm3'].dataObtainedByEditor.recipe['A'.charCodeAt(0) - 65] : {}
                context['CwForm5'].iform.test.params = context['CwForm5'].dataObtainedByEditor.recipe['A'.charCodeAt(0) - 65] ? context['CwForm5'].dataObtainedByEditor.recipe['A'.charCodeAt(0) - 65] : {}
            } else {
                /*初始化*/
                let processData = {
                    state: 0,
                    dcrEnable: false,
                    sigmaEnable: false,
                    sigmaDcrEnable: false,
                    pp: {
                        VoltageLowerLmt: 0,
                        VoltageUpperLmt: 4200,
                        IRLowerLmt: 0,
                        IRUpperLmt: 20,
                        NGRetestNum: 0,
                        NGRetestCount: 0,
                        NGOutboundLimit: 0,
                        kLow: 0,
                        kUp: 10,
                        ocvTest: 0,
                        irTest: 0,
                        acceptOcvLower: 0,
                        acceptOcvUpper: 0,
                        acceptAcrLower: 0,
                        acceptAcrUpper: 0,
                        testTrayNgLimit: 0,
                        channelNgLimit: 0,
                    },
                    
                    recipe: [
                        {
                            key: 'A',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'B',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'C',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'D',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'E',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'F',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'G',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'H',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        }, {
                            key: 'I',
                            ocvLower: 0,
                            ocvUpper: 0,
                            irLower: 0,
                            irUpper: 0,
                            capLower: 0,
                            capUpper: 0,
                            kLower: 0,
                            kUpper: 0,
                            dcrLower: 0,
                            dcrUpper: 0,
                            sigmaOcvLower: 0,
                            sigmaOcvUpper: 0,
                            sigmaIrLower: 0,
                            sigmaIrUpper: 0,
                            sigmaKLower: 0,
                            sigmaKUpper: 0,
                            sigmaDcrLower: 0,
                            sigmaDcrUpper: 0,
                        },
                    ],
                }
                context['CwForm1'].iform.test.params = processData.pp ? processData.pp : {};
                context['CwForm1'].iform.test.params.irTest = context['CwForm1'].iform.test.params.irTest ? true : false;
                context['CwForm1'].iform.test.params.ocvTest = context['CwForm1'].iform.test.params.ocvTest ? true : false;
                context['CwForm2'].iform.test.params = processData.recipe['G'.charCodeAt(0) - 65] ? processData.recipe['G'.charCodeAt(0) - 65] : {}
                context['CwForm2'].dataObtainedByEditor = processData
                context['CwForm3'].iform.test.params = processData.recipe['A'.charCodeAt(0) - 65] ? processData.recipe['A'.charCodeAt(0) - 65] : {}
                context['CwForm3'].dataObtainedByEditor = processData
                context['CwForm5'].iform.test.params = processData.recipe['A'.charCodeAt(0) - 65] ? processData.recipe['A'.charCodeAt(0) - 65] : {}     
                context['CwForm5'].dataObtainedByEditor = processData
            }
            panel.addEventListener('CwSelect1', 'onChange', (event) => {
                _this.deSelect(context);
            })
            panel.addEventListener('CwSelect2', 'onChange', (event) => {
                _this.accSelect(context);
            })
            panel.addEventListener('CwForm4', 'change', (event) => {
                _this.accCheck(context, event);
            });

        })

    },
    initCheckbox(context) {
        // checkbox
        let form4Value = context['CwForm4'].iform.test.params
        if (form4Value.dcrEnable == true) {
            context['CwForm3'].formItem.test['dcrLower'].disabled = false
            context['CwForm3'].formItem.test['dcrUpper'].disabled = false
        } else {
            context['CwForm3'].formItem.test['dcrLower'].disabled = true
            context['CwForm3'].formItem.test['dcrUpper'].disabled = true
        }
        if (form4Value.sigmaDcrEnable == true) {
            context['CwForm5'].formItem.test['sigmaDcrLower'].disabled = false
            context['CwForm5'].formItem.test['sigmaDcrUpper'].disabled = false
        } else {
            context['CwForm5'].formItem.test['sigmaDcrLower'].disabled = true
            context['CwForm5'].formItem.test['sigmaDcrUpper'].disabled = true
        }
        if (form4Value.sigmaEnable == true) {
            Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                context['CwForm5'].formItem.test[key].disabled = false
            })
        } else {
            Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                context['CwForm5'].formItem.test[key].disabled = true
            })
        }
    },
    deSelect(context){
        if (context["CwSelect1"].value == 'G') {
            context['CwForm2'].formItem.test['capLower'].set = true
            context['CwForm2'].formItem.test['capUpper'].set = true
            context['CwForm2'].formItem.test['irLower'].set = false
            context['CwForm2'].formItem.test['irUpper'].set = false
            context['CwForm2'].formItem.test['kLower'].set = false
            context['CwForm2'].formItem.test['kUpper'].set = false
        } else if (context["CwSelect1"].value == 'H') {
            context['CwForm2'].formItem.test['capLower'].set = false
            context['CwForm2'].formItem.test['capUpper'].set = false
            context['CwForm2'].formItem.test['irLower'].set = true
            context['CwForm2'].formItem.test['irUpper'].set = true
            context['CwForm2'].formItem.test['kLower'].set = false
            context['CwForm2'].formItem.test['kUpper'].set = false
        } else if (context["CwSelect1"].value == 'I') {
            context['CwForm2'].formItem.test['capLower'].set = false
            context['CwForm2'].formItem.test['capUpper'].set = false
            context['CwForm2'].formItem.test['irLower'].set = false
            context['CwForm2'].formItem.test['irUpper'].set = false
            context['CwForm2'].formItem.test['kLower'].set = true
            context['CwForm2'].formItem.test['kUpper'].set = true
        }
        let charAt = context["CwSelect1"].value.charCodeAt(0)
        context['CwForm2'].iform.test.params = context['CwForm2'].dataObtainedByEditor.recipe[charAt - 65] ? context['CwForm2'].dataObtainedByEditor.recipe[charAt - 65] : {}
    },
    accSelect(context){
        let selectValue = context["CwSelect2"].value
        if (selectValue == 'A' || selectValue == 'B' || selectValue == 'C') {
            Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                context['CwForm5'].formItem.test[key].set = true
            })
        } else if (selectValue == 'D' || selectValue == 'E' || selectValue == 'F') {
            Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                context['CwForm5'].formItem.test[key].set = false
            })
        }
        let charAt = context["CwSelect2"].value.charCodeAt(0)
        context['CwForm3'].iform.test.params = context['CwForm3'].dataObtainedByEditor.recipe[charAt - 65] ? context['CwForm3'].dataObtainedByEditor.recipe[charAt - 65] : {}
        context['CwForm5'].iform.test.params = context['CwForm5'].dataObtainedByEditor.recipe[charAt - 65] ? context['CwForm5'].dataObtainedByEditor.recipe[charAt - 65] : {}
    },
    accCheck(context, event) {
        if (event.target.type === 'checkbox') {
            //console.log('Checkbox 变化:', event.target.name, event.target.checked);
            if (event.target.name == 'dcrEnable') {
                if (event.target.checked == true) {
                    context['CwForm3'].formItem.test['dcrLower'].disabled = false
                    context['CwForm3'].formItem.test['dcrUpper'].disabled = false
                } else {
                    context['CwForm3'].formItem.test['dcrLower'].disabled = true
                    context['CwForm3'].formItem.test['dcrUpper'].disabled = true
                }
            } else if (event.target.name == 'sigmaDcrEnable' && context['CwForm4'].iform.test.params.sigmaEnable == true) {
                if (event.target.checked == true) {
                    context['CwForm5'].formItem.test['sigmaDcrLower'].disabled = false
                    context['CwForm5'].formItem.test['sigmaDcrUpper'].disabled = false
                } else {
                    context['CwForm5'].formItem.test['sigmaDcrLower'].disabled = true
                    context['CwForm5'].formItem.test['sigmaDcrUpper'].disabled = true
                }
            } else if (event.target.name == 'sigmaEnable') {
                if (event.target.checked == true) {
                    Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                        context['CwForm5'].formItem.test[key].disabled = false
                    })
                } else {
                    Object.keys(context['CwForm5'].formItem.test).forEach(key => {
                        context['CwForm5'].formItem.test[key].disabled = true
                    })
                }

            }
        }
    }

}