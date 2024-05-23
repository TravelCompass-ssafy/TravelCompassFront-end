<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { localAxios } from "@/util/http-commons.js"
import { userStore } from '@/stores/userStore.js'

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const router = useRouter();
const store = userStore();

onMounted(() => {
    getMyTripList();
})

const myTripList = ref([])

const getMyTripList = () => {
    http.get(`/mypage/trip/${store.userInfo.userId}`)
        .then((response) => {
            myTripList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
</script>

<template>
    <div class="container mt-5">
        <div class="row">
        <div v-for="myTrip in myTripList" :key="myTrip.tripDetailId" class="col-12 col-sm-6 col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
            <router-link :to="{ name: 'share-detail', params: { tripDetailId: myTrip.tripDetailId } }" class="text-decoration-none">
                <img :src="VITE_VUE_IMG_URL + myTrip.imagePath" class="card-img-top rounded-top" alt="Trip Image" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                <h5 class="card-title text-dark">{{ myTrip.title }}</h5>
                </div>
            </router-link>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border: none;
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
}

.card-title {
    font-size: 1.1rem;
    font-weight: bold;
}

.card-body {
    padding: 0.5rem;
}
</style>
