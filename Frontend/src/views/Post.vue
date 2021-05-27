<template>
  <v-container class="container-post div-post" v-if="post">
    <v-card class="card-post mx-auto">
      <div class="d-flex justify-space-between pa-3 div-image-meta">
        <div class="d-flex post-meta">
          <router-link :to="'/user/' + post.User.slug">
            <v-avatar class="post-meta-avatar white mr-3">
              <img :src="post.User.avatarPath" alt="image de profil">
            </v-avatar>
          </router-link>
          <div class="post-meta-infos">
            <router-link :to="'/user/' + post.User.slug">
              <div class="post-meta-author">{{ post.User.name }}</div>
            </router-link>
            <div class="post-meta-create">{{ post.formatCreatedAt }}</div>
          </div>
        </div>
        <div class="d-flex card-actions" v-if="current_user.id === post.UserId || current_user.roles.find( role => role === 'modo')">
          <v-btn :to="{ name: 'UpdateArticle', params: { id : post.id } }" class="mr-1 green white--text btn-edit" fab small><v-icon> mdi-pencil </v-icon> </v-btn>
          <v-btn @click="$emit('delete', { post_id : post.id, type : 'article' })" class="red white--text" fab small><v-icon> mdi-delete </v-icon> </v-btn>
        </div>
      </div>
      <div class="text-center">
        <img v-if="post.imagePath" :src="post.imagePath" class="article-header" alt="illustration du post" />
      </div>
      <div class="px-3">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="py-4">{{ post.content }}</div>
      </div>
      <div class="d-flex justify-space-between align-center px-3 pb-3 flex-wrap flex-md-nowrap">
      <v-btn @click="showTextarea"> Répondre </v-btn>
      <div v-if="post.Comments.length !== 0" class="order-2 order-md-1 btn-show-comments flex text-center">
        <v-btn v-if="!show.comments" @click="toggleComments" text> Afficher les commentaires </v-btn>
        <v-btn v-else @click="toggleComments" text> Cacher les commentaires </v-btn>
      </div>
      <likes :post="post" class="order-1 order-md-2"/>
    </div>
    </v-card>
    <comments :post="post" :show.sync="show"/>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import comments from "@/components/Comments";
import likes from "@/components/Likes";
import verifParam from "@/helpers/verifParamHelper";

export default {
  name: 'Post',
  components: { comments, likes },
  async mounted() {
    if( !verifParam('slug', this.$route.params.slug) ) {
      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Le paramètre est invalide.', type: 'error' });
      await this.$router.push('/');
      return;
    }

    if(this.posts.find(post => post.slug === this.$route.params.slug) === undefined) {
      const res = await this.$store.dispatch('posts/loadPost', this.$route.params.slug);

      if(res.status === 404) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error, type: 'error' });
        await this.$router.push('/');
      }
    }
  },
  data() {
    return {
      show : { comments : false, textarea : false }
    }
  },
  computed: {
    ...mapState({
      current_user: state => state.auth.current_user,
      posts: state => state.posts.posts,
    }),
    post() {
      return this.posts.find(post => post.slug === this.$route.params.slug )
    },
  },
  methods: {
    toggleComments() {
      this.show.comments = !this.show.comments;
    },
    showTextarea() {
      this.show.textarea = true;
    },
  }
}
</script>
