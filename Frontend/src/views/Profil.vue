<template>
  <v-container>
    <template>
      <v-tabs>
        <v-tab :to="{name:'Infos'}"> Informations </v-tab>
        <v-tab :to="{name:'Security'}"> Sécurité </v-tab>
      </v-tabs>
      <router-view></router-view>
    </template>
  </v-container>
</template>
