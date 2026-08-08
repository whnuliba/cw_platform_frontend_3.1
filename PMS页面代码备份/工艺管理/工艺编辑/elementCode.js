{
    created(){
        let _this = this;
        _this.vueContext['CwDialogPanel2'].dialogVisible = false
        _this.vueContext['CwProcessFlowChart1'].initProcessAddSelect("/process/getall", {});
    },
    mounted(){
        let _this = this;
        _this.addEventListener('CwTree1', 'node-click', this.treeSingelClicktest)
        this.addEventListener('CwButton3', 'click', this.addNow)
        this.addEventListener('CwButton4', 'click', this.addNowInFlowChart)
        this.addEventListener('CwButton2', 'click', this.flowEdit)
        this.addEventListener('CwButton1', 'click', this.submitApproval)
        _this.vueContext['CwButton3'].component.styles.display = 'none'
        _this.vueContext['CwButton4'].component.styles.display = 'none'
        this.addEventListener('CwProcessFlowChart1', 'chart-save', this.chartSave)
        this.addEventListener('CwProcessFlowChart1', 'params-temp', this.paramsTemp)
        this.addEventListener('CwProcessFlowChart1', 'flow-modify-select', this.flowModifySelect)
        this.addEventListener('CwProcessFlowChart1', 'move-on-finish', this.moveOnFinishSaveChart)
        this.addEventListener('CwProcessFlowChart1', 'approval-submit', this.approvalSubmit)
        this.addEventListener('CwProcessFlowChart1', 'node-dele', this.nodeDele)
        this.getSelect1Options()
        // _this.$nextTick(() => {
        //     _this.vueContext['CwForm1'].initSelect = _this.vueContext['CwCtrlList1'].$children[0].initSelect
        // });
    },
    // 点击树结构显示配方详情
    treeSingelClicktest(r){
        let _this = this
        let templateStr = r.detail[0].template
        if (r.detail[1].level == 2) {
            _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => { })
            _this.vueContext['CwButton3'].component.styles.display = 'block'
            if (templateStr == '') {
                _this.vueContext['CwUCPanel1'].setUcCode('testPage', () => { })
                // this.$message({
                //   message: this.$t("common.processFlowTmpList.noNeedParam"),
                //   type: "warning",
                // });
                return false;
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/guest/get-dts", params: { data: r.detail[0].id } };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                let allModelData = {}

                _this.vueContext['CwTree1'].dataObtainedByEditor['treeselectNode'] = r.detail[1]
                _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData'] = {
                    flowDtId: r.detail[0].id,
                    processId: r.detail[0].processId
                }

                if (data) {
                    allModelData = JSON.parse(data.processContent)
                    _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData'] = data
                }
                if (templateStr.slice(0, 3) === 'OCV' || templateStr == 'standTimeModel') {
                    _this.$nextTick(() => {
                        _this.initProcessAddSelect("uc_CwUCPanel1")
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        // _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};

                    });

                } else if (templateStr == 'pointsForModel' || templateStr == 'chargeModel') {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.cj ? allModelData.cj : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
                        _this.setTableColumn(allModelData.sp ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }],
                            "uc_CwUCPanel1")
                    });


                } else if (templateStr == 'DCIRModel') {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.setDCIRTableColumn(allModelData.sp ? allModelData.sp : [])
                    });
                }
                else if (templateStr == 'envelope' || templateStr == 'injectingLiquidModel' || templateStr == 'postHeliumTest') {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
                    });
                } else if (templateStr == 'SelectModel') {
                    _this.$nextTick(() => {
                        _this.vueContext.CwUCPanel1.addEventListener('CwForm1', 'switch-change', (r) => {
                            let formModes = [..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes]
                            formModes.forEach(itemForms => {
                                itemForms.forms.forEach(itemcol => {
                                    itemcol.disabled = _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                                })
                            })
                            _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'], 'formModes', [...formModes])
                        })
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData ? allModelData : {};

                        let obj = { ..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[0] }
                        let dialogVisible = obj.dialogVisible
                        for (let i = 0; i < allModelData.pp.length; i++) {
                            if (_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[i]) {
                                _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test' + i].params = allModelData.pp[i]
                            } else {
                                obj.dialogVisible = 'test' + i
                                _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test' + i] = { params: {} }
                                _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes, _this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.length, obj)
                                obj.forms.forEach(fo => {
                                    _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test' + i]['params'][fo.field] = allModelData.pp[i][fo.field]
                                })
                            }
                            _this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.forEach(itemForms => {
                                itemForms.forms.forEach(itemcol => {
                                    itemcol['disabled'] = allModelData[itemcol.fieldDisabled] == 0 ? true : false
                                })
                            })
                        }
                        const _data = { url: "/cw-fms-fms/process/guest/geGrade", params: {} };
                        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                            if (data.length > 0) {
                                let optionData = []
                                data.forEach((val, idx) => {
                                    optionData[idx] = { label: val, value: val }
                                })
                                //_this.vueContext.uc_CwUCPanel1['CwForm1']
                                _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                                _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].initSelect, 'gradeMark', optionData)

                            }

                        });
                    });

                } else if (templateStr == 'tataChargeModel') {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        let spData = allModelData.sp;
                        console.log(allModelData, allModelData.sp, spData)
                        _this.setTataTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel1")
                    });


                } else if (templateStr == 'tataPointsForModel') {
                    console.log(templateStr, allModelData)
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        let spData = allModelData.sp;
                        _this.setTataPointsForTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel1")
                    });

                } else if (templateStr == 'dzChargeModel') {
                    console.log('ENTER-----------------------------------------', allModelData, _this.vueContext.uc_CwUCPanel1, _this.vueContext)
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        let spData = allModelData.sp.length;
                        console.log(allModelData, allModelData.sp, spData)
                        _this.setTataTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel1")
                    });

                } else if (templateStr == 'IROCVModel') {
                    _this.$nextTick(() => {
                        //allModelData.pp.irTest = allModelData.pp.irTest ? true : false;
                        //allModelData.pp.ocvTest = allModelData.pp.ocvTest ? true : false;
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm2'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm3'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm5'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.CwUCPanel1.init(_this.vueContext.CwUCPanel1, _this.vueContext.uc_CwUCPanel1)
                        _this.vueContext.CwUCPanel1.initCheckbox(_this.vueContext.uc_CwUCPanel1)
                    })
                } else if (templateStr == 'tataDCRModel') {
                    _this.$nextTick(() => {
                      	_this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        let spData = allModelData.sp ? allModelData.sp.length : false;
                        //console.log(allModelData, allModelData.sp, spData)
                        _this.setTataDCRTableColumn(spData ? allModelData.sp :
                            [{
                                "stepNo": 1, "controlType": "", "current": "", "exitVoltage": false, "exitCurrent": false, "exitCapacity": false,
                                "exitStepTime": false, "DeltaT": "", "DeltaV": "", "DeltaI": "",
                            }]
                            , "uc_CwUCPanel1")
                    })
                } else {
                    // _this.$nextTick(() => {
                    //   _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                    //   _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
                    // });

                }
            })

        }
    },

    // 审批弹窗按钮
    chartSave() {
        console.log('表格刷新')
        this.vueContext['CwCtrlList1'].loadDataQuery({ current: 1, pageSize: 15, requestData: {} }, (data) => {
            this.vueContext['CwCtrlList1'].data = data.data;
            this.vueContext['CwCtrlList1'].page.total = data.total;
            this.vueContext['CwCtrlList1'].dataLoading = false;
        })
    },
    // 修改按钮
    moveOnFinishSaveChart(e, newDataArr, nodeData) {
        if (nodeData.nodeDataArray.length) {
            let dataParam = {
                url: "/process-flow-tmp-dts/createOrUpdate",
                params: { data: newDataArr },
            };
            this.$store.dispatch("fmsCommon/actionFmsPost", dataParam).then((res) => {
                this.$message({
                    type: "success",
                    message: "保存成功",
                });
                // 保存流程图json
                this.vueContext['CwProcessFlowChart1'].chartJsonSave(nodeData, 0, "/process-flow-tmp/addflow");
            });
        } else {
            // 写在这做删除操作, 当节点都没有时,图的json数据可保存;
            this.vueContext['CwProcessFlowChart1'].chartJsonSave(nodeData, 0, "/process-flow-tmp/addflow");
        }

    },
    // 审批完成按钮
    approvalSubmit(e, param) {
        console.log('审批完成')
        let _data = { url: "/process-flow-tmp/process-flow-appr", params: param };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            this.$message({
                message: '审批完成!',
                type: "success",
            });
            this.vueContext['CwDialogPanel2'].dialogVisible = false;
        });
    },
    // 删除节点
    nodeDele(e, json, myDiagramEntity, nodeData) {
        let _data = { url: "/process-flow-tmp-dts/del", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            myDiagramEntity.commandHandler.deleteSelection();
            this.vueContext['CwProcessFlowChart1'].nextDelLinks = JSON.parse(
                myDiagramEntity.model.toJson()
            ).linkDataArray;

            if (nodeData.length >= 2 && this.vueContext['CwProcessFlowChart1'].linkNum === 2) {
                this.vueContext['CwProcessFlowChart1'].AfterDelToConnect(this.vueContext['CwProcessFlowChart1'].preDelLinks,
                    this.vueContext['CwProcessFlowChart1'].nextDelLinks);
            }
            this.vueContext['CwProcessFlowChart1'].moveOnFinish();
            this.$message({
                message: this.$t("common.btn.deleteSuccess"),
                type: "success",
            });
        }).catch(() => {
            this.$message({
                type: "warning",
                message: "请先保存后再进行操作",
            });
        });
    },
    flowModifySelect() {
        // 流程类型
        let flowTypeData = { url: "/sys-params/sys-p-code", params: { data: "PROCESS.FLOW" } };
        this.$store.dispatch("fmsCommon/actionAuthPost", flowTypeData).then((data) => {
            let sysCode = data.map((item) => {
                return {
                    label: item.paramKey,
                    value: item.paramValue,
                };
            });
            this.vueContext['CwProcessFlowChart1'].flowTypeOption = sysCode;
        });
        // 电芯类型
        let cellTypeData = { url: "/cell-type/guest/getall", params: {} };
        this.$store.dispatch("fmsCommon/actionFmsPost", cellTypeData).then((data) => {
            this.vueContext['CwProcessFlowChart1'].cellTypeOption = data;
        });
    },
    // 双击节点显示参数模版弹窗
    paramsTemp(e, node, row, paramTemplateEntity) {
        // paramTemplateEntity.dataUpdate(row, "/process-dts-tmp/guest/get-dts", 2);
        this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeMsg = node;
        this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.clickTbRowData = row;
        this.vueContext['CwDialogPanel3'].dialogVisible = true;
        let _this = this
        _this.vueContext['CwButton4'].component.styles.display = 'block'
        const _data = { url: "/cw-fms-fms/process-dts-tmp/guest/get-dts", params: { data: row.id } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            let allModelData = {}
            if (data) {
                allModelData = JSON.parse(data.processContent);
                this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeDtMsg = data;
            } else {
                this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeDtMsg = { id: null };
                //this.processContent = JSON.parse(JSON.stringify(this.processContentInit))
            }
            let templateStr = node.data.templateCode.value;
            if (templateStr.slice(0, 3) === 'OCV') {
                _this.vueContext['CwUCPanel2'].setUcCode('OCV1Model', () => {
                    _this.$nextTick(() => {
                        _this.initProcessAddSelect("uc_CwUCPanel2")
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};

                    });
                })

            }
            else if (templateStr == 'pointsForModel' || templateStr == 'chargeModel') {
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'pointsForModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params = allModelData.cj ? allModelData.cj : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
                        _this.setTableColumn(allModelData.sp ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }],
                            "uc_CwUCPanel2")
                    })
                })

            }
            else if (templateStr == 'DCIRModel') {
                _this.vueContext['CwUCPanel2'].setUcCode('DCIRModel', () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.setDCIRTableColumn(allModelData.sp ? allModelData.sp : [])

                    });
                })

            }
            else if (templateStr == 'envelope' || templateStr == 'injectingLiquidModel' || templateStr == 'postHeliumTest') {
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
                    });
                })

            } else if (templateStr == 'standTimeModel') {
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.CwUCPanel2.addEventListener('CwForm1', 'switch-change', (node) => {
                            let formModes = [..._this.vueContext.uc_CwUCPanel2['CwForm2'].formModes]
                            formModes.forEach(itemForms => {
                                itemForms.forms.forEach(itemcol => {
                                    itemcol.disabled = _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                                })
                            })
                            _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'], 'formModes', [...formModes])
                        })
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};


                    });
                })

            } else if (templateStr == 'SelectModel') {
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.CwUCPanel2.addEventListener('CwForm1', 'switch-change', (node) => {
                            let formModes = [..._this.vueContext.uc_CwUCPanel2['CwForm2'].formModes]
                            formModes.forEach(itemForms => {
                                itemForms.forms.forEach(itemcol => {
                                    itemcol.disabled = _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                                })
                            })
                            _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'], 'formModes', [...formModes])
                        })
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData ? allModelData : {};

                        let obj = { ..._this.vueContext.uc_CwUCPanel2['CwForm2'].formModes[0] }
                        let dialogVisible = obj.dialogVisible
                        for (let i = 0; i < allModelData.pp.length; i++) {
                            if (_this.vueContext.uc_CwUCPanel2['CwForm2'].formModes[i]) {
                                _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test' + i].params = allModelData.pp[i]
                            } else {
                                obj.dialogVisible = 'test' + i
                                _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test' + i] = { params: {} }
                                _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'].formModes, _this.vueContext.uc_CwUCPanel2['CwForm2'].formModes.length, obj)
                                obj.forms.forEach(fo => {
                                    _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test' + i]['params'][fo.field] = allModelData.pp[i][fo.field]
                                })
                            }
                            _this.vueContext.uc_CwUCPanel2['CwForm2'].formModes.forEach(itemForms => {
                                itemForms.forms.forEach(itemcol => {
                                    itemcol['disabled'] = allModelData[itemcol.fieldDisabled] == 0 ? true : false
                                })
                            })
                        }
                        const _data = { url: "/cw-fms-fms/process/guest/geGrade", params: {} };
                        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                            if (data.length > 0) {
                                let optionData = []
                                data.forEach((val, idx) => {
                                    optionData[idx] = { label: val, value: val }
                                })
                                _this.vueContext.uc_CwUCPanel2['CwForm1']
                                _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                                _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'].initSelect, 'gradeMark', optionData)

                            }

                        });
                    });
                })
            } else if (templateStr == 'dzChargeModel') {
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'dzChargeModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        let spData = allModelData.sp.length;
                        console.log(allModelData.sp, spData)
                        _this.setTataTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel2")
                    })
                })

            } else if (templateStr == 'tataChargeModel') {
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'tataChargeModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        let spData = allModelData.sp;
                        console.log(allModelData.sp, spData)
                        _this.setTataTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel2")
                    })
                })

            } else if (templateStr == 'tataPointsForModel') {
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'tataChargeModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params = allModelData.cc ? allModelData.cc : {};
                        let spData = allModelData.sp;
                        _this.setTataPointsForTableColumn(spData ? allModelData.sp :
                            [{ "stepCurrent": 0, "stepEndCurrent": 0, "stepEndCap": 0, "stepNo": 1, "stepState": "", "stepTime": 0, "stepVoltage": 0, "show3": false, "show4": false, "show5": false, "show6": false }]
                            , "uc_CwUCPanel2")
                    })
                })

            } else if (templateStr == 'IROCVModel') {
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'IROCVModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        //allModelData.pp.irTest = allModelData.pp.irTest  ? true : false;
                        //allModelData.pp.ocvTest = allModelData.pp.ocvTest  ? true : false;

                        _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm2'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm3'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params = allModelData ? allModelData : {};
                        _this.vueContext.uc_CwUCPanel2['CwForm5'].dataObtainedByEditor = allModelData ? allModelData : {};
                        _this.vueContext.CwUCPanel2.init(_this.vueContext.CwUCPanel2, _this.vueContext.uc_CwUCPanel2)
                        _this.vueContext.CwUCPanel2.initCheckbox(_this.vueContext.uc_CwUCPanel2)
                    })
                })
            } else if (templateStr == 'tataDCRModel') {
              
                _this.vueContext['CwUCPanel2'].component.attribute['ucCode'] = 'tataDCRModel'
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                      	_this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        let spData = allModelData.sp ? allModelData.sp.length : false;
                        //console.log(allModelData, allModelData.sp, spData)
                        _this.setTataDCRTableColumn(spData ? allModelData.sp :
                            [{
                                "stepNo": 1, "controlType": "", "current": "", "exitVoltage": false, "exitCurrent": false, "exitCapacity": false,
                                "exitStepTime": false, "DeltaT": "", "DeltaV": "", "DeltaI": "",
                            }]
                            , "uc_CwUCPanel2")
                    })
                })
            } else {
                _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                        _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
                    });

                })
            }

        });

    },

    flowEdit(){
        let _this = this;
        let params = { ..._this.vueContext['CwForm1'].iform.processeditor.params }
        let json = {
            data: {
                flowCode: params.flowCode,
                flowName: params.flowName,
                id: params.id,
                useState: params.useState,
                flowType: params.flowType,
                cellId: params.cellId ? params.cellId : params.cellType,
                graph: params.id ? params.graph : null,
            },
        };

        const _data = { url: "/process-flow-tmp/addflow", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            this.$message({
                message: this.$t("common.btn.submitSuccess"),
                type: "success",
            });
            _this.vueContext['CwDialogPanel1'].dialogVisible = false

            let json = { current: 1, pageSize: 15, requestData: {} };
            this.initList(json);
        });
    },
    getSelect1Options() {
        const _data = { url: "/approval/guest/approval-getuser", params: { data: 'BS0001' } };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
            let jsonUser = { data: [] };
            for (let i = 0; i < response.length; i++) {
                jsonUser.data.push(response[i].userId);
            }
            const _data = { url: "/user/get-all-ids", params: jsonUser };
            this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((response) => {
                this.approval = response;
                this.vueContext['CwSelect1'].options = response.map(item => {
                    return {
                        label: item.realName,
                        value: item.id
                    }
                })

            });
        });
    },
    submitApproval(){
        let _this = this
        let approvalJson = {
            data: {
                userId: _this.vueContext['CwSelect1'].value,
                bizCode: "BS0001",
                model: "processapprovalmodel",
                currentState: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].status,
                bizId: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].id
            },
        }
        this.$confirm(
            this.$t("common.processFlowTmpList.submitProcess"),
            this.$t("common.btn.hint"),
            {
                confirmButtonText: this.$t("common.btn.ok"),
                cancelButtonText: this.$t("common.btn.cancel"),
                type: "warning",
            }
        )
            .then(() => {
                const _data = {
                    url: "/process-flow-tmp/process-flow-appr",
                    params: approvalJson,
                };
                this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
                    this.$message({
                        message: this.$t("common.btn.submitSuccess"),
                        type: "success",
                    });
                    _this.vueContext['CwDrawerPanel1'].drawerVisible = false;
                    let json = { current: 1, pageSize: 15, requestData: {} };
                    this.initList(json);
                });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: this.$t("common.btn.Cancelled"),
                });
            });
    },
    initList(json) {
        let _this = this
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const _data = { url: "/process-flow-tmp/list", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
            _this.vueContext['CwCtrlList1'].data = response.data;
            _this.vueContext['CwCtrlList1'].page.total = response.total;
            loading.close()
        });
    },
    // 点击编辑按钮的抽屉弹窗的立即添加事件
    addNow(){
        let _this = this
        let clickGetData = _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData']
        let treeselectNode = _this.vueContext['CwTree1'].dataObtainedByEditor['treeselectNode']
        if (treeselectNode.data.template == 'SelectModel') {
            let processContent = { ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params, pp: [] }
            let ppArray = [];
            let flag = false;
            for (let i in _this.vueContext.uc_CwUCPanel1['CwForm2'].iform) {
                processContent['pp'].push(_this.vueContext.uc_CwUCPanel1['CwForm2'].iform[i].params)
            }
            processContent.pp.forEach((item, index) => {
                if (item.gradeMark.length > 0 && ppArray.includes(item.gradeMark)) {
                    flag = true;
                }
                ppArray[index] = item.gradeMark;
            })
            if (flag) {
                this.$message.error(this.$t('common.tip_info.duplicate_levels_error'))//this.$message.error("当前存在两个相同等级标识,请修改后保存！")
                return false;
            }
            let defaultGradeMark = processContent.defaultGradeMark;
            if (defaultGradeMark == undefined || defaultGradeMark.length < 1) {
                this.$message.error(this.$t('common.tip_info.level_empty_error')) //this.$message.error("默认等级不能为空,请输入！");
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                    // this.$emit('initOldDraggingNode')
                    // this.dialogSubmit()
                }
            })
        }
        else if (treeselectNode.data.template === 'dzChargeModel') {

            console.log('获取到的值：', _this.vueContext)

            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params
                },
                sp: [..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
            }



            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }

            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
            console.log('当前获取到的值：', json, processContent)

        }
        else if (treeselectNode.data.template.slice(0, 3) === 'OCV') {

            let processContent = { pp: { ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params } }

            function check() {
                if (parseInt(processContent.pp.VoltageUpperLmt) < parseInt(processContent.pp.VoltageLowerLmt)) {
                    return '电压上限[' + processContent.pp.VoltageUpperLmt + ']小于下限[' + processContent.pp.VoltageLowerLmt + ']'
                } else if (parseInt(processContent.pp.IRUpperLmt) < parseInt(processContent.pp.IRLowerLmt)) {
                    return '内阻上限[' + processContent.pp.IRUpperLmt + ']小于下限[' + processContent.pp.IRLowerLmt + ']'
                } else if (parseInt(processContent.pp.kUp) < parseInt(processContent.pp.kLow)) {
                    return 'K值上限[' + processContent.pp.kUp + ']小于下限[' + processContent.pp.kLow + ']'
                } else if (parseInt(processContent.pp.trayKUp) < parseInt(processContent.pp.trayKLow)) {
                    return '单盘K值上限[' + processContent.pp.trayKUp + ']小于下限[' + processContent.pp.trayKLow + ']'
                }
                return '';
            }
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (let k in processContent.pp) {
                if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
                    || k == 'sigma' || k == 'trayKLow' || k == 'trayKUp') {
                    processContent.pp[k] = processContent.pp[k] ? parseFloat(processContent.pp[k]) : processContent.pp[k]
                } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'IsKeyCalculate' || k == 'IsKeyTrayCalculate') {
                    processContent.pp[k] = processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
                }
            }

            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })

        }
        else if (treeselectNode.data.template == 'pointsForModel' || treeselectNode.data.template == 'chargeModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params
                },
                cj: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params,
                },
                dcj: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
            }

            function check() {
                if (parseInt(processContent.pp.t1TimeUp) < parseInt(processContent.pp.t1TimeLow)) {
                    return 'T1时间电压上限[' + processContent.pp.t1TimeUp + ']小于下限[' + processContent.pp.t1TimeLow + ']'
                } else if (parseInt(processContent.pp.t2TimeUp) < parseInt(processContent.pp.t2TimeLow)) {
                    return 'T2时间电压上限[' + processContent.pp.t2TimeUp + ']小于下限[' + processContent.pp.t2TimeLow + ']'
                } else if (parseInt(processContent.pp.t5CurrentUp) < parseInt(processContent.pp.t5CurrentLow)) {
                    return 'T5时间电流上限[' + processContent.pp.t5CurrentUp + ']小于下限[' + processContent.pp.t5CurrentLow + ']'
                }

                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (let k in processContent.pp) {
                if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
                    || k == 'voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k == 'constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' ||
                    k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' ||
                    k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8'
                    || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k == 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
                    k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' ||
                    k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
                    k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k == 'constVoltRiseCount' ||
                    k == 'constVoltRiseContinuous' || k == 'chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k == 'voltVoltLow' || k == 'dischargeTimeLow' || k == 'dischargeCapacityLow' || k == 'dischargeUpCapacity' || k == 'dischargeCurrentOffsetUp' || k == 'dischargeVoltUp' || k == 'dischargeVoltCount' ||
                    k == 'dischargeVoltContinuous' || k == 'currentOffset' || k == 'overCurrentProtection' || k == 'dormancyLoopCurrent' || k == 'overVolt' || k == 'currentLineOverVolt' ||
                    k == 'cCVoltageDrop' || k == 'contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k == 'voltDropProtection' ||
                    k == 'batteryTempEarlyAlarm' || k == 'currentPercentProtection' || k == 'endVoltStop' || k == 'endCapaStop' || k == 'endCCCVCapacityStep' || k == 'endCapacityStep'
                    || k == 'globalNGLimit' || k == 't5CurrentUp' || k == 't1TimeUp' || k == 'stepNo' || k == 'stepState' || k == 'stepTime' || k == 'stepCurrent' || k == 'stepVoltage'
                    || k == 'stepEndCurrent' || k == 'stepEndCap' || k == 'isEnable' || k == 'chargeCheckVolt8') {
                    processContent.pp[k] = processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
                }
            }
            for (let k in processContent.cj) {
                if (k == 'startVoltLow' || k == 'startVoltUp') {
                    processContent.cj[k] = processContent.cj[k] ? parseInt(processContent.cj[k]) : processContent.cj[k]
                }
            }
            for (let d in processContent.dcj) {
                if (d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp') {
                    processContent.dcj[d] = processContent.dcj[d] ? parseInt(processContent.dcj[d]) : processContent.dcj[d]
                }
            }

            processContent.sp.forEach((item, i) => {
                for (let k in item) {
                    if (k == 'stepNo' || k == 'stepCurrent' || k == 'stepVoltage' || k == 'stepEndCurrent' || k == 'stepEndCap') {
                        processContent.sp[i][k] = processContent.sp[i][k] ? parseInt(processContent.sp[i][k]) : processContent.sp[i][k]
                    }
                    if (k == 'stepTime') {
                        processContent.sp[i][k] = processContent.sp[i][k] ? parseFloat(processContent.sp[i][k]) : processContent.sp[i][k]
                    }
                }
            })
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (treeselectNode.data.template == 'DCIRModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
            }
            function check() {
                if (parseInt(processContent.pp.voltageUp) < parseInt(processContent.pp.voltageLow)) {
                    return '电压上限[' + processContent.pp.voltageUp + ']小于下限[' + processContent.pp.voltageLow + ']'
                } else if (parseInt(processContent.pp.DCIRUp01) < parseInt(processContent.pp.DCIRLow01)) {
                    return 'IR1上限[' + processContent.pp.DCIRUp01 + ']小于下限[' + processContent.pp.DCIRLow01 + ']'
                } else if (parseInt(processContent.pp.DCIRUp02) < parseInt(processContent.pp.DCIRLow02)) {
                    return 'IR2上限[' + processContent.pp.DCIRUp02 + ']小于下限[' + processContent.pp.DCIRLow01 + ']'
                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })

        }
        else if (treeselectNode.data.template == 'envelope' || treeselectNode.data.template == 'injectingLiquidModel') {
            let processContent = {
                doubleCheck: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                },
            }
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (treeselectNode.data.template == 'standTimeModel') {
            let processContent = {
                pp: { ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params },
                //doubleCheck: { ..._this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params },
            }
            function check() {
                if (parseInt(processContent.pp.stu) < parseInt(processContent.pp.stl)) {
                    return '静置时间上限[' + processContent.pp.stu + ']小于下限[' + processContent.pp.stl + ']'
                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (treeselectNode.data.template == 'IROCVModel') {
            
            let processContent = {
                ..._this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params,
                pp: { ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params },
                recipe: _this.vueContext.uc_CwUCPanel1['CwForm2'].dataObtainedByEditor.recipe,

            }

            function check() {
                console.log("processContent")
                if (parseFloat(processContent.pp.acceptOcvUpper) < parseFloat(processContent.pp.acceptOcvLower)) {
                    return '合格电芯电压上限[' + processContent.pp.acceptOcvUpper + ']小于下限[' + processContent.pp.acceptOcvLower + ']'
                } else if (parseFloat(processContent.acceptAcrUpper) < parseFloat(processContent.acceptAcrLower)) {
                    return '合格电芯ACR上限[' + processContent.pp.acceptAcrUpper + ']小于下限[' + processContent.pp.acceptAcrLower + ']'
                }
                // 上限应比下限大
                for (let index in processContent.recipe) {
                    let content = processContent.recipe[index]
                    let key = content.key
                    if (parseFloat(content.ocvUpper) < parseFloat(content.ocvLower)) {
                        return key + '的电压上限[' + content.ocvUpper + ']小于下限[' + content.ocvLower + ']'
                    } else if (parseFloat(content.irUpper) < parseFloat(content.irLower)) {
                        return key + '的内阻上限[' + content.irUpper + ']小于下限[' + content.irLower + ']'
                    } else if (parseFloat(content.capUpper) < parseFloat(content.capLower)) {
                        return key + '的容量上限[' + content.capUpper + ']小于下限[' + content.capLower + ']'
                    } else if (parseFloat(content.kUpper) < parseFloat(content.kLower)) {
                        return key + '的k值上限[' + content.kUpper + ']小于下限[' + content.kLower + ']'
                    } else if (parseFloat(content.dcrUpper) < parseFloat(content.dcrLower)) {
                        return key + '的DCR上限[' + content.dcrUpper + ']小于下限[' + content.dcrLower + ']'
                    }
                    else if (parseFloat(content.ocvUpper) < 0) {
                        return key + '的电压上限[' + content.ocvUpper + ']小于0'
                    } else if (parseFloat(content.ocvLower) < 0) {
                        return key + '的电压下限[' + content.ocvLower + ']小于0'
                    } else if (parseFloat(content.irUpper) < 0) {
                        return key + '的内阻上限[' + content.irUpper + ']小于0'
                    } else if (parseFloat(content.irLower) < 0) {
                        return key + '的内阻下限[' + content.irLower + ']小于0'
                    } else if (parseFloat(content.capUpper) < 0) {
                        return key + '的容量上限[' + content.capUpper + ']小于0'
                    } else if (parseFloat(content.capLower) < 0) {
                        return key + '的容量下限[' + content.capLower + ']小于0'
                    } else if (parseFloat(content.dcrUpper) < 0) {
                        return key + '的DCR上限[' + content.dcrUpper + ']小于0'
                    } else if (parseFloat(content.dcrLower) < 0) {
                        return key + '的DCR下限[' + content.dcrLower + ']小于0'
                    }

                }
                return '';
            }
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (var k in processContent.pp) {
                if (!processContent.pp[k]) {
                    processContent.pp[k] = 0;
                }
            }

            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        } else if (treeselectNode.data.template == 'tataChargeModel' || treeselectNode.data.template == 'tataPointsForModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                },
                cc: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
            }

            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        } else if (treeselectNode.data.template == 'tataDCRModel') {
            console.log(clickGetData, _this.vueContext, _this.vueContext.uc_CwUCPanel1)
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
            }
            console.log('数据处理前', processContent.sp)
            for (let i = 0; i < processContent.sp.length; i++) {
                let item = processContent.sp[i]
                item.logData = `${item.DeltaT ? item.DeltaT : ''},${item.DeltaV ? item.DeltaV : ''},${item.DeltaI ? item.DeltaI : ''}`;
                item.exitCondition = []; item.sign = []; item.endValue = []; item.GOTO = [];
                if (item.exitVoltage && item.sign0 && item.endValue0 && item.GOTO0) {
                    for (let k in item) {
                        if (k == 'exitVoltage') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign0)
                    item.endValue.push(item.endValue0)
                    item.GOTO.push(item.GOTO0)
                }

                if (item.exitCurrent && item.sign1 && item.endValue1 && item.GOTO1) {
                    for (let k in item) {
                        if (k == 'exitCurrent') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign1)
                    item.endValue.push(item.endValue1)
                    item.GOTO.push(item.GOTO1)
                } 

                if (item.exitCapacity && item.sign2 && item.endValue2 && item.GOTO2) {
                    for (let k in item) {
                        if (k == 'exitCapacity') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign2)
                    item.endValue.push(item.endValue2)
                    item.GOTO.push(item.GOTO2)
                }

                if (item.exitStepTime && item.sign3 && item.endValue3 && item.GOTO3) {
                    for (let k in item) {
                        if (k == 'exitStepTime') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign3)
                    item.endValue.push(item.endValue3)
                    item.GOTO.push(item.GOTO3)
                }

            }
           
            let newProcessContentSp = processContent.sp.map((item) => {
                item.exitCondition = item.exitCondition.toString(); item.sign = item.sign.toString();
                item.endValue = item.endValue.toString(); item.GOTO = item.GOTO.toString();
                return item;
            })
            processContent = { 
               pp: {
                    ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
                },
              sp: [...newProcessContentSp] }
            let json = {
                data: {
                    flowDtId: clickGetData.flowDtId,
                    id: clickGetData.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId
                }
            }
            console.log(newProcessContentSp)
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }

    },
    // 需要点击gojs节点展示参数模版时要修改模板信息可用
    addNowInFlowChart(){
        let _this = this
        let graphNodeDbClick = this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeMsg;
        let clickGetData = this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.clickTbRowData;
        let nodeDtsInfo = this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeDtMsg;
        console.log(this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor)
        if (graphNodeDbClick.data.templateCode.value == 'SelectModel') {
            let processContent = { ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params, pp: [] }
            let ppArray = [];
            let flag = false;
            for (let i in _this.vueContext.uc_CwUCPanel2['CwForm2'].iform) {
                processContent['pp'].push(_this.vueContext.uc_CwUCPanel2['CwForm2'].iform[i].params)
            }
            processContent.pp.forEach((item, index) => {
                if (item.gradeMark.length > 0 && ppArray.includes(item.gradeMark)) {
                    flag = true;
                }
                ppArray[index] = item.gradeMark;
            })
            if (flag) {
                this.$message.error(this.$t('common.tip_info.duplicate_levels_error'))//this.$message.error("当前存在两个相同等级标识,请修改后保存！")
                return false;
            }
            let defaultGradeMark = processContent.defaultGradeMark;
            if (defaultGradeMark == undefined || defaultGradeMark.length < 1) {
                this.$message.error(this.$t('common.tip_info.level_empty_error')) //this.$message.error("默认等级不能为空,请输入！");
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (graphNodeDbClick.data.templateCode.value.slice(0, 3) === 'OCV') {

            let processContent = { pp: { ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params } }

            function check() {
                if (parseInt(processContent.pp.VoltageUpperLmt) < parseInt(processContent.pp.VoltageLowerLmt)) {
                    return '电压上限[' + processContent.pp.VoltageUpperLmt + ']小于下限[' + processContent.pp.VoltageLowerLmt + ']'
                } else if (parseInt(processContent.pp.IRUpperLmt) < parseInt(processContent.pp.IRLowerLmt)) {
                    return '内阻上限[' + processContent.pp.IRUpperLmt + ']小于下限[' + processContent.pp.IRLowerLmt + ']'
                } else if (parseInt(processContent.pp.kUp) < parseInt(processContent.pp.kLow)) {
                    return 'K值上限[' + processContent.pp.kUp + ']小于下限[' + processContent.pp.kLow + ']'
                } else if (parseInt(processContent.pp.trayKUp) < parseInt(processContent.pp.trayKLow)) {
                    return '单盘K值上限[' + processContent.pp.trayKUp + ']小于下限[' + processContent.pp.trayKLow + ']'
                }
                return '';
            }
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (let k in processContent.pp) {
                if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
                    || k == 'sigma' || k == 'trayKLow' || k == 'trayKUp') {
                    processContent.pp[k] = processContent.pp[k] ? parseFloat(processContent.pp[k]) : processContent.pp[k]
                } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'IsKeyCalculate' || k == 'IsKeyTrayCalculate') {
                    processContent.pp[k] = processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
                }
            }

            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {

                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })

        }
        else if (graphNodeDbClick.data.templateCode.value == 'pointsForModel' || graphNodeDbClick.data.templateCode.value == 'chargeModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params
                },
                cj: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params,
                },
                dcj: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
            }

            function check() {
                if (parseInt(processContent.pp.t1TimeUp) < parseInt(processContent.pp.t1TimeLow)) {
                    return 'T1时间电压上限[' + processContent.pp.t1TimeUp + ']小于下限[' + processContent.pp.t1TimeLow + ']'
                } else if (parseInt(processContent.pp.t2TimeUp) < parseInt(processContent.pp.t2TimeLow)) {
                    return 'T2时间电压上限[' + processContent.pp.t2TimeUp + ']小于下限[' + processContent.pp.t2TimeLow + ']'
                } else if (parseInt(processContent.pp.t5CurrentUp) < parseInt(processContent.pp.t5CurrentLow)) {
                    return 'T5时间电流上限[' + processContent.pp.t5CurrentUp + ']小于下限[' + processContent.pp.t5CurrentLow + ']'
                }

                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (let k in processContent.pp) {
                if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
                    || k == 'voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k == 'constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' ||
                    k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' ||
                    k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8'
                    || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k == 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
                    k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' ||
                    k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
                    k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k == 'constVoltRiseCount' ||
                    k == 'constVoltRiseContinuous' || k == 'chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k == 'voltVoltLow' || k == 'dischargeTimeLow' || k == 'dischargeCapacityLow' || k == 'dischargeUpCapacity' || k == 'dischargeCurrentOffsetUp' || k == 'dischargeVoltUp' || k == 'dischargeVoltCount' ||
                    k == 'dischargeVoltContinuous' || k == 'currentOffset' || k == 'overCurrentProtection' || k == 'dormancyLoopCurrent' || k == 'overVolt' || k == 'currentLineOverVolt' ||
                    k == 'cCVoltageDrop' || k == 'contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k == 'voltDropProtection' ||
                    k == 'batteryTempEarlyAlarm' || k == 'currentPercentProtection' || k == 'endVoltStop' || k == 'endCapaStop' || k == 'endCCCVCapacityStep' || k == 'endCapacityStep'
                    || k == 'globalNGLimit' || k == 't5CurrentUp' || k == 't1TimeUp' || k == 'stepNo' || k == 'stepState' || k == 'stepTime' || k == 'stepCurrent' || k == 'stepVoltage'
                    || k == 'stepEndCurrent' || k == 'stepEndCap' || k == 'isEnable' || k == 'chargeCheckVolt8') {
                    processContent.pp[k] = processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
                }
            }
            for (let k in processContent.cj) {
                if (k == 'startVoltLow' || k == 'startVoltUp') {
                    processContent.cj[k] = processContent.cj[k] ? parseInt(processContent.cj[k]) : processContent.cj[k]
                }
            }
            for (let d in processContent.dcj) {
                if (d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp') {
                    processContent.dcj[d] = processContent.dcj[d] ? parseInt(processContent.dcj[d]) : processContent.dcj[d]
                }
            }

            processContent.sp.forEach((item, i) => {
                for (let k in item) {
                    if (k == 'stepNo' || k == 'stepCurrent' || k == 'stepVoltage' || k == 'stepEndCurrent' || k == 'stepEndCap') {
                        processContent.sp[i][k] = processContent.sp[i][k] ? parseInt(processContent.sp[i][k]) : processContent.sp[i][k]
                    }
                    if (k == 'stepTime') {
                        processContent.sp[i][k] = processContent.sp[i][k] ? parseFloat(processContent.sp[i][k]) : processContent.sp[i][k]
                    }
                }
            })
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (graphNodeDbClick.data.templateCode.value == 'DCIRModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
            }
            function check() {
                if (parseInt(processContent.pp.voltageUp) < parseInt(processContent.pp.voltageLow)) {
                    return '电压上限[' + processContent.pp.voltageUp + ']小于下限[' + processContent.pp.voltageLow + ']'
                } else if (parseInt(processContent.pp.DCIRUp01) < parseInt(processContent.pp.DCIRLow01)) {
                    return 'IR1上限[' + processContent.pp.DCIRUp01 + ']小于下限[' + processContent.pp.DCIRLow01 + ']'
                } else if (parseInt(processContent.pp.DCIRUp02) < parseInt(processContent.pp.DCIRLow02)) {
                    return 'IR2上限[' + processContent.pp.DCIRUp02 + ']小于下限[' + processContent.pp.DCIRLow01 + ']'
                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })

        }
        else if (graphNodeDbClick.data.templateCode.value == 'envelope' || graphNodeDbClick.data.templateCode.value == 'injectingLiquidModel') {
            let processContent = {
                doubleCheck: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                },
            }
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (graphNodeDbClick.data.templateCode.value == 'standTimeModel') {
            let processContent = {
                pp: { ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params },
                //doubleCheck: { ..._this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params },
            }
            function check() {
                if (parseInt(processContent.pp.stu) < parseInt(processContent.pp.stl)) {
                    return '静置时间上限[' + processContent.pp.stu + ']小于下限[' + processContent.pp.stl + ']'
                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (graphNodeDbClick.data.templateCode.value == 'tataChargeModel' || graphNodeDbClick.data.templateCode.value == 'tataPointsForModel') {
            let processContent = {
                pp: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                },
                cc: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params,
                    ..._this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
            }
            function check() {
                if (parseInt(processContent.pp.stu) < parseInt(processContent.pp.stl)) {
                    return '静置时间上限[' + processContent.pp.stu + ']小于下限[' + processContent.pp.stl + ']'
                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
        else if (graphNodeDbClick.data.templateCode.value == 'IROCVModel') {
            console.log('processContent', _this.vueContext.uc_CwUCPanel2)
            let processContent = {
                ..._this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params,
                pp: { ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params },
                recipe: _this.vueContext.uc_CwUCPanel2['CwForm2'].dataObtainedByEditor.recipe ? _this.vueContext.uc_CwUCPanel2['CwForm2'].dataObtainedByEditor.recipe : {},
                //dataObtainedByEditor若为空给一个默认值？
            }
            function check() {
                if (parseFloat(processContent.pp.acceptOcvUpper) < parseFloat(processContent.pp.acceptOcvLower)) {
                    return '合格电芯电压上限[' + processContent.pp.acceptOcvUpper + ']小于下限[' + processContent.pp.acceptOcvLower + ']'
                } else if (parseFloat(processContent.acceptAcrUpper) < parseFloat(processContent.acceptAcrLower)) {
                    return '合格电芯ACR上限[' + processContent.pp.acceptAcrUpper + ']小于下限[' + processContent.pp.acceptAcrLower + ']'
                }
                // 上限应比下限大
                for (let index in processContent.recipe) {
                    let content = processContent.recipe[index]
                    let key = content.key
                    if (parseFloat(content.ocvUpper) < parseFloat(content.ocvLower)) {
                        return key + '的电压上限[' + content.ocvUpper + ']小于下限[' + content.ocvLower + ']'
                    } else if (parseFloat(content.irUpper) < parseFloat(content.irLower)) {
                        return key + '的内阻上限[' + content.irUpper + ']小于下限[' + content.irLower + ']'
                    } else if (parseFloat(content.capUpper) < parseFloat(content.capLower)) {
                        return key + '的容量上限[' + content.capUpper + ']小于下限[' + content.capLower + ']'
                    } else if (parseFloat(content.kUpper) < parseFloat(content.kLower)) {
                        return key + '的k值上限[' + content.kUpper + ']小于下限[' + content.kLower + ']'
                    } else if (parseFloat(content.dcrUpper) < parseFloat(content.dcrLower)) {
                        return key + '的DCR上限[' + content.dcrUpper + ']小于下限[' + content.dcrLower + ']'
                    }
                    else if (parseFloat(content.ocvUpper) < 0) {
                        return key + '的电压上限[' + content.ocvUpper + ']小于0'
                    } else if (parseFloat(content.ocvLower) < 0) {
                        return key + '的电压下限[' + content.ocvLower + ']小于0'
                    } else if (parseFloat(content.irUpper) < 0) {
                        return key + '的内阻上限[' + content.irUpper + ']小于0'
                    } else if (parseFloat(content.irLower) < 0) {
                        return key + '的内阻下限[' + content.irLower + ']小于0'
                    } else if (parseFloat(content.capUpper) < 0) {
                        return key + '的容量上限[' + content.capUpper + ']小于0'
                    } else if (parseFloat(content.capLower) < 0) {
                        return key + '的容量下限[' + content.capLower + ']小于0'
                    } else if (parseFloat(content.dcrUpper) < 0) {
                        return key + '的DCR上限[' + content.dcrUpper + ']小于0'
                    } else if (parseFloat(content.dcrLower) < 0) {
                        return key + '的DCR下限[' + content.dcrLower + ']小于0'
                    }

                }
                return '';
            };
            let checkBody = check();
            if (checkBody) {
                this.$message({
                    message: checkBody,
                    type: 'error'
                })
                return false;
            }
            for (var k in processContent.pp) {
                if (!processContent.pp[k]) {
                    processContent.pp[k] = 0;
                }
            }

            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        } else if (graphNodeDbClick.data.templateCode.value == 'tataDCRModel') {
            let processContent = {
              	pp: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                },
                sp: [..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
            }
            console.log('数据处理前', processContent.sp)
            for (let i = 0; i < processContent.sp.length; i++) {
                let item = processContent.sp[i]
                item.logData = `${item.DeltaT ? item.DeltaT : ''},${item.DeltaV ? item.DeltaV : ''},${item.DeltaI ? item.DeltaI : ''}`;
                item.exitCondition = []; item.sign = []; item.endValue = []; item.GOTO = [];
                if (item.exitVoltage && item.sign0 && item.endValue0 && item.GOTO0) {
                    for (let k in item) {
                        if (k == 'exitVoltage') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign0)
                    item.endValue.push(item.endValue0)
                    item.GOTO.push(item.GOTO0)
                }

                if (item.exitCurrent && item.sign1 && item.endValue1 && item.GOTO1) {
                    for (let k in item) {
                        if (k == 'exitCurrent') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign1)
                    item.endValue.push(item.endValue1)
                    item.GOTO.push(item.GOTO1)
                }

                if (item.exitCapacity && item.sign2 && item.endValue2 && item.GOTO2) {
                    for (let k in item) {
                        if (k == 'exitCapacity') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign2)
                    item.endValue.push(item.endValue2)
                    item.GOTO.push(item.GOTO2)
                }

               if (item.exitStepTime && item.sign3 && item.endValue3 && item.GOTO3) {
                    for (let k in item) {
                        if (k == 'exitStepTime') {
                            item.exitCondition.push(k)
                        }
                    }
                    item.sign.push(item.sign3)
                    item.endValue.push(item.endValue3)
                    item.GOTO.push(item.GOTO3)
                }

            }
            let newProcessContentSp = processContent.sp.map((item) => {
                item.exitCondition = item.exitCondition.toString(); item.sign = item.sign.toString();
                item.endValue = item.endValue.toString(); item.GOTO = item.GOTO.toString();
                return item;
            })
            processContent = { 
              	pp: {
                    ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
                },
              	sp: [...newProcessContentSp] }
            console.log('数据处理后', processContent.sp)
            let json = {
                data: {
                    flowDtId: clickGetData.id,
                    id: nodeDtsInfo.id,
                    processContent: JSON.stringify(processContent),
                    processId: clickGetData.processId,
                }
            }
            const _data = { url: "/cw-fms-fms/process-dts-tmp/add", params: json };
            this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                }
            })
        }
    },

    setTableColumn(tData, ucComponents){
        let _this = this;
        let column = [

            { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            {
                field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false,
            },
            { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep' || scope.row.stepState == 'DC') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'stepEndCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'Sleep' || scope.row.stepState == 'CV') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'stepEndCap', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: false
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            const json = {
                                stepCurrent: 0,
                                stepEndCurrent: 0,
                                stepEndCap: 0,
                                stepNo: tableData.length + 1,
                                stepState: '',
                                stepTime: 0,
                                stepVoltage: 0
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ]
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'stepState', data.map(sel => {
                    return {
                        label: sel.paramDsc,
                        value: sel.paramValue
                    }
                }))
                //_this.$set(this.vueContext['uc_CwUCPanel1'].CwDesignTable1,'cols',column)
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
        // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)


    },
    setTataDCRTableColumn(tData, ucComponents){
        let _this = this;
        let column = [
            { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'controlType', title: '工步类型', minWidth: 150, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, },
            { field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'exitVoltage', title: '结束电压(mV)', minWidth: 120, align: 'center', queryType: 'switchByNumber', justifyContent: 'center', 
             set: true, require: false, query: false, hide: false, eidt: true, disabled: false,selectChange: function (val, self, row) {
               		if((row.exitVoltage && row.exitCurrent) || (row.exitVoltage && row.exitCapacity) || ((row.exitVoltage && row.exitStepTime))|| (row.exitCurrent && row.exitCapacity)|| (row.exitCurrent && row.exitStepTime)  ||(row.exitCapacity && row.exitStepTime)){
                      self.switchNo = 1
                    } else {
                      self.switchNo = 0
                    }
                },switchShow: function (scope,self) {
                    if (self && self.switchNo && !scope.row.exitVoltage && scope.row.stepNo == self.rowSelected.stepNo) {
                        return false
                    } else { return true }
                }
            },
            {
                field: 'sign0', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitVoltage == true) {
                        return true
                    } else { return false }
                }, disabled: false
            },
            {
                field: 'endValue0', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, valControlShow: function (row) {
                    if (row && row.exitVoltage == true) {
                        return true
                    } else { return false }
                }, eidt: true, disabled: false
            },
            {
                field: 'GOTO0', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitVoltage == true) {
                        return true
                    } else { return false }
                }, disabled: false
            },
            { field: 'exitCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'switchByNumber', justifyContent: 'center', 
             set: true, require: false, query: false, hide: false, eidt: true, disabled: false, selectChange: function (val, self, row) {
               			if((row.exitVoltage && row.exitCurrent) || (row.exitVoltage && row.exitCapacity) || ((row.exitVoltage && row.exitStepTime))|| (row.exitCurrent && row.exitCapacity)|| (row.exitCurrent && row.exitStepTime)  ||(row.exitCapacity && row.exitStepTime)){
                      self.switchNo = 1
                    } else {
                      self.switchNo = 0
                    }
                    },switchShow: function (scope,self) {
                    if (self && self.switchNo && !scope.row.exitCurrent && scope.row.stepNo == self.rowSelected.stepNo) {
                        return false
                    } else { return true }
                }
          	},
            {
                field: 'sign1', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitCurrent == true) {
                        return true
                    } else { return false }
                }, disabled: false
            },
            {
                field: 'endValue1', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitCurrent == true) {
                        return true
                    } else { return false }
                },
            },
            {
                field: 'GOTO1', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, valControlShow: function (row) {
                    if (row && row.exitCurrent == true) {
                        return true
                    } else { return false }
                },
            },
            { field: 'exitCapacity', title: '结束容量(mA)', minWidth: 120, align: 'center', queryType: 'switchByNumber', justifyContent: 'center', 
             set: true, require: false, query: false, hide: false, eidt: true, disabled: false, selectChange: function (val, self, row) {
               			if((row.exitVoltage && row.exitCurrent) || (row.exitVoltage && row.exitCapacity) || ((row.exitVoltage && row.exitStepTime))|| (row.exitCurrent && row.exitCapacity)|| (row.exitCurrent && row.exitStepTime)  ||(row.exitCapacity && row.exitStepTime)){
                      self.switchNo = 1
                    } else {
                      self.switchNo = 0
                    }
                    },switchShow: function (scope,self) {
                        if (self && self.switchNo && !scope.row.exitCapacity && scope.row.stepNo == self.rowSelected.stepNo) {
                            return false
                        } else { return true } 
                    }
             },
            {
                field: 'sign2', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitCapacity == true) {
                        return true
                    } else { return false }
                }, disabled: false
            },
            {
                field: 'endValue2', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitCapacity == true) {
                        return true
                    } else { return false }
                },
            },
            {
                field: 'GOTO2', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, valControlShow: function (row) {
                    if (row && row.exitCapacity == true) {
                        return true
                    } else { return false }
                },
            },
            { field: 'exitStepTime', title: '工步时间(s)', minWidth: 250, align: 'center', queryType: 'switchByNumber', justifyContent: 'center', 
             set: true, require: false, query: false, hide: false, eidt: true, disabled: false, selectChange: function (val, self, row) {
               			if((row.exitVoltage && row.exitCurrent) || (row.exitVoltage && row.exitCapacity) || ((row.exitVoltage && row.exitStepTime))|| (row.exitCurrent && row.exitCapacity)|| (row.exitCurrent && row.exitStepTime)  ||(row.exitCapacity && row.exitStepTime)){
                      self.switchNo = 1
                    } else {
                      self.switchNo = 0
                    }
                    },switchShow: function (scope,self) {
                    if (self && self.switchNo && !scope.row.exitStepTime && scope.row.stepNo == self.rowSelected.stepNo) {
                        return false
                    } else { return true }
                 }
            },
            {
                field: 'sign3', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: false, valControlShow: function (row) {
                    if (row && row.exitStepTime == true) {
                        return true
                    } else { return false }
                },
            },
            {
                field: 'endValue3', title: '结束值', minWidth: 200, align: 'center', queryType: 'timePickerByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (row) {
                    if (row && row.exitStepTime == true) {
                        return true
                    } else { return false }
                },
            },
            {
                field: 'GOTO3', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, valControlShow: function (row) {
                    if (row && row.exitStepTime == true) {
                        return true
                    } else { return false }
                },
            },
            // {
            //     field: 'logData', title: '记录条件', minWidth: 120, align: 'center', queryType: 'dropInput', set: true, require: false,
            //     query: false, hide: false, eidt: true, disabled: false, logData: [{ label: '时间差', val: 'DeltaT' }, { label: '电流差', val: 'DeltaI' }, { label: '电压差', val: 'DeltaV' }]
            // },
            {
                field: 'DeltaT', title: '记录条件时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: false,
            },
            {
                field: 'DeltaV', title: '记录条件电压差', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: false,
            },
            {
                field: 'DeltaI', title: '记录条件电流差', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: false,
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            const json = {
                                stepNo: tableData.length + 1,
                                controlType: "",
                                current: "",
                                exitVoltage: false, exitCurrent: false, exitCapacity: false,
                                exitStepTime: false, DeltaT: "", DeltaV: "", DeltaI: "",
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'controlType', [
                    { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' }, { label: '静置', value: 'SLEEP' }
                ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'sign0', [
                    { label: '>=', value: '>=' }, { label: '<=', value: '<=' }, { label: '>', value: '>' }, { label: '<', value: '<' }
                ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'sign1', [
                    { label: '>=', value: '>=' }, { label: '<=', value: '<=' }, { label: '>', value: '>' }, { label: '<', value: '<' }
                ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'sign2', [
                    { label: '>=', value: '>=' }, { label: '<=', value: '<=' }, { label: '>', value: '>' }, { label: '<', value: '<' }
                ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'sign3', [
                    { label: '>=', value: '>=' }, { label: '<=', value: '<=' }, { label: '>', value: '>' }, { label: '<', value: '<' }
                ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'GOTO0', [{ label: '完成', value: 'finish' }, { label: '继续', value: 'continue' }])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'GOTO1', [{ label: '完成', value: 'finish' }, { label: '继续', value: 'continue' }])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'GOTO2', [{ label: '完成', value: 'finish' }, { label: '继续', value: 'continue' }])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'GOTO3', [{ label: '完成', value: 'finish' }, { label: '继续', value: 'continue' }])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
        // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)


    },
    setTataPointsForTableColumn(tData, ucComponents){
        let _this = this;
        let column = [
            { field: 'stepNo', title: '工步号', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'mode', title: '工步类型', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, },
            // { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'voltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'CCC' || scope.row.mode == 'REST' || scope.row.mode == 'CCD') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },

            {
                field: 'endCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'CCD' || scope.row.mode == 'CCC' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltage', title: '结束电压(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP' || scope.row.mode == 'CCCV' || scope.row.mode == 'CCDV') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacity', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            { field: 'DVTime', title: '时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVVoltage', title: '电压差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVCurrent', title: '电流差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'voltLowerLimit', title: '电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltUpperLimit', title: '电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempLowerLimit', title: '温度下限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempUpperLimit', title: '温度上限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltageFluctuation', title: '电压波动/分（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltLowerLimit', title: '结束电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltUpperLimit', title: '结束电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityLowerLimit', title: '结束容量下限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityUpperLimit', title: '结束容量上限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            const json = {
                                stepCurrent: 0,
                                stepEndCurrent: 0,
                                stepEndCap: 0,
                                stepNo: tableData.length + 1,
                                stepState: '',
                                stepTime: 0,
                                stepVoltage: 0
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                // _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                //     { label: '恒流恒压充电', value: 'CCCV' }, { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' },
                //     { label: '恒流恒压放电', value: 'CCDV' }, { label: '静置', value: 'REST' }, { label: '循环', value: 'LOOP' }
                // ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                    { label: _this.$t('common.ProcessTemplate.cccv'), value: 'CCCV' }, { label: _this.$t('common.ProcessTemplate.ccc'), value: 'CCC' },
                    { label: _this.$t('common.ProcessTemplate.ccd'), value: 'CCD' }, { label: _this.$t('common.ProcessTemplate.ccdv'), value: 'CCDV' },
                    { label: _this.$t('common.ProcessTemplate.rest'), value: 'REST' }, { label: _this.$t('common.ProcessTemplate.loop'), value: 'LOOP' }
                ])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
    },
    setTataTableColumn(tData, ucComponents){
        let _this = this;
        let column = [

            { field: 'stepNo', i18nKey: 'const.editPage.stepNo', title: '工步号', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'mode', title: '工步类型', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, },
            // { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'voltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'CCC' || scope.row.mode == 'REST' || scope.row.mode == 'CCD') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },

            {
                field: 'endCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'CCD' || scope.row.mode == 'CCC' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltage', title: '结束电压(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP' || scope.row.mode == 'CCCV' || scope.row.mode == 'CCDV') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacity', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'negPressure', title: '负压（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            { field: 'DVTime', title: '时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVVoltage', title: '电压差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVCurrent', title: '电流差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'DVnegPressure', title: '负压偏差（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltLowerLimit', title: '电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltUpperLimit', title: '电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempLowerLimit', title: '温度下限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempUpperLimit', title: '温度上限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltageFluctuation', title: '电压波动/分（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltLowerLimit', title: '结束电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltUpperLimit', title: '结束电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityLowerLimit', title: '结束容量下限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityUpperLimit', title: '结束容量上限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            const json = {
                                stepCurrent: 0,
                                stepEndCurrent: 0,
                                stepEndCap: 0,
                                stepNo: tableData.length + 1,
                                stepState: '',
                                stepTime: 0,
                                stepVoltage: 0
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                // _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                //     { label: '恒流恒压充电', value: 'CCCV' }, { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' },
                //     { label: '恒流恒压放电', value: 'CCDV' }, { label: '静置', value: 'REST' }, { label: '循环', value: 'LOOP' }
                // ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                    { label: _this.$t('common.ProcessTemplate.cccv'), value: 'CCCV' }, { label: _this.$t('common.ProcessTemplate.ccc'), value: 'CCC' },
                    { label: _this.$t('common.ProcessTemplate.ccd'), value: 'CCD' }, { label: _this.$t('common.ProcessTemplate.ccdv'), value: 'CCDV' },
                    { label: _this.$t('common.ProcessTemplate.rest'), value: 'REST' }, { label: _this.$t('common.ProcessTemplate.loop'), value: 'LOOP' }
                ])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
        // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)

    },
    setDCIRTableColumn(tData){
        let _this = this;
        let column = [
            { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, selectChange: function (e, self, row) { console.log(e, self, row) } },
            { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, },
            {
                field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep' || scope.row.stepState == 'DC') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'stepEndVoltage', title: '结束电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.stepState == 'Sleep' || scope.row.stepState == 'CV') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            { field: 'stepEndCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'stepRecordTime', title: '记录间隔(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            // { field: 'stepEndCap', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data
                            const json = {
                                stepCurrent: 0,
                                stepEndCurrent: 0,
                                stepEndCap: 0,
                                stepNo: tableData.length + 1,
                                stepState: '',
                                stepTime: 0,
                                stepVoltage: 0
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ]
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {

                _this.$set(_this.vueContext.uc_CwUCPanel1['CwDesignTable1'].tableInitSelect, 'stepState', data.map(sel => {
                    return {
                        label: sel.paramDsc,
                        value: sel.paramValue
                    }
                }))
                //_this.$set(this.vueContext['uc_CwUCPanel1'].CwDesignTable1,'cols',column)
                _this.vueContext['uc_CwUCPanel1'].CwDesignTable1.cols = column
                _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data = [...tData]

            }

        });
    },


    setDzTableColumn(tData, ucComponents){
        let _this = this;
        let column = [

            { field: 'stepNo', title: '工步号', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
            { field: 'mode', title: '工步类型', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, },
            // { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'voltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'CCC' || scope.row.mode == 'REST' || scope.row.mode == 'CCD') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },

            {
                field: 'endCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'CCD' || scope.row.mode == 'CCC' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltage', title: '结束电压(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP' || scope.row.mode == 'CCCV' || scope.row.mode == 'CCDV') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacity', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'REST' || scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'negPressure', title: '负压（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            { field: 'DVTime', title: '时间差', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVVoltage', title: '电压差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            { field: 'DVCurrent', title: '电流差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'DVnegPressure', title: '负压偏差（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltLowerLimit', title: '电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltUpperLimit', title: '电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempLowerLimit', title: '温度下限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'tempUpperLimit', title: '温度上限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'voltageFluctuation', title: '电压波动/分（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltLowerLimit', title: '结束电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endVoltUpperLimit', title: '结束电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityLowerLimit', title: '结束容量下限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
            {
                field: 'endCapacityUpperLimit', title: '结束容量上限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: (scope) => {
                    if (scope.row.mode == 'LOOP') {
                        return true
                    } else {
                        return false
                    }

                }
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: function (row) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            return tableData.length == row.stepNo
                        }, callback: function (e, self) {
                            let tableData = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            const json = {
                                stepCurrent: 0,
                                stepEndCurrent: 0,
                                stepEndCap: 0,
                                stepNo: tableData.length + 1,
                                stepState: '',
                                stepTime: 0,
                                stepVoltage: 0
                            }
                            tableData.push(json)
                        },
                        style: {
                            float: 'left'
                        }
                    },

                    {
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: function (row) {

                            return true
                        }, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
                            if (data.length < 2) {
                                _this.$message.error(_this.$t('common.tip_info.delete_last_record'))//_this.$message.error('当前数据为最后一条,无法删除！')
                                return false
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].stepNo == row.stepNo) {
                                    data.splice(i, 1)
                                    for (let j = 0; j < data.length; j++) {
                                        data[j].stepNo = (j + 1)
                                    }
                                    break
                                }
                            }
                        },
                        style: {
                            float: 'left'
                        }
                    },

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                // _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                //     { label: '恒流恒压充电', value: 'CCCV' }, { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' },
                //     { label: '恒流恒压放电', value: 'CCDV' }, { label: '静置', value: 'REST' }, { label: '循环', value: 'LOOP' }
                // ])
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                    { label: _this.$t('common.ProcessTemplate.cccv'), value: 'CCCV' }, { label: _this.$t('common.ProcessTemplate.ccc'), value: 'CCC' },
                    { label: _this.$t('common.ProcessTemplate.ccd'), value: 'CCD' }, { label: _this.$t('common.ProcessTemplate.ccdv'), value: 'CCDV' },
                    { label: _this.$t('common.ProcessTemplate.rest'), value: 'REST' }, { label: _this.$t('common.ProcessTemplate.loop'), value: 'LOOP' }
                ])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
        // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)

    },

    initTreeData(url, param){
        let _this = this;
        _this.vueContext['CwTree1'].init(url, param)

    },
    clickToJump() {
        let _this = this;
        _this.vueContext['CwDrawerPanel1'].drawerVisible = true

    },
    initProcessAddSelect(ucComponents) {
        let _this = this;
        const _data = { url: "/cw-fms-fms/process/getall", params: {} };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                //_this.vueContext.uc_CwUCPanel1['CwForm1']
                _this.$set(_this.vueContext[ucComponents]['CwForm1'].initSelect, 'ocvChoose', data.filter(item => item.processName.slice(0, 3) === 'OCV').map(sel => {
                    return {
                        label: sel.processName,
                        value: sel.processCode
                    }
                })
                )
            }

        });


    },
    tabChange(val) {
        let _this = this;
        this.vueContext['CwDrawerPanel1'].drawerVisible = true;
    },



}