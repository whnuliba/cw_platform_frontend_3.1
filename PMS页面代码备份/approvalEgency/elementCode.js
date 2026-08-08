{
  created(){
    let _this = this;
  },
  mounted(){
    let _this = this;
    this.addEventListener('CwButton1', 'click', this.submitApproval)
    this.addEventListener('CwTree1', 'node-click', this.treeSingelClicktest)
    this.getSelect1Options()
  },

  /*
  initList(json) {
    let _this = this
    _this.vueContext['CwCtrlList1'].dataLoading = true
    const _data = { url: '/approval-todo/list', params: json }
    _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
      _this.vueContext['CwCtrlList1'].data = response.data;
      _this.vueContext['CwCtrlList1'].page.total = response.total;
      _this.vueContext['CwCtrlList1'].dataLoading = false;
    }))
  },
  */
  submitApproval() {
    let _this = this;
    let selectValue = this.vueContext['CwSelect1'].value
    this.$confirm('确定要' + (selectValue == 4 ? '驳回' : '通过') + '此流程吗？？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
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
          message: '审批' + (selectValue == 4 ? '驳回' : '通过') + '成功！',
          type: 'success'
        })
        const json = { 'current': 1, 'pageSize': 15, requestData: this.data }
        _this.vueContext['CwDialogPanel1'].dialogVisible = false
        this.initList(json)
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  },
  getSelect1Options() {
    this.vueContext['CwSelect1'].options = [
      { label: '同意', value: 6 },
      { label: '驳回', value: 4 }
    ]
  },
  treeSingelClicktest(r){
    let _this = this
    let templateStr = r.detail[0].template
    if (r.detail[0].label.slice(-2) == "化成") {
      templateStr = 'chargeModel'
    }

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
            _this.vueContext.uc_CwUCPanel1['CwForm3'].iform.test.params = allModelData.pp ? allModelData.pp : {};
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
            _this.vueContext.uc_CwUCPanel1['CwForm14'].iform.test.params = allModelData ? allModelData : {};
          });
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
  setIrocvColumn(tData){
    tData.irTest = tData.irTest && tData.irTest ? true : false;
    tData.ocvTest = tData.ocvTest && tData.ocvTest ? true : false;
  }
}