<template>
  <v-container>
    <h1 class="mb-5"> Commentaires</h1>
    <v-card v-for="comment in comments" :key="comment.id" class="mb-5">
      <v-card-text  class="row">
        <span class="flex col">
          {{ comment.content }}
        </span>
        <v-btn color="red" @click="deleteComment(comment.id)"> Supprimer </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('admin/loadComments');
  },
  computed: {
    ...mapState({comments: state => state.admin.comments,})
  },
  methods: {
    async deleteComment(comment_id) {
      const res = await this.$store.dispatch('admin/removeComment', comment_id)

      if(res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Le commentaire a bien été supprimé.' })
      }
    }
  }
}
</script>
