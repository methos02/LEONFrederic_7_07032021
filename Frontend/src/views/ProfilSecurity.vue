<template>
  <div class="security">
    <form class="my-3" @keyup.enter="updatePassword">
      <h3> Modification du mot de passe </h3>
      {{ errors.general }}
      <div class="row col-8 align-center justify-center">
        <div class="col">
          <v-text-field
              v-model="password.old"
              label="Ancien Mot de passe"
              :append-icon="show.old ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.old = !show.old"
              :type="show.old ? 'text' : 'password'"
              :error-messages="errors.old"
          />
          <v-text-field
              v-model="password.password"
              label="Nouveau Mot de passe"
              :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.password = !show.password"
              :type="show.password ? 'text' : 'password'"
              :error-messages="errors.password"
          />
          <v-text-field
              v-model="password.confirm"
              label="Confirmation"
              :append-icon="show.confirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.confirm = !show.confirm"
              :type="show.confirm ? 'text' : 'password'"
              :error-messages="errors.confirm"
          />
        </div>
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
      if (res.status === 401) { return this.errors.general = res.data.error; }
      if (res.status === 500) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error,  type: 'error' }); }

      this.password = { old: '', password: '', confirm: ''};
      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre mot de passe a été modifié' })
    }
  }
}
</script>
