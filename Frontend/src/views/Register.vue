<template>
  <v-container class="login">
    <v-card class="pa-5">
      <h1>Enregistrement</h1>
      <form>
        {{ errors.general }}
        <v-text-field v-model="userInfo.name" label="name" :error-messages="errors.name"/>
        <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
        <v-text-field v-model="userInfo.password" label="Password" :error-messages="errors.password"/>
        <v-text-field v-model="userInfo.confirm" label="confirmation" :error-messages="errors.confirm"/>
        <v-btn @click="userLogin"> Login </v-btn>
      </form>
    </v-card>
  </v-container>
</template>

<script>
import dispachError from '/src/utils/sequelizeError';

export default {
  data () {
    return {
      userInfo: {},
      errors: {},
    }
  },
  methods: {
    async userLogin () {
      this.errors = {};
      const resp = await this.$store.dispatch('userRegister', this.userInfo);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.errors.general = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Merci de vous être enregistré, vous avez été automatiquement connecté.' })
      await this.$router.push('/');
    }
  }
}
</script>
