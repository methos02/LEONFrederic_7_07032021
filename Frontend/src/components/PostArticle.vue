<template>
  <v-card class="pa-5 mb-2 post">
    <div class="row justify-space-between align-start">
      <div class="row col image-meta">
        <v-avatar>
          <img :src="post.User.avatarPath" class="preview" alt="image de profil">
        </v-avatar>
        <div class="image-meta-infos">
          <div class="image-meta-author">{{ post.User.name }}</div>
          <div class="image-meta-create">{{ post.formatCreatedAt }}</div>
        </div>
      </div>
      <div class="row col justify-end card-actions mt-0">
          <v-btn :to="{ name: 'UpdateArticle', params: { id : post.id } }"> <v-icon> mdi-pencil </v-icon> </v-btn>
          <v-btn @click="deletePost(post.id)"> <v-icon> mdi-delete </v-icon> </v-btn>
      </div>
    </div>
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
    <likes :post="post"></likes>
  </v-card>
</template>

<script>
import abbreviate from "@/utils/abbreviate";
import likes from "@/components/Likes";

export default {
  name: "PostArticle",
  props: ['post'],
  components: { likes },
  filters: {
    abbreviate(text) {
      return abbreviate(text);
    }
  },
  methods: {
    toggleComments(post_id) {
      this.$store.dispatch('posts/toggleComments', post_id);
    },
    async deletePost(post_id) {
      const res = await this.$store.dispatch('posts/deletePost', post_id);
      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été supprimée.' })
      }
    }
  }
}
</script>

<style scoped>

</style>
