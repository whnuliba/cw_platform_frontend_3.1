{
  created(){
    let _this = this;
  },
  mounted(){
    let _this = this;
    this.vueContext['CwCtrlList1'].cols[4]=
    { field: 'status', title: '状态', align: "center", query: true, queryType: 'select', set: false, jsonSelData: true, 
     status: [{ label: this.commonI18n('common.todo.end'), value: 2 }, { label: this.commonI18n('common.todo.rejected'), value: 4 }, { label: this.commonI18n('common.todo.agree'), value: 6 }, { label: this.commonI18n('common.todo.pending'), value: 7 }] },
    this.addEventListener('CwButton1', 'click', this.submitApproval)
    this.addEventListener('CwTree1', 'node-click', this.treeSingelClicktest)
    //this.getSelect1Options()
    console.log(this.vueContext,_this.$store.getters.language)
  },
  computed: {
		langChange: function() {
      let _this = this;
      return _this.$store.getters.language
    }
  },
  watch: {
    langChange:{
      handler:function(newValue, oldValue) {
        console.log(`langChange changed from ${oldValue} to ${newValue}`);
      },
      deep: true,
      immediate: true
    }
  },
 /* initList(json) {
    let _this = this
    _this.vueContext['CwCtrlList1'].dataLoading = true
    const _data = { url: '/approval-todo/list', params: json }
    _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
      _this.vueContext['CwCtrlList1'].data = response.data;
      _this.vueContext['CwCtrlList1'].page.total = response.total;
      _this.vueContext['CwCtrlList1'].dataLoading = false;
    }))
  },*/
  
  submitApproval() {
    let _this = this;
    let selectValue = this.vueContext['CwSelect1'].value
    this.$confirm(selectValue == 4 ? this.$t('common.tip_info.reject_process_info') : this.$t('common.tip_info.agree_process_info'), this.$t('common.tip_info.tips'), {// '确定要' + (selectValue == 4 ? '驳回' : '通过') + '此流程吗？？'
      confirmButtonText: this.$t('common.btn.ok'),
      cancelButtonText: this.$t('common.btn.cancel'),
      type: 'warning'
    }).then(() => {
      const _data = {
        url: '/process-flow-tmp/process-flow-approval-sb', params: {
          data: {
            bizId: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].id,
            flowId: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].sourceId,
            status: selectValue
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
        this.$message({
          message: selectValue == 4 ? this.$t('common.tip_info.approval_reject_info') : this.$t('common.tip_info.approval_agree_info'),//'审批' + (selectValue == 4 ? '驳回' : '通过') + '成功！',
          type: 'success'
        })
        const json = { 'current': 1, 'pageSize': 15, requestData: this.data }
        _this.vueContext['CwDialogPanel1'].dialogVisible = false
         _this.vueContext['CwCtrlList1'].loadDataQuery({ current: 1, pageSize: 15, requestData: {} }, (data) => {
                    _this.vueContext['CwCtrlList1'].data = data.data;
                    _this.vueContext['CwCtrlList1'].page.total = data.total;
                    _this.vueContext['CwCtrlList1'].dataLoading = false;
                })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: this.$t("common.btn.Cancelled")//'已取消'
      })
    })
  },
  treeSingelClicktest(r){
    let _this = this
    let templateStr = r.detail[0].template
   // if (r.detail[0].label.slice(-2) == "化成") {
   //   templateStr = 'chargeModel'
   // }

    if (r.detail[1].level == 2) {
      _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => {


        _this.$nextTick(() => {
          // _this.$set( _this.vueContext.uc_CwUCPanel1['CwTabPanel1'], 'loadLoading', true)
          console.log(_this.vueContext.uc_CwUCPanel1['CwTabPanel1'])
          for (let i in _this.vueContext.uc_CwUCPanel1) {
            if (i.includes('CwForm')) {
              _this.vueContext.uc_CwUCPanel1[i].formModes.forEach(itemForms => {
                itemForms.forms.forEach(itemcol => {
                  itemcol.disabled = true
                })
              })
            }
          }
        });


      })

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
            _this.setIrocvColumn(allModelData.pp ? allModelData.pp : [])
            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            //_this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
          });

        } else if (templateStr == 'pointsForModel') {
          _this.$nextTick(() => {
            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.cj ? allModelData.cj : {};
            _this.vueContext.uc_CwUCPanel1['CwForm5'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
            _this.vueContext.uc_CwUCPanel1['CwForm6'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm7'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm8'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.setTableColumn(allModelData.sp ? allModelData.sp : [])
          });
        } else if (templateStr == 'chargeModel') {
          _this.$nextTick(() => {
            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.cj ? allModelData.cj : {};
            _this.vueContext.uc_CwUCPanel1['CwForm5'].iform.test.params = allModelData.dcj ? allModelData.dcj : {};
            _this.setTableColumn(allModelData.sp ? allModelData.sp : [])
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
                _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm1'].initSelect, 'defaultGradeMark', optionData)
                _this.$set(_this.vueContext.uc_CwUCPanel1['CwForm2'].initSelect, 'gradeMark', optionData)
              }
            });
          });

        } else if (templateStr == 'IROCVModel') {
          _this.$nextTick(() => {
            _this.setIrocvColumn(allModelData.pp ? allModelData.pp : [])
         /*   _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.recipe[6] ? allModelData.recipe[6] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.recipe[7] ? allModelData.recipe[7] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData.recipe[8] ? allModelData.recipe[8] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm5'].iform.test.params = allModelData.recipe[0] ? allModelData.recipe[0] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm6'].iform.test.params = allModelData.recipe[1] ? allModelData.recipe[1] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm7'].iform.test.params = allModelData.recipe[2] ? allModelData.recipe[2] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm8'].iform.test.params = allModelData.recipe[3] ? allModelData.recipe[3] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm9'].iform.test.params = allModelData.recipe[4] ? allModelData.recipe[4] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm10'].iform.test.params = allModelData.recipe[5] ? allModelData.recipe[5] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm11'].iform.test.params = allModelData.recipe[0] ? allModelData.recipe[0] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm12'].iform.test.params = allModelData.recipe[1] ? allModelData.recipe[1] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm13'].iform.test.params = allModelData.recipe[2] ? allModelData.recipe[2] : {};
            _this.vueContext.uc_CwUCPanel1['CwForm14'].iform.test.params = allModelData ? allModelData : {};*/

            _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
            _this.vueContext.uc_CwUCPanel1['CwForm2'].dataObtainedByEditor['recipe'] = allModelData.recipe ? allModelData.recipe : {};
            _this.vueContext.uc_CwUCPanel1['CwForm3'].dataObtainedByEditor['recipe'] = allModelData.recipe ? allModelData.recipe : {};
            _this.vueContext.uc_CwUCPanel1['CwForm4'].iform.test.params = allModelData ? allModelData : {};
            _this.vueContext.uc_CwUCPanel1['CwForm5'].dataObtainedByEditor.recipe = allModelData.recipe ? allModelData.recipe : {};
            _this.vueContext.CwUCPanel1.init(_this.vueContext.CwUCPanel1, _this.vueContext.uc_CwUCPanel1)
          });
        }else if (templateStr == 'tataChargeModel') {
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

          } else if (templateStr == 'tataDCRModel') {
                _this.vueContext['CwUCPanel1'].component.attribute['ucCode'] = 'tataDCRModel'
                _this.vueContext['CwUCPanel1'].setUcCode(templateStr, () => {
                    _this.$nextTick(() => {
                        let spData = allModelData.sp ? allModelData.sp.length : false;
                        //console.log(allModelData, allModelData.sp, spData)
                        _this.setTataDCRTableColumn(spData ? allModelData.sp :
                            [{
                                "stepNo": 1, "controlType": "", "current": "", "exitVoltage": false, "exitCurrent": false, "exitCapacity": false,
                                "exitStepTime": false, "DeltaT": "", "DeltaV": "", "DeltaI": "",
                            }]
                            , "uc_CwUCPanel1")
                    })
                })
            } else {
          // _this.$nextTick(() => {
          //   _this.vueContext.uc_CwUCPanel1['CwForm1'].iform.test.params = allModelData.pp ? allModelData.pp : {};
          //   _this.vueContext.uc_CwUCPanel1['CwForm2'].iform.test.params = allModelData.doubleCheck ? allModelData.doubleCheck : {};
          // });
        }
        // _this.vueContext.uc_CwUCPanel1.CwTabPanel1.loadLoading = false
      })

    }
  },
  setDCIRTableColumn(tData){
    let _this = this;
    let column = [
      { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, },
      { field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, selectChange: function (e, self, row) { } },
      { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, },
      { field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepEndVoltage', title: '结束电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepEndCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepRecordTime', title: '记录间隔(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      // { field: 'stepEndCap', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true },
    ]
    let operColumns = [
      {
        field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
          {
            text: '新增', background: '', size: 'mini', hideText: true, show: function (row) {
              return false
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
              return false
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
  setTableColumn(tData){
    let _this = this;
    let column = [
      { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepState', title: '工步', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepCurrent', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepVoltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepEndCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
      { field: 'stepEndCap', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
    ]
    let operColumns = [
      {
        field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
          {
            text: '新增', background: '', size: 'mini', hideText: true, show: function (row) {
              return false
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
              return false
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
        _this.vueContext['uc_CwUCPanel1'].CwDesignTable1.cols = column
        _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].operColumns = [...operColumns]
        _this.vueContext.uc_CwUCPanel1['CwDesignTable1'].data = [...tData]
      }
    });
  },
     setTataPointsForTableColumn(tData, ucComponents){
        let _this = this;
        let column = [
            { field: 'stepNo', title: '工步号', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true ,disabled: true, },
            { field: 'mode', title: '工步类型', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, },
            // { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'voltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },

            {
                field: 'endCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'endVoltage', title: '结束电压(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'endCapacity', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            { field: 'DVTime', title: '时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            { field: 'DVVoltage', title: '电压差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            { field: 'DVCurrent', title: '电流差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'voltLowerLimit', title: '电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'voltUpperLimit', title: '电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'tempLowerLimit', title: '温度下限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'tempUpperLimit', title: '温度上限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'voltageFluctuation', title: '电压波动/分（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endVoltLowerLimit', title: '结束电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endVoltUpperLimit', title: '结束电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endCapacityLowerLimit', title: '结束容量下限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endCapacityUpperLimit', title: '结束容量上限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true,show: false, callback: function (e, self) {
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
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: false, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
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

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                    { label: '恒流恒压充电', value: 'CCCV' }, { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' },
                    { label: '恒流恒压放电', value: 'CCDV' }, { label: '静置', value: 'REST' }, { label: '循环', value: 'LOOP' }
                ])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
    },
  setTataDCRTableColumn(tData, ucComponents){
        let _this = this;
        let column = [
            { field: 'stepNo', title: '步次', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,disabled: true },
            { field: 'controlType', title: '工步类型', minWidth: 150, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, },
            { field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            { field: 'exitVoltage', title: '结束电压(mV)', minWidth: 120, align: 'center', queryType: 'switch', justifyContent: 'center', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'sign0', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitVoltage == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'endValue0', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, valControlShow: function (self) {
                    if (self && self.exitVoltage == true) {
                        return true
                    } else { return false }
                }, eidt: true, disabled: true
            },
            {
                field: 'GOTO0', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitVoltage == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            { field: 'exitCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'switch', justifyContent: 'center', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'sign1', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitCurrent == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'endValue1', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitCurrent == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'GOTO1', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, valControlShow: function (self) {
                    if (self && self.exitCurrent == true) {
                        return true
                    } else { return false }
                },
            },
            { field: 'exitCapacity', title: '结束容量(mA)', minWidth: 120, align: 'center', queryType: 'switch', justifyContent: 'center', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'sign2', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitCapacity == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'endValue2', title: '结束值', minWidth: 120, align: 'center', queryType: 'inputByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitCapacity == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'GOTO2', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, valControlShow: function (self) {
                    if (self && self.exitCapacity == true) {
                        return true
                    } else { return false }
                },
            },
            { field: 'exitStepTime', title: '工步时间(s)', minWidth: 250, align: 'center', queryType: 'switch', justifyContent: 'center', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'sign3', title: '条件符号', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: false, valControlShow: function (self) {
                    if (self && self.exitStepTime == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'endValue3', title: '结束值', minWidth: 200, align: 'center', queryType: 'timePickerByValControl', set: true, require: false, query: false, hide: false, eidt: true, valControlShow: function (self) {
                    if (self && self.exitStepTime == true) {
                        return true
                    } else { return false }
                }, disabled: true
            },
            {
                field: 'GOTO3', title: 'GOTO', minWidth: 120, align: 'center', queryType: 'selectByValControl', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, valControlShow: function (self) {
                    if (self && self.exitStepTime == true) {
                        return true
                    } else { return false }
                },
            },
            {
                field: 'DeltaT', title: '记录条件时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: true,
            },
            {
                field: 'DeltaV', title: '记录条件电压差', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: true,
            },
            {
                field: 'DeltaI', title: '记录条件电流差', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false,
                query: false, hide: false, eidt: true, disabled: true,
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: false, callback: function (e, self) {
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
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true,show: false, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
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

   setTataTableColumn(tData, ucComponents){
        let _this = this;
        let column = [

            { field: 'stepNo', i18nKey: 'const.editPage.stepNo', title: '工步号', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true , disabled: true,},
            { field: 'mode', title: '工步类型', minWidth: 120, align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, eidt: true, disabled: true, },
            // { field: 'stepTime', title: '时间(s)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: false },
            {
                field: 'current', title: '电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled:true
            },
            {
                field: 'voltage', title: '电压(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },

            {
                field: 'endCurrent', title: '结束电流(mA)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'endVoltage', title: '结束电压(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled:true
            },
            {
                field: 'endCapacity', title: '结束容量(mAh)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled: true
            },
            {
                field: 'negPressure', title: '负压（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true,
                disabled:true
            },
            { field: 'DVTime', title: '时间差', minWidth: 200, align: 'center', queryType: 'time-picker', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            { field: 'DVVoltage', title: '电压差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            { field: 'DVCurrent', title: '电流差(mV)', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true },
            {
                field: 'DVnegPressure', title: '负压偏差（kPa）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true,
            },
            {
                field: 'voltLowerLimit', title: '电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'voltUpperLimit', title: '电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'tempLowerLimit', title: '温度下限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'tempUpperLimit', title: '温度上限（℃）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'voltageFluctuation', title: '电压波动/分（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endVoltLowerLimit', title: '结束电压下限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endVoltUpperLimit', title: '结束电压上限（mV）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled:true
            },
            {
                field: 'endCapacityLowerLimit', title: '结束容量下限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
            {
                field: 'endCapacityUpperLimit', title: '结束容量上限（mAH）', minWidth: 120, align: 'center', queryType: 'input', set: true, require: false, query: false, hide: false, eidt: true, disabled: true
            },
        ]
        let operColumns = [
            {
                field: 'oper', title: '操作', minWidth: 200, align: 'center', showFilter: true, buttons: [
                    {
                        text: 'common.btn.add', background: '', size: 'mini', hideText: true, show: false, callback: function (e, self) {
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
                        text: 'common.btn.delete', background: '', size: 'mini', hideText: true, show: false, callback: function (e, self, row) {
                            const data = _this.vueContext[ucComponents]['CwDesignTable1'].data
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

                ], fixed: 'right'
            },
        ]
        const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: { data: "FMS_STEP" } };
        this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
            if (data.length > 0) {
                _this.$set(_this.vueContext[ucComponents]['CwDesignTable1'].tableInitSelect, 'mode', [
                    { label: '恒流恒压充电', value: 'CCCV' }, { label: '恒流充电', value: 'CCC' }, { label: '恒流放电', value: 'CCD' },
                    { label: '恒流恒压放电', value: 'CCDV' }, { label: '静置', value: 'REST' }, { label: '循环', value: 'LOOP' }
                ])
                _this.vueContext[ucComponents].CwDesignTable1.cols = column
                _this.vueContext[ucComponents]['CwDesignTable1'].operColumns = [...operColumns]
                _this.vueContext[ucComponents]['CwDesignTable1'].data = [...tData]

            }

        });
        // this.$set(this.vueContext['CwDesignTable1'].initSelect,'cols', column)

    },

  setIrocvColumn(tData){
    tData.irTest = tData.irTest && tData.irTest ? true : false;
    tData.ocvTest = tData.ocvTest && tData.ocvTest ? true : false;
  }
}