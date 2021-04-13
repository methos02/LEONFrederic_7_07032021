<template>
  <v-container>
    <h1 class="mb-5"> Utilisateurs</h1>
    <v-card v-for="user in users" :key="user.id" class="mb-5">
      <v-card-text class="row">
        <span class="flex col">
          {{ user.name }}
          <span v-if="user.nbBan !== 0"> - nombre de ban {{ user.nbBan}} </span>
          <span v-if="compareDate(user.banUntil)">- date de ban {{ user.formatBanUntil }}</span>
        </span>
        <v-btn color="red" @click="bannirUser(user.id)"> Bannir </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { compareDate } from '../utils/date';

export default {
  mounted() {
    this.$store.dispatch('loadUsers');
  },
  computed: {
    ...mapState(['users'])
  },
  methods: {
    bannirUser(user_id) {
      this.$store.dispatch('banUser', user_id)
    },
    compareDate(date_1) {
      return compareDate(date_1);
    }
  }
}
</script>
