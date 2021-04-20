<template>
  <v-dialog v-model="dialog" width="600px">
    <v-card>
      <v-card-title><slot></slot></v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" text @click="confirm"> Oui </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="dialog = false"> Non </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialog : false,
    }
  },
  created: function() {
    this.$parent.$on('openConfirm', this.openConfirm);
  },
  methods: {
    openConfirm() {
      this.dialog = true;
    },
    confirm() {
      this.$emit('confirm', true);
      this.dialog = false;
    }
  }
}
</script>
