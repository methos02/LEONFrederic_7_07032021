<template>
  <div>
    <div class="d-flex justify-space-between pa-3 div-image-meta">
      <div class="d-flex post-meta">
        <router-link :to="'/user/' + post.User.slug">
          <v-avatar class="post-meta-avatar white mr-3">
            <img :src="post.User.avatarPath" alt="image de profil">
          </v-avatar>
        </router-link>
        <div class="post-meta-infos">
          <router-link :to="'/user/' + post.User.slug">
            <div class="image-meta-author">{{ post.User.name }}</div>
          </router-link>
          <div class="image-meta-create">{{ post.formatCreatedAt }}</div>
        </div>
      </div>
      <div class="d-flex card-actions" v-if="has_action">
        <v-btn @click="editContent(post.id)" class="mr-1 green white--text btn-edit" v-if="isEdit === false" fab small><v-icon> mdi-pencil </v-icon></v-btn>
        <v-btn @click="isEdit = false" class="mr-1 btn-edit" v-if="isEdit === true" fab small><v-icon> mdi-close </v-icon></v-btn>
        <v-btn @click="$emit('delete', { post_id : post.id, type : 'image'})" class="red white--text" fab small> <v-icon> mdi-delete </v-icon> </v-btn>
      </div>
    </div>
    <div class="post-image-body">
      <v-card-text class="div-image-description white pt-1">
        <div v-if="isEdit">
          <v-alert v-if="errors.type" color="red" type="error" class="mx-5 mb-3" text>
            <p class="mb-0">{{ errors.type }}</p>
          </v-alert>
          <v-textarea v-model="datas.content" :id="'editArticle' + post.id" :error-messages="errors.content" rows="1" auto-grow hide-details></v-textarea>
          <div class="d-flex justify-end mt-3"> <v-btn @click="updateImage(post.id)">Mettre à jour</v-btn> </div>
        </div>
        <div v-else>
          {{ post.content }}
        </div>
      </v-card-text>
    </div>
    <img v-if="post.imagePath" :src="post.imagePath" alt="illustration du post" class="preview pa-2">
  </div>
</template>

<script>
export default {
  name: "PostImage",
  props: ['post', 'has_action'],

  data () {
    return {
      isEdit : false,
      errors: {},
    }
  },
  computed: {
    datas() {
      return {content : this.post.content};
    }
  },
  methods: {
    editContent() {
      this.isEdit = true;
      setTimeout(() => document.getElementById('editArticle' + this.post.id).focus(), 1);
    },
    async updateImage() {
      const res = await this.$store.dispatch('posts/updateImage', {id: this.post.id, content : this.datas.content });

      if (res.status === 400) { return this.errors = res.data;}
      if ( res.status === 200) {
        await this.$store.dispatch('snackbar/setSnackbar', { text: 'Votre entête a été modifié.' });
        this.isEdit = false;
      }
    }
  }
}
</script>
