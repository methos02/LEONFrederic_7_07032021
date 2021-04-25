<template>
  <form class="my-3">
    {{ errors.global }}
    <v-card class="pb-5 div-form-article">
      <div v-if="post.imagePath && image.path === undefined" class="article-image-container">
        <img class="article-image" height="250" :src="post.imagePath" alt="Entête de l'article">
      </div>
      <div v-show="image.path" class="article-image-container">
        <img ref="image" class="article-image" height="250" :src="image.path" alt="Entête de l'article">
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
      <div class="pt-5 text-center">
        <v-btn class="mx-2" width="175" @click="$refs.file_image.click()">
          <span v-if="datas.image || image.path">Modifiler l'image</span>
          <span v-else> Ajouter une image </span>
        </v-btn>
        <v-btn class="mx-2" width="175" color="red" v-if="image.path !== undefined" @click="image.path = undefined"> Annuler </v-btn>
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
import {imagePreview, addImgToFormData} from "@/utils/imageHelper";
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
      minCropBoxHeight: 250,
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

      fd.append('post[title]', this.datas.title);
      fd.append('post[content]', this.datas.content);
      fd = await addImgToFormData(this.cropper, this.image.file, fd, 'image');
      if(this.post.id === undefined)  {  fd.append('post[type]', 1); }

      this.$emit('post', fd);
    },
    onFileChange(e) {
      this.image = imagePreview(e);
      document.addEventListener('image-load', () => { this.cropper.replace(this.image.path); });
    },
  }
}
</script>
<style lang="scss" scoped>
.div-form-article {
  width: 1000px;
  margin: auto;
}

.article-image-container {
  height: 250px;
}

.article-image {
  object-fit: cover;
  width: 100%;
}

.header-article-cropper-controle {
  display: block;
  text-align: center;
  margin-top: 15px;
}
</style>
