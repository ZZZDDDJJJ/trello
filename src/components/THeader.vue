<template>
  <header>
    <div class="left">
      <router-link :to="{ name: 'Home' }" class="btn btn-icon">
        <i class="icon icon-home"></i>
      </router-link>
      <router-link :to="{ name: 'Board' }" class="btn btn-icon">
        <i class="icon icon-board"></i>
        <span class="txt">看板</span>
      </router-link>
    </div>
    <router-link :to="{ path: '/' }" class="logo"></router-link>
    <div class="right">
      <a href="" class="btn btn-icon">
        <i class="icon icon-add"></i>
      </a>
      <TPopup ref="tPopup" :title="user && user.name">
        <template v-slot:popup >
          <button class="avatar" >
            <span>{{user && user.name[0].toUpperCase()}}</span>
          </button>
        </template>

        <template v-slot:content>
          <TPopupMenu :items="menuItems" @command="execute"></TPopupMenu>
        </template>
      </TPopup>
    </div>
  </header>
</template>

<script>
import TPopup from "@/components/TPopup";
import TPopupMenu from "./TPopupMenu.vue";
import {mapState} from "vuex"

export default {
  name: "THeader",
  components: {
    TPopup,
    TPopupMenu,
  },
  computed:{
    ...mapState('user',{
        user:state=>state.info
    })
  },
  mounted() {
    
  },
  data() {
    return {
      menuItems: [
        { name: "退出", command: "logout" },
       
      ],
    };
  },
  methods: {
      execute(command){
            console.log(command)
            switch(command){
                case 'logout':
                    this.logout();
                    break;
                default:
                    break;
            }
      },
      logout(){
        
          this.$store.dispatch('user/logout')

          this.$router.push({name:"Login"})
          //     console.log(this.$refs.tPopup)
          this.$refs.tPopup.close()
      }
  },
};
</script>