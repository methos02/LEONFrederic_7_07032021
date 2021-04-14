<template>
  <v-container>
    <v-card class="mb-2 pa-2 card-size">
      <v-textarea v-model="commentsTemp" auto-grow rows="1" hide-details></v-textarea>
      <div class="d-flex justify-end mt-2">
        <v-btn @click="addComment(post_id)"> Envoyer </v-btn>
      </div>
    </v-card>
    <div v-for="comment in orderComments(post_id)" :key="comment.id" class="card-size">
      <v-card class="mb-2 ">
        <v-card-text> {{ comment.content }}</v-card-text>
        <v-card-actions>
          <v-btn v-if="comment.answers.length !== 0 && !comment.showAnswers" text @click="toggleAnswers(post_id, comment.id)"> Afficher {{ comment.answers.length }} réponse</v-btn>
          <v-btn v-else-if="comment.answers.length !== 0 && comment.showAnswers" text @click="toggleAnswers(post_id, comment.id)"> Cacher les réponses </v-btn>
          <v-btn v-if="!comment.showTextarea" text @click="toggleTextarea(post_id,comment.id)"> Répondre </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mb-2 pa-2 card-size" v-show="comment.showTextarea">
        <v-btn text @click="toggleTextarea(post_id,comment.id)"> x </v-btn>
        <v-textarea v-model="answersTemp[comment.id]" auto-grow rows="1" hide-details></v-textarea>
        <div class="d-flex justify-end mt-2">
          <v-btn @click="addAnswer(post_id, comment.id)"> Envoyer </v-btn>
        </div>
      </v-card>
      <div v-show="comment.showAnswers" class="card-size">
        <v-container v-for="answer in comment.answers" :key="answer.id">
          <v-card-text class="grey lighten-4"> {{ answer.content }} </v-card-text>
        </v-container>
      </div>
    </div>
  </v-container>
</template>
<script>
import {mapGetters, mapState} from "vuex";

export default {
  props: ['post_id'],
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
    toggleTextarea(post_id, comment_id) {
      this.$store.dispatch('comments/toggleTextarea', {post_id, comment_id});
    },
    async addComment(post_id) {
      const res = await this.$store.dispatch('comments/create', { UserId: this.current_user.id, PostId: post_id, content: this.commentsTemp })

      if(res.status === 201) {
        this.commentsTemp = '';
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
