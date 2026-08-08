<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item  v-for="item in selectLang" :disabled="language===item.language" :command=item.language>
        {{item.languageName}}
      </el-dropdown-item>
      <!-- <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item> -->
      <!-- <el-dropdown-item :disabled="language==='es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ja'" command="ja">
        日本語
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  props:{
     langArgs: {
      type: Object,
      default: () => { return {type:'page'} }
    }   
  },
  data(){
     return {
      selectLang :[
       {language:'zh',languageName:'中文'},
       {language:'en',languageName:'English'}
      ]
     }

  },
  created(){
      let langUtil= this.commonUtils
      if(langUtil && langUtil.getGlobalParameters('selectLang')){
         this.selectLang = langUtil.getGlobalParameters('selectLang')
      }
  },
  methods: {
    handleSetLanguage(lang) {
      console.log(lang)
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      let that = this
      // this.$message({
      //   message: that.commonI18n('选择语言成功'),
      //   type: 'success'
      // })
       if(this.langArgs && this.langArgs.type==='page'){
        const  code  =   localStorage.getItem("current_application_code")
        this.$store.dispatch("permission/sysChange",code)
       //获取按钮权限
        this.$store.dispatch('permission/get_button', code)  
       }
    }
  }
}
</script>
