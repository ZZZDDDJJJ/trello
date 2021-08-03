<template>
      <router-link  class="list-card" v-if="data" :to="{name:'Card',params:{listId:data.boardListId,cardId:data.id}}">
          <div
            class="list-card-cover"
            :style="
              'background-image: url('+ server  + data.coverPath + ')'
            "
            v-if="data.coverPath"
          ></div>
          <div class="list-card-title">{{data.name}}</div>
          <div class="list-card-badges">
            <div class="badge" v-if="data.description">
              <span class="icon icon-description"></span>
            </div>
            <div class="badge" v-if="data.commentCount > 0">
              <span class="icon icon-comment"></span>
              <span class="text">{{data.commentCount}}</span>
            </div>
            <div class="badge"  v-if="Array.isArray(data.attachments) && data.attachments.length > 0">
              <span class="icon icon-attachment"></span>
              <span class="text">{{data.attachments.length}}</span>
            </div>
          </div>
      </router-link>
</template>

<script>
export default {
    name:"TCard",
    data() {
        return {
            
        }
    },
    props:{
        data:{
            type:Object
        }
    },
    computed:{
        server(){
          return this.$store.state.server.staticPath
        }
    }
}
</script>