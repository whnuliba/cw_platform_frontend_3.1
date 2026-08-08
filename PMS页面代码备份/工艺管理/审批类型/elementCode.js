
{
    created(){
        let _this = this;
    },
    mounted(){
        let _this = this;
        this.addEventListener('CwButton1', 'click', this.onSubmitAdd)
        this.addEventListener('CwButton2', 'click', this.onSubmitReset)
        this.addEventListener('CwButton3', 'click', this.addUser)

    },
    addUser(){
        let _this = this
        this.$nextTick(() => {
            let addApprovalUser = {
                userId: _this.vueContext['CwSelect1'].value,
                bizId: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].id,
                bizCode: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].bizCode,
                bizName: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].bizName
            }
            _this.vueContext['CwDesignTable1'].dataLoading = true;
            const _data = { url: '/approval/adduser', params: { data: addApprovalUser } }
            this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                if (data) {
                    this.$message({
                        message: this.$t('common.todo.approver_add_success'),//'新增审批人成功！',
                        type: 'success'
                    })
                    this.initApprovalUser()
                }
                _this.vueContext['CwDesignTable1'].dataLoading = false;
            }).catch((error) => {
                console.log(error)
                _this.vueContext['CwDesignTable1'].dataLoading = false;
            })
        })

    },
    initApprovalUser() {
        let _this = this
        const _data = {
            url: '/approval/guest/approval-getuser', params: {
                current: 1,
                pageSize: 15,
                data: _this.vueContext['CwCtrlList1'].dataObtainedByEditor['rowTableData'].bizCode
            }
        }
        let thisPara = this;
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            data.forEach(function (d, i) {
                let userdata = _this.vueContext['CwSelect1'].dataObtainedByEditor['userdata']
                let u = _this.filterUser(userdata, d.userId);
                if (u != undefined) {
                    d["realName"] = u.realName;
                    d["userName"] = u.userName;
                } else {
                    d["realName"] = '';
                    d["userName"] = '';
                }
            });
            _this.vueContext.CwDesignTable1.data = data
        })
    },
    filterUser(us, id) {
        for (let i in us) {
            if (us[i].id == id) {
                return us[i]
            }
        }
    },
    onSubmitReset(){
        let row = this.vueContext['CwForm1'].iform.processeditor.params
        for (let i in row) {
            if (i !== 'id') {
                row[i] = ''
            }
        }
    },
    onSubmitAdd() {
        let _this = this
        let addData = _this.vueContext['CwForm1'].iform.processeditor.params
        if (_this.checkParam() != null) {
            _this.$message({
                message: _this.checkParam(),
                type: 'error'
            })
            return false;
        }
        let json = { data: addData }
        const _data = { url: '/approval/add', params: json }
        _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
            if (response == 'OK') {
                this.$message({
                    message: this.$t('common.tip_info.success_add_info') ,//'增加成功！',
                    type: 'success'
                })
                this.vueContext['CwDialogPanel1'].dialogVisible = false
                this.initList({
                    current: 1,
                    pageSize: 15
                })
            }
        }))
    },
    checkParam(){
        let _this = this
        let addData = _this.vueContext['CwForm1'].iform.processeditor.params
        if (addData.bizName.length < 1) {
            return this.$t('common.todo.null_bizName');//'业务名称为空,请输入！';
        } if (addData.uri.length < 1) {
            return this.$t('common.todo.null_uri'); //'地址模板为空,请输入！';
        }
        return null;
    },
    initList(json) {
        let _this = this
        _this.vueContext['CwCtrlList1'].dataLoading = true
        const _data = { url: '/approval/list', params: json }
        _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
            // _this.tableData = response.data
            // _this.total = response.total
            // _this.listLoading = false
            _this.vueContext['CwCtrlList1'].data = response.data;
            _this.vueContext['CwCtrlList1'].page.total = response.total;
            _this.vueContext['CwCtrlList1'].dataLoading = false;
        }))
    }


}