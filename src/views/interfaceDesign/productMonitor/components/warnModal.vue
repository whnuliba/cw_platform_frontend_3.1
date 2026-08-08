<!--
  文件描述：无缝滚动组件
-->
<template>
  <div class="warnModal" :style="{height: '100%'}">
    <el-row :style="{height: '100%'}">
      <el-col :span="3" class="title"><span>系统消息展示</span></el-col>
      <el-col :span="20" >
        <div :style="{ display: 'flex', 'justify-content': 'right', margin: '0px 20px' }" style="padding: 0px">
          <div class="radiobox">
            <span>错误:</span>
            <el-switch
              v-model="value1"
              class="switchStyle"
              active-color="RGB(64,158,24)"
              inactive-color='#C0C0C0'
              @change="value1Change">
            </el-switch>
          </div>
          <div class="radiobox">
            <span>警告:</span>
            <el-switch
              v-model="value2"
              active-color="RGB(64,158,24)"
              inactive-color="#C0C0C0"
              @change="value2Change">
            </el-switch>
          </div>
          <div class="radiobox">
            <span>信息:</span>
            <el-switch
              v-model="value3"
              active-color="RGB(64,158,24)"
              inactive-color="#C0C0C0"
              @change="value3Change">
            </el-switch>
          </div>
          <!-- <el-button type="primary" @click="clear" size="small">清空</el-button> -->
    </div>
      </el-col>
      <el-col :span="24" :style="{height: '85%'}">
        <el-table
              :height="upArea.height"
              :data="listData"
              class="swiper-page-table"
              ref="table"
              :row-class-name="tableRowClassName"
              style="width: 100%">
                <el-table-column
                  label="消息类型"
                  width="100" align="center">
                  <template slot-scope="{row}">{{row['MessageLevel'] | formatMessageLevel}}</template>
                </el-table-column>
                <el-table-column
                  label="日期"
                  width="180">
                  <template slot-scope="{row}">{{row['SendTime'] | formatTimer}}</template>
                </el-table-column>
                <el-table-column
                  prop="NoticeFrom"
                  label="来源"
                  width="350">
                </el-table-column>
                <el-table-column
                  prop="MessageText"
                  label="信息">
                </el-table-column>
            </el-table>
      </el-col>
      
    </el-row>
 
    <!-- <div class="page-example3">

            <ul class="ul-scoll">
                <li v-for="(item, index) in listData" :key='index' :style="item.MessageLevel ===3?{'color' : '#F56C6C'} : item.MessageLevel ===2?{'color': '#E6A23C'} : {'color' : '#909399'}">
                    <span class="date">{{item.SendTime  | formatTimer}}</span>&nbsp;
                    <span class="from">{{item.NoticeFrom}}: </span>&nbsp;
                    <span class="title">{{item.MessageText}}</span>
                </li>
            </ul> -->
           
    <!-- </div>  -->
  </div>
</template>

<script>
  // import vueSeamlessScroll from 'vue-seamless-scroll'
  // import mqtt from 'mqtt' // 引入mqtt模块
  const ipSettings = {
    title: 'global_ip',
    wcsIp: 'http://10.3.200.214:5004',
  }
  // import configl  from "../../../../vue.config.js"
  // import API_CONFIG from "../../../../vue.config.js";
  export default {
      name: 'sendTextNotice',
      components: {
          // vueSeamlessScroll
      },
      props:{
        upArea:Object,
      },
      watch:{
        upArea: function (val) {
          console.log(val)
        }
      },
      data() {
          // 这里存放数据
          return {
            client: null,
            options: {
              connectTimeout: 10, // 超时时间
              clientId: 'browser', // id
              username: '123', // 用户名
              password: '456', // 密码
              cleanSession: true,
              keepAlive: 30 // 心跳值，心跳值太大可能会连接不成功，这个参考文档
            },
            subscription: {
              topic: 'Topic/Notice/Error',
              qos: 0
            },
              listData: [],
              value1: true,
              value2: false,
              value3: false,
          }

      },
      // 监听属性 类似于data概念
      computed: {
          defaultOption () {
              return {
                  step: 1.1, // 数值越大速度滚动越快
                  limitMoveNum: 15, // 开始无缝滚动的数据量 this.dataList.length
                  hoverStop: true, // 是否开启鼠标悬停stop
                  direction: 1, // 0向下 1向上 2向左 3向右
                  openWatch: false, // 开启数据实时监控刷新dom
                  singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                  singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                  waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
              }
          }

      },
      filters: {
        formatTimer: function(value) {
          let date = new Date(value);
          let y = date.getFullYear();
          let MM = date.getMonth() + 1;
          MM = MM < 10 ? "0" + MM : MM;
          let d = date.getDate();
          d = d < 10 ? "0" + d : d;
          let h = date.getHours();
          h = h < 10 ? "0" + h : h;
          let m = date.getMinutes();
          m = m < 10 ? "0" + m : m;
          let s = date.getSeconds();
          s = s < 10 ? "0" + s : s;
          return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        },
        formatMessageLevel: function(val){

          const statusMap = {
            1: '信息',
            2: '警告',
            3: '错误'
          }
          return statusMap[val]
        }
      },
      // 方法集合
      methods: {
        // doConnected () {
        //   console.log('开始创建连接')
        //   try {
        //     // let host = '10.3.8.126'//window.location.host;
        //     // let port = '5004'//window.location.port;
        //     let ip = ipSettings.wcsIp;
        //     let protocol = window.location.protocol;
        //     // let ws = '';
        //     if(protocol==='http:')
        //       //  ws = 'ws'
        //        ip = ip.replace(/http/,"ws");
        //     if(protocol==='https:')
        //       //  ws = 'wss'
        //        ip = ip.replace(/https/,"wss");
        //     // console.log(ip)
        //     // this.client = mqtt.connect(`${ws}://${host}:${port}/mq`, this.options)
        //     this.client = mqtt.connect(`${ip}/mq`, this.options)
        //   } catch (error) {
        //   }
        //   // 接收消息处理
        //   this.client.on('message', (topic, message) => {
        //     this.listData.push(JSON.parse(message.toString()))
        //     if (this.listData.length>200){
        //       this.listData.splice(0,100)
        //     }
        //   })
        //   // 连接错误处理
        //   this.client.on('error', (error) => {
        //   })
        //   // 重新连接处理
        //   this.client.on('reconnect', () => {
        //   })
        // },
        doDisconnected () {
          try {
            // this.doUnSubscribe('Topic/Notice/Info')
            // this.doUnSubscribe('Topic/Notice/Error')
            // this.doUnSubscribe('Topic/Notice/Warn')
            this.client.on('close', (error) => {
              this.client.end()
            })
            console.log('断开连接')
          } catch (error) {
            console.log('断开连接失败: ', error.toString())
          }
        },
        doSubscribe (topic) {
          //const { topic, qos } = this.subscription
          console.log('订阅'+topic)
          this.client.subscribe(topic, 0, (error) => {
            if (!error) {
            } else {
              console.log('订阅失败', error)
            }
          })
        },

        doUnSubscribe (topic) {
          console.log('取消订阅' +topic)
          this.client.unsubscribe(topic, error => {
            if (error) {
              console.log('取消订阅失败', error)
            }
          })
        },
        value1Change(value){
          if (value == false){
            this.doUnSubscribe('Topic/Notice/Error')
          }
          else
            this.doSubscribe('Topic/Notice/Error')
        },
        value2Change(value){
          if (value == false){
            this.doUnSubscribe('Topic/Notice/Warn')
          }
          else
            this.doSubscribe('Topic/Notice/Warn')
        },
        value3Change(value){
          if (value == false){
            this.doUnSubscribe('Topic/Notice/Info')
          }
          else
            this.doSubscribe('Topic/Notice/Info')
        },
        // checkboxchange(val)
        // {
        //   console.log(val)
        // }
        clear(){
          this.listData.splice(0,(this.listData.length))
        },

        tableScroll(){
          const table = this.$refs.table;
          // 拿到表格中承载数据的div元素
          const divData = table.bodyWrapper;
          // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
          divData.scrollTop = divData.scrollHeight;
          // setInterval(() => {
          //   // 元素自增距离顶部1像素

          //   // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          //   // if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          //   //   // 重置table距离顶部距离
          //   //   divData.scrollTop = 0;
          //   // }
          // }, 30);  // 滚动速度
          },
          tableRowClassName({row, rowIndex}) {
            if (row.MessageLevel==1){
              return 'info-row';
            }else if (row.MessageLevel ==2 ){
              return 'warn-row';
            }else if (row.MessageLevel == 3) {
              return 'error-row';
            }
            return '';
          },
      },
      watch: {
        'listData'(val){
          this.tableScroll()
        }
      },
      created() {
      },
      Destroyed(){
        this.doDisconnected()
      },
      // 生命周期 - 挂载完成（可以访问DOM元素）
      mounted() {
        // this.doConnected()
        // this.doSubscribe('Topic/Notice/Error')
      }
  }
</script>

<style lang='less' scoped>
.title{
  margin-left: 20px;
  height: 33px;
  line-height: 33px;
}
.radiobox{
  margin-top: 5px;
  margin-bottom: 8px;
}
  /* //@import url(); 引入公共css类
  .page-example3{
      width: 1600px;
      height: 750px;
      overflow: hidden;
      //border: 1px solid #283dff;
      .ul-scoll{
          li{
              margin: 6px;
              padding: 5px;
              color: hsl(0, 0%, 0%);

          }
          span{
            margin-right: 15px;
          }
          // .date{ display:inline-block; width: 150px;}
          // .from{ display:inline-block; width: 300px;}
          // .title{ display:inline-block; width: 1000px;}
      }
  }   */
  .el-switch {
    padding: 5px;
  }

  /* // .app-container {
  // // 去除滚动的滚动条
  //    ::v-deep .el-table--scrollable-y .el-table__body-wrapper{
  //   overflow-y: hidden;
  // }
  //} */
  .el-table .info-row {
    color: rgb(11, 155, 23);
  }
  .el-table .error-row {
    color: rgb(226, 36, 36);
  }
  .el-table .warn-row {
    color: rgb(240, 168, 0);
  }

</style>
