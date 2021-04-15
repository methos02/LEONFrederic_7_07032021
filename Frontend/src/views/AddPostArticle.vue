<template>
  <v-container>
    <v-card>
      <form class="my-3 pa-4">
        {{ errors.general }}
        <div class="row">
          <div class="col align-center" v-if="post">
            <v-text-field v-model="post.title" label="Titre" :error-messages="errors.title" />
            <v-textarea v-model="post.content" auto-grow label="Contenu" :error-messages="errors.content" />
          </div>
        </div>
        <div class="text-center">
          <v-btn class="mx-3" @click="addPost"> Ajouter </v-btn>
        </div>
      </form>
    </v-card>
  </v-container>
</template>

<script>
import dispachError from "@/utils/sequelizeError";
export default {
  name: 'AddPostArticle',
  data () {
    return {
      errors: {},
      post: {}
    }
  },
  methods: {
    async addPost() {
      const fd = new FormData();
      fd.append('post[title]', this.post.title);
      fd.append('post[content]', this.post.content);
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
