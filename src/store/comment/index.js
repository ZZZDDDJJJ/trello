import * as api from '@/api'

export default{
    namespaced:true,
    state:{},

    actions:{
        getComments:async(state,payload)=>{
            return await api.getComments(payload)
        },
        postComment:async(state,payload)=>{
            return await api.postComment(payload)
        }
    }
}