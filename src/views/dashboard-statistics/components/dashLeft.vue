<template>
    <div class="dashboard-left">
       <div class="rank-board-title">工序在产工单数量</div>
       <div v-for="(item,i) in leftData" :key="i+'left'" class="dv-scroll-ranking-board">
            <div class="row-item">
               <div class="ranking-info">
                <span>{{item.num}}</span>
                <span>{{item.title}}</span>
                <span>{{item.numbers}}</span>
               </div> 
               <div class="ranking-column">
                    <div class="inside-column" :style="{width:`${item.numbers}%`}">
                        <div class="shine" ></div>
                    </div>
               </div> 
            </div>
       </div>
    </div>
</template>
  
<script>
  export default {
    name: 'Left',
    components: { },
    data() {
      return {
        leftData:[
            {
                num:'NO.1',
                title:'匀浆',
                numbers: '100'
            },
            {
                num:'NO.2',
                title:'涂布',
                numbers: '80'
            },
            {
                num:'NO.3',
                title:'碾压',
                numbers: '78'
            },
            {
                num:'NO.4',
                title:'分切',
                numbers: '68'
            },
            {
                num:'NO.5',
                title:'烘烤',
                numbers: '55'
            },
            {
                num:'NO.6',
                title:'卷绕',
                numbers: '45'
            },
            {
                num:'NO.7',
                title:'装备',
                numbers: '29'
            },
            // {
            //     num:'NO.8',
            //     title:'涵洞',
            //     numbers: '39'
            // },
            // {
            //     num:'NO.9',
            //     title:'涵洞',
            //     numbers: '29'
            // },
        ],
      }
    },
    computed: {
    },
    created() {
     
    }
  }
  </script>
  <style lang="less" scoped>
    .dashboard-left {
        height:100%;
        .rank-board-title {
            font-weight: 700;
            height: 50px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            font-size: 20px;
        }
        .dv-scroll-ranking-board {
            margin: 5px 0 0 0;
            height:14%;
            .row-item {
                -webkit-transition: all .3s;
                transition: all .3s;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                overflow: hidden;
            .ranking-info {
                width:100%;
                span{
                    display: inline-block;
                }
                span:nth-child(1) {
                    width: 30%;
                    color: #1370FB;
                }
                span:nth-child(2) {
                    width: 50%;
                    font-size: 15px;
                }
                span:nth-child(3) {
                    width: 20%;
                }
            }
            .ranking-column {
                border-bottom: 2px solid rgba(19,112,251,.5);
                margin-top: 5px;
                .inside-column {
                        position: relative;
                        height: 6px;
                        background-color: #1370fb;
                        margin-bottom: 2px;
                        border-radius: 1px;
                        overflow: hidden;
                    .shine {
                        position: absolute;
                        left: 0;
                        top: 2px;
                        height: 2px;
                        // width: 50px;
                        -webkit-transform: translateX(-100%);
                        transform: translateX(-100%);
                        background: radial-gradient(#28f8ff 5%,transparent 80%);
                        -webkit-animation: shine 3s ease-in-out infinite alternate;
                        animation: shine 3s ease-in-out infinite alternate;
                    }
                }
            }
            } 
        }
        
    }
  </style>
  