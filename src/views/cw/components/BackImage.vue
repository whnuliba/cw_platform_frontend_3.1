<template>
  <div>
    <el-form ref="defaultForm.params" :model="itemStyleData" size="mini">
      <el-form-item>
        <!-- <el-input size="mini" v-model="itemStyleData.backgroundImage" /> -->
      </el-form-item>
      <el-form-item>
        <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="3"
           :file-list="fileList">
          <el-button size="mini" plain>上传</el-button>
        </el-upload> -->
        <el-button size="mini" plain @click="dialogVisible = true">选择</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="itemStyleData.backgroundRepeat" placeholder="请选择">
          <el-option v-for="item in repeatOptions" :key="item.value" :label="item.label" :value="item.value"
            @change="handleChange">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="itemStyleData.backgroundAttachment" placeholder="请选择">
          <el-option v-for="item in attachmentOptions" :key="item.value" :label="item.label" :value="item.value"
            @change="handleChange">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="itemStyleData.backgroundPosition" placeholder="请选择">
          <el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value"
            @change="handleChange">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="itemStyleData.backgroundSize" placeholder="请选择">
          <el-option v-for="item in sizeOptions" :key="item.value" :label="item.label" :value="item.value"
            @change="handleChange">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div  v-for="(val, index) in srcList" style=" width: 200px;height: 200px;">
        <el-image 
          style="width: 200px; height: 100px"
          :src="require(`@/assets/resource${val}`)" 
          @click="imageClick(val)"
        >
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let files = '~@'
export default {
  name: "LayerMenu",
  props: {
    itemStyleData: {
      type: Object,
      default: () => {
        return {
          backgroundImage:'',
          backgroundRepeat: 'round',
          backgroundAttachment: 'local',
          backgroundPosition: 'center',
          backgroundSize: 'auto',
          methods:{}
        };
      }
    }
  },
  components: {},
  data() {
    return {
      vueContext:{},
      dialogVisible: false,
      fileList: [],
      repeatOptions: [
        { label: '横向平铺', value: 'repeat-x' },
        { label: '纵向平铺', value: 'repeat-y' },
        { label: '横向纵向平铺', value: 'repeat' },
        { label: '不平铺', value: 'no-repeat' },
        { label: '自动充满容器', value: 'round' },
        { label: '宽高等比例缩放', value: 'space' },
      ],
      attachmentOptions: [
        { label: '固定位置', value: 'fixed' },
        { label: '不滚动', value: 'scroll' },
        { label: '默认', value: 'local' },
      ],
      positionOptions: [
        { label: '水平垂直居中', value: 'center' },
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
        { label: '上对齐', value: 'top' },
        { label: '下对齐', value: 'bottom' },
      ],
      sizeOptions: [
        { label: '真实大小', value: 'auto' },
        { label: '等比例缩放', value: 'cover' },
        { label: '单边缩放置容器大小', value: 'contain' },
      ],
    };
  },
  created() { },
  computed: {
    srcList: function () {
      console.log('开始图片选择')
      const images = []
      const moduleFilesTs = require.context('@/assets/resource/', false, /\.png$/)

      moduleFilesTs.keys().forEach((key) => {
        const imageOptions = key.replace('.', "")
     
        images.push(imageOptions)
      })
      return images
    },
  },
  mounted() {
  },
  methods: {
    handleChange(val) {
      // console.log(val)
    },
    imageClick(val){
     
      
      // this.itemStyleData.backgroundImage = `url(${require('@/assets/resource/6.png')})`
      this.$set(this.itemStyleData, 'backgroundImage', 'url('+require(`@/assets/resource${val}`)+')')
      // this.itemStyleData.backgroundImage = 'url('+require(`@/assets/resource${val}`)+')'
      this.dialogVisible = false
    },
  }
};
</script>
<style lang='less' scoped>
/deep/.elsemenu {
  padding: 0 !important;

  .el-submenu__icon-arrow {
    display: none !important;
  }
}

/deep/.upload-demo {
  display: inline-block;
}

.el-form-item {
  margin-bottom: 2px;
}
</style>

