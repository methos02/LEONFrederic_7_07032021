<template>
  <v-container v-if="post">
    <v-card class="pa-3">
      <h1 v-if="post.title">{{ post.title }}</h1>
      <div v-html="post.content" v-if="post.content"></div>
      <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
      <likes :post="post"></likes>
    </v-card>
    <comments :comments="post.commentsSort" :post_id="post.id"></comments>
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
  }
}
</script>
