/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 堆垛机按钮提示模态框
*/ 
<template>
  <div class="modal-class">
        <el-dialog v-el-drag-dialog :visible.sync="stockBtnVisible" :width="'25%'" :title="$t('common.tip_info.tips')" customClass="layPickStyle">
                <div class="info-text">
                     <el-row>
                        <el-col :span='24' :style="{marginBottom:'10px'}">
                           <i class="el-icon-warning"></i> {{`确定要进行${stockInfoTitle}  ?`}} 
                        </el-col>
                     </el-row>
                      <el-row>
                        <div class="info-div">
                            <div></div>
                            <div>
                                <el-button @click="cancelClick">取消</el-button>
                                <el-button type="primary" @click="onFinish(stockInfoTitle)">确定</el-button>
                            </div>
                        </div>
                    </el-row> 
                </div>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
 import { EnableStocker } from '@/api/proLineMonitor';
export default {
 directives: {elDragDialog},
  props: {
    stockInfoTitle: {
        type: String,
    },
    carryType: {
        type: Number
    }
  },
  watch: {
  },
  computed: {},
  data() {
    return {
      stockBtnVisible:false,
    }
  },
  created() {
      
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
     // 堆垛机按钮API
    getApi(url, params,name) {
               const _data = {url:url,params: {data: params}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.$message({
                                    type: 'success',
                                    message: name+this.$t('const.result.success')
                                });
                        }).catch(err => {
                            console.error(err)
                        }) 
            },
      modalOnpen() {
        this.stockBtnVisible = true
      },
      cancelClick() {
        this.stockBtnVisible = false
      },
      onFinish(title) {
        // 切换不同按钮接口
        switch(title) {
            case '急停':
                this.getApi('/api/Stocker/StopStocker',this.carryType,title)
                this.stockBtnVisible = false
                break;
            case '复位':
                 this.getApi('/api/Stocker/ResetStocker',this.carryType,title)
                 this.stockBtnVisible = false
                break;
            case '取消':
                this.getApi('/api/Stocker/CancelStocker',this.carryType,title)
                this.stockBtnVisible = false
                break;
            case '召回':
                this.getApi('/api/Stocker/BackStocker',this.carryType,title)
                this.stockBtnVisible = false
                break;
            case '启用自动任务':
            case '禁用自动任务':
                    EnableStocker({data: this.carryType}).then(res => {
                                this.$emit('stockerEqInfo',this.carryType)
                                this.stockBtnVisible = false
                            }).catch(err => { console.error(err) })
                break;
            default:
        }
      },
  }
}
</script>
<style lang="less" scoped>
     .info-text {
        width:100%;
        .info-div {
            display:flex;
            >div:nth-child(1){
                width:50%;
            }
            >div:nth-child(2){
                width:50%;
                
            }
        }
     }
</style>
