<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const http = localAxios();
const route = useRoute();
const router = useRouter();

onMounted(() => {
    getTripDetail();
})

const tripDetail = ref({});

const getTripDetail = () => {
    http.get(`/trip/${route.params.tripDetailId}`)
        .then((response) => {
            tripDetail.value = response.data;
            console.log(tripDetail.value);
        })
        .catch((error) => {
            console.log(error);
        });
}

</script>

<template>
    <div>
        
    </div>
</template>

<style scoped>

</style>