<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const router = useRouter();

onMounted(() => {
    getSido();
    getTripDetailList();
});

const sidoList = ref([]);

const searchData = ref({
    date: "",
    sidoCode: 0,
    keyword: ""
});

const tripDetailList = ref([]);

const getSido = () => {
    http.get("/attraction/sido")
        .then((response) => {
            sidoList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const getTripDetailList = () => {
    http.get(`/trip/share`, { params: searchData.value })
        .then((response) => {
            tripDetailList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
</script>

<template>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-3 ml-3">
            <div class="d-flex flex-grow-1 justify-content-end align-items-center">
                <div class="me-2">
                    <input type="date" class="form-control" id="date" v-model="searchData.date">
                </div>
                <div class="me-2">
                    <select class="form-select" id="region" v-model="searchData.sidoCode">
                        <option disabled value="0">지역을 선택하세요</option>
                        <option value="0">미선택</option>
                        <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}
                        </option>
                    </select>
                </div>
                <div class="me-2">
                    <input type="text" class="form-control" id="title" v-model="searchData.keyword" required>
                </div>
                <div>
                    <button type="button" class="btn btn-primary" @click="getTripDetailList">검색</button>
                </div>
            </div>
        </div>
        <div class="row">
            <template v-for="tripDetail in tripDetailList" :key="tripDetail.tripDetailId">
                <div class="col-md-4 mb-4">
                    <router-link :to="{ name: 'share-detail', params: { tripDetailId: tripDetail.tripDetailId } }"
                        class="nav-link">
                        <div class="card">
                            <img :src="VITE_VUE_IMG_URL + tripDetail.imagePath" class="card-img-top trip-image"
                                alt="Trip Image">
                            <div class="card-body">
                                <h5 class="card-title">{{ tripDetail.title }}</h5>
                                <p class="card-text">{{ tripDetail.sidoName }}</p>
                                <div class="d-flex justify-content-between">
                                    <p class="card-text">{{ tripDetail.startDate }} ~ {{ tripDetail.endDate }}</p>
                                    <p class="card-text">인원: {{ tripDetail.maxCapacity }}</p>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p class="card-text">작성자: {{ tripDetail.nickname }}</p>
                                    <p class="card-text">View: {{ tripDetail.view }}</p>
                                </div>
                                <p class="card-text text-end">
                                    {{
                                        tripDetail.createTime < 1 ? '방금 전' : tripDetail.createTime < 60 ?
                                            tripDetail.createTime + '분 전' : tripDetail.createTime < 1440 ?
                                                Math.floor(tripDetail.createTime / 60) + '시간 전' :
                                                Math.floor(tripDetail.createTime / 1440) + '일 전' }} </p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.trip-image {
    height: 200px;
    object-fit: cover;
}
</style>