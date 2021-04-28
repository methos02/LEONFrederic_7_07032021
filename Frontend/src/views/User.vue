<template>
  <v-container class="container-user">
    <div class="text-center" v-if="user.slug === $route.params.slug">
      <v-avatar class="white" width="150px" height="150px">
        <img :src="user.avatarPath" alt="image de profil">
      </v-avatar>
      <h1 class="white--text"> {{ user.name }}</h1>
    </div>
    <post v-for="post in posts" :post="post" :key="post.id" @openConfirm="openConfirm"/>
    <paginate model="posts" @currentPageChange="onCurrentPageChange"/>
    <confirm-action @confirm="deletePost"> Êtes vous sûr de vouloir supprimer votre {{ data.type }} </confirm-action>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import post from "@/components/Post";
import paginate from "@/components/Paginate";
import confirmAction from "@/components/confirmAction";

export default {
  name: 'User',
  components: { post, paginate, confirmAction },
  data() {
    return { data: ''}
  },
  mounted() {
    this.$store.dispatch('posts/loadUserPost', { slug : this.$route.params.slug });
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
      user: state => state.user
    })
  },
  methods: {
    openConfirm(data) {
      this.$emit('openConfirm', true);
      this.data = data;
    },
    onCurrentPageChange(page) {
      this.$store.dispatch('loadUserPost', { page, slug : this.$route.params.slug });
    },
    async deletePost() {
      const res = await this.$store.dispatch('posts/deletePost', this.data.post_id);

      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été supprimée.' });
        this.dialog = false;
        this.data = {};
      }
    }
  }
}
</script>
