<template>
  <v-card class="card-post mb-2 mx-auto">
    <div class="d-flex justify-space-between pa-3 div-meta-image">
      <div class="d-flex image-meta">
        <v-avatar class="image-meta-avatar white mr-3">
          <img :src="post.User.avatarPath" alt="image de profil">
        </v-avatar>
        <div class="image-meta-infos">
          <div class="image-meta-author">{{ post.User.name }}</div>
          <div class="image-meta-create">{{ post.formatCreatedAt }}</div>
        </div>
      </div>
      <div class="d-flex card-actions">
        <v-btn :to="{ name: 'UpdateArticle', params: { id : post.id } }" class="mr-3 green white--text"><v-icon> mdi-pencil </v-icon> </v-btn>
        <v-btn @click="deleteConfirm(post.id)" class="red white--text"><v-icon> mdi-delete </v-icon> </v-btn></div>
    </div>
    <div class="text-center">
      <img v-if="post.imagePath" :src="post.imagePath" class="article-header" alt="illustration du post" />
    </div>
    <router-link :to="{ name: 'Post', params: { id : post.id } }">
      <v-card-title v-if="post.title">{{ post.title }}</v-card-title>
    </router-link>
    <v-card-text v-if="post.content">{{ post.content | abbreviate }}</v-card-text>
    <div class="d-flex justify-space-between align-center">
      <v-card-actions>
        <v-btn v-if="!post.showComment" @click="toggleComments(post.id)"> Afficher les commentaires </v-btn>
        <v-btn v-else @click="toggleComments(post.id)"> Cacher les commentaires </v-btn>
      </v-card-actions>
      <likes :post="post"></likes>
    </div>
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
    deleteConfirm(post_id) {
      this.$emit('delete', { post_id : post_id, type : 'article' });
    },
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
<style lang="scss" scoped>
.article-header {
  width: 100%;
}
</style>
