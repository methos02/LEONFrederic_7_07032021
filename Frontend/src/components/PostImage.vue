<template>
  <v-card class="card-post mx-auto">
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
        <v-btn @click="editContent(post.id)" class="mr-3 green white--text" v-if="isEdit === ''"><v-icon> mdi-pencil </v-icon></v-btn>
        <v-btn @click="closeEditImage" class="mr-3" v-if="isEdit === post.id"><v-icon> mdi-close </v-icon></v-btn>
        <v-btn @click="deleteConfirm(post.id)" class="red white--text"> <v-icon> mdi-delete </v-icon> </v-btn>
      </div>
    </div>
    <div class="post-image-body">
      <v-card-text class="div-image-description white pt-1">
        <div v-if="isEdit === post.id">
          {{ errors.global }}
          <v-textarea v-model="post.content" :id="'editArticle' + post.id" :error-messages="errors.content" rows="1" auto-grow hide-details></v-textarea>
          <div class="d-flex justify-end mt-3"> <v-btn @click="updateImage(post)">Mettre à jour</v-btn> </div>
        </div>
        <div v-else>
          {{ post.content }}
        </div>
      </v-card-text>
    </div>
    <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" class="preview pa-2">
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
    closeEditImage() {
      this.isEdit = '';
    },
    deleteConfirm(post_id) {
      this.$emit('delete', { post_id : post_id, type : 'image'});
    },
    async updateImage(post) {
      const res = await this.$store.dispatch('posts/updateImage', post);

      if (res.status === 400) { return this.errors = dispachError(res.data);}
      if (res.status === 401) { return this.errors.global = res.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre entête a été modifié.' });
      this.isEdit = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.card-post {
 .div-meta-image {
    position: relative;
    z-index: 2;
  }
  .post-image-body { position: relative; }
}
</style>
