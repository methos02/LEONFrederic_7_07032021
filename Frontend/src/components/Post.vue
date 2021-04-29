<template>
  <div class="div-post">
    <v-card class="card-post mb-2 mx-auto">
      <article_content v-if="post.type === 1" :post="post" @delete="openConfirm" :has_action="current_user.id === post.UserId || current_user.isAdmin === 1" />
      <image_content  v-if="post.type === 2" :post="post" @delete="openConfirm" :has_action="current_user.id === post.UserId || current_user.isAdmin === 1" />
      <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
        <v-btn @click="showTextarea"> Répondre </v-btn>
        <div v-if="post.Comments.length !== 0" class="order-2 order-md-1 btn-show-comments">
          <v-btn v-if="!show.comments" @click="toggleComments" text> Afficher les commentaires </v-btn>
          <v-btn v-else @click="toggleComments" text> Cacher les commentaires </v-btn>
        </div>
        <likes :post="post" class="order-1 order-md-2"/>
      </div>
    </v-card>
    <comments :post="post" :show.sync="show"/>
  </div>
</template>

<script>
import abbreviate from "@/utils/abbreviate";
import comments from '@/components/Comments'
import article_content from "@/components/parts/ArticleContent";
import image_content from "@/components/parts/ImageContent";
import likes from "@/components/Likes";
import {mapState} from "vuex";

export default {
  name: "PostArticle",
  components: {comments, article_content, image_content, likes },
  props: ['post', 'has_action'],
  data() {
    return {
      show : { comments : false, textarea : false }
    }
  },
  methods: {
    openConfirm(data) {
      this.$emit('openConfirm', data);
    },
    toggleComments() {
      this.show.comments = !this.show.comments;
    },
    showTextarea() {
      this.show.textarea = true;
    },
  },
  computed: {
    ...mapState({ current_user: 'current_user' })
  },
  filters: {
    abbreviate(text) {
      return abbreviate(text);
    }
  }
}
</script>
<style lang="scss" scoped>
.article-header {
  width: 100%;
}
</style>
