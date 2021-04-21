<template>
  <v-container class="pt-0 div-container">
    <sidebar @type="onTypeChange"/>
    <div v-for="post in posts" :key="post.id"  class="mt-10">
      <v-card class="card-post mb-2 mx-auto">
        <home_article v-if="post.type === 1" :post="post" @delete="openConfirm" :has_action="current_user.id === post.UserId || current_user.isAdmin === 1" />
        <home_image  v-if="post.type === 2" :post="post" @delete="openConfirm" :has_action="current_user.id === post.UserId || current_user.isAdmin === 1" />
        <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
          <v-btn @click="toggleTextarea(post.id, true)"> Répondre </v-btn>
          <div v-if="post.Comments.length !== 0" class="order-2 order-md-1">
            <v-btn v-if="!post.showComment" @click="toggleComments(post.id)" text> Afficher les commentaires </v-btn>
            <v-btn v-else @click="toggleComments(post.id)" text> Cacher les commentaires </v-btn>
          </div>
          <likes :post="post" class="order-1 order-md-2"></likes>
        </div>
      </v-card>
      <comments :post="post" />
    </div>
    <paginate model="posts" @currentPageChange="onCurrentPageChange"/>
    <confirm-action @confirm="deletePost"> Êtes vous sûr de vouloir supprimer votre {{ data.type }} </confirm-action>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import comments from '@/components/Comments'
import home_article from "@/components/HomeArticle";
import home_image from "@/components/HomeImage";
import sidebar from "@/components/Sidebar";
import paginate from "@/components/Paginate";
import confirmAction from "@/components/confirmAction";
import likes from "@/components/Likes";

export default {
  name: 'Home',
  components: {home_image, home_article, comments, sidebar, paginate, confirmAction, likes },
  data() {
    return {
      type: '',
      data: '',
    }
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
    openConfirm(data) {
      this.$emit('openConfirm', true);
      this.data = data;
    },
    onCurrentPageChange(page) {
      this.$store.dispatch('posts/loadPosts', this.type === '' ? { page } : { page, type: this.type });
    },
    onTypeChange(type) {
      this.type = type;
    },
    toggleComments(post_id) {
      this.$store.dispatch('posts/toggleComments', {post_id});
    },
    toggleTextarea(post_id, state) {
      this.$store.dispatch('posts/toggleTextarea', {post_id, state});
    },
    async deletePost() {
      const res = await this.$store.dispatch('posts/deletePost', this.data.post_id);

      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été supprimée.' });
        this.dialog = false;
        this.data = {};
      }
    }
  },
}
</script>
<style scoped>
.div-container {
  position: relative;
}
</style>
