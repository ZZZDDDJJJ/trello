<template>
    <div id="board">

        <!--头部-->
        <Theader></Theader >

        <!--正文-->
        <main v-if="board">

            <h2>
                {{board.name}}
                <span class="btn btn-icon">
                    邀请
                </span>
            </h2>

            <!--面板容器-->
            <div class="board"  ref="TList">


            
                <TList  ref="TList1" v-for="list of lists" :key="list.id" :data="list" @dragStart="dragStart" @dragMove="dragMove" @dragEnd="dragEnd"></TList>
                <!--无内容列表容器-->
                <div class="list-wrap no-content " :class="{'list-adding':listAdding}">

                    <div class="list-add" @click="showListAdding">
                        <span class="icon icon-add"></span>
                        <span>添加另一个列表</span>
                    </div>

                    <div>
                        <input type="file" ref="testFile" style="width:70px" @input="test">
                        <img :src="img" >
                        <button @click="test">开始上传</button>
                    </div>

                    <div class="list">

                        <div class="list-cards">
                            <div class="list-card-add-form">
                                <input class="form-field-input" placeholder="为这张卡片添加标题……"  ref="newListName"/>
                            </div>
                        </div>

                        <div class="list-footer">
                            <div class="list-add-confirm">
                                <button class="btn btn-success" @click="addNewList">添加列表</button>
                                <span class="icon icon-close" @click="hideListAdding"></span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </main>

        <!--弹窗，可用于对话框、弹出式菜单等-->
        <!--弹出式菜单-->
        <!-- <div class="popup" style="left: 930px;top: 98px;display: block">
            <div class="popup-header">
                <span class="popup-title">Title</span>
                <a class="popup-header-close">
                    <i class="icon icon-close"></i>
                </a>
            </div>

            <div class="popup-content">
                <ul class="popup-menu-list">
                    <li><span>添加卡…</span></li>
                    <li><span>复制列表…</span></li>
                    <li><span>移动列表</span></li>
                    <li><span>关注 </span></li>
                </ul>
                <hr/>
                <ul class="popup-menu-list">
                    <li><span>移动此列表中的所有卡片…</span></li>
                    <li><span>归档这个列表中的所有卡…</span></li>
                </ul>
                <hr/>
                <ul class="popup-menu-list">
                    <li><span>将此列表进行归档</span></li>
                </ul>
            </div>
        </div> -->

        <!--遮罩层-->
        <router-view></router-view>

    </div>
</template>

<script>
import Theader from '../components/THeader.vue'
import TList from '@/components/TList.vue'
export default {
    data() {
        return {
            listAdding:false,
            img:''
        
        }
    },
    computed:{
        board(){
            return this.$store.getters['board/getBoard'](this.$route.params.id)
        },
        lists(){
            console.log(this.$store.getters['list/getLists'](this.$route.params.id))
            return this.$store.getters['list/getLists'](this.$route.params.id)
        }
    },
    components:{
        Theader,
        TList
    },
    created() {
         console.log('出来了',this.lists)
        if(!this.board){
            this.$store.dispatch('board/getBoard',this.$route.params.id)
            
        }
        if(!this.lists.length){
            console.log('123还是执行')
            this.$store.dispatch('list/getLists',this.$route.params.id)
        }
    },
    destroyed() {
        console.log('不见了')
    },
    methods: {
        test(){
            console.log(this.$refs.testFile.files[0])
           

              var reader = new FileReader();
               reader.onload = (e)=>{
                   
                  this.img = e.target.result
              };
            reader.readAsDataURL(this.$refs.testFile.files[0]);
      
           
        },
        showListAdding(){
            this.listAdding = true
            this.$nextTick(()=>{
                this.$refs.newListName.focus()
            })
        },
        hideListAdding(){
            this.listAdding = false
        },
        addNewList(){
          let name = this.$refs.newListName.value

          if(name.trim() === ''){
              this.$refs.newListName.focus()
          }else{
             try {
                 
                  this.$store.dispatch('list/postList',{
                  name,
                  boardId:this.board.id
              })
              this.$message.success('提交成功')
               this.$refs.newListName.value = ''
              this.listAdding = true;
             } catch (error) {
                 this.$message.error('提交失败')
             }
             
          }
        },
        dragStart(e){
            let el = e.component.$el
            let board =el.parentNode
            let lists = [...board.querySelectorAll('.list-wrap')]
            el._index = lists.findIndex(list=>list ===el)
        },
        dragMove(e){
            let el = e.component.$el
            let board =el.parentNode
           // let board = this.$refs.TList
          //  console.log(e,board,this.$refs.TList,el,this.$refs.TList1[0].$el.parentNode,this.$refs.TList1)

            let lists = [...board.querySelectorAll('.list-wrap')]
            // let lists =[ ...this.$el.childNodes[1].childNodes[1].childNodes]
           // console.log(lists,board)
            let currentIndex = lists.findIndex(list =>list===el)

            lists.forEach((list,index)=>{
                if(index !== currentIndex){
                    let clientRect = list.getBoundingClientRect()

                    if(e.x >= clientRect.left && e.x <= clientRect.right  && e.y >= clientRect.top && e.y <= clientRect.bottom){
                        if(currentIndex<index){
                            board.insertBefore(el,list.nextElementSibling)
                        }else{
                            board.insertBefore(el,list)
                        }
                    }
                }
            })

           // console.log(lists,this.lists)
        },
        async dragEnd(e){
            let el = e.component.$el
            let board = this.$refs.TList
              
            let lists = [...board.querySelectorAll('.list-wrap-content')]
            let currentIndex = lists.findIndex(list =>list===el)
            console.log(el._index,currentIndex)
            if(el._index !== currentIndex){
                let newOrder;

                let prevOrder = lists[currentIndex - 1] && parseFloat(lists[currentIndex - 1].dataset.order)

                let nextOrder = lists[currentIndex + 1] && parseFloat(lists[currentIndex + 1].dataset.order)

                console.log(prevOrder,nextOrder,newOrder,e)

                if(currentIndex == 0 ){
                    newOrder = nextOrder /2
                }else if(currentIndex === lists.length -1){
                    newOrder = prevOrder + 65535
                }else{
                    newOrder = (prevOrder + nextOrder) /2 
                }

                await this.$store.dispatch('list/editList',{
                        boardId:this.board.id,
                        boardListId:e.component.data.id,
                        order:newOrder
                })

            }

        }
    },
}
</script>