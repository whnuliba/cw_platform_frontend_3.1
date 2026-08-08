{
  created(){
    let _this = this;
  },
  mounted(){
    let _this = this;
    // this.addEventListener('canvas','click', (event,detail,eventSelectItem) => {
    //   this.onCodeCanvasClick(event, _this, eventSelectItem)
    // });
    setInterval(() => {
      this.testchange(_this)
    }, 3000);
    


  },
  onCodeCanvasClick(event, _this, eventSelectItem) {
    if(eventSelectItem && _this.vueContext){
      _this.vueContext['CwDialogPanel1'].dialogVisible = true
    }
  },
  testchange(_this){
    _this.componentData.forEach((item,index)=>{
      if(item.onCanvas == true){
        console.log('testchange',item.styles)

        item.styles.fillColor = this.getRandomColor();
      }
    })
  },
  getRandomColor() {
    return '#' + Math.floor(Math.floor(Math.random() * 0xffffff)).toString(16).padStart(6, '0');
  }

}