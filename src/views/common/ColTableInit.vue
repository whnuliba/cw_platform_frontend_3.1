<template>
  <el-dialog title="字段选择" v-el-drag-dialog :visible.sync="dialogSelectFieldVisible" width="700px">
    <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

      <template>
        <el-transfer v-model="selectColumn.fields"
                     :titles="['源字段', '目标字段']"
                     :data="selectColumn.colMap"></el-transfer>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveSelectField()"> {{ $t("common.btn.submit") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  export default {
    name: "Test",
    directives: { waves, elDragDialog },
    props: {
      cols: Array,
      table_mark: String
    },
    data() {
      return {
        dialogSelectFieldVisible: false,
        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        selectViewCol: [],
      }
    },
    methods: {
      initCols(){
        this.initCustomVol(data=>{
          if(data && data.length>0){
            let fds = data.map(c=>c.item)
            this.cols.forEach(item=>{
              if(fds.indexOf(item.field)>=0){
                item.hide = false
              }else{
                item.hide = true
              }
            })
          }
        })
      },
      saveSelectField() {
        const fields = {}
        let arr = []
        this.selectViewCol.length = 1
        this.selectColumn.fields.forEach(item => {
          if (this.selectColumn.origin[item]) {
            fields[item] = this.selectColumn.origin[item]
            arr.push({item: item})
            this.selectViewCol.push(item)
          }
        })

        if (this.selectColumn.fields.length == 0) {
          this.$message({
            type: 'info',
            message: '没有选择字段'
          });
          return
        }

        const customColumn = {mark: this.table_mark, userName: sessionStorage.getItem("userInfo"), items: arr}
        const _data = {url: '/custom-item/guest/save', params: customColumn}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.dialogSelectFieldVisible = false
            this.cols.forEach(item => {
              if (this.selectViewCol.indexOf(item.field) >= 0) {
                item.hide = false
              } else {
                item.hide = true
              }
            })
            // location.reload()
            //this.query()
            this.$parent.initSaveCols();
          }).catch(err => {
          console.error(err)
        }).finally(() => {

        })
      },
      initCustomVol(callback) {
        const customColumn = {mark: this.table_mark, userName: sessionStorage.getItem("userInfo")}
        const _data = {url: '/custom-item/guest/query', params: customColumn}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            if (callback && typeof callback == "function") {
              callback(data)
            }
          }).catch(err => {
          console.error(err)
        }).finally(() => {

        })
      },
      selectFields() {
        this.dialogSelectFieldVisible = true
        this.initCustomVol((data) => {
          this.selectColumn.colMap = []
          this.selectColumn.fields = []
          this.selectColumn.origin = {}
          this.selectColumn.fields = data.map(c => c.item)
          this.cols.forEach(item => {
            this.selectColumn.origin[item.field] = item.title
            this.selectColumn.colMap.push({
              key: item.field,
              label: item.title,
              disabled: false
            })
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
