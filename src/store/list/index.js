import * as api from '@/api'

export default {
    namespaced: true,

    state: {
        lists: []
    },
    getters: {
        getLists: ({ lists }) => boardId => lists.filter(list => list.boardId == boardId),
        getList:({ lists }) => listId => lists.find(list => list.id == listId),
    },

    mutations: {
        updateLists: (state, payload) => {
            state.lists = [...state.lists, ...payload]
        },
        addList: (state, payload) => {
            state.lists = [...state.lists, payload]
        },
        updateList: (state, payload) => {

            state.lists = state.lists.map((item) => {

                if (item.id == payload.boardListId) {
                    console.log(item, payload)
                    return { ...item, ...payload }

                }

                return item
            }).sort((a, b) => {
                return a.order - b.order
            })

        },
      
    },
    actions: {
        getLists: async ({ commit }, payload) => {
            try {
                let rs = await api.getLists(payload)
                // console.log(rs.data)
                commit('updateLists', rs.data)
                return rs
            } catch (error) {
                console.log(error)
            }
        },
        postList: async ({ commit }, payload) => {
            try {
                let rs = await api.postList(payload)
                //  console.log(rs.data)
                commit('addList', rs.data)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        editList: async ({ commit }, payload) => {
            try {
                let rs = await api.putList(payload)
                console.log(rs)
                commit('updateList', payload)

                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
       
    }
}