{
  created(){
    let _this = this;
    // this.initProcessAddSelect()
    // this.initTreeData('cw-fms-fms/process-flow-tmp-dts/guest/get-dts',{data:'1709819688860725248'})
  },
  mounted(){
    let _this = this;
    this.addEventListener('CwButton9','click',this.addNow)
    this.addEventListener('CwButton6','click',this.flowEdit)
    this.addEventListener('CwButton5','click',this.submitApproval)
    _this.vueContext['CwButton9'].component.styles.display = 'none'
    this.addEventListener('CwTree1', 'node-click', this.treeSingelClicktest)
    this.addEventListener('CwProcessFlowChart1', 'chart-save', this.chartSave)
    this.addEventListener('CwProcessFlowChart1', 'params-temp', this.paramsTemp)
    this.addEventListener('CwProcessFlowChart1', 'flow-modify-select', this.flowModifySelect)
    this.addEventListener('CwProcessFlowChart1', 'move-on-finish', this.moveOnFinishSaveChart)
    this.addEventListener('CwProcessFlowChart1', 'approval-submit', this.approvalSubmit)
    this.addEventListener('CwProcessFlowChart1', 'node-dele', this.nodeDele)
    console.log(this.vueContext)
    this.getSelect1Options()
    _this.$nextTick(() => {
      _this.vueContext['CwForm3'].initSelect =  _this.vueContext['CwCtrlList1'].$children[0].initSelect
    });
  },
  // 审批弹窗按钮
  chartSave() {
    console.log('表格刷新')
    this.vueContext['CwCtrlList1'].loadDataQuery({ current: 1, pageSize: 15, requestData: {} },(data)=>{
      this.vueContext['CwCtrlList1'].data = data.data;
      this.vueContext['CwCtrlList1'].page.total = data.total;
      this.vueContext['CwCtrlList1'].dataLoading = false;
    })
  },
 // 修改按钮
 moveOnFinishSaveChart(e, newDataArr, nodeData) {
     if (nodeData.nodeDataArray.length) {
      let dataParam = {
                  url:   "/process-flow-tmp-dts/createOrUpdate",
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
 nodeDele(e,json,myDiagramEntity,nodeData) {
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
  paramsTemp(e,node,row,paramTemplateEntity) {
      paramTemplateEntity.dataUpdate(row, "/process-dts-tmp/guest/get-dts", 2);
      //console.log('节点弹窗',e, node, row, this.vueContext['CwProcessFlowChart1'])
      // this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeMsg = node;
      // this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.clickTbRowData = row;
    /* this.vueContext['CwDialogPanel3'].dialogVisible = true;
    	  let _this = this
       _this.vueContext['CwButton10'].component.styles.display = 'block'
        const _data = { url: "/cw-fms-fms/process-dts-tmp/guest/get-dts", params: { data: row.id } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
          let allModelData = {}
          if (data) {
            allModelData = JSON.parse(data.processContent)
          }
       let templateStr = node.data.templateCode.value;
       if (templateStr.slice(0, 3) === 'OCV') {
           _this.vueContext['CwUCPanel2'].setUcCode('OCV1Model', () => {
             _this.$nextTick(() => {
               // _this.initProcessAddSelect()
                _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};

             });
          })

         } 
           else if (templateStr == 'pointsForModel' || templateStr == 'chargeModel') {
            _this.vueContext['CwUCPanel2'].component.attribute['ucCode']= 'pointsForModel'
            _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
              _this.$nextTick(() => {
                _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
               _this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
                _this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params = allModelData.cj ? allModelData.cj : {};
                _this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
                _this.setTableColumn(allModelData.sp ? allModelData.sp : [])
             })
            })

         } 
      		 else if(templateStr == 'DCIRModel'){
            _this.vueContext['CwUCPanel2'].setUcCode('DCIRModel', () => {
              _this.$nextTick(() => {
                _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
               _this.setDCIRTableColumn(allModelData.sp ? allModelData.sp : [])

              });
           })

         }
         else if(templateStr == 'envelope' || templateStr == 'injectingLiquidModel' || templateStr == 'postHeliumTest'){
            _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
              _this.$nextTick(() => {
                _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
              });
            })

          }else if(templateStr == 'SelectModel' || templateStr == 'standTimeModel' ){
            _this.vueContext['CwUCPanel2'].setUcCode(templateStr, () => {
              _this.$nextTick(() => {
               _this.vueContext.CwUCPanel2.addEventListener('CwForm1','switch-change',(node)=>{
                   let formModes = [..._this.vueContext.uc_CwUCPanel2['CwForm2'].formModes]
                    formModes.forEach(itemForms=>{
                      itemForms.forms.forEach(itemcol=>{
                        itemcol.disabled = _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                     })
                    })
                    _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'],'formModes',[...formModes])
                })
                _this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params = allModelData ? allModelData : {};

                let obj = {..._this.vueContext.uc_CwUCPanel2['CwForm2'].formModes[0]}
                let dialogVisible = obj.dialogVisible
                for (let i = 0; i < allModelData.pp.length; i++) {
                  if(_this.vueContext.uc_CwUCPanel2['CwForm2'].formModes[i]){
                    _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test'+i].params = allModelData.pp[i]
                  }else{
                    obj.dialogVisible = 'test' + i
                    _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test'+i] = {params:{}}
                    _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'].formModes,_this.vueContext.uc_CwUCPanel2['CwForm2'].formModes.length,obj)
                    obj.forms.forEach(fo =>{
                      _this.vueContext.uc_CwUCPanel2['CwForm2'].iform['test'+i]['params'][fo.field] = allModelData.pp[i][fo.field]
                    })
                  }
                  _this.vueContext.uc_CwUCPanel2['CwForm2'].formModes.forEach(itemForms=>{
                    itemForms.forms.forEach(itemcol=>{
                      itemcol['disabled'] = allModelData[itemcol.fieldDisabled] == 0 ? true : false
                    })
                  })
             }
                const _data = { url: "/cw-fms-fms/process/guest/geGrade", params: {} };
                this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                  if (data.length > 0) {
                    let optionData = []
                    data.forEach((val,idx)=>{
                      optionData[idx] = {label: val, value: val}
                    })
                    _this.vueContext.uc_CwUCPanel2['CwForm1']
                    _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                    _this.$set(_this.vueContext.uc_CwUCPanel2['CwForm2'].initSelect, 'gradeMark', optionData)

                  }

                });
              });
          })

         }
          else {
         //   _this.vueContext['CwUCPanel3'].setUcCode(templateStr, () => { 
          //    _this.$nextTick(() => {
          //      _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
          //      _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
          //    });

          //  })
          }

       }); */

  }, 
    
  flowEdit(){
    let _this = this;
    let params = {..._this.vueContext['CwForm3'].iform.processeditor.params}
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
        this.vueContext['CwSelect1'].options = response.map(item=>{
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
        bizId:  _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].id
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
  addNow(){
    let _this = this
    let clickGetData = _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData']
    let treeselectNode = _this.vueContext['CwTree1'].dataObtainedByEditor['treeselectNode']
    if(treeselectNode.data.template == 'SelectModel'){
      let processContent = {..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,pp:[]}
      let ppArray = [];
      let flag = false;
      for(let i in _this.vueContext.uc_CwUCPanel1['CwForm2'].iform){
        processContent['pp'].push(_this.vueContext.uc_CwUCPanel1['CwForm2'].iform[i].params)
      }
      processContent.pp.forEach((item, index) => {
        if (item.gradeMark.length > 0 && ppArray.includes(item.gradeMark)) {
          flag = true;
        }
        ppArray[index] = item.gradeMark;
      })
      if (flag) {
        this.$message.error("当前存在两个相同等级标识,请修改后保存！")
        return false;
      }
      let defaultGradeMark = processContent.defaultGradeMark;
      if (defaultGradeMark == undefined || defaultGradeMark.length < 1) {
        this.$message.error("默认等级不能为空,请输入！");
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
     
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
    else if(treeselectNode.data.template.slice(0, 3) === 'OCV'){

      let processContent = {pp:{..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params}}

      function check() {
        if (parseInt(processContent.pp.VoltageUpperLmt) < parseInt(processContent.pp.VoltageLowerLmt)) {
          return '电压上限[' + processContent.pp.VoltageUpperLmt + ']小于下限[' + processContent.pp.VoltageLowerLmt + ']'
        } else if (parseInt(processContent.pp.IRUpperLmt) < parseInt(processContent.pp.IRLowerLmt)) {
          return '内阻上限[' + processContent.pp.IRUpperLmt + ']小于下限[' + processContent.pp.IRLowerLmt + ']'
        } else if (parseInt(processContent.pp.kUp) < parseInt(processContent.pp.kLow)) {
          return 'K值上限[' + processContent.pp.kUp + ']小于下限[' + processContent.pp.kLow + ']'
        }else if (parseInt(processContent.pp.trayKUp) < parseInt(processContent.pp.trayKLow)) {
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
      for(let k in processContent.pp) {
        if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
         || k == 'sigma' || k == 'trayKLow' || k == 'trayKUp') {
          processContent.pp[k] =  processContent.pp[k] ? parseFloat(processContent.pp[k]) : processContent.pp[k]
        } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'IsKeyCalculate' || k == 'IsKeyTrayCalculate'){
          processContent.pp[k] =  processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
     
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    
    }
    else if(treeselectNode.data.template == 'pointsForModel' || treeselectNode.data.template == 'chargeModel'){
      let processContent = {
        pp:{
          ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
          ..._this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params
        },
        cj:{
          ..._this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params,
        },
        dcj:{
          ..._this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params,
        },
        sp:[..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
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
      for(let k in processContent.pp) {
        if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
        || k=='voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k=='constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' || 
        k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' || 
        k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8' 
        || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k== 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
        k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' || 
        k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
         k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k =='constVoltRiseCount' || 
         k == 'constVoltRiseContinuous' || k =='chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k =='voltVoltLow' || k == 'dischargeTimeLow' || k =='dischargeCapacityLow' || k=='dischargeUpCapacity' || k=='dischargeCurrentOffsetUp' || k=='dischargeVoltUp' || k =='dischargeVoltCount' ||
         k == 'dischargeVoltContinuous' || k=='currentOffset' || k=='overCurrentProtection' || k=='dormancyLoopCurrent' || k=='overVolt' || k=='currentLineOverVolt' ||
         k =='cCVoltageDrop' || k=='contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k== 'voltDropProtection' ||
         k=='batteryTempEarlyAlarm' || k=='currentPercentProtection' || k =='endVoltStop' || k=='endCapaStop' || k=='endCCCVCapacityStep' || k=='endCapacityStep'
          || k=='globalNGLimit'|| k=='t5CurrentUp' || k=='t1TimeUp' || k=='stepNo' || k=='stepState' || k=='stepTime' || k=='stepCurrent' || k=='stepVoltage' 
          || k=='stepEndCurrent' || k=='stepEndCap' || k=='isEnable' || k=='chargeCheckVolt8') 
          {
            processContent.pp[k] =  processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
          } 
      }
      for(let k in processContent.cj) {
        if (k == 'startVoltLow' || k == 'startVoltUp') {
          processContent.cj[k] =  processContent.cj[k] ? parseInt(processContent.cj[k]) : processContent.cj[k]
        }
      }
      for(let d in processContent.dcj) {
        if(d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp'){
          processContent.dcj[d] =  processContent.dcj[d] ? parseInt(processContent.dcj[d]) : processContent.dcj[d]
        }
      }

      processContent.sp.forEach((item,i) => {
        for(let k in item){
        if (k=='stepNo' || k=='stepTime' || k=='stepCurrent' || k=='stepVoltage' || k=='stepEndCurrent' || k=='stepEndCap') {
                processContent.sp[i][k] =  processContent.sp[i][k] ? parseInt(processContent.sp[i][k]): processContent.sp[i][k]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
    else if(treeselectNode.data.template == 'DCIRModel'){
      let processContent = {
        pp:{
          ..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params,
        },
        sp:[..._this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })

    }
    else if(treeselectNode.data.template == 'envelope' || treeselectNode.data.template == 'injectingLiquidModel'){
      let processContent = {
        doubleCheck:{
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
    else if(treeselectNode.data.template == 'standTimeModel'){
      let processContent = {
        pp:{..._this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params},
        doubleCheck:{..._this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params},
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
      
  },
  // 需要点击gojs节点时展示参数模版时要修改模板信息可用（当前未用到）
  addNow1(){
     let _this = this
     let graphNodeDbClick = this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.nodeMsg;
     let clickGetData = this.vueContext['CwProcessFlowChart1'].dataObtainedByEditor.clickTbRowData;
    if(graphNodeDbClick.data.templateCode.value == 'SelectModel'){
      let processContent = {..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,pp:[]}
      let ppArray = [];
      let flag = false;
      for(let i in _this.vueContext.uc_CwUCPanel2['CwForm2'].iform){
        processContent['pp'].push(_this.vueContext.uc_CwUCPanel2['CwForm2'].iform[i].params)
      }
      processContent.pp.forEach((item, index) => {
        if (item.gradeMark.length > 0 && ppArray.includes(item.gradeMark)) {
          flag = true;
        }
        ppArray[index] = item.gradeMark;
      })
      if (flag) {
        this.$message.error("当前存在两个相同等级标识,请修改后保存！")
        return false;
      }
      let defaultGradeMark = processContent.defaultGradeMark;
      if (defaultGradeMark == undefined || defaultGradeMark.length < 1) {
        this.$message.error("默认等级不能为空,请输入！");
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
     
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
    else if(graphNodeDbClick.data.templateCode.value.slice(0, 3) === 'OCV'){

      let processContent = {pp:{..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params}}

      function check() {
        if (parseInt(processContent.pp.VoltageUpperLmt) < parseInt(processContent.pp.VoltageLowerLmt)) {
          return '电压上限[' + processContent.pp.VoltageUpperLmt + ']小于下限[' + processContent.pp.VoltageLowerLmt + ']'
        } else if (parseInt(processContent.pp.IRUpperLmt) < parseInt(processContent.pp.IRLowerLmt)) {
          return '内阻上限[' + processContent.pp.IRUpperLmt + ']小于下限[' + processContent.pp.IRLowerLmt + ']'
        } else if (parseInt(processContent.pp.kUp) < parseInt(processContent.pp.kLow)) {
          return 'K值上限[' + processContent.pp.kUp + ']小于下限[' + processContent.pp.kLow + ']'
        }else if (parseInt(processContent.pp.trayKUp) < parseInt(processContent.pp.trayKLow)) {
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
      for(let k in processContent.pp) {
        if (k == 'VoltageLowerLmt' || k == 'VoltageUpperLmt' || k == 'kUp' || k == 'kLow' || k == 'IRLowerLmt' || k == 'IRUpperLmt'
         || k == 'sigma' || k == 'trayKLow' || k == 'trayKUp') {
          processContent.pp[k] =  processContent.pp[k] ? parseFloat(processContent.pp[k]) : processContent.pp[k]
        } else if (k == 'NGRetestNum' || k == 'NGRetestCount' || k == 'NGOutboundLimit' || k == 'IsKeyCalculate' || k == 'IsKeyTrayCalculate'){
          processContent.pp[k] =  processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
     
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    
    }
    else if(graphNodeDbClick.data.templateCode.value == 'pointsForModel' || graphNodeDbClick.data.templateCode.value == 'chargeModel'){
      let processContent = {
        pp:{
          ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
          ..._this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params
        },
        cj:{
          ..._this.vueContext.uc_CwUCPanel2['CwForm3'].iform.test.params,
        },
        dcj:{
          ..._this.vueContext.uc_CwUCPanel2['CwForm4'].iform.test.params,
        },
        sp:[..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
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
      for(let k in processContent.pp) {
        if (k == 'chargeVoltUp8' || k == 'chargeCurrUp8' || k == 'chargeCapUp8' || k == 'constCurrVoltFluProtect8' || k == 'constVoltVoltFluProtect8' || k == 'chargeDownContinuousVolt8'
        || k=='voltageRiseInstantlyVolt8' || k == 'chargeVoltCheckTime8' | k == 'chargeLimitTime8' || k == 'currentOffset8' || k == 'voltOffset8' || k=='constVoltRiseContinuous8' || k == 'voltageRiseInstantlyTime8' || 
        k == 'voltageDropInstantlyVolt8' || k == 'chargetotalDropVolt8' || k == 'constantVoltRefluxinstantly8' || k == 'chargeVoltDownCount8' || k == 'chargeVoltDownContinuous8' || k == 'dischargeVoltLow8' || 
        k == 'dischargeVoltLow8' || k == 'dischargeOverCurrent8' || k == 'dischargeOverCapa8' || k == 'dischargeContinuousvoltagerise' || k == 'dischargeLimitTime8' 
        || k == 'underVoltProtect8' || k == 'dischargeVoltRiseInstant8' || k == 'constantcurrentOffset8' || k == 'currLinevoltDeviation8' || k== 'abnormalVoltagevalue8' || k == 'LineIRabnormal8' || k == 'endVoltStep' || k == 'endCapaStep' || k == 'startVoltStep' || k == 'ocvNgCount' || k == 'contactNgCount' || k == 'chargeNgCount' || k == 'globalNGLimit' || k == 'outTrayNglimit' || k == 'nGNumUp' ||
        k == 'chargeVoltUp' || k == 'chargeCapUp' || k == 'currentLow' || k == 'chargeCheckTime' || k == 'chargecheckVoltLow' || k == 't1Time' || k == 't1TimeLow' || 
        k == 't2Time' || k == 't2TimeLow' || k == 't2TimeUp' || k == 't3Time' || k == 't4Time' || k == 't5Time' || k == 't5CurrentLow' || k == 'chargeVoltOffset' ||
         k == 'chargeLimitTime' || k == 'chargeVoltDownTime' || k == 'chargeVoltDownValue' || k == 'chargeVoltLow' || k == 'constVoltRise' || k =='constVoltRiseCount' || 
         k == 'constVoltRiseContinuous' || k =='chargeVoltDownRange' || k == 'chargeVoltDownCount' || k == 'chargeVoltDownContinuous' || k =='voltVoltLow' || k == 'dischargeTimeLow' || k =='dischargeCapacityLow' || k=='dischargeUpCapacity' || k=='dischargeCurrentOffsetUp' || k=='dischargeVoltUp' || k =='dischargeVoltCount' ||
         k == 'dischargeVoltContinuous' || k=='currentOffset' || k=='overCurrentProtection' || k=='dormancyLoopCurrent' || k=='overVolt' || k=='currentLineOverVolt' ||
         k =='cCVoltageDrop' || k=='contactImpedance' || k == 'vlotDiff' || k == 'batteryTempAlarm' || k == 'scramVolt' || k == 'v1CollectTime' || k== 'voltDropProtection' ||
         k=='batteryTempEarlyAlarm' || k=='currentPercentProtection' || k =='endVoltStop' || k=='endCapaStop' || k=='endCCCVCapacityStep' || k=='endCapacityStep'
          || k=='globalNGLimit'|| k=='t5CurrentUp' || k=='t1TimeUp' || k=='stepNo' || k=='stepState' || k=='stepTime' || k=='stepCurrent' || k=='stepVoltage' 
          || k=='stepEndCurrent' || k=='stepEndCap' || k=='isEnable' || k=='chargeCheckVolt8') 
          {
            processContent.pp[k] =  processContent.pp[k] ? parseInt(processContent.pp[k]) : processContent.pp[k]
          } 
      }
      for(let k in processContent.cj) {
        if (k == 'startVoltLow' || k == 'startVoltUp') {
          processContent.cj[k] =  processContent.cj[k] ? parseInt(processContent.cj[k]) : processContent.cj[k]
        }
      }
      for(let d in processContent.dcj) {
        if(d == 'firstDischargeCapacityLow' || d == 'firstDischargeCapacityUp' || d == 'secondDischargeCapacityLow' || d == 'secondDischargeCapacityUp'){
          processContent.dcj[d] =  processContent.dcj[d] ? parseInt(processContent.dcj[d]) : processContent.dcj[d]
        }
      }

      processContent.sp.forEach((item,i) => {
        for(let k in item){
        if (k=='stepNo' || k=='stepTime' || k=='stepCurrent' || k=='stepVoltage' || k=='stepEndCurrent' || k=='stepEndCap') {
                processContent.sp[i][k] =  processContent.sp[i][k] ? parseInt(processContent.sp[i][k]): processContent.sp[i][k]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
    else if(graphNodeDbClick.data.templateCode.value == 'DCIRModel'){
      let processContent = {
        pp:{
          ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
        },
        sp:[..._this.vueContext.uc_CwUCPanel2['CwDesignTable1'].data]
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })

    }
    else if(graphNodeDbClick.data.templateCode.value == 'envelope' || graphNodeDbClick.data.templateCode.value == 'injectingLiquidModel'){
      let processContent = {
        doubleCheck:{
          ..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params,
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }
    else if(graphNodeDbClick.data.templateCode.value == 'standTimeModel'){
      let processContent = {
        pp:{..._this.vueContext.uc_CwUCPanel2['CwForm1'].iform.test.params},
        doubleCheck:{..._this.vueContext.uc_CwUCPanel2['CwForm2'].iform.test.params},
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
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) =>{
        if (data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
        }
      })
    }  
  },

  setTableColumn(tData){
    let _this = this;
    let column = [

      { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
      { field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, 
        // selectChange: function (val, self, scope) { 
        // if(val == 'CC'){
        //   self.vueContext.uc_CwUCPanel1['CwDesignTable1'].cols.forEach(item=>{
        //     if(item.field == 'stepVoltage' && item.queryType === 'input' && item.eidt === true){
        //       item['disabled'] = true
        //     }else{
        //       item['disabled'] = false
        //     }
        //   })
        // }else if (val === 'Sleep') {
        //   self.vueContext.uc_CwUCPanel1['CwDesignTable1'].cols.forEach(item=>{
        //     if((item.field == 'stepCurrent' || item.field == 'stepVoltage'|| item.field == 'stepEndCurrent') && item.queryType === 'input' && item.eidt === true){
        //       item['disabled'] = true
        //     }else{
        //       item['disabled'] = false
        //     }
        //   })
        // }else if (val === 'CV') {
        //   self.vueContext.uc_CwUCPanel1['CwDesignTable1'].cols.forEach(item=>{
        //     if((item.field == 'stepCurrent') && item.queryType === 'input' && item.eidt === true){
        //       item['disabled'] = true
        //     }else{
        //       item['disabled'] = false
        //     }
        //   })
        // }else if (val === 'DC') {
        //   self.vueContext.uc_CwUCPanel1['CwDesignTable1'].cols.forEach(item=>{
        //     if((item.field == 'stepVoltage' || item.field == 'stepEndCap') && item.queryType === 'input' && item.eidt === true){
        //       item['disabled'] = true
        //     }else{
        //       item['disabled'] = false
        //     }
        //   })
        // }
        // }
      },
      { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled:false},
      { field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
        disabled:(scope)=>{
          if(scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep'){
            return true
          }else{
            return false
          }
        }
      },
      { field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
        disabled:(scope)=>{
          if(scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep' || scope.row.stepState == 'DC'){
            return true
          }else{
            return false
          }
        }
      },
      { field: 'stepEndCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
        disabled:(scope)=>{
          if(scope.row.stepState == 'Sleep' || scope.row.stepState == 'CV'){
            return true
          }else{
            return false
          }
          
        }
      },
      { field: 'stepEndCap', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
        disabled:false
      },
    ]
    let operColumns = [
      {
        field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
          {
            text: '新增', background: '', size: 'mini', hideText: true, show: function (row) {
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
            text: '删除', background: '', size: 'mini', hideText: true, show: function (row) {

              return true
            }, callback: function (e, self, row) {
              const data = _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data
              if (data.length < 2) {
                _this.$message.error('当前数据为最后一条,无法删除！')
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



    // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)


  },
  treeSingelClicktest(r){
    console.log(r)
    let _this = this
    let templateStr = r.detail[0].template

    
    if (r.detail[1].level == 2) {
      _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => { })
      _this.vueContext['CwButton9'].component.styles.display = 'block'
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
            _this.initProcessAddSelect()
            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
  
          });
  
        }else if (templateStr == 'pointsForModel' || templateStr == 'chargeModel') {
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.cj ? allModelData.cj : {};
              _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
              _this.setTableColumn(allModelData.sp ? allModelData.sp : [])
            });
           

        } else if(templateStr == 'DCIRModel'){
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.setDCIRTableColumn(allModelData.sp ? allModelData.sp : [])
            });
        }
        else if(templateStr == 'envelope' || templateStr == 'injectingLiquidModel' || templateStr == 'postHeliumTest'){
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
            });
        }else if(templateStr == 'SelectModel'){
            _this.$nextTick(() => {
              _this.vueContext.CwUCPanel1.addEventListener('CwForm1','switch-change',(r)=>{
                  let formModes = [..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes]
                  formModes.forEach(itemForms=>{
                    itemForms.forms.forEach(itemcol=>{
                      itemcol.disabled = _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                    })
                  })
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'],'formModes',[...formModes])
              })
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData ? allModelData : {};

              let obj = {..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[0]}
              let dialogVisible = obj.dialogVisible
              for (let i = 0; i < allModelData.pp.length; i++) {
                if(_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[i]){
                  _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i].params = allModelData.pp[i]
                }else{
                  obj.dialogVisible = 'test' + i
                  _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i] = {params:{}}
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes,_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.length,obj)
                  obj.forms.forEach(fo =>{
                    _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i]['params'][fo.field] = allModelData.pp[i][fo.field]
                  })
                }
                _this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.forEach(itemForms=>{
                  itemForms.forms.forEach(itemcol=>{
                    itemcol['disabled'] = allModelData[itemcol.fieldDisabled] == 0 ? true : false
                  })
                })
              }
              const _data = { url: "/cw-fms-fms/process/guest/geGrade", params: {} };
              this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data.length > 0) {
                  let optionData = []
                  data.forEach((val,idx)=>{
                    optionData[idx] = {label: val, value: val}
                  })
                  //_this.vueContext.uc_CwUCPanel1['CwForm1']
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].initSelect, 'gradeMark', optionData)
          
                }
          
              });
            });
          
        } else {
            // _this.$nextTick(() => {
            //   _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            //   _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
            // });
            
        }
      })
      
    }
  },

  treeSingelClick(r){
    let _this = this
    let templateStr = r.detail[0].template
    if (r.detail[1].level == 2) {
      _this.vueContext['CwButton9'].component.styles.display = 'block'
      if (templateStr == '') {
        _this.vueContext['CwUCPanel1'].setUcCode('testPage', () => { 
        })
        this.$message({
          message: this.$t("common.processFlowTmpList.noNeedParam"),
          type: "warning",
        });
        return false;
      }
      const _data = { url: "/cw-fms-fms/process-dts-tmp/guest/get-dts", params: { data: r.detail[0].id } };
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
        let allModelData = {}
        _this.vueContext['CwTree1'].dataObtainedByEditor['treeselectNode'] = r.detail[1]
        _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData']= {
          flowDtId: r.detail[0].id,
          processId: r.detail[0].processId
        }
        if (data) {
          allModelData = JSON.parse(data.processContent)
          _this.vueContext['CwTree1'].dataObtainedByEditor['clickGetData'] = data
        }
        if (templateStr.slice(0, 3) === 'OCV') {

         
          _this.vueContext['CwUCPanel1'].setUcCode('OCV1Model', () => {
            _this.$nextTick(() => {
              _this.initProcessAddSelect()
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};

            });

          })
    

        } else if (templateStr == 'pointsForModel' || templateStr == 'chargeModel') {
          //_this.vueContext['CwUCPanel1'].component.attribute['ucCode']= 'pointsForModel'
          _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => {
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.cj ? allModelData.cj : {};
              _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
              _this.setTableColumn(allModelData.sp ? allModelData.sp : [])
            });
           
          })

        } else if(templateStr == 'DCIRModel'){
          _this.vueContext['CwUCPanel1'].setUcCode('DCIRModel', () => {
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.setDCIRTableColumn(allModelData.sp ? allModelData.sp : [])
  
            });
          })
          
        }
        else if(templateStr == 'envelope' || templateStr == 'injectingLiquidModel' || templateStr == 'postHeliumTest'){
          _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => {
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
            });
          })
          
        }else if(templateStr == 'SelectModel'){
          _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => {
            _this.$nextTick(() => {
              _this.vueContext.CwUCPanel1.addEventListener('CwForm1','switch-change',(r)=>{
                  let formModes = [..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes]
                  formModes.forEach(itemForms=>{
                    itemForms.forms.forEach(itemcol=>{
                      itemcol.disabled = _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params[itemcol.fieldDisabled] == 0 ? true : false
                    })
                  })
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'],'formModes',[...formModes])
              })
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData ? allModelData : {};

              let obj = {..._this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[0]}
              let dialogVisible = obj.dialogVisible
              for (let i = 0; i < allModelData.pp.length; i++) {
                if(_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes[i]){
                  _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i].params = allModelData.pp[i]
                }else{
                  obj.dialogVisible = 'test' + i
                  _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i] = {params:{}}
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes,_this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.length,obj)
                  obj.forms.forEach(fo =>{
                    _this.vueContext.uc_CwUCPanel1['CwForm2'].iform['test'+i]['params'][fo.field] = allModelData.pp[i][fo.field]
                  })
                }
                _this.vueContext.uc_CwUCPanel1['CwForm2'].formModes.forEach(itemForms=>{
                  itemForms.forms.forEach(itemcol=>{
                    itemcol['disabled'] = allModelData[itemcol.fieldDisabled] == 0 ? true : false
                  })
                })
              }
              const _data = { url: "/cw-fms-fms/process/guest/geGrade", params: {} };
              this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
                if (data.length > 0) {
                  let optionData = []
                  data.forEach((val,idx)=>{
                    optionData[idx] = {label: val, value: val}
                  })
                  //_this.vueContext.uc_CwUCPanel1['CwForm1']
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                  _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].initSelect, 'gradeMark', optionData)
          
                }
          
              });
            });
          })
          
        } else {
          _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => { 
            _this.$nextTick(() => {
              _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
              _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
            });
            
          })
        }

      });




    }


  },
  setDCIRTableColumn(tData){
    let _this = this;
    let column = [

      { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
      { field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: false, selectChange: function (e, self, row) { console.log(e, self, row) } },
      { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, },
      { field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
        disabled:(scope)=>{
          if(scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep'){
            return true
          }else{
            return false
          }
        }
      },
      { field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, 
        disabled:(scope)=>{
          if(scope.row.stepState == 'CC' || scope.row.stepState == 'Sleep' || scope.row.stepState == 'DC'){
            return true
          }else{
            return false
          }
        }
      },
      { field: 'stepEndVoltage', title: '结束电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, 
        disabled:(scope)=>{
          if(scope.row.stepState == 'Sleep' || scope.row.stepState == 'CV'){
            return true
          }else{
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
            text: '新增', background: '', size: 'mini', hideText: true, show: function (row) {
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
            text: '删除', background: '', size: 'mini', hideText: true, show: function (row) {

              return true
            }, callback: function (e, self, row) {
              const data = _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data
              if (data.length < 2) {
                _this.$message.error('当前数据为最后一条,无法删除！')
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
  initTreeData(url, param){
    let _this = this;
    _this.vueContext['CwTree1'].init(url, param)

  },
  clickToJump() {
    let _this = this;

    _this.vueContext['CwDrawerPanel1'].drawerVisible = true

  },
  initProcessAddSelect() {
    let _this = this;
    const _data = { url: "/cw-fms-fms/process/getall", params: {} };
    this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
      if (data.length > 0) {

        //_this.vueContext.uc_CwUCPanel1['CwForm1']
        _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm1'].initSelect, 'ocvChoose', data.filter(item => item.processName.slice(0, 3) === 'OCV').map(sel => {
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