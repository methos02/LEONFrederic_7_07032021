<template>
    <v-container>
      <post-form :type="1"></post-form>
    </v-container>
</template>

<script>
import PostForm from '@/components/PostForm';
export default {
  name: 'AddPostArticle',
  components: { PostForm }
}
</script>
