import { register,login } from "../../api"

export default {
    namespaced:true,
    state:{
       info:null
    },
    mutations:{

        initUserInfo:state=>{
            try {
                let data = JSON.parse(localStorage.getItem('user'))
                state.info = data
            } catch (error) {
                console.log(error)
                
            }
        },

        updateUserInfo:(state,payload)=>{
            state.info = payload

            localStorage.setItem('user',JSON.stringify(payload))
        },
        removeUserInfo:(state)=>{
            state.info = null
            localStorage.removeItem('user')
        }
    },
    actions:{
        register:(el,payload)=>{
            console.log(el)
            return register(payload)
        },
        login: async ({commit},payload)=>{

                 console.log(payload)
                let rs = await login(payload)
                console.log(rs)
                commit('updateUserInfo',{
                    id:rs.data.id,
                    name:rs.data.name,
                    authorization:rs.headers.authorization
                })
                return rs
           
             
        },
        logout: async({commit})=>{
             commit('removeUserInfo')
        }
    }
}