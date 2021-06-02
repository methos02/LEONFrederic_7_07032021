<template>
  <v-container class="container-auth">
    <v-row class="div-auth flex-column flex-md-row" align-content="center">
      <v-col class="d-flex flex-column justify-center col-12 col-md-6">
        <h1 class="white--text mb-3 auth-title"> Bienvenue <br>sur le réseau social de <br>Groupomania</h1>
        <p class="white--text auth-subtitle"> spécialiste de la grande distribution</p>
      </v-col>
      <v-col class="col-12 col-md-5 offset-md-1">
        <v-card class="pa-5" v-if="page==='register'">
          <h2 class="title text-center">S'inscrire</h2>
          <form class="mb-2" @keyup.enter="userRegister">
            <div class="d-flex">
              <v-text-field v-model="userInfo.lastname" label="Nom" :error-messages="errors.lastname" class="mr-1"/>
              <v-text-field v-model="userInfo.firstname" label="Prénom" :error-messages="errors.firstname" class="ml-1"/>
            </div>
            <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
            <v-text-field
                v-model="userInfo.password"
                label="Password"
                :append-icon="show.register ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="show.register = !show.register"
                :type="show.register ? 'text' : 'password'"
                :error-messages="errors.password"
            />
            <v-text-field
                v-model="userInfo.confirm"
                label="Confirmation"
                :append-icon="show.confirm ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="show.confirm = !show.confirm"
                :type="show.confirm ? 'text' : 'password'"
                :error-messages="errors.confirm"
            />
            <div class="text-center">
              <v-btn class="secondary" width="150" @click="userRegister"> S'inscrire </v-btn>
            </div>
          </form>
          <v-card-text class="justify-center align-center d-flex flex-column flex-md-row">
            <span class="mr-2">Vous avez déjà un compte ?</span>
            <router-link to="/login">Se connecter</router-link>
          </v-card-text>
        </v-card>
        <v-card class="pa-5" v-if="page==='login'">
          <h2 class="title text-center">Connexion</h2>
          <form class="mb-2" @keyup.enter="userLogin">
            <v-alert v-if="errors.general" color="red" type="error" text>
              <p class="mb-0">{{ errors.general }}</p>
              <p class="mb-0 mt-2" v-if="message"> Raison du ban : {{ message }}</p>
            </v-alert>
            <v-text-field v-model="userInfo.email" label="Email" :error-messages="errors.email"/>
            <v-text-field
                v-model="userInfo.password"
                label="Password"
                :append-icon="show.login ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="show.login = !show.login"
                :type="show.login ? 'text' : 'password'"
                :error-messages="errors.password"
            />
            <div class="text-center">
              <v-btn class="secondary" width="150" @click="userLogin"> Login </v-btn>
            </div>
          </form>
          <v-card-text class="justify-center align-center d-flex flex-column flex-md-row">
            <span class="mr-2">Vous êtes nouveau ? </span><router-link to="/register"> S'inscrire </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {},
      errors: {},
      page: '',
      show: { login: false, register: false, confirm: false},
    }
  },
  mounted() {
    this.page = this.$route.params.page === 'register' ? 'register' : 'login'
  },
  methods: {
    async userRegister () {
      this.errors = {};
      const res = await this.$store.dispatch('auth/userRegister', this.userInfo);

      if (res.status === 400) { this.errors = res.data;}
      if( res.status === 201) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Merci de vous être enregistré, vous avez été automatiquement connecté.' })
        await this.$router.push('/');
      }
    },
    async userLogin () {
      this.errors = {};
      const res = await this.$store.dispatch('auth/userLogin', this.userInfo);

      if (res.status === 400) { this.errors = res.data;}
      if (res.status === 401) {
        this.message = res.data.message;
        return this.errors = { general : res.data.error };
      }

      if( res.status === 200) { await this.$router.push('/'); }
    }
  },
  watch:{
    $route (){
      this.page = this.$route.params.page === 'register' ? 'register' : 'login';
      this.errors = {};
      this.userInfo = {};
    }
  }
}
</script>
