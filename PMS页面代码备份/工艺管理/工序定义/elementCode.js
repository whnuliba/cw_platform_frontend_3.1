{
    created(){
        let _this = this;
        _this.addEventListener('CwButton1', 'click', this.checkParams)
        _this.vueContext['CwForm1'].iform.processeditor.params.template = ''
    },

    mounted(){

    },

    checkParams(){
        let _this = this
        let param = _this.vueContext['CwForm1'].iform.processeditor.params
        let addParam = {
            processName: param.processName ? param.processName : '',
            processCode: param.processCode ? param.processCode : '',
            template: param.template ? param.template : '',
            useState: param.useState ? param.useState : 0,
        }

        if (addParam.processCode == '') {
            this.$message({
                message: this.$t("common.processList.processCodeNotNull"),
                type: 'error'
            })
            return false
        }
        if (addParam.processName == '') {
            this.$message({
                message: this.$t("common.processList.processNameNotNull"),
                type: 'error'
            })
            return false
        }
        let json = { current: 1, pageSize: _this.vueContext['CwCtrlList1'].page.total, requestData: {} };
        let dataTotal = {};
        const _data = { url: "/process/list", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
            if (response) {
                dataTotal = response.data.map(item => item.processCode);
                if (dataTotal.includes(addParam.processCode)) {
                    this.$message({
                        message: this.$t("common.processList.processCodeNotSame"),
                        type: 'error'
                    })
                } else {
                    this.addAjax(addParam)
                }
            } else {
                this.$message({
                    message: this.$t("common.btn.addError"),
                    type: 'error'
                })

            }
        });
    },
    addAjax(addParam) {
        let _this = this
        const _data = { url: '/process/add', params: { data: addParam } }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            if (data) {
                this.$message({
                    message: this.$t("common.btn.addSuccess"),
                    type: 'success'
                })
                _this.vueContext['CwDialogPanel1'].dialogVisible = false

                let json = { current: 1, pageSize: 15, requestData: {} };
                this.initList(json);
            } else {
                this.$message({
                    message: this.$t("common.btn.addError"),
                    type: 'error'
                })
            }
        })
    },
    initList(json) {
        let _this = this
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const _data = { url: "/process/list", params: json };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
            _this.vueContext['CwCtrlList1'].data = response.data;
            _this.vueContext['CwCtrlList1'].page.total = response.total;
            loading.close()
        });
    },
}
