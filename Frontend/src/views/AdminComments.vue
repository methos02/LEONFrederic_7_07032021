<template>
  <v-container>
    <h1 class="mb-5">Commentaires</h1>
    <div v-for="comment in comments" :key="comment.id"  class="mb-5 d-flex">
      <v-avatar class="comment-meta-avatar white mr-3">
        <img :src="comment.User.avatarPath" alt="image de profil">
      </v-avatar>
      <v-card class="flex d-flex align-center">
        <div class="py-4 px-8 flex">
          <v-card-text class="pa-0 pb-2">
            <span class="font-weight-light text-body-2"> {{ comment.ParentId === null ? 'Commentaire' : 'Réponse' }} - </span>
            <span class="font-weight-bold text-body-1">{{ comment.User.name }}</span>
            <span class="font-weight-light text-body-2"> - Posté le {{ comment.formatCreatedAt }}</span>
          </v-card-text>
          <v-card-text class="pa-0">{{ comment.content }}</v-card-text>
        </div>
        <v-card-actions>
          <v-btn color="red" @click="$emit('openConfirm', true); comment_id = comment.id;"> Supprimer </v-btn>          </v-card-actions>
      </v-card>
    </div>
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
        await this.$store.dispatch('admin/loadComments');
        this.comment_id = ''
        this.dialog = false;
      }
    }
  }
}
</script>
