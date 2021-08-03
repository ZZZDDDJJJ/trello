import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
const Board = () => import(/* webpackChunkName: "group-board" */ '../views/Board.vue')
const Card = () => import(/* webpackChunkName: "group-board" */ '../views/Card.vue')
const Register = () => import(/* webpackChunkName: "group-board" */ '../views/Register.vue')
const Login = () => import(/* webpackChunkName: "group-board" */ '../views/Login.vue')
const NotFound = () => import(/* webpackChunkName: "group-board" */ '../views/NotFound.vue')




Vue.use(VueRouter)

const routes = [
    {
       path:"/",
       name:"Home",
       component:Home,
       meta: { requiresAuth: true }
    
    },
    {
        path:"/board/:id(\\d+)",
        name:"Board",
        component:Board,
        meta: { requiresAuth: true },
        children:[
            {
                path:"list/:listId(\\d+)/card/:cardId(\\d+)",
                name:"Card",
                component:Card
            }
        ]
     
     },
    
     {
        path:"/register",
        name:"Register",
        component:Register
     
     },
    
     {
        path:"/login",
        name:"Login",
        component:Login
     
     },
    
     {
        path:"*",
        name:"NotFound",
        component:NotFound
     
     },
     

]

const router = new VueRouter({
    mode:'history',
    routes
})

store.commit('user/initUserInfo')

router.beforeEach((to,from,next)=>{
   console.log(to)
   if(to.matched.some(matched=>matched.meta.requiresAuth) && !store.state.user.info){
     
      next({
         name:"Login"
      })

   }else{
      console.log('鉴权通过')
      next()
   }
})

export default router