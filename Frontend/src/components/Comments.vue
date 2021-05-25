<template>
  <div class="container-comments">
    <v-card class="div-textarea mb-2 pa-2" v-show="show.textarea">
      <v-btn class="btn-close grey--text white" @click="hideTextarea" icon text small outlined elevation="4"><v-icon> mdi-close-circle-outline </v-icon></v-btn>
      <v-textarea v-model="commentsTemp" label="Ecrivez un commentaire ..." auto-grow rows="1" hide-details></v-textarea>
      <div class="d-flex justify-end mt-2">
        <v-btn @click="addComment(post.id)"> Envoyer </v-btn>
      </div>
    </v-card>
    <div class="div-comment" v-for="comment in comments" :key="comment.id" v-show="show.comments">
      <div class="mb-2 d-flex">
        <v-avatar class="d-none d-md-inline comment-avatar-md white mr-3">
          <img :src="comment.User.avatarPath" alt="image de profil">
        </v-avatar>
        <v-card class="flex">
          <div class="pa-4 d-flex">
            <v-avatar class="d-flex d-sm-none white mr-3">
              <img :src="comment.User.avatarPath" alt="image de profil">
            </v-avatar>
            <div class="comment-meta flex">
              <span class="font-weight-bold text-body-1 comment-meta-name">{{ comment.User.name }}</span>
              <span class="font-weight-light text-body-2">Posté le {{ comment.formatCreatedAt }}</span>
            </div>
            <div class="d-flex card-actions">
              <v-btn @click="editComment(comment.id, comment.content)" class="mr-1 green white--text btn-edit" fab small><v-icon> mdi-pencil </v-icon> </v-btn>
              <v-btn @click="deleteComment(comment.id, post.id)" class="red white--text" fab small><v-icon> mdi-delete </v-icon> </v-btn>
            </div>
          </div>
          <div class="px-3" v-if="isEdit.find(comment_id => comment_id === comment.id)">
            {{ errors.global }}
            <v-textarea v-model="commentsEdit[comment.id]" :error-messages="errors.content" rows="1" auto-grow hide-details></v-textarea>
            <div class="d-flex justify-end mt-3">
              <v-btn color="error" @click="cancelEditComment(comment.id)">Annuler</v-btn>
              <v-btn @click="updateComment(comment.id, post.id)">Mettre à jour</v-btn>
            </div>
          </div>
          <v-card-text class="px-4 py-0" v-else> {{ comment.content }}</v-card-text>
          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn text @click="toggleAnswersTextarea(comment.id)" small> Répondre </v-btn>
            <v-btn v-if="comment.answers.length !== 0 && !showAnswers[comment.id]" text @click="toggleAnswers(comment.id)" small> Afficher {{ comment.answers.length }} réponse</v-btn>
            <v-btn v-else-if="comment.answers.length !== 0 && showAnswers[comment.id]" text @click="toggleAnswers(comment.id)" small> Cacher les réponses </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-card class="mb-2 ml-15 pa-2" v-show="showAnswersTextarea[comment.id]">
        <v-btn class="btn-close grey--text white" @click="toggleAnswersTextarea(comment.id)" icon text small outlined elevation="4">
          <v-icon> mdi-close-circle-outline </v-icon>
        </v-btn>
        <v-textarea v-model="answersTemp[comment.id]" auto-grow rows="1" label="Répondez au commentaire ... " hide-details></v-textarea>
        <div class="d-flex justify-end mt-2">
          <v-btn @click="addAnswer(post.id, comment.id)" small> Envoyer </v-btn>
        </div>
      </v-card>
      <div v-show="showAnswers[comment.id]" class="div-answer ml-15 mb-2" v-for="answer in comment.answers" :key="answer.id">
        <v-avatar class="white mr-3">
          <img :src="answer.User.avatarPath" alt="image de profil">
        </v-avatar>
        <v-card class="grey lighten-4 answer">
          <div class="px-3 pt-2 comment-meta">
            <span class="font-weight-bold text-body-1 comment-meta-name">{{ answer.User.name }}</span>
            <span class="font-weight-light text-body-2">Posté le {{ answer.formatCreatedAt }}</span>
            <v-btn @click="editComment(answer.id, answer.content)" class="mr-1 green white--text btn-edit" fab small><v-icon> mdi-pencil </v-icon> </v-btn>
            <v-btn @click="deleteComment(answer.id, post.id)" class="red white--text" fab small><v-icon> mdi-delete </v-icon> </v-btn>
          </div>
          <div class="px-3" v-if="isEdit.find(comment_id =>comment_id === answer.id)">
            {{ errors.global }}
            <v-textarea v-model="commentsEdit[answer.id]" :error-messages="errors.content" rows="1" auto-grow hide-details></v-textarea>
            <div class="d-flex justify-end mt-3">
              <v-btn color="error" @click="cancelEditComment(answer.id)">Annuler</v-btn>
              <v-btn @click="updateComment(answer.id, post.id)">Mettre à jour</v-btn>
            </div>
          </div>
          <v-card-text class="px-3 py-2" v-else> {{ answer.content }} </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";
import Vue from "vue";

export default {
  props: ['post', 'show'],
  data () {
    return {
      commentsTemp:"",
      isEdit: [],
      commentsEdit: {},
      answersTemp: {},
      showAnswers: {},
      showAnswersTextarea: {},
      errors : {}
    }
  },
  computed: {
    ...mapState({ current_user: state => state.auth.current_user }),
    comments : {
      get: function () {
        const orderComments = {};

        this.post.Comments.forEach(comment => {
          if(comment.ParentId === null || comment.ParentId === undefined) {
            orderComments[comment.id] = comment;
            orderComments[comment.id].answers = [];
            return;
          }

          orderComments[comment.ParentId].answers.push(comment);
        });

        return Object.values(orderComments);
      }
    }
  },
  methods: {
    toggleAnswers(comment_id) {
      Vue.set(this.showAnswers, comment_id, !this.showAnswers[comment_id]);
    },
    hideTextarea() {
      Vue.set(this.show, 'textarea', false);
    },
    toggleAnswersTextarea(comment_id) {
      Vue.set(this.showAnswersTextarea, comment_id, !this.showAnswersTextarea[comment_id]);
    },
    editComment(comment_id, comment_content) {
      if( this.isEdit.find( id => id === comment_id) === undefined) {
        this.commentsEdit[comment_id] = comment_content
        this.isEdit.push(comment_id);
      }
    },
    cancelEditComment(comment_id) {
      delete this.commentsEdit[comment_id];
      this.isEdit = this.isEdit.filter( id => id !== comment_id);
    },
    async addComment(post_id) {
      const res = await this.$store.dispatch('posts/createComment', { UserId: this.current_user.id, PostId: post_id, content: this.commentsTemp })

      if(res.status === 201) {
        this.commentsTemp = "";
        Vue.set(this.show, 'comments', true);
        this.hideTextarea()
      }
    },
    async updateComment(comment_id, post_id) {
      const res = await this.$store.dispatch('posts/updateComment', { comment_id, content: this.commentsEdit[comment_id], post_id})

      if(res.status === 200) {
        this.cancelEditComment(comment_id);
        await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.message });
      }
    },
    async deleteComment(comment_id, post_id) {
      const res = await this.$store.dispatch('posts/deleteComment', { comment_id, post_id })

      if (res.status === 200) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.message }); }
      if (res.status === 404) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error,  type: 'error' }); }
    },
    async addAnswer(post_id, comment_id) {
      const res = await this.$store.dispatch('posts/createComment', { UserId: this.current_user.id, PostId: post_id, ParentId: comment_id, content: this.answersTemp[comment_id] })

      if(res.status === 201) {
        this.answersTemp[comment_id] = '';
        Vue.set(this.showAnswers, comment_id, true);
        Vue.set(this.showAnswersTextarea, comment_id, false);
      }
    }
  },
}
</script>
