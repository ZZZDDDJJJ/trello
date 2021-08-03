<template>
  <div>
    <div class="comment-post">
      <div class="avatar">
        <span>{{ user.name.toUpperCase() }}</span>
      </div>
      <div class="comment-content-box editing">
        <textarea
          class="comment-content-input"
          placeholder="添加评论……"
          ref="content"
        ></textarea>
        <button class="btn btn-edit" @click="postNewComment">保存</button>
      </div>
    </div>

    <ul class="comments" v-if="comments.rows">
      <li class="comment" v-for="comment of comments.rows" :key="comment.id">
        <div class="avatar">
          <span>{{ comment.user.name[0].toUpperCase() }}</span>
        </div>
        <div class="description">
          <div class="header">
            <strong>{{ comment.user.name }}</strong>
            <span> at </span>
            <i>{{ time(comment.createdAt) }}</i>
          </div>
          <div class="content">{{ comment.content }}</div>
        </div>
      </li>
    </ul>

    <div class="comment-pagination">
        <TPagination :pages="comments.pages" :page="comments.page" @changePage="changePage"></TPagination>
    </div>
  </div>
</template>

<script>
import dateTime from "../filters/date.Time";
import TPagination from '@/components/TPagination.vue'
export default {
  name: "TComment",
  components:{
    TPagination
  },
  data() {
    return {
      comments: {},
    };
  },
  props: {
    cardId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    user() {
      return this.$store.state.user.info;
    },
  },
  async created() {
    await this.getComments()
  },
  methods: {
    async getComments(page = 1) {
      try {
        let rs = await this.$store.dispatch("comment/getComments", {
          boardListCardId: this.cardId,
          page
        });

        this.comments = rs.data;
      } catch (error) {
        console.log(error);
      }
    },
    time(val) {
      return dateTime(val);
    },
    async postNewComment() {
      if (this.$refs.content.value.trim() !== "") {
        await this.$store.dispatch("comment/postComment", {
          boardListCardId: this.cardId,
          content: this.$refs.content.value,
        });
      }
      this.$refs.content.value = "";
      await this.getComments()
      this.$refs.content.focus();
    },
    async changePage(page){
      console.log(page,'====')
      await this.getComments(page)
    }
  },
};
</script>