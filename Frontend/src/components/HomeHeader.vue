<template>
  <div class="div-home-header">
    <v-card class="share pa-2 my-5">
      <div class="share-title"> Partager </div>
      <v-btn-toggle class="d-flex">
        <v-btn class="flex" @click="$refs.file_image.click()">
          <v-icon class="mr-2"> mdi-file-image </v-icon>
          <span> image </span>
        </v-btn>
        <v-btn class="flex" :to="{name: 'AddArticle'}">
          <v-icon class="mr-2"> mdi-file-document </v-icon>
          <span> Article </span>
        </v-btn>
      </v-btn-toggle>
    </v-card>
    <v-dialog content-class="div-dialog-crop" v-model="dialog_crop" eager>
      <v-card class="card-dialog-crop d-flex">
        <v-btn class="btn-close grey--text white" @click="closeCropDialog" icon text small outlined elevation="4"><v-icon> mdi-close-circle-outline </v-icon></v-btn>
        <input id="image" ref="file_image" type="file" accept="image/*" @change="onFileChange" name="image" v-show="false">
        <div class="pa-2 text-center">
          <div class="px-3 pb-2 white">
            <v-textarea v-model="description" rows="1" auto-grow hide-details label="description"></v-textarea>
          </div>
          <div class="preview-img overflow-hidden">
            <img ref="image" :src="image.path" alt="image de profil">
          </div>
        </div>
        <div class="crop-controls px-2 d-flex justify-center">
          <div>
            <h2> Déplacer </h2>
            <v-btn-toggle>
              <v-btn @click="cropper.move(-10, 0)"><v-icon>mdi-chevron-left</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(10, 0)"><v-icon>mdi-chevron-right</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, -10)"><v-icon>mdi-chevron-up</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, 10)"><v-icon>mdi-chevron-down</v-icon></v-btn>
            </v-btn-toggle>
          </div>
          <div>
            <h2> Zoomer </h2>
            <v-btn-toggle>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(0.1)"><v-icon>mdi-magnify-plus</v-icon></v-btn>
              <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(-0.1)"><v-icon>mdi-magnify-minus</v-icon></v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <div class="crop-btn d-flex justify-space-between pa-2">
          <v-btn class="success" @click="addImage"> Ajouter </v-btn>
          <v-btn class="success" @click="$refs.file_image.click()"> Changer d'image </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { imagePreview } from "@/helpers/imageHelper";
import Cropper from "cropperjs";

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
        if(result === null) { return ;  }

        this.image = result;
        this.cropper.replace(result.path);
        this.dialog_crop = true;
      }).catch( error => {
        this.$refs.file_image.value = '';
        this.$store.dispatch('snackbar/setSnackbar', {text: error, type: 'error'})
      });
    },
    addImage() {
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const fd = new FormData();
        fd.append('post[type]', 2);
        fd.append('image', blob, this.image.file.name);

        if(this.description !== '') {
          fd.append('post[content]', this.description);
        }

        await this.$store.dispatch('posts/createPost', fd);
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre image a été posté' });
        await this.$store.dispatch('posts/loadPosts', {type : this.$route.params.type});
        this.closeCropDialog()
      }, 'image/jpg')
    },
    closeCropDialog() {
      this.dialog_crop = false;
      this.cropper.reset();
      this.description = '';
      this.image = {};
      this.$refs.file_image.value = '';
    }
  }
}
</script>
