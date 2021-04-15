<template>
  <v-container class="pt-0 div-container">
    <sidebar @type="onTypeChange"/>
    <div v-for="post in posts" :key="post.id"  class="mt-10">
      <post_article v-if="post.type === 1" :post="post" ></post_article>
      <post_image  v-if="post.type === 2" :post="post" ></post_image>
      <div v-show="post.showComment">
        <comments :post_id="post.id" />
      </div>
    </div>
    <paginate model="posts" @currentPageChange="onCurrentPageChange"/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import comments from '@/components/Comments'
import post_article from "@/components/PostArticle";
import post_image from "@/components/PostImage";
import sidebar from "@/components/Sidebar";
import paginate from "@/components/Paginate";

export default {
  name: 'Home',
  components: {post_image, post_article, comments, sidebar, paginate },
  data() {
    return { type: '' }
  },
  mounted() {
    this.$store.dispatch('posts/loadPosts');
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    })
  },
  methods: {
    onCurrentPageChange(page) {
      this.$store.dispatch('posts/loadPosts', this.type === '' ? { page } : { page, type: this.type });
    },
    onTypeChange(type) {
      this.type = type;
    }
  },
}
</script>
<style scoped>
.div-container {
  position: relative;
}
</style>
