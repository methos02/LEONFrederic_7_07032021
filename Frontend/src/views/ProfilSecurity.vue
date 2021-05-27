<template>
  <div class="container-profil">
    <form class="my-3" @keyup.enter="updatePassword">
      <h1 class="my-3 text-center"> Modification du mot de passe </h1>
      <div class="row col-12 col-sm-9 mx-auto align-center justify-center">
          <v-text-field
              v-model="password.old"
              label="Ancien Mot de passe"
              class="col-12"
              :append-icon="show.old ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.old = !show.old"
              :type="show.old ? 'text' : 'password'"
              :error-messages="errors.old"
          />
          <v-text-field
              v-model="password.password"
              label="Nouveau Mot de passe"
              class="col-12"
              :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.password = !show.password"
              :type="show.password ? 'text' : 'password'"
              :error-messages="errors.password"
          />
          <v-text-field
              v-model="password.confirm"
              label="Confirmation"
              class="col-12"
              :append-icon="show.confirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.confirm = !show.confirm"
              :type="show.confirm ? 'text' : 'password'"
              :error-messages="errors.confirm"
          />
      </div>
      <div class="row justify-center">
        <v-btn class="mx-3" @click="updatePassword"> Mettre à jour </v-btn>
      </div>
    </form>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  data () {
    return {
      errors: {},
      show: { old: false, password: false, confirm: false},
      password: { old: '', password: '', confirm: ''},
    }
  },
  computed: {
    ...mapState({ current_user: state => state.auth.current_user })
  },
  methods: {
    async updatePassword () {
      this.errors = {};

      const res = await this.$store.dispatch('auth/updatePassword', this.password);

      if (res.status === 400) { return this.errors = res.data;}

      this.password = { old: '', password: '', confirm: ''};
      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre mot de passe a été modifié' })
    }
  }
}
</script>
