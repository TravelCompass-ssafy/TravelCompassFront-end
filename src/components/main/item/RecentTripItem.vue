<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { localAxios } from "@/util/http-commons.js"

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const router = useRouter();

onMounted(() => {
    getRecentTripList();
})

const recentTripList = ref({});

const getRecentTripList = () => {
    http.get("/home/trip-recent")
        .then((response) => {
            recentTripList.value = response.data;
            console.log(recentTripList.value);
        })
        .catch((error) => {
            console(error);
        })
}
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div v-for="recentTrip in recentTripList" :key="recentTrip.tripDetailId" class="col-12 col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <router-link :to="{ name: 'trip-detail', params: { tripDetailId: recentTrip.tripDetailId } }" class="text-decoration-none text-dark">
                        <img :src="VITE_VUE_IMG_URL + '/' + recentTrip.imagePath" class="card-img-top rounded-top" alt="Trip Image" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">{{ recentTrip.title }}</h5>
                            <p class="card-text text-muted mb-2 small">{{ recentTrip.sidoName }}</p>
                            <div class="d-flex justify-content-between mb-2">
                                <p class="card-text small">{{ recentTrip.startDate }} ~ {{ recentTrip.endDate }}</p>
                                <p class="card-text small">인원수: {{ recentTrip.maxCapacity }}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="card-text mb-0 small">작성자: {{ recentTrip.nickname }}</p>
                                <p class="card-text mb-0 small text-end">조회수: {{ recentTrip.view }}</p>
                            </div>
                            <div class="mt-2">
                                <p class="card-text mb-0 small text-end text-muted">
                                    {{
                                        recentTrip.createdTime < 1 ? '방금 전' :
                                        recentTrip.createdTime < 60 ? recentTrip.createdTime + '분 전' :
                                        recentTrip.createdTime < 1440 ? Math.floor(recentTrip.createdTime / 60) + '시간 전' :
                                        Math.floor(recentTrip.createdTime / 1440) + '일 전'
                                    }}
                                </p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-title {
    font-weight: bold;
}
.card-text {
    margin-bottom: 0.25rem;
}
.card-body {
    padding: 0.75rem;
}
.small {
    font-size: 0.875rem;
}
</style>
