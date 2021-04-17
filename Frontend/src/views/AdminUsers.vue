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
        <v-btn color="red" @click="openConfirm(user.id)"> Bannir </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title> Êtes-vous sûr de vouloir bannir cet utilisateur ? </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" text  @click="bannirUser"> Oui </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false"> Non </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { compareDate } from '../utils/date';

export default {
  mounted() {
    this.$store.dispatch('loadUsers');
  },
  data() {
    return {
      dialog: false,
      user_id: ''
    }
  },
  computed: {
    ...mapState(['users'])
  },
  methods: {
    openConfirm(user_id) {
      this.user_id = user_id
      this.dialog = true;
    },
    bannirUser() {
      this.$store.dispatch('banUser', this.user_id);
      this.dialog = false;
      this.user_id = '';
    },
    compareDate(date_1) {
      return compareDate(date_1);
    },
  }
}
</script>
