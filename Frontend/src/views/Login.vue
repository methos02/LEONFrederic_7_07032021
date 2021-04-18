<template>
  <v-container class="login">
    <v-card class="pa-5">
      <h1>Connexion</h1>
      <form>
        <v-alert v-if="errors.general" color="red" type="error" text>
          <p class="mb-0">{{ errors.general }}</p>
          <p class="mb-0 mt-2" v-if="message"> Raison du ban : {{ message }}</p>
        </v-alert>
        <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
        <v-text-field
            v-model="userInfo.password"
            label="Password"
            :append-icon="showMdp ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showMdp = !showMdp"
            :type="showMdp ? 'text' : 'password'"
            :error-messages="errors.password"
        />
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
      showMdp:false,
      userInfo: {},
      errors: {},
      message: '',
    }
  },
  methods: {
    async userLogin () {
      this.errors = {};
      const resp = await this.$store.dispatch('userLogin', this.userInfo);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) {
        this.message = resp.data.message;
        return this.errors = { general : resp.data.error };
      }

      await this.$router.push('/');
    }
  }
}
</script>
