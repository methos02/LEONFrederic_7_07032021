<template>
  <v-container>
    <FormArticle :post="post" :errors="errors" @post="onSubmit"></FormArticle>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import FormArticle from "@/components/FormArticle";
import dispachError from "@/utils/sequelizeError";

export default {
  name: 'AddPostArticle',
  components: { FormArticle },
  data () {
    return {
      errors: {}
    }
  },
  async beforeCreate() {
    await this.$store.dispatch('posts/loadPost', parseInt(this.$route.params.id));
  },
  computed : {
    ...mapState({
      current_user: 'current_user',
      posts: state => state.posts.posts,
    }),
    post() {
      return this.posts.find(post => post.id === parseInt(this.$route.params.id) )
    }
  },
  methods: {
    async onSubmit(post) {
      const res = await this.$store.dispatch('posts/updateArticle', post);
      if (res.status === 400) { return this.errors = dispachError(res.data);}
      if (res.status === 401) { return this.errors.global = res.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été modifié.' })
      await this.$router.push('/');
    }
  },
}
</script>
