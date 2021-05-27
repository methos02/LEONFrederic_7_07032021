<template>
  <v-container class="container-form-article">
    <h1 class="text-center white--text">Editer un article </h1>
    <FormArticle v-if="post" :post="post" :errors="errors" @post="onSubmit"></FormArticle>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import FormArticle from "@/components/FormArticle";
import verifParam from "@/helpers/verifParamHelper";

export default {
  name: 'AddPostArticle',
  components: { FormArticle },
  data () {
    return {
      errors: {}
    }
  },
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
  computed : {
    ...mapState({
      current_user: state => state.auth.current_user,
      posts: state => state.posts.posts,
    }),
    post() {
      return this.posts.find(post => post.slug === this.$route.params.slug)
    }
  },
  methods: {
    async onSubmit(formData) {
      const res = await this.$store.dispatch('posts/updateArticle', {id: this.post.id, formData});

      if (res.status === 400) { return this.errors = res.data;}

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été modifié.' })
      await this.$router.push('/');
    }
  },
}
</script>
