<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/userStore.js"
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const http = localAxios();
const router = useRouter();
const store = userStore();

onMounted(() => {
    getProceedTrip();
})

const proceedTrip = ref({})

const getProceedTrip = () => {
    http.get(`/trip/proceed/${store.userInfo.userId}`)
        .then((response) => {
            proceedTrip.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title">{{ proceedTrip.title }}</h3>
                        <div class="mb-3">
                            <div class="d-flex flex-column align-items-start">
                                <div class="mt-2">{{ proceedTrip.nickname }}</div>
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">여행 일정</h5>
                            <p class="card-text">{{ proceedTrip.startDate }} ~ {{ proceedTrip.endDate }}</p>
                            <p class="card-text">{{ proceedTrip.sidoName }}</p>
                        </div>
                        <hr>
                        <h5 class="card-subtitle mb-2">여행계획</h5>
                        <template v-for="(tripPlan, tripPlanIndex) in proceedTrip.tripPlanAttractionList"
                            :key="tripPlanIndex">
                            <template v-if="tripPlan.length > 0">
                                <div class="font-weight-bold mt-3">{{ tripPlan[0].tripDate }}</div>
                                <div v-for="plan in tripPlan" :key="plan.contentId" class="ml-3 mb-2">
                                    <span class="badge badge-secondary text-dark" style="font-size: 1em;">{{
                                        plan.title }}</span>
                                    <router-link
                                        :to="{ name: 'regist', params: { tripDetailId: proceedTrip.tripDetailId, contentId: plan.contentId, title: plan.title } }"
                                        class="ml-2">
                                        리뷰쓰기
                                    </router-link>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>