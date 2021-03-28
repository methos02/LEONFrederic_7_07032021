<template>
  <v-container>
    <v-card v-for="post in posts" :key="post.id" class="mb-2 ">
      <router-link :to="{ name: 'Post', params: { id : post.id } }">
        <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
        <v-card-title v-if="post.title">{{ post.title }}</v-card-title>
        <v-card-text v-if="post.content">{{ post.content }}</v-card-text>
      </router-link>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Home',
  mounted() {
      this.$store.dispatch('loadPosts');
  },
  computed: {
    ...mapState(['posts'])
  }
}
</script>
