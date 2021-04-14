<template>
  <form class="my-3">
    {{ errors.general }}
    <div class="row justify-center">
      <v-card class="card-post text-center">
        <div class="div-image-description px-3 pb-2 white">
          <v-textarea v-model="description" rows="1" auto-grow hide-details label="description"></v-textarea>
        </div>
        <img :src="image.path" v-if="image.path !== undefined" class="pa-2 preview" alt="image de profil">
        <img src="/images/picture-icon.webp" v-if="image.path === undefined" class="mt-10" alt="image de profil">
        <div class="text-center div-btn-select-image">
          <v-btn>
            <label for="image">
              <input id="image" type="file" accept="image/*" @change="onFileChange" name="image" v-show="false">
              <v-icon>mdi-upload</v-icon>
              <span> Choisissez une image </span>
            </label>
          </v-btn>
        </div>
        <div class="text-center div-btn-upload-image" v-show="image.file !== null">
          <v-btn class="mx-3 success" @click="addPost"> Ajouter </v-btn>
        </div>
      </v-card>
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
      description: '',
      image: {}
    }
  },
  methods: {
    async addPost() {
      const fd = new FormData();
      fd.append('post[type]', 2);
      fd.append('image', this.image.file, this.image.file.name);

      if(this.description !== '') {
        fd.append('post[content]', this.description);
      }

      const resp = await this.$store.dispatch('posts/createPost', fd);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.errors.general = resp.data.error; }

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
.card-post {
  height: 600px;

  .div-btn-select-image, .div-btn-upload-image {
    position: absolute;
    left: 0;
    right: 0;
  }

  .div-btn-select-image { bottom: 150px; }
  .div-btn-upload-image { bottom: 50px; }
}
</style>
