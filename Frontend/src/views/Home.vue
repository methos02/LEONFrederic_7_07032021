<template>
  <v-container class="pt-0 div-container">
    <sidebar @type="onTypeChange"/>
    <div v-for="post in posts" :key="post.id"  class="mt-10">
      <post_article v-if="post.type === 1" :post="post" @delete="deleteConfirm"></post_article>
      <post_image  v-if="post.type === 2" :post="post" @delete="deleteConfirm"></post_image>
      <div v-show="post.showComment">
        <comments :post_id="post.id" />
      </div>
    </div>
    <paginate model="posts" @currentPageChange="onCurrentPageChange"/>
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title> Êtes vous sûr de vouloir supprimer votre {{ data.type }} ? </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" text  @click="deletePost"> Oui </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false"> Non </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    return {
      type: '',
      dialog: false,
      data: {}
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
    deleteConfirm(data) {
      this.dialog = true;
      this.data = data;
    },
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
