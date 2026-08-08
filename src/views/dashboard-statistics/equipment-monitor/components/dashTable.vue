<template>
  <div class="scroll-board" style="cursor: default;margin-left:20px;display:flex;">
    <div  v-for="(it,i) in rankingData" :key="i+'defu'">
        <div class="table-header table-row">
          <div class="table-cell serial_img">
            <img :src="it.url_img" alt="">
          </div>
          <div class="table-cell">{{it.title}}</div>
        </div>
      <div class="table-body">
        <div :class="{ 'scroll-wrap': it.getPlayData.length > 0 }">
          <div
            class="table-row"
            v-for="(item, index) in it.getPlayData"
            :class=" [index % 2 === 0 ? 'sinBgc' :  'hasBgc'] "
            :key="index"
            :ref="'row_' + index"
          >
            <div class="table-cell serialno" style="width: 8%">
              <span class="bgserialno">{{index}}</span>
            </div>
            <div class="table-cell" style="width: 23%">{{ item.a }}</div>
            <div class="table-cell" style="width: 23%">{{ item.c }}</div>
            <div class="table-cell" style="width: 23%">{{ item.d }}</div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
      },
    },
  },
  data() {
    return {
      initMt: 0,
      rankingData:[
        {
          title: '设备号排行榜',
          url_img: require('@/assets/dashboard_img/warn.png'), 
          getPlayData:[
            {a:'voda1',b:1,c:'自处理',d:'完成',},
            {a:'voda2',b:1,c:'发起维修',d:'待查',},
            {a:'voda3',b:1,c:'发起维修',d:'完成',},
            {a:'voda4',b:1,c:'自处理',d:'待查',},
            {a:'voda5',b:1,c:'发起维修',d:'完成',},
            {a:'voda6',b:1,c:'自处理',d:'待查',},
            {a:'voda7',b:1,c:'发起维修',d:'待查',},
            {a:'voda8',b:1,c:'发起维修',d:'完成',},
            {a:'voda9',b:1,c:'自处理',d:'待查',},
            {a:'voda10',b:1,c:'发起维修',d:'待查',},
            ]
        },
        {
          title: '故障排行榜',
          url_img: require('@/assets/dashboard_img/header.png'),
          getPlayData:[
            {a:'voda11',b:1,c:'自处理',d:'完成',},
            {a:'voda12',b:1,c:'发起维修',d:'待查',},
            {a:'voda13',b:1,c:'发起维修',d:'完成',},
            {a:'voda14',b:1,c:'自处理',d:'待查',},
            {a:'voda15',b:1,c:'发起维修',d:'完成',},
            {a:'voda16',b:1,c:'自处理',d:'待查',},
            {a:'voda17',b:1,c:'发起维修',d:'待查',},
            {a:'voda18',b:1,c:'发起维修',d:'完成',},
            {a:'voda19',b:1,c:'自处理',d:'待查',},
            {a:'voda20',b:1,c:'发起维修',d:'待查',},
            ]
        },
        {
          title: '常见故障排行榜',
          url_img: require('@/assets/dashboard_img/train.png'),
          getPlayData:[
            {a:'voda21',b:1,c:'自处理',d:'完成',},
            {a:'voda22',b:1,c:'发起维修',d:'待查',},
            {a:'voda23',b:1,c:'发起维修',d:'完成',},
            {a:'voda24',b:1,c:'自处理',d:'待查',},
            {a:'voda25',b:1,c:'发起维修',d:'完成',},
            {a:'voda26',b:1,c:'自处理',d:'待查',},
            {a:'voda27',b:1,c:'发起维修',d:'待查',},
            {a:'voda28',b:1,c:'发起维修',d:'完成',},
            {a:'voda29',b:1,c:'自处理',d:'待查',},
            {a:'voda30',b:1,c:'发起维修',d:'待查',},
            ]
        },
        {
          title: '故障位置排行榜',
          url_img: require('@/assets/dashboard_img/fault.png'),
          getPlayData:[
            {a:'voda31',b:1,c:'自处理',d:'完成',},
            {a:'voda32',b:1,c:'发起维修',d:'待查',},
            {a:'voda33',b:1,c:'发起维修',d:'完成',},
            {a:'voda34',b:1,c:'自处理',d:'待查',},
            {a:'voda35',b:1,c:'发起维修',d:'完成',},
            {a:'voda36',b:1,c:'自处理',d:'待查',},
            {a:'voda37',b:1,c:'发起维修',d:'待查',},
            {a:'voda38',b:1,c:'发起维修',d:'完成',},
            {a:'voda39',b:1,c:'自处理',d:'待查',},
            {a:'voda40',b:1,c:'发起维修',d:'待查',},
            ]
        },
      ],
      visible: true,
      stop: false,
    };
  },
  methods: {
    // play() {
    //   const row = this.$refs["row_0"][0];
    //   setTimeout(() => {
    //     this.visible = false;
    //     this.$nextTick(() => {
    //       this.initMt++;
    //       if (this.initMt === this.data.length) {
    //         this.initMt = 0;
    //       }
    //       this.visible = true;
    //     });
    //     this.play();
    //   }, 2000);
    // },
  },
  watch: {},
  computed: {
    getPlayData() {
      // return this.data.concat(this.data.slice(0, 4));
    },
  },
  mounted() {
    // this.play();
  },
};
</script>
<style lang="scss" scoped>
$cellHeight: 35px;
.scroll-board{
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 20px;
    // width: 25%;
    height: 100%;
    overflow: hidden;
    >div {
      width: 25%;
      margin-right: 5px;
    }
}
.table-row {
  display: flex;
  line-height: 35px;
  height: 35px;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(63, 88, 114, 1);
}
.table-header {
  border:1px solid #666;
  color: white;
  display: flex;
  justify-content: center;
}
.table-cell {
  text-align: center;
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.serial_img{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    display: block;
    margin-right:5px;
    width:90%;
    height:90%;
  }
  
}
.hasBgc {
  background: rgba(0, 44, 81, 0.8);
}
.sinBgc {
  background:rgba(10, 29, 50, 0.8);
}
.hidden-row {
  height: 0 !important;
  line-height: 0 !important;
  display: none !important;
}
.table-body {
  height: 100%;
  overflow-y: hidden;
  .table-row {
    color: #fff;
  }
}
.scroll-wrap {
  animation: scroll 18s linear infinite;
  position: relative;
}
.scroll-wrap:hover {
  animation-play-state: paused;
}
.bgserialno{
  background-color: #1981f6;
  padding:2px
}
@keyframes scroll {
  from {
    top: 0;
  }
  to {
    top: -8 * $cellHeight;
  }
}
</style>