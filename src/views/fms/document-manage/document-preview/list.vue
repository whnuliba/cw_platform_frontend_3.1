<template>
<div class="app-container">
    <div class="filter-container">
        <el-row :gutter="10" type="flex" justify="space-between">
            <el-col :span="12">
                <el-breadcrumb separator="/" style="line-height: 36px; font-size: 16px; margin-left: 5px;">
                    <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                        <span :class="(index === breadcrumbList.length-1)?'breadcrumb-link-active':'breadcrumb-link-noActive'" @click="backFileFolder(item,index)">{{item}}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
            <el-col :span="6">
                <el-select v-model="fileName" style="width: 150px; margin-right: 5px;" clearable placeholder="请选择桶名称">
                    <el-option
                        v-for="item in bucketList"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-input style="width: 150px; margin-right: 5px;" placeholder="请输入文件名" v-model="fullFolderName" clearable />
                 <el-button type="primary" @click="searchFile">
                    <i class="el-icon-search"></i>
                    {{ $t("common.btn.query") }}
                </el-button>
            </el-col>
        </el-row>
        <div class="main">
            <ul id="mainUl" v-if="initComponent" class="list">
                <li class="list-item" v-for="(item,index) in bucketList" :key="index" @dblclick="getFileList(item,index)" >
                    <div class="inner">
                        <svg-icon icon-class="DFile" class="icon-file" style="width: 100px; height: 100px;" />
                        <div class="file-name">
                            <span>{{item}}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <el-table v-else :data="fileList"  fit highlight-current-row style="width: 100%" max-height="770px" @cell-dblclick="cellDblClick" @row-contextmenu="rowContextmenu" >
                <!-- <el-table-column width="50px" :label="$t('common.no')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+1 }}</span>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column v-for="(item,index) in cols" :key="index" :prop="item.field" :label="item.title" :align="item.align" :width="item.width"></el-table-column> -->
                <el-table-column label="名称" show-overflow-tooltip width="300">
                    <template slot-scope="scope">
                        <svg-icon :icon-class="getIcon(scope.row)" style="width: 18px; height: 18px; vertical-align: sub" />
                        <span v-if="scope.row.folder">{{scope.row.folderName}}</span>
                        <span v-else>{{scope.row.fileName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="完整名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.folder">{{scope.row.fullFolderName}}</span>
                        <span v-else>{{scope.row.fullFileName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属部门" prop="departName" width="250"></el-table-column>
                <el-table-column label="最后修改时间" :formatter="dataFormat" width="180" prop="lastModifyDate"></el-table-column>
                <el-table-column label="文件类型" prop="fileType" width="100"></el-table-column>
                <el-table-column label="大小" prop="size" width="100" ></el-table-column>
            </el-table>

            <el-card id="menu" ref="menu" class="menuDiv" v-show="showMenu">
                <div class="menuList" ref="menuUl">
                    <span v-if="menuRow.folder" @click="cellDblClick(menuRow)">打开</span>
                    <span @click="uploadFile">上传</span>
                    <span v-if="!menuRow.folder" @click="downloadFile">下载</span>
                    <span v-if="!menuRow.folder" @click="deleteFile">删除</span>
                </div>
            </el-card>

        </div>
        <el-dialog
            title="上传文件"
            :visible.sync="showUpload"
            width="500px"
            :close-on-click-modal="false"
            @close="cancel"
            >
            <el-form v-model="menuParams"  label-width="80px">
                <el-form-item label="桶名称:">
                    <el-input v-model="menuParams.bucketName" disabled style="width:380px"></el-input>
                </el-form-item>
                <el-form-item label="文件全名:">
                    <el-input v-model="menuParams.folder" :disabled="!recursive" :placeholder="message" style="width:380px" ></el-input>
                </el-form-item>
                <el-form-item label="打开文件">
                    <el-upload
                    class="upload-demo"
                    action="#"
                    ref="uploadDel"
                    :http-request="dataUpload"
                    :on-remove="handleRemove"
                    :before-upload="uploadFunc"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="uploadFileList"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">文件不超过10M</div> -->
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="createFile">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
import { getBucketList, getFileList, createFile, delFile, pullFile } from '@/api/document-previem'
// import {downloadXlsx, docDownload, pdfDownload, imgDownload, videoDownload} from '@/utils/docu-download';


export default {
    name: 'DocumentPreview',
    data() {
        return {
            bucketList: [],
            fileList: [],
            breadcrumbList: [],
            paramsBreadcrumbList: [],
            fileName:'',
            fullFolderName:'',
            currentName:{index:null,name:''},
            initComponent: true,
            params: {
                data: { bucket: '', prefix: '', recursive: false }
            },
            showMenu:false,
            menuParams:{
                bucketName:'',
                folder:'',
                file:[]
            },
            uploadFileList:[],
            menuRow:{},
            showUpload:false,
            recursive: false,
            message:''
        }
    },
    created() {
        this.getBucketList()
        this.init()
    },
    methods: {
        init(){
            this.breadcrumbList.push('文件')
            this.currentName = this.bucketList[0]
            this.initComponent = true
        },
        getIcon(row){
            switch(row.fileType){
                case 'folder':
                    return 'DFile'
                case 'chm':
                    return 'D3D'
                case 'png':
                    return 'DPng'
                case 'jpg':
                    return 'DPng'
                case 'fbx':
                    return 'D3D'
                case 'xlsx':
                    return 'DExcel'
                case 'zip':
                    return 'DZip'
                case 'pdf':
                    return 'DPdf'
                case 'docx':
                    return 'DWord'
                case 'mp4':
                    return 'Dmp4'
                default: 
                    return 'DuFile'
            }
        },
        dataFormat(row){
            if(row.lastModifyDate){
                let date =new Date(row.lastModifyDate)
                let year = date.getFullYear()
                let month = date.getMonth()+1
                let day = date.getDate()
                let hours = date.getHours()
                let minutes = date.getMinutes()
                let seconds = date.getSeconds()
                if( month < 10 ){ month = '0'+month }
                if( day < 10 ){ day = '0'+day }
                if( hours < 10 ){ hours = '0'+hours }
                if( minutes < 10 ){ minutes = '0'+minutes }
                if( seconds < 10 ){ seconds = '0'+seconds }
                return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
            }
        },
        async getBucketList(){
            const { data:{ data } } = await getBucketList()
            this.bucketList = data
        },
        async getFileList(item,index){
            this.currentName = item
            this.breadcrumbList.push(item)
            this.params.data.bucket = this.breadcrumbList[1]
            this.params.data.prefix = '' + this.paramsBreadcrumbList.slice(2,index+1).join('/')
            if(this.breadcrumbList.length>2){this.params.data.prefix  += '/'}
            const { data:{ data, code } } = await getFileList(this.params)
             if(code === 200){
                    this.fileList = data
                }else{
                    this.fileList = []
                    this.$message({
                        message: '获取文件列表失败,错误：'+ data,
                        type: 'error'
                    })
                }
            this.paramsBreadcrumbList = []
            if(this.breadcrumbList.length > 1){
                this.initComponent = false
            }
        },
        backFileFolder(item,index){
            this.recursive = false
            if(item!=this.currentName){
                if(index === 0){
                    this.breadcrumbList = ['文件']
                    this.currentName = this.bucketList[0]
                    this.getBucketList()
                    this.initComponent = true
                }else{
                    this.paramsBreadcrumbList = this.breadcrumbList.concat()
                    this.breadcrumbList.splice(index)
                    this.getFileList(item,index)
                }
            }
        },
        async cellDblClick(row){
            if(row.folder){
                this.recursive = false
                this.params.data.bucket = this.breadcrumbList[1]
                this.params.data.prefix = row.fullFolderName
                const { data:{ data } } = await getFileList(this.params)
                this.fileList = data
                this.currentName = row.folderName
                this.breadcrumbList.push(row.folderName)
            }
        },
        async searchFile(){
            //查询桶内所有文件
            if(this.fileName != ''){
                this.recursive = true
                this.breadcrumbList = ['文件']
                this.currentName = this.bucketList[0]
                this.initComponent = false
                this.breadcrumbList.push(this.fileName)
                this.currentName = this.fileName
                const params = {data:{bucket: this.fileName,prefix:'',recursive:true}}
                const { data:{ data, code } } = await getFileList(params)
                if(code === 200){
                    this.fileList = data
                }else{
                    this.fileList = []
                    this.$message({
                        message: '获取文件列表失败,错误：'+ data,
                        type: 'error'
                    })
                }
            }else{
                this.recursive = false
            }
            //当前无列表时，需要先选择桶名称
            if(!this.fileName && this.fullFolderName && this.breadcrumbList.length<2){this.$message.error("请先选择桶名称");}
            //查询当前列表中文件
            if(this.fullFolderName){
                let filterList =this.fileList.filter(item=>{
                    if(item.fileName){
                        return item.fileName.includes(this.fullFolderName)
                    }else{
                        return item.folderName.includes(this.fullFolderName)
                    }
                })
                this.fileList = filterList
            }
            //查询所有桶文件夹
            if(!this.fileName&&!this.fullFolderName){
                this.breadcrumbList = ['文件']
                this.currentName = this.bucketList[0]
                this.initComponent = true
                this.getBucketList()
            }
        },
        rowContextmenu(row,column,event){
            this.menuRow = row
            event.preventDefault()
            this.showMenu = true
            this.$refs.menu.$el.style.left = event.clientX - 210 + 'px'
            if(event.clientY < 770){
                this.$refs.menu.$el.style.top = event.clientY - 85 + 'px'
            }else{
                this.$refs.menu.$el.style.top = event.clientY - 85 - this.$refs.menu.$el.clientHeight + 'px'
            }
            document.addEventListener('click',()=>{
                this.showMenu = false
            })
        },
        downloadFile(){
            const params = {
                data:{
                    bucket: this.breadcrumbList[1],
                    // folder:this.menuParams.folder = this.breadcrumbList.slice(2,this.breadcrumbList.length).join('/'),
                    folder:this.menuRow.fullFileName,
                    fileName:this.menuRow.fileName
                }}
            pullFile(params).then(res=>{
                const blob = new Blob([res]);
                var a = document.createElement("a"); 
                a.href = URL.createObjectURL(blob); 
                a.download = params.fileName; 
                a.style.display = "none"; 
                document.body.appendChild(a); 
                a.click(); 
                a.remove();
            })
            
        },
        uploadFile(){
            this.menuParams.bucketName = this.breadcrumbList[1]
            if(this.breadcrumbList.length>2){
                this.menuParams.folder = this.breadcrumbList.slice(2,this.breadcrumbList.length).join('/') +'/'
            }else{
                this.menuParams.folder = ''
            }
            if(this.recursive){
                this.message = '请填写文件全路径'
            }else{
                this.message = ''
            }
            // console.log(this.menuParams.folder)
            this.showUpload = true
        },
        createFile(){
            let params = new FormData()
            params.append('bucket',this.menuParams.bucketName)
            params.append('folder',this.menuParams.folder)
            params.append('file',this.menuParams.file)
            createFile(params).then(res => {
                if(res.data.code == 200){
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                    const index = this.breadcrumbList.length-1
                    this.paramsBreadcrumbList = this.breadcrumbList.concat()
                    this.breadcrumbList.splice(index)
                    this.getFileList(this.paramsBreadcrumbList[index],index)
                    this.showUpload = false
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        cancel(){
            this.showUpload = false
            this.$refs.uploadDel.clearFiles()
            this.menuParams = {
                bucketName:'',
                folder:'',
                file:''
            }
        },
        handleRemove(file, fileList) {
            // console.log(file, fileList,this.$refs.upload);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        dataUpload(item) {
            this.menuParams.file = item.file;
            this.menuParams.folder += item.file.name
        },
        uploadFunc(file) {
          const isLtSize = file.size / 1024 / 1024 < 10;
          if (!isLtSize) {
              this.$message.error('上传图片大小不能超过 10MB!');
              // this.$refs.uploadDel[0].clearFiles()
          }
        },
      deleteFile(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            const params = {
                data:{
                    bucket: this.breadcrumbList[1],
                    // folder:this.breadcrumbList.slice(2,this.breadcrumbList.length).join('/')+'/'+this.menuRow.fileName,
                    folder:this.menuRow.fullFileName,
                    fileName:this.menuRow.fileName
                    }}
            delFile(params).then(res=>{
                if(res.data.code === 200){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    const index = this.breadcrumbList.length-1
                    this.paramsBreadcrumbList = this.breadcrumbList.concat()
                    this.breadcrumbList.splice(index)
                    this.getFileList(this.paramsBreadcrumbList[index],index)
                }else{
                    this.$message({
                        type: 'error',
                        message: '删除失败!'
                    });
                }
            })
        })
      }
    }
}
</script>

<style lang="scss" scoped>
*{
    user-select: none;
}
.breadcrumb-link-active{
    color: #97a8be;
    cursor: text;
}
.breadcrumb-link-noActive{
    cursor: pointer;
    color: black;
    &:hover{
        color: #11A983;
    }
}
::v-deep .el-table__row:hover{
    cursor: pointer;
}
.main {
    margin-top: 20px;
    #mainUl{
        padding-inline-start: 0;
        margin-left: -25px;
    }
    // border: 1px solid #424e67;
    .list-item{
        border: 1px solid #fff;
        box-sizing: border-box;
        position: relative;
        height: 125px;
        width: 120px;
        margin: 5px;
        display: inline-block;
        cursor: pointer;
        .inner{
            height: 60px;
            width: 60px;
            margin: 5px 10px;
            .icon-file{
                display: inline-block;
                width: 60px;
                height: 60px;
            }
        }
        .file-name{
            width: 100px;
            // padding-left: 10px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
        }
        .file-name:hover{
            color: #424e67;
        }
    }
    .list-item:hover{
        background-color: #f1f5fa;
        border: 1px solid #424e67;
    }
    .menuDiv{
        position: absolute;
        ::v-deep .el-card__body{
            padding: 0;
        }
        .menuList{
            height: auto;
            width: 70px;            
            font-size: 14px;
            text-align: center;
            border-radius: 4px;
            border: none; 
            background-color: #fff;
            color: #606266;
            list-style: none;
            border: 1px solid #ebeef5;
            padding-inline-start: 0;
            span{
                display: inherit;
                height: 35px;
                line-height: 35px;
                padding: 0px 10px;
                cursor: pointer;
                border-bottom: 1px solid rgb(255, 255, 255, 0.47);
                &:hover{
                    display: block;
                    background-color: #ecf5ff;
                    color: #7abbff;
                }
            }
        }
    }
}
</style>