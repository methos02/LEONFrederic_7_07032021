<template>
  <div class="text-center div-paginate" v-if="last_page !== undefined && last_page !== 1">
    <v-pagination v-model="current_page" :length="last_page" total-visible="7" ></v-pagination>
  </div>
</template>
<script>
export default {
  name: "Paginate",
  props: ['model'],
  computed: {
    current_page: {
      get() {
        return this.$store.state.paginate[this.model].current_page;
      },
      set(value) {
        this.$store.dispatch('paginate/setCurrentPage', { model: this.model, current_page: value});
      }
    },
    last_page: {
      get() {
        return this.$store.state.paginate[this.model].last_page;
      }
    }
  },
  watch: {
    current_page(newValue, oldValue) {
      if(oldValue !== undefined) {
        this.$emit('currentPageChange', newValue);
      }
    }
  }
}
</script>
