  <template>
    <div>
        <!-- <input type="hidden" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" /> -->
        <!-- <input type="text" v-bind="$attrs" v-model="internalValue" @input="$emit('input', $event.target.value)">  v-model="value"  @input="$emit('input', $event.target.value)"  -->
        <!-- <el-input ref="cwInput" v-bind="$attrs" v-show="false" v-on="$listeners" readonly suffix-icon="el-icon-arrow-down"></el-input> -->
        <el-input ref="cwInput" v-popover:popover  v-bind="$attrs"  v-on="$listeners" readonly suffix-icon="el-icon-arrow-down">
         </el-input>
        <el-popover
        ref="popover"
        @show="handleClick"
        @hide="clearSelect"
        v-model="visible"
        placement="bottom"
        :visible-arrow="false"
        :open-delay="0"
        trigger="click">
        <CwFilterSelect ref="cwSelectUser" :checkType="selectRange" :radio="radio" 
        :orgType="orgType" 
        :loadData="loadData"
        :lazy="lazy"
        :url="url"
        ></CwFilterSelect>
        <div style="text-align: right; margin: 0;margin-top: 15px;">
        <el-button size="mini" type="text" @click="handleCancel">{{commonI18n('Cancel')}}</el-button>
        <el-button type="primary" size="mini" @click="handleConfirm">{{commonI18n('Confirm')}}</el-button>
        </div>
      </el-popover>
    </div>
  </template>
  <script>
    import elDragDialog from "@/directive/el-drag-dialog";
    import CwFilterSelect from "@/components/Cw/CwFilterSelect";
    export default {
      name: 'CwFilterSelectDropdown',
      components: {CwFilterSelect},
      directives: { elDragDialog },
      filters: {},
      props: {
         initValue: {
            type: Array,
            default: () =>[]
         },
         selectColumn:{
           type:String,
           default:()=>'id'
         },
         loadData:Function,
         initId: {
            type: String,
            default: () =>undefined
         },
         radio:Function,
         lazy:{
        type: Boolean,
        default :()=>{
            return false
              }
          },
          showFilterInput:{
              type: Boolean,
              default :()=>{
                  return true
              }
          },
         selectRange: {
            type: Array,
            default: () => {
                return [100]
            }
        },
        url:{
              type: String,
              default :()=>{
                  return undefined
              }
          },        
        orgType: {
            type: Number,
            default: () => {
                return 300
            }
        },
        itemStyle: {
          type: Object,
          default: () => {
            return {}
          }
        },
      },
      watch: {
        initValue :{
            handler: function (newVal, oldVal) {
               if(newVal===null || newVal===undefined || newVal.length===0 || newVal[0]==='')
                 {
                    this.label=''
                 }
            },
            deep: true
        } ,
        itemStyle: {
          handler: function (newVal, oldVal) {
            if (newVal) {
              for (let i in newVal) {
                this.$refs.cwInput.$refs.input.style[i] = newVal[i]
              }
            }
          },
          deep: true
        }
  
      },
      data() {
        const _initdata = {
            // label:'',
            label: undefined,
            value: undefined,
            id:undefined,
            code: undefined,
            data: undefined,
            visible: false,

        }
  
        return _initdata
      },
      created() {
      },
      updated(){

      },
      mounted() {
        //this.$refs.cwSelectUser.userIdList = this.initValue
         //this.handleClick()    
         this.handleClick()  
      },

      methods: {
        clearSelect(){
            this.$refs.cwSelectUser.usernames.length=0
        },
        handleClick(){
            this.$refs.cwSelectUser.filterUserName=null
            this.$refs.cwSelectUser.usernames.length=0
            this.$refs.cwSelectUser.userIdList = this.initValue
            this.$refs.cwSelectUser.initData((data)=>{
                this.createResultValue()
            })
        },
        handleCancel(){
          this.visible=false
        },
        createResultValue(){
            let usernames = this.$refs.cwSelectUser.usernames
            if(usernames && usernames.length){
                this.label = usernames.map(c=>c.name).join(",")
                this.id = this.value = usernames.map(c=>c.id).join(",")
                this.code= usernames.map(c=>c.code).join(",")
                this.data= usernames.map(c=>c.data)
                this.initValue.length=0
                usernames.map(c=>this.initValue.push(c.id))
            }
        },
        handleConfirm(){
            this.createResultValue()
            let usernames = this.$refs.cwSelectUser.usernames
            this.$refs.cwSelectUser.userIdList= usernames.map(c=>c.id)
            this.$emit('input', this[this.selectColumn])
            this.$emit('onChange', {name:this.label,id:this.id,code:this.code,data:this.data})
            this.visible=false
        }
      }
    }
  
  </script>
  
  <style lang="less" scoped>
    .container_left {
      float: left;
      width: 25%;
      min-height: 100%;
      border-right: 1px solid rgb(226, 224, 224);
    }
  
    .container_right {
      float: left;
      width: 75%;
      padding-left: 5px;
      border-left: 1px solid rgb(226, 224, 224);
      margin-left: -1px;
      min-height: 100%;
    }
  
    .list_data {
      text-align: center;
      line-height: 30px;
    }
  
    .el-tree {
      padding-top: 15px;
    }
  
    ::v-deep .el-dialog__body {
      height: 500px;
      overflow: auto;
    }

    ::v-deep .el-input__icon {
      line-height: 100%;
    }
  </style>