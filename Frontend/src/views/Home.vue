<template>
  <v-container class="pt-0 div-container">
    <sidebar></sidebar>
    <div v-for="post in posts" :key="post.id"  class="mt-10">
      <post_article v-if="post.type === 1" :post="post" ></post_article>
      <post_image  v-if="post.type === 2" :post="post" ></post_image>
      <div v-show="post.showComment">
        <comments :post_id="post.id"></comments>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import comments from '@/components/Comments'
import post_article from "@/components/PostArticle";
import post_image from "@/components/PostImage";
import sidebar from "@/components/Sidebar";

export default {
  name: 'Home',
  components: {post_image, post_article, comments, sidebar },
  mounted() {
    this.$store.dispatch('posts/loadPosts');
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    })
  }
}
</script>
<style scoped>
.div-container {
  position: relative;
}
</style>
