<template>
  <v-container>
    <h1 class="mb-5"> Utilisateurs</h1>
    <div v-for="user in users" :key="user.id"  class="mb-5">
      <div class="d-flex">
        <v-avatar class="comment-meta-avatar white mr-3">
          <img :src="user.avatarPath" alt="image de profil">
        </v-avatar>
        <v-card class="flex d-flex align-center">
          <div class="py-4 px-8 flex">
            <span class="font-weight-bold text-body-1">{{ user.name }} </span>
            <span class="font-weight-light text-body-2">{{ user.email }} </span>
            <span v-if="user.nbBan !== 0"> - nombre de ban {{ user.nbBan}} </span>
            <span v-if="compareDate(user.banUntil)">- date de ban {{ user.formatBanUntil }}</span>
          </div>
          <v-card-actions>
            <v-btn color="red" @click="user_id = user.id"> Bannir </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-card v-if="user_id === user.id" class="ml-15 mt-4 pa-4">
        <v-textarea v-model="message[user.id]" class="pt-0" auto-grow rows="1" placeholder="Raisons" hide-details></v-textarea>
        <div class="d-flex justify-center text-center pt-3">
          <v-btn @click="bannirUser" class="mx-1" color="success" > Confirmer </v-btn>
          <v-btn @click="user_id = ''" class="mx-1" color="red" > Annuler </v-btn>
        </div>
      </v-card>
    </div>
    <paginate model="users" @currentPageChange="onCurrentPageChange"/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { compareDate } from '../utils/date';
import paginate from '@/components/Paginate';

export default {
  name: 'AdminUsers',
  components: { paginate },
  mounted() {
    this.$store.dispatch('loadUsers');
  },
  data() {
    return {
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
