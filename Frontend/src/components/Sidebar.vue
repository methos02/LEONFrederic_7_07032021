<template>
<v-card id="div-sidebar" :class="{'hideSidebar' : !showSidebar}" class="div-sidebar pa-3 grey lighten-2">
  <div class="sidebar-btn grey lighten-2 py-3 pr-1 pl-3 rounded-r rounded-l-0">
    <button @click="showSidebar = !showSidebar">
      <v-icon class="icon-opened">mdi-chevron-double-right</v-icon>
      <v-icon class="icon-closed">mdi-chevron-double-left</v-icon>
    </button>
  </div>
  <div class="sidebar-type">
    <v-btn class="grey darken-2 d-flex align-center mb-2" title="Tous" to="/">
      <v-icon color="white"> mdi-folder-multiple </v-icon>
      <span class="white--text ml-2"> Tous </span>
    </v-btn>
    <v-btn color="white" class="grey darken-2 d-flex align-center mb-2" title="Images"  to="/images">
      <v-icon color="white"> mdi-file-image </v-icon>
      <span class="white--text ml-2"> Images </span>
    </v-btn>
    <v-btn class="grey darken-2 d-flex align-center"  title="Articles" to="/articles">
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
}
</script>
