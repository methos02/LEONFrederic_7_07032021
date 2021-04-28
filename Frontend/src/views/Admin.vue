<template>
    <v-container class="container-admin-header">
      <v-card class="pa-3">
        <v-tabs>
          <v-tab :to="{name:'Comments'}"> Commentaires </v-tab>
          <v-tab :to="{name:'Users'}"> Utilisateurs </v-tab>
        </v-tabs>
        <router-view></router-view>
      </v-card>
    </v-container>
</template>
