<template>
  <v-container class="container-user">
    <div class="text-center" v-if="user.slug === $route.params.slug">
      <v-avatar class="white" width="150px" height="150px">
        <img :src="user.avatarPath" alt="image de profil">
      </v-avatar>
      <h1 class="white--text"> {{ user.name }}</h1>
      <div v-if="current_user.roles.find( role => role === 'admin')">
        <v-btn class="red white--text" v-if="user.roles.find( role => role === 'modo')" @click="updateRole([])"> Supprimer les droits </v-btn>
        <v-btn class="green white--text" v-else @click="updateRole(['modo'])"> Devenir modérateur </v-btn>
      </div>
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
import verifParam from "@/helpers/verifParamHelper";

export default {
  name: 'User',
  components: { post, paginate, confirmAction },
  data() {
    return { data: ''}
  },
  async mounted() {
    if( !verifParam('slug', this.$route.params.slug) ) {
      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Le paramètre est invalide.', type: 'error' });
      await this.$router.push('/');
      return;
    }

    const res = await this.$store.dispatch('posts/loadUserPost', { slug : this.$route.params.slug });

    if(res.status === 404) {
      await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error, type: 'error' });
      await this.$router.push('/');
    }
  },
  computed: {
    ...mapState({
      current_user: state => state.auth.current_user,
      posts: state => state.posts.posts,
      user: state => state.user.user
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
    },
    async updateRole(roles) {
      const res = await this.$store.dispatch('admin/updateRoles', { user_id : this.user.id, roles: roles });

      if( res.status === 200) { await this.$store.dispatch('snackbar/setSnackbar', { text: roles.length === 0 ? "L'utilsateur n'est plus modérateur." : "Droit de modération ajouté à l'utilisateur." });}
      if( res.status === 400) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.roles, type: 'error' });}
      if (res.status === 500) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error,  type: 'error' }); }
    },
  },
  watch:{
    $route (){
      this.$store.dispatch('posts/loadUserPost', { slug : this.$route.params.slug });
    }
  }
}
</script>
