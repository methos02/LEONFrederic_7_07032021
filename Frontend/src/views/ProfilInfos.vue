<template>
  <v-container class="profil">
    <form class="my-3">
      <h1 class="mb5"> Modification du profile </h1>
      {{ errors.general }}
      <div class="row">
        <div class="col-4">
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
        <div class="row col-8 align-center">
          <div class="col">
            <v-text-field v-model="profil.name" label="Name" :error-messages="errors.name" />
            <v-text-field v-model="profil.email" label="Email" :error-messages="errors.email" />
          </div>
        </div>
      </div>
      <div class="row justify-center">
        <v-btn class="mx-3" @click="updateProfil"> Mettre à jour </v-btn>
        <v-btn class="white--text red mx-3" @click="openConfirm"> Supprimer le profil </v-btn>
      </div>
    </form>
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title> Êtes-vous sûr de vouloir supprimer votre compte ? </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" text  @click="deleteProfil"> Oui </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false"> Non </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import dispachError from '/src/utils/sequelizeError';
import imagePreview from "@/utils/imagePreview";
import {mapState} from "vuex";
import Cropper from "cropperjs";

export default {
  data () {
    return {
      errors: {},
      avatar: {},
      dialog: false,
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
  computed: {
    ...mapState(['current_user']),
    profil() {
      return {...this.current_user }
    }
  },
  methods: {
    openConfirm() {
      this.dialog = true;
    },
    async updateProfil () {
      this.errors = {};

      const fd = new FormData();
      let res = '';
      fd.append('user[name]', this.profil.name);
      fd.append('user[email]', this.profil.email);

      if(this.avatar.file != null) {
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          fd.append('avatar', blob, this.avatar.file.name);
          res = await this.$store.dispatch('updateProfil', fd);
        });
      } else {
        res = await this.$store.dispatch('updateProfil', fd);
      }

      if (res.status === 400) { return this.errors = dispachError(res.data);}
      if (res.status === 401) { return this.errors.general = res.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre profil a été mis à jour.' });
    },
    async deleteProfil() {
      const res = await this.$store.dispatch('deleteProfil', this.current_user.id);

      if (res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre profil a été supprimé.' });
        this.dialog = false;
        this.data = {};
        await this.$router.push('/login');
      }
    },
    onFileChange(e) {
      this.avatar = imagePreview(e)
      document.addEventListener('image-load', () => { this.cropper.replace(this.avatar.path); });
    },
  }
}
</script>
<style lang="scss" scoped>
.v-avatar {
  height: 200px;
  width: 200px;

  img { object-fit: cover }
}

.profil-copper-controle {
  display: block;
  text-align: center;
  margin: 15px 0;
}
</style>
