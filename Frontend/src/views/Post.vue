<template>
  <v-container v-if="post">
    <v-card>
      <img class="header-article" v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
      <div class="pa-3">
        <h1 v-if="post.title">{{ post.title }}</h1>
        <div v-html="post.content" v-if="post.content"></div>
        <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
          <v-btn @click="showTextarea"> Répondre </v-btn>
          <div v-if="post.Comments.length !== 0" class="order-2 order-md-1 btn-show-comments">
            <v-btn v-if="!show.comments" @click="toggleComments" text> Afficher les commentaires </v-btn>
            <v-btn v-else @click="toggleComments" text> Cacher les commentaires </v-btn>
          </div>
          <likes :post="post" class="order-1 order-md-2"/>
        </div>
      </div>
    </v-card>
    <comments :post="post" :show.sync="show"/>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import comments from "@/components/Comments";
import likes from "@/components/Likes";

export default {
  name: 'Post',
  components: { comments, likes },
  mounted() {
    if(this.posts.find(post => post.slug === parseInt(this.$route.params.slug)) === undefined) {
      this.$store.dispatch('posts/loadPost', this.$route.params.slug);
    }
  },
  data() {
    return {
      show : { comments : false, textarea : false }
    }
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    }),
    post() {
      return this.posts.find(post => post.slug === this.$route.params.slug )
    },
  },
  methods: {
    toggleComments() {
      this.show.comments = !this.show.comments;
    },
    showTextarea() {
      this.show.textarea = true;
    },
  }
}
</script>
<style lang="scss" scoped>
.header-article {
  width: 100%;
}
</style>
