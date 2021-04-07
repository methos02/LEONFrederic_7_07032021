<template>
  <form class="my-3">
    {{ generalError }}
    <div class="row" v-if="type === 1">
      <div class="col align-center">
        <v-text-field v-model="post.title" label="Titre" :error-messages="errors.title" />
        <v-textarea v-model="post.content" label="Contenu" :error-messages="errors.content" />
      </div>
    </div>
    <div class="text-center" v-if="type === 1">
      <v-btn class="mx-3" @click="addPost"> Ajouter </v-btn>
    </div>
    <div class="row align-center" v-if="type === 2">
      <div class="col-10">
        <img :src="image" class="preview" alt="image de profil">
      </div>
      <div class="col-2">
        <div class="mb-10">
          <input type="file" accept="image/*" @change="onFileChange" name="image">
        </div>
        <div class="text-center">
          <v-btn class="mx-3" @click="addPost"> Ajouter </v-btn>
        </div>
      </div>
    </div>
  </form>
</template>
<script>

import dispachError from "@/utils/sequelizeError";

export default {
  props: ['type'],
  data () {
    return {
      errors: {},
      generalError : '',
      post: {},
      image: '/images/picture-icon.webp',
      file: null
    }
  },
  methods: {
    async addPost() {
      const fd = new FormData();
      if(this.type === 2) {
        fd.append('image', this.file, this.file.name);
      }

      if(this.type === 1) {
        fd.append('post[title]', this.post.title);
        fd.append('post[content]', this.post.content);
      }

      fd.append('post[type]', this.type);

      const resp = await this.$store.dispatch('posts/createPost', fd);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.generalError = resp.data.error; }

      const snacbarText = this.type === 1 ? 'Votre article a été posté' : 'Votre image a été posté';
      await this.$store.dispatch('snackbar/setSnackbar', { text: snacbarText })
      await this.$router.push('/');
    },
    onFileChange(e) {
      this.file = e.target.files[0];

      if(!this.file.type.match("image.*")) { return; }

      const reader = new FileReader();
      const me = this;

      reader.onload = function (e) {
        me.image = e.target.result;
      }

      reader.readAsDataURL(this.file);
    },
  },

}
</script>
<style lang="scss" scoped>
img {
  max-height: 60vh;
  max-width: 60%
}
</style>
