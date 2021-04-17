<template>
  <form class="my-3">
    {{ errors.general }}
    <div class="row justify-center">
      <v-card v-show="image.path === undefined">
        <h1> Partager un article </h1>
        <div class="text-center div-btn-select-image">
          <v-btn>
            <label for="image">
              <input id="image" ref="file_image" type="file" accept="image/*" @change="onFileChange" name="image" v-show="false">
              <v-icon>mdi-upload</v-icon>
              <span> Choisissez une image </span>
            </label>
          </v-btn>
        </div>
      </v-card>
      <v-card class="card-post pa-2 text-center" v-show="image.path">
        <div class="div-image-description px-3 pb-2 white">
          <v-textarea v-model="description" rows="1" auto-grow hide-details label="description"></v-textarea>
        </div>
        <div class="preview overflow-hidden">
          <img ref="image" :src="image.path" alt="image de profil">
        </div>
      </v-card>
      <div class="div-crop-tools d-flex align-center align-content-stretch" v-if="image.path">
        <div class="text-center div-btn-upload-image" v-show="image.file !== null">
          <h2> Déplacer </h2>
          <v-btn-toggle>
            <v-btn @click="cropperLeft"><v-icon>mdi-chevron-left</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropperRight"><v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropperUp"><v-icon>mdi-chevron-up</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropperDown"><v-icon>mdi-chevron-down</v-icon></v-btn>
          </v-btn-toggle>
          <h2> Zoomer </h2>
          <v-btn-toggle>
            <v-btn type="button" class="btn btn-secondary" @click="zoomUp"><v-icon>mdi-magnify-plus</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="zoomDown"><v-icon>mdi-magnify-minus</v-icon></v-btn>
          </v-btn-toggle>
          <div>
            <v-btn class="mx-3 success" @click="addPost"> Ajouter </v-btn>
            <v-btn class="mx-3 success" @click="$refs.file_image.click()"> Changer d'image </v-btn>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>

import dispachError from "@/utils/sequelizeError";
import imagePreview from "@/utils/imagePreview";
import Cropper from "cropperjs";

export default {
  name: 'AddPostImage',
  data () {
    return {
      errors: {},
      description: '',
      image: {},
      cropper: {}
    }
  },
  mounted() {
    this.cropper = new Cropper(this.$refs.image, {
      dragMode : 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      minContainerWidth: 600,
      minCropBoxHeight: 600,
      minCropBoxWidth: 600,
      guides: false,
      viewMode: 3,
      aspectRatio: 1
    });
  },
  methods: {
    cropperLeft() { this.cropper.move(-10, 0); },
    cropperRight() { this.cropper.move(10, 0); },
    cropperUp() { this.cropper.move(0, -10); },
    cropperDown() { this.cropper.move(0, 10); },
    zoomUp() { this.cropper.zoom(0.1); },
    zoomDown() { this.cropper.zoom(-0.1); },
    addPost() {
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const fd = new FormData();
        fd.append('post[type]', 2);
        fd.append('image', blob, this.image.file.name);

        if(this.description !== '') {
          fd.append('post[content]', this.description);
        }

        const resp = await this.$store.dispatch('posts/createPost', fd);

        if (resp.status === 400) { return this.errors = dispachError(resp.data);}
        if (resp.status === 401) { return this.errors.general = resp.data.error; }

        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été posté' })
        await this.$router.push('/');
      }, 'image/jpg')
    },
    onFileChange(e) {
      this.image = imagePreview(e);
      document.addEventListener('image-load', () => { this.cropper.replace(this.image.path); });
    },
  }
}
</script>
<style lang="scss" scoped>
@import "node_modules/cropperjs/src/css/cropper";

.card-post {
  .div-btn-select-image, .div-btn-upload-image {
    position: absolute;
    left: 0;
    right: 0;
  }

  .div-btn-select-image { bottom: 150px; }
  .div-btn-upload-image { bottom: 50px; }
}

.div-crop-tools {
  background-color: white;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
}
</style>
