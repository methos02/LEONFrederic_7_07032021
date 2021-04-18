<template>
  <v-card>
    <form class="my-3" v-if="post">
      {{ errors.global }}
      <div class="row">
        <div class="col align-center">
          <v-text-field v-model="post.title" label="Titre" :error-messages="errors.title" />
          <v-textarea v-model="post.content" label="Contenu" :error-messages="errors.content" />
        </div>
      </div>
      <div class="text-center">
        <v-btn class="mx-3" v-if="post.id === undefined" @click="postUpdate()"> Ajouter </v-btn>
        <v-btn class="mx-3" v-else  @click="postUpdate()"> Mettre à jour </v-btn>
      </div>
    </form>
  </v-card>
</template>
<script>
export default {
  props: ['post', 'errors'],
  methods: {
    postUpdate() {
      this.$emit('post', this.post);
    }
  }
}
</script>
