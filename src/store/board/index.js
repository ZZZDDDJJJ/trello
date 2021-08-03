import * as api  from '@/api'

export default {
    namespaced:true,

    state:{
        inited:false,
        boards:null
    },
    getters:{
        getBoard:({boards})=>{
            return (id)=>{
                console.log(boards, Array.isArray(boards),id,'----------')
                return  Array.isArray(boards)?boards.find(board=>board.id == id):null
            
            }
        }
    },

    mutations:{
        updateBoards:(state,payload)=>{
            state.boards = payload;
            state.inited = true;
        },
        addBoard:(state,payload)=>{
            if(state.boards === null){
                state.boards =[]
            }
            state.boards.push(payload)
        }
    },
    actions:{
        getBoards:async ({commit})=>{
            try {
                let rs = await api.getBoards()
                
                commit('updateBoards',rs.data)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        getBoard:async({commit},payload)=>{
            try {
                let rs = await api.getBoard(payload)
                console.log(rs)
                commit('addBoard',rs.data)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        postBoard:async({commit},payload)=>{
            try {
                let rs = await api.postBoard(payload)
                commit('addBoard',rs.data)
                return rs
                
            } catch (error) {
                console.log(error)
                throw error
            }
        }
    }
}