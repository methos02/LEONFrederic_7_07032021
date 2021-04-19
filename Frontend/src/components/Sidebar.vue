<template>
<v-card id="div-sidebar" class="div-sidebar pa-3 grey lighten-2">
  <v-btn class="grey darken-2 d-block mb-2" title="Tous" @click="getByType('all')">
    <v-icon color="white"> mdi-folder-multiple </v-icon>
    <span class="white--text ml-2"> Tous </span>
  </v-btn>
  <v-btn color="white" class="grey darken-2 d-block mb-2" title="Images" @click="getByType('images')">
    <v-icon color="white"> mdi-file-image </v-icon>
    <span class="white--text ml-2"> Images </span>
  </v-btn>
  <v-btn class="grey darken-2 d-block"  title="Articles" @click="getByType('articles')">
    <v-icon color="white"> mdi-file-document </v-icon>
    <span class="white--text ml-2"> Articles </span>
  </v-btn>
</v-card>
</template>

<script>
export default {
  name: "sidebar",
  methods: {
    getByType( type ) {
      this.$store.dispatch('posts/loadPosts', type !== 'all' ? { type } : undefined);
      this.$emit('type', type !== 'all' ? { type } : '');
    },
  }
}
</script>

<style lang="scss" scoped>
.div-sidebar {
  position: fixed;
  top: 90px;
  left: 120px;
  bottom: 80px;

  button {
    width: 145px;
    justify-content: left;
  }
}
</style>
