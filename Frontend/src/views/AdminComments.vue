<template>
  <v-container>
    <h1 class="mb-5"> Commentaires</h1>
    <v-card v-for="comment in comments" :key="comment.id" class="mb-5">
      <v-card-text  class="row">
        <span class="flex col">
          {{ comment.content }}
        </span>
        <v-btn color="red" @click="$emit('openConfirm', true); comment_id = comment.id;"> Supprimer </v-btn>
      </v-card-text>
    </v-card>
    <paginate model="comments" @currentPageChange="onCurrentPageChange"/>
    <confirm-action @confirm="deleteComment"> Êtes vous sûr de vouloir supprimer ce commentaire ? </confirm-action>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import paginate from '@/components/Paginate';
import confirmAction from "../components/confirmAction";

export default {
  name: 'AdminComments',
  components: { paginate, confirmAction },
  mounted() {
    this.$store.dispatch('admin/loadComments');
  },
  data() {
    return { comment_id: '' }
  },
  computed: {
    ...mapState({comments: state => state.admin.comments,})
  },
  methods: {
    onCurrentPageChange(page) {
      this.$store.dispatch('admin/loadComments', page );
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
