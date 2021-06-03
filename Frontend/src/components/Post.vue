<template>
  <div class="div-post">
    <v-card class="card-post mb-2 mx-auto">
      <article_content v-if="post.type === 1" :post="post" @delete="openConfirm" :has_action="isAllowed(current_user, post)" />
      <image_content  v-if="post.type === 2" :post="post" @delete="openConfirm" :has_action="isAllowed(current_user, post)" />
      <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
        <v-btn @click="showTextarea"> Répondre </v-btn>
        <div v-if="post.Comments.length !== 0" class="order-2 order-sm-1 btn-show-comments flex text-center">
          <v-btn v-if="!show.comments" @click="toggleComments" text> Afficher les commentaires </v-btn>
          <v-btn v-else @click="toggleComments" text> Cacher les commentaires </v-btn>
        </div>
        <likes :post="post" class="order-1 order-sm-2"/>
      </div>
    </v-card>
    <comments :post="post" :show.sync="show"/>
  </div>
</template>

<script>
import abbreviate from "@/helpers/abbreviateHelper";
import {isAllowed} from "../helpers/authHelper";
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
    isAllowed,
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
    ...mapState({ current_user: state => state.auth.current_user })
  },
  filters: {
    abbreviate(text) {
      return abbreviate(text);
    }
  }
}
</script>
