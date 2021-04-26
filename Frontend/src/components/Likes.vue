<template>
  <div class="d-flex justify-end">
    <v-btn id="div-like" @click="like(post.id)" class="mr-2">
      <v-icon :class="{'blue--text' : userLike.like === 1, 'grey--text' : userLike.like === 0 || userLike.like === -1 }" color="darken-2">
        mdi-thumb-up
      </v-icon>
      <span> {{ post.likes }}</span>
    </v-btn>
    <v-btn id="div-dislike" @click="dislike(post.id)" class="mr-2">
      <v-icon :class="{'red--text' : userLike.like === -1, 'grey--text' : userLike.like === 0 || userLike.like === 1}" color="darken-2">
        mdi-thumb-down
      </v-icon>
      <span> {{ post.dislikes }}</span>
    </v-btn>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  props: ['post'],
  methods: {
    like(post_id) {
      if(this.userLike.like !== 1) {
        this.$store.dispatch('posts/likePost', {post_id: post_id, like : 1});
      }
    },
    dislike(post_id) {
      if(this.userLike.like !== -1) {
        this.$store.dispatch('posts/likePost', {post_id: post_id, like : -1});
      }
    }
  },
  computed: {
    ...mapState(['current_user']),
    userLike() {
      if(this.current_user.likes === undefined) {
        return { like : 0 }
      }

      const like = this.current_user.likes.find(like => like.PostId === this.post.id);
      return like !== undefined ?  like : { like : 0  };
    }
  }
}
</script>
