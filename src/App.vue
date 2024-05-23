<script setup>
import { RouterView } from "vue-router";
import TheHeadingNavbar from "./components/layout/TheHeadingNavbar.vue";
import ChatBot from "./components/openai/ChatBot.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <div>
    <TheHeadingNavbar></TheHeadingNavbar>
    <RouterView />
    <ChatBot />
    <Footer />
  </div>
</template>

<style scoped></style>
