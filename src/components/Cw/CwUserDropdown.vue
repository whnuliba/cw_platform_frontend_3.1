  <template>
    <div>
        <!-- <input type="hidden" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" /> -->
        <!-- <input type="text" v-bind="$attrs" v-model="internalValue" @input="$emit('input', $event.target.value)">  v-model="value"  @input="$emit('input', $event.target.value)"  -->
        <el-input ref="cwInput" v-popover:popover v-bind="$attrs"  v-on="$listeners" readonly suffix-icon="el-icon-arrow-down" :itemStyle="itemStyle">
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
        <CwSelectUser ref="cwSelectUser" :checkType="selectRange" :radio="radio" :orgType="orgType"></CwSelectUser>
        <div style="text-align: right; margin: 0;margin-top: 15px;">
        <el-button size="mini" type="text" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="handleConfirm">确定</el-button>
        </div>
      </el-popover>
    </div>
  </template>
  <script>
    import elDragDialog from "@/directive/el-drag-dialog";
    import CwSelectUser from "@/components/Cw/CwSelectUser";
    export default {
      name: 'CwUserDropdown',
      components: {CwSelectUser},
      directives: { elDragDialog },
      filters: {},
      props: {
         initValue: {
            type: Array,
            default: () =>[]
         },
         initId: {
            type: String,
            default: () =>undefined
         },
         radio:Function,
         selectRange: {
            type: Array,
            default: () => {
                return [300]
            }
        },
        selectColumn:{
           type:String,
           default:()=>'id'
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
        },
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
            visible: false,

        }
  
        return _initdata
      },
      created() {
        console.log(this.selectColumn)
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
                this.initValue.length=0
                usernames.map(c=>this.initValue.push(c.id))
            }else{
                this.label = ''
                 this.id = ''
                 this.code= ''
            }
        },
        handleConfirm(){
            this.createResultValue()
            let usernames = this.$refs.cwSelectUser.usernames
            this.$refs.cwSelectUser.userIdList= usernames.map(c=>c.id)
            this.$emit('onChange', {name:this.label,id:this.id,code:this.code})
            this.$emit('input', this[this.selectColumn])
            //this.$emit('input', this.id)
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