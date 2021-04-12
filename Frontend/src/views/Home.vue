<template>
  <v-container>
    <div v-for="post in posts" :key="post.id">
      <v-card class="pa-5 mb-2 post">
        <div class="text-center">
          <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" />
        </div>
        <router-link :to="{ name: 'Post', params: { id : post.id } }">
          <v-card-title v-if="post.title">{{ post.title }}</v-card-title>
        </router-link>
        <v-card-text v-if="post.content">{{ post.content | abbreviate }}</v-card-text>
        <v-card-actions>
          <v-btn v-if="!post.showComment" @click="toggleComments(post.id)"> Afficher les commentaires </v-btn>
          <v-btn v-else @click="toggleComments(post.id)"> Cacher les commentaires </v-btn>
        </v-card-actions>
        <div class="row justify-space-between card-actions">
          <span>
            <router-link :to="{ name: post.type === 1 ? 'UpdateArticle' : 'UpdateImage', params: { id : post.id } }"> <v-icon> mdi-pencil </v-icon> </router-link>
            <router-link :to="{ name: 'DeletePost', params: { id : post.id } }"> <v-icon> mdi-delete </v-icon> </router-link>
          </span>
          <likes :post="post"></likes>
        </div>
      </v-card>
      <div v-show="post.showComment">
        <comments :post_id="post.id"></comments>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import comments from '@/components/Comments'
import likes from "@/components/Likes";
import abbreviate from "@/utils/abbreviate";

export default {
  name: 'Home',
  components: { likes, comments },
  mounted() {
    this.$store.dispatch('posts/loadPosts');
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    })
  },
  filters: {
    abbreviate(text) {
      return abbreviate(text);
    }
  },
  methods: {
    toggleComments(post_id) {
      this.$store.dispatch('posts/toggleComments', post_id);
    },
  }
}
</script>

<style lang="scss" scoped>
.post {
  img { width: 60% }
}
</style>
