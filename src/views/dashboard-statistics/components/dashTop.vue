<template>
    <div class="dashboard-top">
       <div v-for="(item,i) in topData" :key="i+'top'" class="top-cell-item">
            <div :class="`item-div${i}`">
               <div>{{item.title}}</div> 
               <div>{{item.mile}}</div> 
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
        topData:[
            {
                title:'匀浆',
                mile: '100个'
            },
            {
                title:'涂布',
                mile: '23个'
            },
            {
                title:'碾压',
                mile: '30个'
            },
            {
                title:'分切',
                mile: '30个'
            },
            {
                title:'烘烤',
                mile: '30个'
            },
            {
                title:'卷绕',
                mile: '30个'
            },
            {
                title:'装配',
                mile: '30个'
            },
            // {
            //     title:'涵洞',
            //     mile: '30个'
            // },
            // {
            //     title:'涵洞',
            //     mile: '30个'
            // },
        ],
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
    .dashboard-top {
        display: flex;
        height: 100%;
        .top-cell-item {
            width: 14%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            >div{
                height: 85%;
                width:100%;
                border-right: 3px solid #061e5d;;
                padding: 10px;

                >div {
                    width:100%;
                    height: 50%;
                    // color:#0E6698;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
            }
            .item-div6{
                border-right: none;
            }
        }
    }
  </style>
  