<template>
  <v-container>
    <h1> Utilisateurs</h1>
    <v-card v-for="user in users" :key="user.id" class="mb-2 ">
      <v-card-text >{{ user.name }} - nombre de ban {{ user.nbBan}} - date de ban {{ user.banUntil }}</v-card-text>
      <v-btn color="red" @click="bannirUser(user.id)"> Bannir </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

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
    }
  }
}
</script>
