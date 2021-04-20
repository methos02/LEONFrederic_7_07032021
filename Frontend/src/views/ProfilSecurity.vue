<template>
  <div class="security">
    <form class="my-3">
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
              :error-messages="errors.name"
          />
          <v-text-field
              v-model="password.password"
              label="Nouveau Mot de passe"
              :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.password = !show.password"
              :type="show.password ? 'text' : 'password'"
              :error-messages="errors.email"
          />
          <v-text-field
              v-model="password.confirm"
              label="Confirmation"
              :append-icon="show.confirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show.confirm = !show.confirm"
              :type="show.confirm ? 'text' : 'password'"
              :error-messages="errors.email"
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
import dispachError from '/src/utils/sequelizeError';
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
    ...mapState(['current_user'])
  },
  methods: {
    async updatePassword () {
      this.errors = {};

      const resp = await this.$store.dispatch('updatePassword', this.password);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.errors.general = resp.data.error; }

      this.password = { old: '', password: '', confirm: ''};
      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre mot de passe a été modifié' })
    }
  }
}
</script>
