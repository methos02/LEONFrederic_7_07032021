<template>
  <v-container class="login">
    <form>
      {{ generalError }}
      <v-text-field v-model="userInfo.name" label="name" :error-messages="errors.name"/>
      <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
      <v-text-field v-model="userInfo.password" label="Password" :error-messages="errors.password"/>
      <v-text-field v-model="userInfo.confirm" label="confirmation" :error-messages="errors.confirm"/>
      <v-btn @click="userLogin"> Login </v-btn>
    </form>
  </v-container>
</template>

<script>
import dispachError from '/src/utils/sequelizeError';

export default {
  data () {
    return {
      userInfo: {},
      errors: {},
      generalError : ''
    }
  },
  methods: {
    async userLogin () {
      this.errors = {};
      this.generalError = '';

      const resp = await this.$store.dispatch('userRegister', this.userInfo);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.generalError = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Merci de vous être enregistré, vous avez été automatiquement connecté.' })
      await this.$router.push('/');
    }
  }
}
</script>
