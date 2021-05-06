<template>
  <v-app class="groupamania network">
    <v-app-bar app class="navbar">
      <div class="d-flex align-center">
        <router-link :to="{name: 'Home'}">
          <v-img alt="logo groupomania" class="shrink mr-2 hidden-xs-only" contain src="/images/groupomania-logo.png" transition="scale-transition" width="220"/>
          <v-img alt="logo groupomania" class="shrink mr-2 d-sm-none" contain src="/images/groupomania-logo-icon.png" transition="scale-transition" width="30"/>
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <searchNav v-if="current_user.name !== undefined" />
      <div v-if="current_user.name !== undefined">
        <v-menu transition="slide-y-transition" offset-y bottom >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on">
              <span>Menu</span>
              <v-icon>{{ attrs['aria-expanded'] !== 'true'? 'mdi-menu-down' : 'mdi-menu-up' }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item link :to="{name: 'Infos'}">
              <v-list-item-title>{{ current_user.name}}</v-list-item-title>
            </v-list-item>
            <v-list-item link :to="{name: 'Comments'}" v-if="current_user.roles.find( role => role === 'modo')">
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="logout" text>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main class="container-main">
      <router-view/>
    </v-main>
    <v-snackbar v-model="snackbar.show" :timeout="-1" :color="snackbar.type !== undefined ? snackbar.type : 'success'">
      {{ snackbar.text }}
      <v-btn text @click="resetSnackbar">X</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import searchNav from '@/components/SearchNav'
export default {
  name: 'App',
  components: { searchNav },
  async beforeCreate() {
    if(localStorage.getItem('token') !== null) {
      const resp = await this.$store.dispatch('auth/getCurrentUser');

      if(resp === false) {
        localStorage.removeItem('token');
        await this.$router.push('/login');
      }
    }
  },
  computed: {
    ...mapState({
      current_user: state => state.auth.current_user,
      snackbar: state => state.snackbar.snackbar,
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    resetSnackbar() {
      this.$store.dispatch('snackbar/resetSnackbar');
    }
  }
};
</script>
<style lang="scss">
.groupamania.network {
  @import "assets/css/app.scss";
}
</style>
