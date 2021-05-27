<template>
  <div class="container-profil">
    <form class="my-3">
      <h1 class="my-3 text-center"> Modification du profile </h1>
      <div class="row px-3">
        <div class="col-12 col-sm-5 col-md-4">
          <div class="text-center">
            <div class="v-avatar mb-4">
              <img v-show="avatar.path === undefined" :src="current_user.avatarPath" class="preview" alt="image de profil">
              <img v-show="avatar.path" ref="avatar"  :src="avatar.path" class="preview" alt="image de profil">
            </div>
          </div>
          <input ref="avatar_input" type="file" accept="image/*" @change="onFileChange" name="avatar" v-show="false">
          <v-btn-toggle class="profil-copper-controle" v-show="avatar.path">
            <v-btn @click="cropper.move(-10, 0)"><v-icon>mdi-chevron-left</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropper.move(10, 0)"><v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, -10)"><v-icon>mdi-chevron-up</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropper.move(0, 10)"><v-icon>mdi-chevron-down</v-icon></v-btn>
          </v-btn-toggle>
          <v-btn-toggle class="profil-copper-controle" v-show="avatar.path">
            <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(0.1)"><v-icon>mdi-magnify-plus</v-icon></v-btn>
            <v-btn type="button" class="btn btn-secondary" @click="cropper.zoom(-0.1)"><v-icon>mdi-magnify-minus</v-icon></v-btn>
          </v-btn-toggle>
          <div class="text-center">
            <v-btn @click="$refs.avatar_input.click()">Changer d'image</v-btn>
          </div>
        </div>
        <div class="col-12 col-sm-7 col-md-8 align-center">
          <div class="row">
            <v-text-field v-model="profil.lastname" label="Nom" class="col-6 col-sm-12 col-md-6" :error-messages="errors.lastname" />
            <v-text-field v-model="profil.firstname" label="Prénom" class="col-6 col-sm-12 col-md-6" :error-messages="errors.firstname" />
          </div>
          <v-text-field v-model="profil.email" label="Email" :error-messages="errors.email" />
        </div>
      </div>
      <div class="row justify-center btns-action">
        <v-btn class="mx-3" @click="updateProfil"> Mettre à jour </v-btn>
        <v-btn class="white--text red mx-3" @click="$emit('openConfirm', true)"> Supprimer le profil </v-btn>
      </div>
    </form>
    <confirm-action @confirm="deleteProfil"> Êtes-vous sûr de vouloir supprimer votre compte ? </confirm-action>
  </div>
</template>
<script>

import {addImgToFormData, imagePreview} from "@/helpers/imageHelper";
import {mapState} from "vuex";
import Cropper from "cropperjs";
import confirmAction from "../components/confirmAction";

export default {
  data () {
    return {
      errors: {},
      avatar: {},
      cropper: {}
    }
  },
  mounted() {
    this.cropper = new Cropper(this.$refs.avatar, {
      dragMode : 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      minContainerWidth: 200,
      minCropBoxHeight: 200,
      minCropBoxWidth: 200,
      guides: false,
      viewMode: 3,
      aspectRatio: 1
    });
  },
  components: { confirmAction },
  computed: {
    ...mapState({ current_user: state => state.auth.current_user }),
    profil() {
      return {...this.current_user }
    }
  },
  methods: {
    async updateProfil () {
      this.errors = {};
      let fd = new FormData();

      fd.append('user[lastname]', this.profil.lastname);
      fd.append('user[firstname]', this.profil.firstname);
      fd.append('user[email]', this.profil.email);
      fd = await addImgToFormData(this.cropper, this.avatar.file, fd, 'avatar');

      const res = await this.$store.dispatch('auth/updateProfil', fd);

      if (res.status === 400) { return this.errors = res.data;}

      if( res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre profil a été mis à jour.' });
        this.avatar = {}
        this.$refs.avatar_input.value = null;
      }
    },
    async deleteProfil() {
      const res = await this.$store.dispatch('auth/deleteProfil', this.current_user.id);

      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre profil a été supprimé.' });
        this.dialog = false;
        this.data = {};
        await this.$router.push('/login');
      }
    },
    onFileChange(e) {
      imagePreview(e).then((avatar) => {
        this.cropper.replace(avatar.path);
        this.avatar = avatar;
      }).catch( error => {
        this.$refs.avatar.value = '';
        this.$store.dispatch('snackbar/setSnackbar', {text: error, type: 'error'})
      });
    },
  }
}
</script>
