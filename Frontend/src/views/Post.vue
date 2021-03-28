<template>
  <v-container>
    <h1 v-if="post.title">{{ post.title }}</h1>
    <div v-html="post.content" v-if="post.content"></div>
    <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
    <div class="d-flex justify-end">
      <v-btn id="div-like" @click="like">
        <v-icon color="blue darken-2" >
          mdi-thumb-up
        </v-icon>
        <span> {{ post.like }}</span>
      </v-btn>
      <v-btn id="div-dislike" @click="dislike">
        <v-icon color="red darken-2" >
          mdi-thumb-down
        </v-icon>
        <span> {{ post.dislike }}</span>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Post',
  mounted() {
      this.$store.dispatch('loadPost', this.$route.params.id);
  },
  methods: {
    like() { this.$store.dispatch('likePost', {id: this.$route.params.id, like : 1}); },
    dislike() { this.$store.dispatch('likePost', {id: this.$route.params.id, like : -1}); }
  },
  computed: {
    post() { return this.$store.state.posts.find(post => post.id === this.$route.params.id); }
  }
}
</script>
