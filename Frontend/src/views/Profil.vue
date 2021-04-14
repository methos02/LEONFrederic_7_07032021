<template>
  <v-container>
    <v-card class="pa-3">
      <v-tabs>
        <v-tab :to="{name:'Infos'}"> Informations </v-tab>
        <v-tab :to="{name:'Security'}"> Sécurité </v-tab>
      </v-tabs>
      <router-view></router-view>
    </v-card>
  </v-container>
</template>
