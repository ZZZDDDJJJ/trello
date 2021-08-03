<template>
  <div
    class="list-wrap list-wrap-content"
    :class="{ 'list-adding': listAdding }"
    :data-order="data.order"
  >
    <div class="list-placeholder" ref="listPlaceholder"></div>

    <div class="list" ref="list">
      <div class="list-header" ref="listHeader">
        <textarea
          class="form-field-input"
          v-model="data.name"
          @mousedown.prevent
          ref="newBoardListName"
          @blur="editListName"
        ></textarea>
        <div class="extras-menu" @mousedown.prevent>
          <span class="icon icon-more"></span>
        </div>
      </div>

      <div class="list-cards">
        <!-- <div class="list-card">
          <div
            class="list-card-cover"
            style="
              background-image: url(https://trello-attachments.s3.amazonaws.com/5ddf961b5e861107e5f2de49/200x200/96d8fa19e335be20c102d394ef4bed71/logo.png);
            "
          ></div>
          <div class="list-card-title">接口代码编写及测试</div>
          <div class="list-card-badges">
            <div class="badge">
              <span class="icon icon-description"></span>
            </div>
            <div class="badge">
              <span class="icon icon-comment"></span>
              <span class="text">2</span>
            </div>
            <div class="badge">
              <span class="icon icon-attachment"></span>
              <span class="text">5</span>
            </div>
          </div>
        </div> -->

        <!-- <div class="list-card" v-for="card of cards" :key="card.id">
          <div
            class="list-card-cover"
            :style="
              'background-image: url(' + card.coverPath + ')'
            "
            v-if="card.coverPath"
          ></div>
          <div class="list-card-title">{{card.name}}</div>
          <div class="list-card-badges">
            <div class="badge" v-if="card.description">
              <span class="icon icon-description"></span>
            </div>
            <div class="badge" v-if="card.commentCount > 0">
              <span class="icon icon-comment"></span>
              <span class="text">{{card.commentCount}}</span>
            </div>
            <div class="badge"  v-if="card.attachments.length > 0">
              <span class="icon icon-attachment"></span>
              <span class="text">{{card.attachments.length}}</span>
            </div>
          </div>
        </div> -->

        <TCard v-for="card of cards" :key="card.id" :data="card"></TCard>

        <div class="list-card-add-form">
          <textarea
            class="form-field-input"
            placeholder="为这张卡片添加标题……"
            ref="newListName"
          ></textarea>
        </div>
      </div>

      <div class="list-footer">
        <div class="list-card-add" @click="showListCardAddForm">
          <span class="icon icon-add"></span>
          <span>添加另一张卡片</span>
        </div>
        <div class="list-add-confirm">
          <button class="btn btn-success" @click="addNewCard">添加卡片</button>
          <span class="icon icon-close" @click="hideListCardAddForm"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TCard from './TCard.vue'
export default {
  name: "TList",
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      inputName: null,
      drag: {
        isDown: false,
        isDrag: false,
        downClientX: 0,
        downClientY: 0,
        downElementX: 0,
        downElementY: 0,
      },
      listAdding:false
    };
  },
  components:{
    TCard
  },
  computed:{
    cards(){
      return this.$store.getters['card/getCards'](this.data.id)
    }
  },
  async created() {
    
    this.data.inputName = this.$props.data.name;
    if(!this.cards.length){
      console.log('---',this.data.id)
      await this.$store.dispatch('card/getCards',this.data.id)
    }
  },
  mounted() {
    this.$refs.listHeader.addEventListener("mousedown", this.dragDown);
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragUp);
  },
  methods: {
    dragDown(e) {
      this.drag.isDown = true;
      this.drag.downClientX = e.clientX;
      this.drag.downClientY = e.clientY;

      let pos = this.$refs.list.getBoundingClientRect();
      this.drag.downElementX = pos.x;
      this.drag.downElementY = pos.y;
    },
    dragMove(e) {
      if (this.drag.isDown) {
        let listElement = this.$refs.list;
        let x = e.clientX - this.drag.downClientX;
        let y = e.clientY - this.drag.downClientY;

        if (x > 10 || y > 10) {
          if (!this.drag.isDrag) {
            this.drag.isDrag = true;
            this.$refs.listPlaceholder.style.height =
              listElement.offsetHeight + "px";
            listElement.style.position = "absolute";
            listElement.style.zIndex = 99999;
            listElement.style.transform = "rotate(5deg)";

            document.body.appendChild(listElement);
            this.$emit("dragStart", {
              component: this,
            });
          }

          listElement.style.left = this.drag.downElementX + x + "px";

          listElement.style.top = this.drag.downElementY + y + "px";

          this.$emit("dragMove", {
            component: this,
            x: e.clientX,
            y: e.clientY,
          });
        }
      }
    },
    dragUp(e) {
      if (this.drag.isDown) {
        if (this.drag.isDrag) {
          let listElement = this.$refs.list;
          this.$refs.listPlaceholder.style.height = 0;

          listElement.style.position = "relative";
          listElement.style.zIndex = 0;
          listElement.style.transform = "rotate(0deg)";
          listElement.style.left = 0 + "px";

          listElement.style.top = 0 + "px";
          console.log(this);
          this.$el.appendChild(listElement);

          this.$emit("dragEnd", {
            component: this,
          });
        } else {
          if (e.path.includes(this.$refs.newBoardListName)) {
            this.$refs.newBoardListName.select();
          }
        }

        this.drag.isDrag = this.drag.isDown = false;
      }
    },
    async editListName() {
       console.log(this.$refs.newBoardListName.value, this.data.inputName,this.$props.data,this.data)
      let value = this.$refs.newBoardListName.value;
      if (value !== this.data.inputName) {
        await this.$store.dispatch("list/editList", {
          boardId:this.$props.data.boardId,
          boardListId: this.$props.data.id,
          order:this.$props.data.order,
          name:value
        });
      }
    },
    showListCardAddForm(){
      this.listAdding = true
      this.$nextTick(()=>{
        this.$refs.newListName.focus()
      })
   
    },
    hideListCardAddForm(){
      this.listAdding = false
       this.$refs.newListName.value = ''
    },
    addNewCard(){
      let {value} = this.$refs.newListName

      if(value.trim() !== ''){
        this.$store.dispatch('card/postCard',{
          name:value,
          boardListId:this.data.id
        })
            console.log(this)
             this.$message.success('添加成功')
             this.hideListCardAddForm()
      }else{
        this.$refs.newListName.focus()
      }
    }
  },
};
</script>