<template>
  <div class="scroll-board" style="cursor: default;margin-left:20px;">
    <div class="table-header table-row">
      <div class="table-cell serialno" style="width: 8%">#</div>
      <div class="table-cell" style="width: 23%">设备号</div>
      <div class="table-cell" style="width: 23%">报警编码</div>
      <div class="table-cell" style="width: 23%">处置方式</div>
      <div class="table-cell" style="width: 23%">状态</div>
    </div>
    <div class="table-body">
      <div :class="{ 'scroll-wrap': getPlayData.length > 0 }">
        <div
          class="table-row"
          v-for="(item, index) in getPlayData"
          :class=" [index % 2 === 0 ? 'sinBgc' :  'hasBgc'] "
          :key="index"
          :ref="'row_' + index"
        >
          
          <div class="table-cell serialno" style="width: 8%">
            <span class="bgserialno">{{index}}</span>
          </div>
          <div class="table-cell" style="width: 23%">{{ item.a }}</div>
          <div class="table-cell" style="width: 23%">{{ item.b }}</div>
          <div class="table-cell" style="width: 23%">{{ item.c }}</div>
          <div class="table-cell" style="width: 23%">{{ item.d }}</div>
          
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
        return [
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
        ];
      },
    },
  },
  data() {
    return {
      initMt: 0,
      // getPlayData:[
        
      // ],
      visible: true,
      stop: false,
    };
  },
  methods: {
    
    play() {
      const row = this.$refs["row_0"][0];
 
      setTimeout(() => {
        this.visible = false;
 
        this.$nextTick(() => {
          this.initMt++;
          if (this.initMt === this.data.length) {
            this.initMt = 0;
          }
          this.visible = true;
        });
        this.play();
      }, 2000);
    },
  },
  watch: {
 
  },
  computed: {
    getPlayData() {
      return this.data.concat(this.data.slice(0, 4));
    },
  },
  mounted() {
    this.play();
  },
};
</script>
<style lang="scss" scoped>
$cellHeight: 35px;
.scroll-board{
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 20px;
    height: 100%;
    overflow: hidden;
}
.table-row {
  display: flex;
  line-height: 35px;
  height: 35px;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(63, 88, 114, 1);
}
.table-header {
  background-color: rgb(25, 129, 246);
  color: white;
}
.table-cell {
  text-align: left;
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.serialno{
  padding: 0 20px
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