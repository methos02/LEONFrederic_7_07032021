<template>
  <v-container class="container-form-article">
    <h1 class="text-center white--text">Ajouter un article </h1>
    <FormArticle :post="post" :errors="errors" @post="addPost"></FormArticle>
  </v-container>
</template>

<script>
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
      const res = await this.$store.dispatch('posts/createPost', formData);

      if (res.status === 400) { return this.errors = res.data;}
      if (res.status === 401) { return this.errors.general = res.data.error; }
      if (res.status === 500) { await this.$store.dispatch('snackbar/setSnackbar', { text: res.data.error,  type: 'error' }); }


      await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre article a été posté' })
      await this.$router.push('/');
    },
  },
}
</script>
