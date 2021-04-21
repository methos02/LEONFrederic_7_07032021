<template>
  <div>
    <div class="d-flex justify-space-between pa-3 div-image-meta">
      <div class="d-flex image-meta">
        <v-avatar class="image-meta-avatar white mr-3">
          <img :src="post.User.avatarPath" alt="image de profil">
        </v-avatar>
        <div class="image-meta-infos">
          <div class="image-meta-author">{{ post.User.name }}</div>
          <div class="image-meta-create">{{ post.formatCreatedAt }}</div>
        </div>
      </div>
      <div class="d-flex card-actions" v-if="has_action">
        <v-btn :to="{ name: 'UpdateArticle', params: { id : post.id } }" class="mr-1 green white--text" fab small><v-icon> mdi-pencil </v-icon> </v-btn>
        <v-btn @click="$emit('delete', { post_id : post.id, type : 'article' })" class="red white--text" fab small><v-icon> mdi-delete </v-icon> </v-btn></div>
    </div>
    <div class="text-center">
      <img v-if="post.imagePath" :src="post.imagePath" class="article-header" alt="illustration du post" />
    </div>
    <router-link :to="{ name: 'Post', params: { id : post.id } }">
      <v-card-title v-if="post.title">{{ post.title }}</v-card-title>
    </router-link>
    <v-card-text v-if="post.content">{{ post.content | abbreviate }}</v-card-text>
  </div>
</template>

<script>
import abbreviate from "@/utils/abbreviate";

export default {
  name: "PostArticle",
  props: ['post', 'has_action'],
  filters: {
    abbreviate(text) {
      return abbreviate(text);
    }
  }
}
</script>
<style lang="scss" scoped>
.article-header {
  width: 100%;
}
</style>
