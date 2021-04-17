<template>
  <v-container>
    <h1 class="mb-5"> Commentaires</h1>
    <v-card v-for="comment in comments" :key="comment.id" class="mb-5">
      <v-card-text  class="row">
        <span class="flex col">
          {{ comment.content }}
        </span>
        <v-btn color="red" @click="openConfirm(comment.id)"> Supprimer </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title> Êtes vous sûr de vouloir supprimer ce commentaire ? </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" text  @click="deleteComment"> Oui </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false"> Non </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('admin/loadComments');
  },
  data() {
    return {
      dialog: false,
      comment_id: ''
    }
  },
  computed: {
    ...mapState({comments: state => state.admin.comments,})
  },
  methods: {
    openConfirm(comment_id) {
      this.comment_id = comment_id
      this.dialog = true;
    },
    async deleteComment() {
      const res = await this.$store.dispatch('admin/removeComment', this.comment_id)

      if(res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Le commentaire a bien été supprimé.' });
        this.comment_id = ''
        this.dialog = false;
      }
    }
  }
}
</script>
