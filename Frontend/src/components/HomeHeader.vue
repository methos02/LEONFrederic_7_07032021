<template>
  <div class="div-home-header">
    <v-card class="share pa-2 my-5">
      <div class="share-title"> Partager </div>
      <v-btn-toggle>
        <v-btn>
          <label for="image">
            <input id="image" ref="file_image" type="file" accept="image/*" @change="onFileChange" name="image" v-show="false">
            <v-icon class="mr-2"> mdi-file-image </v-icon>
            <span> image </span>
          </label>
        </v-btn>
        <v-btn :to="{name: 'AddArticle'}"><v-icon class="mr-2"> mdi-file-document </v-icon> Article</v-btn>
      </v-btn-toggle>
    </v-card>
    <v-dialog v-model="dialog_crop" eager>
      <v-card class="div-dialog-crop d-flex">
        <div class="pa-2 text-center">
          <div class="px-3 pb-2 white">
            <v-textarea v-model="description" rows="1" auto-grow hide-details label="description"></v-textarea>
          </div>
          <div class="preview-img overflow-hidden">
            <img ref="image" :src="image.path" alt="image de profil">
          </div>
        </div>
        <div class="div-crop-tools d-flex align-center align-content-stretch">
          <div class="text-center div-btn-upload-image" v-show="image.file !== null">
            <h2> Déplacer </h2>
            <v-btn-toggle>
              <v-btn @click="cropper.move(-10, 0)"><v-icon>mdi-chevron-left</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(10, 0)"><v-icon>mdi-chevron-right</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, -10)"><v-icon>mdi-chevron-up</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, 10)"><v-icon>mdi-chevron-down</v-icon></v-btn>
            </v-btn-toggle>
            <h2> Zoomer </h2>
            <v-btn-toggle>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(0.1)"><v-icon>mdi-magnify-plus</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(-0.1)"><v-icon>mdi-magnify-minus</v-icon></v-btn>
            </v-btn-toggle>
            <div>
              <v-btn class="mx-3 success" @click="addPost"> Ajouter </v-btn>
              <v-btn class="mx-3 success" @click="$refs.file_image.click()"> Changer d'image </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { imagePreview } from "@/utils/imageHelper";
import Cropper from "cropperjs";
import dispachError from "@/utils/sequelizeError";

export default {
  data() {
    return {
      dialog_crop: false,
      image : {},
      data: '',
      errors: {},
      description: '',
      cropper: {},
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
    onFileChange(e) {
      imagePreview(e).then(result => {
        this.image = result;
        this.cropper.replace(result.path);
        this.dialog_crop = true;
      });
    },
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

        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été posté' });
        await this.$store.dispatch('posts/loadPosts', {type : this.$route.params.type});
        this.dialog_crop = false;
        this.cropper.reset();
        this.description = '';
        this.image = {};
        this.$refs.file_image.value = '';
      }, 'image/jpg')
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
