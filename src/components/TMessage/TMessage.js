import Vue from 'vue'

import TMessage from './TMessage.vue'

const TMessageClass = Vue.extend(TMessage)


let instances = []

function Message(data = {}) {
   
    if (typeof data == 'string') {
        data ={
            message:data
        }
    }
    
    data.onClose = function(){
        Message.close(instance)
    }

    let instance = new TMessageClass({
        data
    })
    console.log(instance,data)
    instance.$mount()
    document.body.appendChild(instance.$el)

    let offset = data.offset || 20
    let offsetTop = offset;
    instances.forEach(item => {
        offsetTop += item.$el.offsetHeight + offset
    });
    instance.$el.style.top = offsetTop + 'px'
    instances.push(instance)
}

['info','success','error','warning'].forEach(type=>{
   
    Message[type] = function(data){
        if(typeof data == 'string'){
            data={
                message:data
            }
        }
        
        data.type = type;
        console.log(data)
        return Message(data)
    }
})


Message.close = function(instance){
    
    let removeHeight = instance.$el.offsetHeight + instance.offset;
    let index = instances.findIndex(item=>item===instance)
    instances = instances.filter(item=>item !== instance)
    
    for(let i = index; i < instances.length;i++){
        instances[i].$el.style.top = parseFloat(instances[i].$el.style.top) - removeHeight +'px'
    }

}

export default Message