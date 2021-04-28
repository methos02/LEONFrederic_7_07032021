<template>
  <v-container v-if="post">
    <v-card>
      <img class="header-article" v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
      <div class="pa-3">
        <h1 v-if="post.title">{{ post.title }}</h1>
        <div v-html="post.content" v-if="post.content"></div>
        <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
          <v-btn @click="toggleTextarea(post.id, true)"> Répondre </v-btn>
          <div v-if="post.Comments.length !== 0" class="order-2 order-md-1 btn-show-comments">
            <v-btn v-if="!post.showComment" @click="toggleComments(post.id)" text> Afficher les commentaires </v-btn>
            <v-btn v-else @click="toggleComments(post.id)" text> Cacher les commentaires </v-btn>
          </div>
          <likes :post="post" class="order-1 order-md-2"/>
        </div>
      </div>
    </v-card>
    <comments :post="post"/>
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
    if(this.posts.find(post => post.id === parseInt(this.$route.params.id)) === undefined) {
      this.$store.dispatch('posts/loadPost', parseInt(this.$route.params.id));
    }
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    }),
    post() {
      return this.posts.find(post => post.id === parseInt(this.$route.params.id) )
    },
  },
  methods: {
    toggleComments(post_id) {
      this.$store.dispatch('posts/toggleComments', {post_id});
    },
    toggleTextarea(post_id, state) {
      this.$store.dispatch('posts/toggleTextarea', {post_id, state});
    },
  }
}
</script>
<style lang="scss" scoped>
.header-article {
  width: 100%;
}
</style>
