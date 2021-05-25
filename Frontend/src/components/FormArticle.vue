<template>
  <form class="my-3">
    <v-card :class="{ 'pt-3' : image.error !== undefined }" class="pb-5 div-form-article">
      <div v-if="post.imagePath && image.path === undefined" class="article-image-container">
        <img class="article-image" height="250" :src="post.imagePath" alt="Entête de l'article">
      </div>
      <div v-show="image.path" class="article-image-container" id="article-image-container">
        <img ref="image" class="article-image" :src="image.path" alt="Entête de l'article">
      </div>
      <v-btn-toggle class="header-article-cropper-controle" v-show="image.path">
        <v-btn @click="cropper.move(-10, 0)"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-btn type="button" class="btn btn-secondary" @click="cropper.move(10, 0)"><v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, -10)"><v-icon>mdi-chevron-up</v-icon></v-btn>
        <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, 10)"><v-icon>mdi-chevron-down</v-icon></v-btn>
        <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(0.1)"><v-icon>mdi-magnify-plus</v-icon></v-btn>
        <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(-0.1)"><v-icon>mdi-magnify-minus</v-icon></v-btn>
      </v-btn-toggle>
      <input ref="file_image" type="file" accept="image/*" @change="onFileChange" name="image" v-show="false">
      <v-alert v-if="image.error" color="red" type="error" class="mx-5 mb-3" text>
        <p class="mb-0">{{ image.error }}</p>
      </v-alert>
      <div class="pt-5 text-center div-upload-banner">
        <v-btn class="mx-2" width="175" @click="$refs.file_image.click()">
          <span v-if="datas.image || image.path">Modifiler l'image</span>
          <span v-else> Ajouter une image </span>
        </v-btn>
        <v-btn class="mx-2" width="175" color="red" v-if="image.path !== undefined" @click="resetImage"> Annuler </v-btn>
      </div>
      <div class="px-5">
        <v-text-field v-model="datas.title" label="Titre" :error-messages="errors.title" />
        <v-textarea v-model="datas.content" label="Contenu" :error-messages="errors.content" />
      </div>
      <div class="text-center">
        <v-btn class="mx-3" v-if="post.id === undefined" @click="postUpdate()"> Ajouter </v-btn>
        <v-btn class="mx-3" v-else  @click="postUpdate()"> Mettre à jour </v-btn>
      </div>
    </v-card>
  </form>
</template>
<script>
import {imagePreview, addImgToFormData} from "@/helpers/imageHelper";
import Cropper from "cropperjs";

export default {
  props: ['post', 'errors'],
  data() {
    return {
      image : {},
      cropper: {}
    }
  },
  mounted() {
    this.cropper = new Cropper(this.$refs.image, {
      dragMode : 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      minCropBoxHeight: 400,
      minCropBoxWidth: 1000,
      guides: false,
      viewMode: 3,
    });
  },
  computed: {
    datas() {
      return this.post
    }
  },
  methods: {
    async postUpdate() {
      let fd = new FormData();

      if(this.datas.title !== undefined)  { fd.append('post[title]', this.datas.title); }
      if(this.datas.content !== undefined)  { fd.append('post[content]', this.datas.content); }
      fd = await addImgToFormData(this.cropper, this.image.file, fd, 'image');
      if(this.post.id === undefined)  {  fd.append('post[type]', 1); }

      this.$emit('post', fd);
    },
    resetImage() {
      this.image.path = undefined;
      this.$refs.file_image.value = null;
    },
    onFileChange(e) {
      this.image = {};

      imagePreview(e).then( image => {
        this.cropper.replace(image.path);
        this.image = image;
      }).catch( error => this.image = { error });
    },
  }
}
</script>
