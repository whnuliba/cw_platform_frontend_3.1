<template>
  <div class="app_container">
    <div class="filter_container">
      <el-input v-model="queryParams.requestData['code']" placeholder="请输入设备号" style="width: 320px" class="filter-item"></el-input>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
    </div>

    <div class="btn_container">
      <div class="btn" :id="item.id" v-for="(item,index) in btn_cols" :key="index" :style="{color:btnisActive == item.id ? 'white':item.color, background:btnisActive == item.id ? item.color:'white'}" @click="handleClick(item)">{{item.label}}({{item.count}})</div>
    </div> 

    <div class="main_container">
      <div class="left_container">
        <div v-for="(item, index) in device_cols" :key="index" style="display:online">
          <div class="rect">
            <div class="rect_text">{{item.title}}</div>
            <div class="rect_text">{{item.code}}</div>
            <div class="rect_color" :style="{background:commonFilter(item.status,'status')}"/>
          </div>
        </div>
      </div>

      <el-divider direction="vertical" class="divider"/>

      <div class="right_container" shadow="always">
        <div class="label">预警信息</div>
        <div
          class="scroll_view"
          @scroll="onScroll"
        >
          <vue-seamless-scroll
            :data="message_cols"
            :class-option="classOption"
            ref="seamlessScroll"
          >
            <ul>
              <li 
                v-for="(item, index) in message_cols" 
                :key="index" 
                :class="{'first-card': scrollTop === 0}"
              >
                <el-card shadow="always">
                  <div class="card_title">{{item.code}}</div>
                  <div class="card_text">{{item.text}}</div>
                </el-card>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>

    </div>
  </div>
  
</template>

<script>
  import vueSeamlessScroll from "vue-seamless-scroll";
  export default {
    name: 'alarmList',
    components: {vueSeamlessScroll },
    directives: {},
    filters: {

    },
    data() {
      return{
        total: 0,
        listQuery: {
          current: 1,
          pageSize: 15,
          pageSizes:[5,10,15,20,100]
        },
        queryParams:{
          requestData:{ }
        },
        btn_cols : [
          { id:'count', label:'总数', count:'200', color:'#6d9eeb'},
          { id:'online', label:'在线', count:'200', color:'#58943e'},
          { id:'offline', label:'离线', count:'200', color:'#666666'},
          { id:'alarm', label:'报警', count:'200', color:'#a61c00'},
        ],
        device_all_cols:[
          {code:"",title:"A36-10118-0010",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:2},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:1},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:1},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:2},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:1},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:2},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
          {code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},{code:"1",title:"设备",status:0},
        ],
        device_cols:[],
        device_online_cols:[],
        device_offline_cols:[],
        device_alarm_cols:[],
        message_cols:[
          {code:"A36-10118-0010",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0011",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0012",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0013",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0014",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0015",text:"The battery barcode is not included in the message you requested."},
          {code:"A36-10118-0016",text:"The battery barcode is not included in the message you requested."}
        ],
        initSelect: {
          status: [{ label: '0', value: '#58943e' }, { label: '1', value: '#666666' }, { label: '2', value: '#a61c00' }]
        },
        btnisActive:'count',
        loading: false,
        scrollTop: 0,
      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        this.startFetchingData();   //定时获取
      })
    },
    watch:{

    },
    computed: {
      classOption() {
        return {
          step: 0.5, // 滚动速度
          limitMoveNum: 5, // 滚动步数
          hoverStop: true, // 鼠标悬停停止
          direction: 1, // 滚动方向 1: 上, 2: 下, 3: 左, 4: 右
          openWatch: true, // 开启监听
          singleHeight: 0, // 单步高度
          singleWidth: 0, // 单步宽度
          waitTime: 1000, // 等待时间
        };
      },
    },
    methods: {
      getList() {
        // 设备信息  
        this.listLoading = true
        // Object.assign(this.queryParams,this.listQuery)
        // const _data = {url:'',params:this.queryParams}
        // this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        // .then(data => {
        //     this.device_all_cols = data.data
        //     this.total = data.total
        //     this.listLoading = false
        // }).catch(err => {
        //     console.error(err)
        // })

        this.device_cols = this.device_all_cols
        this.device_online_cols = []
        this.device_offline_cols = []
        this.device_alarm_cols = []
        this.device_all_cols.map(item => {
          switch (item.status){
            case 0: this.device_online_cols.push(item);break;
            case 1: this.device_offline_cols.push(item);break;
            case 2: this.device_alarm_cols.push(item);break;
          }
        })

        this.btn_cols[0].count = this.device_all_cols.length
        this.btn_cols[1].count = this.device_online_cols.length
        this.btn_cols[2].count = this.device_offline_cols.length
        this.btn_cols[3].count = this.device_alarm_cols.length

        // const result = Object.groupBy(this.device_all_cols, ({ status }) => status);
        // result.map(item =>{
        //   switch (item.status){
        //     case 0: this.device_online_cols.push(item);break;
        //     case 1: this.device_offline_cols.push(item);break;
        //     case 2: this.device_alarm_cols.push(item);break;
        //   }
        // })

        
        // 预警信息
        //this.queryParams = { requestData:{ } };
        // Object.assign(this.queryParams,this.listQuery)
        // const _data = {url:'',params:this.queryParams}
        // this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        // .then(data => {
        //     this.message_cols = data.data
        //     this.total = data.total
        //     this.listLoading = false
        // }).catch(err => {
        //     console.error(err)
        // })
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      commonFilter(value, type) {
        if (
          this.initSelect.hasOwnProperty(type) &&
          typeof this.initSelect[type] != undefined &&
          Array.isArray(this.initSelect[type])
        ) {
          return this.getValueConvert(this.initSelect[type], value);
        }
        if (
          this.initSelect.hasOwnProperty(type) &&
          !Array.isArray(this.initSelect[type]) &&
          this.initSelect[type].hasOwnProperty(value)
        ) {
          return this.initSelect[type][value];
        }
        return value;
      },
      getValueConvert(arr,value){
        for(let v of arr){
          if(v.label == value )
          {
            return v.value
          }
        }
        return value
      },
      handleClick(item){
        let elements = document.getElementsByClassName('btn')
        this.btnisActive = item.id
        switch(item.id){
          case 'alarm':  this.device_cols = this.device_alarm_cols; break;
          case 'offline': this.device_cols = this.device_offline_cols; break;
          case 'online': this.device_cols = this.device_online_cols; break;
          case 'count':this.device_cols = this.device_all_cols; break;
        }
        
      },
      startFetchingData() {
        this.getList();
        this.intervalId = setInterval(() => {
          this.getList();
        }, 30000); // 每30秒执行一次
      },
      stopFetchingData() {
        clearInterval(this.intervalId);
      },
      onScroll() {
        this.scrollTop = this.$refs.scrollView.scrollTop;
        // if (this.scrollTop === 0) {
        //   this.$refs.scrollView.style.backgroundColor = 'red';
        // } else {
        //   this.$refs.scrollView.style.backgroundColor = 'white';
        // }

      },
    }
  }
</script>

<style scoped>
  ::v-deep body {
    overflow: hidden !important;
  }
  .filter_container{
    padding-bottom: 10px;
    .filter-item {
      margin-left: 5px;
    }
  }
  .btn_container{
    width: 100%;
    height: 40px;
    margin: 5px 0 0 5px;
    .btn{
      float: left;
      padding: 5px;
      margin-right: 10px;
      border: 1px solid rgb(161, 160, 157);
    }
    .btn:focus {
      color: white;
    }
    .btn:hover {
      cursor:pointer;
    }
    
  }
  .app_container{
    width: 100%;
    height: 100%;
    padding: 1%;
  }
 
  .main_container{
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
  }
  .left_container{
    flex:8;
    .rect{
      position: relative;
      text-align: center;
      width: 80px;
      height: 50px;
      float: left;
      margin: 7px;
      border: 1px solid rgb(173, 173, 173);
      background-color: rgb(221, 221, 228);
      .rect_text{
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: small;
      }
      .rect_color{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 10px;
      }
    }
  } 
  .divider{
    height: 75vh;
    float: left;
    margin-right: 10px;
  }
  .right_container{
    flex: 2;
    .label{
      height: 50px;
      line-height: 50px;
      padding-left: 5px;
      background-color: #ffe599;
    }
    .scroll_view{
      width: 100%;
      height: 70vh; 
      overflow-y: hidden; 
      ul{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
        padding: 5px;
        transition: ease .5s;
      }
      li{
        width: 100%;
        list-style: none;
        line-height: 25px;
        transition: all .5s;
        cursor: pointer;
        margin-bottom: 5px;
        ::v-deep .el-card__body{
          padding: 10px !important;
        }
        .card_title{
          border-bottom: 0.5px solid rgb(231, 230, 230);
          padding-bottom: 5px;
          color: #910c0c;
          font-weight: 500;
          margin: 5px;
        }
        .card_text{
          padding-top: 5px;
        }
      }
      .first-card {
        ::v-deep .el-card {
          border: 2px solid red;
        }
      }
    }
    
  }
  
</style>
