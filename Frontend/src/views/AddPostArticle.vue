<template>
  <v-container>
    <h1>Ajouter un article </h1>
    <FormArticle :post="post" :errors="errors" @post="addPost"></FormArticle>
  </v-container>
</template>

<script>
import dispachError from "@/helpers/sequelizeError";
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
    async addPost(formData) {
      const resp = await this.$store.dispatch('posts/createPost', formData);

      if (resp.status === 400) { return this.errors = dispachError(resp.data);}
      if (resp.status === 401) { return this.errors.general = resp.data.error; }

      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été posté' })
      await this.$router.push('/');
    },
  },
}
</script>
