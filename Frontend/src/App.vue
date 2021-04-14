<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <div class="d-flex align-center">
        <router-link :to="{name: 'Home'}">
          <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="/images/icon-left-font-monochrome-white.png"
              transition="scale-transition"
              width="220"
          />
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <div v-if="current_user.name !== undefined">
        <v-menu transition="slide-y-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="purple" color="primary mr-3" dark v-bind="attrs" v-on="on">
              Ajouter
            </v-btn>
          </template>
          <v-list>
            <v-list-item link :to="{name: 'AddImage'}">
              <v-list-item-title>Images</v-list-item-title>
            </v-list-item>
            <v-list-item link :to="{name: 'AddArticle'}">
              <v-list-item-title>Articles</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu transition="slide-y-transition" offset-y bottom >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on">
              Menu
            </v-btn>
          </template>
          <v-list>
            <v-list-item link :to="{name: 'Infos'}">
              <v-list-item-title>{{ current_user.name}}</v-list-item-title>
            </v-list-item>
            <v-list-item link :to="{name: 'Comments'}" v-if="current_user.isAdmin">
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="logout" text>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn  :to="{name: 'Register'}" text > Enregistrement </v-btn>
        <v-btn  :to="{name: 'Login'}" text > Login </v-btn>
      </div>
    </v-app-bar>
    <v-main class="grey">
      <router-view/>
    </v-main>
    <v-snackbar v-model="snackbar.show" :timeout="-1" color="success">
      {{ snackbar.text }}
      <v-btn text @click="resetSnackbar">X</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'App',
  async beforeCreate() {
    if(localStorage.getItem('token') !== null) {
      const resp = await this.$store.dispatch('getCurrentUser');

      if(resp === false) {
        localStorage.removeItem('token');
        await this.$router.push('/login');
      }
    }
  },
  computed: {
    ...mapState({
      current_user: 'current_user',
      snackbar: state => state.snackbar.snackbar,
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    resetSnackbar() {
      this.$store.dispatch('snackbar/resetSnackbar');
    }
  }
};
</script>
<style lang="scss">
@import "assets/css/app.scss";
</style>
