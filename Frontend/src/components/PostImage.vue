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
        <v-btn @click="editContent(post.id)"><v-icon> mdi-pencil </v-icon></v-btn>
        <v-btn @click="deletePost(post.id)">
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </div>
    </div>
    <v-card-text>
      <div v-if="isEdit === post.id">
        {{ errors.global }}
        <v-textarea v-model="post.content" :id="'editArticle' + post.id" :error-messages="errors.content"></v-textarea>
        <div class="row justify-end"> <v-btn class="col-2" @click="updateImage(post)">Mettre à jour</v-btn> </div>
      </div>
      <div v-else>
        {{ post.content }}
      </div>
    </v-card-text>
    <div class="text-center">
      <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" class="post-image"/>
    </div>
    <v-card-actions>
      <v-btn v-if="!post.showComment" @click="toggleComments(post.id)"> Afficher les commentaires </v-btn>
      <v-btn v-else @click="toggleComments(post.id)"> Cacher les commentaires </v-btn>
    </v-card-actions>
    <likes :post="post"></likes>
  </v-card>
</template>

<script>
import likes from "@/components/Likes";
import dispachError from "@/utils/sequelizeError";

export default {
  name: "PostImage",
  props: ['post'],
  components: { likes },
  data () {
    return {
      isEdit : '',
      errors: {},
    }
  },
  methods: {
    toggleComments(post_id) {
      this.$store.dispatch('posts/toggleComments', post_id);
    },
    editContent(post_id) {
      this.isEdit = post_id;
      setTimeout(() => document.getElementById('editArticle' + this.post.id).focus(), 1);
    },
    async updateImage(post) {
      const res = await this.$store.dispatch('posts/updateImage', post);

      if (res.status === 400) { return this.errors = dispachError(res.data);}
      if (res.status === 401) { return this.errors.global = res.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre entête a été modifié.' });
      this.isEdit = '';
    },
    async deletePost(post_id) {
      const res = await this.$store.dispatch('posts/deletePost', post_id);
      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été supprimée.' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-image {
  img { width: 60% }
}
</style>
