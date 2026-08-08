<template>
  <div class="app-container">
    <div class="filter-container">
       <el-form :label-position="labelPosition" label-width="110px" :model="addParam" style="display:inline">

        <p>{{translateText('basicInfo')}}</p>
        <hr>

        
        <el-row>
          <el-col :span="24">
            <el-form-item :label="translateText('fromLocId')" :rules="[{ required:true, message: translateText('fromLocId')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  :filterable="true" v-model="addParam.fromLocId" style="width: 100%">
                <el-option v-for="item in initSelect.fromLocId" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
       <el-row>
          <el-col :span="24">
            <el-form-item :label="translateText('matlState')" :rules="[{ required:true, message: translateText('matlState')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.fromMatlState" style="width: 100%">
                <el-option v-for="item in initSelect.fromMatlState" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="translateText('matlCateId')" :rules="[{ required:true, message: translateText('matlCateId')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.matlCateId" style="width: 100%">
                <el-option v-for="item in initSelect.matlCateId" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="translateText('routeCode')" :rules="[{ required:true, message: translateText('routeCode')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.routeCode" style="width: 100%">
                <el-option v-for="item in initSelect.routeCode" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="translateText('pltCode')" :rules="[{ required:true, message: translateText('pltCode')+$t('const.cannotNull'), trigger: 'blur' }]">
              <el-input v-model="addParam.pltCode" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" span="100" style="text-align:right">
        <el-button @click="cancelDia">{{$t('common.btn.reset')}}</el-button>
        <el-button type="primary" @click="submit">{{$t('common.btn.submit')}}</el-button>
      </div>
    </div>
  </div>

</template>


<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' 
import i18n from '@/lang'
export default {
  name: 'pda',
  components: { Pagination },
 directives: { waves, elDragDialog },
  data() {
    
    const _initdata = {
      dialogFormVisible: false,
      queryParams: {
        requestData: { }
        },
        textI18n:{
          basicInfo:{zh:'基本信息',en:"Basic info"},
          fromLocId:{zh:'起始位置',en:"FromLocId"},
          matlState:{zh:'电池状态',en:"MatlState"},
          matlCateId:{zh:'物料类型',en:"MatlCateId"},
          routeCode:{zh:'路线选择',en:"RouteCode"},
          pltCode:{zh:'托盘条码',en:"PltCode"},
        },
      initSelect: {
         matlCateId: [],
         fromLocId: [],
         fromMatlState: [],
         routeCode:[],
      },
      
      defaultForm: {
        row: {},
        params: {
         id: '',
         roadId: ''
        }
      },
      allLoc: [],
      allFromFind: [],
      allToFind: [],
      locType: 5,
      list: null,
      labelPosition: 'right',
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      addParam: {
        pltCode:undefined,
        matlCateId: '',
        fromLocId: '',
        fromMatlState: '',
        routeCode:undefined,
      },
    }
    return _initdata
  },
  created() {
    this.selectOptions()
  },
  mounted()
  {
    
  },
  methods: {
      translateText(type){
        return this.textI18n[type][this.$store.state.app.language];
      },
         initData(arr) {
       const args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
          return args
        },
        commonFilter(value, type) {
           if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
              return this.getValueConvert(this.initSelect[type], value)
            }
           if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
             return this.initSelect[type][value]
           }
           return value
      },

    getValueConvert(arr, value) {
          for (const v of arr) {
            if (v.value == value) {
                return v.label
              }
        }
        return value
    },
  submit() {
       const _data = { url: '/api/Pda/pltOnlineByPda', params: {
          data: this.addParam
       }}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message:  this.$t('common.btn.submitSuccess')
                  })
                  this.dialogFormVisible = false
              }).catch(err => {
            
              })
  },
   reset() {
     for (const p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = ''
        }
     }
   },
   cancelDia(){
        this.resetLoc(true);
    },
   resetLoc(val){
     //var ret = this.allLoc;
      //if(!val)
     var  ret = [];
     //this.initSelect=ret
      this.addParam.pltCode= undefined
      this.addParam.matlCateId = undefined
      this.addParam.fromLocId = undefined
      this.addParam.fromMatlState = undefined
   },
   selectOptions() {
       
       //获取起始站台
       let _data={ url: '/api/Cache/StaInfo', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.fromLocId = data.map(c => {
             return {
               label: c.staName,
               value: c.staId
             }
           })
       }).catch(err => {
          console.error(err)
       }),

       // 获取路线选择类型
       _data = { url: '/api/Cache/RouteInfo', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.routeCode = data.map(c => {
             return {
               label: c.name,
               value: c.id
             }
           })
       }).catch(err => {
          console.error(err)
       }),


       // 获取电芯类型
       _data = { url: '/api/Cache/MatlCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.matlCateId = data.map(c => {
                  return {
                    label: c.matlCateName,
                    value: c.matlCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
         
            // 获取位置
       _data = { url: '/api/Cache/LocInfo', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.allLoc = data.map(c => {
                  return {
                    label: c.locName,
                    value: c.locId,
                    locType: c.locType
                  }
                })
                this.allLoc = this.allLoc.filter(f=>f.locType != 4)
                this.initSelect.toLocId = this.allLoc;
                this.initSelect.fromLocId = this.allLoc;
            }).catch(err => {
                console.error(err)
            }),
                      // 获取电池状态
       _data = { url: '/api/Cache/MatlState', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromMatlState = data.map(c => {
                  return {
                    label: c.stateName,
                    value: c.stateNum
                  }
                }),
                this.initSelect.toMatlState = data.map(c => {
                  return {
                    label: c.stateName,
                    value: c.stateNum
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      },
       // 保存新增
   save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: '/api/Job/AddCarryRoad', params: { data: this.defaultForm.params }}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>' + data
                  })
                  this.dialogFormVisible = false
              }).catch(err => {
                  console.error(err)
              }).finally(() => {
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  })
          }
        })
   }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}

</style>
