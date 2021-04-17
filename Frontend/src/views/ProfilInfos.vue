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

export default {
  data () {
    return {
      errors: {},
      generalError : '',
      avatar: {file: null, path : null},
      dialog: false
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
    openConfirm() {
      this.dialog = true;
    },
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
