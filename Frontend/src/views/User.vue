<template>
  <v-container>
    <div class="text-center">
      <v-avatar class="white">
        <img :src="user.avatarPath" alt="image de profil">
      </v-avatar>
      <h1> Profil de {{ user.name }}</h1>
    </div>
    <post v-for="post in user.Posts" :post="post" :key="post.id" />
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import post from "@/components/Post";

export default {
  name: 'User',
  components: { post },
  mounted() {
    this.$store.dispatch('profil/loadProfil', this.$route.params.slug);
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      user: state => state.profil.user,
    })
  }
}
</script>
