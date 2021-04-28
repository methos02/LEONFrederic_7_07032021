<template>
  <div class="container-comments">
    <v-card class="mb-2 pa-2 card-size relative" v-show="post.showTextarea">
      <v-btn class="btn-close grey--text white" @click="toggleTextarea(post.id)" icon text small outlined elevation="4"><v-icon> mdi-close-circle-outline </v-icon></v-btn>
      <v-textarea v-model="commentsTemp" label="Ecrivez un commentaire ..." auto-grow rows="1" hide-details></v-textarea>
      <div class="d-flex justify-end mt-2">
        <v-btn @click="addComment(post.id)"> Envoyer </v-btn>
      </div>
    </v-card>
    <div class="div-comment" v-for="comment in orderComments(post.id)" :key="comment.id" v-show="post.showComment">
      <div class="mb-2 d-flex">
        <v-avatar class="d-none d-md-inline comment-avatar-md white mr-3">
          <img :src="comment.User.avatarPath" alt="image de profil">
        </v-avatar>
        <v-card class="flex">
          <div class="pa-4 d-flex">
            <v-avatar class="d-flex d-sm-none white mr-3">
              <img :src="comment.User.avatarPath" alt="image de profil">
            </v-avatar>
            <div class="comment-meta">
              <span class="font-weight-bold text-body-1 comment-meta-name">{{ comment.User.name }}</span>
              <span class="font-weight-light text-body-2">Posté le {{ comment.formatCreatedAt }}</span>
            </div>
          </div>
          <v-card-text class="px-4 py-0"> {{ comment.content }}</v-card-text>
          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn text @click="toggleAnswersTextarea(post.id, comment.id, true)" small> Répondre </v-btn>
            <v-btn v-if="comment.answers.length !== 0 && !comment.showAnswers" text @click="toggleAnswers(post.id, comment.id)" small> Afficher {{ comment.answers.length }} réponse</v-btn>
            <v-btn v-else-if="comment.answers.length !== 0 && comment.showAnswers" text @click="toggleAnswers(post.id, comment.id)" small> Cacher les réponses </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-card class="mb-2 ml-15 pa-2 relative" v-show="comment.showTextarea">
        <v-btn class="btn-close grey--text white" @click="toggleAnswersTextarea(post.id,comment.id)" icon text small outlined elevation="4"><v-icon> mdi-close-circle-outline </v-icon></v-btn>
        <v-textarea v-model="answersTemp[comment.id]" auto-grow rows="1" label="Répondez au commentaire ... " hide-details></v-textarea>
        <div class="d-flex justify-end mt-2">
          <v-btn @click="addAnswer(post.id, comment.id)" small> Envoyer </v-btn>
        </div>
      </v-card>
      <div v-show="comment.showAnswers" class="div-answer ml-15 mb-2" v-for="answer in comment.answers" :key="answer.id">
          <v-avatar class="white mr-3">
            <img :src="answer.User.avatarPath" alt="image de profil">
          </v-avatar>
          <v-card class="grey lighten-4 answer">
            <div class="px-3 pt-2 comment-meta">
              <span class="font-weight-bold text-body-1 comment-meta-name">{{ answer.User.name }}</span>
              <span class="font-weight-light text-body-2">Posté le {{ answer.formatCreatedAt }}</span>
            </div>
            <v-card-text class="px-3 py-2"> {{ answer.content }} </v-card-text>
          </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";

export default {
  props: ['post'],
  data () {
    return {
      commentsTemp:"",
      answersTemp: {}
    }
  },
  computed: {
    ...mapState(['comments', 'current_user']),
    ...mapGetters({orderComments :'comments/orderComments'})
  },
  methods: {
    toggleAnswers(post_id, comment_id) {
      this.$store.dispatch('comments/toggleAnswers', {post_id, comment_id});
    },
    toggleTextarea(post_id) {
      this.$store.dispatch('posts/toggleTextarea', {post_id});
    },
    toggleAnswersTextarea(post_id, comment_id, state) {
      this.$store.dispatch('comments/toggleTextarea', {post_id, comment_id, state});
    },
    async addComment(post_id) {
      const res = await this.$store.dispatch('comments/create', { UserId: this.current_user.id, PostId: post_id, content: this.commentsTemp })

      if(res.status === 201) {
        this.commentsTemp = '';
        await this.$store.dispatch('posts/toggleComments', {post_id, state : true});
      }
    },
    async addAnswer(post_id, comment_id) {
      const res = await this.$store.dispatch('comments/create', { UserId: this.current_user.id, PostId: post_id, ParentId: comment_id, content: this.answersTemp[comment_id] })

      if(res.status === 201) {
        this.answersTemp[comment_id] = '';
      }
    }
  }
}
</script>
