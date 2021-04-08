<template>
  <form class="my-3">
    {{ generalError }}
    <div class="row align-center">
      <div class="col-10">
        <img :src="image.path" class="preview" alt="image de profil">
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
import imagePreview from "@/utils/imagePreview";
export default {
  name: 'AddPostImage',
  data () {
    return {
      errors: {},
      generalError : '',
      image: {path : '/images/picture-icon.webp', file: null}
    }
  },
  methods: {
    async addPost() {
      const fd = new FormData();
      fd.append('post[type]', 2);
      fd.append('image', this.image.file, this.image.file.name);

      const resp = await this.$store.dispatch('posts/createPost', fd);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.generalError = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été posté' })
      await this.$router.push('/');
    },
    onFileChange(e) {
      this.image = imagePreview(e)
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
