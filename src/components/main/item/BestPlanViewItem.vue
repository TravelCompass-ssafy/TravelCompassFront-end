<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { localAxios } from "@/util/http-commons.js"

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const router = useRouter();

onMounted(() => {
    getBestTripViewList();
})

const bestTripViewList = ref({});

const getBestTripViewList = () => {
    http.get("/home/plan-view")
        .then((response) => {
            bestTripViewList.value = response.data;
        })
        .catch((error) => {
            console(error);
        })
}
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div v-for="bestTripView in bestTripViewList" :key="bestTripView.tripDetailId" class="col-12 col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <router-link :to="{ name: 'share-detail', params: { tripDetailId: bestTripView.tripDetailId } }" class="text-decoration-none text-dark">
                        <img :src="VITE_VUE_IMG_URL + bestTripView.imagePath" class="card-img-top rounded-top" alt="Trip Image" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">{{ bestTripView.title }}</h5>
                            <p class="card-text text-muted mb-2 small">{{ bestTripView.sidoName }}</p>
                            <div class="d-flex justify-content-between mb-2">
                                <p class="card-text small">{{ bestTripView.startDate }} ~ {{ bestTripView.endDate }}</p>
                                <p class="card-text small">인원수: {{ bestTripView.maxCapacity }}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="card-text mb-0 small">작성자: {{ bestTripView.nickname }}</p>
                                <p class="card-text mb-0 small text-end">조회수: {{ bestTripView.view }}</p>
                            </div>
                            <div class="mt-2">
                                <p class="card-text mb-0 small text-end text-muted">
                                    {{
                                        bestTripView.createdTime < 1 ? '방금 전' :
                                        bestTripView.createdTime < 60 ? bestTripView.createdTime + '분 전' :
                                        bestTripView.createdTime < 1440 ? Math.floor(bestTripView.createdTime / 60) + '시간 전' :
                                        Math.floor(bestTripView.createdTime / 1440) + '일 전'
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
