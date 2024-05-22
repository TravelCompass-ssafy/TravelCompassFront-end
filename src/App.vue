<script setup>
import { RouterView } from "vue-router";
import TheHeadingNavbar from "./components/layout/TheHeadingNavbar.vue";
import ChatBot from "./components/openai/ChatBot.vue";
</script>

<template>
  <div>
    <TheHeadingNavbar></TheHeadingNavbar>
    <RouterView />
    <ChatBot />
  </div>
</template>

<style scoped></style>
