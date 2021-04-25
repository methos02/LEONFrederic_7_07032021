<template>
  <v-container class="pt-0 div-container">
    <sidebar @type="onTypeChange"/>
    <post v-for="post in posts" :post="post" :key="post.id" />
    <paginate model="posts" @currentPageChange="onCurrentPageChange"/>
    <confirm-action @confirm="deletePost"> Êtes vous sûr de vouloir supprimer votre {{ data.type }} </confirm-action>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

import sidebar from "@/components/Sidebar";
import paginate from "@/components/Paginate";
import confirmAction from "@/components/confirmAction";
import post from "@/components/Post";

export default {
  name: 'Home',
  components: {post, sidebar, paginate, confirmAction },
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
    onCurrentPageChange(page) {
      this.$store.dispatch('posts/loadPosts', this.type === '' ? { page } : { page, type: this.type });
    },
    onTypeChange(type) {
      this.type = type;
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
