<template>
    <v-container>
      <v-tabs>
        <v-tab :to="{name:'Comments'}"> Commentaires </v-tab>
        <v-tab :to="{name:'Users'}"> Utilisateurs </v-tab>
      </v-tabs>
      <router-view></router-view>
    </v-container>
</template>
