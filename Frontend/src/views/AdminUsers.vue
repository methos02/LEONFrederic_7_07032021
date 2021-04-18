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
        <v-btn color="red" @click="user_id = user.id"> Bannir </v-btn>
      </v-card-text>
      <div v-if="user_id === user.id" class="px-4 pb-4">
        <v-textarea v-model="message[user.id]" class="pt-0" auto-grow rows="1" placeholder="Raisons" hide-details></v-textarea>
        <div class="row justify-center text-center pt-3">
          <v-col>
            <v-btn @click="bannirUser" class="mx-1" color="success" > Confirmer </v-btn>
            <v-btn @click="dialog = false" class="mx-1" color="red" > Annuler </v-btn>
          </v-col>
        </div>
      </div>
    </v-card>
    <paginate model="users" @currentPageChange="onCurrentPageChange"/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { compareDate } from '../utils/date';
import paginate from '@/components/Paginate';

export default {
  components: { paginate },
  mounted() {
    this.$store.dispatch('loadUsers');
  },
  data() {
    return {
      dialog: false,
      user_id: '',
      message: {},
    }
  },
  computed: {
    ...mapState(['users'])
  },
  methods: {
    onCurrentPageChange(page) {
      this.$store.dispatch('loadUsers', page );
    },
    bannirUser() {
      this.$store.dispatch('banUser', {user_id : this.user_id, message : this.message[this.user_id]});
      this.user_id = '';
    },
    compareDate(date_1) {
      return compareDate(date_1);
    },
  }
}
</script>
