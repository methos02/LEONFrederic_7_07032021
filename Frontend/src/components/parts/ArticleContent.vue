<template>
  <div>
    <div class="d-flex justify-space-between pa-3 div-image-meta">
      <div class="d-flex post-meta">
        <router-link v-if="post.User" :to="{ name: 'User', params: { slug : post.User.slug } }">
          <v-avatar class="post-meta-avatar white mr-3">
            <img :src="post.User.avatarPath" alt="image de profil">
          </v-avatar>
        </router-link>
        <div class="post-meta-infos">
          <router-link v-if="post.User" :to="{ name: 'User', params: { slug : post.User.slug } }">
            <div class="post-meta-author">{{ post.User.name }}</div>
          </router-link>
          <div class="post-meta-create">{{ post.formatCreatedAt }}</div>
        </div>
      </div>
      <div class="d-flex card-actions" v-if="has_action">
        <v-btn v-if="post.slug" :to="{ name: 'UpdateArticle', params: { slug : post.slug } }" class="mr-1 green white--text btn-edit" fab small><v-icon> mdi-pencil </v-icon> </v-btn>
        <v-btn @click="$emit('delete', { post_id : post.id, type : 'article' })" class="red white--text" fab small><v-icon> mdi-delete </v-icon> </v-btn>
      </div>
    </div>
    <div class="text-center">
      <img v-if="post.imagePath" :src="post.imagePath" class="post-image" alt="illustration du post" />
    </div>
    <router-link v-if="post.slug" :to="{ name: 'Post', params: { slug : post.slug } }">
      <v-card-title class="post-title">{{ post.title }}</v-card-title>
    </router-link>
    <v-card-text v-if="post.content">{{ post.content | abbreviate }}</v-card-text>
  </div>
</template>

<script>
import abbreviate from "@/helpers/abbreviateHelper";

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
