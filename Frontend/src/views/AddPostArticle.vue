<template>
  <v-container>
      <FormArticle :post="post" :errors="errors" @post="addPost"></FormArticle>
  </v-container>
</template>

<script>
import dispachError from "@/utils/sequelizeError";
import FormArticle from "@/components/FormArticle";

export default {
  name: 'AddPostArticle',
  components: { FormArticle },
  data () {
    return {
      errors: {},
      post: {}
    }
  },
  methods: {
    async addPost(post) {
      const fd = new FormData();
      fd.append('post[title]', post.title);
      fd.append('post[content]', post.content);
      fd.append('post[type]', 1);

      const resp = await this.$store.dispatch('posts/createPost', fd);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.errors.general = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été posté' })
      await this.$router.push('/');
    },
  },
}
</script>
