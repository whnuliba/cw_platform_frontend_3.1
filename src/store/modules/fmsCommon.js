import httpUtils from '@/api/fms-common'
const state = {} 
const mutations={}
const actions = {
    actionFmsPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionFmsPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionWmsPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionWmsPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionMdmPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionMdmPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionProductPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionProductPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionTpmPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionTpmPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionServerPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionServerPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionWmsPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionWmsPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    } ,  
    actionAuthPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionAuthPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    
    actionTaskPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionTaskPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
    ,  
    actionWcsPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionWcsPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    actionFmsHisPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionFmsHisPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    actionPost({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.actionPost(obj.url,obj.params).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    action({commit},obj){
        return new Promise((resolve,reject)=> {
            httpUtils.action(obj.url,obj.params,obj.options).then(data=>{           
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
    //
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}