import axios from 'axios'
import TMessage from '../components/TMessage/TMessage.js'

axios.defaults.baseURL = process.env.VUE_APP_NOT_SECRET_API_PATH;
console.log(process.env.VUE_APP_NOT_SECRET_API_PATH, process.env.NODE_ENV)
axios.interceptors.request.use((configs)=>{
    console.log(configs.headers)
    try {
        let data = JSON.parse(localStorage.getItem('user'))
        if(data.authorization){ 
            configs.headers.common.authorization = data.authorization;
       }

        // configs.headers = Object.assign(configs.headers,
        //     {
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //   )
 

    } catch (error) {
        console.log(error)
        
    }
   

    return configs
})

axios.interceptors.response.use((response)=>{
     return response
},error=>{
    let {message,errorDetails} = error.response.data
    console.log(error.response)
    if(errorDetails){
        message += ':' +errorDetails
    }
    TMessage.error(message)
    console.log( error)
})

export const register = data=>{
    return axios({
        method:'post',
        url:"/user/register",
        data
    })
}


export const login = data=>{
    return axios({
        method:'post',
        url:"/user/login",
        data

    })
}


export const getBoards = ()=>{
    return axios({
        method:'get',
        url:"/board"
    })
}

export const getBoard= (id)=>{
    return axios({
        url:'/board/'+id
    })
}


export const postBoard =(data)=>{
    return axios({
        method:'post',
        url:"/board",
        data
    })
}


export const getLists = (boardId)=>{
    return axios({
        url:"/list",
        params:{
            boardId
        }
    })
}


export const postList = (data)=>{
    return axios({
        method:'post',
        url:"/list",
        data

    })
}

export const putList = (data)=>{
    return axios({
        method:'put',
        url:"/list/"+data.boardListId,
        data:{
            boardId:data.boardId,
            name:data.name,
            order:data.order
        }
    })
}

export const getCards = (boardListId)=>{
    return axios({
        url:"/card",
        params:{
            boardListId
        }
    })
}


export const postCard = (data)=>{
    return axios({
        url:"/card",
        method:'post',
        data
    })
}

export const putCard =(data)=>{
    return axios ({
        method:"put",
        url:'/card/'+ data.id,
        data:{
            boardListId : data.boardListId,
            name:data.name,
            description:data.description,
            order:data.order
        }
    })
}


export const uploadAttachment = (data)=>{
    console.log(data)
    
    let fd = new FormData()
    fd.append('boardListCardId',data.boardListCardId)
    fd.append('attachment',data.file)
    return axios({
        method:'post',
        url:"/card/attachment",
        data:fd

    })
}


export const setCover = (data)=>{
    return axios({
        method:'put',
        url:'card/attachment/cover/' +  data.id,
        
    })
}

export const removeAttachment = (data)=>{
    return axios({
        method:'delete',
        url:'card/attachment/' +  data.id,
        
    })
}

export const removeCover = (data)=>{
    return axios({
        method:'delete',
        url:'card/attachment/cover/' +  data.id,
        
    })
}

export const getComments = (data)=>{
    return axios({
        url:'/comment',
        params:{
            boardListCardId:data.boardListCardId,
            page:data.page
        }
    })
}

export const postComment = (data)=>{
    return axios({
        url:'/comment',
        method:'post',
        data
    })
}
