<template>
  <v-container>
    <div class="text-center" v-if="user.slug === $route.params.slug">
      <v-avatar class="white">
        <img :src="user.avatarPath" alt="image de profil">
      </v-avatar>
      <h1> Profil de {{ user.name }}</h1>
    </div>
    <post v-for="post in posts" :post="post" :key="post.id" />
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import post from "@/components/Post";

export default {
  name: 'User',
  components: { post },
  mounted() {
    this.$store.dispatch('posts/loadUserPost', this.$route.params.slug);
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
      user: state => state.user
    })
  }
}
</script>
