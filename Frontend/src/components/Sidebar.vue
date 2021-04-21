<template>
<v-card id="div-sidebar" :class="{'hideSidebar' : !showSidebar}" class="div-sidebar pa-3 grey lighten-2">
  <div class="sidebar-btn grey lighten-2 py-3 pr-1 pl-3 rounded-r rounded-l-0">
    <button @click="showSidebar = !showSidebar">
      <v-icon>mdi-chevron-double-right</v-icon>
    </button>
  </div>
  <div class="sidebar-type">
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
  </div>
</v-card>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return { showSidebar : false }
  },
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
  z-index: 10;

  @media (max-width: 599px) {
    left: -10px;
  }

  .sidebar-type button {
    width: 145px;
    justify-content: left;
  }

  .sidebar-btn {
    position: absolute;
    top: 0;
    right: -30px;

    @media (min-width: 600px) { display: none; }
  }

  &.hideSidebar {
    @media (max-width: 599px) {
      left: -170px;
    }
  }
}
</style>
