<template>
  <div class="div-search mr-5" :class="{'closed' : !showSearch}">
    <v-text-field
        @focus="showSearch = true"
        @blur="hideSearch"
        placeholder="Trouver un collègue"
        @keyup="searchUsers"
        v-model="search" dense
        autocomplete="off"
        prepend-inner-icon="mdi-magnify"
    />
    <div class="result-users pa-2" v-if="users.length !== 0">
      <router-link v-for="user in users" :key="user.id" :to="`/user/${ user.slug }`" class="result-users-link">
        <v-avatar><img :src="user.avatarPath" alt="image de profil"></v-avatar>
        <span class="ml-2">{{ user.name }}</span>
      </router-link>
    </div>
    <div class="result-users pa-5" v-else-if="search !== '' && users.length === 0">
      Aucun collègue trouvé.
    </div>
  </div>
</template>
<script>

import {mapState} from "vuex";
import verifParam from "@/helpers/verifParamHelper";

export default {
  data() {
    return {
      search : '',
      showSearch : false
    }
  },
  computed: {
    ...mapState({
      users: state => state.search.nav_search,
    })
  },
  methods: {
    async searchUsers() {
      if( this.search === '') { return; }

      if( !verifParam('slug', this.search) ) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'La recherche est invalide.', type: 'error' });
        return;
      }

      await this.$store.dispatch('search/searchNav', this.search);

      if( verifParam('slug', this.search) ) {
        await this.$store.dispatch('snackbar/resetSnackbar');
      }
    },
    hideSearch() {
      setTimeout(() => { this.showSearch = false}, 10)
    }
  },
  watch:{
    $route (){
      this.search = '';
      this.$store.dispatch('search/resetNavSearch');
      this.showSearch = false;
    }
  }
}
</script>
