import * as api from '@/api'

export default {
    namespaced: true,

    state: {
        cards: []
    },
    getters: {
        getCards: ({ cards }) => (boardListId) => {
            return cards.filter((card) => card.boardListId == boardListId)
        },
        getCard: ({ cards }) => cardId => {
            console.log('_____-------', cards)
            return cards.find(card => card.id == cardId)
        }
    },

    mutations: {
        updateCards: (state, payload) => {
            state.cards = [...state.cards, ...payload]
        },
        addCard: (state, payload) => {
            state.cards = [...state.cards, payload]
        },
        updateCard: (state, payload) => {

            state.cards = state.cards.map((card) => {
                if (card.id == payload.id) {

                    return { ...card, ...payload }
                }
                return card
            })

        },
        addAttachment: (state, payload) => {
            state.cards = state.cards.map((card) => {
                if (card.id == payload.boardListCardId) {
                    console.log('执行   ')
                    return { ...card, attachments: [...card.attachments, payload] }
                }
                return card
            })
        },
        
        setCover: (state, payload) => {
            let coverPath = null
            state.cards = state.cards.map((card) => {
                 
                if (card.id == payload.cardId) {
                    
                    return { ...card, attachments: card.attachments.map( attachment=>{
                            console.log('---',attachment.id,payload.id,card)
                            if(attachment.id == payload.id){
                                coverPath = attachment.path
                            }
                        return {...attachment,isCover:attachment.id == payload.id}
                    } ), coverPath }
                }
                return card
            })
        },
        removeCover:(state, payload) => {
            let coverPath = null
            state.cards = state.cards.map((card) => {
                if (card.id == payload.cardId) {
                    console.log(typeof(card.id),typeof(payload.cardId))
                    return { ...card, attachments: card.attachments.map( attachment=>{
                       
                        return {...attachment,isCover:false}
                    } ), coverPath}
                }
                return card
            })
        },
        removeAttachment:(state, payload) => {
            state.cards = state.cards.map((card) => {
                let coverPath = card.coverPath
                if (card.id == payload.cardId) {
                      if(card.attachments.find(attachment=>attachment.id == payload.id ).isCover){
                          coverPath = null
                      }
                    return { ...card, attachments: card.attachments.filter(attachment=>attachment.id!== payload.id),coverPath }
                }
                return card
            })
        },
    },
    actions: {
        getCards: async ({ commit }, payload) => {
            try {
                let rs = await api.getCards(payload)
                //  console.log('1',rs.data)
                commit('updateCards', rs.data)
                return rs
            } catch (error) {
                console.log(error)
            }
        },
        postCard: async ({ commit }, payload) => {
            try {
                let rs = await api.postCard(payload)
                //  console.log(rs.data)
                commit('addCard', rs.data)

                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        editCard: async ({ commit }, payload) => {
            try {
                let rs = await api.putCard(payload)
                console.log(rs.data)
                commit('updateCard', payload)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        uploadAttachment: async ({ commit }, payload) => {
            try {
                let rs = await api.uploadAttachment(payload)
                console.log(rs.data)
                commit('addAttachment', rs.data)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        setCover: async ({ commit }, payload) => {
            try {
                let rs = await api.setCover(payload)
                console.log(payload)
                commit('setCover', payload)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        removeCover:async ({ commit }, payload) => {
            try {
                let rs = await api.removeCover(payload)
                console.log(rs.data)
                commit('removeCover', payload)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        removeAttachment:async ({ commit }, payload) => {
            try {
                let rs = await api.removeAttachment(payload)
                console.log(rs.data)
                commit('removeAttachment', payload)
                return rs
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    }

}