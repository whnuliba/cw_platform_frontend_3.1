<template>
    <div class="dashboard-top-left">
       <div class="left-item">
            <div class="item-cell">
              <div class="cell-num">
                <div>
                    <svg-icon icon-class="tixingTop"/>
                    <div class="task-num"><span>{{rqTaskNum}}</span> 件</div>
                    <div>
                        <span>同比</span>
                        <span>{{rqQOQ}}</span>
                    </div>
                    <div>
                        <span>环比</span>
                        <span>{{rqYOY}}</span>
                    </div>  
                </div>
              </div>
              <p>当月维修任务量</p>
            </div>

            <div class="item-cell">
                <p>运维人均工作量</p>
                <div  class="cell-num">
                    <div>
                      <svg-icon icon-class="tixingBot" class="dv-reverse"/>
                       <div class="task-num"><span>{{eqPercent}}</span> 件/日</div>
                        <div>
                            <span>同比</span>
                            <span>{{operationQOQ}}</span>
                        </div>
                        <div>
                            <span>环比</span>
                            <span>{{operationYOY}}</span>
                        </div> 
                    </div>
              </div>
            </div>
        </div>
       </div>
</template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'Top',
    components: { },
    data() {
      return {
        leftNumData:[],
        rqTaskNum: 81,
        eqPercent: 15,
        rqQOQ:23,
        rqYOY:19,
        operationQOQ:90,
        operationYOY:9,
      }
    },
    computed: {
      ...mapGetters([

      ])
    },
    created() {
     
    }
  }
  </script>
  <style lang="less" scoped>
    .dashboard-top-left {
        height: 100%;
        width:30%;
        .left-item {
            height: 100%;
            .item-cell {
                display: flex;
                justify-content: space-around;
                margin: 10px 0;
                .cell-num {
                    width: 300px;
                    height: 150px;
                    // border:1px solid #fff;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    // background:url('../../../../icons/svg/tixing.svg') no-repeat 100% 100%;
                    position:relative;
                    .task-num {
                        font-weight: 700;
                        span {
                            font-size: 25px;
                            color: #00c0ff;
                            margin-right: 15px; 
                        }   
                    }
                    svg {
                        position: absolute;
                        left:0;
                        top:0;
                        width: 100%;
                        height: 100%;
                      }
                    svg.dv-reverse{
                      transform: rotate(180deg) !important;
                    } 
                    div { 

                        >div:not(:first-child) {
                            width: 90px;
                            display: flex;
                            justify-content: space-between;
                        }
                    }
                }
            }
        }
    }
  </style>
  