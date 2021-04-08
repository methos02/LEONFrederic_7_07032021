<template>
  <v-container class="profil">
    <form class="my-3">
      <h3> Modification du profile </h3>
      {{ generalError }}
      <div class="row">
        <div class="col-4">
          <div class="v-avatar mb-4">
            <img :src="avatar.path !== null ? avatar.path : current_user.avatarPath" class="preview" alt="image de profil">
          </div>
          <input type="file" accept="image/*" @change="onFileChange" name="images">
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
        <v-btn class="white--text red mx-3" @click="updateProfil"> Supprimer le profil </v-btn>
      </div>
    </form>
  </v-container>
</template>
<script>
import dispachError from '/src/utils/sequelizeError';
import imagePreview from "@/utils/imagePreview";
import {mapState} from "vuex";

export default {
  data () {
    return {
      errors: {},
      generalError : '',
      avatar: {file: null, path : null},
    }
  },
  computed: {
    ...mapState(['current_user']),
    profil() {
      return {
        name: this.current_user.name,
        email: this.current_user.email
      }
    }
  },
  methods: {
    async updateProfil () {
      this.errors = {};
      this.generalError = '';

      const fd = new FormData();
      if(this.avatar.file != null) {
        fd.append('avatar', this.avatar.file, this.avatar.file.name);
      }

      fd.append('user[name]', this.profil.name);
      fd.append('user[email]', this.profil.email);

      const resp = await this.$store.dispatch('updateProfil', fd);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.generalError = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre profil a été mis à jour.' })
    },
    onFileChange(e) {
      this.avatar = imagePreview(e)
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
</style>
