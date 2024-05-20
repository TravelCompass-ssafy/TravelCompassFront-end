<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const http = localAxios();
const route = useRoute();
const router = useRouter();

</script>

<template>
    <div>
        qweqwe
    </div>
</template>

<style scoped>

</style>