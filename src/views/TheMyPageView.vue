<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Profile from "@/components/myPage/Profile.vue";

const route = useRoute();

</script>

<template>
    <div>
        <Profile />
    </div>
</template>

<style scoped></style>