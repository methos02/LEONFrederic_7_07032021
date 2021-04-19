<template>
  <v-container v-if="post">
    <v-card>
      <img class="header-article" v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
      <div class="pa-3">
        <h1 v-if="post.title">{{ post.title }}</h1>
        <div v-html="post.content" v-if="post.content"></div>
        <likes :post="post"/>
      </div>
    </v-card>
    <comments :comments="post.commentsSort" :post_id="post.id"/>
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
<style lang="scss" scoped>
.header-article {
  width: 100%;
}
</style>
