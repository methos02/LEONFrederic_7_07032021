<template>
  <v-container>
    <v-card v-for="comment in comments" :key="comment.id" class="mb-2 ">
      <v-card-text >{{ comment.content }}</v-card-text>
      <v-btn color="red" @click="deleteComment(comment.id)"> Supprimer </v-btn>
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
