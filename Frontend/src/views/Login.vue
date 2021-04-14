<template>
  <v-container class="login">
    <v-card class="pa-5">
      <h1>Connexion</h1>
      <form>
        {{ generalError }}
        <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
        <v-text-field v-model="userInfo.password" label="Password" :error-messages="errors.password"/>
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
      generalError : ''
    }
  },
  methods: {
    async userLogin () {
      this.errors = {};
      this.generalError = '';

      const resp = await this.$store.dispatch('userLogin', this.userInfo);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.generalError = resp.data.error; }

      await this.$router.push('/');
    }
  }
}
</script>
