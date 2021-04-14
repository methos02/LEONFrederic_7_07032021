<template>
<v-card id="div-sidebar" class="div-sidebar pa-3 grey lighten-2">
  <v-btn class="grey darken-2 d-block mb-2" title="Tous" @click="getAll">
    <v-icon color="white"> mdi-folder-multiple </v-icon>
  </v-btn>
  <v-btn class="grey darken-2 d-block mb-2" title="Images" @click="getByType('images')">
    <v-icon color="white"> mdi-file-image </v-icon>
  </v-btn>
  <v-btn class="grey darken-2 d-block"  title="Articles" @click="getByType('articles')">
    <v-icon color="white"> mdi-file-document </v-icon>
  </v-btn>
</v-card>
</template>

<script>
export default {
  name: "sidebar",
  methods: {
    getByType( type ) {
      this.$store.dispatch('posts/getByType', type);
    },
    getAll() {
      this.$store.dispatch('posts/loadPosts');
    }
  }
}
</script>

<style scoped>
.div-sidebar {
  position: fixed;
  top: 90px;
  left: 120px;
  bottom: 80px;
}
</style>
