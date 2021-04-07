<template>
  <v-container>
    <h1>Ajout d'image</h1>
    <post-form :type="2"></post-form>
  </v-container>
</template>

<script>
import PostForm from '@/components/PostForm';
export default {
  name: 'AddPostArticle',
  components: { PostForm }
}
</script>
